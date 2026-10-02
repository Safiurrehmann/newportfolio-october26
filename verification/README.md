# Verification — 1 October 2026

## Automated

- `npm run build`: TypeScript check and production bundle passed.
- `npm test`: 14 tests passed. Includes curated answers, unknown facts, private-prompt requests, input and role validation, mocked AI failure and structured responses, destination allowlisting, HTTP rate limits, continuous/reversible non-overlapping scroll panels, avatar motion limits, and angled-image coverage.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities reported.
- Production HTTP smoke check: homepage, API status, and résumé all return 200; résumé is served as application/pdf (130,248 bytes).

## Browser checks

- Production build opened at http://localhost:4319.
- Desktop layout inspected at 1440 × 900; mobile layout inspected at 390 pixels and the default narrow browser size. No horizontal document overflow at the checked widths.
- Single canvas confirmed; all six components appear and converge in the final chapter.
- Chapter navigation tested with pointer and keyboard. Component explanation, pause, and resume tested. Label positions remain stable while paused.
- Mobile menu opens, navigates, and closes.
- Clicky case study expands, collapses, re-expands, and opens through a direct hash link.
- Fixed a reveal regression: React updates to the project class no longer remove the persistent reveal marker.
- Light/dark theme switching checked.
- Bip opens, accepts suggested and typed questions, provides the August 2026 job date, and navigates from its Clicky answer into the expanded project. Escape dismisses the panel.
- Production page produced no captured console errors. Development hot-reload errors during formatting were cleared by a full reload before production checks.

Screenshots: `desktop-hero.png`, `desktop-assembly.png`, `mobile-hero.png`.

## Interactive avatar

- The supplied portrait is optimized to a 512 × 512 local PNG and displayed before the hero name.
- Pointer tracking updates capped perspective tilt, shine, and eye highlights without moving the surrounding copy.
- Pointer and keyboard activation trigger the blink animation.
- Scroll progress applies a small scale, offset, corner-radius, and rotation morph; the full change remains within 16% scale, 8 pixels horizontal movement, 3 pixels vertical movement, and 8 degrees rotation.
- Reduced-motion mode keeps the original static form.
- Browser checks confirmed the avatar at desktop and 390-pixel mobile layouts with no horizontal overflow or console warnings.
- The image now overscans behind the avatar's clipped outer mask, preventing its background from separating at strong perspective angles.
- Automated tests cover clamping, subtle motion limits, the reduced-motion state, and sufficient tilt overscan. Screenshots: `interactive-avatar-mobile.png`, `avatar-tilt-fixed.png`.

## Not yet verified

Live AI answers (no API credentials configured), real mobile hardware, a full assistive-technology audit, and public hosting/domain integration. Reduced-motion and WebGL fallback paths are implemented but have not been exercised through device emulation. The site is running locally, not publicly deployed.

## Opening interaction refinement

The opening now uses persistent, clipped text panels that slide directly with scroll position, rather than remounting copy at fixed chapter thresholds. The name remains prominent and stationary, the assembly indicator fills continuously, and core rotation reacts to scroll. The story is shorter. Mid-transition mobile checks confirmed that the two neighboring text panels touch without overlapping; inactive panels are inert and excluded from accessibility navigation. Reduced-motion state selection is covered by automated tests.
