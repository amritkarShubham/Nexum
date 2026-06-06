import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { PhoneOff, Mic, MicOff, Camera, CameraOff } from 'lucide-react-native';
import useStore from '../store/useStore';

export default function VideoCallScreen() {
  const { partner } = useStore();
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [duration, setDuration] = useState(0);

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
      <View style={{ flex: 1 }}>
        {/* Remote video (partner) */}
        <View style={styles.remoteVideo}>
          <View style={styles.remotePlaceholder}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigAvatarText}>{partner.name?.[0] || 'P'}</Text>
            </View>
            <Text style={styles.partnerName}>{partner.name}</Text>
            <Text style={styles.callDuration}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Local video (self - PiP) */}
        <View style={styles.localVideo}>
          <View style={styles.localPlaceholder}>
            <Camera size={24} color="#f0f0ff" />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.controlBtn, muted && styles.controlBtnActive]} onPress={() => setMuted(!muted)}>
            {muted ? <MicOff size={22} color="#ef4444" /> : <Mic size={22} color="#fff" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.endCallBtn} onPress={() => router.back()}>
            <PhoneOff size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlBtn, cameraOff && styles.controlBtnActive]} onPress={() => setCameraOff(!cameraOff)}>
            {cameraOff ? <CameraOff size={22} color="#ef4444" /> : <Camera size={22} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  remoteVideo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  remotePlaceholder: { alignItems: 'center', gap: 12 },
  bigAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(108,99,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  bigAvatarText: { color: '#fff', fontSize: 40, fontWeight: '600' },
  partnerName: { color: '#fff', fontSize: 20, fontWeight: '600' },
  callDuration: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  localVideo: { position: 'absolute', top: 60, right: 16, width: 100, height: 140, borderRadius: 12, overflow: 'hidden' },
  localPlaceholder: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingVertical: 40 },
  controlBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: 'rgba(239,68,68,0.2)' },
  endCallBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
});
