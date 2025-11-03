<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Services\TaskService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Task Controller
 *
 * Handles CRUD operations for tasks.
 *
 * @method void authorizeResource(string $model, string $parameter = null, array $options = [], \Illuminate\Http\Request $request = null)
 */
class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {
        // Apply authorization middleware via Laravel's AuthorizesRequests trait
        $this->authorizeResource(Task::class, 'task');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(\Illuminate\Http\Request $request): Response
    {
        $user = $request->user();
        $tasks = $this->taskService->getUserTasks($user);

        // Get user's projects for filtering
        // Note: Include 'status' to prevent null errors in ProjectResource
        $projects = Project::where('user_id', $user->id)
            ->select('id', 'name', 'status')
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => TaskResource::collection($tasks)->resolve(),
            'projects' => ProjectResource::collection($projects)->resolve(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(\Illuminate\Http\Request $request): Response
    {
        $user = $request->user();

        // Get user's projects
        $projects = Project::where('user_id', $user->id)
            ->select('id', 'name', 'status')
            ->active()
            ->get();

        // Get all users for task assignment
        $users = User::select('id', 'name', 'email')->get();

        return Inertia::render('Tasks/Create', [
            'projects' => ProjectResource::collection($projects)->resolve(),
            'users' => UserResource::collection($users)->resolve(),
            'priorities' => \App\Enums\TaskPriority::toArray(),
            'statuses' => \App\Enums\TaskStatus::toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $task = $this->taskService->createTask($request->validated());

        return redirect()
            ->route('projects.show', $task->project_id)
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task): Response
    {
        $task->load(['project', 'assignedUser']);

        return Inertia::render('Tasks/Show', [
            'task' => (new TaskResource($task))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task, \Illuminate\Http\Request $request): Response
    {
        $user = $request->user();

        // Get user's projects
        $projects = Project::where('user_id', $user->id)
            ->select('id', 'name', 'status')
            ->get();

        // Get all users for task assignment
        $users = User::select('id', 'name', 'email')->get();

        $task->load(['project', 'assignedUser']);

        return Inertia::render('Tasks/Edit', [
            'task' => (new TaskResource($task))->resolve(),
            'projects' => ProjectResource::collection($projects)->resolve(),
            'users' => UserResource::collection($users)->resolve(),
            'priorities' => \App\Enums\TaskPriority::toArray(),
            'statuses' => \App\Enums\TaskStatus::toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $this->taskService->updateTask($task, $request->validated());

        return redirect()
            ->route('projects.show', $task->project_id)
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $projectId = $task->project_id;
        $this->taskService->deleteTask($task);

        return redirect()
            ->route('projects.show', $projectId)
            ->with('success', 'Task deleted successfully.');
    }
}
