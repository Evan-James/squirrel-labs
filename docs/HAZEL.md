# Hazel, your squirrel guide

Hazel lives in the **Ask Hazel** button at the bottom-right of the website. She helps visitors find service information and the quote form. She is an automated guide, not a live staff member.

## Where to add knowledge

Edit **`content/hazel-knowledge.md`** in this project. This is the source of truth for Hazel's answers. You do not need to edit the chatbot component to change business information.

Each topic has a heading, search keywords, a website link and an approved answer:

```markdown
## Your topic
Keywords: common question, another phrase, relevant keyword
Link: #quote | Ask about this service

Write the answer Hazel is allowed to give here. Use plain paragraphs and only confirmed facts.
```

1. Update an existing answer or copy this format to add a new topic.
2. Add the words and phrases customers use to the comma-separated `Keywords:` line. Whole words and phrases are matched; this is not a semantic search engine.
3. Point `Link:` at an existing page section: `#websites`, `#ai`, `#automation`, `#quote`, `#lab`, `#your-business`, `#experiments` or `#try-the-lab`.
4. Save the file and try the relevant questions in Hazel on the local website. Ask me to publish the changes when ready. The hosted site's knowledge changes on the next build and deployment, not simply when the local file is saved.

The Markdown preamble above the first `##` heading is for you; it is not included in answers. Keep `Keywords:` and `Link:` on separate lines. Use a unique heading for each topic. This first version works best with a concise FAQ; it does not crawl websites or ingest PDF uploads automatically.

## What to fill in next

The starter knowledge covers your three services, Australia-wide service area and how to enquire. Add confirmed pricing guidance, delivery expectations, contact details, supported tools and ongoing support arrangements when you have them. Current answers openly say when these details are not published. CRM setup and CRM integration are explicitly excluded.

Only put public business information in this file. Do not add credentials, confidential client information or private internal notes: the content is intended to become visitor-facing answers.

## How Hazel answers now

No external AI key is currently configured. Hazel matches the question to a topic and returns its approved answer. Short follow-up questions such as "tell me more about that" can use the previous visitor question. When no topic matches, she says the information is missing and offers the quote form. Answers display **From our knowledge base**. This mode works without an API subscription.

The hero's sample AI assistant remains a separate demonstration. Hazel is the persistent site-wide chat guide using this knowledge file.

## Optional AI replies

The server already supports OpenAI's Responses API. To enable it, configure **`OPENAI_API_KEY` as a secret runtime environment variable** for this existing Site, then redeploy. `OPENAI_MODEL` is optional and defaults to `gpt-4.1-mini`. Production Site runtime variables are separate from local files. Ask me to help configure the Site's secret settings; do not paste a key into chat, the knowledge file or client-side code.

For local development only, create an ignored `.dev.vars` file in the project root:

```dotenv
OPENAI_API_KEY=your-key-goes-here
OPENAI_MODEL=gpt-4.1-mini
```

Restart the local development server after changing these values. Never commit `.dev.vars`. Configure your provider's spending limits before using paid AI. The endpoint has a small per-worker burst guard, which is not a global spending cap.

When enabled, only the recent conversation (up to eight messages) and matching approved knowledge are sent to OpenAI. The request disables Responses API application-state storage with `store: false`; this is not a promise of zero provider retention. The site itself does not save chat messages to its database or browser storage. The conversation resets on reload or **Start a new conversation**. If the provider is unavailable, Hazel falls back to the approved knowledge answer.

The AI path is implemented but has not been tested against a live paid account because no key was provided. Its request format, response parsing and failure handling are tested with a mock provider. See [OpenAI text generation documentation](https://developers.openai.com/api/docs/guides/text) for the API used.

## Implementation and checks

- `components/hazel-chat.tsx`: chat interface and squirrel identity.
- `app/hazel-chat.css`: mobile and desktop styling.
- `content/hazel-knowledge.md`: editable approved knowledge.
- `lib/hazel-knowledge.ts`: Markdown parsing and topic matching.
- `lib/hazel-ai.ts`: optional server-side provider request.
- `app/api/chat/route.ts`: input validation, same-origin check and answer endpoint.

Run `node --experimental-strip-types scripts/check-hazel.mjs` for knowledge and provider-contract checks. With the local site running, run `node scripts/check-chat-api.mjs` for endpoint checks.
