import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSocket } from '../../context/SocketContext';
import useStore, { PLANS } from '../../store/useStore';
import {
  Play, MessageSquare, Video, Gamepad2, Heart,
  Mic, Phone, Send, Sparkles, ChevronRight, Crown,
} from 'lucide-react';

const ACTIONS = [
  { icon: Video, label: 'Video call', desc: 'HD call', path: '/video-call', color: 'var(--accent)' },
  { icon: Phone, label: 'Voice call', desc: 'Audio only', path: '/voice-call', color: 'var(--violet)' },
  { icon: Play, label: 'Watch', desc: 'Synced streaming', path: '/watch-together', color: 'var(--glow)' },
  { icon: Gamepad2, label: 'Games', desc: '3 available', path: '/games', color: 'var(--amber)' },
];

const MOODS = [
  { emoji: '☀️', label: 'Good' }, { emoji: '🥰', label: 'Loving' },
  { emoji: '😴', label: 'Tired' }, { emoji: '🥺', label: 'Miss you' },
  { emoji: '🤗', label: 'Huggy' }, { emoji: '🔥', label: 'Fired up' },
];

const RECENT = [
  { emoji: '🌅', text: 'Your partner shared a sunset photo', time: '2:30 PM' },
  { emoji: '🎵', text: 'You both listened to Golden Hour — JVKE', time: '1:15 PM' },
  { emoji: '🎤', text: 'You sent a voice message', time: '11:00 AM' },
  { emoji: '💬', text: '"Good morning sunshine ☀️"', time: '9:20 AM' },
];

const PLAN_UPGRADES = {
  spark: { target: 'embrace', label: 'Upgrade to Embrace', desc: 'Unlock unlimited everything' },
  embrace: { target: 'eclipse', label: 'Go Eclipse', desc: 'Two souls, one orbit' },
  eclipse: null,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { connected } = useSocket();
  const { user, partner, partnerOnline, currentMood, setCurrentMood, streak, daysSinceStart, plan, setPlan, showUpgradeBanner, setShowUpgradeBanner } = useStore();
  const [mood, setMood] = useState(currentMood);
  const currentPlan = PLANS[plan];
  const upgrade = PLAN_UPGRADES[plan];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 100px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, marginBottom: 2 }}>
            Hey, {user?.name || 'You'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
            onClick={() => setPlan(upgrade?.target || 'spark')}>
            <Crown size={12} style={{ color: currentPlan.color }} />
            <span style={{ color: currentPlan.color }}>{currentPlan.icon} {currentPlan.name}</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={`dot ${connected ? 'dot-green' : 'dot-gray'}`} />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              {connected ? 'Online' : 'Offline'}
            </span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/connect')}>
            <MessageSquare size={17} />
          </button>
        </div>
      </div>

      {/* Upgrade banner */}
      {showUpgradeBanner && upgrade && (
        <div className="card" style={{ padding: '14px 16px', marginBottom: 20, border: '1px solid rgba(124, 58, 237, 0.15)', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(255, 107, 157, 0.04))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--violet-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              {PLANS[upgrade.target].icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{upgrade.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{upgrade.desc}</div>
            </div>
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 11, whiteSpace: 'nowrap' }}
              onClick={() => { setPlan(upgrade.target); setShowUpgradeBanner(false); }}>
              {PLANS[upgrade.target].price}
            </button>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 14 }} onClick={() => setShowUpgradeBanner(false)}>×</button>
          </div>
        </div>
      )}

      {/* Partner card */}
      <div className="card card-accent" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', marginBottom: 28 }}>
        <div className="avatar-wrapper">
          <img src={partner.avatar || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%236c63ff"/><text x="16" y="21" text-anchor="middle" fill="white" font-size="14">P</text></svg>'} alt="" className="avatar avatar-md" />
          <span className={`avatar-dot ${partnerOnline ? 'online' : 'offline'}`} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{partner.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>
            {partnerOnline ? 'Listening to music' : 'Last seen 2h ago'}
          </div>
        </div>
        <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => navigate('/connect')}>
          Message
        </button>
      </div>

      {/* Quick actions grid */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Quick actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {ACTIONS.map(a => (
            <button key={a.label} onClick={() => navigate(a.path)}
              className="card"
              style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%', color: 'var(--text)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <a.icon size={16} style={{ color: a.color }} />
              </div>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 1 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{a.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="card" style={{ padding: '16px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          How are you feeling?
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {MOODS.map(m => (
            <button key={m.label} onClick={() => { setMood(m.label); setCurrentMood(m.label); }}
              style={{
                padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid',
                cursor: 'pointer', fontSize: 12, transition: 'all var(--duration) var(--ease)',
                background: m.label === mood ? 'var(--accent-subtle)' : 'transparent',
                borderColor: m.label === mood ? 'var(--accent)' : 'var(--border)',
                color: m.label === mood ? 'var(--accent)' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily prompt */}
      <div className="card card-glow" style={{ padding: '20px', marginBottom: 28 }}>
        <div className="tag tag-violet" style={{ marginBottom: 12 }}>💌 Daily prompt</div>
        <p style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 16 }}>
          "What is something I did recently that made you smile?"
        </p>
        <button className="btn btn-secondary" style={{ fontSize: 12 }}>
          <Send size={13} /> Write your answer
        </button>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 12 }}>
          {partner?.name || 'Partner'} answered 2h ago
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[
          { value: daysSinceStart, label: 'days together', color: 'var(--accent)' },
          { value: streak, label: 'day streak', color: 'var(--violet)' },
          { value: '2yr', label: 'anniversary', color: 'var(--glow)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: 1, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            Today
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer' }}>
            See all
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {RECENT.map((r, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
              <span style={{ fontSize: 20 }}>{r.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.text}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{r.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg)', borderTop: '1px solid var(--border)',
        padding: '8px 16px 24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: 400, margin: '0 auto' }}>
          {[
            { icon: Heart, label: 'Home', path: '/dashboard' },
            { icon: Play, label: 'Watch', path: '/watch-together' },
            { icon: Video, label: 'Call', path: '/video-call', primary: true },
            { icon: Gamepad2, label: 'Games', path: '/games' },
            { icon: MessageSquare, label: 'Chat', path: '/connect', badge: '2' },
          ].map(item => {
            const Icon = item.icon;
            if (item.primary) {
              return (
                <button key={item.label} onClick={() => navigate(item.path)}
                  className="btn-icon-lg animate-glow"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--violet))', color: '#fff', border: 'none',
                    cursor: 'pointer', marginTop: -12, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    transition: 'transform var(--duration) var(--ease)',
                  }}>
                  <Icon size={22} />
                </button>
              );
            }
            return (
              <button key={item.label} onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  background: 'none', border: 'none', color: 'var(--text-tertiary)',
                  cursor: 'pointer', padding: '4px 8px', position: 'relative', fontSize: 10,
                }}>
                <div style={{ position: 'relative' }}>
                  <Icon size={19} />
                  {item.badge && (
                    <span style={{
                      position: 'absolute', top: -6, right: -8, width: 16, height: 16,
                      borderRadius: '50%', background: 'var(--accent)', color: '#fff',
                      fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600,
                    }}>{item.badge}</span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
