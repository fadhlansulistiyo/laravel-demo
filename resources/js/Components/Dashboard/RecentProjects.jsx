import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';

/**
 * RecentProjects Component
 *
 * Displays a list of recent projects with their status and progress.
 *
 * @param {Array} projects - Array of project objects
 */
export default function RecentProjects({ projects = [] }) {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      archived: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest project updates</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={route('projects.index')}>
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">No projects yet. Create your first project!</p>
            <Button asChild>
              <Link href={route('projects.create')}>Create Project</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link key={project.id} href={route('projects.show', project.id)} className="group block">
                <div className="rounded-lg border p-4 transition-shadow hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold transition-colors group-hover:text-primary">{project.name}</h4>
                      {project.description && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{project.description}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      <div className={`mr-1.5 h-2 w-2 rounded-full ${getStatusColor(project.status.value)}`} />
                      {project.status.label}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>

                  {/* Task Count and Date */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {project.tasks_count || 0} task{project.tasks_count !== 1 ? 's' : ''}
                    </span>
                    {project.end_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due {formatDate(project.end_date)}</span>
                      </div>
                    )}
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
