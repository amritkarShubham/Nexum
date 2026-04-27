import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Sparkles, LayoutDashboard, Activity, CheckCircle, Clock } from 'lucide-react-native';

export default function Index() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review project proposal', time: '10:00 AM', completed: false },
    { id: 2, title: 'Design system updates', time: '1:30 PM', completed: true },
    { id: 3, title: 'Team standup meeting', time: '3:00 PM', completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <LayoutDashboard size={24} color="#f0f0ff" />
            </View>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.username}>Alex</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </TouchableOpacity>
        </View>

        {/* AI Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Sparkles size={18} color="#a78bfa" />
            <Text style={styles.insightTitle}>Nexum AI Insight</Text>
          </View>
          <Text style={styles.insightText}>
            You have a busy afternoon. Consider moving your 3:00 PM standup to tomorrow to focus on the design updates.
          </Text>
          <TouchableOpacity style={styles.insightAction}>
            <Text style={styles.insightActionText}>Reschedule meeting</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderTopColor: '#6c63ff' }]}>
            <Activity size={20} color="#6c63ff" />
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Productivity</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: '#34d399' }]}>
            <CheckCircle size={20} color="#34d399" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>

        {/* Task List */}
        <View style={styles.taskListContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {tasks.map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={[styles.taskItem, task.completed && styles.taskItemCompleted]}
              onPress={() => toggleTask(task.id)}
            >
              <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
                {task.completed && <CheckCircle size={14} color="#0a0a0f" />}
              </View>
              <View style={styles.taskDetails}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                  {task.title}
                </Text>
                <View style={styles.taskTimeContainer}>
                  <Clock size={12} color="#9090b0" />
                  <Text style={styles.taskTime}>{task.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#6c63ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  greeting: {
    color: '#9090b0',
    fontSize: 14,
    marginBottom: 4,
  },
  username: {
    color: '#f0f0ff',
    fontSize: 24,
    fontWeight: '700',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: {
    color: '#f0f0ff',
    fontSize: 18,
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  insightText: {
    color: '#e0e0ff',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  insightAction: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  insightActionText: {
    color: '#a78bfa',
    fontWeight: '600',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 16,
    borderTopWidth: 3,
  },
  statValue: {
    color: '#f0f0ff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    color: '#9090b0',
    fontSize: 14,
  },
  taskListContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#f0f0ff',
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllText: {
    color: '#6c63ff',
    fontSize: 14,
    fontWeight: '500',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  taskItemCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5a5a7a',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#34d399',
    borderColor: '#34d399',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    color: '#f0f0ff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9090b0',
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    color: '#9090b0',
    fontSize: 13,
    marginLeft: 6,
  },
});