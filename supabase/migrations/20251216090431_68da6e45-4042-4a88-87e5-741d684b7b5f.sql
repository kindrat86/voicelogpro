-- Block all public reads from waitlist table
-- This prevents email harvesting and protects PII
CREATE POLICY "No public reads from waitlist"
ON public.waitlist
FOR SELECT
USING (false);