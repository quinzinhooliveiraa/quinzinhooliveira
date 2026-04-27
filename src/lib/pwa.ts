export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return reg;
  } catch (err) {
    console.warn("[PWA] Service worker registration failed:", err);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  return await Notification.requestPermission();
}

export async function showNotification(title: string, body: string, url = "/admin", tag = "visit") {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const reg = await navigator.serviceWorker?.getRegistration();
  if (reg && reg.active) {
    reg.active.postMessage({ type: "SHOW_NOTIFICATION", title, body, url, tag });
  } else {
    try {
      new Notification(title, { body, icon: "/icon-192.png", tag });
    } catch {
      // ignore
    }
  }
}

let deferredPrompt: any = null;
const installListeners = new Set<(canInstall: boolean) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
    installListeners.forEach((cb) => cb(true));
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installListeners.forEach((cb) => cb(false));
  });
}

export function canInstall(): boolean {
  return deferredPrompt !== null;
}

export async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!deferredPrompt) return "unavailable";
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installListeners.forEach((cb) => cb(false));
  return choice.outcome;
}

export function onInstallAvailabilityChange(cb: (canInstall: boolean) => void): () => void {
  installListeners.add(cb);
  cb(deferredPrompt !== null);
  return () => installListeners.delete(cb);
}

let cachedVapidKey: string | null = null;
async function fetchVapidPublicKey(): Promise<string> {
  if (cachedVapidKey) return cachedVapidKey;
  try {
    const res = await fetch("/api/push/vapid-public-key", { credentials: "include" });
    if (!res.ok) return "";
    const data = await res.json();
    cachedVapidKey = data?.key || "";
    return cachedVapidKey || "";
  } catch {
    return "";
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function bufferToBase64(buf: ArrayBuffer | null): string {
  if (!buf) return "";
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function getPushSubscription(): Promise<{
  endpoint: string;
  p256dh: string;
  auth: string;
} | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window))
    return null;
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const vapidKey = await fetchVapidPublicKey();
    if (!vapidKey) {
      console.warn("[PWA] no VAPID key available from server");
      return null;
    }
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    } catch (err) {
      console.warn("[PWA] push subscribe failed:", err);
      return null;
    }
  }
  const json = sub.toJSON() as any;
  return {
    endpoint: sub.endpoint,
    p256dh: json?.keys?.p256dh || bufferToBase64(sub.getKey("p256dh")),
    auth: json?.keys?.auth || bufferToBase64(sub.getKey("auth")),
  };
}

export async function unsubscribePush(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) await sub.unsubscribe();
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as any).standalone === true
  );
}
