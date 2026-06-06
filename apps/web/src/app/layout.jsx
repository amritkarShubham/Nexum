import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from '../context/SocketContext';
import SpaceBackground from './components/SpaceBackground';
import './global.css'; // ensure global css is imported

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({children}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <SpaceBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </SocketProvider>
    </QueryClientProvider>
  );
}