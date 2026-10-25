import React from 'react';
import { LightCycleArena } from './LightCycleArena';
import { siteData } from '../data/siteData';

interface FooterProps {
  customHeading?: string;
  customText?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({ customHeading, customText }) => {
  const socials = siteData.social_links.filter((s: any) => s.show_in_footer !== false);

  return (
    <footer className="site-footer">
      <LightCycleArena />

      <div className="footer-divider">●○●○●○●○●○●○●○●○●○●○●○●○●○●○●○●○●○●○</div>

      <p className="footer-heading">
        {customHeading || '~*~ TOBIAS GUTA // CYBERSECURITY PORTFOLIO ~*~'}
      </p>

      {customText && <div className="footer-text">{customText}</div>}

      <div className="footer-social-links" style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '10px 0', flexWrap: 'wrap' }}>
        {socials.map((link: any, idx: number) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-item"
            style={{ color: '#00FFFF', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}
          >
            <span>{link.icon || '🔗'}</span> [{link.label || link.handle}]
          </a>
        ))}
      </div>

      <div className="footer-text">
        <p dangerouslySetInnerHTML={{ __html: siteData.settings.footer?.copyright || '&copy; 1997–2024 TobiasGuta' }} />
        {siteData.settings.footer?.disclaimer && (
          <p style={{ opacity: 0.7, fontSize: '11px', marginTop: '4px' }}>
            {siteData.settings.footer.disclaimer}
          </p>
        )}
      </div>
    </footer>
  );
};
