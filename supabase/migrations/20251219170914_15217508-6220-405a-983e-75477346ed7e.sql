-- Fix PUBLIC_DATA_EXPOSURE: Remove public read access from blog_schedule
-- This table contains competitive business intelligence that should not be exposed

DROP POLICY IF EXISTS "Blog schedule is read-only for public" ON public.blog_schedule;

-- Create a new policy that blocks all public SELECT access
-- Only service role (used by edge functions) can read this table
CREATE POLICY "No public reads from blog_schedule" 
ON public.blog_schedule 
FOR SELECT 
USING (false);