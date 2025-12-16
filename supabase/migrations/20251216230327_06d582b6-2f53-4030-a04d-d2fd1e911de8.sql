-- Add explicit denial policies for blog_posts table
-- This follows defense-in-depth principles

CREATE POLICY "No public inserts to blog_posts"
ON public.blog_posts
FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "No public updates to blog_posts"
ON public.blog_posts
FOR UPDATE
TO public
USING (false);

CREATE POLICY "No public deletes from blog_posts"
ON public.blog_posts
FOR DELETE
TO public
USING (false);