import React, { useEffect, useRef, useState } from 'react';

export const LightCycleArena: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(3);

  const routes = [
    [[-0.12, 0.7], [0.28, 0.7], [0.28, 0.32], [0.67, 0.32], [0.67, 0.7], [1.12, 0.7]],
    [[-0.12, 0.27], [0.43, 0.27], [0.43, 0.78], [0.81, 0.78], [0.81, 0.38], [1.12, 0.38]],
  ];

  const height = 112;

  useEffect(() => {
    const canvas = canvasRef.current;
    const arena = arenaRef.current;
    if (!canvas || !arena) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = arena.clientWidth || 800;

    const locate = (route: number[][], progress: number) => {
      const points = route.map(([x, y]) => [x * width, y * height]);
      const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
      let distance = Math.max(0, Math.min(1, progress)) * lengths.reduce((a, b) => a + b, 0);
      for (let i = 0; i < lengths.length; i++) {
        if (distance <= lengths[i] || i === lengths.length - 1) {
          const ratio = lengths[i] ? distance / lengths[i] : 0;
          return {
            x: points[i][0] + (points[i + 1][0] - points[i][0]) * ratio,
            y: points[i][1] + (points[i + 1][1] - points[i][1]) * ratio,
            angle: Math.atan2(points[i + 1][1] - points[i][1], points[i + 1][0] - points[i][0]),
          };
        }
        distance -= lengths[i];
      }
      return { x: 0, y: 0, angle: 0 };
    };

    const drawCycle = (route: number[][], progress: number, color: string) => {
      if (progress < 0 || progress > 1) return;
      context.strokeStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 8;
      context.lineWidth = 2;

      for (let i = 0; i < 100; i++) {
        const start = progress - 0.23 + i * 0.0023;
        if (start < 0) continue;
        const a = locate(route, start);
        const b = locate(route, Math.min(progress, start + 0.0023));
        context.globalAlpha = i / 100;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }

      const head = locate(route, progress);
      context.globalAlpha = 1;
      context.save();
      context.translate(head.x, head.y);
      context.rotate(head.angle);
      context.fillStyle = '#06121b';

      [-7, 7].forEach(x => {
        context.beginPath();
        context.arc(x, 2, 4, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      });

      context.beginPath();
      context.moveTo(-9, -2);
      context.lineTo(-3, -5);
      context.lineTo(6, -4);
      context.lineTo(11, 0);
      context.lineTo(-9, 0);
      context.closePath();
      context.fill();
      context.stroke();
      context.restore();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.shadowBlur = 0;
      context.globalAlpha = 1;
      context.strokeStyle = '#143340';
      context.lineWidth = 1;
      context.beginPath();
      for (let x = 0; x < width; x += 32) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let y = 16; y < height; y += 24) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();

      const phase = elapsedTimeRef.current % 16;
      drawCycle(routes[0], phase / 12, '#72edff');
      drawCycle(routes[1], (phase - 2) / 12, '#ffad51');
    };

    const tick = (now: number) => {
      if (previousTimeRef.current) {
        elapsedTimeRef.current += Math.min((now - previousTimeRef.current) / 1000, 0.05);
      }
      previousTimeRef.current = now;
      draw();
      if (!paused) {
        animationFrameId.current = requestAnimationFrame(tick);
      }
    };

    const updateSize = () => {
      if (!arena) return;
      width = arena.clientWidth || 800;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      draw();
    };

    updateSize();
    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(arena);

    if (!paused) {
      previousTimeRef.current = 0;
      animationFrameId.current = requestAnimationFrame(tick);
    } else {
      draw();
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
    };
  }, [paused]);

  return (
    <div className="light-cycle-arena" ref={arenaRef}>
      <canvas ref={canvasRef} aria-hidden="true" style={{ width: '100%', height: '112px', display: 'block' }} />
      <button
        type="button"
        className="light-cycle-control"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? 'Play light-cycle animation' : 'Pause light-cycle animation'}
      >
        {paused ? 'PLAY LIGHT CYCLES' : 'PAUSE LIGHT CYCLES'}
      </button>
    </div>
  );
};
