import { Response } from "express";
import webpush from "web-push";
import { db } from "./db";
import { pushSubscriptions } from "./schema";
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

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@quinzinho.com";
let pushReady = false;
if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
  pushReady = true;
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
