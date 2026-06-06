import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: '🎬', title: 'Synchronized streaming', desc: 'Watch movies and shows together in real-time. No more counting down.' },
  { icon: '🎯', title: 'Games for two', desc: 'Trivia, truth or dare, would you rather — built for couples, not parties.' },
  { icon: '📞', title: 'HD video & voice', desc: 'Calls that feel like hanging out, not a conference. Always-on when you need it.' },
  { icon: '💭', title: 'Daily check-ins', desc: 'Mood, prompts, shared moments — the small things that keep you close.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 600, color: '#fff',
          }}>N</div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Nexum</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/onboarding')}>Log in</button>
          <button className="btn btn-primary" onClick={() => navigate('/onboarding')}>Get started</button>
        </div>
      </div>

      {/* Hero */}
      <div className="animate-fade" style={{ marginBottom: 64 }}>
        <h1 style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          A space for the<br />
          <span style={{ color: 'var(--accent)' }}>two of you.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          Nexum is where your relationship lives online. Watch, play, talk, and just be together —
          without the noise of social media or the friction of juggling five apps.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/onboarding')}>
          Start building your space <ArrowRight size={15} />
        </button>
      </div>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 64 }}>
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`card animate-fade ani-delay-${i + 1}`}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 1 }}>{f.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div className="card" style={{ padding: '24px', borderColor: 'var(--accent)', borderWidth: 1, marginBottom: 48 }}>
        <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16, color: 'var(--text-secondary)' }}>
          "We tried all the apps — Rave, Discord, Facetime. Nexum just does everything in one place
          without feeling like a conference call."
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-hover)' }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Maya + Sam</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Long-distance, 14 months</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>
        Built for the ones who make distance disappear.
      </div>
    </div>
  );
}
