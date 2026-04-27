import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Video, Play, Gamepad2, ArrowRight, Sparkles, Moon, Star, Zap, Shield, Clock, MessageCircleHeart } from 'lucide-react';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════
   NEXUM — COSMIC LANDING EXPERIENCE
   "Two souls, one constellation"
   ═══════════════════════════════════════════════ */

// ── Floating Particle System ──
function ParticleField({ count = 40 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 10,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(139,92,246,${p.opacity}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 4}px rgba(139,92,246,${p.opacity * 0.5})`,
            animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Orbiting Ring Decoration ──
function OrbitRings() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
      {[300, 450, 600].map((size, i) => (
        <div
          key={size}
          className={i % 2 === 0 ? 'orbit-ring' : 'orbit-ring-reverse'}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            top: `calc(50% - ${size / 2}px)`,
            left: `calc(50% - ${size / 2}px)`,
            border: `1px solid rgba(139,92,246,${0.08 - i * 0.02})`,
            borderRadius: '50%',
          }}
        >
          {/* Orbiting dot */}
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: -4,
              left: '50%',
              background: i === 0 ? 'var(--nebula-pink)' : i === 1 ? 'var(--nebula-aurora-1)' : 'var(--nebula-violet)',
              boxShadow: `0 0 12px ${i === 0 ? 'var(--nebula-pink)' : i === 1 ? 'var(--nebula-aurora-1)' : 'var(--nebula-violet)'}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Morphing Blob (hero background element) ──
function MorphBlob({ color, size, top, left, delay = 0 }) {
  return (
    <div
      className="absolute morph-blob pointer-events-none"
      style={{
        width: size, height: size, top, left,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(80px)',
        opacity: 0.4,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    />
  );
}

// ── Interactive Feature Card ──
function FeatureCard({ icon: Icon, title, description, color, delay, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) translateY(-4px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = '';
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass-panel p-8 group cursor-default animate-reveal delay-${delay}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease, background 0.5s, border-color 0.5s, box-shadow 0.5s' }}
    >
      {/* Glow border on hover */}
      <div
        className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color}15, transparent 60%)`,
        }}
      />

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg relative"
        style={{
          background: `${color}15`,
          boxShadow: `0 0 0 rgba(0,0,0,0)`,
        }}
      >
        <Icon size={30} style={{ color }} />
        {/* Pulse ring on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            animation: 'ring-pulse 2s ease-in-out infinite',
            border: `1px solid ${color}40`,
          }}
        />
      </div>

      <h3 className="text-xl font-serif font-semibold mb-3 tracking-wide">{title}</h3>
      <p className="text-white/45 font-light leading-relaxed text-[15px]">{description}</p>
    </div>
  );
}

// ── Stats Counter ──
function AnimatedStat({ end, suffix, label, delay }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      let start = 0;
      const step = end / 60;
      const interval = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(interval); }
        else setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, end, delay]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold font-grotesk text-gradient mb-2">
        {count}{suffix}
      </div>
      <div className="text-white/40 text-sm font-light">{label}</div>
    </div>
  );
}

// ── Main Landing Page ──
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  if (!mounted) return null;

  return (
    <div className="noise-overlay">
      {/* ═══ COSMIC BACKGROUND LAYERS ═══ */}
      <div className="aurora-bg">
        <div className="aurora-layer aurora-1" />
        <div className="aurora-layer aurora-2" />
        <div className="aurora-layer aurora-3" />
      </div>
      <div className="star-field" />
      <ParticleField count={50} />

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ═══ NAVIGATION ═══ */}
        <header className="flex justify-between items-center px-6 md:px-12 py-6 animate-reveal">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[var(--nebula-pink)] to-[var(--nebula-violet)] flex items-center justify-center heartbeat-glow">
                <Heart fill="white" size={18} className="text-white drop-shadow-lg" />
              </div>
              {/* Orbiting dot */}
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--nebula-aurora-1)] border-2 border-[var(--bg-void)]"
                style={{ animation: 'ring-pulse 3s ease-in-out infinite' }} />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">
              Nex<span className="text-gradient">um</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Cosmos', 'Pricing'].map(item => (
              <button key={item} className="text-white/50 hover:text-white transition-colors text-sm font-medium tracking-wide relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[var(--nebula-pink)] to-[var(--nebula-violet)] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="glass-button px-5 py-2.5 text-sm hidden md:block">Sign In</button>
            <button className="btn-gradient px-6 py-2.5 text-sm" onClick={() => navigate('/dashboard')}>
              Enter Cosmos
            </button>
          </div>
        </header>

        {/* ═══ HERO SECTION ═══ */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">

          {/* Parallax morphing blobs */}
          <div style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}>
            <MorphBlob color="var(--nebula-violet)" size="60vw" top="-20%" left="-20%" delay={0} />
            <MorphBlob color="var(--nebula-pink)" size="40vw" top="20%" left="50%" delay={4} />
            <MorphBlob color="var(--nebula-aurora-1)" size="30vw" top="60%" left="10%" delay={8} />
          </div>

          <OrbitRings />

          <div className="text-center max-w-5xl mx-auto relative z-10">
            {/* Badge */}
            <div className="animate-reveal inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-panel mb-10 border-[var(--nebula-violet)]/20">
              <div className="flex items-center gap-1">
                <Sparkles size={14} className="text-[var(--nebula-gold)]" />
                <Sparkles size={10} className="text-[var(--nebula-aurora-1)]" />
              </div>
              <span className="text-sm font-medium text-holo">Two Souls, One Constellation</span>
            </div>

            {/* Main heading */}
            <h2 className="animate-reveal delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-bold mb-8 tracking-tight leading-[1.05]">
              Love has no
              <br />
              <span className="text-gradient text-glow italic relative">
                distance.
                {/* Underline decoration */}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" aria-hidden="true">
                  <path d="M2 8 Q75 2 150 8 Q225 14 298 4" stroke="url(#grad1)" strokeWidth="2.5" strokeLinecap="round" fill="none" className="connection-line" />
                  <defs><linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--nebula-pink)" />
                    <stop offset="100%" stopColor="var(--nebula-aurora-1)" />
                  </linearGradient></defs>
                </svg>
              </span>
            </h2>

            {/* Subtitle */}
            <p className="animate-reveal delay-200 text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-14 font-light leading-relaxed">
              An immersive digital cosmos built exclusively for you two.
              Synchronized streaming, intimate games, persistent presence &mdash;
              <span className="text-white/80 font-medium"> where every pixel pulses with your heartbeat.</span>
            </p>

            {/* CTA Buttons */}
            <div className="animate-reveal delay-300 flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                className="btn-gradient text-lg px-10 py-4 flex items-center justify-center gap-3 group"
                onClick={() => navigate('/dashboard')}
              >
                <span>Enter Your Cosmos</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="glass-button text-lg px-10 py-4 flex items-center justify-center gap-2">
                <Play size={18} className="text-[var(--nebula-violet)]" />
                <span>Watch the Story</span>
              </button>
            </div>

            {/* Social proof */}
            <div className="animate-reveal delay-400 flex items-center justify-center gap-6 text-white/30 text-sm">
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-[var(--bg-void)] object-cover"
                  />
                ))}
              </div>
              <span>Trusted by <span className="text-white/60 font-medium">12,000+</span> couples worldwide</span>
            </div>
          </div>
        </section>

        {/* ═══ STATS SECTION ═══ */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat end={12} suffix="K+" label="Couples Connected" delay={0} />
            <AnimatedStat end={98} suffix="%" label="Uptime" delay={100} />
            <AnimatedStat end={4} suffix=".9" label="App Rating" delay={200} />
            <AnimatedStat end={50} suffix="M+" label="Minutes Shared" delay={300} />
          </div>
        </section>

        {/* ═══ FEATURES GRID ═══ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="animate-reveal text-4xl md:text-5xl font-serif font-bold mb-4">
              Built for <span className="text-gradient">intimacy</span>
            </h2>
            <p className="animate-reveal delay-100 text-white/40 text-lg max-w-xl mx-auto font-light">
              Every feature designed to make distance disappear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={Play}
              title="Synced Streaming"
              description="Watch movies and YouTube together in perfect sync. Pause, react, and experience every moment as one."
              color="var(--nebula-violet)"
              delay={200}
              index={0}
            />
            <FeatureCard
              icon={Gamepad2}
              title="Couple Games"
              description="Trivia, Truth or Dare, Drawing battles — keep the spark alive with playful competition and intimate prompts."
              color="var(--nebula-pink)"
              delay={300}
              index={1}
            />
            <FeatureCard
              icon={Video}
              title="Always-On Presence"
              description="A persistent HD connection running in the background. Feel their presence throughout your entire day."
              color="var(--nebula-aurora-1)"
              delay={400}
              index={2}
            />
            <FeatureCard
              icon={MessageCircleHeart}
              title="Love Letters"
              description="Handwritten digital notes, voice memos, and surprise messages that arrive like whispers across the cosmos."
              color="var(--nebula-coral)"
              delay={500}
              index={3}
            />
            <FeatureCard
              icon={Moon}
              title="Sleep Together"
              description="Fall asleep to each other's breathing. Ambient soundscapes sync your rest, making nights feel less lonely."
              color="var(--nebula-gold)"
              delay={600}
              index={4}
            />
            <FeatureCard
              icon={Shield}
              title="Private Cosmos"
              description="End-to-end encrypted. Your universe is yours alone — no data mining, no third parties, just you two."
              color="var(--nebula-indigo)"
              delay={700}
              index={5}
            />
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="animate-reveal text-4xl md:text-5xl font-serif font-bold mb-4">
              Three steps to <span className="text-gradient">forever</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line between steps */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[1px]" 
                 style={{ background: 'linear-gradient(90deg, transparent, var(--nebula-violet), var(--nebula-pink), transparent)' }} />
            
            {[
              { step: '01', title: 'Create Your Cosmos', desc: 'Sign up and invite your partner. Your private universe is born in seconds.', emoji: '🌌' },
              { step: '02', title: 'Sync Your Hearts', desc: 'Set your mood, share your day, and stay present with always-on connection.', emoji: '💫' },
              { step: '03', title: 'Live Without Limits', desc: 'Watch, play, talk, and grow together — as if distance never existed.', emoji: '✨' },
            ].map((item, i) => (
              <div key={item.step} className={`text-center animate-reveal delay-${(i + 2) * 100}`}>
                <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-panel flex items-center justify-center relative">
                  <span className="text-3xl">{item.emoji}</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--nebula-violet)]/20 border border-[var(--nebula-violet)]/30 flex items-center justify-center">
                    <span className="text-xs font-bold font-grotesk text-[var(--nebula-violet)]">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-lg font-serif font-semibold mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm font-light max-w-[240px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="animate-reveal text-4xl md:text-5xl font-serif font-bold mb-4">
              Love <span className="text-gradient">stories</span>
            </h2>
            <p className="animate-reveal delay-100 text-white/40 text-lg max-w-xl mx-auto font-light">
              Real couples. Real connections. Real magic.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Nexum made our 8,000 miles feel like 8 inches. The synced movie nights are our favorite ritual now.",
                name: "Priya & James",
                location: "Mumbai ↔ London",
                days: "412 days strong"
              },
              {
                quote: "I fall asleep to the sound of her breathing every night. It sounds simple, but it changed everything for us.",
                name: "Carlos & Mia",
                location: "São Paulo ↔ Tokyo",
                days: "289 days strong"
              },
              {
                quote: "The daily prompts started conversations we never would have had. We're closer now than when we lived together.",
                name: "Alex & Jordan",
                location: "NYC ↔ Paris",
                days: "567 days strong"
              },
            ].map((t, i) => (
              <div key={i} className={`glass-panel p-6 animate-reveal delay-${(i + 2) * 100}`}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="var(--nebula-gold)" className="text-[var(--nebula-gold)]" />
                  ))}
                </div>
                <p className="text-white/60 text-sm font-light leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/80">{t.name}</p>
                    <p className="text-xs text-white/30">{t.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--nebula-pink)]">
                    <Heart size={10} fill="var(--nebula-pink)" />
                    {t.days}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ IMMERSIVE CTA SECTION ═══ */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="w-[600px] h-[600px] rounded-full morph-blob"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 60%)',
                filter: 'blur(60px)',
              }}
            />
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--nebula-pink)] to-[var(--nebula-violet)] flex items-center justify-center heartbeat heartbeat-glow">
                <Heart fill="white" size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Your cosmos
              <br />
              <span className="text-gradient">awaits.</span>
            </h2>
            <p className="text-white/45 text-lg mb-10 font-light max-w-lg mx-auto">
              Join thousands of couples who've turned distance into an adventure.
              Start your journey through the stars tonight.
            </p>
            <button
              className="btn-gradient text-xl px-12 py-5 flex items-center justify-center gap-3 mx-auto group"
              onClick={() => navigate('/dashboard')}
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Begin Together</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-white/5 py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--nebula-pink)] to-[var(--nebula-violet)] flex items-center justify-center">
                <Heart fill="white" size={14} className="text-white" />
              </div>
              <span className="font-serif font-semibold text-lg">Nexum</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/30">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
            <p className="text-white/20 text-xs">© 2026 Nexum. Made with love across light-years.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
