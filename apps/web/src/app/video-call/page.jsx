import React, { useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import useVideoCall from '../../hooks/useVideoCall';
import useStore from '../../store/useStore';

export default function VideoCall() {
  const navigate = useNavigate();
  const { localVideoRef, remoteVideoRef, startCall, endCall, toggleMute, toggleCamera, isMuted, isCameraOff, callState } = useVideoCall();
  const { partner, callDuration } = useStore();
  useEffect(() => { startCall(); return () => endCall(); }, []);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
        <button onClick={() => { endCall(); navigate('/dashboard'); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 16 }}>{partner.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            {callState === 'calling' ? 'Calling...' : fmt(callDuration)}
          </div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '9/16', maxHeight: '70vh', borderRadius: 16, overflow: 'hidden', background: '#111' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {callState !== 'connected' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0008' }}>
              <div style={{ textAlign: 'center' }}>
                <img src={partner.avatar} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', opacity: 0.6 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  Waiting for {partner.name}
                </div>
              </div>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 90, height: 120, borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)' }}>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {isCameraOff && <div style={{ position: 'absolute', inset: 0, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><VideoOff size={16} opacity={0.4} /></div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: '16px 16px 32px' }}>
        <button onClick={toggleMute} style={{
          width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isMuted ? 'var(--accent)' : 'rgba(255,255,255,0.08)', color: '#fff',
        }}>
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button onClick={() => { endCall(); navigate('/dashboard'); }} style={{
          width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--accent)', color: '#fff',
        }}>
          <PhoneOff size={24} />
        </button>
        <button onClick={toggleCamera} style={{
          width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isCameraOff ? 'var(--accent)' : 'rgba(255,255,255,0.08)', color: '#fff',
        }}>
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
      </div>
    </div>
  );
}
