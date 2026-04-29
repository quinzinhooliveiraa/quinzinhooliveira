import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const tsx = join(__dirname, "node_modules", ".bin", "tsx");
const entry = join(__dirname, "server", "index.ts");

const child = spawn(tsx, [entry], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

child.on("error", (err) => {
  console.error("[serve] failed to start server:", err);
  process.exit(1);
});

child.on("exit", (code) => process.exit(code ?? 0));
