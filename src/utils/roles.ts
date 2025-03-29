import { User } from 'firebase/auth';

// Teacher emails - in production, this should come from a secure source
const TEACHER_EMAILS = ['mathtutorjamil@gmail.com'];

export function isTeacher(user: User | null): boolean {
  return user ? TEACHER_EMAILS.includes(user.email || '') : false;
}

export function isStudent(user: User | null): boolean {
  return user ? !TEACHER_EMAILS.includes(user.email || '') : false;
} 