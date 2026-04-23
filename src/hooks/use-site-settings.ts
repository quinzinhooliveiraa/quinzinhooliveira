import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

let cache: Record<string, string> | null = null;
let pending: Promise<Record<string, string>> | null = null;

async function loadAll(): Promise<Record<string, string>> {
  if (cache) return cache;
  if (!pending) {
    pending = api
      .get<Record<string, string>>("/site-settings")
      .then((d) => {
        cache = d || {};
        return cache;
      })
      .catch(() => {
        cache = {};
        return cache;
      });
  }
  return pending;
}

export function useSiteSetting(key: string, fallback: string = "") {
  const [value, setValue] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll().then((all) => {
      if (all[key]) setValue(all[key]);
      setLoading(false);
    });
  }, [key]);

  const update = async (newValue: string) => {
    const prev = value;
    setValue(newValue);
    try {
      await api.patch("/admin/site-settings", { key, value: newValue });
      if (cache) cache[key] = newValue;
    } catch (err: any) {
      setValue(prev);
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
  };

  return { value, loading, update };
}
