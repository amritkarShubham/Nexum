import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const GAMES = [
  { emoji: '🧠', title: 'Couple Trivia', desc: 'Two rounds — answer about yourself, then guess your partner\'s answers.', path: '/trivia' },
  { emoji: '🔥', title: 'Truth or Dare', desc: 'Questions and dares for couples, not party games.', path: '/truth-or-dare' },
  { emoji: '🤔', title: 'Would You Rather', desc: 'Pick before peeking. See how well you match.', path: '/would-you-rather' },
];

export default function Games() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 18 }}>Games</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
        Designed for two people who actually know each other.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GAMES.map((g, i) => (
          <button key={g.title} onClick={() => navigate(g.path)}
            className="card animate-fade"
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left', color: 'var(--text)' }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{g.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 1 }}>{g.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{g.desc}</div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}
