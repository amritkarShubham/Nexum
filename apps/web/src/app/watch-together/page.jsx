import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, MessageCircle, X, ArrowLeft, Monitor, Smartphone, ExternalLink } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router';
import useWatchSync from '../../hooks/useWatchSync';
import useStore from '../../store/useStore';

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'var(--accent)', embed: true },
  { id: 'netflix', name: 'Netflix', icon: '📺', color: '#E50914', embed: false },
  { id: 'prime', name: 'Prime Video', icon: '🎬', color: '#00A8E1', embed: false },
  { id: 'hotstar', name: 'JioHotstar', icon: '⭐', color: '#FF6B9D', embed: false },
  { id: 'disney', name: 'Disney+', icon: '✨', color: '#113CCF', embed: false },
  { id: 'sony', name: 'Sony LIV', icon: '📡', color: '#FFD700', embed: false },
  { id: 'zee5', name: 'ZEE5', icon: '🔵', color: '#6B21A8', embed: false },
  { id: 'mx', name: 'MX Player', icon: '🎥', color: '#FF6B35', embed: false },
];

const REACTIONS = ['❤️', '😂', '😱', '🔥', '👏', '😭'];

function Reaction({ emoji, id, onDone }) {
  return (
    <div className="animate-float" style={{ position: 'absolute', left: `${20 + Math.random() * 60}%`, bottom: '20%', fontSize: 30, pointerEvents: 'none', zIndex: 10 }}
      onAnimationEnd={() => onDone(id)}>
      {emoji}
    </div>
  );
}

