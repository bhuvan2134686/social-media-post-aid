import { useMemo, useState } from 'react';
import { generatePostsWithOpenAI } from './services/openai.js';
import HeroBadge from './components/HeroBadge.jsx';
import PostCard from './components/PostCard.jsx';
import InsightPill from './components/InsightPill.jsx';

const presetInsights = [
  'Daily gratitude with family photos',
  'Productivity hacks + morning routines',
  'Highlighting side-hustle wins',
  'Friendly CTA to DM for next steps'
];

const presetHashtags = ['#momentum', '#MLMlife', '#dailywins', '#bossenergy'];

const fallbackPosts = (
  url,
  vibe,
  custom
) => `You run a Facebook page at ${url}. Create 3 concise, high-energy captions for MLM style posts that feel ${vibe}. Blend in these notes: ${
  custom || 'consistent posting cadence, warm tone, soft CTA'
}. Include hashtags.`;

function App() {
  const [facebookUrl, setFacebookUrl] = useState('https://www.facebook.com/example');
  const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_OPENROUTER_API_KEY || '');
  const [persona, setPersona] = useState('Warm, collaborative, goal-driven');
  const [cta, setCta] = useState('Invite readers to DM “GO” to learn about the product drop.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [tone, setTone] = useState('Uplifting & social-proof driven');

  const prompt = useMemo(
    () => fallbackPosts(facebookUrl, tone, `${persona}. CTA: ${cta}`),
    [facebookUrl, tone, persona, cta]
  );

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const nextPosts = await generatePostsWithOpenAI({
        apiKey: apiKey.trim(),
        prompt,
        fallbackHashtags: presetHashtags,
        url: facebookUrl
      });
      setPosts(nextPosts);
    } catch (err) {
      setError(err.message || 'Could not generate posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="card header" style={{ marginBottom: 16 }}>
        <HeroBadge label="MLM-ready" />
        <div>
          <h1 style={{ margin: '0 0 8px' }}>Social Media Post Aid</h1>
          <div className="small">
            Plug in a Facebook profile or page URL. We won’t scrape; we’ll shape a prompt and
            call OpenRouter’s free hosted model (<code>openai/gpt-oss-20b:free</code>) when you provide an API key.
          </div>
        </div>
      </header>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="banner" style={{ marginBottom: 20 }}>
          <div>
            <strong>Ready for production?</strong>
            <div className="small">
              Swap prompts, tone, or CTA; wire your OpenRouter API key; or replace the generator in
              <code> src/services/openai.js</code> for a custom model endpoint.
            </div>
          </div>
          <div className="cta">Highly editable React components</div>
        </div>

        <div className="toolbar">
          <div>
            <div className="label">Facebook profile or page URL</div>
            <input
              className="input"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://www.facebook.com/your-page"
            />
            <div className="small">We do not scrape the URL—used only to anchor the prompt.</div>
          </div>
          <div>
            <div className="label">OpenRouter API key (optional for live generations)</div>
            <input
              className="input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              type="password"
            />
            <div className="small">Targets <code>openai/gpt-oss-20b:free</code> to stay on a free allowance.</div>
          </div>
        </div>

        <hr className="section-divider" />

        <div className="toolbar" style={{ marginBottom: 12 }}>
          <div>
            <div className="label">Tone</div>
            <input
              className="input"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="Uplifting, social proof, steady cadence"
            />
          </div>
          <div>
            <div className="label">Persona</div>
            <input
              className="input"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="Friendly founder, loves check-ins, team wins"
            />
          </div>
          <div>
            <div className="label">CTA</div>
            <input
              className="input"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="Drop a word or emoji CTA"
            />
          </div>
        </div>

        <div>
          <div className="label">Prompt we send the model</div>
          <textarea className="input" value={prompt} readOnly />
          <div className="small">
            Want different formatting? Adjust the prompt above or edit the system prompt in
            <code> openai.js</code>.
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            className="button copy-button"
            style={{ maxWidth: 260, marginTop: 0 }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Analyze & Create Posts'}
          </button>
          <div className="small">
            Need local-only drafts? Leave the API key blank and we will fabricate sample posts.
          </div>
        </div>
        {error ? (
          <div style={{ color: '#b91c1c', marginTop: 10, fontWeight: 600 }}>{error}</div>
        ) : null}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">
          <span>1</span> Profile vibe (editable)
        </div>
        <div className="grid">
          {presetInsights.map((insight) => (
            <InsightPill key={insight} label={insight} />
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">
          <span>2</span> Suggested hashtags
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {presetHashtags.map((tag) => (
            <span key={tag} className="badge">{tag}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">
          <span>3</span> Draft posts ready to copy
        </div>
        {posts.length === 0 ? (
          <div className="small">Click “Analyze & Create Posts” to see fresh drafts.</div>
        ) : null}
        <div className="grid" style={{ marginTop: 8 }}>
          {posts.map((post, index) => (
            <PostCard key={index} post={post} presetHashtags={presetHashtags} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
