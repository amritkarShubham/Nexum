import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Heart, RefreshCw } from 'lucide-react-native';
import { router } from 'expo-router';

const QUESTIONS = [
  { a: 'Cook a 5-course meal together', b: 'Dance under the stars' },
  { a: 'Be stranded on a deserted island', b: 'Be stuck in a snow cabin for a week' },
  { a: 'Have a deep conversation every night', b: 'Have spontaneous adventures every weekend' },
  { a: 'Sing karaoke in public together', b: 'Do a couple photoshoot' },
  { a: 'Get matching tattoos', b: 'Write letters to each other every month' },
  { a: 'Wake up at sunrise together every day', b: 'Stay up till midnight talking every night' },
  { a: 'Travel to 10 countries in 1 year', b: 'Live in 1 country for a whole year' },
  { a: 'Have unlimited movie nights', b: 'Have unlimited board game nights' },
  { a: 'Learn a new language together', b: 'Learn a new instrument together' },
  { a: 'Plan our wedding together', b: 'Elope somewhere spontaneous' },
];

export default function WouldYouRatherScreen() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const pick = (choice) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);
    if (questionIdx + 1 < QUESTIONS.length) {
      setQuestionIdx(questionIdx + 1);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setQuestionIdx(0);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const score = answers.length;
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.title, { textAlign: 'center' }]}>All Done!</Text>
          <Text style={[styles.scoreValue, { textAlign: 'center' }]}>{score} / {QUESTIONS.length}</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>Questions answered. Share with your partner!</Text>
          <TouchableOpacity style={styles.restartBtn} onPress={restart}>
            <RefreshCw size={16} color="#fff" />
            <Text style={styles.restartText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const q = QUESTIONS[questionIdx];
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ padding: 20, flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#f0f0ff" />
        </TouchableOpacity>
        <Text style={styles.title}>Would You Rather</Text>
        <Text style={styles.subtitle}>Pick your choice, see if your partner matches</Text>

        <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
          <Text style={styles.qCounter}>{questionIdx + 1} / {QUESTIONS.length}</Text>
          <TouchableOpacity style={[styles.choiceBtn, { borderColor: '#6c63ff' }]} onPress={() => pick('a')}>
            <Heart size={20} color="#6c63ff" />
            <Text style={styles.choiceText}>{q.a}</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>OR</Text>
          <TouchableOpacity style={[styles.choiceBtn, { borderColor: '#ec4899' }]} onPress={() => pick('b')}>
            <Heart size={20} color="#ec4899" />
            <Text style={styles.choiceText}>{q.b}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { color: '#f0f0ff', fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#5a5a7a', fontSize: 14, marginBottom: 24 },
  qCounter: { color: '#5a5a7a', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  choiceBtn: { padding: 24, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', gap: 8 },
  choiceText: { color: '#f0f0ff', fontSize: 16, fontWeight: '500', textAlign: 'center' },
  orText: { color: '#5a5a7a', fontSize: 14, textAlign: 'center', fontWeight: '600' },
  scoreValue: { fontSize: 48, fontWeight: '700', color: '#6c63ff', marginVertical: 8 },
  restartBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, backgroundColor: '#6c63ff', borderRadius: 14, padding: 16 },
  restartText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
