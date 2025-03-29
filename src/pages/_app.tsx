import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import AuthStateListener from '@/components/AuthStateListener';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AuthStateListener />
        <PerformanceMonitor>
          <Component {...pageProps} />
        </PerformanceMonitor>
      </NotificationProvider>
    </AuthProvider>
  );
} 