import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/task";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: "bg-muted",
  medium: "bg-warning",
  high: "bg-info",
  urgent: "bg-destructive",
};

const priorityCardColors = {
  low: "bg-gradient-card border-muted/30",
  medium: "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/30",
  high: "bg-gradient-to-br from-info/10 to-info/5 border-info/30",
  urgent: "bg-gradient-to-br from-destructive/15 to-destructive/5 border-destructive/40",
};

const categoryColors = {
  work: "bg-primary",
  personal: "bg-accent",
  health: "bg-success",
  learning: "bg-info",
  other: "bg-muted",
};

export const TaskCard = ({ task, onUpdate, onDelete, onEdit }: TaskCardProps) => {
  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed';

  const handleStatusChange = (checked: boolean) => {
    onUpdate(task.id, { 
      status: checked ? 'completed' : 'pending',
      completedAt: checked ? new Date() : undefined,
    });
  };

  return (
    <Card className={`${priorityCardColors[task.priority]} hover:border-primary/20 transition-all duration-300 ${
      isOverdue ? 'border-destructive/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={task.status === 'completed'}
              onCheckedChange={handleStatusChange}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-card-foreground ${
                task.status === 'completed' ? 'line-through opacity-60' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={categoryColors[task.category]}>
            {task.category}
          </Badge>
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <div className={`flex items-center space-x-1 text-xs ${
              isOverdue ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {isOverdue ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
              <span>
                {format(task.dueDate, 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};