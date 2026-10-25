import React from 'react';
import { InterestAtlas } from './InterestAtlas';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
  onExploreClick: () => void;
  onSelectKnowledgeField?: (fieldId: 'security' | 'ai' | 'philosophy' | 'making') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onExploreClick,
  onSelectKnowledgeField,
}) => {
  return (
    <>
      <section className="atlas-hero-section" aria-label="Hero Introduction">
        <div className="hero-text-block">
          <div className="kicker-label">
            INDEPENDENT RESEARCHER IN THE MAKING / NYC
          </div>

          <h1 className="hero-headline editorial-title">
            A life of<br />
            <span className="editorial-italic">many pursuits.</span>
          </h1>

          <p className="hero-intro-text">
            I'm Tobias. I break things to understand how they work, build tools to understand what's possible, and follow ideas wherever they lead.
          </p>

          <button
            type="button"
            className="hero-action-link"
            onClick={onExploreClick}
            aria-label="Explore my world and work"
            style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--color-ink)' }}
          >
            EXPLORE MY WORLD ↗
          </button>
        </div>

        <InterestAtlas
          onSelectField={(fieldId) => {
            if (onSelectKnowledgeField) {
              onSelectKnowledgeField(fieldId);
            } else if (fieldId === 'security' || fieldId === 'making' || fieldId === 'ai') {
              onNavigate('work');
            } else if (fieldId === 'philosophy') {
              onNavigate('commonplace');
            }
          }}
        />
      </section>

      {/* The Three Gateway Editorial Columns */}
      <section className="atlas-columns-strip" aria-label="Editorial Columns">
        <div
          className="editorial-column-card"
          onClick={() => onNavigate('work')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onNavigate('work');
          }}
        >
          <div className="col-kicker">01 / RESEARCH &amp; BUILD</div>
          <h2 className="col-title">
            <span>Selected work</span>
            <span style={{ fontSize: '1.1rem', color: 'var(--color-ink-muted)' }}>↗</span>
          </h2>
          <p className="col-desc">
            Reconductor, security tooling, experiments and things still in progress.
          </p>
        </div>

        <div
          className="editorial-column-card"
          onClick={() => onNavigate('commonplace')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onNavigate('commonplace');
          }}
        >
          <div className="col-kicker">02 / THINK &amp; LEARN</div>
          <h2 className="col-title">
            <span>Commonplace book</span>
            <span style={{ fontSize: '1.1rem', color: 'var(--color-ink-muted)' }}>↗</span>
          </h2>
          <p className="col-desc">
            Ideas, reading notes, AI, philosophy and the questions between.
          </p>
        </div>

        <div
          className="editorial-column-card"
          onClick={() => onNavigate('library')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onNavigate('library');
          }}
        >
          <div className="col-kicker">03 / PRACTICE &amp; EXPLORE</div>
          <h2 className="col-title">
            <span>Field reports</span>
            <span style={{ fontSize: '1.1rem', color: 'var(--color-ink-muted)' }}>↗</span>
          </h2>
          <p className="col-desc">
            CTF writeups, bug bounty learning and reverse-engineering notes.
          </p>
        </div>
      </section>
    </>
  );
};
