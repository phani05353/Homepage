# Homepage

A modern, full-screen personal homepage with live weather, daily vocabulary flash cards, fun facts, and an inspirational quote — all layered over stunning Unsplash backgrounds.

## Features

| Feature | Details |
|---|---|
| **Background** | Daily-rotating curated Unsplash landscape photos |
| **Live Clock** | Real-time clock + date, centre-screen |
| **Weather** | Temperature, feels-like, humidity, wind — pulled from Open-Meteo (no API key) |
| **Search bar** | Minimised icon in the top-right; expands on click, searches Google in a new tab |
| **Vocabulary widget** | Flip-card — word on front, meaning + example on back; navigable word list |
| **Fun Fact widget** | Rotating daily fact with a "Another one" shuffle button |
| **Quote widget** | Daily inspirational quote with a shuffle option |

## Quick start

```bash
cd homepage-app
npm install
npm run dev
```

Open `http://localhost:5173`.

## Change your location

Edit [`src/config.ts`](homepage-app/src/config.ts):

```ts
export const LOCATION = {
  lat: 12.9716,   // ← your latitude
  lon: 77.5946,   // ← your longitude
  label: 'Bengaluru, IN',
};
```

Weather is fetched from [Open-Meteo](https://open-meteo.com/) — free, no account needed.

## Deploy to homelab

The repo includes a one-command deploy script for any Linux homelab running Docker.

```bash
# From the repo root on your server:
./deploy.sh
```

By default it serves on port **8080**. Override with:

```bash
HOST_PORT=3000 ./deploy.sh
```

### What the script does

1. `git pull` (or clones if missing)
2. `docker build` inside `homepage-app/`
3. Stops & removes the old container
4. Starts a new container with `--restart unless-stopped`

The Docker image is a two-stage build: Node 20 Alpine builds the Vite app, then Nginx Alpine serves the static files. The final image is ~25 MB.

## Tech stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Lucide React** icons
- **Open-Meteo API** — weather (free, no key)
- **Unsplash** — curated background images
- **Nginx** — production static server (inside Docker)
