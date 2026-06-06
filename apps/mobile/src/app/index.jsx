import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Heart, LogIn, UserPlus, Sparkles, Play, Gamepad2, MessageCircle } from 'lucide-react-native';
import { useAuthStore } from '../utils/auth/store';
import useStore from '../store/useStore';
import { router } from 'expo-router';
import { api } from '../utils/api';

export default function LandingScreen() {
  const [page, setPage] = useState('landing');
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth, auth } = useAuthStore();

  useEffect(() => {
    if (auth) {
      router.replace(auth.coupleId ? '/dashboard' : '/connect');
    }
  }, [auth]);

  const handleSubmit = async () => {
    if (!email.trim() || (mode === 'register' && !name.trim())) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        const data = await api.register(email.trim(), name.trim(), '');
        setAuth({ user: data.user, subscription: data.subscription });
        useStore.getState().setUser(data.user);
        router.replace('/connect');
      } else {
        const data = await api.getUserByEmail(email.trim());
        setAuth({ user: data.user, subscription: data.subscription });
        useStore.getState().setUser(data.user);
        try {
          const couple = await api.getCouple(data.user.id);
          setAuth({ user: data.user, subscription: data.subscription, coupleId: couple.id });
          router.replace('/dashboard');
        } catch {
          router.replace('/connect');
        }
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (page === 'landing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.landingContainer}>
          <View style={styles.hero}>
            <View style={styles.logoCircle}><Heart size={44} color="#fff" /></View>
            <Text style={styles.heroTitle}>Nexum</Text>
            <Text style={styles.heroSub}>Together, apart</Text>
          </View>
          <View style={styles.features}>
            {[
              { icon: Play, label: 'Synchronized streaming', desc: 'Watch together in sync' },
              { icon: Gamepad2, label: 'Games for two', desc: 'Trivia, Truth or Dare & more' },
              { icon: Heart, label: 'HD Video & Voice', desc: 'Feel close, even far' },
              { icon: MessageCircle, label: 'Daily check-ins', desc: 'Moods, prompts & streaks' },
            ].map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}><f.icon size={18} color="#6c63ff" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => setPage('auth')}>
            <Sparkles size={18} color="#0a0a0f" />
            <Text style={styles.ctaText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} onPress={() => { setMode('login'); setPage('auth'); }}>
            <LogIn size={16} color="#6c63ff" />
            <Text style={styles.ctaSecondaryText}>I have an account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircleMini}><Heart size={28} color="#fff" /></View>
          <Text style={styles.title}>{mode === 'login' ? 'Welcome back' : 'Join Nexum'}</Text>
          <Text style={styles.subtitle}>{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</Text>
        </View>
        <View style={styles.form}>
          {mode === 'register' && (
            <TextInput style={styles.input} placeholder="Your name" placeholderTextColor="#5a5a7a" value={name} onChangeText={setName} autoCapitalize="words" />
          )}
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#5a5a7a" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#0a0a0f" /> : <Text style={styles.buttonText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.switchText}>{mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  landingContainer: { flex: 1, padding: 24, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoCircleMini: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { color: '#f0f0ff', fontSize: 40, fontWeight: '700', marginBottom: 8 },
  heroSub: { color: '#9090b0', fontSize: 18 },
  features: { gap: 16, marginBottom: 40 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(108,99,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  featureLabel: { color: '#f0f0ff', fontSize: 15, fontWeight: '600' },
  featureDesc: { color: '#9090b0', fontSize: 13, marginTop: 2 },
  ctaBtn: { backgroundColor: '#6c63ff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaText: { color: '#0a0a0f', fontSize: 16, fontWeight: '700' },
  ctaSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 16, marginTop: 8 },
  ctaSecondaryText: { color: '#6c63ff', fontSize: 14, fontWeight: '500' },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  title: { color: '#f0f0ff', fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#9090b0', fontSize: 15 },
  form: { gap: 14 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, color: '#f0f0ff', fontSize: 16 },
  button: { backgroundColor: '#6c63ff', borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: '#0a0a0f', fontSize: 16, fontWeight: '700' },
  switchText: { color: '#6c63ff', textAlign: 'center', fontSize: 14, marginTop: 8 },
});
