import React, { useState } from 'react';
import { siteData } from '../data/siteData';

export const ConnectSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    msg: string;
  }>({
    type: 'idle',
    msg: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !subject || !message) {
      setStatus({
        type: 'error',
        msg: 'Please provide name, email, subject, and a brief message before dispatching.',
      });
      return;
    }

    if (!email.includes('@')) {
      setStatus({
        type: 'error',
        msg: 'Please ensure your email address contains a valid domain structure.',
      });
      return;
    }

    setStatus({ type: 'loading', msg: 'Transmitting message to Formspree relay...' });

    try {
      const endpoint =
        siteData.settings.contact?.formspree_endpoint || 'https://formspree.io/f/mvgbdevj';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _subject: `[Curiosity Atlas] ${subject}`,
        }),
      });

      if (res.ok) {
        setStatus({
          type: 'success',
          msg: 'Your transmission was delivered successfully. Tobias will reply via email shortly.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMsg =
          (errorData && (errorData.error || (errorData.errors && errorData.errors.map((e: any) => e.message).join(', ')))) ||
          'Formspree relay returned a delivery issue. Please verify your details or connect via LinkedIn.';
        setStatus({
          type: 'error',
          msg: errorMsg,
        });
      }
    } catch {
      setStatus({
        type: 'error',
        msg: 'Network or transmission error occurred while contacting Formspree relay. Please retry or reach out directly via LinkedIn/GitHub.',
      });
    }
  };

  return (
    <section id="connect" className="atlas-section" aria-label="Connect & Correspondence">
      <div className="section-head">
        <div className="section-kicker">05 // CORRESPONDENCE</div>
        <h2 className="section-title">Initiate Transmission</h2>
        <p className="section-subtitle">
          Open for collaboration on vulnerability research, tool development, security inquiries, or thoughtful discussion.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
        }}
      >
        <div>
          <form className="editorial-form" onSubmit={handleSubmit}>
            {/* Honeypot field for spam prevention */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none', position: 'absolute', left: '-9999px' }}
              aria-hidden="true"
            />

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                NAME // IDENTITY
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                required
                disabled={status.type === 'loading'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ada Lovelace"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL // RETURN ADDRESS
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                required
                disabled={status.type === 'loading'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ada@analytical-engine.org"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">
                SUBJECT // PURSUIT
              </label>
              <input
                id="subject"
                type="text"
                className="form-input"
                required
                disabled={status.type === 'loading'}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Regarding automated reconnaissance heuristics..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                MESSAGE // INQUIRY
              </label>
              <textarea
                id="message"
                rows={5}
                className="form-textarea"
                required
                minLength={10}
                disabled={status.type === 'loading'}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share your thoughts, project ideas, or security questions..."
              />
            </div>

            {status.msg && (
              <div
                role={status.type === 'error' ? 'alert' : 'status'}
                aria-live="polite"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid',
                  borderColor:
                    status.type === 'error'
                      ? 'var(--color-terracotta)'
                      : 'var(--color-forest)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  color:
                    status.type === 'error'
                      ? 'var(--color-terracotta)'
                      : 'var(--color-ink)',
                }}
              >
                {status.msg}
              </div>
            )}

            <button
              type="submit"
              className="form-submit-btn"
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? 'TRANSMITTING...' : 'DISPATCH MESSAGE ↗'}
            </button>
          </form>
        </div>

        <div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              color: 'var(--color-ink)',
              marginBottom: '1rem',
              fontWeight: 500,
            }}
          >
            Direct Channels &amp; Coordinates
          </h3>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--color-ink-secondary)',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            I welcome thoughtful inquiries from engineers, researchers, students, and mentors. For sensitive security findings, please request my PGP public key.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                LOCATION
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--color-ink)' }}>
                New York City, NY
              </div>
            </div>

            <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                GITHUB
              </div>
              <a
                href="https://github.com/tobiasGuta"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  color: 'var(--color-terracotta)',
                  textDecoration: 'none',
                }}
              >
                github.com/tobiasGuta ↗
              </a>
            </div>

            <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                LINKEDIN
              </div>
              <a
                href="https://www.linkedin.com/in/tobiasare"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  color: 'var(--color-terracotta)',
                  textDecoration: 'none',
                }}
              >
                linkedin.com/in/tobiasare ↗
              </a>
            </div>

            <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                BUG BOUNTY
              </div>
              <a
                href="https://hackerone.com/tobiasare"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  color: 'var(--color-terracotta)',
                  textDecoration: 'none',
                }}
              >
                hackerone.com/tobiasare ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
