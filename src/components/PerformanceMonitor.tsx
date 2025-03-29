import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { startPerformanceLog, endPerformanceLog } from '@/utils/performanceLogger';

export default function PerformanceMonitor({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Monitor page load times
    const handleStart = () => {
      startPerformanceLog('pageLoad', `Loading page: ${router.pathname}`);
    };

    const handleComplete = () => {
      endPerformanceLog('pageLoad');
    };

    const handleError = (error: Error) => {
      console.error(`%c[${new Date().toLocaleTimeString()}] Page load error: ${error.message}`, 
        'color: #FF0000; font-weight: bold;');
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    // Monitor initial page load
    startPerformanceLog('initialLoad', 'Initial page load');
    window.addEventListener('load', () => {
      endPerformanceLog('initialLoad');
    });

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  return <>{children}</>;
} 