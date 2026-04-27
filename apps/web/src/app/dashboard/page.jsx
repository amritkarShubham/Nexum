import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import {
  Play, MessageSquare, Video, Home, Heart, Gamepad2,
  Sparkles, Moon, Send, Mic, Image, Camera,
  Music, Clock, MapPin, Flame, Star, Zap,
  ChevronRight, Bell, Settings, Search, X, CloudRain
} from 'lucide-react';
import { useNavigate } from 'react-router';

// ── Scroll-triggered reveal hook ──
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Reveal wrapper ──
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NEXUM DASHBOARD — LIVING COUPLE'S COSMOS
   ═══════════════════════════════════════════════ */

// ── Time-based greeting ──
function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return { text: 'Night owl', icon: Moon, emoji: '🌙' };
  if (h < 12) return { text: 'Good morning', icon: Sparkles, emoji: '✨' };
  if (h < 17) return { text: 'Good afternoon', icon: Sparkles, emoji: '☀️' };
  if (h < 21) return { text: 'Good evening', icon: Moon, emoji: '🌅' };
  return { text: 'Good night', icon: Moon, emoji: '🌙' };
}

// ── Live clock ──
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-grotesk text-white/40 text-xs tabular-nums">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

// ── Relationship Counter ──
function DaysTogether({ startDate }) {
  const days = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000);
  return (
    <div className="flex items-center gap-2">
      <Heart size={12} fill="var(--nebula-pink)" className="text-[var(--nebula-pink)] heartbeat" />
      <span className="text-xs text-white/50 font-grotesk">Day <span className="text-[var(--nebula-pink)] font-semibold">{days}</span> together</span>
    </div>
  );
}

// ── Streak Flame ──
function StreakDisplay({ streak }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel" style={{ borderColor: 'rgba(255,209,102,0.15)' }}>
      <Flame size={14} className="text-[var(--nebula-gold)]" style={{ animation: 'heartbeat 1s ease-in-out infinite' }} />
      <span className="text-xs font-semibold text-[var(--nebula-gold)]">{streak}</span>
      <span className="text-xs text-white/40">day streak</span>
    </div>
  );
}

// ── Partner Status Indicator ──
function PartnerStatus({ online, activity }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel animate-reveal delay-200">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
          alt="Partner"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--nebula-violet)]/30"
        />
        {/* Online indicator dot */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-void)] overflow-hidden">
          <div className={`w-full h-full rounded-full ${online ? 'bg-[var(--nebula-aurora-1)]' : 'bg-white/30'}`} />
        </div>
        {online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--nebula-aurora-1)] opacity-50" 
               style={{ animation: 'status-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-white/90">Sarah</p>
        <p className="text-xs text-white/40">{online ? activity || 'Online now' : 'Last seen 2h ago'}</p>
      </div>
    </div>
  );
}

// ── Quick Action Button ──
function QuickAction({ icon: Icon, label, color, onClick, badge }) {
  return (
    <button
      className="glass-panel p-5 flex flex-col items-center justify-center gap-3 group relative cursor-pointer"
      onClick={onClick}
      style={{ minHeight: 120 }}
    >
      {badge && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--nebula-pink)] flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{badge}</span>
        </div>
      )}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
        style={{
          background: `${color}15`,
          boxShadow: `0 0 0 rgba(0,0,0,0)`,
        }}
      >
        <div className="transition-all group-hover:drop-shadow-lg" style={{ color }}>
          <Icon size={26} />
        </div>
      </div>
      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

