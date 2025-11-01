<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Task Resource
 *
 * Transforms Task model into JSON for API responses and Inertia props.
 */
class TaskResource extends JsonResource
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
            'project_id' => $this->project_id,
            'assigned_to' => $this->assigned_to,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => [
                'value' => $this->priority->value,
                'label' => $this->priority->label(),
                'color' => $this->priority->color(),
                'weight' => $this->priority->weight(),
            ],
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
                'color' => $this->status->color(),
                'is_final' => $this->status->isFinal(),
            ],
            'due_date' => $this->due_date?->toDateString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Computed properties
            'is_overdue' => $this->is_overdue,
            'days_until_due' => $this->days_until_due,

            // Conditional relationships
            'project' => new ProjectResource($this->whenLoaded('project')),
            'assigned_user' => new UserResource($this->whenLoaded('assignedUser')),
        ];
    }
}
