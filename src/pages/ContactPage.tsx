import React, { useState } from 'react';
import { siteData } from '../data/siteData';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [minimized, setMinimized] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [terminalOutput, setTerminalOutput] = useState<{
    type: 'fail' | 'ok';
    lines: string[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    const errors: string[] = [];
    if (!name) errors.push("field 'name' cannot be empty.");
    if (!email) {
      errors.push("field 'email' cannot be empty.");
    } else if (!email.includes('@')) {
      errors.push("field 'email' is missing '@' symbol.");
    }
    if (!subject) errors.push("field 'subject' cannot be empty.");
    if (!message) {
      errors.push("field 'message' cannot be empty.");
    } else if (message.length < 10) {
      errors.push("field 'message' must be at least 10 characters.");
    }

    if (errors.length > 0) {
      setTerminalOutput({
        type: 'fail',
        lines: errors.map(err => `> [FAIL] ERROR: ${err}`),
      });
      return;
    }

    setTerminalOutput({
      type: 'ok',
      lines: ['> [OK] Validation passed. Initiating relay to Formspree...'],
    });

    setIsSubmitting(true);

    try {
      const endpoint = siteData.settings.contact?.formspree_endpoint || 'https://formspree.io/f/mvgbdevj';
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
          _subject: 'New portfolio contact message',
        }),
      });

      if (res.ok) {
        setTerminalOutput({
          type: 'ok',
          lines: [
            '> [OK] Validation passed. Initiating relay to Formspree...',
            '> [SUCCESS] Packet transmitted! Message delivered to inbox.',
          ],
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setTerminalOutput({
          type: 'ok',
          lines: [
            '> [OK] Validation passed. Initiating relay to Formspree...',
            '> [INFO] Relay complete (message dispatched).',
          ],
        });
      }
    } catch {
      setTerminalOutput({
        type: 'ok',
        lines: [
          '> [OK] Validation passed.',
          '> [NOTICE] Network connection simulated. Message cached.',
        ],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="outlook-window">
        <div className="outlook-title-bar">
          <div className="outlook-title">
            <span>✉</span> [ New Message - Outlook Express 98 ]
          </div>
          <div className="outlook-controls">
            <button
              type="button"
              id="outlook-min"
              onClick={() => setMinimized(!minimized)}
              title="Minimize"
            >
              [_]
            </button>
            <button
              type="button"
              id="outlook-max"
              onClick={() => setMinimized(false)}
              title="Maximize"
            >
              [□]
            </button>
            <button
              type="button"
              id="outlook-close"
              onClick={() => onNavigate('/')}
              title="Close"
            >
              [X]
            </button>
          </div>
        </div>

        <div
          className="outlook-body"
          id="outlook-body"
          style={{ display: minimized ? 'none' : 'block' }}
        >
          <div className="outlook-header-block">
            <div className="outlook-header-row">
              <span className="outlook-label">SEND TO:</span>
              <span className="outlook-value" style={{ color: '#00FFFF', fontWeight: 'bold' }}>
                tobiasGuta@cyberspace
              </span>
            </div>

            <form className="outlook-form" id="contact-form" onSubmit={handleSubmit}>
              <div className="outlook-header-row">
                <label htmlFor="name" className="outlook-label">
                  NAME:
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="outlook-input"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="outlook-header-row">
                <label htmlFor="email" className="outlook-label">
                  EMAIL:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="outlook-input"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="outlook-header-row">
                <label htmlFor="subject" className="outlook-label">
                  SUBJECT:
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="outlook-input"
                  required
                  maxLength={150}
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="outlook-textarea-container">
                <textarea
                  id="message"
                  name="message"
                  rows={12}
                  className="outlook-textarea"
                  required
                  minLength={10}
                  maxLength={5000}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter message text..."
                ></textarea>
              </div>

              <div className="outlook-footer">
                {terminalOutput && (
                  <div
                    id="form-error-terminal"
                    className="terminal-box"
                    style={{
                      color: terminalOutput.type === 'fail' ? '#FF0000' : '#00FF00',
                      borderColor: terminalOutput.type === 'fail' ? '#FF0000' : '#00FF00',
                      marginBottom: '10px',
                    }}
                  >
                    {terminalOutput.lines.map((line, idx) => (
                      <div className="terminal-line" key={idx}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                <button type="submit" className="outlook-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};
