import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { createServer as createHttpServer } from "http";
import { initServer, makeRouter, UPLOADS_DIR } from "./routes";

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
    app.get("*", (_req, res) => {
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
