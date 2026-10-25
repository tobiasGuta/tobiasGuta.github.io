import React from 'react';
import { Theme } from '../utils/theme';

interface AtlasFooterProps {
  onNavigate?: (section: string) => void;
  theme?: Theme;
  onToggleTheme?: () => void;
}

export const AtlasFooter: React.FC<AtlasFooterProps> = ({ theme, onToggleTheme }) => {
  return (
    <footer className="atlas-footer">
      <div className="atlas-footer-inner">
        {/* Social & external profiles */}
        <nav className="footer-links-group" aria-label="Social and External Profiles">
          <a
            href="https://github.com/tobiasGuta"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GITHUB ↗
          </a>
          <span className="footer-dot-divider" aria-hidden="true">·</span>
          <a
            href="https://www.linkedin.com/in/tobiasare"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LINKEDIN ↗
          </a>
          <span className="footer-dot-divider" aria-hidden="true">·</span>
          <a
            href="https://hackerone.com/tobiasare"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            HACKERONE ↗
          </a>
        </nav>

        {/* Motto, Colophon & Theme Toggle */}
        <div className="footer-motto-group">
          <span className="footer-motto">EVERYTHING CONNECTS TO SOMETHING.</span>
          {onToggleTheme && theme && (
            <button
              type="button"
              className="footer-theme-toggle"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              style={{ marginLeft: '1rem' }}
            >
              {theme === 'light' ? '☼ LIGHT MODE' : '☽ DARK MODE'}
            </button>
          )}
        </div>

        {/* Copyright & Attestation */}
        <div className="footer-identity-group">
          <span className="footer-copyright">© TOBIAS GUTA</span>
          <span className="footer-dot-divider" aria-hidden="true">·</span>
          <span className="footer-origin">EST. IN CURIOSITY</span>
        </div>
      </div>
    </footer>
  );
};
