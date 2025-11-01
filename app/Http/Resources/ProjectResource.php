<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Project Resource
 *
 * Transforms Project model into JSON for API responses and Inertia props.
 */
class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
                'color' => $this->status->color(),
            ],
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Computed properties
            'progress' => $this->when(
                $this->relationLoaded('tasks'),
                fn () => $this->progress
            ),

            // Conditional relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),

            // Counts (only if loaded via withCount)
            'tasks_count' => $this->when(
                isset($this->tasks_count),
                $this->tasks_count
            ),
            'completed_tasks_count' => $this->when(
                isset($this->completed_tasks_count),
                $this->completed_tasks_count
            ),
            'pending_tasks_count' => $this->when(
                isset($this->pending_tasks_count),
                $this->pending_tasks_count
            ),
            'in_progress_tasks_count' => $this->when(
                isset($this->in_progress_tasks_count),
                $this->in_progress_tasks_count
            ),
        ];
    }
}
