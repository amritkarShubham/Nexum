import React, { useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import useVoiceCall from '../../hooks/useVoiceCall';
import useStore from '../../store/useStore';

function Wave({ analyserRef, active }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !analyserRef.current || !active) return;
    const ctx = c.getContext('2d');
    const a = analyserRef.current;
    const buf = new Uint8Array(a.frequencyBinCount);
    let id;
    const draw = () => {
      a.getByteFrequencyData(buf);
      ctx.clearRect(0, 0, c.width, c.height);
      const bars = 36, step = Math.floor(buf.length / bars), w = c.width / bars - 2;
      for (let i = 0; i < bars; i++) {
        const v = buf[i * step] / 255;
        ctx.fillStyle = `rgba(255, 107, 157, ${0.15 + v * 0.6})`;
        ctx.beginPath();
        ctx.roundRect(i * (w + 2), c.height - v * c.height, w, Math.max(v * c.height, 2), 2);
        ctx.fill();
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [analyserRef, active]);
  return <canvas ref={ref} width={300} height={80} style={{ width: '100%', maxWidth: 300, height: 64, borderRadius: 8 }} />;
}

export default function VoiceCall() {
  const navigate = useNavigate();
  const { analyserRef, startCall, endCall, toggleMute, isMuted, callState } = useVoiceCall();
  const { partner, callDuration } = useStore();
  useEffect(() => { startCall(); return () => endCall(); }, []);
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px' }}>
        <button className="btn btn-ghost btn-icon" onClick={() => { endCall(); navigate('/dashboard'); }}>
          <ArrowLeft size={18} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div className="avatar-wrapper" style={{ marginBottom: 20 }}>
          <img src={partner.avatar} alt="" className="avatar" style={{ width: 80, height: 80 }} />
          {callState === 'connected' && <span className="avatar-dot online" style={{ width: 14, height: 14 }} />}
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{partner.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 32 }}>{fmt(callDuration)}</div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Wave analyserRef={analyserRef} active={callState === 'connected'} />
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <button onClick={toggleMute} style={{
            width: 52, height: 52, borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isMuted ? 'var(--accent)' : 'var(--surface)', color: '#fff',
          }}>
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button onClick={() => { endCall(); navigate('/dashboard'); }} style={{
            width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent)', color: '#fff',
          }}>
            <PhoneOff size={26} />
          </button>
        </div>
      </div>
    </div>
  );
}
