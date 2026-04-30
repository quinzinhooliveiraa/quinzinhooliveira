import { useEffect, useState } from "react";
import { api } from "@/lib/api";

let cache: boolean | null = null;
let pending: Promise<boolean> | null = null;
const subs = new Set<(v: boolean) => void>();

async function load(): Promise<boolean> {
  if (cache !== null) return cache;
  if (!pending) {
    pending = api
      .get("/auth/me")
      .then((data) => {
        cache = !!data?.admin;
        return cache;
      })
      .catch(() => {
        cache = false;
        return false;
      });
  }
  return pending;
}

export function invalidateAdminCache() {
  cache = null;
  pending = null;
}

export function setAdminCache(value: boolean) {
  cache = value;
  subs.forEach((fn) => fn(value));
}

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(cache ?? false);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    const fn = (v: boolean) => setIsAdmin(v);
    subs.add(fn);
    load().then((v) => {
      setIsAdmin(v);
      setLoading(false);
    });
    return () => {
      subs.delete(fn);
    };
  }, []);

  return { isAdmin, loading };
}
