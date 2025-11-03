import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, Calendar } from 'lucide-react';

/**
 * RecentTasks Component
 *
 * Displays a list of recent tasks with their details.
 *
 * @param {Array} tasks - Array of task objects
 */
export default function RecentTasks({ tasks = [] }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      in_progress: 'bg-blue-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
      medium: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950',
      high: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950',
    };
    return colors[priority] || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest task updates</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={route('tasks.index')}>
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">No tasks yet. Create your first task!</p>
            <Button asChild>
              <Link href={route('tasks.create')}>Create Task</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link key={task.id} href={route('tasks.show', task.id)} className="group block">
                <div className="rounded-lg border p-3 transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-3">
                    {/* Status Indicator */}
                    <div className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${getStatusColor(task.status.value)}`} />

                    {/* Task Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h4 className="line-clamp-1 font-medium transition-colors group-hover:text-primary">
                          {task.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={`flex-shrink-0 text-xs ${getPriorityColor(task.priority.value)}`}
                        >
                          {task.priority.label}
                        </Badge>
                      </div>

                      {/* Project Name */}
                      {task.project && <p className="mb-2 text-xs text-muted-foreground">{task.project.name}</p>}

                      {/* Footer: Status, Due Date, Assignee */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {task.status.label}
                          </Badge>
                          {task.is_overdue && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Overdue
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(task.due_date)}</span>
                            </div>
                          )}
                          {task.assigned_user && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(task.assigned_user.name)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
