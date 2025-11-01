<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Project Controller
 *
 * Handles CRUD operations for projects.
 * Uses dependency injection for services and authorization via policies.
 *
 * @method void authorizeResource(string $model, string $parameter = null, array $options = [], \Illuminate\Http\Request $request = null)
 */
class ProjectController extends Controller
{
    public function __construct(
        private ProjectService $projectService
    ) {
        // Apply authorization middleware via Laravel's AuthorizesRequests trait
        $this->authorizeResource(Project::class, 'project');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(\Illuminate\Http\Request $request): Response
    {
        $user = $request->user();
        $projects = $this->projectService->getUserProjects($user);

        return Inertia::render('Projects/Index', [
            'projects' => ProjectResource::collection($projects),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Projects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $project = $this->projectService->createProject($user, $request->validated());

        return redirect()
            ->route('projects.show', $project)
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): Response
    {
        $projectDetails = $this->projectService->getProjectDetails($project);
        $projectStats = $this->projectService->getProjectStats($project);

        return Inertia::render('Projects/Show', [
            'project' => new ProjectResource($projectDetails),
            'stats' => $projectStats,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): Response
    {
        return Inertia::render('Projects/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->projectService->updateProject($project, $request->validated());

        return redirect()
            ->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->projectService->deleteProject($project);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
