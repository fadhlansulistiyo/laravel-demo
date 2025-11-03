import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TaskList from "@/Components/Tasks/TaskList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

/**
 * Tasks Index Page
 *
 * Displays a list of all user's tasks with actions.
 */
export default function Index({ tasks }) {
    const { toast } = useToast();
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Handle paginated data structure
    // Laravel pagination returns: { data: [...], links: {...}, meta: {...} }
    const tasksList = Array.isArray(tasks) ? tasks : (tasks?.data || []);

    const handleDelete = (task) => {
        setTaskToDelete(task);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            router.delete(route('tasks.destroy', taskToDelete.id), {
                onSuccess: () => {
                    toast({
                        title: "Success",
                        description: "Task deleted successfully.",
                    });
                    setTaskToDelete(null);
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Failed to delete task.",
                        variant: "destructive",
                    });
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Tasks
                    </h2>
                    <Button asChild>
                        <Link href={route('tasks.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Task
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Tasks" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <TaskList tasks={tasksList} onDelete={handleDelete} />
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the task "{taskToDelete?.title}".
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
