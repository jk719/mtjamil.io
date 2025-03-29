import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/Navbar.module.css';
import { FaGraduationCap, FaRightFromBracket, FaUser } from 'react-icons/fa6';

export default function Navbar() {
  const { user, isTeacher } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link href={user ? "/profile" : "/login"} className={styles.logo}>
        <FaGraduationCap className={styles.logoIcon} />
        <span>MTJamil.io</span>
      </Link>
      <div className={styles.links}>
        {user ? (
          <>
            <div className={styles.userInfo}>
              <FaUser className={styles.userIcon} />
              <span className={styles.role}>
                {isTeacher ? 'Teacher' : 'Student'}
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
          <Link href="/login" className={styles.link}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
} 