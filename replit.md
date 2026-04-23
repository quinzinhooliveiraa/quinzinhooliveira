# Quinzinho Oliveira — Portfolio & Blog

Portuguese-language portfolio + blog site for Quinzinho Oliveira (entrepreneur/author).

## Stack

- **Frontend**: Vite + React + TypeScript + Tailwind + shadcn/ui + Tiptap (rich text)
- **Backend**: Express (single Node process) with Vite middleware in dev, static files in prod
- **Database**: Neon Postgres (`NEON_DATABASE`) via Drizzle ORM (drizzle-kit push for schema)
- **Auth**: JWT in httpOnly cookie `qo_session` + bcrypt password hashes
- **Storage**: Local `uploads/` folder served at `/uploads` (multer)
- **Realtime**: SSE at `/api/admin/events` (visit + contact alerts)
- **Push notifications**: web-push (VAPID) for admin PWA install
- **AI SEO** (optional): OpenAI gpt-4o-mini at `/api/admin/generate-seo`

## Layout

- `server/` — Express app
  - `index.ts` — entry, mounts API + Vite middleware/static
  - `routes.ts` — all REST endpoints
  - `auth.ts` — JWT + bcrypt + master admin bootstrap
  - `events.ts` — SSE + web-push fan-out
  - `db.ts` / `schema.ts` — Drizzle setup
- `src/` — React app (Vite root)
  - `lib/api.ts` — fetch wrapper (cookie credentials, JSON, file upload)
  - `pages/`, `components/`, `hooks/`
- `public/sw.js` — service worker (push handler)
- `uploads/` — runtime user uploads (gitignored in production)

## Scripts

- `npm run dev` — `tsx watch` server/index.ts (Vite middleware in dev)
- `npm run build` — `vite build` + `esbuild` server bundle into `dist-server/`
- `npm start` — `NODE_ENV=production node dist-server/index.mjs`
- `npm run db:push` — `drizzle-kit push --force`

## Required env vars

- `NEON_DATABASE` (or `DATABASE_URL`) — Postgres connection string
- `JWT_SECRET` — long random secret
- `MASTER_ADMIN_EMAIL`, `MASTER_ADMIN_PASSWORD` — bootstrapped on first start
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` — for web push
- `VITE_VAPID_PUBLIC_KEY` — same public key, exposed to browser
- `OPENAI_API_KEY` *(optional)* — enables AI SEO assistant

## Routes (high level)

- `GET /api/posts`, `GET /api/posts/:slug` — public blog
- `GET /api/categories`, `GET /api/tags`
- `POST /api/contact` — contact + funnel submissions
- `POST /api/visits` — track visit (geo lookup + push notify admins)
- `POST /api/post-views`, `POST /api/post-likes`, `DELETE /api/post-likes`
- `POST /api/auth/login|logout`, `GET /api/auth/me`
- `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- `*  /api/admin/*` — JWT-guarded (posts CRUD, submissions, visits, settings, invite, push subs, generate-seo)
- `GET /api/admin/events` — SSE stream
- `POST /api/admin/upload` — file upload (multer → uploads/)

## Migration notes

This project was migrated from a Supabase backend (auth + db + storage + edge functions + realtime). All `supabase` imports were removed; the equivalent functionality runs in this Express server. The legacy `supabase/migrations/` folder may still exist on disk but is no longer used — Drizzle is the source of truth for the schema.
