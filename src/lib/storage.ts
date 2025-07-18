import { Task } from '@/types/task';

const STORAGE_KEY = 'tasknest_tasks';

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};