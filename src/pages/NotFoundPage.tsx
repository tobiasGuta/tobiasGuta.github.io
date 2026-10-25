import React, { useState, useEffect, useRef } from 'react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [status, setStatus] = useState('READY');
  const [packetPos, setPacketPos] = useState({ x: 50, y: 50 });
  const [packetVisible, setPacketVisible] = useState(false);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<any>(null);

  const movePacket = () => {
    if (!fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const size = 42;
    const maxX = Math.max(rect.width - size, 10);
    const maxY = Math.max(rect.height - size, 10);
    const nextX = Math.floor(Math.random() * maxX);
    const nextY = Math.floor(Math.random() * maxY);
    setPacketPos({ x: nextX, y: nextY });
  };

  const handleStartGame = () => {
    setScore(0);
    setTimeLeft(20);
    setStatus('TRACING');
    setIsPlaying(true);
    setPacketVisible(true);
    movePacket();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          setPacketVisible(false);
          setStatus(s => (s === 'TRACING' || s === 'PACKET CAUGHT' ? 'TRACE LOST' : s));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      if (score >= 10) {
        setStatus('ROUTE RESTORED');
      } else {
        setStatus('TRACE LOST');
      }
    }
  }, [timeLeft, score]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCatchPacket = () => {
    if (!isPlaying) return;
    const nextScore = score + 1;
    setScore(nextScore);
    setStatus('PACKET CAUGHT');
    movePacket();
  };

  return (
    <main className="error-page">
      <section className="error-terminal">
        <div className="terminal-line">
          <span className="prompt">root@cyberzone</span>:
          <span className="terminal-path">~</span>$ trace route
        </div>
        <div className="error-code">404</div>
        <h1>ERROR: PAGE NOT FOUND</h1>
        <p>
          The page you requested fell out of the packet stream. It may have moved,
          been renamed, or never existed on this node.
        </p>
        <p className="terminal-line">&gt; Suggested recovery: choose a known route below.</p>
        <div className="error-actions">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>HOME</a>
          <a href="/projects" onClick={(e) => { e.preventDefault(); onNavigate('/projects'); }}>PROJECTS</a>
          <a href="/writeups" onClick={(e) => { e.preventDefault(); onNavigate('/writeups'); }}>WRITEUPS</a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}>CONTACT</a>
        </div>

        <section className="packet-game" id="packet-game" aria-label="Lost packet mini game">
          <div className="packet-game-head">
            <div>
              <h2>LOST PACKET</h2>
              <div className="packet-game-status" id="packet-game-status">
                {status}
              </div>
            </div>
            <button
              id="packet-game-start"
              type="button"
              onClick={handleStartGame}
              disabled={isPlaying}
            >
              {isPlaying ? 'RUNNING' : timeLeft === 0 ? 'RETRACE' : 'START TRACE'}
            </button>
          </div>
          <div className="packet-game-stats">
            <span>
              PACKETS: <strong id="packet-game-score">{score}</strong>
            </span>
            <span>
              TIME: <strong id="packet-game-time">{timeLeft}</strong>
            </span>
          </div>
          <div className="packet-game-field" id="packet-game-field" ref={fieldRef}>
            {packetVisible && (
              <button
                className="packet-target visible"
                id="packet-target"
                type="button"
                aria-label="Catch packet"
                style={{
                  left: `${packetPos.x}px`,
                  top: `${packetPos.y}px`,
                }}
                onClick={handleCatchPacket}
              >
                ◆
              </button>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};
