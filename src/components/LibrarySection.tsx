import React, { useState, useMemo } from 'react';
import { postsData, PostItem } from '../data/postsData';

interface LibrarySectionProps {
  onSelectPost: (post: PostItem) => void;
}

export const LibrarySection: React.FC<LibrarySectionProps> = ({ onSelectPost }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    postsData.forEach(p => {
      p.categories.forEach(c => set.add(c.trim()));
    });
    return ['all', ...Array.from(set).sort()];
  }, []);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return postsData.filter(post => {
      const matchesCategory =
        activeCategory === 'all' || post.categories.includes(activeCategory);
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.categories.some(c => c.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  const cleanCardExcerpt = (text: string) => {
    return text
      .replace(/^>\s*/gm, '')
      .replace(/^[#*`_\[\]\s>]+/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <section id="library" className="atlas-section" aria-label="The Library">
      <div className="section-head">
        <div className="section-kicker">03 // THE LIBRARY &amp; FIELD REPORTS</div>
        <h2 className="section-title">Knowledge Archive &amp; Laboratory Logs</h2>
        <p className="section-subtitle">
          Methodical notes from capture-the-flag competitions, exploit teardowns, digital forensics investigations, and security architecture.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="search"
            placeholder="Search notes, vulnerabilities, or techniques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ maxWidth: '440px', flex: '1 1 280px' }}
            aria-label="Search library writeups"
          />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-ink-muted)',
              letterSpacing: '0.08em',
            }}
          >
            SHOWING {filteredPosts.length} OF {postsData.length} FIELD ENTRIES
          </div>
        </div>

        <div className="filter-bar" role="tablist" aria-label="Filter Categories">
          {categories.slice(0, 10).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
            >
              {cat.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid */}
      <div className="library-grid">
        {filteredPosts.map((post) => (
          <div
            key={post.slug}
            className="library-card"
            onClick={() => onSelectPost(post)}
            role="button"
            tabIndex={0}
            aria-label={`Read field report: ${post.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectPost(post);
              }
            }}
          >
            <div>
              <div className="card-header-meta">
                <span>{post.dateFormatted}</span>
                {post.locked ? (
                  <span style={{ color: 'var(--color-ink-muted)' }}>[OFFLINE]</span>
                ) : (
                  <span>{post.categories[0] || 'REPORT'}</span>
                )}
              </div>

              <h3 className="card-title">{post.title}</h3>

              <p className="card-excerpt">
                {post.locked
                  ? 'Internal laboratory writeup stored offline in private repository archives.'
                  : cleanCardExcerpt(post.excerpt)}
              </p>
            </div>

            <div>
              <div className="card-tags">
                {post.categories.slice(0, 3).map((tag, i) => (
                  <span key={i}>#{tag}</span>
                ))}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--color-terracotta)',
                  letterSpacing: '0.08em',
                  marginTop: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                READ FIELD REPORT →
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div
          style={{
            padding: '3rem 1rem',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--color-ink-muted)',
          }}
        >
          No field notes matching "{search}" were found.
        </div>
      )}
    </section>
  );
};
