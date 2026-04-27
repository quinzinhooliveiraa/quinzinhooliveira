import { Response } from "express";
import webpush from "web-push";
import { db } from "./db";
import { pushSubscriptions, siteSettings } from "./schema";
import { eq } from "drizzle-orm";

type SseClient = { id: number; res: Response };
const sseClients = new Set<SseClient>();
let nextId = 1;

export function addSseClient(res: Response): () => void {
  const client: SseClient = { id: nextId++, res };
  sseClients.add(client);
  res.write(`: connected ${client.id}\n\n`);
  const ping = setInterval(() => {
    try {
      res.write(`: ping\n\n`);
    } catch {
      // ignore
    }
  }, 25000);
  return () => {
    clearInterval(ping);
    sseClients.delete(client);
  };
}

export function broadcast(event: string, data: unknown) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const c of sseClients) {
    try {
      c.res.write(payload);
    } catch {
      sseClients.delete(c);
    }
  }
}

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:quinzinhooliveiraa@gmail.com";
let pushReady = false;
let vapidPublicKey = "";

export function getVapidPublicKey(): string {
  return vapidPublicKey;
}

export async function initWebPush(): Promise<void> {
  // Prefer env vars (production secrets); fall back to bootstrapping into site_settings
  let pub = process.env.VAPID_PUBLIC_KEY || "";
  let priv = process.env.VAPID_PRIVATE_KEY || "";

  if (!pub || !priv) {
    const rows = await db.select().from(siteSettings);
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    pub = map.vapid_public_key || "";
    priv = map.vapid_private_key || "";
    if (!pub || !priv) {
      const generated = webpush.generateVAPIDKeys();
      pub = generated.publicKey;
      priv = generated.privateKey;
      await db
        .insert(siteSettings)
        .values({ key: "vapid_public_key", value: pub })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value: pub, updatedAt: new Date() } });
      await db
        .insert(siteSettings)
        .values({ key: "vapid_private_key", value: priv })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value: priv, updatedAt: new Date() } });
      console.log("[push] generated VAPID keys and stored in site_settings");
    }
  }

  if (pub && priv) {
    webpush.setVapidDetails(VAPID_SUBJECT, pub, priv);
    vapidPublicKey = pub;
    pushReady = true;
  }
}

export async function sendPushToAdmins(title: string, body: string, url = "/admin", tag?: string) {
  if (!pushReady) return;
  const subs = await db.select().from(pushSubscriptions);
  if (subs.length === 0) return;
  const payload = JSON.stringify({ title, body, url, tag });
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, s.id));
        }
      }
    })
  );
}

export async function notifyVisit(visit: { city?: string | null; country?: string | null; page?: string | null; id?: string }) {
  const where = [visit.city, visit.country].filter(Boolean).join(", ") || "Local desconhecido";
  const msg = `${where} • ${visit.page || "/"}`;
  broadcast("visit", { ...visit, message: msg });
  await sendPushToAdmins("Nova visita no site", msg, "/admin", `visit-${visit.id || Date.now()}`);
}

export async function notifyContact(sub: { id?: string; name?: string; subject?: string | null; message?: string }) {
  const title = `Nova mensagem de ${sub.name || "alguém"}`;
  const body = sub.subject || (sub.message || "").slice(0, 100);
  broadcast("contact", sub);
  await sendPushToAdmins(title, body, "/admin", `contact-${sub.id || Date.now()}`);
}
