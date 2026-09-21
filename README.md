# Squirrel Labs

An original eleven-chapter illustrated story: the lead that almost got away.

## Development
React, TypeScript, Tailwind, GSAP/ScrollTrigger and Next.js-compatible Vinext. Node 22.13+.

- `npm ci`
- `npm run dev`
- `npm run build`

## Enquiries
`POST /api/quote` validates form data and saves it to the Sites D1 `DB` binding. UUID request keys make retries idempotent. There is no public endpoint exposing enquiries. Generate schema changes with `npm run db:generate`; Sites applies the committed migrations during deployment.

Email/CRM routing is not connected yet. The owner must provide the destination and service configuration before public launch. Privacy/terms content is introductory and needs the business's final details. No social destinations were supplied, so no invented profiles are linked.

## Artwork
Eight original assets were created with built-in GPT Image, starting from a master squirrel design. Exact prompts and reference relationships are in `design/prompt-manifest.json`. Optimized responsive WebP assets are in `public/images`. Original PNGs are preserved in the sibling `squirrel-labs-artwork` folder.

## Verification
Production build and TypeScript check passed. Desktop/mobile browser checks cover the story, service details, prototype input/output and quote handoff. A full sample quote was persisted to the local D1 database. Invalid email, cross-origin submissions, a filled honeypot and retry handling were checked with `scripts/check-quote.mjs`. Retry row count was verified separately. The six experiment dialogs are clearly labelled browser simulations; they do not call AI services or send messages.

## Motion
Animations enhance server-rendered narrative text. Reduced motion, small screens and shorter landscape screens use the static narrative. Native scroll is preserved. All essential copy stays in HTML.
