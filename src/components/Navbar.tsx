import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import styles from '@/styles/Navbar.module.css';
import { 
  FaGraduationCap, 
  FaRightFromBracket, 
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaQuestion,
  FaUserPlus
} from 'react-icons/fa6';

export default function Navbar() {
  const { user, isTeacher } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const signupDropdownRef = useRef<HTMLDivElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const signupButtonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For login dropdown
      if (showLoginForm && 
          loginDropdownRef.current && 
          !loginDropdownRef.current.contains(event.target as Node) &&
          loginButtonRef.current && 
          !loginButtonRef.current.contains(event.target as Node)) {
        setShowLoginForm(false);
      }
      
      // For signup dropdown
      if (showSignupForm && 
          signupDropdownRef.current && 
          !signupDropdownRef.current.contains(event.target as Node) &&
          signupButtonRef.current && 
          !signupButtonRef.current.contains(event.target as Node)) {
        setShowSignupForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginForm, showSignupForm]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showNotification('success', 'Successfully logged out');
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
      showNotification('error', 'Failed to log out');
    }
  };

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    if (showSignupForm) setShowSignupForm(false);
    resetForms();
  };

  const toggleSignupForm = () => {
    setShowSignupForm(!showSignupForm);
    if (showLoginForm) setShowLoginForm(false);
    resetForms();
  };

  const resetForms = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setConfirmPassword('');
    setError('');
    setIsResetMode(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const auth = getAuth();
      if (isResetMode) {
        await sendPasswordResetEmail(auth, email);
        showNotification('success', 'Password reset email sent');
        setIsResetMode(false);
        setShowLoginForm(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showNotification('success', 'Successfully logged in');
        setShowLoginForm(false);
        // Clear form fields
        resetForms();
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('auth/wrong-password')) {
          setError('Incorrect password');
          showNotification('error', 'Incorrect password');
        } else if (err.message.includes('auth/user-not-found')) {
          setError('Email not found');
          showNotification('error', 'Email not found');
        } else if (err.message.includes('auth/invalid-email')) {
          setError('Invalid email address');
          showNotification('error', 'Invalid email address');
        } else {
          setError('Failed to process request. Please try again.');
          showNotification('error', 'Login failed. Please try again.');
        }
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      showNotification('error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      showNotification('error', 'Password must be at least 6 characters');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name if provided
      if (displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim()
        });
      }
      
      showNotification('success', 'Account created successfully');
      setShowSignupForm(false);
      resetForms();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('auth/email-already-in-use')) {
          setError('Email already in use');
          showNotification('error', 'Email already in use');
        } else if (err.message.includes('auth/invalid-email')) {
          setError('Invalid email address');
          showNotification('error', 'Invalid email address');
        } else if (err.message.includes('auth/weak-password')) {
          setError('Password is too weak');
          showNotification('error', 'Password is too weak');
        } else {
          setError('Failed to create account. Please try again.');
          showNotification('error', 'Signup failed. Please try again.');
        }
      }
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        <FaGraduationCap className={styles.logoIcon} />
        <span>MTJamil.io</span>
      </Link>
      
      {!user && (
        <div className={styles.authButtons}>
          <button 
            ref={signupButtonRef}
            className={styles.signupButton} 
            onClick={toggleSignupForm}
          >
            Sign Up
          </button>
          <button 
            ref={loginButtonRef}
            className={styles.loginButton} 
            onClick={toggleLoginForm}
          >
            Login
          </button>
          
          {showLoginForm && (
            <div ref={loginDropdownRef} className={styles.loginDropdown}>
              <form onSubmit={handleLogin} className={styles.loginForm}>
                <h2 className={styles.formTitle}>{isResetMode ? 'Reset Password' : 'Login'}</h2>
                {error && (
                  <div className={styles.error}>{error}</div>
                )}
                <div className={styles.inputGroup}>
                  <label htmlFor="login-email">
                    <FaEnvelope className={styles.inputIcon} />
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {!isResetMode && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="login-password">
                      <FaLock className={styles.inputIcon} />
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                )}
                <button type="submit" className={styles.submitButton}>
                  {isResetMode ? 'Reset Password' : 'Sign In'}
                  <FaArrowRight className={styles.buttonIcon} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetMode(!isResetMode)}
                  className={styles.forgotPassword}
                >
                  <FaQuestion className={styles.forgotIcon} />
                  {isResetMode ? 'Back to Login' : 'Forgot Password?'}
                </button>
              </form>
            </div>
          )}
          
          {showSignupForm && (
            <div ref={signupDropdownRef} className={styles.signupDropdown}>
              <form onSubmit={handleSignup} className={styles.signupForm}>
                <h2 className={styles.formTitle}>Create Account</h2>
                {error && (
                  <div className={styles.error}>{error}</div>
                )}
                <div className={styles.inputGroup}>
                  <label htmlFor="signup-name">
                    <FaUser className={styles.inputIcon} />
                    Name (Optional)
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="signup-email">
                    <FaEnvelope className={styles.inputIcon} />
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="signup-password">
                    <FaLock className={styles.inputIcon} />
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="signup-confirm-password">
                    <FaLock className={styles.inputIcon} />
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <button type="submit" className={styles.submitButton}>
                  Create Account
                  <FaArrowRight className={styles.buttonIcon} />
                </button>
                <button
                  type="button"
                  onClick={toggleLoginForm}
                  className={styles.switchForm}
                >
                  Already have an account? Login
                </button>
              </form>
            </div>
          )}
        </div>
      )}
      
      {user && (
        <div className={styles.links}>
          <div className={styles.userInfo}>
            <FaUser className={styles.userIcon} />
            <span className={styles.role}>
              {isTeacher ? 'Teacher' : user?.displayName || user?.email}
            </span>
          </div>
          <Link href="/profile" className={styles.link}>
            Profile
          </Link>
          <Link href="/feedback" className={styles.link}>
            Submit Feedback
          </Link>
          {isTeacher && (
            <Link href="/dashboard" className={styles.link}>
              View Dashboard
            </Link>
          )}
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaRightFromBracket className={styles.logoutIcon} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
} 