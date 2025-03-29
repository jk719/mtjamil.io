import { useRouter } from 'next/router';
import Navbar from './Navbar';
import styles from '@/styles/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={`${styles.main} ${isLoginPage ? styles.loginMain : ''}`}>
        <div className={styles.section}>
          <div className={styles.sectionContent}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 