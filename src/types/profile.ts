export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  grade: string;
  school: string;
  mathCourse: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProfileFormData = Omit<UserProfile, 'userId' | 'email' | 'createdAt' | 'updatedAt'>;

export const GRADE_OPTIONS = [
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'College',
  'Other'
];

export const MATH_COURSE_OPTIONS = [
  'Pre-Algebra',
  'Algebra 1',
  'Geometry',
  'Algebra 2',
  'Pre-Calculus',
  'Calculus AB',
  'Calculus BC',
  'Statistics',
  'Other'
]; 