function fmt(s) {
  if (!s || s === Infinity) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function WatchTogether() {
  const navigate = useNavigate();
  const {
    playerRef, watchUrl, isPlaying, currentTime, play, pause, seek, syncPlayback,
    platform, isManualMode, manualTime, partnerManualTime, partnerPlatform,
    manualPlay, manualPause, manualSeek, setPlatformAndSync,
  } = useWatchSync();
  const { partner, isPiPOpen, setIsPiPOpen } = useStore();
  const [url, setUrl] = useState('');
  const [reactions, setReactions] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);

  const addReaction = (e) => { setReactions(prev => [...prev, { emoji: e, id: Date.now() }]); setShowPicker(false); };
  const removeReaction = (id) => setReactions(prev => prev.filter(r => r.id !== id));

  const activePlatform = PLATFORMS.find(p => p.id === platform);
  const partnerPlat = PLATFORMS.find(p => p.id === partnerPlatform);

  const resetPlatform = () => {
    setPlatformAndSync(null);
    setUrl('');
  };

  if (!platform) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 18 }}>Watch together</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Choose a platform</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Pick where you want to watch with your partner</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatformAndSync(p.id)}
              className="card"
              style={{
                padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
                border: 'none', width: '100%', color: 'var(--text)',
                transition: 'all var(--duration) var(--ease)',
              }}>
              <div style={{ fontSize: 36, marginBottom: 10, display: 'block' }}>{p.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {p.embed ? 'Synced playback' : 'Manual sync'}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-ghost btn-icon" onClick={resetPlatform}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 18 }}>Watch together</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
          <span>{activePlatform?.icon}</span>
          <span>{activePlatform?.name}</span>
        </div>
      </div>

      {/* Player Card */}
      <div className="card" style={{ overflow: 'hidden', padding: 0, marginBottom: 16 }}>
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.03), rgba(124, 58, 237, 0.03))', pointerEvents: 'none' }} />

          {isManualMode ? (
            /* ── Manual Sync Mode (Netflix, Prime, Hotstar, etc.) ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{activePlatform?.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
                Watching on {activePlatform?.name}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 20, maxWidth: 320, lineHeight: 1.5 }}>
                Open the same content on {activePlatform?.name} and use the controls below to stay in sync.
              </p>
              <a href="#" onClick={(e) => { e.preventDefault(); window.open(`https://${activePlatform?.id}.com`, '_blank'); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 9999, background: 'var(--accent-subtle)', color: 'var(--accent)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                <ExternalLink size={14} /> Open {activePlatform?.name}
              </a>
            </div>
          ) : (
            /* ── YouTube Embed Mode ── */
            watchUrl ? (
              <ReactPlayer ref={playerRef} url={watchUrl} width="100%" height="100%" playing={isPlaying}
                onProgress={({ played }) => setPlayed(played)} onDuration={setDuration} controls={false}
                config={{ youtube: { playerVars: { modestbranding: 1, rel: 0 } } }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  <Play size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                  <div style={{ fontSize: 13 }}>Paste a YouTube link to start</div>
                </div>
              </div>
            )
          )}

          {reactions.map(r => <Reaction key={r.id} {...r} onDone={removeReaction} />)}
          {isPiPOpen && (
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 110, height: 80, borderRadius: 10, overflow: 'hidden', border: '2px solid var(--accent)', background: '#000' }}>
              <img src={partner.avatar || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%236c63ff"/><text x="16" y="21" text-anchor="middle" fill="white" font-size="14">P</text></svg>'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setIsPiPOpen(false)}
                style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: '#0008', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={10} />
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ padding: '14px 16px' }}>
          {isManualMode ? (
            /* ── Manual Sync Controls ── */
            <>
              {/* Shared Timer */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, var(--accent), var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>
                  {fmt(manualTime)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>shared timer</div>
              </div>

              {/* Progress Bar */}
              <div className="progress" style={{ marginBottom: 16, cursor: 'pointer' }}
                onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); manualSeek(((e.clientX - r.left) / r.width) * 7200); }}>
                <div className="progress-fill" style={{ width: `${Math.min((manualTime / 7200) * 100, 100)}%` }} />
              </div>

              {/* Playback Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
                <button className="btn btn-ghost btn-icon" onClick={() => manualSeek(Math.max(0, manualTime - 15))}><SkipBack size={17} /></button>
                <button onClick={() => isPlaying ? manualPause() : manualPlay()}
                  style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="btn btn-ghost btn-icon" onClick={() => manualSeek(Math.min(7200, manualTime + 15))}><SkipForward size={17} /></button>
              </div>

              {/* Quick Jumps */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                {[-60, -30, -10, 10, 30, 60].map(sec => (
                  <button key={sec} className="btn btn-ghost" onClick={() => manualSeek(Math.max(0, Math.min(7200, manualTime + sec)))}
                    style={{ fontSize: 11, padding: '4px 10px' }}>
                    {sec > 0 ? '+' : ''}{sec}s
                  </button>
                ))}
              </div>

              {/* Sync Button */}
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
                onClick={() => manualSeek(manualTime)}>
                <Heart size={13} /> Sync with partner
              </button>
            </>
          ) : (
            /* ── YouTube Controls ── */
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <input className="input" type="text" value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="Paste YouTube link..." style={{ flex: 1 }}
                  onKeyDown={e => e.key === 'Enter' && url && syncPlayback(url)} />
                <button className="btn btn-primary" onClick={() => url && syncPlayback(url)} style={{ padding: '10px 18px' }}>Load</button>
              </div>
              {watchUrl && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
                    <button className="btn btn-ghost btn-icon" onClick={() => seek(Math.max(0, played * duration - 10))}><SkipBack size={17} /></button>
                    <button onClick={() => isPlaying ? pause() : play()}
                      style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button className="btn btn-ghost btn-icon" onClick={() => seek(Math.min(duration, played * duration + 10))}><SkipForward size={17} /></button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-tertiary)' }}>
                    <span>{fmt(played * duration)}</span>
                    <div className="progress" style={{ flex: 1 }}
                      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * duration); }}>
                      <div className="progress-fill" style={{ width: `${played * 100}%` }} />
                    </div>
                    <span>{fmt(duration)}</span>
                  </div>
                </>
              )}
            </>
          )}

          {/* Bottom actions (PiP + Reactions) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <button className={`btn btn-ghost ${isPiPOpen ? 'btn-secondary' : ''}`} style={{ fontSize: 12, padding: '6px 14px' }}
              onClick={() => setIsPiPOpen(!isPiPOpen)}>
              <Heart size={13} style={{ color: 'var(--accent)' }} /> PiP
            </button>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setShowPicker(!showPicker)}>
                <MessageCircle size={13} /> React
              </button>
              {showPicker && (
                <div className="card card-elevated" style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 8, display: 'flex', gap: 8, padding: '10px 14px' }}>
                  {REACTIONS.map(e => (
                    <button key={e} onClick={() => addReaction(e)}
                      style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }}>
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Partner Status */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
        <div className="avatar-wrapper">
          <img src={partner.avatar || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%236c63ff"/><text x="16" y="21" text-anchor="middle" fill="white" font-size="14">P</text></svg>'} alt="" className="avatar avatar-sm" />
          <span className="avatar-dot online" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{partner.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {partnerPlatform
              ? `Watching on ${partnerPlat?.name} ${partnerManualTime !== null ? `• ${fmt(partnerManualTime)}` : ''}`
              : 'Waiting to pick a platform...'}
          </div>
        </div>
        {partnerManualTime !== null && isManualMode && (
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'right' }}>
            <div>You: {fmt(manualTime)}</div>
            <div>Partner: {fmt(partnerManualTime)}</div>
            <div style={{ color: Math.abs(manualTime - partnerManualTime) < 3 ? 'var(--green)' : 'var(--amber)', fontWeight: 500 }}>
              {Math.abs(manualTime - partnerManualTime) < 3 ? 'In sync' : `${Math.abs(manualTime - partnerManualTime)}s off`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
