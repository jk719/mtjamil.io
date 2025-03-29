import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isTeacher, isStudent } from '@/utils/roles';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  previousAuthState: User | null; // Track previous auth state
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  isTeacher: false,
  isStudent: false,
  previousAuthState: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const previousAuthState = useRef<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Store the previous state before updating
      previousAuthState.current = user;
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    isTeacher: isTeacher(user),
    isStudent: isStudent(user),
    previousAuthState: previousAuthState.current
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 