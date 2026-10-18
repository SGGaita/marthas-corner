# Martha's Learning Corner

Tap-and-listen lessons for pre-schoolers (ages 3–5), built as an installable, offline-first PWA.

**Stack:** Next.js 16 (App Router, JavaScript) · MUI 9 · no backend. Stars are saved in the browser on each device.

## Lessons
Numbers 1–20 · Counting by tens · Count the objects · Alphabet A–Z · Three-letter words (with a spelling game) · Colours · Shapes · Animal sounds · My body · Days of the week · Planets

Each lesson has **Explore** (tap to hear) and a game (**Find it!** / **Spell it!**). A round is 10 stars.

## Run it
```bash
npm install
npm run dev                  # http://localhost:3000  (service worker is OFF in dev)
npm run build && npm start   # production mode, service worker ON
```

## Deploy (Vercel)
Push to GitHub and import the repo at vercel.com, or run `npx vercel`. No settings needed.
A PWA only installs over HTTPS, which Vercel provides.

## How offline works
- `app/sw.js/route.js` generates `/sw.js` at build time with the list of every page (from `lib/lessons.js`) and a fresh cache version per build.
- On install, the service worker downloads **every page**, then every script, stylesheet and font those pages use, plus the icons and manifest.
- Pages are served from the cache first (instant, offline) and refreshed in the background when online.
- Navigation uses plain links (full page loads), so every route is served straight from the cache.
- Fonts are bundled in `app/fonts` (Baloo 2 + Nunito, SIL Open Font License), not fetched from Google.
- Speech uses the device's built-in voice; on most phones and tablets that also works offline.

To test offline: `npm run build && npm start`, open the site once, then in Chrome DevTools → Application → Service Workers tick **Offline** and visit any lesson.

## Install on a tablet/phone
- **Android (Chrome):** open the site → menu → *Install app* / *Add to Home screen*.
- **iPhone/iPad (Safari):** Share → *Add to Home Screen*.

## Adding a lesson
1. Add an object to `LESSONS` in `lib/lessons.js` (see the comment at the top for the shape).
2. Rebuild. The new page is generated and added to the offline cache automatically.

## Project map
```
app/
  layout.js            fonts, theme, metadata, service-worker registration
  page.js              home (lesson menu)
  lesson/[id]/page.js  one static page per lesson
  manifest.js          PWA manifest
  sw.js/route.js       service worker (precaches every page)
  fonts/               bundled woff2 fonts
components/            HomeScreen, LessonScreen, Celebration, Providers, RegisterSW, StarShape
lib/
  lessons.js           all lesson content
  planets.js           cartoon planet drawings (SVG) + planet facts
  speech.js            text-to-speech queue
  progress.js          stars in localStorage
  theme.js / tokens.js MUI theme, crayon colours (light + dark)
public/icons/          app icons (regenerate with `npm run icons`)
```
