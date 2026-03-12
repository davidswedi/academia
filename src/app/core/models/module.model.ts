export interface CourseSection {
  id?: string; // Identifiant de la section
  title: string; // Titre de la section
  description?: string; // Description de la section          // Éléments/Leçons de la section
}

export interface TrainingModule<T> {
  id: string;
  title: string;
  description: string;
  duration: number;
  tarrif: number;
  level: string;
  objectives: string[];
  content: CourseSection[];
  requirements: string[];
  createdAt?: T;
  updatedAt?: T;
}
