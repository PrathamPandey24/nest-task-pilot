import { useState, useEffect } from 'react';
import { Task, TaskAnalytics, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { saveTasks, loadTasks } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task Created",
      description: `"${newTask.title}" has been added to your tasks.`,
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates };
        if (updates.status === 'completed' && task.status !== 'completed') {
          updatedTask.completedAt = new Date();
          toast({
            title: "Task Completed!",
            description: `Great job completing "${task.title}"!`,
          });
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    if (task) {
      toast({
        title: "Task Deleted",
        description: `"${task.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };

  const getAnalytics = (): TaskAnalytics => {
    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const overdueTasksCount = tasks.filter(t => 
      t.dueDate && t.dueDate < now && t.status !== 'completed'
    ).length;

    const categoryDistribution = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<TaskCategory, number>);

    const priorityDistribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TaskPriority, number>);

    // Weekly progress for last 7 days
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = tasks.filter(t => 
        t.completedAt?.toISOString().split('T')[0] === dateStr
      ).length;
      
      const created = tasks.filter(t => 
        t.createdAt.toISOString().split('T')[0] === dateStr
      ).length;

      return { date: dateStr, completed, created };
    });

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasksCount,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      categoryDistribution,
      priorityDistribution,
      weeklyProgress,
    };
  };

  const overdueTasks = tasks.filter(task => 
    task.dueDate && 
    task.dueDate < new Date() && 
    task.status !== 'completed'
  );

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getAnalytics,
    overdueTasks,
  };
};