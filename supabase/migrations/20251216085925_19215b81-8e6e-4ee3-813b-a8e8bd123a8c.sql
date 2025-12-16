-- Add explicit deny policies for UPDATE and DELETE on waitlist table
-- This prevents configuration drift and improves security auditability

-- Explicitly deny all UPDATE operations on waitlist
CREATE POLICY "No public updates to waitlist"
ON public.waitlist
FOR UPDATE
USING (false);

-- Explicitly deny all DELETE operations on waitlist
CREATE POLICY "No public deletes from waitlist"
ON public.waitlist
FOR DELETE
USING (false);