-- Durable, shared rate limiting for public edge functions (generate-daily-log).
-- The previous limiter was an in-memory Map keyed on the client-controlled
-- X-Forwarded-For header: reset on every cold start, not shared across
-- instances, and trivially bypassed by spoofing XFF. This table + atomic
-- increment function give all instances one shared counter store.
-- Only the service role may touch it (RLS enabled, no policies, grants revoked).

create table if not exists public.edge_rate_limits (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (key, window_start)
);

alter table public.edge_rate_limits enable row level security;
-- Intentionally no policies: the service role bypasses RLS; anon/authenticated
-- get no access at all.

revoke all on table public.edge_rate_limits from public, anon, authenticated;

-- Atomically increment the counter for the current fixed window and return the
-- new count. Callers compare the return value against their max.
create or replace function public.edge_rate_increment(
  p_key text,
  p_window_seconds integer
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );
  v_count integer;
begin
  insert into public.edge_rate_limits as r (key, window_start, count)
  values (p_key, v_window, 1)
  on conflict (key, window_start)
  do update set count = r.count + 1
  returning r.count into v_count;

  -- Opportunistic cleanup so the table stays tiny.
  delete from public.edge_rate_limits
  where window_start < now() - interval '2 days';

  return v_count;
end;
$$;

revoke all on function public.edge_rate_increment(text, integer)
  from public, anon, authenticated;
