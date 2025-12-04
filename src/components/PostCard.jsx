import { useState } from 'react';

function PostCard({ post, presetHashtags, onRemoveHashtag }) {
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
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {hashtags.map((tag, idx) => (
          <span 
            key={idx}
            className="badge"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              cursor: onRemoveHashtag ? 'pointer' : 'default',
              position: 'relative'
            }}
            onClick={() => onRemoveHashtag && onRemoveHashtag(tag)}
            title={onRemoveHashtag ? 'Click to remove' : undefined}
          >
            {tag}
            {onRemoveHashtag && (
              <span style={{ 
                marginLeft: 4,
                fontSize: '12px',
                opacity: 0.6
              }}>×</span>
            )}
          </span>
        ))}
      </div>
      <button className="button copy-button" onClick={handleCopy} disabled={copied}>
        {copied ? 'Copied' : 'Copy caption'}
      </button>
    </div>
  );
}

export default PostCard;
