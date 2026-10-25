import React, { useState, useEffect } from 'react';

interface CodexBackgroundProps {
  isArticleOpen?: boolean;
}

export const CodexBackground: React.FC<CodexBackgroundProps> = ({ isArticleOpen = false }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Only track mouse on devices with fine pointer (mouse/trackpad) to save battery on touch devices
    if (!isArticleOpen && window.matchMedia('(pointer: fine)').matches) {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isArticleOpen]);

  return (
    <div
      className={`codex-background-wrapper ${isArticleOpen ? 'is-article-view' : ''}`}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        userSelect: 'none',
        opacity: isArticleOpen ? 0 : 1,
        visibility: isArticleOpen ? 'hidden' : 'visible',
        transition: 'opacity 0.4s ease, visibility 0.4s ease',
      }}
    >
      {/* Dynamic Cursor Spotlight */}
      {mousePos && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle 480px at ${mousePos.x}px ${mousePos.y}px, var(--color-codex-glow), transparent 75%)`,
            transition: 'background 0.08s ease-out',
            mixBlendMode: 'normal',
          }}
        />
      )}

      {/* SVG Vector Drafting Geometry (Da Vinci Codex Schematics) */}
      <svg
        className="codex-svg-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="codexGridPattern" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="var(--color-codex-subtle)"
              strokeWidth="0.7"
            />
            {/* Grid intersection registration pluses */}
            <path
              d="M -4 0 L 4 0 M 0 -4 L 0 4 M 116 0 L 124 0 M 120 -4 L 120 4 M -4 120 L 4 120 M 0 116 L 0 124"
              stroke="var(--color-codex-line)"
              strokeWidth="0.8"
              fill="none"
            />
          </pattern>
        </defs>

        {/* 1. Underlying fine drafting grid */}
        <rect width="100%" height="100%" fill="url(#codexGridPattern)" />

        {/* 2. Primary Da Vinci Codex Celestial / Proportion Dial (Top-Right / Center-Right) */}
        <g transform="translate(1100, 220)" className="codex-dial-primary">
          {/* Concentric Golden Ratio Circles */}
          <circle r="360" fill="none" stroke="var(--color-codex-subtle)" strokeWidth="0.8" />
          <circle r="260" fill="none" stroke="var(--color-codex-line)" strokeWidth="1" strokeDasharray="4 6" />
          <circle r="160" fill="none" stroke="var(--color-codex-accent)" strokeWidth="1.2" />
          <circle r="98" fill="none" stroke="var(--color-codex-line)" strokeWidth="0.8" />
          <circle r="60" fill="none" stroke="var(--color-codex-line)" strokeWidth="0.8" strokeDasharray="2 3" />
          <circle r="6" fill="var(--color-codex-accent)" />

          {/* Compass Projection Rays (Cardinal & Octagonal) */}
          <line x1="-480" y1="0" x2="480" y2="0" stroke="var(--color-codex-line)" strokeWidth="0.8" />
          <line x1="0" y1="-480" x2="0" y2="480" stroke="var(--color-codex-line)" strokeWidth="0.8" />
          <line x1="-340" y1="-340" x2="340" y2="340" stroke="var(--color-codex-subtle)" strokeWidth="0.8" strokeDasharray="5 5" />
          <line x1="-340" y1="340" x2="340" y2="-340" stroke="var(--color-codex-subtle)" strokeWidth="0.8" strokeDasharray="5 5" />

          {/* Inscribed Octagon & Square Construction Guidelines */}
          <polygon
            points="0,-160 113,-113 160,0 113,113 0,160 -113,113 -160,0 -113,-113"
            fill="none"
            stroke="var(--color-codex-subtle)"
            strokeWidth="0.8"
          />
          <polygon
            points="-113,-113 113,-113 113,113 -113,113"
            fill="none"
            stroke="var(--color-codex-accent)"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />

          {/* Tangent Golden Section Arc */}
          <path
            d="M 0 160 A 160 160 0 0 0 160 0 A 98 98 0 0 0 62 -98"
            fill="none"
            stroke="var(--color-codex-accent)"
            strokeWidth="1.5"
          />

          {/* Calibrated Degree Ring Ticks */}
          {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = Math.cos(rad) * 252;
            const y1 = Math.sin(rad) * 252;
            const x2 = Math.cos(rad) * 268;
            const y2 = Math.sin(rad) * 268;
            return (
              <line
                key={`deg-${deg}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--color-codex-line)"
                strokeWidth={deg % 90 === 0 ? '1.5' : '0.8'}
              />
            );
          })}
        </g>

        {/* 3. Secondary Astrolabe / Harmonic Curve (Bottom-Left / Center-Left) */}
        <g transform="translate(180, 850)" className="codex-dial-secondary">
          <circle r="220" fill="none" stroke="var(--color-codex-subtle)" strokeWidth="0.8" />
          <circle r="136" fill="none" stroke="var(--color-codex-line)" strokeWidth="1" strokeDasharray="3 4" />
          <circle r="84" fill="none" stroke="var(--color-codex-accent)" strokeWidth="1" />
          <circle r="4" fill="var(--color-codex-accent)" />

          <line x1="-300" y1="0" x2="300" y2="0" stroke="var(--color-codex-line)" strokeWidth="0.8" strokeDasharray="6 4" />
          <line x1="0" y1="-300" x2="0" y2="300" stroke="var(--color-codex-line)" strokeWidth="0.8" strokeDasharray="6 4" />

          {/* Equilateral Triangle Inscription */}
          <polygon
            points="0,-136 117.77,68 -117.77,68"
            fill="none"
            stroke="var(--color-codex-subtle)"
            strokeWidth="0.8"
          />

          {/* Harmonic Wave Tangents */}
          <path
            d="M -220 0 Q 0 -136 220 0 Q 0 136 -220 0"
            fill="none"
            stroke="var(--color-codex-accent)"
            strokeWidth="0.9"
            strokeDasharray="4 3"
          />
        </g>

        {/* 4. Diagonal Harmonic Construction Chords across the viewport */}
        <line x1="0" y1="0" x2="800" y2="800" stroke="var(--color-codex-subtle)" strokeWidth="0.6" strokeDasharray="8 8" />
        <line x1="1200" y1="0" x2="200" y2="1000" stroke="var(--color-codex-subtle)" strokeWidth="0.6" strokeDasharray="8 8" />
      </svg>

      {/* Marginal Coordinate & Cartographic Markings (Overlay) */}
      <div className="codex-marginal-marks">
        {/* Top-Left Corner Stamp */}
        <div
          style={{
            position: 'absolute',
            top: '5.5rem',
            left: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.12em',
            color: 'var(--color-codex-text)',
            lineHeight: 1.4,
            textTransform: 'uppercase',
          }}
        >
          <div>⌖ TOBIAS GUTA // PORTFOLIO</div>
          <div style={{ opacity: 0.75 }}>INDEPENDENT RESEARCHER · NYC</div>
        </div>

        {/* Top-Right Corner Stamp (NYC Coordinates) */}
        <div
          style={{
            position: 'absolute',
            top: '5.5rem',
            right: '2rem',
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.12em',
            color: 'var(--color-codex-text)',
            lineHeight: 1.4,
            textTransform: 'uppercase',
          }}
        >
          <div>LAT 40° 42' 46" N · LON 74° 00' 22" W</div>
          <div style={{ opacity: 0.75 }}>REF. NYC STATION // ELEV. 10M</div>
        </div>

        {/* Bottom-Left Corner Stamp */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.12em',
            color: 'var(--color-codex-text)',
            lineHeight: 1.4,
            textTransform: 'uppercase',
          }}
        >
          <div>AD FONTES // Q.E.D.</div>
          <div style={{ opacity: 0.75 }}>MATHEMATICA &amp; VIRTUS</div>
        </div>

        {/* Bottom-Right Corner Stamp */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            right: '1.5rem',
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.12em',
            color: 'var(--color-codex-text)',
            lineHeight: 1.4,
            textTransform: 'uppercase',
          }}
        >
          <div>[ 360° ARC · CALIBRATED ] ⌖</div>
          <div style={{ opacity: 0.75 }}>SYSTEMS RECON &amp; PRAXIS</div>
        </div>

        {/* Left Vertical Drafting Margin Ticks */}
        <div
          className="codex-left-ruler"
          style={{
            position: 'absolute',
            left: '0.5rem',
            top: '20vh',
            bottom: '20vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'var(--color-codex-text)',
            opacity: 0.7,
          }}
        >
          {['00', '16', '32', '48', '64', '80', '96'].map((val, idx) => (
            <div key={`left-tick-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: idx % 2 === 0 ? '10px' : '5px', height: '1px', backgroundColor: 'var(--color-codex-line)' }} />
              <span>{val}</span>
            </div>
          ))}
        </div>

        {/* Right Vertical Drafting Margin Ticks */}
        <div
          className="codex-right-ruler"
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '20vh',
            bottom: '20vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'var(--color-codex-text)',
            opacity: 0.7,
          }}
        >
          {['+0.0', '+0.2', '+0.4', '+0.6', '+0.8', '+1.0', '+φ'].map((val, idx) => (
            <div key={`right-tick-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', flexDirection: 'row-reverse' }}>
              <span style={{ display: 'inline-block', width: idx % 2 === 0 ? '10px' : '5px', height: '1px', backgroundColor: 'var(--color-codex-line)' }} />
              <span>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
