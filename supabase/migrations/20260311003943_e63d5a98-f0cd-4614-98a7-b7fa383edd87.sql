
-- Add source column to contact_submissions
ALTER TABLE public.contact_submissions ADD COLUMN source TEXT NOT NULL DEFAULT 'contato';

-- Create post_views table for tracking views
CREATE TABLE public.post_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a view
CREATE POLICY "Anyone can insert views"
ON public.post_views FOR INSERT TO public
WITH CHECK (true);

-- Anyone can read view counts
CREATE POLICY "Anyone can read views"
ON public.post_views FOR SELECT TO public
USING (true);

-- Admins can manage views
CREATE POLICY "Admins can manage views"
ON public.post_views FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create post_likes table for session-based likes
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, session_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a like
CREATE POLICY "Anyone can insert likes"
ON public.post_likes FOR INSERT TO public
WITH CHECK (true);

-- Anyone can read likes
CREATE POLICY "Anyone can read likes"
ON public.post_likes FOR SELECT TO public
USING (true);

-- Anyone can delete their own like (by session)
CREATE POLICY "Anyone can delete own likes"
ON public.post_likes FOR DELETE TO public
USING (true);

-- Admins can manage likes
CREATE POLICY "Admins can manage likes"
ON public.post_likes FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
