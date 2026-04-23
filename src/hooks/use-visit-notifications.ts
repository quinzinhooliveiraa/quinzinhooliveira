import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showNotification } from "@/lib/pwa";

export function useVisitNotifications(enabled: boolean) {
  const [hasPush, setHasPush] = useState(false);

  useEffect(() => {
    if (!enabled || !("serviceWorker" in navigator)) return;
    let mounted = true;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (mounted) setHasPush(!!sub);
      })
      .catch(() => null);
    return () => {
      mounted = false;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || hasPush) return;
    const channel = supabase
      .channel("admin-visit-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "page_visits" },
        (payload) => {
          const v: any = payload.new || {};
          const where = [v.city, v.country].filter(Boolean).join(", ") || "Local desconhecido";
          const page = v.page || "/";
          showNotification(
            "Nova visita no site",
            `${where} • ${page}`,
            "/admin",
            `visit-${v.id || Date.now()}`
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions" },
        (payload) => {
          const s: any = payload.new || {};
          showNotification(
            `Nova mensagem de ${s.name || "alguém"}`,
            s.subject || s.message?.slice(0, 100) || "",
            "/admin",
            `msg-${s.id || Date.now()}`
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, hasPush]);
}
