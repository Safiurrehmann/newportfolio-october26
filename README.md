# Safi — Intelligence, engineered.

Personal AI-engineering portfolio for Muhammad Safi ur Rehman. React, TypeScript, Vite, Three.js, and a small Node/Express backend. The site lives separately from the Clicky application.

## Run locally

Requires Node 22.12 or newer.

```sh
npm install
npm run dev
```

Visit http://localhost:5173. Vite proxies `/api` to the Bip server on port 4318.

```sh
npm test
npm run build
npm start
```

The production server serves the built website and Bip at http://localhost:4318. Set `HOST=0.0.0.0` for a container/service and `PORT` for the hosting environment. Deploy the Node service behind HTTPS.

## The experience

- One real Three.js core, orbiting harness components, and a reversible scroll-driven assembly. The same components settle into a complete architectural representation.
- Native document scrolling; no nested scroll area or scroll interception. Chapter buttons and a skip link provide direct navigation.
- Layer controls explain each component. Pause, reduced-motion, offscreen rendering suspension, a GPU failure fallback, and responsive layouts are included.
- Minimal typography and rules instead of information cards. Five expandable case studies support direct hash links.
- Experience, skills, contact, working social links, clipboard email, a local résumé download, and locally hosted fonts.
- Bip is a small original CSS character with an accessible conversation panel and portfolio navigation.

## Enable Bip's AI answers

The portfolio works immediately in **built-in guide mode**. It retrieves curated answers from `shared/knowledge.mjs` and clearly labels that no live AI is connected. Free-text questions, suggested questions, and section navigation work without credentials.

To enable live model answers, create `.env` from `.env.example`, set `OPENAI_API_KEY` and `OPENAI_MODEL` to a Responses-compatible model available in your API account, and restart the server. Keep these values server-side; never prefix the key with `VITE_`. No paid model call is made unless both values are configured.

The backend uses the [Responses API structured-output format](https://developers.openai.com/api/docs/guides/structured-outputs), passes approved portfolio facts, sets `store: false`, validates destination IDs, bounds input/history, and falls back to curated answers on provider failure. It has per-address rate limits, an in-memory daily request ceiling, and timeouts. The application does not persist conversations or log message bodies. Provider retention is governed by the API account's terms; `store: false` is not a promise of zero retention. The chat discloses when questions go to OpenAI.

For deployment, set `SITE_ORIGIN` to the actual site origin and an appropriate `BIP_DAILY_LIMIT`. With multiple instances, use a shared rate-limit/quota store and configure the hosting proxy trust explicitly. The included in-memory budget resets on restart. Set provider-side spending limits as well.

## Edit the content

- `src/content.ts`: project case studies, social URLs, and scene narrative.
- `src/App.tsx`: experience, about, and toolkit content.
- `shared/knowledge.mjs`: Bip's approved facts and allowlisted navigation.
- `public/resume.pdf`: approved résumé with embedded LinkedIn and Twitter links.
- `src/styles.css`: visual system and responsive styles.
- `src/HarnessScene.tsx`: the single 3D scene.

No fabricated availability, employer metrics, or public repository/demo links are included. Clicky evidence is qualified by the build report. The final scene is explicitly an illustrative architecture, not a live estimate.

## Before public launch

Set the real domain, canonical URL, absolute social image URL, and sitemap for that domain. The included SVG social art should be exported as PNG for the widest social-card support. Review employer-specific content for publication and configure Bip's server environment if live AI is desired. There is no tracking or analytics by default.

## Verification

`npm run build` performs TypeScript checking and production bundling. `npm test` covers the guide, unsupported requests, role/input boundaries, AI failure fallback, destination validation, response request construction, and HTTP rate limiting. Live AI responses require a configured key and model and must be evaluated before public launch; mocked-provider checks do not establish live-model quality.
