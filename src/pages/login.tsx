import { useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Layout from '@/components/Layout';
import styles from '@/styles/Login.module.css';
import { FaEnvelope, FaLock, FaArrowRight, FaQuestion, FaGraduationCap } from 'react-icons/fa6';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const auth = getAuth();
      if (isResetMode) {
        await sendPasswordResetEmail(auth, email);
        setIsResetMode(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/profile');
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
                ? 'Enter your email to reset your password'
                : 'Sign in to continue your learning journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorContainer}>
                <span className={styles.error}>{error}</span>
              </div>
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
      </div>
    </Layout>
  );
} 