import React, { useEffect, useRef } from 'react';

interface HeaderProps {
  marqueeText: string;
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ marqueeText, title, subtitle }) => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.07 && titleRef.current) {
        titleRef.current.style.transform = `skewX(${(Math.random() - 0.5) * 6}deg) translateX(${(Math.random() - 0.5) * 4}px)`;
        setTimeout(() => {
          if (titleRef.current) titleRef.current.style.transform = '';
        }, 80);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* TOP MARQUEE */}
      <div className="marquee-top">
        <span dangerouslySetInnerHTML={{ __html: marqueeText }} />
      </div>

      {/* HEADER */}
      <header className="site-header">
        <div className="grid-container">
          <div className="grid-plane"></div>
        </div>
        <div className="stars-row">★★★★★★★★★★★★★★★</div>
        <h1 className="site-title" ref={titleRef}>{title}</h1>
        <p className="site-subtitle">{subtitle}</p>
        <div className="stars-row">★★★★★★★★★★★★★★★</div>
      </header>
    </>
  );
};
