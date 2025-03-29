import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import styles from '@/styles/Login.module.css';
import { 
  FaGraduationCap, 
  FaEnvelope, 
  FaLock, 
  FaArrowRight,
  FaExclamation,
  FaQuestion
} from 'react-icons/fa6';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const auth = getAuth();
      if (isResetMode) {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset email sent! Please check your inbox.');
        setIsResetMode(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('auth/wrong-password')) {
          setError('Incorrect password');
        } else if (err.message.includes('auth/user-not-found')) {
          setError('Email not found');
        } else if (err.message.includes('auth/invalid-email')) {
          setError('Invalid email address');
        } else {
          setError('Failed to process request. Please try again.');
        }
      }
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <FaGraduationCap className={styles.logo} />
            <h1>{isResetMode ? 'Reset Password' : 'Welcome Back'}</h1>
            <p className={styles.subtitle}>
              {isResetMode 
                ? 'Enter your email to receive a password reset link'
                : 'Sign in to continue your learning journey'}
            </p>
          </div>

          {error && (
            <div className={styles.errorContainer}>
              <FaExclamation className={styles.errorIcon} />
              <p className={styles.error}>{error}</p>
            </div>
          )}

          {success && (
            <div className={styles.successContainer}>
              <FaExclamation className={styles.successIcon} />
              <p className={styles.success}>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
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
              {isResetMode ? 'Send Reset Link' : 'Sign In'}
              <FaArrowRight className={styles.buttonIcon} />
            </button>

            {!isResetMode && (
              <button
                type="button"
                onClick={() => setIsResetMode(true)}
                className={styles.forgotPassword}
              >
                <FaQuestion className={styles.forgotIcon} />
                Forgot Password?
              </button>
            )}

            {isResetMode && (
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className={styles.backToLogin}
              >
                Back to Login
              </button>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
} 