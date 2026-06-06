import React, { useState, useCallback } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';

const TRUTHS = [
  'What was the first thing you noticed about me?',
  'What is something you\'ve wanted to tell me but haven\'t?',
  'What is your favorite memory of us?',
  'What do you think I\'m thinking about right now?',
  'What is something I do that you find adorable?',
  'When did you know you loved me?',
  'What is your biggest fear about us?',
  'If you could relive one day with me, which would it be?',
  'What do you miss most about me right now?',
  'What song reminds you of me?',
];

const DARES = [
  'Sing the first 10 seconds of your favorite song right now',
  'Send me a selfie with your best silly face',
  'Do your best impression of me',
  'Describe us in 3 emojis',
  'Close your eyes and describe what you see when you think of me',
  'Send me a voice note saying something sweet',
  'Tell me a joke — if I don\'t laugh, you owe me.',
  'Describe our first date in one sentence',
  'Whisper something romantic into the mic',
  'Say 3 things you love about me without stopping',
];

export default function TruthOrDare() {
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const pick = useCallback((t) => {
    const pool = t === 'truth' ? TRUTHS : DARES;
    setType(t);
    setText(pool[Math.floor(Math.random() * pool.length)]);
    setRevealed(false);
  }, []);

  if (!type) return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>
      <button className="btn btn-ghost btn-icon" onClick={() => navigate('/games')} style={{ marginBottom: 20 }}><ArrowLeft size={18} /></button>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Truth or Dare</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Questions and dares for couples, not party games.
      </p>
      <button onClick={() => pick('truth')} className="card" style={{ display: 'block', width: '100%', padding: '20px', marginBottom: 10, textAlign: 'center', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
        <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>💎</span>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>Truth</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Deeper connection</div>
      </button>
      <button onClick={() => pick('dare')} className="card" style={{ display: 'block', width: '100%', padding: '20px', textAlign: 'center', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
        <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>🔥</span>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>Dare</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Playful challenges</div>
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <button className="btn btn-ghost btn-icon" onClick={() => setType(null)}><ArrowLeft size={18} /></button>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => pick('truth')} className={type === 'truth' ? 'btn btn-secondary' : 'btn btn-ghost'} style={{ fontSize: 12, padding: '6px 14px' }}>Truth</button>
          <button onClick={() => pick('dare')} className={type === 'dare' ? 'btn btn-secondary' : 'btn btn-ghost'} style={{ fontSize: 12, padding: '6px 14px' }}>Dare</button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {revealed ? (
          <div className="card card-accent animate-fade" style={{ width: '100%', padding: '28px 20px', textAlign: 'center' }}>
            <span className="tag tag-accent" style={{ marginBottom: 14 }}>{type === 'truth' ? '💎 Truth' : '🔥 Dare'}</span>
            <p style={{ fontSize: 17, lineHeight: 1.5, marginBottom: 24 }}>{text}</p>
            <button className="btn btn-secondary" onClick={() => pick(type)} style={{ fontSize: 12 }}>
              <RefreshCw size={13} /> Next card
            </button>
          </div>
        ) : (
          <button onClick={() => setRevealed(true)} className="card animate-fade" style={{ width: '100%', padding: '40px 20px', textAlign: 'center', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>{type === 'truth' ? '💎' : '🔥'}</span>
            <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 4 }}>{type === 'truth' ? 'Truth' : 'Dare'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tap to reveal</div>
          </button>
        )}
      </div>
    </div>
  );
}
