import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Lightweight hook that checks admin status without redirecting */
export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsAdmin(false); setLoading(false); return; }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      setIsAdmin(!!(roles && roles.length > 0));
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => check());
    check();
    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin, loading };
}
