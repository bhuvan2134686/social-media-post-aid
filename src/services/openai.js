const SYSTEM_PROMPT = `You are a social media ghostwriter specializing in MLM-friendly content.
- Keep captions conversational, warm, and concise.
- Avoid making up Facebook profile details. Use only what the prompt provides.
- Include a gentle CTA in at least one caption.
- Return tightly formatted JSON with fields: posts[{title, caption, hashtags[]}].`;

function parseResponse(text, fallbackHashtags) {
  try {
    // Strip markdown code blocks if present (```json ... ```)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```')) {
      // Remove opening ```json or ```
      cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/, '');
      // Remove closing ```
      cleanedText = cleanedText.replace(/\n?```\s*$/, '');
    }
    
    const parsed = JSON.parse(cleanedText);
    if (parsed && Array.isArray(parsed.posts)) {
      return parsed.posts.map((post, idx) => ({
        title: post.title || `Post idea ${idx + 1}`,
        caption: post.caption || '',
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : fallbackHashtags
      }));
    }
  } catch (err) {
    console.error('Failed to parse response:', err);
    console.error('Raw content:', text);
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

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
      'X-Title': 'Social Media Post Aid'
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b:free',
      temperature: 0.6,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `${prompt}\nReturn JSON only.`
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'OpenRouter request failed');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  console.log('📥 Raw API response content:', content);
  const parsed = parseResponse(content, fallbackHashtags);
  console.log('✅ Parsed posts:', parsed);
  if (parsed.length === 0) {
    console.warn('⚠️ No posts parsed, using fallback');
  }
  return parsed.length > 0 ? parsed : buildFallbackPosts(prompt, fallbackHashtags);
}
