# Laravel Dashboard Template - Development Progress

## Phase 1: Database & Models (Backend Foundation) ✅

**Status**: COMPLETED
**Date**: October 31, 2025

---

## Overview

Phase 1 focused on building the foundational database structure and ORM models for the Task Management Dashboard. This phase demonstrates Laravel's Eloquent ORM, migrations, factories, and seeding system.

---

## Created Files

### 1. Enums (Type-Safe Constants)

Enums in Laravel provide type safety similar to TypeScript enums or union types in Next.js.

#### `app/Enums/UserRole.php`
- **Purpose**: Define user roles in the system
- **Values**: `admin`, `user`
- **Key Methods**:
  - `label()`: Get human-readable label
  - `values()`: Get all role values as array
- **Learning Note**: PHP 8.1+ backed enums provide type safety and prevent invalid values

#### `app/Enums/ProjectStatus.php`
- **Purpose**: Define project lifecycle states
- **Values**: `active`, `completed`, `archived`
- **Key Methods**:
  - `label()`: Get human-readable label
  - `color()`: Get Tailwind color class for UI
  - `values()`: Get all status values
- **Learning Note**: Helper methods in enums make them more useful than simple constants

#### `app/Enums/TaskStatus.php`
- **Purpose**: Define task workflow states
- **Values**: `pending`, `in_progress`, `completed`, `cancelled`
- **Key Methods**:
  - `label()`: Get human-readable label
  - `color()`: Get Tailwind color class for UI
  - `isFinal()`: Check if status is terminal state
  - `values()`: Get all status values
- **Learning Note**: Business logic methods in enums help encapsulate domain knowledge

#### `app/Enums/TaskPriority.php`
- **Purpose**: Define task priority levels
- **Values**: `low`, `medium`, `high`
- **Key Methods**:
  - `label()`: Get human-readable label
  - `color()`: Get Tailwind color class for UI
  - `weight()`: Get numeric weight for sorting
  - `values()`: Get all priority values

---

### 2. Migrations (Database Schema)

Migrations are Laravel's version control for your database, similar to Prisma migrations.

#### `database/migrations/2025_10_31_132034_add_role_to_users_table.php`
- **Purpose**: Add role column to existing users table
- **Changes**:
  - Added `role` column (string, default: 'user')
  - Positioned after email column
- **Rollback**: Drops role column
- **Learning Note**: Table migrations allow you to modify existing tables without data loss

#### `database/migrations/2025_10_31_132101_create_projects_table.php`
- **Purpose**: Create projects table
- **Schema**:
  - `id`: Primary key (bigint, auto-increment)
  - `user_id`: Foreign key to users (cascade on delete)
  - `name`: Project name (string, required)
  - `description`: Project description (text, nullable)
  - `status`: Project status (string, default: 'active')
  - `start_date`: Project start date (date, nullable)
  - `end_date`: Project end date (date, nullable)
  - `created_at`, `updated_at`: Timestamps
- **Indexes**: user_id, status (for query performance)
- **Learning Note**: Foreign keys ensure referential integrity; indexes improve query speed

#### `database/migrations/2025_10_31_132137_create_tasks_table.php`
- **Purpose**: Create tasks table
- **Schema**:
  - `id`: Primary key
  - `project_id`: Foreign key to projects (cascade on delete)
  - `assigned_to`: Foreign key to users (set null on delete, nullable)
  - `title`: Task title (string, required)
  - `description`: Task description (text, nullable)
  - `priority`: Task priority (string, default: 'medium')
  - `status`: Task status (string, default: 'pending')
  - `due_date`: Task deadline (date, nullable)
  - `completed_at`: Completion timestamp (timestamp, nullable)
  - `created_at`, `updated_at`: Timestamps
- **Indexes**: project_id, assigned_to, status, priority, due_date
- **Learning Note**: Multiple indexes on frequently queried columns drastically improve performance

---

### 3. Models (Eloquent ORM)

