-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;

-- Create a permissive INSERT policy
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);