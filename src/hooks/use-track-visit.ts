import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { getSessionId } from "./use-session-id";

let cachedIsAdmin: boolean | null = null;

async function checkIsAdmin(): Promise<boolean> {
  if (cachedIsAdmin !== null) return cachedIsAdmin;
  try {
    const data = await api.get<{ admin?: any }>("/auth/me");
    cachedIsAdmin = !!data?.admin;
  } catch {
    cachedIsAdmin = false;
  }
  return cachedIsAdmin;
}

export function useTrackVisit() {
  const location = useLocation();
  const sessionId = getSessionId();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(cachedIsAdmin);
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (cachedIsAdmin === null) {
      checkIsAdmin().then(setIsAdmin);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    if (isAdmin) return;
    if (location.pathname.startsWith("/admin")) return;

    const key = `${location.pathname}_${sessionId}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;

    const timer = setTimeout(() => {
      const ref = document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : "";
      api.post("/visits", { sessionId, page: location.pathname, referrer: ref }).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname, sessionId, isAdmin]);
}
