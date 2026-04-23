import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { getSessionId } from "./use-session-id";

export function useTrackVisit() {
  const location = useLocation();
  const sessionId = getSessionId();

  useEffect(() => {
    if (!sessionId) return;
    const timer = setTimeout(() => {
      api.post("/visits", { sessionId, page: location.pathname }).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname, sessionId]);
}
