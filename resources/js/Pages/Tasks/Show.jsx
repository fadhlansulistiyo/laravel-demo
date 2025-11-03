import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import TaskStatusBadge from "@/Components/Tasks/TaskStatusBadge";
import {
    Calendar,
    Pencil,
    Trash2,
    User,
    FolderKanban,
    AlertCircle,
    Clock,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Task Show Page
 *
 * Displays detailed information about a task.
 */
export default function Show({ task }) {
    const { toast } = useToast();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Handle nested resource wrapping
    // Laravel API Resources wrap nested resources in a 'data' property
    const project = task.project?.data || task.project;
    const assignedUser = task.assigned_user?.data || task.assigned_user;

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
            medium: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950',
            high: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950'
        };
        return colors[priority] || '';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleDelete = () => {
        router.delete(route('tasks.destroy', task.id), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Task deleted successfully.",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to delete task.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {task.title}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('tasks.edit', task.id)}>
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
            <Head title={task.title} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    {/* Task Details */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl mb-3">{task.title}</CardTitle>
                                    <div className="flex flex-wrap gap-2">
                                        <TaskStatusBadge status={task.status} />
                                        <Badge className={getPriorityColor(task.priority.value)}>
                                            {task.priority.label} Priority
                                        </Badge>
                                        {task.is_overdue && (
                                            <Badge variant="destructive">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                Overdue
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {task.description && (
                                <CardDescription className="mt-4 text-base whitespace-pre-wrap">
                                    {task.description}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Task Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Project */}
                                {project && (
                                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                                        <FolderKanban className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium mb-1">Project</p>
                                            <Link
                                                href={route('projects.show', project.id)}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                {project.name}
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Assigned User */}
                                <div className="flex items-start gap-3 p-4 border rounded-lg">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium mb-1">Assigned To</p>
                                        {assignedUser ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(assignedUser.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{assignedUser.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">Unassigned</span>
                                        )}
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className="flex items-start gap-3 p-4 border rounded-lg">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium mb-1">Due Date</p>
                                        <p className={task.is_overdue ? 'text-destructive font-medium' : ''}>
                                            {formatDate(task.due_date)}
                                        </p>
                                        {task.days_until_due !== null && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {task.days_until_due < 0 ? (
                                                    <span className="text-destructive">
                                                        {Math.abs(task.days_until_due)} day{Math.abs(task.days_until_due) !== 1 ? 's' : ''} overdue
                                                    </span>
                                                ) : (
                                                    <>
                                                        {task.days_until_due} day{task.days_until_due !== 1 ? 's' : ''} remaining
                                                    </>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Completed At */}
                                {task.completed_at && (
                                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium mb-1">Completed At</p>
                                            <p>{formatDateTime(task.completed_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Timestamps */}
                            <div className="pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                        <span className="font-medium">Created:</span> {formatDateTime(task.created_at)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span> {formatDateTime(task.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the task "{task.title}".
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete Task
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
