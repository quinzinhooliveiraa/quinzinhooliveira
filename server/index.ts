import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { createServer as createHttpServer } from "http";
import { initServer, makeRouter, UPLOADS_DIR, buildSitemapXml, serveIndexNowKey } from "./routes";

const PORT = parseInt(process.env.PORT || "5000", 10);
const isDev = process.env.NODE_ENV !== "production";

async function start() {
  const app = express();
  app.set("trust proxy", true);
  app.use(express.json({ limit: "5mb" }));
  app.use(cookieParser());

  await initServer();

  app.use("/api", makeRouter());
  app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "1d" }));

  // IndexNow ownership verification: serve /<key>.txt at the root with the key as content
  app.get(/^\/[a-f0-9]{32}\.txt$/, async (req, res) => {
    const handled = await serveIndexNowKey(req.path, res);
    if (!handled) res.status(404).type("text").send("Not found");
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const xml = await buildSitemapXml();
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (err) {
      console.error("[sitemap] failed:", err);
      res.status(500).type("text").send("Failed to build sitemap");
    }
  });

  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server: undefined } },
      appType: "spa",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), "dist");
    app.use(express.static(distDir, { index: false, maxAge: "1d" }));
    app.use((_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  const server = createHttpServer(app);
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] ${isDev ? "dev" : "prod"} listening on :${PORT}`);
  });
}

start().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
