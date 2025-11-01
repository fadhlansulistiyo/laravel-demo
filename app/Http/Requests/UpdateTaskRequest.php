<?php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Update Task Request
 *
 * Validates data for updating an existing task.
 */
class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_id' => ['sometimes', 'required', 'integer', 'exists:projects,id'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'priority' => ['sometimes', 'required', 'string', Rule::in(TaskPriority::values())],
            'status' => ['sometimes', 'required', 'string', Rule::in(TaskStatus::values())],
            'due_date' => ['nullable', 'date'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'project_id' => 'project',
            'assigned_to' => 'assignee',
            'title' => 'task title',
            'description' => 'task description',
            'priority' => 'priority level',
            'status' => 'task status',
            'due_date' => 'due date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'project_id.required' => 'Please select a project for this task.',
            'project_id.exists' => 'The selected project does not exist.',
            'assigned_to.exists' => 'The selected user does not exist.',
            'title.required' => 'The task title is required.',
            'title.max' => 'The task title cannot exceed 255 characters.',
            'priority.in' => 'The selected priority is invalid.',
            'status.in' => 'The selected status is invalid.',
        ];
    }
}
