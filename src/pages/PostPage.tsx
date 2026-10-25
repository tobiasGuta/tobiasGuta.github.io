import React, { useEffect, useState } from 'react';
import { PostItem } from '../data/postsData';

interface PostPageProps {
  post: PostItem;
  onNavigate: (path: string) => void;
}

export const PostPage: React.FC<PostPageProps> = ({ post, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const updateReadingProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress);
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
      window.removeEventListener('resize', updateReadingProgress);
    };
  }, [post.slug]);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const temp = document.createElement('input');
        temp.value = url;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
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
    <>
      <div className="reading-progress" aria-hidden="true">
        <div
          className="reading-progress-fill"
          id="reading-progress-fill"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <main className="post-page">
        <article className="post-shell">
          <header className="post-hero">
            {post.image ? (
              <div className={post.locked ? 'post-hero-image-lock-wrap' : ''}>
                <img
                  className="post-hero-image"
                  src={post.image}
                  alt={`${post.title} cover`}
                />
                {post.locked && <span className="post-hero-image-badge">[ ACCESS LOCKED ]</span>}
              </div>
            ) : post.locked ? (
              <div className="post-lock-plate" aria-hidden="true">
                <span>[ ACCESS LOCKED ]</span>
              </div>
            ) : null}

            <div className="post-hero-copy">
              <div className="post-date">{post.dateFormattedLong}</div>
              <h1>{post.title}</h1>
              {post.categories && post.categories.length > 0 && (
                <div className="post-tags">
                  {post.categories.map((cat, idx) => (
                    <span key={idx}>{cat}</span>
                  ))}
                </div>
              )}
              <button
                className="post-copy-link"
                id="copy-post-link"
                type="button"
                onClick={handleCopyLink}
              >
                {copied ? 'COPIED' : 'COPY LINK'}
              </button>
            </div>
          </header>

          {post.locked ? (
            <div className="post-content post-content-locked">
              <section className="locked-post-panel" aria-label="Locked writeup">
                <div className="locked-post-sigil">LOCKED</div>
                <h2>Private writeup stored offline</h2>
                <p>
                  This post is intentionally locked. Only the title is published on the public
                  site; the full writeup stays in a private repository for security and academic
                  integrity.
                </p>
              </section>
            </div>
          ) : (
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          )}

          <nav className="post-pager" aria-label="Writeup navigation">
            {post.previous ? (
              <a
                className="post-pager-link"
                href={post.previous.url}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(post.previous!.url);
                }}
              >
                <span>PREVIOUS</span>
                <strong>{post.previous.title}</strong>
              </a>
            ) : (
              <span className="post-pager-link post-pager-empty">
                <span>PREVIOUS</span>
                <strong>Start of archive</strong>
              </span>
            )}

            {post.next ? (
              <a
                className="post-pager-link post-pager-next"
                href={post.next.url}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(post.next!.url);
                }}
              >
                <span>NEXT</span>
                <strong>{post.next.title}</strong>
              </a>
            ) : (
              <span className="post-pager-link post-pager-empty">
                <span>NEXT</span>
                <strong>End of archive</strong>
              </span>
            )}
          </nav>
        </article>
      </main>
    </>
  );
};
