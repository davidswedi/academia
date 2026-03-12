export interface Enrollment<T> {
  id: string;
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth?: string;
  nationality?: string;

  // Education Background
  educationLevel: string;
  institution?: string;
  field?: string;

  // Course Selection
  selectedCourses: string[]; // Array of course IDs
  selectedModule?: string; // Selected training module id
  startDate?: string;
  preferredSchedule: string; // 'morning' | 'afternoon' | 'evening' | 'weekend' | 'flexible'

  // Professional Background
  currentJobTitle?: string;
  experience?: number; // years
  industry?: string;

  // Motivation & Goals
  motivation: string;
  careerGoals?: string;

  // Technical Skills
  techExperience: string; // 'beginner' | 'intermediate' | 'advanced'

  // Additional Info
  howYouHeardAboutUs?: string;
  agreeToTerms: boolean;
  agreeToMarketing?: boolean;
  notes?: string;

  // System fields
  status: string; // 'pending' | 'approved' | 'rejected' | 'enrolled'
  submittedAt: T;
  approvedAt?: T;
  createdAt: T;
  updatedAt?: T;
}