Models define the structure, relationships, and behavior of your data entities.

#### `app/Models/User.php` (Updated)
- **Purpose**: Represent users in the system (extends Laravel Breeze's User model)
- **Fillable**: name, email, password, role
- **Casts**: role → UserRole enum
- **Relationships**:
  - `projects()`: hasMany Project
  - `assignedTasks()`: hasMany Task (via assigned_to)
- **Helper Methods**:
  - `isAdmin()`: Check if user has admin role
  - `isUser()`: Check if user has regular user role
- **Learning Note**: The `fillable` property protects against mass assignment vulnerabilities

#### `app/Models/Project.php`
- **Purpose**: Represent projects in the task management system
- **Fillable**: user_id, name, description, status, start_date, end_date
- **Casts**:
  - status → ProjectStatus enum
  - start_date, end_date → date
- **Relationships**:
  - `user()`: belongsTo User (project owner)
  - `tasks()`: hasMany Task
- **Query Scopes**:
  - `active()`: Get only active projects
  - `completed()`: Get only completed projects
- **Accessors**:
  - `progress`: Calculated property returning completion percentage (0-100)
- **Learning Note**: Scopes are reusable query filters; accessors are computed properties

#### `app/Models/Task.php`
- **Purpose**: Represent tasks within projects
- **Fillable**: project_id, assigned_to, title, description, priority, status, due_date, completed_at
- **Casts**:
  - priority → TaskPriority enum
  - status → TaskStatus enum
  - due_date → date
  - completed_at → datetime
- **Relationships**:
  - `project()`: belongsTo Project
  - `assignedUser()`: belongsTo User (via assigned_to)
- **Query Scopes**:
  - `pending()`: Get pending tasks
  - `inProgress()`: Get in-progress tasks
  - `completed()`: Get completed tasks
  - `highPriority()`: Get high priority tasks
  - `overdue()`: Get overdue incomplete tasks
  - `dueSoon()`: Get tasks due within 7 days
- **Accessors**:
  - `is_overdue`: Boolean indicating if task is past due
  - `days_until_due`: Integer days until/past due date
- **Mutators**:
  - `setStatusAttribute()`: Auto-set completed_at when status changes to completed
- **Learning Note**: Mutators allow you to intercept attribute changes and add side effects

---

### 4. Factories (Test Data Generation)

Factories generate fake data for testing and development, similar to Prisma's seed data generation.

#### `database/factories/UserFactory.php` (Updated)
- **Purpose**: Generate fake user data
- **Default State**: Creates regular user with random name/email
- **States**:
  - `admin()`: Create user with admin role
  - `unverified()`: Create user with unverified email
- **Learning Note**: Factory states allow you to create variations of the base factory

#### `database/factories/ProjectFactory.php`
- **Purpose**: Generate fake project data
- **Default State**: Creates project with random data and random status
- **States**:
  - `active()`: Create active project
  - `completed()`: Create completed project with past end date
  - `archived()`: Create archived project
  - `forUser(User $user)`: Create project for specific user
- **Learning Note**: Fluent factory API allows chaining states for complex scenarios

#### `database/factories/TaskFactory.php`
- **Purpose**: Generate fake task data
- **Default State**: Creates task with random priority, status, and optional assignment
- **States**:
  - `pending()`: Create pending task
  - `inProgress()`: Create in-progress task
  - `completed()`: Create completed task with completed_at timestamp
  - `highPriority()`: Create high priority task
  - `lowPriority()`: Create low priority task
  - `overdue()`: Create overdue task (past due, not completed)
  - `forProject(Project $project)`: Create task for specific project
  - `assignedTo(User $user)`: Create task assigned to specific user
- **Learning Note**: Factory states can be combined (e.g., `->highPriority()->overdue()`)

---

### 5. Seeders (Database Population)

#### `database/seeders/DevelopmentSeeder.php`
- **Purpose**: Populate database with realistic sample data for development
- **What It Creates**:
  - 1 admin user (admin@example.com / password)
  - 1 regular user (user@example.com / password)
  - 5 additional random users
  - 4 projects for admin (3 active, 1 completed)
  - 2 active projects for regular user
  - 27+ tasks distributed across projects
  - 3 special scenario tasks (overdue, unassigned, in-progress)
- **How to Run**:
  ```bash
  php artisan migrate:fresh --seed --seeder=DevelopmentSeeder
  ```
- **Learning Note**: Seeders are great for quickly setting up development environments with realistic data

---

## Database State

### Current Database Statistics
- **Users**: 7 (1 admin, 1 regular, 5 random)
- **Projects**: 6 (5 active, 1 completed)
- **Tasks**: 30 (various statuses and priorities)

### Database Relationships
```
User (1) ─────────────> (Many) Projects
  │
  └─────────────────────> (Many) Tasks (assigned_to)

Project (1) ───────────> (Many) Tasks
```

### Test Credentials
- **Admin**: admin@example.com / password
- **User**: user@example.com / password

---

## Key Laravel Concepts Demonstrated

### 1. Eloquent ORM vs Prisma

| Feature | Laravel Eloquent | Prisma |
|---------|-----------------|--------|
| Schema Definition | Migrations (PHP) | schema.prisma |
| Model Definition | PHP classes | Generated types |
| Relationships | Method definitions | @relation directive |
| Queries | Fluent builder | Type-safe client |
| Seeding | Factories + Seeders | seed.ts script |

### 2. Relationships

**One-to-Many**:
- User has many Projects: `$user->projects`
- Project has many Tasks: `$project->tasks`

**Inverse**:
- Project belongs to User: `$project->user`
- Task belongs to Project: `$task->project`

**Nullable Foreign Key**:
- Task assigned to User (optional): `$task->assignedUser`

### 3. Query Scopes

Reusable query filters defined on models:
```php
// Instead of: Project::where('status', 'active')->get()
// Use scope: Project::active()->get()
```

### 4. Accessors & Mutators

**Accessors** (getters): Compute derived properties
```php
$project->progress // Returns 0-100 percentage
```

**Mutators** (setters): Transform data on save
```php
$task->status = TaskStatus::COMPLETED; // Auto-sets completed_at
```

### 5. Type Safety with Enums

PHP 8.1+ enums provide type safety:
```php
// Type-safe: Only valid enum values allowed
$project->status = ProjectStatus::ACTIVE;

// Type error: Invalid value rejected
$project->status = 'invalid'; // Error!
```

---

## What's Next: Phase 2

Phase 2 will focus on **Backend Logic**:
1. Form Request classes for validation
2. Service classes for business logic
3. Policy classes for authorization
4. Resource classes for API responses
5. Controllers (ProjectController, TaskController, DashboardController)
6. Define routes in `routes/web.php`

---

## Commands Reference

### Run Migrations
```bash
php artisan migrate              # Run pending migrations
php artisan migrate:fresh        # Drop all tables and re-migrate
php artisan migrate:rollback     # Rollback last migration batch
```

### Run Seeders
```bash
php artisan db:seed                                      # Run DatabaseSeeder
php artisan db:seed --class=DevelopmentSeeder          # Run specific seeder
php artisan migrate:fresh --seed --seeder=DevelopmentSeeder # Reset and seed
```

### Generate Files
```bash
php artisan make:model Project          # Create model
php artisan make:migration create_projects_table  # Create migration
php artisan make:factory ProjectFactory # Create factory
php artisan make:seeder DevelopmentSeeder # Create seeder
```

### Database Inspection
```bash
php artisan db:show              # Show database info
php artisan db:table projects    # Show table structure
php artisan tinker               # Laravel REPL for testing
```

---

## Comparison with Next.js/Prisma Workflow

### Prisma Workflow
```bash
# Define schema
# Edit schema.prisma

# Generate migration
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed
```

### Laravel Workflow
```bash
# Create model, migration, factory together
php artisan make:model Project -mf

# Edit migration file
# Edit app/Models/Project.php

# Run migration
php artisan migrate

# Create seeder
php artisan make:seeder DevelopmentSeeder

# Run seeder
php artisan db:seed --class=DevelopmentSeeder
```

---

## Tips for Learning

1. **Use Tinker**: Laravel's REPL is great for experimenting
   ```bash
   php artisan tinker
   >>> User::first()
   >>> Project::with('tasks')->get()
   ```

2. **Check Query Logs**: Enable query logging to see SQL
   ```php
   DB::enableQueryLog();
   Project::active()->get();
   dd(DB::getQueryLog());
   ```

3. **Use Factory States**: Combine states for complex scenarios
   ```php
   Task::factory()
       ->highPriority()
       ->overdue()
       ->assignedTo($user)
       ->create();
   ```

4. **Leverage Relationships**: Eager load to prevent N+1 queries
   ```php
   // Bad: N+1 queries
   $projects = Project::all();
   foreach ($projects as $project) {
       echo $project->user->name; // Query per iteration
   }

   // Good: Eager loading
   $projects = Project::with('user')->get();
   foreach ($projects as $project) {
       echo $project->user->name; // No extra queries
   }
   ```

---

**Phase 1 Complete!** 🎉

All database foundations are in place. The system is now ready for Phase 2: Backend Logic implementation.

---

## Phase 2: Backend Logic ✅

**Status**: COMPLETED  
**Date**: October 31, 2025

---

## Overview

Phase 2 built the business logic layer, implementing validation, services, authorization, resource transformers, and controllers. This phase demonstrates Laravel's request validation, service layer pattern, policy-based authorization, and resource transformers.

---

## Created Files

### 1. Form Request Classes (Validation)

Form Requests encapsulate validation logic, similar to Zod schemas in Next.js but integrated with Laravel.

#### `app/Http/Requests/StoreProjectRequest.php`
- **Purpose**: Validate project creation data
- **Rules**:
  - name: required, max 255 chars
  - description: optional, max 1000 chars
  - status: required, must be valid ProjectStatus enum value
  - start_date: optional, must be today or later
  - end_date: optional, must be after start_date
- **Learning Note**: Form Requests automatically return validation errors to the frontend

#### `app/Http/Requests/UpdateProjectRequest.php`
- **Purpose**: Validate project update data
- **Rules**: Similar to Store but uses `sometimes` for partial updates
- **Learning Note**: `sometimes` rule only validates if field is present in request

#### `app/Http/Requests/StoreTaskRequest.php`
- **Purpose**: Validate task creation data
- **Rules**:
  - project_id: required, must exist in projects table
  - assigned_to: optional, must exist in users table
  - title: required, max 255 chars
  - priority: required, valid TaskPriority enum
  - status: required, valid TaskStatus enum
  - due_date: optional, today or later
- **Learning Note**: `exists:table,column` validates foreign key references

#### `app/Http/Requests/UpdateTaskRequest.php`
- **Purpose**: Validate task update data
- **Rules**: Similar to Store but allows partial updates

---

### 2. Service Classes (Business Logic)

Service classes separate business logic from controllers, promoting code reusability and testability.

#### `app/Services/ProjectService.php`
- **Purpose**: Handle project-related business logic
- **Key Methods**:
  - `getUserProjects()`: Get paginated projects with relationships
  - `getActiveProjects()`: Get only active projects
  - `createProject()`: Create new project for user
  - `updateProject()`: Update existing project
  - `deleteProject()`: Delete project (cascade to tasks)
  - `getProjectDetails()`: Get project with full stats
  - `getProjectStats()`: Calculate project statistics
  - `searchProjects()`: Search by name/description
  - `archiveProject()`: Mark project as archived
  - `completeProject()`: Mark project as completed
- **Learning Note**: Services use dependency injection and are easily mockable for testing

#### `app/Services/TaskService.php`
- **Purpose**: Handle task-related business logic
- **Key Methods**:
  - `getUserTasks()`: Get paginated tasks for user
  - `getAssignedTasks()`: Get tasks assigned to specific user
  - `getProjectTasks()`: Get all tasks for a project
  - `createTask()`: Create new task
  - `updateTask()`: Update existing task
  - `deleteTask()`: Delete task
  - `assignTask()`: Assign task to user
  - `updateTaskStatus()`: Change task status
  - `completeTask()`: Mark task as completed
  - `getOverdueTasks()`: Get overdue tasks
  - `getTasksDueSoon()`: Get tasks due within timeframe
  - `getUserTaskStats()`: Calculate task statistics
  - `searchTasks()`: Search by title/description
- **Learning Note**: Query scopes (defined in models) make service methods cleaner

---

### 3. Policy Classes (Authorization)

Policies handle authorization logic, determining who can perform actions on models.

#### `app/Policies/ProjectPolicy.php`
- **Purpose**: Authorize project-related actions
- **Methods**:
  - `viewAny()`: Anyone can view their own projects list
  - `view()`: Users can view their own projects, admins can view all
  - `create()`: All authenticated users can create projects
  - `update()`: Project owners and admins can update
  - `delete()`: Project owners and admins can delete
  - `forceDelete()`: Only admins can permanently delete
- **Learning Note**: Policies automatically map to controller methods

#### `app/Policies/TaskPolicy.php`
- **Purpose**: Authorize task-related actions
- **Methods**:
  - `viewAny()`: Anyone can view tasks from their projects
  - `view()`: Users can view tasks from their projects, admins can view all
  - `create()`: All authenticated users can create tasks
  - `update()`: Project owners, assigned users, and admins can update
  - `delete()`: Only project owners and admins can delete
  - `forceDelete()`: Only admins can permanently delete
- **Learning Note**: Tasks check project ownership since they belong to projects

---

### 4. Resource Classes (Data Transformation)

Resources transform models into JSON, controlling what data is exposed to the frontend.

#### `app/Http/Resources/UserResource.php`
- **Purpose**: Transform User model for API responses
- **Exposed Fields**:
  - id, name, email
  - role (with label)
  - timestamps
  - Conditional: projects, assigned_tasks (if loaded)
- **Learning Note**: Sensitive data (password, remember_token) is hidden

#### `app/Http/Resources/ProjectResource.php`
- **Purpose**: Transform Project model for API responses
- **Exposed Fields**:
  - id, user_id, name, description
  - status (with label and color)
  - dates
  - Computed: progress percentage
  - Conditional: user, tasks, counts (if loaded)
- **Learning Note**: `whenLoaded()` only includes relationships if eager loaded

#### `app/Http/Resources/TaskResource.php`
- **Purpose**: Transform Task model for API responses
- **Exposed Fields**:
  - id, project_id, assigned_to, title, description
  - priority (with label, color, weight)
  - status (with label, color, is_final)
  - dates
  - Computed: is_overdue, days_until_due
  - Conditional: project, assigned_user (if loaded)
- **Learning Note**: Resources can include computed properties from model accessors

---

### 5. Controllers (HTTP Request Handlers)

Controllers handle HTTP requests, coordinate services, and return responses.

#### `app/Http/Controllers/DashboardController.php`
- **Purpose**: Display dashboard with stats and recent activity
- **Methods**:
  - `index()`: Show dashboard with project/task stats, recent items, overdue tasks
- **Learning Note**: Uses services to fetch data, returns Inertia response

#### `app/Http/Controllers/ProjectController.php`
- **Purpose**: Handle project CRUD operations
- **Methods** (RESTful resource controller):
  - `index()`: List all user's projects
  - `create()`: Show project creation form
  - `store()`: Save new project (uses StoreProjectRequest)
  - `show()`: Display single project with details
  - `edit()`: Show project edit form
  - `update()`: Save project changes (uses UpdateProjectRequest)
  - `destroy()`: Delete project
- **Learning Note**: `authorizeResource()` automatically authorizes all actions

#### `app/Http/Controllers/TaskController.php`
- **Purpose**: Handle task CRUD operations
- **Methods** (RESTful resource controller):
  - `index()`: List all user's tasks
  - `create()`: Show task creation form (with projects, users for assignment)
  - `store()`: Save new task
  - `show()`: Display single task
  - `edit()`: Show task edit form
  - `update()`: Save task changes
  - `destroy()`: Delete task
- **Learning Note**: Controllers are thin, delegating logic to services

---

### 6. Routes

#### `routes/web.php` (Updated)
- **Dashboard**: `/dashboard` → DashboardController@index
- **Projects** (Resource routes):
  - GET `/projects` → index
  - GET `/projects/create` → create
  - POST `/projects` → store
  - GET `/projects/{project}` → show
  - GET `/projects/{project}/edit` → edit
  - PUT/PATCH `/projects/{project}` → update
  - DELETE `/projects/{project}` → destroy
- **Tasks** (Resource routes): Similar pattern to projects
- **Learning Note**: `Route::resource()` generates all RESTful routes automatically

---

## Key Laravel Concepts Demonstrated

### 1. MVC + Service Layer Architecture

```
Request → Controller → Service → Model → Database
Response ← Controller ← Service ← Model ← Database
```

**Benefits**:
- Controllers stay thin (routing HTTP requests)
- Services contain reusable business logic
- Models handle data access
- Easy to test each layer independently

### 2. Form Request Validation

```php
// Automatic validation before controller method
public function store(StoreProjectRequest $request)
{
    // $request->validated() only contains valid data
    $project = $this->projectService->createProject($user, $request->validated());
}
```

**Similar to**: Zod validation in Next.js API routes

### 3. Policy-Based Authorization

```php
// Automatic authorization check
$this->authorizeResource(Project::class, 'project');

// In policy:
public function update(User $user, Project $project): bool
{
    return $user->id === $project->user_id || $user->isAdmin();
}
```

**Similar to**: Middleware checks in Next.js, but more granular

### 4. Resource Transformers

```php
// Consistent API responses
return Inertia::render('Projects/Index', [
    'projects' => ProjectResource::collection($projects),
]);
```

**Similar to**: DTOs or serializers in other frameworks

### 5. Dependency Injection

```php
public function __construct(
    private ProjectService $projectService,
    private TaskService $taskService
) {}
```

**Benefits**:
- Automatic resolution by Laravel container
- Easy to mock for testing
- Promotes loose coupling

---

## Testing the Backend

Test the routes with these commands:

```bash
# List all routes
php artisan route:list

# Filter by name
php artisan route:list --name=projects

# Filter by method
php artisan route:list --method=GET

# Test in Tinker
php artisan tinker
>>> $user = User::first()
>>> $project = app(App\Services\ProjectService::class)->createProject($user, [
...     'name' => 'Test Project',
...     'status' => 'active',
... ])
```

---

## Comparison with Next.js Architecture

| Aspect | Laravel | Next.js |
|--------|---------|---------|
| **Routing** | routes/web.php | app/ directory |
| **Controllers** | Controller classes | Route handlers |
| **Validation** | Form Requests | Zod schemas |
| **Business Logic** | Service classes | Server functions |
| **Authorization** | Policies | Middleware/checks |
| **Data Transform** | Resources | Manual serialization |
| **Dependency Injection** | Built-in container | Manual or libraries |

---

## What's Next: Phase 3

Phase 3 will focus on **Frontend Components**:
1. Create shadcn/ui components (card, badge, select, dialog, etc.)
2. Create base components (StatCard, ProjectCard, TaskCard)
3. Create form components (ProjectForm, TaskForm)
4. Create list components (ProjectList, TaskList)

**Backend is complete!** 🎉 The API layer is fully functional and ready for frontend integration.

---

**Phase 2 Complete!** All backend logic is in place.
