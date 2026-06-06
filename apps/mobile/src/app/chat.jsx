import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Send, Phone, Video, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import useStore from '../store/useStore';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const { messages, addMessage, partner, partnerOnline } = useStore();

  const sendMessage = () => {
    if (!input.trim()) return;
    addMessage({
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setInput('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#f0f0ff" />
          </TouchableOpacity>
          <View style={styles.avatarSm}>
            <Heart size={14} color="#f0f0ff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName}>{partner.name}</Text>
            <Text style={[styles.headerStatus, { color: partnerOnline ? '#34d399' : '#5a5a7a' }]}>
              {partnerOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/voice-call')}>
            <Phone size={16} color="#f0f0ff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/video-call')}>
            <Video size={16} color="#f0f0ff" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={({ item }) => (
            <View style={[styles.messageRow, item.sender === 'me' ? styles.myMsg : styles.theirMsg]}>
              <View style={[styles.bubble, item.sender === 'me' ? styles.myBubble : styles.theirBubble]}>
                <Text style={styles.msgText}>{item.text}</Text>
                <Text style={styles.msgTime}>{item.time}</Text>
              </View>
            </View>
          )}
        />

        <View style={styles.inputBar}>
          <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor="#5a5a7a" value={input} onChangeText={setInput} multiline />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Send size={18} color="#0a0a0f" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  avatarSm: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(108,99,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerName: { color: '#f0f0ff', fontSize: 16, fontWeight: '600' },
  headerStatus: { fontSize: 12 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  messagesList: { padding: 16, paddingBottom: 8 },
  messageRow: { marginBottom: 12, flexDirection: 'row' },
  myMsg: { justifyContent: 'flex-end' },
  theirMsg: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', padding: 14, borderRadius: 18 },
  myBubble: { backgroundColor: '#6c63ff', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: 'rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 },
  msgText: { color: '#f0f0ff', fontSize: 15, lineHeight: 20, marginBottom: 4 },
  msgTime: { color: 'rgba(240,240,255,0.4)', fontSize: 11, alignSelf: 'flex-end' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, color: '#f0f0ff', fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center' },
});
