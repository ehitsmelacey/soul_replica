# Soul Replica — Lacey's Archive

> **Public archive notice:** This repository intentionally contains Lacey's personal memories, writing, and family-related material. Anyone on the internet can read, copy, download, and preserve it. The in-app audience filters and passphrase screen are prototype presentation features, not privacy or security controls.

## Project status

This project is a React/Vite interface with an Express server and Gemini-backed features. The archive is currently embedded in the project source. A real Gemini API key is not included here; AI endpoints need a server-side key configured locally. Offline PWA support and local-model chat have not yet been implemented.

Do not commit API keys, passwords, or other credentials. The `.env.example` file contains placeholders only. For local development, create an ignored `.env` file in the project root and add your own server-side `GEMINI_API_KEY` there. If a real key has been pasted into a chat or committed to Git, revoke or rotate it before use.

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

## Important limitation

Because this repository is public and contains the archive, anyone can inspect the data regardless of what the interface displays. Do not rely on this prototype's recipient passphrase flow to keep any record private. The AI chat also requires a configured server and external Gemini service; it is not an offline local AI yet.
