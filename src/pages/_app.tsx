import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PerformanceMonitor>
        <Component {...pageProps} />
      </PerformanceMonitor>
    </AuthProvider>
  );
} 