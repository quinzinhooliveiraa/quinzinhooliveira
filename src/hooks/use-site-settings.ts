import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSetting(key: string, fallback: string = "") {
  const [value, setValue] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_settings" as any)
      .select("value")
      .eq("key", key)
      .single()
      .then(({ data }) => {
        if (data && (data as any).value) setValue((data as any).value);
        setLoading(false);
      });
  }, [key]);

  const update = async (newValue: string) => {
    setValue(newValue);
    await supabase
      .from("site_settings" as any)
      .upsert({ key, value: newValue, updated_at: new Date().toISOString() } as any);
  };

  return { value, loading, update };
}
