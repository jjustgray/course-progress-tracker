export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  description?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  lessons?: Lesson[]; // Populated locally or via API joins
}