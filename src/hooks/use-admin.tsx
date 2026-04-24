import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    api
      .get("/auth/me")
      .then((data) => {
        if (cancelled) return;
        if (data?.admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate("/admin/login");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setIsAdmin(false);
        navigate("/admin/login");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return { isAdmin, loading };
}
