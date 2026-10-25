import React, { useState, useEffect } from 'react';
import { hackersQuotes } from '../data/quotesData';

export const RotatingQuote: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % hackersQuotes.length);
        setOpacity(1);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const quote = hackersQuotes[currentIndex];

  return (
    <div className="sidebar-box quote-box" style={{ marginTop: '16px' }}>
      <h3>[ TRANSMISSION ]</h3>
      <div
        id="dynamic-quote"
        className="quote-content"
        style={{
          transition: 'opacity 0.5s ease-in-out',
          opacity: opacity,
          lineHeight: '1.4',
        }}
      >
        "{quote.text}"
        <br />
        <span className="quote-author" style={{ color: '#00FFFF', fontSize: '11px', display: 'block', marginTop: '6px' }}>
          — {quote.author}
        </span>
      </div>
    </div>
  );
};
