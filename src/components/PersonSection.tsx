import React from 'react';
import { siteData } from '../data/siteData';

export const PersonSection: React.FC = () => {
  const profile = siteData.profile;
  const certificates = siteData.certificates;

  return (
    <section id="person" className="atlas-section" aria-label="The Person">
      <div className="section-head">
        <div className="section-kicker">01 // THE PERSON</div>
        <h2 className="section-title">My Mind, My Method &amp; My Path</h2>
        <p className="section-subtitle">
          An introduction to my background, intellectual commitments, and polymathic approach to technology.
        </p>
      </div>

      <div
        style={{
          maxWidth: '820px',
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
            }}
          >
            I am an independent researcher in the making based in New York City, pursuing a Bachelor of Science in Cybersecurity (currently in my first semester). My focus spans penetration testing, web application exploitation, and autonomous AI tooling.
          </p>
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
