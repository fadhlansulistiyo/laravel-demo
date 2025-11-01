<?php

namespace App\Services;

use App\Models\Project;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Project Service
 *
 * Handles business logic for project management.
 * This layer sits between controllers and models, similar to
 * service functions in Next.js API routes.
 *
 * Benefits:
 * - Keeps controllers thin
 * - Reusable business logic
 * - Easier to test
 * - Single responsibility principle
 */
class ProjectService
{
    /**
     * Get paginated projects for a user
     *
     * @param User $user
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getUserProjects(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Project::where('user_id', $user->id)
            ->with(['tasks' => function ($query) {
                $query->latest()->limit(5);
            }])
            ->withCount('tasks')
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get all active projects for a user
     *
     * @param User $user
     * @return Collection
     */
    public function getActiveProjects(User $user): Collection
    {
        return Project::where('user_id', $user->id)
            ->active()
            ->with('tasks')
            ->withCount('tasks')
            ->latest()
            ->get();
    }

    /**
     * Create a new project
     *
     * @param User $user
     * @param array $data
     * @return Project
     */
    public function createProject(User $user, array $data): Project
    {
        $project = new Project($data);
        $project->user_id = $user->id;
        $project->save();

        return $project->load('user');
    }

    /**
     * Update an existing project
     *
     * @param Project $project
     * @param array $data
     * @return Project
     */
    public function updateProject(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh(['user', 'tasks']);
    }

    /**
     * Delete a project and all its tasks
     *
     * @param Project $project
     * @return bool
     */
    public function deleteProject(Project $project): bool
    {
        // Tasks will be automatically deleted due to cascade on delete
        return $project->delete();
    }

    /**
     * Get project with full details including tasks and stats
     *
     * @param Project $project
     * @return Project
     */
    public function getProjectDetails(Project $project): Project
    {
        return $project->load([
            'user',
            'tasks' => function ($query) {
                $query->with('assignedUser')->latest();
            }
        ])->loadCount([
            'tasks',
            'tasks as completed_tasks_count' => function ($query) {
                $query->completed();
            },
            'tasks as pending_tasks_count' => function ($query) {
                $query->pending();
            },
            'tasks as in_progress_tasks_count' => function ($query) {
                $query->inProgress();
            }
        ]);
    }

    /**
     * Get project statistics
     *
     * @param Project $project
     * @return array
     */
    public function getProjectStats(Project $project): array
    {
        $totalTasks = $project->tasks()->count();
        $completedTasks = $project->tasks()->completed()->count();
        $pendingTasks = $project->tasks()->pending()->count();
        $inProgressTasks = $project->tasks()->inProgress()->count();
        $overdueTasks = $project->tasks()->overdue()->count();

        return [
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'pending_tasks' => $pendingTasks,
            'in_progress_tasks' => $inProgressTasks,
            'overdue_tasks' => $overdueTasks,
            'completion_rate' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 2) : 0,
        ];
    }

    /**
     * Search projects by name or description
     *
     * @param User $user
     * @param string $query
     * @return Collection
     */
    public function searchProjects(User $user, string $query): Collection
    {
        return Project::where('user_id', $user->id)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->with('tasks')
            ->withCount('tasks')
            ->latest()
            ->get();
    }

    /**
     * Archive a project
     *
     * @param Project $project
     * @return Project
     */
    public function archiveProject(Project $project): Project
    {
        $project->update([
            'status' => \App\Enums\ProjectStatus::ARCHIVED,
        ]);

        return $project->fresh();
    }

    /**
     * Mark project as completed
     *
     * @param Project $project
     * @return Project
     */
    public function completeProject(Project $project): Project
    {
        $project->update([
            'status' => \App\Enums\ProjectStatus::COMPLETED,
            'end_date' => $project->end_date ?? now(),
        ]);

        return $project->fresh();
    }
}
