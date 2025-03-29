import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
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
  FaQuestion
} from 'react-icons/fa6';

export default function Navbar() {
  const { user, isTeacher } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

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
        setEmail('');
        setPassword('');
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

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        <FaGraduationCap className={styles.logoIcon} />
        <span>MTJamil.io</span>
      </Link>
      <div className={styles.links}>
        {user ? (
          <>
            <div className={styles.userInfo}>
              <FaUser className={styles.userIcon} />
              <span className={styles.role}>
                {isTeacher ? 'Teacher' : user?.email}
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
          </>
        ) : (
          <div className={styles.authSection}>
            <button 
              className={styles.loginButton} 
              onClick={() => setShowLoginForm(!showLoginForm)}
            >
              <FaUser className={styles.loginIcon} />
              Login
            </button>
            {showLoginForm && (
              <div className={styles.loginDropdown}>
                <form onSubmit={handleLogin} className={styles.loginForm}>
                  {error && (
                    <div className={styles.error}>{error}</div>
                  )}
                  <div className={styles.inputGroup}>
                    <label htmlFor="email">
                      <FaEnvelope className={styles.inputIcon} />
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {!isResetMode && (
                    <div className={styles.inputGroup}>
                      <label htmlFor="password">
                        <FaLock className={styles.inputIcon} />
                        Password
                      </label>
                      <input
                        id="password"
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
          </div>
        )}
      </div>
    </nav>
  );
} 