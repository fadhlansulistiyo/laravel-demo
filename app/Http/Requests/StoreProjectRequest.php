<?php

namespace App\Http\Requests;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Store Project Request
 *
 * Validates data for creating a new project.
 * Similar to Zod schemas in Next.js but integrated with Laravel.
 */
class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Authorization is handled by policies, so return true here.
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'string', Rule::in(ProjectStatus::values())],
            'start_date' => ['nullable', 'date', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * Makes error messages more user-friendly.
     */
    public function attributes(): array
    {
        return [
            'name' => 'project name',
            'description' => 'project description',
            'status' => 'project status',
            'start_date' => 'start date',
            'end_date' => 'end date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The project name is required.',
            'name.max' => 'The project name cannot exceed 255 characters.',
            'status.in' => 'The selected status is invalid.',
            'start_date.after_or_equal' => 'The start date must be today or later.',
            'end_date.after' => 'The end date must be after the start date.',
        ];
    }
}
