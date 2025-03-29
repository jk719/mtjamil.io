import { useRouter } from 'next/router';
import Navbar from './Navbar';
import styles from '@/styles/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';
  const isHomePage = router.pathname === '/';

  return (
    <div className={styles.container}>
      <Navbar />
      {isHomePage && <div className={styles.progressBarSpacer} />}
      <main className={`${styles.main} ${isLoginPage ? styles.loginMain : ''} ${isHomePage ? styles.homeMain : ''}`}>
        <div className={styles.section}>
          <div className={styles.sectionContent}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 