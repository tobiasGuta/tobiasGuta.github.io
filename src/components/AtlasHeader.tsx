import React, { useState, useEffect } from 'react';
import { Theme } from '../utils/theme';

interface AtlasHeaderProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const AtlasHeader: React.FC<AtlasHeaderProps> = ({
  currentSection,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on resize to desktop or when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNav = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate(section);
  };

  const navItems = [
    { id: 'person', label: 'THE PERSON', num: '01' },
    { id: 'work', label: 'THE WORK', num: '02' },
    { id: 'library', label: 'THE LIBRARY', num: '03' },
    { id: 'commonplace', label: 'COMMONPLACE', num: '04' },
    { id: 'connect', label: 'CONNECT ↗', num: '05' },
  ];

  return (
    <>
      <div className="top-forest-accent" aria-hidden="true" />
      <header className="atlas-header">
        <div className="atlas-header-inner">
          <a
            href="/"
            className="atlas-brand"
            onClick={(e) => handleNav(e, 'home')}
            aria-label="Tobias Portfolio — Home"
          >
            tobias<span className="brand-dot">.</span>
          </a>

          {/* Desktop Navigation & Theme Switcher */}
          <nav className="atlas-nav desktop-nav" aria-label="Primary Navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#/${item.id}`}
                className={`atlas-nav-link ${currentSection === item.id ? 'active' : ''}`}
                onClick={(e) => handleNav(e, item.id)}
              >
                {item.label}
              </a>
            ))}

            {/* Desktop Theme Toggle Button */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Theme: ${theme.toUpperCase()}. Click to switch to ${theme === 'light' ? 'dark' : 'light'} mode.`}
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === 'light' ? '☼' : '☽'}
              </span>
              <span className="theme-toggle-label">
                {theme === 'light' ? 'LIGHT' : 'DARK'}
              </span>
            </button>
          </nav>

          {/* Mobile Actions: Direct Theme Toggle + Drawer Menu Toggle */}
          <div className="mobile-header-actions">
            <button
              type="button"
              className="theme-toggle-btn mobile-theme-btn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === 'light' ? '☼' : '☽'}
              </span>
            </button>

            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <span className="mobile-toggle-symbol" aria-hidden="true">
                {isMobileMenuOpen ? '✕' : '☰'}
              </span>
              <span className="mobile-toggle-text">
                {isMobileMenuOpen ? 'CLOSE' : 'MENU'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="mobile-nav-drawer"
            role="dialog"
            aria-label="Mobile Navigation"
          >
            <nav className="mobile-nav-list">
              {navItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#/${item.id}`}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleNav(e, item.id)}
                  >
                    <span className="mobile-nav-num">{item.num} //</span>
                    <span className="mobile-nav-label">{item.label}</span>
                    {isActive && (
                      <span className="mobile-nav-active-dot" aria-hidden="true">✦</span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Appearance Segmented Picker */}
            <div className="mobile-theme-drawer-row">
              <span className="mobile-theme-row-label">APPEARANCE</span>
              <div className="mobile-theme-segmented" role="radiogroup" aria-label="Theme mode">
                <button
                  type="button"
                  className={`mobile-theme-pill ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => theme !== 'light' && onToggleTheme()}
                  role="radio"
                  aria-checked={theme === 'light'}
                >
                  ☼ LIGHT
                </button>
                <button
                  type="button"
                  className={`mobile-theme-pill ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => theme !== 'dark' && onToggleTheme()}
                  role="radio"
                  aria-checked={theme === 'dark'}
                >
                  ☽ DARK
                </button>
              </div>
            </div>

            <div className="mobile-nav-footer">
              <span className="mobile-nav-colophon">EST. IN CURIOSITY · NYC</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
