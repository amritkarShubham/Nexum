import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, MessageSquare, Play, Gamepad2, Video, Phone, Send, Sparkles, Crown, Sun, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import useStore, { PLANS } from '../store/useStore';

const ACTIONS = [
  { icon: Video, label: 'Video call', desc: 'HD call', path: '/video-call', color: '#6c63ff' },
  { icon: Phone, label: 'Voice call', desc: 'Audio only', path: '/voice-call', color: '#8b5cf6' },
  { icon: Play, label: 'Watch', desc: 'Synced streaming', path: '/watch-together', color: '#ec4899' },
  { icon: Gamepad2, label: 'Games', desc: '3 available', path: '/games', color: '#f59e0b' },
];

const MOODS = [
  { emoji: '☀️', label: 'Good' }, { emoji: '🥰', label: 'Loving' },
  { emoji: '😴', label: 'Tired' }, { emoji: '🥺', label: 'Miss you' },
  { emoji: '🤗', label: 'Huggy' }, { emoji: '🔥', label: 'Fired up' },
];

const RECENT = [
  { emoji: '🌅', text: 'Sarah shared a sunset photo', time: '2:30 PM' },
  { emoji: '🎵', text: 'You both listened to Golden Hour — JVKE', time: '1:15 PM' },
  { emoji: '💬', text: '"Good morning sunshine ☀️"', time: '9:20 AM' },
];

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { partner, partnerOnline, currentMood, setCurrentMood, streak, daysSinceStart, plan, setPlan, showUpgradeBanner, setShowUpgradeBanner, user } = useStore();
  const [mood, setMood] = useState(currentMood);
  const currentPlan = PLANS[plan];
  const upgrade = plan === 'spark' ? { target: 'embrace', label: 'Upgrade to Embrace', desc: 'Unlock unlimited everything' } :
                  plan === 'embrace' ? { target: 'eclipse', label: 'Go Eclipse', desc: 'Two souls, one orbit' } : null;

  const NavTab = ({ icon: Icon, label, path, primary, badge }) => (
    <TouchableOpacity style={[navStyles.tab, primary && navStyles.primaryTab]} onPress={() => router.push(path)}>
      <View style={{ position: 'relative' }}>
        <Icon size={primary ? 22 : 19} color={primary ? '#fff' : '#9090b0'} />
        {badge && <View style={navStyles.badge}><Text style={navStyles.badgeText}>{badge}</Text></View>}
      </View>
      {!primary && <Text style={navStyles.tabLabel}>{label}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Hey, {user?.name || 'Alex'}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
          <View style={styles.topRight}>
            <TouchableOpacity style={styles.planBadge} onPress={() => upgrade && setPlan(upgrade.target)}>
              <Crown size={12} color={currentPlan.color} />
              <Text style={[styles.planText, { color: currentPlan.color }]}>{currentPlan.icon} {currentPlan.name}</Text>
            </TouchableOpacity>
            <View style={styles.statusDot}>
              <View style={[styles.dot, { backgroundColor: '#34d399' }]} />
              <Text style={styles.statusText}>Online</Text>
            </View>
            <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/chat')}>
              <MessageSquare size={17} color="#f0f0ff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Upgrade banner */}
        {showUpgradeBanner && upgrade && (
          <View style={styles.upgradeBanner}>
            <View style={styles.upgradeContent}>
              <View style={styles.upgradeIcon}>
                <Text style={{ fontSize: 18 }}>{PLANS[upgrade.target].icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.upgradeLabel}>{upgrade.label}</Text>
                <Text style={styles.upgradeDesc}>{upgrade.desc}</Text>
              </View>
              <TouchableOpacity style={styles.upgradeBtn} onPress={() => { setPlan(upgrade.target); setShowUpgradeBanner(false); }}>
                <Text style={styles.upgradeBtnText}>{PLANS[upgrade.target].price}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowUpgradeBanner(false)}><Text style={{ color: '#5a5a7a', fontSize: 16 }}>×</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {/* Partner card */}
        <View style={styles.partnerCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Heart size={20} color="#f0f0ff" />
            </View>
            <View style={[styles.avatarDot, { backgroundColor: partnerOnline ? '#34d399' : '#5a5a7a' }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerName}>{partner.name}</Text>
            <Text style={styles.partnerStatus}>{partnerOnline ? 'Listening to music 🎵' : 'Last seen 2h ago'}</Text>
          </View>
          <TouchableOpacity style={styles.messageBtn} onPress={() => router.push('/chat')}>
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.actionsGrid}>
          {ACTIONS.map(a => (
            <TouchableOpacity key={a.label} style={styles.actionCard} onPress={() => router.push(a.path)}>
              <View style={[styles.actionIcon, { backgroundColor: a.color + '20' }]}>
                <a.icon size={18} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Text style={styles.actionDesc}>{a.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mood */}
        <View style={styles.moodCard}>
          <Text style={styles.sectionLabel}>HOW ARE YOU FEELING?</Text>
          <View style={styles.moodRow}>
            {MOODS.map(m => (
              <TouchableOpacity key={m.label} style={[styles.moodChip, m.label === mood && styles.moodChipActive]} onPress={() => { setMood(m.label); setCurrentMood(m.label); }}>
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, m.label === mood && styles.moodLabelActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily prompt */}
        <View style={styles.promptCard}>
          <View style={styles.promptTag}><Text style={styles.promptTagText}>💌 Daily prompt</Text></View>
          <Text style={styles.promptText}>"What is something I did recently that made you smile?"</Text>
          <TouchableOpacity style={styles.promptBtn}>
            <Send size={13} color="#f0f0ff" />
            <Text style={styles.promptBtnText}>Write your answer</Text>
          </TouchableOpacity>
          <Text style={styles.promptMeta}>Sarah answered 2h ago</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { value: daysSinceStart, label: 'days together', color: '#6c63ff' },
            { value: streak, label: 'day streak', color: '#8b5cf6' },
            { value: '2yr', label: 'anniversary', color: '#ec4899' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Activity */}
        <View>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionLabel}>TODAY</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          {RECENT.map((r, i) => (
            <View key={i} style={styles.activityItem}>
              <Text style={{ fontSize: 20 }}>{r.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText} numberOfLines={1}>{r.text}</Text>
                <Text style={styles.activityTime}>{r.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <NavTab icon={Heart} label="Home" path="/dashboard" />
        <NavTab icon={Play} label="Watch" path="/watch-together" />
        <NavTab icon={Video} label="Call" path="/video-call" primary />
        <NavTab icon={Gamepad2} label="Games" path="/games" />
        <NavTab icon={MessageSquare} label="Chat" path="/chat" badge="2" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { color: '#f0f0ff', fontSize: 22, fontWeight: '600', fontFamily: 'serif' },
  date: { color: '#5a5a7a', fontSize: 12, marginTop: 2 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  planText: { fontSize: 11, fontWeight: '600' },
  statusDot: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, color: '#5a5a7a' },
  chatBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  upgradeBanner: { padding: 14, marginBottom: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)', backgroundColor: 'rgba(124,58,237,0.06)' },
  upgradeContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  upgradeIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(124,58,237,0.15)', alignItems: 'center', justifyContent: 'center' },
  upgradeLabel: { color: '#f0f0ff', fontSize: 13, fontWeight: '500' },
  upgradeDesc: { color: '#9090b0', fontSize: 11, marginTop: 1 },
  upgradeBtn: { backgroundColor: '#6c63ff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  upgradeBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  partnerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: 'rgba(108,99,255,0.06)', borderWidth: 1, borderColor: 'rgba(108,99,255,0.15)', marginBottom: 28 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(108,99,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#0a0a0f', position: 'absolute', bottom: 0, right: 0 },
  partnerName: { color: '#f0f0ff', fontSize: 14, fontWeight: '500' },
  partnerStatus: { color: '#9090b0', fontSize: 12, marginTop: 2 },
  messageBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)' },
  messageBtnText: { color: '#f0f0ff', fontSize: 12, fontWeight: '500' },
  sectionLabel: { color: '#5a5a7a', fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 10, marginTop: 8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  actionCard: { width: '48%', padding: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  actionIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { color: '#f0f0ff', fontSize: 14, fontWeight: '500', marginBottom: 2 },
  actionDesc: { color: '#5a5a7a', fontSize: 12 },
  moodCard: { padding: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 20 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  moodChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  moodChipActive: { borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.1)' },
  moodEmoji: { fontSize: 14 },
  moodLabel: { color: '#9090b0', fontSize: 12 },
  moodLabelActive: { color: '#6c63ff' },
  promptCard: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)', backgroundColor: 'rgba(124,58,237,0.04)', marginBottom: 28 },
  promptTag: { marginBottom: 12 },
  promptTagText: { color: '#8b5cf6', fontSize: 11, fontWeight: '600' },
  promptText: { color: '#f0f0ff', fontSize: 16, lineHeight: 24, marginBottom: 16 },
  promptBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'flex-start' },
  promptBtnText: { color: '#f0f0ff', fontSize: 12 },
  promptMeta: { color: '#5a5a7a', fontSize: 11, marginTop: 12 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  statCard: { flex: 1, padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { color: '#5a5a7a', fontSize: 11, marginTop: 2 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seeAll: { color: '#5a5a7a', fontSize: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 6 },
  activityText: { color: '#f0f0ff', fontSize: 13 },
  activityTime: { color: '#5a5a7a', fontSize: 11, marginTop: 2 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#0a0a0f', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
});

const navStyles = StyleSheet.create({
  tab: { alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4 },
  primaryTab: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center', marginTop: -8 },
  tabLabel: { color: '#5a5a7a', fontSize: 10 },
  badge: { position: 'absolute', top: -6, right: -8, width: 16, height: 16, borderRadius: 8, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
