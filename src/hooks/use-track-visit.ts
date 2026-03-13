import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "./use-session-id";

export function useTrackVisit() {
  const location = useLocation();
  const sessionId = getSessionId();

  useEffect(() => {
    if (!sessionId) return;

    // Debounce to avoid double-tracking on fast navigation
    const timer = setTimeout(() => {
      supabase.functions.invoke("track-visit", {
        body: { session_id: sessionId, page: location.pathname },
      }).catch(() => {});
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, sessionId]);
}
