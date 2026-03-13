
-- Prevent anyone from deleting or demoting the master admin
CREATE OR REPLACE FUNCTION public.protect_master_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  master_email TEXT;
BEGIN
  SELECT email INTO master_email FROM auth.users WHERE id = OLD.user_id;
  IF master_email = 'quinzinhooliveiraa@gmail.com' THEN
    -- Only the master admin themselves can remove their own role
    IF auth.uid() IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Cannot modify the master admin role';
    END IF;
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER protect_master_admin_delete
  BEFORE DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_master_admin();

CREATE TRIGGER protect_master_admin_update
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_master_admin();
