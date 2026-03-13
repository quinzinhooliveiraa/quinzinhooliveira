CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page text NOT NULL DEFAULT '/',
  country text,
  city text,
  lat double precision,
  lng double precision,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits" ON public.page_visits
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can read visits" ON public.page_visits
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

ALTER PUBLICATION supabase_realtime ADD TABLE public.page_visits;