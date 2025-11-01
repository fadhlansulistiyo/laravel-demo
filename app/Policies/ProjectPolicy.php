<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

/**
 * Project Policy
 *
 * Handles authorization for project-related actions.
 * Similar to middleware or authorization checks in Next.js API routes.
 *
 * Policies automatically map to controller methods:
 * - viewAny -> index
 * - view -> show
 * - create -> store
 * - update -> update
 * - delete -> destroy
 */
class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     *
     * All authenticated users can view their own projects.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * Users can only view their own projects.
     * Admins can view all projects.
     */
    public function view(User $user, Project $project): bool
    {
        return $user->id === $project->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     *
     * All authenticated users can create projects.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * Users can only update their own projects.
     * Admins can update any project.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     *
     * Users can only delete their own projects.
     * Admins can delete any project.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     *
     * Only the project owner or admin can restore.
     */
    public function restore(User $user, Project $project): bool
    {
        return $user->id === $project->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * Only admins can permanently delete projects.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        return $user->isAdmin();
    }
}
