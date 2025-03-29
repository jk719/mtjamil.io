import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { feedbackCollection, addDoc, serverTimestamp } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from '@/styles/Feedback.module.css';

export default function Feedback() {
  const router = useRouter();
  const { user, loading: authLoading, isTeacher } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = async (response: 'Yes' | 'No') => {
    if (!user || !user.email) {
      setError('You must be signed in with an email to submit feedback');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const feedbackData = {
        studentId: user.uid,
        studentEmail: user.email || 'No Email',
        question: "Do you understand linear equations?",
        response,
        timestamp: serverTimestamp(),
      };

      console.log('Submitting feedback:', feedbackData);
      await addDoc(feedbackCollection, feedbackData);
      console.log('Feedback submitted successfully');
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'permission-denied':
            setError('You do not have permission to submit feedback. Please make sure you are signed in.');
            break;
          case 'unavailable':
            setError('The service is currently unavailable. Please try again later.');
            break;
          default:
            setError('An error occurred while submitting your feedback. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!user || !user.email) {
    return (
      <Layout>
        <div className={styles.container}>
          <h1>Please Sign In</h1>
          <p>You need to be signed in with an email address to submit feedback.</p>
          <button 
            className={styles.button}
            onClick={() => router.push('/login')}
          >
            Sign In
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Student Feedback</h1>
        {submitted ? (
          <div className={styles.success}>
            <h2>Thank you for your feedback!</h2>
            <p>Your response has been recorded.</p>
            {isTeacher ? (
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.button}
                  onClick={() => router.push('/dashboard')}
                >
                  View Dashboard
                </button>
                <button 
                  className={styles.button}
                  onClick={() => router.push('/')}
                >
                  Return Home
                </button>
              </div>
            ) : (
              <button 
                className={styles.button}
                onClick={() => router.push('/')}
              >
                Return Home
              </button>
            )}
          </div>
        ) : (
          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <p className={styles.question}>Do you understand linear equations?</p>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.button} ${styles.yesButton}`}
                  onClick={() => handleFeedback('Yes')}
                  disabled={isSubmitting}
                >
                  Yes
                </button>
                <button
                  className={`${styles.button} ${styles.noButton}`}
                  onClick={() => handleFeedback('No')}
                  disabled={isSubmitting}
                >
                  No
                </button>
              </div>
            </div>
            {error && (
              <div className={styles.errorContainer}>
                <p>{error}</p>
              </div>
            )}
            {isSubmitting && (
              <div className={styles.loadingContainer}>
                <LoadingSpinner />
              </div>
            )}
            <p className={styles.userEmail}>
              Signed in as: {user.email}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 