<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

/**
 * Task Policy
 *
 * Handles authorization for task-related actions.
 * Tasks belong to projects, so authorization checks the project ownership.
 */
class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     *
     * All authenticated users can view tasks from their projects.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * Users can view tasks from their own projects.
     * Admins can view all tasks.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->id === $task->project->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     *
     * All authenticated users can create tasks (in their own projects).
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * Users can update tasks in their own projects.
     * Assigned users can update task status.
     * Admins can update any task.
     */
    public function update(User $user, Task $task): bool
    {
        // Project owner can update
        if ($user->id === $task->project->user_id) {
            return true;
        }

        // Assigned user can update (limited fields, handled in controller)
        if ($user->id === $task->assigned_to) {
            return true;
        }

        // Admin can update any task
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     *
     * Only project owners and admins can delete tasks.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->id === $task->project->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     *
     * Only project owners and admins can restore tasks.
     */
    public function restore(User $user, Task $task): bool
    {
        return $user->id === $task->project->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * Only admins can permanently delete tasks.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return $user->isAdmin();
    }
}
