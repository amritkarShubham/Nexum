import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from '../context/SocketContext';
import { useAuthStore } from '../utils/auth/store';
import * as SecureStore from 'expo-secure-store';
import SpaceBackground from '../components/SpaceBackground';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1, refetchOnWindowFocus: false },
  },
});

export default function RootLayout() {
  const { setReady, setAuth } = useAuthStore();

  useEffect(() => {
    SecureStore.getItemAsync('nexum-auth').then((auth) => {
      if (auth) setAuth(JSON.parse(auth));
      setReady();
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SpaceBackground />
          <View style={{ flex: 1, zIndex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="connect" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="chat" />
            <Stack.Screen name="video-call" />
            <Stack.Screen name="voice-call" />
            <Stack.Screen name="watch-together" />
            <Stack.Screen name="games" />
            <Stack.Screen name="trivia" />
            <Stack.Screen name="truth-or-dare" />
            <Stack.Screen name="would-you-rather" />
          </Stack>
          </View>
        </GestureHandlerRootView>
      </SocketProvider>
    </QueryClientProvider>
  );
}
