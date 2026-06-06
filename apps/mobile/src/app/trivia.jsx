import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { router } from 'expo-router';

const CATEGORIES = ['Light & Fun', 'Deep & Real'];

const QUESTIONS = {
  'Light & Fun': [
    { q: "What is my favorite food?", a: ['Pizza', 'Sushi', 'Pasta', 'Burgers'], correct: 0 },
    { q: "What's my go-to karaoke song?", a: ['Bohemian Rhapsody', 'Shape of You', 'Someone Like You', 'Uptown Funk'], correct: 2 },
    { q: "What's my ideal weekend activity?", a: ['Movie marathon', 'Hiking', 'Cooking together', 'Gaming'], correct: 0 },
    { q: "What's my hidden talent?", a: ['Singing', 'Dancing', 'Drawing', 'Cooking'], correct: 1 },
    { q: "What movie makes me cry every time?", a: ['Titanic', 'The Notebook', 'Up', 'Coco'], correct: 3 },
  ],
  'Deep & Real': [
    { q: "What is my biggest dream?", a: ['Travel the world', 'Start a family', 'Build a career', 'Write a book'], correct: 0 },
    { q: "What calms me down?", a: ['Music', 'Nature', 'Your voice', 'Meditation'], correct: 2 },
    { q: "What's my love language?", a: ['Words', 'Touch', 'Quality time', 'Acts of service'], correct: 1 },
    { q: "What am I most afraid of?", a: ['Losing you', 'Failure', 'Loneliness', 'Heights'], correct: 0 },
    { q: "What's my favorite memory of us?", a: ['First date', 'First trip', 'First kiss', 'First I love you'], correct: 2 },
  ],
};

export default function TriviaScreen() {
  const [round, setRound] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [category, setCategory] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const startGame = (cat) => {
    setCategory(cat);
    setRound(0);
    setQuestionIdx(0);
    setAnswers([]);
    setFinished(false);
  };

  const answer = (idx) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    const qs = QUESTIONS[category];
    if (questionIdx + 1 < qs.length) {
      setQuestionIdx(questionIdx + 1);
    } else if (round === 0) {
      setRound(1);
      setQuestionIdx(0);
    } else {
      setFinished(true);
    }
  };

  if (!category) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#f0f0ff" />
          </TouchableOpacity>
          <Text style={styles.title}>Couple Trivia</Text>
          <Text style={styles.desc}>Pick a category to start</Text>
          {CATEGORIES.map(c => (
            <TouchableOpacity key={c} style={styles.categoryCard} onPress={() => startGame(c)}>
              <Heart size={20} color="#6c63ff" />
              <Text style={styles.categoryLabel}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (finished) {
    const qs = QUESTIONS[category];
    const score = answers.reduce((s, a, i) => s + (a === qs[i % qs.length].correct ? 1 : 0), 0);
    const total = qs.length * 2;
    const pct = Math.round((score / total) * 100);
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.title, { textAlign: 'center' }]}>Your Score</Text>
          <Text style={[styles.scoreValue, { textAlign: 'center' }]}>{pct}%</Text>
          <Text style={[styles.desc, { textAlign: 'center' }]}>Match percentage</Text>
          {answers.map((a, i) => (
            <View key={i} style={styles.answerRow}>
              <Text style={{ color: '#9090b0', fontSize: 13 }}>Q{i + 1}: </Text>
              <Text style={{ color: a === qs[i % qs.length].correct ? '#34d399' : '#ef4444', fontSize: 13 }}>
                {a === qs[i % qs.length].correct ? '✓ Correct' : '✗ Wrong'}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.playAgain} onPress={() => { setCategory(null); setFinished(false); }}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const qs = QUESTIONS[category];
  const current = qs[questionIdx];
  const roundLabel = round === 0 ? `Round 1 — About ${category}` : 'Round 2 — About your partner';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ padding: 20, flex: 1 }}>
        <TouchableOpacity onPress={() => setCategory(null)} style={styles.backBtn}>
          <ArrowLeft size={22} color="#f0f0ff" />
        </TouchableOpacity>
        <Text style={styles.roundLabel}>{roundLabel}</Text>
        <Text style={styles.questionText}>{current.q}</Text>
        <View style={{ gap: 10, marginTop: 20 }}>
          {current.a.map((opt, idx) => (
            <TouchableOpacity key={idx} style={styles.optionBtn} onPress={() => answer(idx)}>
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.progress}>{questionIdx + 1} / {qs.length}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { color: '#f0f0ff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  desc: { color: '#5a5a7a', fontSize: 14, marginBottom: 24 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 10 },
  categoryLabel: { color: '#f0f0ff', fontSize: 16, fontWeight: '500' },
  roundLabel: { color: '#6c63ff', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  questionText: { color: '#f0f0ff', fontSize: 20, fontWeight: '600', lineHeight: 28 },
  optionBtn: { padding: 16, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  optionText: { color: '#f0f0ff', fontSize: 15 },
  progress: { color: '#5a5a7a', fontSize: 13, textAlign: 'center', marginTop: 20 },
  scoreValue: { fontSize: 48, fontWeight: '700', color: '#6c63ff', marginVertical: 8 },
  answerRow: { flexDirection: 'row', marginBottom: 6 },
  playAgain: { marginTop: 24, backgroundColor: '#6c63ff', borderRadius: 14, padding: 16, alignItems: 'center' },
  playAgainText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
