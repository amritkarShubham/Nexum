import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Heart, Link2, QrCode, ArrowLeft, Share2, Clock } from 'lucide-react-native';
import { useAuthStore } from '../utils/auth/store';
import { router } from 'expo-router';
import { api } from '../utils/api';

export default function ConnectScreen() {
  const [mode, setMode] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);
  const [joined, setJoined] = useState(false);
  const { auth, setAuth } = useAuthStore();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const couple = await api.createCouple(auth.user.id);
      setCreatedCode(couple.code);
      setAuth({ ...auth, coupleId: couple.id, coupleCode: couple.code });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!code.trim()) { Alert.alert('Error', 'Enter a couple code'); return; }
    setLoading(true);
    try {
      const couple = await api.joinCouple(code.trim().toUpperCase(), auth.user.id);
      setAuth({ ...auth, coupleId: couple.id, coupleCode: couple.code });
      setJoined(true);
      setTimeout(() => router.replace('/dashboard'), 1500);
    } catch (e) {
      Alert.alert('Invalid Code', 'Double-check the code with your partner');
    } finally {
      setLoading(false);
    }
  };

  if (joined) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 24, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Heart size={48} color="#34d399" />
          <Text style={{ color: '#f0f0ff', fontSize: 24, fontWeight: '700', marginTop: 16 }}>Connected!</Text>
          <Text style={{ color: '#5a5a7a', fontSize: 15, marginTop: 8 }}>You're now connected with your partner</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (createdCode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 24, flex: 1, justifyContent: 'center' }}>
          <View style={styles.shareCard}>
            <Heart size={32} color="#6c63ff" />
            <Text style={styles.shareTitle}>Couple Created!</Text>
            <Text style={styles.shareHint}>Share this code with your partner</Text>
            <View style={styles.codeDisplay}>
              <Text style={styles.codeText}>{createdCode}</Text>
            </View>
            <TouchableOpacity style={styles.shareBtn}>
              <Share2 size={16} color="#0a0a0f" />
              <Text style={styles.shareBtnText}>Share Code</Text>
            </TouchableOpacity>
            <View style={styles.waitingCard}>
              <Clock size={16} color="#f59e0b" />
              <Text style={styles.waitingText}>Waiting for your partner to join...</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!mode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 24, flex: 1 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#f0f0ff" />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.logoCircle}><Heart size={32} color="#f0f0ff" /></View>
            <Text style={styles.title}>Connect with your partner</Text>
            <Text style={styles.subtitle}>Create a couple space or join using a code</Text>
            <View style={{ gap: 14, marginTop: 24 }}>
              <TouchableOpacity style={styles.optionCard} onPress={() => setMode('create')}>
                <View style={[styles.optionIcon, { backgroundColor: 'rgba(108,99,255,0.15)' }]}>
                  <Link2 size={24} color="#6c63ff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Create a couple</Text>
                  <Text style={styles.optionDesc}>Generate a code to share</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionCard} onPress={() => setMode('join')}>
                <View style={[styles.optionIcon, { backgroundColor: 'rgba(52,211,153,0.15)' }]}>
                  <QrCode size={24} color="#34d399" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Join a couple</Text>
                  <Text style={styles.optionDesc}>Enter your partner's code</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ padding: 24, flex: 1 }}>
        <TouchableOpacity onPress={() => setMode(null)} style={styles.backBtn}>
          <ArrowLeft size={22} color="#f0f0ff" />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {mode === 'create' ? (
            <>
              <Text style={styles.formTitle}>Create your couple space</Text>
              <Text style={styles.formDesc}>A unique code will be generated. Share it with your partner so they can join.</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate} disabled={loading}>
                {loading ? <ActivityIndicator color="#0a0a0f" /> : <Text style={styles.primaryBtnText}>Generate Code</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.formTitle}>Join your partner</Text>
              <Text style={styles.formDesc}>Enter the code your partner shared</Text>
              <TextInput style={styles.codeInput} placeholder="NX-XXXXXX" placeholderTextColor="#5a5a7a" value={code} onChangeText={setCode} autoCapitalize="characters" autoCorrect={false} />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleJoin} disabled={loading}>
                {loading ? <ActivityIndicator color="#0a0a0f" /> : <Text style={styles.primaryBtnText}>Join</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { color: '#f0f0ff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#5a5a7a', fontSize: 15, lineHeight: 22 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  optionIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optionTitle: { color: '#f0f0ff', fontSize: 17, fontWeight: '600', marginBottom: 4 },
  optionDesc: { color: '#5a5a7a', fontSize: 13 },
  formTitle: { color: '#f0f0ff', fontSize: 22, fontWeight: '700', marginBottom: 10 },
  formDesc: { color: '#5a5a7a', fontSize: 15, lineHeight: 22, marginBottom: 24 },
  codeInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 18, color: '#f0f0ff', fontSize: 22, fontWeight: '700', textAlign: 'center', letterSpacing: 4, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  primaryBtn: { backgroundColor: '#6c63ff', borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryBtnText: { color: '#0a0a0f', fontSize: 16, fontWeight: '700' },
  shareCard: { alignItems: 'center', gap: 12, padding: 32, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  shareTitle: { color: '#f0f0ff', fontSize: 22, fontWeight: '700' },
  shareHint: { color: '#5a5a7a', fontSize: 14 },
  codeDisplay: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, backgroundColor: 'rgba(108,99,255,0.1)', borderWidth: 1, borderColor: 'rgba(108,99,255,0.3)', marginVertical: 8 },
  codeText: { color: '#f0f0ff', fontSize: 24, fontWeight: '700', letterSpacing: 6 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#6c63ff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, marginTop: 8 },
  shareBtnText: { color: '#0a0a0f', fontSize: 14, fontWeight: '600' },
  waitingCard: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, padding: 12, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.1)' },
  waitingText: { color: '#f59e0b', fontSize: 13, fontWeight: '500' },
});
