import { useState } from 'react';

function PostCard({ post, presetHashtags }) {
  const [copied, setCopied] = useState(false);
  const hashtags = post.hashtags && post.hashtags.length > 0 ? post.hashtags : presetHashtags;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${post.caption}\n\n${hashtags.join(' ')}`.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="card" style={{ boxShadow: 'none' }}>
      <div className="sample-title">{post.title || 'Post idea'}</div>
      <div style={{ whiteSpace: 'pre-wrap', color: '#0f172a', marginBottom: 8 }}>{post.caption}</div>
      <div className="sample-hashtags">{hashtags.join(' ')}</div>
      <button className="button copy-button" onClick={handleCopy} disabled={copied}>
        {copied ? 'Copied' : 'Copy caption'}
      </button>
    </div>
  );
}

export default PostCard;
