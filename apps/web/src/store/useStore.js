import { create } from 'zustand';

export const PLANS = {
  spark: {
    id: 'spark',
    name: 'Spark',
    tagline: 'That first glow',
    icon: '✨',
    price: 'Free',
    color: 'var(--accent)',
    features: [
      'Unlimited chat with your partner',
      '1 game per day',
      'Basic voice calls',
      'YouTube watch together',
      'Daily prompts',
    ],
    disabled: ['games_limit', 'watch_platforms', 'hd_calls', 'extended_history'],
  },
  embrace: {
    id: 'embrace',
    name: 'Embrace',
    tagline: 'Closer every day',
    icon: '💫',
    price: '₹499/mo',
    color: 'var(--violet)',
    features: [
      'Unlimited chat with your partner',
      '3–4 games per day',
      'HD voice & video calls',
      'All platforms watch together (3 hrs/week)',
      'Daily prompts & mood tracking',
      'Extended history (3 months)',
    ],
    disabled: [],
    popular: true,
  },
  eclipse: {
    id: 'eclipse',
    name: 'Eclipse',
    tagline: 'Two souls, one orbit',
    icon: '🌑',
    price: '₹999/mo',
    color: 'var(--glow)',
    features: [
      'Everything in Embrace, unlimited',
      'All games — unlimited plays',
      'Unlimited streaming — all platforms',
      'Priority support — 24/7',
      'Custom themes & chat colors',
      'Unlimited extended history',
      'Partner rewards & milestones',
      'Early access to new features',
    ],
    disabled: [],
  },
};

const useStore = create((set, get) => ({
  // User / partner
  user: { name: 'Alex', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  partner: { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  partnerOnline: true,
  partnerActivity: 'Listening to music 🎵',

  // Subscription
  plan: 'spark',
  showUpgradeBanner: true,

  // Call state
  callState: 'idle',
  callType: null,
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  isMuted: false,
  isCameraOff: false,
  callDuration: 0,

  // Watch party
  watchUrl: '',
  isPlaying: false,
  currentTime: 0,
  isPiPOpen: false,
  platform: null,
  isManualMode: false,
  manualTime: 0,
  partnerManualTime: null,
  partnerPlatform: null,

  // Mood
  currentMood: null,

  // Games
  triviaState: null,
  truthOrDareState: null,
  wyrState: null,

  // Streak / stats
  streak: 47,
  daysSinceStart: Math.floor((Date.now() - new Date('2024-06-15').getTime()) / 86400000),

  // Actions
  setUser: (user) => set({ user }),
  setPartner: (partner) => set({ partner }),
  setPartnerOnline: (online) => set({ partnerOnline: online }),

  setPlan: (plan) => set({ plan }),
  setShowUpgradeBanner: (showUpgradeBanner) => set({ showUpgradeBanner }),

  setCallState: (callState) => set({ callState }),
  setCallType: (callType) => set({ callType }),
  setLocalStream: (localStream) => set({ localStream }),
  setRemoteStream: (remoteStream) => set({ remoteStream }),
  setPeerConnection: (peerConnection) => set({ peerConnection }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setIsCameraOff: (isCameraOff) => set({ isCameraOff }),
  setCallDuration: (callDuration) => set({ callDuration }),

  setWatchUrl: (watchUrl) => set({ watchUrl }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setIsPiPOpen: (isPiPOpen) => set({ isPiPOpen }),
  setPlatform: (platform) => set({ platform }),
  setIsManualMode: (isManualMode) => set({ isManualMode }),
  setManualTime: (manualTime) => set({ manualTime: typeof manualTime === 'function' ? manualTime(get().manualTime) : manualTime }),
  setPartnerManualTime: (partnerManualTime) => set({ partnerManualTime }),
  setPartnerPlatform: (partnerPlatform) => set({ partnerPlatform }),

  setCurrentMood: (currentMood) => set({ currentMood }),

  setTriviaState: (triviaState) => set({ triviaState }),
  setTruthOrDareState: (truthOrDareState) => set({ truthOrDareState }),
  setWyrState: (wyrState) => set({ wyrState }),

  resetCall: () => set({
    callState: 'idle',
    callType: null,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    isMuted: false,
    isCameraOff: false,
    callDuration: 0,
  }),
}));

export default useStore;
