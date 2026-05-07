# Homepage

A clean, full-screen personal homepage with live weather, a sophisticated word of the day, a fun fact, and an inspirational quote — all layered over a daily-rotating photo background. Adaptive widget tints sample colour from the day's image.

![status](https://img.shields.io/badge/status-running-brightgreen)
![stack](https://img.shields.io/badge/stack-Vite%20%2B%20React%20%2B%20TS-blue)

## Features

| Feature | Details |
|---|---|
| **Backgrounds** | Date-seeded photo from Picsum (`picsum.photos/seed/YYYY-MM-DD/...`) — different image every day, consistent within a day. Darker overlay for legibility. |
| **Adaptive tint** | Dominant non-grey colour is sampled from the day's image via canvas and applied as a CSS variable — every glass widget picks up a hint of that colour. |
| **Live Clock** | Inter (loaded as a webfont so it renders identically on every machine), extralight weight, centre-screen, with a contextual greeting that shifts by time of day. |
| **Weather** | Temperature, feels-like, humidity, wind — Open-Meteo (no key). Compact view on mobile, full metrics on desktop. |
| **Search bar** | Collapsed icon top-right; expands on click and submits to Google in a new tab. |
| **Word of the Day** | Random sophisticated word fetched from **Datamuse** (multiple rotated query strategies for variety) → live definition from the **Free Dictionary API**. Flip card reveals meaning, example, and etymology. "Change word" button forces a fresh fetch. |
| **Fun Fact** | Live trivia from `uselessfacts.jsph.pl/api/v2`. "Another one" shuffles. |
| **Quote** | Live quote from `dummyjson.com/quotes/random`. "New quote" shuffles. |
| **Mobile-friendly** | Responsive paddings, weather bar collapses to emoji + temp + condition, search bar narrower, widgets stack. |

All content APIs are CORS-friendly and called **directly from the browser** — no proxy, no backend, no API keys.

## Quick start

```bash
cd homepage-app
npm install
npm run dev
```

Open `http://localhost:5173`.

## Set your location

Edit [`homepage-app/src/config.ts`](homepage-app/src/config.ts):

```ts
export const LOCATION = {
  lat: 12.9716,        // ← your latitude
  lon: 77.5946,        // ← your longitude
  label: 'Bengaluru, IN',
};
```

Weather is pulled from [Open-Meteo](https://open-meteo.com/) — free, no account needed.

## Deploy to a homelab

The repo includes a one-command deploy script for any Linux host running Docker.

```bash
# From the repo root on your server:
./deploy.sh
```

By default the container is named `myhomepage` and listens on port **9111**. Override the port with:

```bash
HOST_PORT=3000 ./deploy.sh
```

### What the script does

1. `git pull` (or clones if missing)
2. `docker build` inside `homepage-app/`
3. Stops & removes the previous container
4. Starts a new container with `--restart unless-stopped`

The image is a two-stage build — Node 20 Alpine compiles the Vite bundle, then Nginx Alpine serves the static files. Final image is ~25 MB.

## APIs used (all CORS-enabled, no keys)

| API | Used for |
|---|---|
| `api.open-meteo.com` | Current weather for the configured lat/lon |
| `picsum.photos` | Daily background image |
| `api.datamuse.com` | Random word source (rotated query strategies) |
| `api.dictionaryapi.dev` | Word definitions, phonetic, examples |
| `uselessfacts.jsph.pl/api/v2` | Fun fact (random) |
| `dummyjson.com/quotes/random` | Daily quote |
| Google Fonts | Inter typeface for the clock |

If any API hiccups, the widget shows a clear error pill — no silent fallbacks, no stale data.

## Project layout

```
homepage-app/
├── Dockerfile          # Two-stage Node + Nginx build
├── index.html          # Loads Inter from Google Fonts
└── src/
    ├── App.tsx         # Layout: header (weather/search), clock, widget grid
    ├── config.ts       # LOCATION (lat/lon)
    ├── components/
    │   ├── Clock.tsx
    │   ├── WeatherBar.tsx
    │   ├── SearchBar.tsx
    │   └── widgets/    # VocabWidget, FunFactWidget, QuoteWidget
    └── hooks/
        ├── useBackground.ts  # Picsum URL + dominant-colour sampling
        ├── useWeather.ts
        ├── useWordOfDay.ts
        ├── useFunFact.ts
        └── useQuote.ts
deploy.sh               # Homelab deploy script
```

## Tech stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Lucide React** icons
- **Inter** typeface (Google Fonts)
- **Nginx Alpine** — production static server
