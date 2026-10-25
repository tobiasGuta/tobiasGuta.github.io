import React, { useEffect, useState, useRef } from 'react';
import { PostItem } from '../data/postsData';

interface ArticleViewProps {
  post: PostItem;
  onBack: () => void;
  onNavigatePost: (urlOrSlug: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ post, onBack, onNavigatePost }) => {
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const articleBodyRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [post.slug]);

  // Typeset mathematics via KaTeX if math: true or present
  useEffect(() => {
    const triggerKaTeX = () => {
      const renderMath = (window as any).renderMathInElement;
      if (typeof renderMath === 'function' && articleBodyRef.current) {
        renderMath(articleBodyRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
          ],
          throwOnError: false,
        });
      }
    };

    triggerKaTeX();
    const timer = setTimeout(triggerKaTeX, 300);
    const timer2 = setTimeout(triggerKaTeX, 1000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [post.slug, post.contentHtml]);

  // Attach click-to-copy handler to any pre / code copy buttons inside rendered article
  useEffect(() => {
    if (!articleBodyRef.current) return;
    const buttons = articleBodyRef.current.querySelectorAll('.copy-btn');
    buttons.forEach((btn) => {
      const handleBtnClick = (e: Event) => {
        e.preventDefault();
        const container = (btn as HTMLElement).closest('.code-block-container');
        const code = container?.querySelector('code');
        if (code) {
          navigator.clipboard.writeText(code.textContent || '');
          const originalHtml = btn.innerHTML;
          btn.innerHTML = '<span style="font-size: 11px; font-family: monospace;">COPIED</span>';
          setTimeout(() => {
            btn.innerHTML = originalHtml;
          }, 1500);
        }
      };
      btn.addEventListener('click', handleBtnClick);
    });
  }, [post.slug, post.contentHtml]);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const temp = document.createElement('input');
        temp.value = url;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="article-reading-container">
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} />

      <div style={{ marginBottom: '2.5rem' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            color: 'var(--color-ink-secondary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: 0,
          }}
        >
          <span>←</span>
          <span>RETURN TO THE LIBRARY</span>
        </button>
      </div>

      <header className="article-header">
        <div className="kicker-label">
          FIELD REPORT // {post.categories[0] || 'RESEARCH NOTE'}
        </div>

        <h1 className="article-title">{post.title}</h1>

        <div className="article-meta-row">
          <div>
            <span>{post.dateFormattedLong}</span>
            {post.categories && post.categories.length > 0 && (
              <>
                <span style={{ margin: '0 0.5rem' }}>·</span>
                <span>{post.categories.join(' · ')}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              padding: '0.35rem 0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: copied ? 'var(--color-terracotta)' : 'var(--color-ink)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? 'COPIED TO CLIPBOARD' : 'SHARE LINK ↗'}
          </button>
        </div>
      </header>

      {post.locked ? (
        <div
          style={{
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-subtle)',
            padding: '3rem 2rem',
            textAlign: 'center',
            margin: '2rem 0',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: 'var(--color-terracotta)',
              letterSpacing: '0.12em',
              marginBottom: '1rem',
            }}
          >
            [ PRIVATE RESEARCH // STORED OFFLINE ]
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              color: 'var(--color-ink)',
              marginBottom: '0.75rem',
            }}
          >
            Internal Laboratory Record
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: 'var(--color-ink-secondary)',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            This writeup is cataloged in private archival storage for security sensitivity and responsible disclosure requirements. The publication title and tags are retained for bibliographic indexing.
          </p>
        </div>
      ) : (
        <article
          ref={articleBodyRef}
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      )}

      {/* Article Pager */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          marginTop: '4rem',
          paddingTop: '2.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
        }}
      >
        <div>
          {post.previous && (
            <div
              onClick={() => onNavigatePost(post.previous!.url)}
              style={{ cursor: 'pointer' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--color-terracotta)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                ← PREVIOUS ENTRY
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  color: 'var(--color-ink)',
                  fontWeight: 500,
                }}
              >
                {post.previous.title}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          {post.next && (
            <div
              onClick={() => onNavigatePost(post.next!.url)}
              style={{ cursor: 'pointer' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--color-terracotta)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                NEXT ENTRY →
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  color: 'var(--color-ink)',
                  fontWeight: 500,
                }}
              >
                {post.next.title}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
