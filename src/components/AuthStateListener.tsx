import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

export default function AuthStateListener() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const prevUserRef = useRef<any>(null);
  
  useEffect(() => {
    // Skip the initial render
    if (prevUserRef.current === null) {
      prevUserRef.current = user;
      return;
    }
    
    // User just logged in
    if (prevUserRef.current === null && user !== null) {
      showNotification('success', `Welcome, ${user.email || 'User'}!`, 5000);
    }
    
    // User just logged out
    if (prevUserRef.current !== null && user === null) {
      showNotification('info', 'You have been logged out', 5000);
    }
    
    // Update the ref
    prevUserRef.current = user;
  }, [user, showNotification]);
  
  // This component doesn't render anything
  return null;
} 