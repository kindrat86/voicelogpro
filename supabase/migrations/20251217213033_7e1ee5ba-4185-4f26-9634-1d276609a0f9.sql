-- Create blog schedule table for tracking automated generation
CREATE TABLE public.blog_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  entity_pack TEXT[] DEFAULT '{}',
  last_generated_at TIMESTAMP WITH TIME ZONE,
  generation_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_schedule ENABLE ROW LEVEL SECURITY;

-- Only allow read access - no public modifications
CREATE POLICY "Blog schedule is read-only for public" 
ON public.blog_schedule 
FOR SELECT 
USING (true);

CREATE POLICY "No public inserts to blog_schedule" 
ON public.blog_schedule 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "No public updates to blog_schedule" 
ON public.blog_schedule 
FOR UPDATE 
USING (false);

CREATE POLICY "No public deletes from blog_schedule" 
ON public.blog_schedule 
FOR DELETE 
USING (false);

-- Add trigger for updated_at
CREATE TRIGGER update_blog_schedule_updated_at
BEFORE UPDATE ON public.blog_schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the schedule with post configurations
INSERT INTO public.blog_schedule (post_id, title, jurisdiction, target_audience, keywords, entity_pack, priority) VALUES
('texas-lien-law', 'Texas Property Code Chapter 53: The 2025 Guide for Electrical Subcontractors', 'Texas', 'Texas Subcontractor', ARRAY['Texas mechanics lien', 'monthly notice requirement', 'fund trapping', 'construction daily log'], ARRAY['Texas Property Code Chapter 53', 'Section 53.056', 'Section 53.057', 'Section 53.052', 'fund trapping'], 1),
('data-center-acceleration', 'Constructive Acceleration in Data Center Construction: How to Get Paid for Overtime', 'Virginia', 'Data Center Project Manager', ARRAY['schedule compression claims', 'excusable delay', 'Northern Virginia data center', 'daily construction report evidence'], ARRAY['AIA A401', 'FAR 52.242-14', 'excusable delay', 'constructive acceleration'], 2),
('daily-logs-adjudication', 'Daily Logs vs. Site Diaries: What Wins in Adjudication?', 'International', 'Global Construction Professional', ARRAY['construction adjudication evidence', 'contemporaneous records', 'security of payment act evidence'], ARRAY['Entick v Carrington', 'business records exception', 'contemporaneous records'], 3),
('uk-golden-thread', 'The Golden Thread Explained: Digital Record Keeping for UK Subcontractors', 'United Kingdom', 'UK Subcontractor', ARRAY['Building Safety Act 2022', 'Golden Thread guidance', 'digital site records', 'BS 8670 competence'], ARRAY['Building Safety Act 2022', 'Golden Thread', 'BS 8670', 'Higher-Risk Buildings', 'Building Safety Regulator'], 4),
('florida-nto', 'Florida Notice to Owner (NTO): Proving First Furnishing Date', 'Florida', 'Florida Subcontractor', ARRAY['Florida Statute 713', 'Notice to Owner deadline', 'proof of first furnishing', 'daily log timestamp'], ARRAY['Florida Statute 713', 'Notice to Owner', 'first furnishing', 'construction lien'], 5);