// ── Mood Selector ──
function MoodSelector({ onSelect }) {
  const moods = [
    { emoji: '🥰', label: 'Loving' },
    { emoji: '😊', label: 'Happy' },
    { emoji: '🤗', label: 'Huggy' },
    { emoji: '😴', label: 'Sleepy' },
    { emoji: '🥺', label: 'Missing you' },
    { emoji: '🔥', label: 'On fire' },
  ];
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex gap-2 flex-wrap">
      {moods.map(m => (
        <button
          key={m.label}
          onClick={() => { setSelected(m.label); onSelect?.(m); }}
          className={`px-3 py-2 rounded-2xl text-sm transition-all duration-300 flex items-center gap-1.5 ${
            selected === m.label
              ? 'bg-[var(--nebula-violet)]/20 border border-[var(--nebula-violet)]/40 scale-105'
              : 'glass-panel hover:scale-105'
          }`}
        >
          <span className="text-base">{m.emoji}</span>
          <span className="text-white/60 text-xs">{m.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Memory Timeline Item ──
function MemoryItem({ type, time, content }) {
  const icons = {
    photo: Image,
    voice: Mic,
    text: MessageSquare,
    music: Music,
  };
  const colors = {
    photo: 'var(--nebula-pink)',
    voice: 'var(--nebula-violet)',
    text: 'var(--nebula-aurora-1)',
    music: 'var(--nebula-gold)',
  };
  const Icon = icons[type] || MessageSquare;
  const color = colors[type] || 'var(--nebula-violet)';

  return (
    <div className="flex items-start gap-3 group">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <div className="w-px h-8 bg-white/5 group-last:hidden" />
      </div>
      <div className="flex-1 pb-4">
        <p className="text-sm text-white/70">{content}</p>
        <p className="text-xs text-white/30 mt-1">{time}</p>
      </div>
    </div>
  );
}

// ── Bottom Nav Item ──
function NavItem({ icon: Icon, label, active, color, onClick, isCenter }) {
  if (isCenter) {
    return (
      <div className="relative -top-5">
        <button
          onClick={onClick}
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, var(--nebula-pink) 0%, var(--nebula-violet) 100%)',
            boxShadow: '0 8px 30px rgba(139,92,246,0.4), 0 0 60px rgba(255,45,123,0.2)',
          }}
        >
          <Icon size={26} />
        </button>
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full glow-ring pointer-events-none" style={{ border: '1px solid rgba(139,92,246,0.3)' }} />
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 transition-all duration-300 ${
        active ? '' : 'text-white/35 hover:text-white/60'
      }`}
    >
      <div className="relative">
        <Icon
          size={22}
          className="transition-all duration-300"
          style={active ? {
            color: color || '#fff',
            filter: `drop-shadow(0 0 8px ${color || 'rgba(255,255,255,0.5)'})`,
          } : {}}
        />
        {active && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: color || '#fff' }} />
        )}
      </div>
      <span className="text-[9px] uppercase tracking-[0.15em] font-medium">{label}</span>
    </button>
  );
}

// ═══ MAIN DASHBOARD ═══
export default function Dashboard() {
  const { socket, connected } = useSocket();
  const [activeTab, setActiveTab] = useState('home');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const greeting = getGreeting();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (socket && connected) {
      socket.emit('join_call_room', { room: 'test_couple_room' });
    }
  }, [socket, connected]);

  if (!mounted) return null;

  return (
    <div className="noise-overlay">
      {/* ═══ BACKGROUND ═══ */}
      <div className="aurora-bg">
        <div className="aurora-layer aurora-1" style={{ opacity: 0.2 }} />
        <div className="aurora-layer aurora-2" style={{ opacity: 0.15 }} />
      </div>
      <div className="star-field" style={{ opacity: 0.4 }} />

      <div className="min-h-screen flex flex-col relative z-10 pb-28">

        {/* ═══ TOP BAR ═══ */}
        <header className="flex justify-between items-center px-5 pt-6 pb-4 animate-reveal">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="You"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-[var(--nebula-violet)]/40 transition-all"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--nebula-aurora-1)] border-2 border-[var(--bg-void)]" />
            </div>
            <div>
              <p className="text-xs text-white/40 font-medium flex items-center gap-1.5">
                {greeting.emoji} {greeting.text}
              </p>
              <h1 className="text-xl font-serif font-bold text-white tracking-wide">Alex</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LiveClock />
            <button className="glass-button w-10 h-10 flex items-center justify-center rounded-full relative">
              <Bell size={18} className="text-white/60" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--nebula-pink)]" />
            </button>
            <button className="glass-button w-10 h-10 flex items-center justify-center rounded-full" onClick={() => navigate('/')}>
              <Settings size={18} className="text-white/60" />
            </button>
          </div>
        </header>

        {/* ═══ PARTNER + META ROW ═══ */}
        <div className="flex items-center justify-between px-5 mb-6">
          <PartnerStatus online={true} activity="Listening to music 🎵" />
          <div className="hidden sm:flex items-center gap-4">
            <StreakDisplay streak={47} />
            <DaysTogether startDate="2024-06-15" />
          </div>
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        <main className="flex-1 px-5 max-w-5xl mx-auto w-full">

          {activeTab === 'home' && (
            <div className="space-y-6">

              {/* ── Daily Prompt Card ── */}
              <Reveal delay={100}>
              <div className="glass-panel p-6 sm:p-10 text-center relative overflow-hidden">
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--nebula-pink), var(--nebula-violet), transparent)' }} />

                {/* Floating sparkles */}
                <div className="absolute top-4 right-4">
                  <Sparkles size={16} className="text-[var(--nebula-gold)] opacity-40 float" />
                </div>
                <div className="absolute bottom-6 left-6">
                  <Star size={12} className="text-[var(--nebula-aurora-1)] opacity-30 float-delayed" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--nebula-pink)]/10 border border-[var(--nebula-pink)]/20 mb-6">
                  <Heart size={12} fill="var(--nebula-pink)" className="text-[var(--nebula-pink)]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--nebula-pink)]">Daily Prompt</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-serif font-medium leading-snug mb-8 text-white/90 max-w-xl mx-auto">
                  "What is something I do that makes you feel <span className="text-gradient italic">most loved</span>?"
                </h3>

                <button className="btn-gradient px-8 py-3 text-base mx-auto flex items-center gap-2">
                  <Send size={16} />
                  <span>Write your answer</span>
                </button>

                <p className="text-xs text-white/30 mt-6 flex items-center justify-center gap-1.5">
                  <Clock size={10} />
                  Sarah answered 2 hours ago
                </p>
              </div>
              </Reveal>

              {/* ── Mood Check ── */}
              <Reveal delay={200}>
              <div className="glass-panel p-5">
                <p className="text-sm text-white/50 mb-3 font-medium">How are you feeling right now?</p>
                <MoodSelector />
              </div>
              </Reveal>

              {/* ── Quick Actions Grid ── */}
              <Reveal delay={300}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <QuickAction icon={Video} label="Video Call" color="var(--nebula-pink)" badge="!" />
                <QuickAction icon={Play} label="Watch Party" color="var(--nebula-violet)" />
                <QuickAction icon={Gamepad2} label="Play Games" color="var(--nebula-aurora-1)" badge="3" />
                <QuickAction icon={Mic} label="Voice Note" color="var(--nebula-gold)" />
              </div>
              </Reveal>

              {/* ── Shared Moments Timeline ── */}
              <Reveal delay={350}>
              <div className="glass-panel p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
                    <Sparkles size={14} className="text-[var(--nebula-violet)]" />
                    Today's Moments
                  </h3>
                  <button className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                    See all <ChevronRight size={12} />
                  </button>
                </div>
                <MemoryItem type="photo" time="2:30 PM" content="Sarah shared a sunset photo from the balcony 🌅" />
                <MemoryItem type="music" time="1:15 PM" content='You both listened to "Golden Hour" by JVKE' />
                <MemoryItem type="voice" time="11:00 AM" content="You sent a 45s voice note 💬" />
                <MemoryItem type="text" time="9:20 AM" content='"Good morning sunshine ☀️ dreamed about you"' />
              </div>
              </Reveal>

              {/* ── Mini Widgets Row ── */}
              <Reveal delay={400}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Weather at partner's location */}
                <div className="glass-panel p-5 flex items-center gap-4">
                  <div className="text-3xl">🌤️</div>
                  <div>
                    <p className="text-xs text-white/40 flex items-center gap-1"><MapPin size={10} /> Sarah's weather</p>
                    <p className="text-lg font-semibold font-grotesk text-white/80">24°C <span className="text-xs text-white/40 font-normal">Partly cloudy</span></p>
                    <p className="text-xs text-white/30">Mumbai, India</p>
                  </div>
                </div>

                {/* Next milestone */}
                <div className="glass-panel p-5 flex items-center gap-4">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <p className="text-xs text-white/40">Next milestone</p>
                    <p className="text-lg font-semibold font-grotesk text-white/80">2 Year Anniversary</p>
                    <p className="text-xs text-[var(--nebula-gold)]">in 47 days ✨</p>
                  </div>
                </div>
              </div>
              </Reveal>

              {/* ── Shared Music Widget ── */}
              <Reveal delay={450}>
              <div className="glass-panel p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=120&q=80" 
                    alt="Album art" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/40 flex items-center gap-1">
                    <Music size={10} className="text-[var(--nebula-aurora-1)]" />
                    Now Playing Together
                  </p>
                  <p className="text-sm font-medium text-white/80 truncate">Golden Hour — JVKE</p>
                  <div className="w-full h-1 rounded-full bg-white/5 mt-2 overflow-hidden">
                    <div className="h-full rounded-full w-[65%]" 
                         style={{ background: 'linear-gradient(90deg, var(--nebula-violet), var(--nebula-pink))' }} />
                  </div>
                </div>
                <button className="glass-button w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play size={16} className="text-white/70 ml-0.5" />
                </button>
              </div>
              </Reveal>

            </div>
          )}

          {/* ═══ STREAM TAB ═══ */}
          {activeTab === 'stream' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[60vh] animate-reveal">
              <div className="relative mb-8">
                <div className="w-28 h-28 rounded-full bg-[var(--nebula-violet)]/15 flex items-center justify-center glow-ring">
                  <Play size={44} className="text-[var(--nebula-violet)] ml-2" />
                </div>
                {/* Orbit decoration */}
                <div className="absolute inset-[-20px] rounded-full border border-[var(--nebula-violet)]/10 orbit-ring" />
              </div>
              <h2 className="text-3xl font-serif mb-4 text-gradient">Movie Night</h2>
              <p className="text-white/45 max-w-md mx-auto mb-8 font-light">
                Paste a YouTube link to watch together in perfect sync.
                Reactions, commentary, and cozy vibes included.
              </p>
              <div className="flex w-full max-w-md gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube link..."
                  className="flex-1 px-5 py-3.5 text-sm"
                />
                <button className="btn-gradient px-6 flex items-center gap-2">
                  <Zap size={16} />
                  Sync
                </button>
              </div>
            </div>
          )}

          {/* ═══ GAMES TAB ═══ */}
          {activeTab === 'games' && (
            <div className="space-y-4 animate-reveal">
              <h2 className="text-2xl font-serif mb-6 text-gradient">Play Together</h2>
              {[
                { name: 'Couple Trivia', desc: 'How well do you know each other?', emoji: '🧠', color: 'var(--nebula-violet)' },
                { name: 'Truth or Dare', desc: 'Spicy, sweet, or silly — you choose', emoji: '🔥', color: 'var(--nebula-pink)' },
                { name: 'Drawing Battle', desc: 'Guess what your partner draws', emoji: '🎨', color: 'var(--nebula-aurora-1)' },
                { name: 'Word Chain', desc: 'Keep the chain alive', emoji: '💬', color: 'var(--nebula-gold)' },
              ].map(game => (
                <button key={game.name} className="glass-panel w-full p-5 flex items-center gap-4 text-left group">
                  <div className="text-3xl group-hover:scale-125 transition-transform duration-300">{game.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white/90">{game.name}</h3>
                    <p className="text-xs text-white/40">{game.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* ═══ CHAT TAB ═══ */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[65vh] animate-reveal">
              <h2 className="text-2xl font-serif mb-4 text-gradient">Messages</h2>
              <div className="flex-1 glass-panel p-4 space-y-3 overflow-y-auto mb-4" style={{ scrollbarWidth: 'none' }}>
                {/* Sample messages */}
                <div className="flex justify-start">
                  <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    Good morning babe!! ☀️ miss you so much
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-md text-sm" style={{ background: 'rgba(255,45,123,0.15)' }}>
                    miss you more 🥺💕 can we watch something tonight?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    absolutely!! movie night date 🍿✨
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Type a message..." className="flex-1 px-5 py-3" />
                <button className="btn-gradient px-4 rounded-xl flex items-center"><Send size={18} /></button>
              </div>
            </div>
          )}
        </main>

        {/* ═══ BOTTOM NAV ═══ */}
        <div className="fixed bottom-0 left-0 w-full glass-nav px-4 pt-3 pb-5 flex justify-center items-end z-50">
          <nav className="flex items-end gap-1 sm:gap-4 w-full max-w-md justify-between">
            <NavItem icon={Home} label="Home" active={activeTab === 'home'} color="#fff" onClick={() => setActiveTab('home')} />
            <NavItem icon={Play} label="Stream" active={activeTab === 'stream'} color="var(--nebula-violet)" onClick={() => setActiveTab('stream')} />
            <NavItem icon={Video} label="" isCenter onClick={() => {}} />
            <NavItem icon={Gamepad2} label="Games" active={activeTab === 'games'} color="var(--nebula-pink)" onClick={() => setActiveTab('games')} />
            <NavItem icon={MessageSquare} label="Chat" active={activeTab === 'chat'} color="var(--nebula-aurora-1)" onClick={() => setActiveTab('chat')} badge={2} />
          </nav>
        </div>
      </div>
    </div>
  );
}
