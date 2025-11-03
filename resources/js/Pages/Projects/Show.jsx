import TaskList from '@/Components/Tasks/TaskList';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle2, Clock, ListTodo, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

/**
 * Project Show Page
 *
 * Displays detailed information about a project including its tasks.
 */
export default function Show({ project, stats }) {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Handle nested resource collection wrapping
  // Laravel API Resources wrap nested collections in a 'data' property
  const tasks = Array.isArray(project.tasks) ? project.tasks : (project.tasks?.data || []);

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      archived: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDeleteProject = () => {
    router.delete(route('projects.destroy', project.id), {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Project deleted successfully.',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to delete project.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      router.delete(route('tasks.destroy', taskToDelete.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Task deleted successfully.',
          });
          setTaskToDelete(null);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to delete task.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">{project.name}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('projects.edit', project.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      }
    >
      <Head title={project.name} />

      <div className="py-8">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{project.name}</CardTitle>
                  {project.description && (
                    <CardDescription className="mt-2 text-base">{project.description}</CardDescription>
                  )}
                </div>
                <Badge variant="secondary">
                  <div className={`mr-1.5 h-2 w-2 rounded-full ${getStatusColor(project.status.value)}`} />
                  {project.status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-2xl font-bold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <ListTodo className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Tasks</p>
                    <p className="text-2xl font-bold">{stats.total_tasks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm">{formatDate(project.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm">{formatDate(project.end_date)}</p>
                  </div>
                </div>
              </div>

              {/* Task Statistics */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-4 text-center">
                  <Clock className="mx-auto mb-2 h-5 w-5 text-yellow-600" />
                  <p className="text-2xl font-bold">{stats.pending_tasks}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <AlertCircle className="mx-auto mb-2 h-5 w-5 text-blue-600" />
                  <p className="text-2xl font-bold">{stats.in_progress_tasks}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold">{stats.completed_tasks}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <AlertCircle className="mx-auto mb-2 h-5 w-5 text-red-600" />
                  <p className="text-2xl font-bold">{stats.overdue_tasks}</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <Button asChild>
                <Link href={route('tasks.create', { project_id: project.id })}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Task
                </Link>
              </Button>
            </div>
            <TaskList tasks={tasks} onDelete={handleDeleteTask} showProject={false} />
          </div>
        </div>
      </div>

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{project.name}" and all its tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive hover:bg-destructive/90">
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{taskToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive hover:bg-destructive/90">
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
