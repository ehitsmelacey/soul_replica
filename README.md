# Soul Replica — Lacey's Archive

> **Public archive notice:** This repository intentionally contains Lacey's personal memories, writing, and family-related material. Anyone on the internet can read, copy, download, and preserve it. The in-app audience filters and passphrase screen are prototype presentation features, not privacy controls.

## Project status

This project is a React/Vite interface with an Express server and Gemini-backed features. The archive is embedded in the project source. Offline installable-app support and local-model chat are not implemented yet.

The app's data edits are stored in the browser's local storage. They do not automatically sync between your computer and your children's devices. Gemini chat requires an internet connection and sends the relevant request context to Google's Gemini API.

## Deploy to Vercel

1. In Vercel, choose **Add New → Project**, connect GitHub, and import `ehitsmelacey/soul_replica`.
2. Let Vercel detect the Express application. The build command is `npm run build`; the build also copies the Vite frontend into the generated `public/` directory, which Vercel serves through its CDN.
3. In the Vercel project, open **Settings → Environment Variables**. Add `GEMINI_API_KEY` with the value of your Google AI Studio API key, select **Production** (and Preview only if you want preview deployments to use AI), and save it as an encrypted environment variable. Do not prefix it with `VITE_`, put it in source code, or commit it to Git.
4. Redeploy the project so the new environment variable is available to the server function. Check `/api/health` and test the site.

For local development, create an ignored `.env` file in the project root with `GEMINI_API_KEY=your_key_here`. The checked-in `.env.example` contains placeholders only. If a real key has been pasted into a chat or committed to Git, revoke or rotate it before use.

## API safeguards and limits

Gemini requests are accepted only from the same website origin, limited to 60 requests per IP per 15-minute window per running server instance, and bounded by a 4 MB JSON parser limit. File uploads in the interface are capped at 2.5 MiB so base64 encoding stays within Vercel's 4.5 MB function-payload ceiling. Provider error details are logged server-side rather than returned to visitors.

The in-memory rate counter is a basic abuse deterrent, not a global quota or family-only login. Vercel can run multiple or restarted function instances, and any visitor can still use the public AI interface within the applicable limits. Do not attach paid billing to the Gemini project unless you are comfortable with possible API charges; use Google AI Studio's usage controls and the current model-specific quotas.

**Gemini Free Tier privacy:** Google's current Gemini API documentation says free-tier prompts and responses may be used to improve its products. Consider this before sending children's private conversations or other sensitive information. The archive itself is public, but chat messages may contain new personal information. Paid-tier usage is documented as not used to improve Google products, but requires billing and may cost money.

## Offline support (next phase)

The build keeps source static assets separate from generated Vercel output so an installable PWA can be added later. That phase can add a web app manifest, icons, and a service worker that caches the app shell and archive for offline reading. Remote Gemini chat will still need internet; true offline chat would require a compatible on-device model and additional device/storage testing.

## Run locally

Prerequisite: Node.js.

```bash
npm install
npm run dev
```

The development server starts on `http://localhost:3000`. To create and run a production build:

```bash
npm run build
npm start
```
