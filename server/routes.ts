import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { db, pool } from "./db";
import {
  admins,
  blogPosts,
  categories,
  contactSubmissions,
  pageVisits,
  postLikes,
  postTags,
  postViews,
  pushSubscriptions,
  siteSettings,
  tags,
} from "./schema";
import {
  AdminSession,
  bootstrapMasterAdmin,
  clearSessionCookie,
  hashPassword,
  readSession,
  requireAdmin,
  setSessionCookie,
  signSession,
  verifyPassword,
} from "./auth";
import { addSseClient, notifyContact, notifyVisit } from "./events";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = crypto.randomBytes(12).toString("hex") + ext;
      cb(null, name);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function parseUA(ua: unknown): { device: string; browser: string } {
  const s = typeof ua === "string" ? ua : "";
  if (!s) return { device: "unknown", browser: "unknown" };
  const lower = s.toLowerCase();
  let device = "desktop";
  if (/ipad|tablet|playbook|silk/.test(lower)) device = "tablet";
  else if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/.test(lower)) device = "mobile";
  let browser = "outro";
  if (/edg\//.test(lower)) browser = "Edge";
  else if (/opr\/|opera/.test(lower)) browser = "Opera";
  else if (/chrome\//.test(lower) && !/edg\//.test(lower)) browser = "Chrome";
  else if (/firefox\//.test(lower)) browser = "Firefox";
  else if (/safari\//.test(lower) && !/chrome\//.test(lower)) browser = "Safari";
  return { device, browser };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function makeRouter(): Router {
  const r = Router();

  // ────── Auth ──────
  r.post("/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const found = await db.select().from(admins).where(eq(admins.email, String(email).toLowerCase())).limit(1);
    const a = found[0];
    if (!a || !a.passwordHash) return res.status(401).json({ error: "Credenciais inválidas" });
    const ok = await verifyPassword(password, a.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });
    const token = signSession({ adminId: a.id, email: a.email, isMaster: a.isMaster });
    setSessionCookie(res, token);
    res.json({ ok: true, admin: { id: a.id, email: a.email, isMaster: a.isMaster } });
  });

  r.post("/auth/logout", (_req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  r.get("/auth/me", (req, res) => {
    const session = readSession(req);
    if (!session) return res.json({ admin: null });
    res.json({ admin: session });
  });

  r.post("/auth/forgot", async (req, res) => {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email required" });
    const found = await db.select().from(admins).where(eq(admins.email, String(email).toLowerCase())).limit(1);
    if (found.length === 0) return res.json({ ok: true }); // don't reveal
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await db.update(admins).set({ resetToken: token, resetTokenExpires: expires }).where(eq(admins.id, found[0].id));
    // No email service: log it. Master admin can also fetch via /api/auth/reset-tokens
    console.log(`[auth] Password reset token for ${email}: ${token}`);
    res.json({ ok: true, devToken: token });
  });

  r.post("/auth/reset", async (req, res) => {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ error: "Token and password required" });
    const found = await db.select().from(admins).where(eq(admins.resetToken, token)).limit(1);
    const a = found[0];
    if (!a || !a.resetTokenExpires || a.resetTokenExpires < new Date())
      return res.status(400).json({ error: "Token inválido ou expirado" });
    const passwordHash = await hashPassword(password);
    await db.update(admins).set({ passwordHash, resetToken: null, resetTokenExpires: null }).where(eq(admins.id, a.id));
    res.json({ ok: true });
  });

  // ────── Public posts ──────
  r.get("/posts", async (req, res) => {
    const onlyPublished = req.query.status !== "all";
    const rows = await db.execute(sql`
      SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.cover_image_url AS "coverImageUrl",
             p.status, p.meta_title AS "metaTitle", p.meta_description AS "metaDescription",
             p.published_at AS "publishedAt", p.created_at AS "createdAt", p.updated_at AS "updatedAt",
             p.category_id AS "categoryId",
             CASE WHEN c.id IS NOT NULL THEN json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) ELSE NULL END AS category
      FROM blog_posts p LEFT JOIN categories c ON c.id = p.category_id
      ${onlyPublished ? sql`WHERE p.status = 'published'` : sql``}
      ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
    `);
    res.json(rows.rows);
  });

  r.get("/posts/:slug", async (req, res) => {
    const result = await db.execute(sql`
      SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.cover_image_url AS "coverImageUrl",
             p.status, p.meta_title AS "metaTitle", p.meta_description AS "metaDescription",
             p.published_at AS "publishedAt", p.created_at AS "createdAt", p.updated_at AS "updatedAt",
             p.category_id AS "categoryId",
             CASE WHEN c.id IS NOT NULL THEN json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) ELSE NULL END AS category,
             COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) FILTER (WHERE t.id IS NOT NULL), '[]'::json) AS tags
      FROM blog_posts p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t ON t.id = pt.tag_id
      WHERE p.slug = ${req.params.slug}
      GROUP BY p.id, c.id
      LIMIT 1
    `);
    const post = result.rows[0];
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  });

  // ────── Admin posts ──────
  r.get("/admin/posts", requireAdmin, async (_req, res) => {
    const result = await db.execute(sql`
      SELECT p.id, p.title, p.slug, p.status, p.published_at AS "publishedAt", p.created_at AS "createdAt",
             CASE WHEN c.id IS NOT NULL THEN json_build_object('name', c.name) ELSE NULL END AS categories
      FROM blog_posts p LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  });

  r.get("/admin/posts/:id", requireAdmin, async (req, res) => {
    const result = await db.execute(sql`
      SELECT p.*, COALESCE(json_agg(t.id) FILTER (WHERE t.id IS NOT NULL), '[]'::json) AS tag_ids
      FROM blog_posts p
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t ON t.id = pt.tag_id
      WHERE p.id = ${req.params.id}
      GROUP BY p.id
    `);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  });

  r.post("/admin/posts", requireAdmin, async (req, res) => {
    const b = req.body || {};
    const slug = b.slug || slugify(b.title || "post");
    const [created] = await db
      .insert(blogPosts)
      .values({
        title: b.title || "Sem título",
        slug,
        excerpt: b.excerpt ?? null,
        content: b.content ?? "",
        coverImageUrl: b.coverImageUrl ?? null,
        categoryId: b.categoryId ?? null,
        status: b.status || "draft",
        metaTitle: b.metaTitle ?? null,
        metaDescription: b.metaDescription ?? null,
        publishedAt: b.status === "published" ? new Date() : null,
      })
      .returning();
    if (Array.isArray(b.tagIds) && b.tagIds.length) {
      await db.insert(postTags).values(b.tagIds.map((tagId: string) => ({ postId: created.id, tagId })));
    }
    res.json(created);
  });

  r.patch("/admin/posts/:id", requireAdmin, async (req, res) => {
    const b = req.body || {};
    const updates: any = { updatedAt: new Date() };
    for (const k of [
      "title",
      "slug",
      "excerpt",
      "content",
      "coverImageUrl",
      "categoryId",
      "status",
      "metaTitle",
      "metaDescription",
    ]) {
      if (k in b) updates[k] = b[k];
    }
    if (b.status === "published") {
      const existing = await db.select().from(blogPosts).where(eq(blogPosts.id, req.params.id)).limit(1);
      if (existing[0] && !existing[0].publishedAt) updates.publishedAt = new Date();
    }
    const [updated] = await db.update(blogPosts).set(updates).where(eq(blogPosts.id, req.params.id)).returning();
    if (Array.isArray(b.tagIds)) {
      await db.delete(postTags).where(eq(postTags.postId, req.params.id));
      if (b.tagIds.length) {
        await db.insert(postTags).values(b.tagIds.map((tagId: string) => ({ postId: req.params.id, tagId })));
      }
    }
    res.json(updated);
  });

  r.delete("/admin/posts/:id", requireAdmin, async (req, res) => {
    await db.delete(blogPosts).where(eq(blogPosts.id, req.params.id));
    res.json({ ok: true });
  });

  // ────── Categories ──────
  r.get("/categories", async (_req, res) => {
    const rows = await db.select().from(categories).orderBy(categories.name);
    res.json(rows);
  });
  r.post("/admin/categories", requireAdmin, async (req, res) => {
    const name = req.body?.name?.trim();
    if (!name) return res.status(400).json({ error: "Name required" });
    const slug = req.body?.slug || slugify(name);
    try {
      const [created] = await db.insert(categories).values({ name, slug }).returning();
      res.json(created);
    } catch (e: any) {
      // unique violation
      const existing = await db.select().from(categories).where(eq(categories.name, name)).limit(1);
      if (existing[0]) return res.json(existing[0]);
      throw e;
    }
  });

  // ────── Tags ──────
  r.get("/tags", async (_req, res) => {
    const rows = await db.select().from(tags).orderBy(tags.name);
    res.json(rows);
  });
  r.post("/admin/tags", requireAdmin, async (req, res) => {
    const name = req.body?.name?.trim();
    if (!name) return res.status(400).json({ error: "Name required" });
    const slug = req.body?.slug || slugify(name);
    try {
      const [created] = await db.insert(tags).values({ name, slug }).returning();
      res.json(created);
    } catch {
      const existing = await db.select().from(tags).where(eq(tags.name, name)).limit(1);
      if (existing[0]) return res.json(existing[0]);
      throw new Error("Tag insert failed");
    }
  });

  // ────── Contact form ──────
  r.post("/contact", async (req, res) => {
    const b = req.body || {};
    if (!b.name || !b.email || !b.message) return res.status(400).json({ error: "Missing fields" });
    const [created] = await db
      .insert(contactSubmissions)
      .values({
        name: b.name,
        email: b.email,
        subject: b.subject ?? null,
        message: b.message,
        source: b.source || "contato",
      })
      .returning();
    notifyContact(created).catch(() => null);
    res.json({ ok: true, id: created.id });
  });

  r.get("/admin/contact-submissions", requireAdmin, async (_req, res) => {
    const rows = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
    res.json(rows);
  });
  r.patch("/admin/contact-submissions/:id", requireAdmin, async (req, res) => {
    const [u] = await db
      .update(contactSubmissions)
      .set({ read: !!req.body?.read })
      .where(eq(contactSubmissions.id, req.params.id))
      .returning();
    res.json(u);
  });
  r.delete("/admin/contact-submissions/:id", requireAdmin, async (req, res) => {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, req.params.id));
    res.json({ ok: true });
  });

  // ────── Page visits ──────
  r.post("/visits", async (req, res) => {
    const { sessionId, page, referrer } = req.body || {};
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });
    const xff = req.headers["x-forwarded-for"];
    const ip =
      (typeof xff === "string" ? xff.split(",")[0].trim() : Array.isArray(xff) ? xff[0] : null) ||
      req.socket.remoteAddress ||
      null;
    const userAgent = req.headers["user-agent"] || null;
    const { device, browser } = parseUA(userAgent);

    let country: string | null = null;
    let countryCode: string | null = null;
    let city: string | null = null;
    let lat: number | null = null;
    let lng: number | null = null;
    if (ip && ip !== "127.0.0.1" && !ip.startsWith("::1")) {
      try {
        const r = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,city,lat,lon`);
        if (r.ok) {
          const j: any = await r.json();
          country = j.country ?? null;
          countryCode = j.countryCode ?? null;
          city = j.city ?? null;
          lat = j.lat ?? null;
          lng = j.lon ?? null;
        }
      } catch {
        // ignore
      }
    }

    const [created] = await db
      .insert(pageVisits)
      .values({
        sessionId,
        page: page || "/",
        ip,
        country,
        countryCode,
        city,
        lat,
        lng,
        userAgent: typeof userAgent === "string" ? userAgent : null,
        referrer: referrer || null,
        device,
        browser,
      })
      .returning();
    notifyVisit(created).catch(() => null);
    res.json({ ok: true });
  });

  r.get("/admin/visits", requireAdmin, async (_req, res) => {
    const rows = await db.select().from(pageVisits).orderBy(desc(pageVisits.createdAt)).limit(500);
    res.json(rows);
  });

  // ────── Post views & likes (public) ──────
  r.post("/post-views", async (req, res) => {
    const { postId, sessionId } = req.body || {};
    if (!postId || !sessionId) return res.status(400).json({ error: "postId and sessionId required" });
    await db.insert(postViews).values({ postId, sessionId });
    res.json({ ok: true });
  });
  r.get("/post-views/:postId/count", async (req, res) => {
    const r = await db.execute(sql`SELECT count(*)::int AS c FROM post_views WHERE post_id = ${req.params.postId}`);
    res.json({ count: (r.rows[0] as any)?.c || 0 });
  });

  r.post("/post-likes", async (req, res) => {
    const { postId, sessionId } = req.body || {};
    if (!postId || !sessionId) return res.status(400).json({ error: "postId and sessionId required" });
    try {
      await db.insert(postLikes).values({ postId, sessionId });
    } catch {
      // duplicate ok
    }
    res.json({ ok: true });
  });
  r.delete("/post-likes", async (req, res) => {
    const { postId, sessionId } = req.body || {};
    if (!postId || !sessionId) return res.status(400).json({ error: "postId and sessionId required" });
    await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.sessionId, sessionId)));
    res.json({ ok: true });
  });
  r.get("/post-likes/:postId/count", async (req, res) => {
    const r = await db.execute(sql`SELECT count(*)::int AS c FROM post_likes WHERE post_id = ${req.params.postId}`);
    res.json({ count: (r.rows[0] as any)?.c || 0 });
  });
  r.get("/post-likes/:postId/has", async (req, res) => {
    const sessionId = String(req.query.sessionId || "");
    if (!sessionId) return res.json({ liked: false });
    const r = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, req.params.postId), eq(postLikes.sessionId, sessionId)))
      .limit(1);
    res.json({ liked: r.length > 0 });
  });

  // ────── Site settings ──────
  r.get("/site-settings", async (_req, res) => {
    const rows = await db.select().from(siteSettings);
    const out: Record<string, string> = {};
    for (const row of rows) out[row.key] = row.value;
    res.json(out);
  });
  r.patch("/admin/site-settings", requireAdmin, async (req, res) => {
    const updates = req.body || {};
    for (const [k, v] of Object.entries(updates)) {
      await db
        .insert(siteSettings)
        .values({ key: k, value: String(v), updatedAt: new Date() })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value: String(v), updatedAt: new Date() } });
    }
    res.json({ ok: true });
  });

  // ────── Admin management ──────
  r.get("/admin/admins", requireAdmin, async (_req, res) => {
    const rows = await db.select({ id: admins.id, email: admins.email, isMaster: admins.isMaster, createdAt: admins.createdAt }).from(admins);
    res.json(rows);
  });
  r.post("/admin/invite", requireAdmin, async (req, res) => {
    const { email, password } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email required" });
    const lower = String(email).toLowerCase();
    const existing = await db.select().from(admins).where(eq(admins.email, lower)).limit(1);
    if (existing[0]) return res.json({ ok: true, alreadyExists: true });
    const passwordHash = password ? await hashPassword(password) : null;
    const [created] = await db.insert(admins).values({ email: lower, passwordHash, isMaster: false }).returning();
    res.json({ ok: true, admin: { id: created.id, email: created.email } });
  });
  r.delete("/admin/admins/:id", requireAdmin, async (req, res) => {
    const session = (req as any).admin as AdminSession;
    const target = await db.select().from(admins).where(eq(admins.id, req.params.id)).limit(1);
    if (!target[0]) return res.status(404).json({ error: "Not found" });
    if (target[0].isMaster && session.adminId !== target[0].id)
      return res.status(403).json({ error: "Cannot remove master admin" });
    await db.delete(admins).where(eq(admins.id, req.params.id));
    res.json({ ok: true });
  });

  // ────── Analytics ──────
  r.get("/admin/analytics", requireAdmin, async (req, res) => {
    const range = String(req.query.range || "30d");
    const days = range === "7d" ? 7 : range === "90d" ? 90 : range === "all" ? 3650 : 30;
    const interval = sql.raw(`interval '${days} days'`);

    const series = await db.execute(sql`
      WITH days AS (
        SELECT generate_series(
          (now() - ${interval})::date,
          now()::date,
          interval '1 day'
        )::date AS day
      )
      SELECT d.day,
             COALESCE(count(v.id), 0)::int AS visits,
             COALESCE(count(DISTINCT v.session_id), 0)::int AS unique_visitors
      FROM days d
      LEFT JOIN page_visits v ON v.created_at::date = d.day
      GROUP BY d.day ORDER BY d.day
    `);

    const topPages = await db.execute(sql`
      SELECT page, count(*)::int AS visits, count(DISTINCT session_id)::int AS unique_visitors
      FROM page_visits WHERE created_at > now() - ${interval}
      GROUP BY page ORDER BY visits DESC LIMIT 10
    `);

    const countries = await db.execute(sql`
      SELECT country, country_code AS "countryCode", count(*)::int AS visits, count(DISTINCT session_id)::int AS unique_visitors
      FROM page_visits
      WHERE country IS NOT NULL AND created_at > now() - ${interval}
      GROUP BY country, country_code ORDER BY visits DESC LIMIT 12
    `);

    const cities = await db.execute(sql`
      SELECT city, country, country_code AS "countryCode", count(*)::int AS visits
      FROM page_visits
      WHERE city IS NOT NULL AND created_at > now() - ${interval}
      GROUP BY city, country, country_code ORDER BY visits DESC LIMIT 10
    `);

    const devices = await db.execute(sql`
      SELECT COALESCE(device, 'unknown') AS device, count(*)::int AS visits
      FROM page_visits WHERE created_at > now() - ${interval}
      GROUP BY device ORDER BY visits DESC
    `);

    const browsers = await db.execute(sql`
      SELECT COALESCE(browser, 'unknown') AS browser, count(*)::int AS visits
      FROM page_visits WHERE created_at > now() - ${interval}
      GROUP BY browser ORDER BY visits DESC LIMIT 8
    `);

    const referrers = await db.execute(sql`
      SELECT COALESCE(NULLIF(referrer, ''), 'Direto') AS source, count(*)::int AS visits
      FROM page_visits WHERE created_at > now() - ${interval}
      GROUP BY source ORDER BY visits DESC LIMIT 10
    `);

    const recent = await db.execute(sql`
      SELECT id, page, country, country_code AS "countryCode", city, device, browser, created_at AS "createdAt"
      FROM page_visits ORDER BY created_at DESC LIMIT 20
    `);

    const totals = await db.execute(sql`
      SELECT
        (SELECT count(*)::int FROM page_visits) AS "totalVisits",
        (SELECT count(DISTINCT session_id)::int FROM page_visits) AS "totalUniqueVisitors",
        (SELECT count(*)::int FROM page_visits WHERE created_at > now() - ${interval}) AS "rangeVisits",
        (SELECT count(DISTINCT session_id)::int FROM page_visits WHERE created_at > now() - ${interval}) AS "rangeUniqueVisitors",
        (SELECT count(*)::int FROM page_visits WHERE created_at::date = now()::date) AS "todayVisits",
        (SELECT count(DISTINCT session_id)::int FROM page_visits WHERE created_at::date = now()::date) AS "todayUniqueVisitors",
        (SELECT count(*)::int FROM page_visits WHERE created_at > now() - interval '15 minutes') AS "live",
        (SELECT count(*)::int FROM blog_posts WHERE status='published') AS "publishedPosts",
        (SELECT count(*)::int FROM contact_submissions WHERE NOT read) AS "unreadMessages"
    `);

    res.json({
      range,
      days,
      series: series.rows,
      topPages: topPages.rows,
      countries: countries.rows,
      cities: cities.rows,
      devices: devices.rows,
      browsers: browsers.rows,
      referrers: referrers.rows,
      recent: recent.rows,
      totals: totals.rows[0] || {},
    });
  });

  // ────── Uploads ──────
  r.post("/admin/upload", requireAdmin, upload.single("file"), (req, res) => {
    const f = (req as any).file;
    if (!f) return res.status(400).json({ error: "No file" });
    res.json({ url: `/uploads/${f.filename}` });
  });

  // ────── AI SEO (optional, requires OPENAI_API_KEY) ──────
  r.post("/admin/generate-seo", requireAdmin, async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "Configure OPENAI_API_KEY no servidor para usar SEO automático." });
    }
    const { title, content, excerpt } = req.body || {};
    const prompt = `Você é um especialista em SEO para blogs em português brasileiro. Com base no título e conteúdo abaixo, gere:
1. meta_title: título SEO otimizado (máx 60 caracteres)
2. meta_description: descrição meta otimizada (máx 160 caracteres)
3. suggested_tags: lista de 3-5 tags relevantes (palavras simples em português)
4. suggested_excerpt: resumo atraente do post (máx 200 caracteres)
5. suggested_category: uma categoria principal para o post (ex: Reflexão, Finanças, Marketing, Negócios, Tecnologia, Vibe Coding, Lifestyle, Empreendedorismo, Criatividade, Desenvolvimento Pessoal)

Responda APENAS em JSON válido com essas 5 chaves.

Título: ${title}
${excerpt ? `Resumo atual: ${excerpt}` : ""}
Conteúdo: ${(content || "").substring(0, 2000)}`;
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });
      const data: any = await r.json();
      const text = data.choices?.[0]?.message?.content || "{}";
      const json = JSON.parse(text);
      res.json(json);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ────── Push subscriptions ──────
  r.post("/admin/push-subscriptions", requireAdmin, async (req, res) => {
    const session = (req as any).admin as AdminSession;
    const { endpoint, p256dh, auth, userAgent } = req.body || {};
    if (!endpoint || !p256dh || !auth) return res.status(400).json({ error: "Missing keys" });
    await db
      .insert(pushSubscriptions)
      .values({ adminId: session.adminId, endpoint, p256dh, auth, userAgent: userAgent ?? null })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: { adminId: session.adminId, p256dh, auth, userAgent: userAgent ?? null },
      });
    res.json({ ok: true });
  });
  r.delete("/admin/push-subscriptions", requireAdmin, async (req, res) => {
    const { endpoint } = req.body || {};
    if (endpoint) await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
    res.json({ ok: true });
  });

  // ────── Realtime SSE ──────
  r.get("/admin/events", requireAdmin, (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();
    const close = addSseClient(res);
    req.on("close", close);
  });

  r.get("/health", (_req, res) => res.json({ ok: true }));

  return r;
}

export async function initServer() {
  await bootstrapMasterAdmin();
  // Seed default site settings
  await db
    .insert(siteSettings)
    .values({ key: "homepage_video_url", value: "https://www.youtube.com/embed/LShHHIJ4urk?si=vU14gKywHmaSw2wr" })
    .onConflictDoNothing();
}

export { UPLOADS_DIR, pool };
