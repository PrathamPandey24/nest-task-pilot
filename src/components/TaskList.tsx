import { useState } from "react";
import { Task, TaskCategory, TaskPriority, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskList = ({ tasks, onUpdate, onDelete, onEdit }: TaskListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterPriority('all');
    setFilterStatus('all');
  };

  const hasActiveFilters = searchTerm || filterCategory !== 'all' || 
                          filterPriority !== 'all' || filterStatus !== 'all';

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={filterCategory} onValueChange={(value: TaskCategory | 'all') => setFilterCategory(value)}>
            <SelectTrigger className="w-auto bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={(value: TaskPriority | 'all') => setFilterPriority(value)}>
            <SelectTrigger className="w-auto bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={(value: TaskStatus | 'all') => setFilterStatus(value)}>
            <SelectTrigger className="w-auto bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-destructive/10"
              onClick={clearFilters}
            >
              Clear Filters
            </Badge>
          )}
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {hasActiveFilters ? (
            <>
              <p>No tasks match your current filters.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria.</p>
            </>
          ) : (
            <>
              <p>No tasks yet.</p>
              <p className="text-sm mt-2">Create your first task to get started!</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};