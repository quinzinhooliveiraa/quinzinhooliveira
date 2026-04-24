import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const KEY = "hidden_pages";

let cache: string[] | null = null;
let pending: Promise<string[]> | null = null;
const subs = new Set<(v: string[]) => void>();

function parse(value?: string): string[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

async function load(): Promise<string[]> {
  if (cache) return cache;
  if (!pending) {
    pending = api
      .get<Record<string, string>>("/site-settings")
      .then((all) => {
        cache = parse(all?.[KEY]);
        return cache;
      })
      .catch(() => {
        cache = [];
        return cache;
      });
  }
  return pending;
}

function notify() {
  subs.forEach((fn) => fn(cache || []));
}

export function useHiddenPages(): { hidden: string[]; loading: boolean; setHidden: (v: string[]) => Promise<void> } {
  const [hidden, setLocal] = useState<string[]>(cache || []);
  const [loading, setLoading] = useState(cache == null);

  useEffect(() => {
    const fn = (v: string[]) => setLocal(v);
    subs.add(fn);
    load().then((v) => {
      setLocal(v);
      setLoading(false);
    });
    return () => {
      subs.delete(fn);
    };
  }, []);

  const setHidden = async (next: string[]) => {
    cache = next;
    notify();
    await api.patch("/admin/site-settings", { [KEY]: JSON.stringify(next) });
  };

  return { hidden, loading, setHidden };
}

export function useIsPageHidden(path: string): { hidden: boolean; loading: boolean } {
  const { hidden, loading } = useHiddenPages();
  return { hidden: hidden.includes(path), loading };
}
