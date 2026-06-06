import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Heart, Laugh, Flame, PartyPopper, Clapperboard, Smile } from 'lucide-react-native';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';
import useStore from '../store/useStore';

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#ff0000' },
  { id: 'netflix', name: 'Netflix', icon: '📺', color: '#e50914' },
  { id: 'prime', name: 'Prime Video', icon: '🎬', color: '#00a8e1' },
  { id: 'hotstar', name: 'JioHotstar', icon: '⭐', color: '#ff6600' },
  { id: 'disney', name: 'Disney+', icon: '✨', color: '#113ccf' },
  { id: 'sony', name: 'Sony LIV', icon: '📡', color: '#1e1e1e' },
  { id: 'zee5', name: 'ZEE5', icon: '🔵', color: '#0047ab' },
  { id: 'mx', name: 'MX Player', icon: '▶️', color: '#ff6f00' },
];

const REACTIONS = [
  { icon: Heart, label: 'Love', color: '#ef4444' },
  { icon: Laugh, label: 'LOL', color: '#f59e0b' },
  { icon: Flame, label: 'Fire', color: '#ff6b35' },
  { icon: PartyPopper, label: 'Celebrate', color: '#34d399' },
  { icon: Clapperboard, label: 'Clap', color: '#6c63ff' },
  { icon: Smile, label: 'Cute', color: '#ec4899' },
];

export default function WatchTogetherScreen() {
  const { isPlaying, setIsPlaying, manualTime, setManualTime, platform, setPlatform, isManualMode, setIsManualMode } = useStore();
  const [step, setStep] = useState('platform');
  const [url, setUrl] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  const addReaction = (emoji) => {
    const id = Date.now();
    setFloatingEmojis(prev => [...prev, { id, emoji }]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(e => e.id !== id)), 2000);
  };

  const selectPlatform = (p) => {
    setPlatform(p);
    if (p.id === 'youtube') {
      setIsManualMode(false);
      setStep('url');
    } else {
      setIsManualMode(true);
      setStep('player');
    }
  };

  if (step === 'platform') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#f0f0ff" />
          </TouchableOpacity>
          <Text style={styles.title}>Watch Together</Text>
          <Text style={styles.subtitle}>Pick a platform to start</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {PLATFORMS.map(p => (
              <TouchableOpacity key={p.id} style={[styles.platformCard, { borderColor: p.color + '40' }]} onPress={() => selectPlatform(p)}>
                <Text style={{ fontSize: 28 }}>{p.icon}</Text>
                <Text style={styles.platformName}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'url' && !isManualMode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20, flex: 1 }}>
          <TouchableOpacity onPress={() => setStep('platform')} style={styles.backBtn}>
            <ArrowLeft size={22} color="#f0f0ff" />
          </TouchableOpacity>
          <Text style={styles.title}>Paste YouTube Link</Text>
          <TextInput style={styles.urlInput} placeholder="https://youtube.com/watch?v=..." placeholderTextColor="#5a5a7a" value={url} onChangeText={setUrl} autoCapitalize="none" />
          <TouchableOpacity style={styles.startBtn} onPress={() => url && setStep('player')}>
            <Play size={18} color="#0a0a0f" />
            <Text style={styles.startBtnText}>Start Watching</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const embedId = url ? url.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={styles.playerHeader}>
          <TouchableOpacity onPress={() => setStep('platform')}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>{platform?.name || 'Watch Together'}</Text>
          <TouchableOpacity onPress={() => setShowReactions(!showReactions)}>
            <Smile size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {isManualMode ? (
          <View style={styles.manualPlayer}>
            <Text style={styles.manualTitle}>Manual Sync Mode</Text>
            <Text style={styles.manualHint}>Press play together and use the controls to stay in sync</Text>
            <Text style={styles.timerText}>{Math.floor(manualTime / 60)}:{(manualTime % 60).toString().padStart(2, '0')}</Text>
            <View style={styles.manualControls}>
              <TouchableOpacity style={styles.ctrlBtn} onPress={() => setManualTime(t => Math.max(0, t - 10))}>
                <SkipBack size={18} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 9 }}>10s</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.playBtn} onPress={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  setIsPlaying(true);
                  const interval = setInterval(() => {
                    setManualTime(t => t + 1);
                  }, 1000);
                  return () => clearInterval(interval);
                }
              }}>
                {isPlaying ? <Pause size={24} color="#0a0a0f" /> : <Play size={24} color="#0a0a0f" />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctrlBtn} onPress={() => setManualTime(t => t + 10)}>
                <SkipForward size={18} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 9 }}>10s</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.syncBtn}>
              <Text style={{ color: '#6c63ff', fontSize: 13, fontWeight: '600' }}>Sync with partner</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {embedId && <WebView source={{ uri: `https://www.youtube.com/embed/${embedId}?autoplay=1` }} style={{ flex: 1 }} />}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, padding: 16 }}>
              <TouchableOpacity style={styles.ctrlBtn}><SkipBack size={18} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.playBtn} onPress={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={24} color="#0a0a0f" /> : <Play size={24} color="#0a0a0f" />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctrlBtn}><SkipForward size={18} color="#fff" /></TouchableOpacity>
            </View>
          </View>
        )}

        {/* Reactions */}
        {showReactions && (
          <View style={styles.reactionsBar}>
            {REACTIONS.map((r, i) => (
              <TouchableOpacity key={i} style={styles.reactionBtn} onPress={() => addReaction(r.label)}>
                <r.icon size={20} color={r.color} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Floating emojis */}
        {floatingEmojis.map(fe => (
          <View key={fe.id} style={styles.floatingEmoji}>
            <Text style={{ fontSize: 24 }}>{fe.emoji}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { padding: 20, paddingBottom: 40 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { color: '#f0f0ff', fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#5a5a7a', fontSize: 14, marginBottom: 24 },
  platformCard: { width: '47%', padding: 20, borderRadius: 16, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', gap: 10, marginBottom: 10 },
  platformName: { color: '#f0f0ff', fontSize: 14, fontWeight: '500' },
  urlInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 16, color: '#f0f0ff', fontSize: 14, marginBottom: 16 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#6c63ff', borderRadius: 14, padding: 16 },
  startBtnText: { color: '#0a0a0f', fontSize: 16, fontWeight: '700' },
  playerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  manualPlayer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  manualTitle: { color: '#f0f0ff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  manualHint: { color: '#5a5a7a', fontSize: 13, textAlign: 'center', marginBottom: 24 },
  timerText: { color: '#f0f0ff', fontSize: 48, fontWeight: '200', marginBottom: 32 },
  manualControls: { flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 20 },
  ctrlBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  playBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  syncBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#6c63ff' },
  reactionsBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  reactionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  floatingEmoji: { position: 'absolute', top: '40%', alignSelf: 'center' },
});
