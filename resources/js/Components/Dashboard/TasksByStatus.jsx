import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

/**
 * TasksByStatus Component
 *
 * Displays a breakdown of tasks by status with progress bars.
 * Shows the count and percentage for each task status.
 *
 * @param {Object} stats - Task statistics object
 * @param {number} stats.total - Total number of tasks
 * @param {number} stats.pending - Number of pending tasks
 * @param {number} stats.in_progress - Number of in-progress tasks
 * @param {number} stats.completed - Number of completed tasks
 * @param {number} stats.cancelled - Number of cancelled tasks
 */
export default function TasksByStatus({ stats }) {
  const total = stats?.total || 0;

  const statusData = [
    {
      label: 'Pending',
      count: stats?.pending || 0,
      color: 'bg-yellow-500',
      badgeVariant: 'secondary',
    },
    {
      label: 'In Progress',
      count: stats?.in_progress || 0,
      color: 'bg-blue-500',
      badgeVariant: 'default',
    },
    {
      label: 'Completed',
      count: stats?.completed || 0,
      color: 'bg-green-500',
      badgeVariant: 'default',
    },
    {
      label: 'Cancelled',
      count: stats?.cancelled || 0,
      color: 'bg-red-500',
      badgeVariant: 'destructive',
    },
  ];

  const calculatePercentage = (count) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Status</CardTitle>
        <CardDescription>
          Breakdown of {total} total task{total !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {total === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No tasks yet. Create your first task to get started!
          </p>
        ) : (
          statusData.map((status) => {
            const percentage = calculatePercentage(status.count);
            return (
              <div key={status.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${status.color}`} />
                    <span className="text-sm font-medium">{status.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{status.count}</span>
                    <Badge variant={status.badgeVariant} className="text-xs">
                      {percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
