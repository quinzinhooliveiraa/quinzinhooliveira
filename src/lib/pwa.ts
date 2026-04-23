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

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as any).standalone === true
  );
}
