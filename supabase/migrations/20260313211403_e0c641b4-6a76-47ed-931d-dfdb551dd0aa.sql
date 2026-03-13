
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read
CREATE POLICY "Public read site-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'site-images');

-- Only admins can upload/update/delete
CREATE POLICY "Admins manage site-images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::app_role));
