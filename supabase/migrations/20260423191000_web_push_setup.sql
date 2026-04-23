-- Web Push subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Admins can manage their own subscriptions
CREATE POLICY "Admins manage own subscriptions" ON public.push_subscriptions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON public.push_subscriptions(user_id);

-- Enable pg_net extension to call edge functions from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Helper to fetch project URL + service role key from Vault, with fallback to GUC
CREATE OR REPLACE FUNCTION public.notify_admins_via_push(_title TEXT, _body TEXT, _url TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  fn_url TEXT;
  service_key TEXT;
BEGIN
  -- These two must be configured as database settings (see migration notes)
  fn_url := current_setting('app.send_push_url', true);
  service_key := current_setting('app.service_role_key', true);

  IF fn_url IS NULL OR service_key IS NULL OR fn_url = '' OR service_key = '' THEN
    RETURN;
  END IF;

  PERFORM extensions.http_post(
    url := fn_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object('title', _title, 'body', _body, 'url', _url)
  );
EXCEPTION WHEN OTHERS THEN
  -- Never fail the originating insert because of notification problems
  NULL;
END;
$$;

-- Trigger function for new visits
CREATE OR REPLACE FUNCTION public.trigger_push_on_visit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  loc TEXT;
BEGIN
  loc := COALESCE(NULLIF(concat_ws(', ', NEW.city, NEW.country), ''), 'Local desconhecido');
  PERFORM public.notify_admins_via_push(
    'Nova visita no site',
    loc || ' • ' || COALESCE(NEW.page, '/'),
    '/admin'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS push_on_visit ON public.page_visits;
CREATE TRIGGER push_on_visit
  AFTER INSERT ON public.page_visits
  FOR EACH ROW EXECUTE FUNCTION public.trigger_push_on_visit();

-- Trigger function for new contact submissions
CREATE OR REPLACE FUNCTION public.trigger_push_on_contact()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.notify_admins_via_push(
    'Nova mensagem de ' || COALESCE(NEW.name, 'alguém'),
    COALESCE(NEW.subject, LEFT(COALESCE(NEW.message, ''), 100)),
    '/admin'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS push_on_contact ON public.contact_submissions;
CREATE TRIGGER push_on_contact
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.trigger_push_on_contact();
