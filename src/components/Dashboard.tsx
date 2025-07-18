import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskAnalytics } from "@/types/task";
import { CheckCircle, Clock, Target, TrendingUp } from "lucide-react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface DashboardProps {
  analytics: TaskAnalytics;
}

export const Dashboard = ({ analytics }: DashboardProps) => {
  const categoryChartData = {
    labels: Object.keys(analytics.categoryDistribution).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        data: Object.values(analytics.categoryDistribution),
        backgroundColor: [
          'hsl(230, 95%, 60%)',
          'hsl(280, 65%, 60%)',
          'hsl(142, 71%, 45%)',
          'hsl(199, 89%, 48%)',
          'hsl(240, 3.7%, 15.9%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const weeklyProgressData = {
    labels: analytics.weeklyProgress.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Completed',
        data: analytics.weeklyProgress.map(day => day.completed),
        borderColor: 'hsl(230, 95%, 60%)',
        backgroundColor: 'hsl(230, 95%, 60%, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Created',
        data: analytics.weeklyProgress.map(day => day.created),
        borderColor: 'hsl(280, 65%, 60%)',
        backgroundColor: 'hsl(280, 65%, 60%, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'hsl(0, 0%, 98%)',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(240, 5%, 64.9%)',
        },
        grid: {
          color: 'hsl(240, 3.7%, 15.9%)',
        },
      },
      y: {
        ticks: {
          color: 'hsl(240, 5%, 64.9%)',
        },
        grid: {
          color: 'hsl(240, 3.7%, 15.9%)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(0, 0%, 98%)',
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              All time tasks created
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks in progress
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overdueTasksCount}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              <Line data={weeklyProgressData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              {Object.keys(analytics.categoryDistribution).length > 0 ? (
                <Doughnut data={categoryChartData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No tasks to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};