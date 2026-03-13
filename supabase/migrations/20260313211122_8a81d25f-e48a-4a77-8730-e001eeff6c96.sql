
-- Site settings table for admin-editable content
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can read settings" ON public.site_settings
  FOR SELECT TO public USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can manage settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed default values
INSERT INTO public.site_settings (key, value) VALUES
  ('homepage_video_url', 'https://www.youtube.com/embed/LShHHIJ4urk?si=vU14gKywHmaSw2wr');
