import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';
import useStore, { PLANS } from '../../store/useStore';

const STEPS = [
  {
    icon: '♡', title: 'A space for two',
    body: 'No feeds. No followers. No noise. Nexum is a private place for you and your partner — wherever you are.',
  },
  {
    icon: '🎬', title: 'Watch together',
    body: 'Movies, YouTube, anything. Perfectly synced with reactions that float across the screen.',
  },
  {
    icon: '🎮', title: 'Play together',
    body: 'Trivia, truth or dare, would you rather. Games that make you laugh and feel closer.',
  },
  {
    icon: '📞', title: 'Stay connected',
    body: 'Video and voice calls that feel natural. Mood check-ins. Shared moments. The small stuff matters.',
  },
];

const PLAN_IDS = ['spark', 'embrace', 'eclipse'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { plan, setPlan } = useStore();
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(plan);
  const isPlanStep = step === STEPS.length;
  const isConnectStep = step === STEPS.length + 1;
  const totalSteps = STEPS.length + 2;
  const s = STEPS[step];

  const handleNext = () => {
    if (isPlanStep) {
      setPlan(selectedPlan);
      setStep(s => s + 1);
    } else if (isConnectStep) {
      navigate('/dashboard');
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', maxWidth: 400, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 0 20px' }}>
        {!isConnectStep && (
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 13, cursor: 'pointer' }}>
            Skip
          </button>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 6, height: 6, borderRadius: 3,
              background: i <= step ? 'linear-gradient(90deg, var(--accent), var(--violet))' : 'var(--border)',
              transition: 'all 0.3s',
              boxShadow: i <= step ? '0 0 8px rgba(255, 107, 157, 0.3)' : 'none',
            }} />
          ))}
        </div>

        {isPlanStep ? (
          /* ── Plan Selection ── */
          <div className="animate-fade" key="plan" style={{ width: '100%' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--violet-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
              💎
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, textAlign: 'center', marginBottom: 6 }}>Choose your plan</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
              Start with Spark — upgrade anytime as your connection grows.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PLAN_IDS.map(id => {
                const p = PLANS[id];
                const active = selectedPlan === id;
                return (
                  <button key={id} onClick={() => setSelectedPlan(id)}
                    className="card"
                    style={{
                      width: '100%', padding: '16px', textAlign: 'left', cursor: 'pointer',
                      border: active ? `1px solid ${p.color}` : 'none',
                      background: active ? `linear-gradient(135deg, ${p.color}08, ${p.color}04)` : undefined,
                      color: 'var(--text)', position: 'relative',
                    }}>
                    {p.popular && (
                      <div style={{ position: 'absolute', top: -8, right: 12, fontSize: 9, fontWeight: 600, padding: '2px 10px', borderRadius: 9999, background: 'linear-gradient(135deg, var(--accent), var(--violet))', color: '#fff', letterSpacing: '0.04em' }}>
                        MOST LOVED
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 28 }}>{p.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 16 }}>{p.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.tagline}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: p.color, marginTop: 2 }}>{p.price}</div>
                      </div>
                      {active && (
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={13} style={{ color: '#fff' }} />
                        </div>
                      )}
                    </div>
                    {active && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        {p.features.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '2px 0' }}>
                            <Check size={11} style={{ color: p.color, flexShrink: 0 }} />
                            {f}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <button className="btn btn-primary animate-glow" onClick={() => { setPlan(selectedPlan); setStep(s => s + 1); }} style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', marginTop: 20 }}>
              Continue with {PLANS[selectedPlan].name} <ArrowRight size={15} />
            </button>
          </div>
        ) : isConnectStep ? (
          /* ── Connect with Partner ── */
          <div className="animate-fade" key="connect" style={{ width: '100%' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px', border: '1px solid rgba(255, 107, 157, 0.15)' }}>
              🔗
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, textAlign: 'center', marginBottom: 6 }}>Connect</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
              Share your couple code or enter your partner's to begin your journey.
            </p>
            <div className="card card-glow" style={{ padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your couple code</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', textAlign: 'center', background: 'linear-gradient(135deg, var(--accent), var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16, letterSpacing: '0.1em' }}>
                NX-{Math.random().toString(36).substring(2, 6).toUpperCase()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: 16 }}>Share this with your partner</div>
              <input className="input" type="text" placeholder="Enter partner's code" style={{ marginBottom: 10 }} />
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/dashboard')}>Connect</button>
            </div>
            <button className="btn btn-primary animate-glow" onClick={() => navigate('/dashboard')} style={{ width: '100%', justifyContent: 'center', padding: '12px 24px' }}>
              Start with {PLANS[selectedPlan].name} <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          /* ── Feature Steps ── */
          <div className="animate-fade" key={step}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--violet-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
              {s.icon}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, textAlign: 'center', marginBottom: 12 }}>{s.title}</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 14, lineHeight: 1.7, marginBottom: 36 }}>{s.body}</p>
            <button className="btn btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '12px 24px' }}>
              Next <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
