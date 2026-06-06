import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Heart, Sparkles, RefreshCw } from 'lucide-react-native';
import { router } from 'expo-router';

const TRUTHS = [
  "What was your first impression of me?", "What's something you've never told anyone?",
  "What's your biggest fear in our relationship?", "What's the most romantic thing I've done?",
  "What do you love most about us?", "What's a secret you've been keeping?",
  "What's your favorite memory of us?", "What's something you want us to try together?",
  "What made you fall for me?", "What's your love language?",
];

const DARES = [
  "Send me a voice note saying something sweet", "Describe our future home in 3 sentences",
  "Sing our song and send a recording", "Write a short poem about us",
  "Send a selfie with a funny face right now", "Tell me a joke in your best accent",
  "Draw something that represents us and share it", "Send 3 emojis that describe your feeling right now",
  "Do a 30-second dance and record it", "Text me something you've been too shy to say",
];

export default function TruthOrDareScreen() {
  const [mode, setMode] = useState(null);
  const [current, setCurrent] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const pick = (m) => {
    setMode(m);
    setCurrent(m === 'truth' ? TRUTHS[Math.floor(Math.random() * TRUTHS.length)] : DARES[Math.floor(Math.random() * DARES.length)]);
    setRevealed(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ padding: 20, flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#f0f0ff" />
        </TouchableOpacity>
        <Text style={styles.title}>Truth or Dare</Text>
        <Text style={styles.subtitle}>Tap to reveal, then share with your partner</Text>

        {!mode && (
          <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
            <TouchableOpacity style={[styles.modeBtn, { borderColor: '#6c63ff' }]} onPress={() => pick('truth')}>
              <Heart size={24} color="#6c63ff" />
              <Text style={styles.modeLabel}>Truth</Text>
              <Text style={styles.modeDesc}>Deep questions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modeBtn, { borderColor: '#ec4899' }]} onPress={() => pick('dare')}>
              <Sparkles size={24} color="#ec4899" />
              <Text style={styles.modeLabel}>Dare</Text>
              <Text style={styles.modeDesc}>Playful challenges</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.modeTag}>{mode === 'truth' ? 'TRUTH' : 'DARE'}</Text>
            {!revealed ? (
              <TouchableOpacity style={styles.revealBtn} onPress={() => setRevealed(true)}>
                <Text style={styles.revealText}>Tap to Reveal</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.cardText}>{current}</Text>
                <TouchableOpacity style={styles.nextBtn} onPress={() => pick(mode)}>
                  <RefreshCw size={16} color="#fff" />
                  <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { setMode(null); setRevealed(false); }}>
              <Text style={{ color: '#5a5a7a', fontSize: 14 }}>Switch to {mode === 'truth' ? 'Dare' : 'Truth'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { color: '#f0f0ff', fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#5a5a7a', fontSize: 14, marginBottom: 24 },
  modeBtn: { padding: 24, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', gap: 8 },
  modeLabel: { color: '#f0f0ff', fontSize: 20, fontWeight: '600' },
  modeDesc: { color: '#5a5a7a', fontSize: 13 },
  modeTag: { color: '#6c63ff', fontSize: 14, fontWeight: '700', letterSpacing: 4, marginBottom: 24 },
  revealBtn: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center' },
  revealText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  cardText: { color: '#f0f0ff', fontSize: 18, lineHeight: 26, textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)' },
  nextText: { color: '#fff', fontSize: 14, fontWeight: '500' },
});
