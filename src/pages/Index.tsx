import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks } from "@/hooks/useTasks";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Dashboard } from "@/components/Dashboard";
import { Task } from "@/types/task";
import { Plus, BarChart3, CheckSquare, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, getAnalytics, overdueTasks } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const analytics = getAnalytics();

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(undefined);
    } else {
      addTask(taskData);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleFormClose = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TaskNest
            </h1>
            <p className="text-muted-foreground mt-2">
              Smart Productivity Tracker
            </p>
            {overdueTasks.length > 0 && (
              <div className="flex items-center space-x-2 mt-3">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <Badge variant="destructive" className="text-xs">
                  {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-primary hover:shadow-elegant transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-400 bg-background/50">
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <TaskList
              tasks={tasks}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onEdit={handleEditTask}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard analytics={analytics} />
          </TabsContent>
        </Tabs>

        {/* Task Form Dialog */}
        <TaskForm
          open={showTaskForm}
          onOpenChange={handleFormClose}
          task={editingTask}
          onSubmit={handleTaskSubmit}
        />
      </div>
    </div>
  );
};

export default Index;
