import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc, profilesCollection } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { GRADE_OPTIONS, MATH_COURSE_OPTIONS, ProfileFormData } from '@/types/profile';
import styles from '@/styles/Profile.module.css';

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    grade: '',
    school: '',
    mathCourse: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const profileRef = doc(profilesCollection, user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setFormData({
            name: data.name,
            grade: data.grade,
            school: data.school,
            mathCourse: data.mathCourse
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      }
    }

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to update your profile');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const profileData = {
        userId: user.uid,
        email: user.email,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const profileRef = doc(profilesCollection, user.uid);
      await setDoc(profileRef, profileData, { merge: true });
      setSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'permission-denied':
            setError('You do not have permission to update your profile.');
            break;
          default:
            setError('An error occurred while updating your profile. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  if (!user) {
    return (
      <Layout>
        <div className={styles.container}>
          <h1>Please Sign In</h1>
          <p>You need to be signed in to view and edit your profile.</p>
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
        <h1>Student Profile</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="grade">Grade Level</label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select your grade</option>
              {GRADE_OPTIONS.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="school">School Name</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              placeholder="Enter your school name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mathCourse">Current Math Course</label>
            <select
              id="mathCourse"
              name="mathCourse"
              value={formData.mathCourse}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select your math course</option>
              {MATH_COURSE_OPTIONS.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.success}>
              Profile updated successfully!
            </div>
          )}

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 