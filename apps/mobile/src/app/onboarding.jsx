import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Heart, Play, Gamepad2, Video, Sparkles, Check, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import useStore, { PLANS } from '../store/useStore';

const INTRO_SLIDES = [
  { icon: Play, title: 'Watch Together', desc: 'Stream YouTube & more in perfect sync', color: '#ec4899' },
  { icon: Gamepad2, title: 'Play Together', desc: 'Trivia, Truth or Dare & Would You Rather', color: '#f59e0b' },
  { icon: Video, title: 'HD Calls', desc: 'Video & voice calls that feel real', color: '#6c63ff' },
  { icon: Heart, title: 'Daily Rituals', desc: 'Moods, prompts & streaks to stay close', color: '#34d399' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('spark');
  const { setPlan } = useStore();

  // Step 0-3: Feature intro
  if (step < 4) {
    const slide = INTRO_SLIDES[step];
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
          <View style={styles.slideContent}>
            <View style={[styles.slideIcon, { backgroundColor: slide.color + '20' }]}>
              <slide.icon size={48} color={slide.color} />
            </View>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideDesc}>{slide.desc}</Text>
          </View>
          <View style={styles.slideFooter}>
            <View style={styles.dots}>
              {INTRO_SLIDES.map((_, i) => (
                <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
              ))}
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(step + 1)}>
              <Text style={styles.nextBtnText}>{step === 3 ? 'Choose Plan' : 'Next'}</Text>
              <ArrowRight size={18} color="#0a0a0f" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 4: Plan selection
  if (step === 4) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Text style={styles.planTitle}>Choose Your Plan</Text>
          <Text style={styles.planSubtitle}>Upgrade anytime as your love grows</Text>
          {Object.values(PLANS).map(p => (
            <TouchableOpacity key={p.id} style={[styles.planCard, selectedPlan === p.id && styles.planCardActive]} onPress={() => setSelectedPlan(p.id)}>
              <View style={styles.planHeader}>
                <Text style={{ fontSize: 28 }}>{p.icon}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.planName}>{p.name}</Text>
                  <Text style={styles.planTagline}>{p.tagline}</Text>
                </View>
                <Text style={styles.planPrice}>{p.price}</Text>
              </View>
              {p.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Check size={14} color="#34d399" />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
              {selectedPlan === p.id && (
                <TouchableOpacity style={styles.continueBtn} onPress={() => { setPlan(p.id); router.push('/connect'); }}>
                  <Text style={styles.continueBtnText}>{p.price === 'Free' ? 'Start Free' : `Start ${p.name}`}</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  slideContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  slideIcon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  slideTitle: { color: '#f0f0ff', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  slideDesc: { color: '#9090b0', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  slideFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { width: 24, backgroundColor: '#6c63ff' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#6c63ff', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  nextBtnText: { color: '#0a0a0f', fontSize: 16, fontWeight: '700' },
  planTitle: { color: '#f0f0ff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  planSubtitle: { color: '#5a5a7a', fontSize: 15, marginBottom: 24 },
  planCard: { padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 12 },
  planCardActive: { borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.06)' },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  planName: { color: '#f0f0ff', fontSize: 18, fontWeight: '600' },
  planTagline: { color: '#5a5a7a', fontSize: 12, marginTop: 2 },
  planPrice: { color: '#f0f0ff', fontSize: 16, fontWeight: '600' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  featureText: { color: '#9090b0', fontSize: 13, flex: 1 },
  continueBtn: { marginTop: 16, backgroundColor: '#6c63ff', borderRadius: 14, padding: 16, alignItems: 'center' },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
