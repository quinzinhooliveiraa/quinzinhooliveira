import { useEffect, useState } from "react";
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
    const es = new EventSource("/api/admin/events", { withCredentials: true } as any);

    es.addEventListener("visit", (e: MessageEvent) => {
      try {
        const v = JSON.parse(e.data);
        const where = [v.city, v.country].filter(Boolean).join(", ") || "Local desconhecido";
        const page = v.page || "/";
        showNotification("Nova visita no site", `${where} • ${page}`, "/admin", `visit-${v.id || Date.now()}`);
      } catch {
        // ignore
      }
    });

    es.addEventListener("contact", (e: MessageEvent) => {
      try {
        const s = JSON.parse(e.data);
        showNotification(
          `Nova mensagem de ${s.name || "alguém"}`,
          s.subject || (s.message ? s.message.slice(0, 100) : ""),
          "/admin",
          `msg-${s.id || Date.now()}`,
        );
      } catch {
        // ignore
      }
    });

    es.onerror = () => {
      // Auto-reconnects by browser; ignore.
    };

    return () => es.close();
  }, [enabled, hasPush]);
}
