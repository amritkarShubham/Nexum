import React, { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import useStore from '../../store/useStore';

const QS = {
  'Light & Fun': [
    { q: 'What is my favorite season?', o: ['Spring', 'Summer', 'Fall', 'Winter'] },
    { q: 'What is my go-to comfort food?', o: ['Pizza', 'Ice cream', 'Pasta', 'Chocolate'] },
    { q: 'What animal would I be?', o: ['Cat', 'Dog', 'Fox', 'Owl'] },
    { q: 'My ideal Saturday?', o: ['Netflix', 'Going out', 'Cooking', 'Gaming'] },
    { q: 'Song that reminds me of you?', o: ['Love song', 'Pop hit', 'Indie', 'Throwback'] },
  ],
  'Deep & Real': [
    { q: 'What makes me feel most loved?', o: ['Words', 'Time', 'Touch', 'Gestures'] },
    { q: 'A dream I haven\'t shared?', o: ['Travel', 'Career', 'Family', 'Adventure'] },
    { q: 'Happiest memory of us?', o: ['First date', 'A trip', 'Random moment', 'When we met'] },
    { q: 'What I wish we did more?', o: ['Talk deeply', 'Cook', 'Movie nights', 'Walks'] },
    { q: 'My biggest fear about us?', o: ['Growing apart', 'Distance', 'Misunderstandings', 'Routine'] },
  ],
};

export default function Trivia() {
  const navigate = useNavigate();
  const { partner } = useStore();
  const [cat, setCat] = useState(null);
  const [round, setRound] = useState(1);
  const [idx, setIdx] = useState(0);
  const [my, setMy] = useState([]);
  const [guess, setGuess] = useState([]);
  const [done, setDone] = useState(false);

  const qs = cat ? QS[cat] : [];
  const total = qs.length;
  const q = qs[idx];

  const pick = (a) => {
    if (round === 1) setMy(p => [...p, a]); else setGuess(p => [...p, a]);
    if (idx < total - 1) setIdx(i => i + 1);
    else if (round === 1) { setRound(2); setIdx(0); } else setDone(true);
  };

  const score = () => { let s = 0; for (let i = 0; i < total; i++) if (my[i] === guess[i]) s += 10; return Math.round((s / (total * 10)) * 100); };
  const reset = () => { setCat(null); setRound(1); setIdx(0); setMy([]); setGuess([]); setDone(false); };

  if (!cat) return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>
      <button className="btn btn-ghost btn-icon" onClick={() => navigate('/games')} style={{ marginBottom: 20 }}><ArrowLeft size={18} /></button>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Couple Trivia</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Round 1: answer honestly. Round 2: guess their answers.</p>
      {Object.keys(QS).map(c => (
        <button key={c} onClick={() => setCat(c)} className="card" style={{ display: 'block', width: '100%', padding: 16, marginBottom: 8, textAlign: 'left', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{c}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{QS[c].length} questions</div>
        </button>
      ))}
    </div>
  );

  if (done) {
    const p = score();
    return (
      <div style={{ maxWidth: 440, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Heart size={24} style={{ color: 'var(--accent)' }} />
        </div>
          <div style={{ fontSize: 34, fontWeight: 600, background: 'linear-gradient(135deg, var(--accent), var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>{p}%</div>
        <div style={{ fontSize: 14, marginBottom: 24 }}>{p >= 80 ? 'Pretty solid' : p >= 60 ? 'Getting there' : 'Keep talking'}</div>
        <div className="card" style={{ padding: 16, textAlign: 'left', marginBottom: 24 }}>
          {qs.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < total - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ flex: 1, marginRight: 12, minWidth: 0 }}>
                <div style={{ fontSize: 13 }}>{item.q}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>You: {my[i]} • Guess: {guess[i]}</div>
              </div>
              <span style={{ color: my[i] === guess[i] ? 'var(--green)' : 'var(--text-tertiary)', fontWeight: 600 }}>{my[i] === guess[i] ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={reset}>Play again</button>
          <button className="btn btn-secondary" onClick={() => navigate('/games')}>Back to games</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <button className="btn btn-ghost btn-icon" onClick={reset} style={{ marginBottom: 12 }}><ArrowLeft size={18} /></button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div className="progress" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{idx + 1}/{total}</span>
      </div>
      <span className="tag tag-accent" style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
        Round {round}: {round === 1 ? 'About you' : `Guess ${partner.name}'s answers`}
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ fontSize: 17, lineHeight: 1.5, marginBottom: 24, textAlign: 'center' }}>{q.q}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {q.o.map(o => (
            <button key={o} onClick={() => pick(o)} className="card" style={{ padding: '13px 16px', textAlign: 'left', border: 'none', cursor: 'pointer', color: 'var(--text)', width: '100%' }}>
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
