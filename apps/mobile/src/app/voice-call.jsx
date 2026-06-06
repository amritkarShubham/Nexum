import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react-native';
import useStore from '../store/useStore';

export default function VoiceCallScreen() {
  const { partner } = useStore();
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [speakerOn, setSpeakerOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{partner.name?.[0] || 'P'}</Text>
        </View>
        <Text style={styles.partnerName}>{partner.name}</Text>
        <Text style={styles.callLabel}>Voice call</Text>
        <Text style={styles.duration}>{formatTime(duration)}</Text>

        {/* Waveform visualization */}
        <View style={styles.waveform}>
          {[12, 18, 10, 22, 14, 20, 8, 16, 24, 12, 18, 10].map((h, i) => (
            <View key={i} style={[styles.waveBar, { height: h, backgroundColor: muted ? '#5a5a7a' : '#6c63ff' }]} />
          ))}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={[styles.ctrlBtn, muted && styles.activeBtn]} onPress={() => setMuted(!muted)}>
            {muted ? <MicOff size={22} color="#ef4444" /> : <Mic size={22} color="#fff" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.endCallBtn} onPress={() => router.back()}>
            <PhoneOff size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, speakerOn && styles.activeBtn]} onPress={() => setSpeakerOn(!speakerOn)}>
            <Volume2 size={22} color={speakerOn ? '#6c63ff' : '#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(108,99,255,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: '600' },
  partnerName: { color: '#f0f0ff', fontSize: 22, fontWeight: '600', marginBottom: 4 },
  callLabel: { color: '#5a5a7a', fontSize: 14, marginBottom: 4 },
  duration: { color: '#9090b0', fontSize: 16, marginBottom: 40 },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 30, marginBottom: 48 },
  waveBar: { width: 4, borderRadius: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  ctrlBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  activeBtn: { backgroundColor: 'rgba(239,68,68,0.15)' },
  endCallBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
});
