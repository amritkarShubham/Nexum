import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react';
import useStore from '../../store/useStore';
import { useSocket } from '../../context/SocketContext';

export default function Connect() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { partner, partnerOnline } = useStore();
  const [messages, setMessages] = useState([
    { id: 1, from: 'partner', text: 'Morning babe!! miss you so much ☀️', time: '9:20 AM' },
    { id: 2, from: 'me', text: 'miss you more 🥺 can we watch something tonight?', time: '9:22 AM' },
    { id: 3, from: 'partner', text: 'yes!! movie night 🍿', time: '9:23 AM' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    if (!socket) return;
    const h = (data) => setMessages(prev => [...prev, { ...data.message, from: 'partner' }]);
    socket.on('chat_message', h);
    return () => socket.off('chat_message', h);
  }, [socket]);

  const send = () => {
    if (!input.trim()) return;
    const m = { id: Date.now(), from: 'me', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, m]);
    if (socket) socket.emit('chat_message', { room: 'test_couple_room', message: m });
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/dashboard')}><ArrowLeft size={18} /></button>
        <div className="avatar-wrapper">
          <img src={partner.avatar} alt="" className="avatar avatar-sm" />
          <span className={`avatar-dot ${partnerOnline ? 'online' : 'offline'}`} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 16 }}>{partner.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{partnerOnline ? 'Online' : 'Offline'}</div>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/voice-call')}><Phone size={16} /></button>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/video-call')}><Video size={16} /></button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div className={m.from === 'me' ? 'bubble bubble-mine' : 'bubble bubble-theirs'}>
              {m.text}
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4, textAlign: 'right' }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 28px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)', padding: '2px 12px' }}>
            <input className="input" style={{ border: 'none', background: 'none', padding: '10px 0' }}
              value={input} onChange={e => setInput(e.target.value)}
              placeholder={`Message ${partner.name}...`}
              onKeyDown={e => e.key === 'Enter' && send()} />
          </div>
          <button className="btn btn-primary" onClick={send} style={{ padding: '12px 14px', borderRadius: 10 }}>
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
