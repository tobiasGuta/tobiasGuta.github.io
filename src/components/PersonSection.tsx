import React from 'react';
import { siteData } from '../data/siteData';

export const PersonSection: React.FC = () => {
  const profile = siteData.profile;
  const certificates = siteData.certificates;

  return (
    <section id="person" className="atlas-section" aria-label="The Person">
      <div className="section-head">
        <div className="section-kicker">01 // THE PERSON</div>
        <h2 className="section-title">The Mind, The Method &amp; The Path</h2>
        <p className="section-subtitle">
          An introduction to my background, intellectual commitments, and polymathic approach to technology.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              color: 'var(--color-ink)',
              marginBottom: '1rem',
              fontWeight: 500,
            }}
          >
            The Investigative Mindset
          </h3>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--color-ink-secondary)',
              marginBottom: '1rem',
            }}
          >
            I am an independent researcher in the making based in New York City, pursuing a Bachelor of Science in Cybersecurity (currently in Year 2). My focus spans penetration testing, web application exploitation, digital forensics, and autonomous AI tooling.
          </p>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--color-ink-secondary)',
            }}
          >
            To me, security is not a series of compliance checkboxes; it is an empirical study of the divergence between human intention and mechanical execution. When engineers build systems, they make unstated assumptions. Security research is the practice of methodically identifying where those assumptions fail.
          </p>
        </div>

        <div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              color: 'var(--color-ink)',
              marginBottom: '1rem',
              fontWeight: 500,
            }}
          >
            First Principles of Inquiry
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderLeft: '2px solid var(--color-terracotta)', paddingLeft: '1rem' }}>
              <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.2rem' }}>
                Tools as Cognitive Scaffolding
              </strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-secondary)', lineHeight: 1.55 }}>
                Building custom engines (recon orchestrators, fuzzers, parsers) forces me to understand protocol RFCs and kernel primitives deeper than any textbook can convey.
              </p>
            </div>

            <div style={{ borderLeft: '2px solid var(--color-terracotta)', paddingLeft: '1rem' }}>
              <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-ink)', display: 'block', marginBottom: '0.2rem' }}>
                Interdisciplinary Synthesis
              </strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-secondary)', lineHeight: 1.55 }}>
                Software security connects directly with epistemology, game theory, systems ecology, and cognitive philosophy. Breadth of curiosity feeds depth of engineering.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials & Milestones */}
      <div style={{ marginTop: '2.5rem' }}>
        <div className="kicker-label" style={{ marginBottom: '0.5rem' }}>
          CREDENTIALS &amp; MILESTONES
        </div>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            color: 'var(--color-ink-secondary)',
            marginBottom: '1.5rem',
          }}
        >
          Diplomas, industry certifications, course completions, and formal acknowledgments preserved faithfully from source records.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {certificates?.map((cert: any, idx: number) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-terracotta)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '0.35rem',
                  }}
                >
                  {cert.issuer || 'RECORD'}
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.125rem',
                    color: 'var(--color-ink)',
                    fontWeight: 500,
                    lineHeight: 1.35,
                    marginBottom: '0.5rem',
                  }}
                >
                  {cert.title}
                </h4>
                {cert.date && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--color-ink-muted)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {cert.date.startsWith('Fall') || cert.date.startsWith('Spring') ? `Term: ${cert.date}` : `Date: ${cert.date}`}
                  </div>
                )}
                {cert.note && (
                  <p
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--color-ink-secondary)',
                      lineHeight: 1.45,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {cert.note}
                  </p>
                )}
              </div>

              {cert.link ? (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--color-ink-muted)',
                    alignSelf: 'flex-start',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {cert.link_label || 'View Record ↗'}
                </a>
              ) : (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--color-ink-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Documented on File
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
