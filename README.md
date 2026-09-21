# Squirrel Labs

An original eleven-chapter illustrated story: the lead that almost got away.

## Development
React, TypeScript, Tailwind, GSAP/ScrollTrigger and Next.js-compatible Vinext. Node 22.13+.

Open the hosted site in any browser: https://squirrel-labs-story.sumawangevanjames.chatgpt.site . It is private; use the owner's signed-in account.

For local Windows development, open PowerShell in this directory and run `node scripts/run-framework.mjs dev` (or `./start-local.ps1`). Open http://localhost:5173 and leave the terminal running. Press Ctrl+C to stop. Dependencies are already installed in this checkout; on a fresh checkout run `npm.cmd ci` first. Do not double-click the source files as HTML. On a phone, use the hosted link; localhost refers to the device where the server is running.

- `npm ci`
- `npm run dev`
- `npm run build`

## Enquiries
`POST /api/quote` validates form data and saves it to the Sites D1 `DB` binding. UUID request keys make retries idempotent. There is no public endpoint exposing enquiries. Generate schema changes with `npm run db:generate`; Sites applies the committed migrations during deployment.

Email notifications are not connected yet. The owner must provide the destination and service configuration before public launch. Privacy/terms content is introductory and needs the business's final details. No social destinations were supplied, so no invented profiles are linked.

## Artwork
Eight original assets were created with built-in GPT Image, starting from a master squirrel design. Exact prompts and reference relationships are in `design/prompt-manifest.json`. Optimized responsive WebP assets are in `public/images`. Original PNGs are preserved in the sibling `squirrel-labs-artwork` folder.

## Verification
Production build and TypeScript check passed. Desktop/mobile browser checks cover the story, service details, prototype input/output and quote handoff. A full sample quote was persisted to the local D1 database. Invalid email, cross-origin submissions, a filled honeypot and retry handling were checked with `scripts/check-quote.mjs`. Retry row count was verified separately. The six experiment dialogs are clearly labelled browser simulations; they do not call AI services or send messages.

## Motion
`app/mobile.css` is the default phone-first design, with a tablet enhancement at 600px. `app/desktop.css` adds the larger composition at 900px. Phones use normal document-flow scenes, 44–56px touch controls, 16px form inputs, bottom-sheet dialogs and focused form-step navigation. The desktop GSAP modules load only when the viewport and motion preference allow them. Native scroll is preserved. All essential copy stays in HTML.
