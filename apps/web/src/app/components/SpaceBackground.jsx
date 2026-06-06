import { useEffect, useRef } from 'react';

const STARS = [
  { count: 120, cls: 'star-sm', speed: 0.02, size: 1, shadow: '' },
  { count: 60, cls: 'star-md', speed: 0.06, size: 2, shadow: '0 0 2px rgba(255,255,255,0.2)' },
  { count: 25, cls: 'star-lg', speed: 0.12, size: 3, shadow: '0 0 6px rgba(255,255,255,0.3)' },
];

const starStyles = `
  @keyframes twinkle-bg {
    0% { opacity: 0.15; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes orbitA-bg {
    0% { transform: translateY(0) translateZ(-20px) rotateX(5deg); }
    50% { transform: translateY(-25px) translateZ(10px) rotateX(-3deg); }
    100% { transform: translateY(12px) translateZ(20px) rotateX(7deg); }
  }
  @keyframes orbitB-bg {
    0% { transform: translateY(10px) translateZ(20px) rotateX(-5deg); }
    50% { transform: translateY(-15px) translateZ(-10px) rotateX(3deg); }
    100% { transform: translateY(0) translateZ(-20px) rotateX(-7deg); }
  }
  @keyframes ring-spin-bg {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes beam-pulse-bg {
    0%, 100% { opacity: 0.3; transform: scaleY(1); }
    50% { opacity: 1; transform: scaleY(2.5); }
  }
  @keyframes float-p-bg {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-18px); }
  }
`;

export default function SpaceBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    STARS.forEach(l => {
      const div = document.createElement('div');
      div.style.cssText = 'position:absolute;inset:0;will-change:transform';
      div.dataset.speed = String(l.speed);
      for (let i = 0; i < l.count; i++) {
        const s = document.createElement('div');
        s.style.cssText = `position:absolute;border-radius:50%;background:#fff;left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${l.size}px;height:${l.size}px;box-shadow:${l.shadow};animation:twinkle-bg ${2 + Math.random() * 4}s ease-in-out infinite alternate;animation-delay:${Math.random() * 4}s;opacity:${0.3 + Math.random() * 0.7}`;
        div.appendChild(s);
      }
      container.appendChild(div);
    });

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sy = window.scrollY;
          container.querySelectorAll('[data-speed]').forEach(el => {
            el.style.transform = `translateY(${sy * parseFloat(el.dataset.speed)}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{starStyles}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none', overflow: 'hidden',
        background: 'var(--bg)',
      }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

        {/* Orbiting planets + beam */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 600, height: 600,
          transform: 'translate(-50%, -55%)',
          perspective: 1200,
          pointerEvents: 'none',
          opacity: 0.25,
        }}>
          {/* Planet A - Rose */}
          <div style={{
            position: 'absolute', borderRadius: '50%',
            width: 110, height: 110,
            top: '50%', left: '18%',
            background: 'radial-gradient(circle at 35% 35%, #ff8ab5, #FF6B9D 40%, #cc3d6a 80%)',
            boxShadow: '0 0 60px rgba(255,107,157,0.3), inset -20px -20px 60px rgba(0,0,0,0.4)',
            animation: 'orbitA-bg 8s ease-in-out infinite alternate',
            willChange: 'transform',
          }}>
            <div style={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              border: '1px solid rgba(255,107,157,0.15)',
              animation: 'ring-spin-bg 12s linear infinite',
            }} />
          </div>

          {/* Beam */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 280, height: 5,
            transform: 'translate(-50%, -50%)',
          }}>
            {[0.6, 0.3, 0.15, 0.3].map((opacity, i) => (
              <div key={i} style={{
                position: 'absolute', top: 0,
                left: `${10 * i}%`, right: `${10 * i}%`,
                height: '100%', borderRadius: 3,
                background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#FF6B9D' : '#7C3AED'}, ${i % 2 === 0 ? '#7C3AED' : '#FF6B9D'}, transparent)`,
                opacity,
                animation: 'beam-pulse-bg 2.5s ease-in-out infinite',
                animationDelay: `${0.3 * i}s`,
                filter: i > 0 ? `blur(${8 * (i - 0.5)}px)` : 'none',
              }} />
            ))}
          </div>

          {/* Planet B - Violet */}
          <div style={{
            position: 'absolute', borderRadius: '50%',
            width: 90, height: 90,
            top: '50%', right: '18%',
            background: 'radial-gradient(circle at 35% 35%, #b794f4, #7C3AED 40%, #5b21b6 80%)',
            boxShadow: '0 0 60px rgba(124,58,237,0.3), inset -20px -20px 60px rgba(0,0,0,0.4)',
            animation: 'orbitB-bg 8s ease-in-out infinite alternate',
            willChange: 'transform',
          }}>
            <div style={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              border: '1px solid rgba(124,58,237,0.15)',
              animation: 'ring-spin-bg 10s linear infinite reverse',
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
