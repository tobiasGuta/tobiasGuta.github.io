import React from 'react';
import { polymathResources } from '../data/polymathData';

export const PolymathSection: React.FC = () => {
  return (
    <section id="polymath" className="atlas-section" aria-label="Polymath resources">
      <div className="section-head">
        <div className="section-kicker">04 // POLYMATH</div>
        <h2 className="section-title">Resources Worth Returning To</h2>
        <p className="section-subtitle">
          Books, papers, PDFs, courses, and links I find valuable for learning how systems, people, and ideas work.
        </p>
      </div>

      <div className="polymath-grid">
        {polymathResources.map((resource) => (
          <article className="polymath-card" key={resource.id}>
            <div className="polymath-card-meta">
              <span>{resource.kind}</span>
              <span>{resource.source}</span>
            </div>
            <h3 className="polymath-card-title">{resource.title}</h3>
            <p className="polymath-card-description">{resource.description}</p>
            <div className="polymath-note">
              <span className="polymath-note-label">WHY IT MATTERS</span>
              <p>{resource.note}</p>
            </div>
            <div className="polymath-card-footer">
              <div className="polymath-tags">
                {resource.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="polymath-link">
                {resource.linkLabel || 'OPEN RESOURCE'} ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
