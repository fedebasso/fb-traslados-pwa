import { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
}

export const WaterDropEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial ripples
    const createRipple = (x?: number, y?: number) => {
      const ripple: Ripple = {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        radius: 0,
        opacity: 0.4,
        speed: 1 + Math.random() * 2,
      };
      ripplesRef.current.push(ripple);
    };

    // Auto-generate ripples
    const autoRippleInterval = setInterval(() => {
      if (ripplesRef.current.length < 8) {
        createRipple();
      }
    }, 2000);

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.95) {
        createRipple(e.clientX, e.clientY);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += ripple.speed;
        ripple.opacity -= 0.003;

        if (ripple.opacity <= 0) return false;

        // Draw ripple
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(28, 42%, 42%, ${ripple.opacity * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner ripple
        if (ripple.radius > 20) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(30, 40%, 52%, ${ripple.opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      clearInterval(autoRippleInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto opacity-70"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};
