-- Drop and recreate to ensure clean state
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;

-- Create permissive INSERT policy for public access
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT
TO public
WITH CHECK (true);