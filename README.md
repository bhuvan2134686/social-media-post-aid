# Social Media Post Aid (React)
A React single-page app that turns a Facebook profile or page URL into ready-to-copy MLM-friendly post ideas. It uses OpenRouter's free hosted model **openai/gpt-oss-20b:free** when you supply an API key, and falls back to local sample copy otherwise.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Create `.env.local` and add your key:
   ```bash
   VITE_OPENROUTER_API_KEY=sk-...
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open the printed URL (default `http://localhost:5173`).

## Usage
1. Enter a Facebook profile/page URL (we **do not** scrape; it is only used inside the prompt).
2. Paste your OpenRouter API key to use the hosted `openai/gpt-oss-20b:free` model (or leave blank to see local drafts).
3. Adjust tone, persona, and CTA to match your brand.
4. Click **Analyze & Create Posts** to generate three captions and copy any of them.

## Customizing
- Modify the model call or swap endpoints in `src/services/openai.js`.
- Tweak the UI or presets inside `src/App.jsx`.
- Components are small and reusable (`HeroBadge`, `InsightPill`, and `PostCard`).

## Notes
- The app does not perform live scraping. It prompts a model based on your inputs.
- `openai/gpt-oss-20b:free` via OpenRouter is selected to keep requests within a free allowance while available.
- For production, secure your API key via server-side proxying instead of client-side entry.
## OpenRouter free model guidance
- OpenRouter hosts a free tier for `openai/gpt-oss-20b:free`; availability can change, and usage may be limited by caps or queueing.
- You still need an OpenRouter API key; create one in your OpenRouter dashboard and paste it into the app or `.env.local`.
- If you swap the `model` value in `src/services/openai.js`, check [OpenRouter's model list](https://openrouter.ai/models) to confirm pricing and whether a free tier exists.
