-- Create a function to validate email format and length on waitlist inserts
CREATE OR REPLACE FUNCTION public.validate_waitlist_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Check email format using regex
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Check email length (RFC 5321 limit)
  IF LENGTH(NEW.email) > 254 THEN
    RAISE EXCEPTION 'Email too long';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to validate email before insert or update
CREATE TRIGGER check_waitlist_email
BEFORE INSERT OR UPDATE ON public.waitlist
FOR EACH ROW
EXECUTE FUNCTION public.validate_waitlist_email();