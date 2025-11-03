import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * TaskForm Component
 *
 * Form for creating or editing a task.
 *
 * @param {Object} task - Existing task object for editing (optional)
 * @param {Array} projects - Available projects
 * @param {Array} users - Available users for assignment
 * @param {Array} priorities - Available task priorities
 * @param {Array} statuses - Available task statuses
 */
export default function TaskForm({
    task = null,
    projects = [],
    users = [],
    priorities = [],
    statuses = []
}) {
    const isEditing = !!task;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        project_id: task?.project_id || '',
        assigned_to: task?.assigned_to || '',
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority?.value || 'medium',
        status: task?.status?.value || 'pending',
        due_date: task?.due_date || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                if (!isEditing) {
                    reset();
                }
            },
            transform: (data) => ({
                ...data,
                assigned_to: data.assigned_to || null,
                due_date: data.due_date || null,
                description: data.description || null,
            }),
        };

        if (isEditing) {
            put(route('tasks.update', task.id), options);
        } else {
            post(route('tasks.store'), options);
        }
    };

    // Default priorities if not provided
    const defaultPriorities = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    // Default statuses if not provided
    const defaultStatuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const priorityOptions = priorities.length > 0 ? priorities : defaultPriorities;
    const statusOptions = statuses.length > 0 ? statuses : defaultStatuses;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</CardTitle>
                <CardDescription>
                    {isEditing
                        ? 'Update your task details below.'
                        : 'Fill in the details to create a new task.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="project_id">
                            Project <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={data.project_id ? data.project_id.toString() : undefined}
                            onValueChange={(value) => setData('project_id', parseInt(value))}
                        >
                            <SelectTrigger className={errors.project_id ? 'border-destructive' : ''}>
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id.toString()}>
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.project_id && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.project_id}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Task Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Task Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Enter task title"
                            className={errors.title ? 'border-destructive' : ''}
                            required
                        />
                        {errors.title && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.title}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Enter task description (optional)"
                            rows={4}
                            className={errors.description ? 'border-destructive' : ''}
                        />
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Priority and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">
                                Priority <span className="text-destructive">*</span>
                            </Label>
                            <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                <SelectTrigger className={errors.priority ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((priority) => (
                                        <SelectItem key={priority.value} value={priority.value}>
                                            {priority.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.priority}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Status <span className="text-destructive">*</span>
                            </Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.status}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Assigned User and Due Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Assigned User */}
                        <div className="space-y-2">
                            <Label htmlFor="assigned_to">Assign To</Label>
                            <Select
                                value={data.assigned_to ? data.assigned_to.toString() : 'unassigned'}
                                onValueChange={(value) => setData('assigned_to', value === 'unassigned' ? '' : parseInt(value))}
                            >
                                <SelectTrigger className={errors.assigned_to ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select a user (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.assigned_to && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.assigned_to}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className={errors.due_date ? 'border-destructive' : ''}
                            />
                            {errors.due_date && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.due_date}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
