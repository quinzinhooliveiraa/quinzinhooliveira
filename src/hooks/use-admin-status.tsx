import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/auth/me")
      .then((data) => {
        if (!cancelled) setIsAdmin(!!data?.admin);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { isAdmin, loading };
}
