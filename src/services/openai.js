const SYSTEM_PROMPT = `You are a social media ghostwriter specializing in MLM-friendly content.
- Keep captions conversational, warm, and concise.
- Avoid making up Facebook profile details. Use only what the prompt provides.
- Include a gentle CTA in at least one caption.
- Return tightly formatted JSON with fields: posts[{title, caption, hashtags[]}].`;

function parseResponse(text, fallbackHashtags) {
  try {
    const parsed = JSON.parse(text);
    if (parsed && Array.isArray(parsed.posts)) {
      return parsed.posts.map((post, idx) => ({
        title: post.title || `Post idea ${idx + 1}`,
        caption: post.caption || '',
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : fallbackHashtags
      }));
    }
  } catch (err) {
    // fall through
  }
  return [];
}

function buildFallbackPosts(prompt, fallbackHashtags) {
  const titles = ['Morning momentum', 'Soft invite', 'Community check-in'];
  return titles.map((title, idx) => ({
    title,
    caption: `${prompt}\n\nSample ${idx + 1}: Keep it upbeat, speak directly to your community, and close with a light CTA.`,
    hashtags: fallbackHashtags
  }));
}

export async function generatePostsWithOpenAI({ apiKey, prompt, fallbackHashtags, url }) {
  if (!apiKey) {
    return buildFallbackPosts(prompt, fallbackHashtags);
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.6,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `${prompt}\nUse the URL as context: ${url}. Return JSON only.`
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'OpenAI request failed');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  const parsed = parseResponse(content, fallbackHashtags);
  return parsed.length > 0 ? parsed : buildFallbackPosts(prompt, fallbackHashtags);
}
