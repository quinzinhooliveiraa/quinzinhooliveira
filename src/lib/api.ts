async function request<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: opts.body && !(opts.body instanceof FormData) ? { "Content-Type": "application/json", ...(opts.headers || {}) } : opts.headers,
    ...opts,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return (await res.text()) as unknown as T;
}

export const api = {
  get: <T = any>(p: string) => request<T>(p),
  post: <T = any>(p: string, body?: unknown) => request<T>(p, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T = any>(p: string, body?: unknown) => request<T>(p, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T = any>(p: string, body?: unknown) => request<T>(p, { method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined }),
  del: <T = any>(p: string, body?: unknown) => request<T>(p, { method: "DELETE", body: body !== undefined ? JSON.stringify(body) : undefined }),
  upload: async <T = any>(p: string, file: File): Promise<T> => {
    const fd = new FormData();
    fd.append("file", file);
    return request<T>(p, { method: "POST", body: fd });
  },
};
