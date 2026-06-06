import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Brain, Heart, Sparkles, Gamepad2 } from 'lucide-react-native';
import { router } from 'expo-router';

const GAMES = [
  { icon: Brain, label: 'Couple Trivia', desc: 'How well do you know each other?', color: '#6c63ff', path: '/trivia' },
  { icon: Heart, label: 'Truth or Dare', desc: 'Deep questions & playful challenges', color: '#ec4899', path: '/truth-or-dare' },
  { icon: Sparkles, label: 'Would You Rather', desc: 'Couple choices with match scoring', color: '#f59e0b', path: '/would-you-rather' },
];

export default function GamesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#f0f0ff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Games</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.subtitle}>Play together, even apart</Text>

        {GAMES.map((g, i) => (
          <TouchableOpacity key={i} style={styles.gameCard} onPress={() => router.push(g.path)}>
            <View style={[styles.gameIcon, { backgroundColor: g.color + '20' }]}>
              <g.icon size={28} color={g.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.gameLabel}>{g.label}</Text>
              <Text style={styles.gameDesc}>{g.desc}</Text>
            </View>
            <Gamepad2 size={18} color="#5a5a7a" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { padding: 20, paddingBottom: 80 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#f0f0ff', fontSize: 20, fontWeight: '600' },
  subtitle: { color: '#5a5a7a', fontSize: 14, marginBottom: 24 },
  gameCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 12 },
  gameIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  gameLabel: { color: '#f0f0ff', fontSize: 17, fontWeight: '600', marginBottom: 4 },
  gameDesc: { color: '#9090b0', fontSize: 13 },
});
