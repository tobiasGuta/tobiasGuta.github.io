import React, { useState, useMemo } from 'react';
import { postsData, PostItem } from '../data/postsData';
import { WriteupCard } from '../components/WriteupCard';

interface WriteupsPageProps {
  onNavigate: (path: string) => void;
}

export const WriteupsPage: React.FC<WriteupsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique categories and group posts
  const { categoriesMap, sortedCategoryNames } = useMemo(() => {
    const map: Record<string, PostItem[]> = {};
    postsData.forEach(post => {
      post.categories.forEach(cat => {
        const key = cat.trim();
        if (!key) return;
        if (!map[key]) {
          map[key] = [];
        }
        if (!map[key].some(p => p.slug === post.slug)) {
          map[key].push(post);
        }
      });
    });

    const sortedNames = Object.keys(map).sort((a, b) => a.localeCompare(b));
    return { categoriesMap: map, sortedCategoryNames: sortedNames };
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    return sortedCategoryNames.map(catName => {
      const posts = categoriesMap[catName];
      const matches = !query
        ? posts
        : posts.filter(
            p =>
              p.title.toLowerCase().includes(query) ||
              p.excerpt.toLowerCase().includes(query) ||
              p.categories.some(c => c.toLowerCase().includes(query))
          );
      return {
        name: catName,
        posts: matches,
      };
    }).filter(group => group.posts.length > 0 || !query);
  }, [sortedCategoryNames, categoriesMap, query]);

  const totalVisiblePosts = useMemo(() => {
    const set = new Set<string>();
    filteredCategories.forEach(cat => {
      cat.posts.forEach(p => set.add(p.slug));
    });
    return set.size;
  }, [filteredCategories]);

  return (
    <main className="writeups-page">
      <section className="writeups-intro section-block projects-block">
        <div className="section-header projects-header">
          <span>✦</span>
          <h2 className="projects-title">POST INDEX</h2>
        </div>
        <div className="section-content">
          <div className="writeups-stats">
            {sortedCategoryNames.map(catName => (
              <a
                key={catName}
                href={`#cat-${catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                style={{ textTransform: 'capitalize' }}
              >
                {catName.replace(/-/g, ' ')}{' '}
                <span>{categoriesMap[catName].length}</span>
              </a>
            ))}
          </div>

          <p className="writeups-note">
            Writeups from CTFs, penetration testing labs, vulnerability research, and security engineering.
          </p>

          <div className="writeup-search">
            <div className="writeup-search-topline">
              <label htmlFor="writeup-search-input">SEARCH WRITEUPS</label>
              <span className="writeups-feed-link" style={{ cursor: 'pointer' }}>
                {totalVisiblePosts} writeup{totalVisiblePosts === 1 ? '' : 's'}
              </span>
            </div>
            <input
              id="writeup-search-input"
              type="search"
              placeholder="type title, tag, or keyword..."
              autoComplete="off"
              spellCheck={false}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {totalVisiblePosts === 0 && (
            <div className="writeup-search-empty visible" style={{ display: 'block', margin: '20px 0' }}>
              No matching writeups found.
            </div>
          )}
        </div>
      </section>

      {filteredCategories.map(catGroup => {
        if (catGroup.posts.length === 0) return null;
        const slugId = `cat-${catGroup.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        return (
          <section className="writeup-category" id={slugId} key={catGroup.name}>
            <div className="section-header projects-header">
              <span>◆</span>
              <h2 className="projects-title" style={{ textTransform: 'uppercase' }}>
                {catGroup.name.replace(/-/g, ' ')}
              </h2>
            </div>
            <div className="writeup-grid">
              {catGroup.posts.map(post => (
                <WriteupCard
                  key={`${catGroup.name}-${post.slug}`}
                  post={post}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
};
