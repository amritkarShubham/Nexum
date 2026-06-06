import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export const authKey = 'nexum-auth';

export const useAuthStore = create((set) => ({
  isReady: false,
  auth: null,
  setAuth: (auth) => {
    set({ auth });
    if (auth) {
      SecureStore.setItemAsync(authKey, JSON.stringify(auth)).catch(() => {});
    } else {
      SecureStore.deleteItemAsync(authKey).catch(() => {});
    }
  },
  setReady: () => set({ isReady: true }),
}));

export const useAuthModal = create((set) => ({
  isOpen: false,
  mode: 'signup',
  open: (options) => set({ isOpen: true, mode: options?.mode || 'signup' }),
  close: () => set({ isOpen: false }),
}));