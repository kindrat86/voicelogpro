-- Add attribution column for "How did you hear about us?" (AEO measurement).
-- Nullable with a default so it never affects existing inserts or the
-- email-validation trigger. The client sends 'not_specified' when the user
-- skips the (optional) dropdown; until this migration is applied to the live
-- DB, the client retries the insert without this column (PGRST204 fallback).
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS heard_from TEXT NOT NULL DEFAULT 'not_specified';
