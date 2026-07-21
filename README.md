# WashMitra

A platform for WASH (Water, Sanitation, and Hygiene) sector service workers in India —
skilling, enrollment, and service delivery for technicians, customers, and institutions.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express (bundled with the frontend, single deployable service)
- **Database/Auth**: Supabase (Postgres + RLS)
- **Payments**: Razorpay
- **AI**: Google Gemini (impact story generation)

## Run Locally

**Prerequisites**: Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:
   ```bash
   cp .env.example .env
   ```

   You'll need:
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase Dashboard → Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — same page, "service_role" key (server-only, never expose to the client)
   - `GEMINI_API_KEY` — https://aistudio.google.com/app/apikey
   - `VITE_GOOGLE_MAPS_PLATFORM_KEY` — optional; live tracking map degrades gracefully without it
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `VITE_RAZORPAY_KEY_ID` — https://dashboard.razorpay.com/app/keys
     (`RAZORPAY_KEY_ID` and `VITE_RAZORPAY_KEY_ID` are the same public value, duplicated because
     the server and client each read their own env namespace)

3. Run the app:
   ```bash
   npm run dev
   ```

## Build & Deploy

```bash
npm run build   # builds frontend (dist/) + bundles the Express server (dist/server.cjs)
npm start       # runs the production build
```

Deployed via Google Cloud Run — see deployment notes for Dockerfile and domain mapping.

## Scripts

- `npm run dev` — local dev server (Vite + Express, HMR enabled)
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — TypeScript type-check (`tsc --noEmit`)
- `npm run clean` — remove build artifacts
