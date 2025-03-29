import { useEffect, useState } from "react";
import { db, collection, getDocs } from "@/lib/firebase";
import type { FeedbackDocument } from '@/types/feedback';
import Layout from "@/components/Layout";
import styles from "@/styles/Dashboard.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import LoadingSpinner from '@/components/LoadingSpinner';

interface FeedbackResponse extends FeedbackDocument {
  id: string;
}

export default function Dashboard() {
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { user, isTeacher, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to be ready
    if (authLoading) return;

    // Handle unauthorized access
    if (!user || !isTeacher) {
      // Use router.replace to avoid adding to history
      router.replace('/');
      return;
    }

    let mounted = true;

    async function fetchResponses() {
      try {
        const querySnapshot = await getDocs(collection(db, "feedback"));
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            studentEmail: docData.studentEmail || 'No Email Provided'
          };
        }) as FeedbackResponse[];
        
        if (mounted) {
          setResponses(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to fetch responses");
          setLoading(false);
        }
      }
    }

    fetchResponses();

    return () => {
      mounted = false;
    };
  }, [user, isTeacher, authLoading, router]);

  const filteredResponses = responses
    .filter(resp => {
      const searchTerm = filter.toLowerCase();
      return (
        resp.studentEmail.toLowerCase().includes(searchTerm) ||
        resp.response.toLowerCase().includes(searchTerm) ||
        resp.question.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const timeA = a.timestamp.toDate().getTime();
      const timeB = b.timestamp.toDate().getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

  // Show loading state while auth is being checked
  if (authLoading || loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  // Don't render anything if not authorized
  if (!user || !isTeacher) {
    return null;
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <p className={styles.error}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Teacher Dashboard</h1>
        
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search by email or response"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterInput}
          />
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className={styles.sortButton}
          >
            Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {filteredResponses.length === 0 ? (
          <p>No responses found.</p>
        ) : (
          <ul className={styles.responseList}>
            {filteredResponses.map((resp) => (
              <li key={resp.id} className={styles.responseItem}>
                <strong>Student Email:</strong> {resp.studentEmail} <br />
                <strong>Question:</strong> {resp.question} <br />
                <strong>Response:</strong> {resp.response} <br />
                <strong>Time:</strong>{" "}
                {resp.timestamp.toDate().toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
} 