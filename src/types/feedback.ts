import { Timestamp } from 'firebase/firestore';

export interface FeedbackDocument {
  studentId: string;
  studentEmail: string;
  question: string;
  response: string;
  timestamp: Timestamp;
} 