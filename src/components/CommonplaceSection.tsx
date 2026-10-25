import React from 'react';

export interface CommonplaceEntry {
  id: string;
  entryNumber: string;
  theme: string;
  title: string;
  quote: string;
  source: {
    speaker: string;
    work: string;
    directorOrAuthor: string;
    year: string;
    medium: string;
  };
  context: string;
  commentary: string;
  tags: string[];
}

const COMMONPLACE_ENTRIES: CommonplaceEntry[] = [
  {
    id: 'oppenheimer-fear-and-use',
    entryNumber: '04',
    theme: 'THINK & LEARN',
    title: 'On Understanding, Fear & the Inevitability of Use',
    quote:
      "They won't fear it until they understand it. And they won't understand it until they've used it.",
    source: {
      speaker: 'J. Robert Oppenheimer',
      work: 'Oppenheimer',
      directorOrAuthor: 'Christopher Nolan',
      year: '2023',
      medium: 'Biographical drama film',
    },
    context:
      "Spoken by the character J. Robert Oppenheimer in Christopher Nolan's 2023 biographical drama film Oppenheimer. The dialogue addresses the profound psychological disconnect between theoretical power and visceral comprehension, explaining why mankind cannot truly grasp the nature of transformative force until it has been brought into operational existence.",
    commentary:
      "A lasting epistemological axiom for technologies that redefine human agency from splitting the atom to synthesizing intelligence. Theoretical abstraction invites speculative dread or uncritical complacency; only through direct instrumentation, practice, and tangible use does human apprehension yield to actual comprehension and sober governance.",
    tags: ['Oppenheimer', 'Philosophy of Technology', 'Cognition', 'Systems Ethics'],
  },
];

export const CommonplaceSection: React.FC = () => {
  return (
    <section id="commonplace" className="atlas-section" aria-label="Commonplace Book">
      <div className="section-head">
        <div className="section-kicker">04 // THINK &amp; LEARN</div>
        <h2 className="section-title">Commonplace Book &amp; Marginalia</h2>
        <p className="section-subtitle">
          Foundational quotations, philosophical observations, and intellectual marginalia collected across cinema, literature, and technology.
        </p>
      </div>

      <div className="commonplace-collection">
        {COMMONPLACE_ENTRIES.map((entry) => (
          <article
            key={entry.id}
            className="commonplace-editorial-folio"
            aria-labelledby={`entry-title-${entry.id}`}
          >
            {/* Folio Metadata Header */}
            <div className="folio-meta-bar">
              <span className="folio-kicker">
                FRAGMENT {entry.entryNumber} // {entry.theme}
              </span>
              <span className="folio-index">
                INDEX REF: {entry.id.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h3 id={`entry-title-${entry.id}`} className="folio-title">
              {entry.title}
            </h3>

            {/* The Primary Quote Callout */}
            <blockquote className="folio-quote-block">
              <span className="quote-mark" aria-hidden="true">“</span>
              <p className="quote-text">{entry.quote}”</p>
            </blockquote>

            {/* Structured Source Attribution */}
            <div className="folio-attribution-panel">
              <div className="attribution-row">
                <span className="attr-label">Speaker / Persona:</span>
                <span className="attr-value">{entry.source.speaker}</span>
              </div>
              <div className="attribution-row">
                <span className="attr-label">Work &amp; Director:</span>
                <span className="attr-value">
                  <em>{entry.source.work}</em> ({entry.source.year}) — Dir. {entry.source.directorOrAuthor}
                </span>
              </div>
              <div className="attribution-row">
                <span className="attr-label">Medium:</span>
                <span className="attr-value">{entry.source.medium}</span>
              </div>
            </div>

            {/* Context & Commentary Split Grid */}
            <div className="folio-body-grid">
              <div className="folio-body-cell">
                <h4 className="cell-heading">HISTORICAL &amp; NARRATIVE CONTEXT</h4>
                <p className="cell-text">{entry.context}</p>
              </div>

              <div className="folio-body-cell">
                <h4 className="cell-heading">MARGINALIA &amp; PHILOSOPHICAL COMMENTARY</h4>
                <p className="cell-text">{entry.commentary}</p>
              </div>
            </div>

            {/* Taxonomic Tags */}
            <div className="folio-footer-tags">
              <span className="tags-label">INDEX TERMS:</span>
              <div className="tags-list">
                {entry.tags.map((t, i) => (
                  <span key={i} className="folio-tag">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
