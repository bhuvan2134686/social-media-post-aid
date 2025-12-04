# Social Media Post Aid (React)
A React single-page app that turns a Facebook profile or page URL into ready-to-copy MLM-friendly post ideas. It uses OpenAI's free hosted model **gpt-4o-mini** when you supply an API key, and falls back to local sample copy otherwise.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Create `.env.local` and add your key:
   ```bash
   VITE_OPENAI_API_KEY=sk-...
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open the printed URL (default `http://localhost:5173`).

## Usage
1. Enter a Facebook profile/page URL (we **do not** scrape; it is only used inside the prompt).
2. Paste your OpenAI API key to use the hosted `gpt-4o-mini` model (or leave blank to see local drafts).
3. Adjust tone, persona, and CTA to match your brand.
4. Click **Analyze & Create Posts** to generate three captions and copy any of them.

## Customizing
- Modify the model call or swap endpoints in `src/services/openai.js`.
- Tweak the UI or presets inside `src/App.jsx`.
- Components are small and reusable (`HeroBadge`, `InsightPill`, and `PostCard`).

## Notes
- The app does not perform live scraping. It prompts a model based on your inputs.
- `gpt-4o-mini` is selected to keep requests inexpensive and within free-tier allowances where available.
- For production, secure your API key via server-side proxying instead of client-side entry.
