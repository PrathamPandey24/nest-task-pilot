export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasksCount: number;
  completionRate: number;
  categoryDistribution: Record<TaskCategory, number>;
  priorityDistribution: Record<TaskPriority, number>;
  weeklyProgress: { date: string; completed: number; created: number }[];
}