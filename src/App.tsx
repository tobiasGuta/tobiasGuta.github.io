import React, { useState, useEffect } from 'react';
import { AtlasHeader } from './components/AtlasHeader';
import { AtlasFooter } from './components/AtlasFooter';
import { HeroSection } from './components/HeroSection';
import { PersonSection } from './components/PersonSection';
import { WorkSection } from './components/WorkSection';
import { LibrarySection } from './components/LibrarySection';
import { CommonplaceSection } from './components/CommonplaceSection';
import { ConnectSection } from './components/ConnectSection';
import { ArticleView } from './components/ArticleView';
import { CodexBackground } from './components/CodexBackground';
import { postsData, PostItem } from './data/postsData';
import { Theme, getInitialTheme, applyThemeToDocument } from './utils/theme';

export const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [workCategoryFilter, setWorkCategoryFilter] = useState<'all' | 'security' | 'ai' | 'tools'>('all');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Synchronize theme attribute on change
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Check URL on load and handle popstate
  useEffect(() => {
    const handleUrlState = () => {
      // 1. Support GitHub Pages single-page redirect query (?p=...)
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get('p');
      let rawPath = redirectParam ? decodeURIComponent(redirectParam) : window.location.pathname;
      rawPath = rawPath.replace(/\/$/, '');

      if (redirectParam) {
        window.history.replaceState(null, '', rawPath + window.location.hash);
      }

      // 2. Parse hash (supports both #section and #/section)
      const rawHash = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '');

      // 3. Check if path or hash points to an article
      const isBlogPath = rawPath.startsWith('/blog/') || rawPath.startsWith('/posts/');
      const isBlogHash = rawHash.startsWith('blog/') || rawHash.startsWith('posts/');

      if (isBlogPath || isBlogHash) {
        const slug = (isBlogPath ? rawPath : rawHash)
          .replace(/^\/?blog\//, '')
          .replace(/^\/?posts\//, '')
          .replace(/\/$/, '');
        const post = postsData.find((p) => p.slug === slug || p.url.includes(slug));
        if (post) {
          setSelectedPost(post);
          return;
        }
      }

      setSelectedPost(null);

      // 4. Section resolution
      const target = rawHash || rawPath.replace(/^\//, '');

      if (target === 'person' || target === 'about') {
        setCurrentSection('person');
        setTimeout(() => {
          const el = document.getElementById('person');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else if (target === 'work' || target === 'projects' || target === 'projects.html') {
        setCurrentSection('work');
        setTimeout(() => {
          const el = document.getElementById('work');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else if (target === 'library' || target === 'writeups' || target === 'writeups.html' || target === 'posts') {
        setCurrentSection('library');
        setTimeout(() => {
          const el = document.getElementById('library');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else if (target === 'commonplace' || target === 'notes' || target === 'marginalia') {
        setCurrentSection('commonplace');
        setTimeout(() => {
          const el = document.getElementById('commonplace');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else if (target === 'connect' || target === 'contact' || target === 'contact.html') {
        setCurrentSection('connect');
        setTimeout(() => {
          const el = document.getElementById('connect');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        setCurrentSection('home');
      }
    };

    handleUrlState();
    window.addEventListener('popstate', handleUrlState);
    return () => window.removeEventListener('popstate', handleUrlState);
  }, []);

  const handleNavigate = (section: string) => {
    if (selectedPost) {
      setSelectedPost(null);
    }

    setCurrentSection(section);

    if (section === 'home') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.history.pushState(null, '', `#/${section}`);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPost = (post: PostItem) => {
    setSelectedPost(post);
    window.history.pushState(null, '', post.url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLibrary = () => {
    setSelectedPost(null);
    window.history.pushState(null, '', '#/library');
    setCurrentSection('library');
    setTimeout(() => {
      const el = document.getElementById('library');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleNavigatePost = (urlOrSlug: string) => {
    const clean = urlOrSlug.replace(/^\/blog\//, '').replace(/^\/posts\//, '').replace(/\/$/, '');
    const found = postsData.find((p) => p.slug === clean || p.url === urlOrSlug);
    if (found) {
      handleSelectPost(found);
    }
  };

  return (
    <>
      <CodexBackground isArticleOpen={Boolean(selectedPost)} />
      <AtlasHeader
        currentSection={selectedPost ? 'library' : currentSection}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="atlas-main-content">
        {selectedPost ? (
          <ArticleView
            post={selectedPost}
            onBack={handleBackToLibrary}
            onNavigatePost={handleNavigatePost}
          />
        ) : (
          <>
            <HeroSection
              onNavigate={handleNavigate}
              onExploreClick={() => handleNavigate('person')}
              onSelectKnowledgeField={(fieldId) => {
                if (fieldId === 'security') {
                  setWorkCategoryFilter('security');
                  handleNavigate('work');
                } else if (fieldId === 'making') {
                  setWorkCategoryFilter('tools');
                  handleNavigate('work');
                } else if (fieldId === 'ai') {
                  setWorkCategoryFilter('ai');
                  handleNavigate('work');
                } else if (fieldId === 'philosophy') {
                  handleNavigate('commonplace');
                }
              }}
            />
            <PersonSection />
            <WorkSection
              categoryFilter={workCategoryFilter}
              onSelectCategory={setWorkCategoryFilter}
            />
            <LibrarySection onSelectPost={handleSelectPost} />
            <CommonplaceSection />
            <ConnectSection />
          </>
        )}
      </main>

      <AtlasFooter
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </>
  );
};
