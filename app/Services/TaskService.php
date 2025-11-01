<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Task Service
 *
 * Handles business logic for task management.
 * Separates business logic from controllers for better organization and testability.
 */
class TaskService
{
    /**
     * Get paginated tasks for a user
     *
     * @param User $user
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getUserTasks(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Task::whereHas('project', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['project', 'assignedUser'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get tasks assigned to a specific user
     *
     * @param User $user
     * @return Collection
     */
    public function getAssignedTasks(User $user): Collection
    {
        return Task::where('assigned_to', $user->id)
            ->with(['project', 'assignedUser'])
            ->latest()
            ->get();
    }

    /**
     * Get tasks for a specific project
     *
     * @param Project $project
     * @return Collection
     */
    public function getProjectTasks(Project $project): Collection
    {
        return Task::where('project_id', $project->id)
            ->with('assignedUser')
            ->latest()
            ->get();
    }

    /**
     * Create a new task
     *
     * @param array $data
     * @return Task
     */
    public function createTask(array $data): Task
    {
        $task = Task::create($data);

        return $task->load(['project', 'assignedUser']);
    }

    /**
     * Update an existing task
     *
     * @param Task $task
     * @param array $data
     * @return Task
     */
    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);

        return $task->fresh(['project', 'assignedUser']);
    }

    /**
     * Delete a task
     *
     * @param Task $task
     * @return bool
     */
    public function deleteTask(Task $task): bool
    {
        return $task->delete();
    }

    /**
     * Assign a task to a user
     *
     * @param Task $task
     * @param User|null $user
     * @return Task
     */
    public function assignTask(Task $task, ?User $user): Task
    {
        $task->update([
            'assigned_to' => $user?->id,
        ]);

        return $task->fresh(['project', 'assignedUser']);
    }

    /**
     * Update task status
     *
     * @param Task $task
     * @param TaskStatus $status
     * @return Task
     */
    public function updateTaskStatus(Task $task, TaskStatus $status): Task
    {
        $task->update([
            'status' => $status,
        ]);

        return $task->fresh(['project', 'assignedUser']);
    }

    /**
     * Mark task as completed
     *
     * @param Task $task
     * @return Task
     */
    public function completeTask(Task $task): Task
    {
        $task->update([
            'status' => TaskStatus::COMPLETED,
            'completed_at' => now(),
        ]);

        return $task->fresh(['project', 'assignedUser']);
    }

    /**
     * Get overdue tasks for a user's projects
     *
     * @param User $user
     * @return Collection
     */
    public function getOverdueTasks(User $user): Collection
    {
        return Task::whereHas('project', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->overdue()
            ->with(['project', 'assignedUser'])
            ->orderBy('due_date')
            ->get();
    }

    /**
     * Get tasks due soon for a user's projects
     *
     * @param User $user
     * @param int $days
     * @return Collection
     */
    public function getTasksDueSoon(User $user, int $days = 7): Collection
    {
        return Task::whereHas('project', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->dueSoon()
            ->with(['project', 'assignedUser'])
            ->orderBy('due_date')
            ->get();
    }

    /**
     * Get high priority tasks for a user's projects
     *
     * @param User $user
     * @return Collection
     */
    public function getHighPriorityTasks(User $user): Collection
    {
        return Task::whereHas('project', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->highPriority()
            ->whereNotIn('status', [TaskStatus::COMPLETED, TaskStatus::CANCELLED])
            ->with(['project', 'assignedUser'])
            ->latest()
            ->get();
    }

    /**
     * Get task statistics for a user
     *
     * @param User $user
     * @return array
     */
    public function getUserTaskStats(User $user): array
    {
        $baseQuery = Task::whereHas('project', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        });

        return [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->pending()->count(),
            'in_progress' => (clone $baseQuery)->inProgress()->count(),
            'completed' => (clone $baseQuery)->completed()->count(),
            'overdue' => (clone $baseQuery)->overdue()->count(),
            'due_soon' => (clone $baseQuery)->dueSoon()->count(),
            'high_priority' => (clone $baseQuery)->highPriority()->count(),
        ];
    }

    /**
     * Get tasks assigned to user with statistics
     *
     * @param User $user
     * @return array
     */
    public function getAssignedTaskStats(User $user): array
    {
        $baseQuery = Task::where('assigned_to', $user->id);

        return [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->pending()->count(),
            'in_progress' => (clone $baseQuery)->inProgress()->count(),
            'completed' => (clone $baseQuery)->completed()->count(),
            'overdue' => (clone $baseQuery)->overdue()->count(),
        ];
    }

    /**
     * Search tasks by title or description
     *
     * @param User $user
     * @param string $query
     * @return Collection
     */
    public function searchTasks(User $user, string $query): Collection
    {
        return Task::whereHas('project', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->with(['project', 'assignedUser'])
            ->latest()
            ->get();
    }
}
