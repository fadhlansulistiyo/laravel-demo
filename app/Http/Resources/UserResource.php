<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * User Resource
 *
 * Transforms User model into JSON for API responses and Inertia props.
 * Similar to serializers or DTOs in other frameworks.
 *
 * Resources control what data is exposed to the frontend,
 * hiding sensitive information like passwords.
 */
class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'role' => [
                'value' => $this->role->value,
                'label' => $this->role->label(),
            ],
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Conditional relationships (only included if loaded)
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'assigned_tasks' => TaskResource::collection($this->whenLoaded('assignedTasks')),
        ];
    }
}
