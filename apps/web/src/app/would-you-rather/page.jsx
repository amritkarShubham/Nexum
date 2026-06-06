import React, { useState } from 'react';
import { ArrowLeft, Heart, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import useStore from '../../store/useStore';

const QUESTIONS = [
  { a: 'Travel the world together', b: 'Buy a home together' },
  { a: 'Fancy date every week', b: 'Cozy night in every night' },
  { a: 'Live in a big city', b: 'Live in the countryside' },
  { a: 'Cook together every day', b: 'Order in and watch movies' },
  { a: 'Get a cat', b: 'Get a dog' },
  { a: 'Wake up early together', b: 'Stay up late together' },
  { a: 'Road trip across the country', b: 'Fly somewhere new' },
  { a: 'Learn something new together', b: 'Read the same book' },
  { a: 'Deep talks every night', b: 'Laugh at memes every night' },
  { a: 'Read each other\'s minds', b: 'Teleport to each other' },
];

export default function WYR() {
  const navigate = useNavigate();
  const { partner } = useStore();
  const [idx, setIdx] = useState(0);
  const [my, setMy] = useState(null);
  const [their, setTheir] = useState(null);
  const [show, setShow] = useState(false);
  const [history, setHistory] = useState([]);

  const q = QUESTIONS[idx];
  const matches = history.filter(h => h.match).length;

  const choose = (c) => {
    setMy(c);
    setTheir(Math.random() > 0.5 ? 'a' : 'b');
    setShow(true);
  };

  const next = () => {
    if (my) setHistory(prev => [...prev, { mine: my, theirs: their, match: my === their }]);
    setMy(null); setTheir(null); setShow(false);
    setIdx(i => (i + 1) % QUESTIONS.length);
  };

  const reset = () => { setIdx(0); setMy(null); setTheir(null); setShow(false); setHistory([]); };

  const btnStyle = (opt) => ({
    padding: '14px 16px', textAlign: 'left', cursor: show ? 'default' : 'pointer',
    width: '100%', color: 'var(--text)', borderRadius: 12,
    border: show && my === opt
      ? their === opt ? '2px solid var(--green)' : '2px solid var(--accent)'
      : '1px solid var(--border)',
    background: show && my !== opt ? 'var(--surface)' : 'var(--surface)',
    opacity: show && my !== opt ? 0.4 : 1,
    transition: 'opacity 0.2s',
    display: 'flex', alignItems: 'center', gap: 10,
    fontFamily: 'inherit', fontSize: 14,
  });

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/games')}><ArrowLeft size={18} /></button>
        {history.length > 0 && <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{matches}/{history.length} matched</span>}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="tag tag-accent" style={{ marginBottom: 20 }}>Question {idx + 1}</span>
        <p style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", textAlign: 'center', marginBottom: 24 }}>Would you rather...</p>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <button onClick={() => choose('a')} disabled={show} style={btnStyle('a')}>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-tertiary)' }}>A</span>
            {q.a}
            {show && their === 'a' && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--green)' }}>They chose this too</span>}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>— or —</div>
          <button onClick={() => choose('b')} disabled={show} style={btnStyle('b')}>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-tertiary)' }}>B</span>
            {q.b}
            {show && their === 'b' && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--green)' }}>They chose this too</span>}
          </button>
        </div>
        {show && (
          <div className="card animate-fade" style={{ width: '100%', padding: 20, textAlign: 'center', marginBottom: 16 }}>
            {my === their ? (
              <div>
                <Heart size={20} style={{ color: 'var(--green)', marginBottom: 4 }} />
                <div style={{ color: 'var(--green)', fontWeight: 600 }}>Match!</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>You both picked the same thing</div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 600 }}>Different choices</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{partner.name} chose the other option</div>
              </div>
            )}
            <button className="btn btn-secondary" onClick={next} style={{ marginTop: 12, fontSize: 12 }}>
              <RefreshCw size={13} /> Next question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
