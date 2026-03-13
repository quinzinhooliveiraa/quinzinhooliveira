import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useSiteSetting(key: string, fallback: string = "") {
  const [value, setValue] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (data?.value) setValue(data.value);
        setLoading(false);
      });
  }, [key]);

  const update = async (newValue: string) => {
    const prev = value;
    setValue(newValue);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value: newValue, updated_at: new Date().toISOString() });
    if (error) {
      console.error("Failed to save setting:", error);
      setValue(prev);
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    }
  };

  return { value, loading, update };
}
