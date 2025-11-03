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

---

## Phase 3: Frontend Components ✅

**Status**: COMPLETED
**Date**: November 1, 2025

---

## Overview

Phase 3 focused on building reusable React components for the frontend using shadcn/ui and Inertia.js. This phase demonstrates React component composition, form handling with Inertia, and modern UI patterns with shadcn/ui.

---

## Created Files

### 1. Dashboard Components

Dashboard components display statistics and recent activity on the main dashboard page.

#### `resources/js/Components/Dashboard/StatCard.jsx`
- **Purpose**: Reusable component for displaying statistics
- **Props**:
  - `title`: Stat title (e.g., "Total Projects")
  - `value`: Main value to display
  - `description`: Optional description or change indicator
  - `icon`: Icon component to display
  - `iconColor`: Tailwind color class for icon background
- **Features**:
  - Card layout with header and content
  - Customizable icon with color
  - Optional description text
- **Learning Note**: Demonstrates component composition with shadcn/ui Card components

#### `resources/js/Components/Dashboard/TasksByStatus.jsx`
- **Purpose**: Display task breakdown by status with progress bars
- **Props**:
  - `stats`: Object containing task counts by status (total, pending, in_progress, completed, cancelled)
- **Features**:
  - Progress bars for each status
  - Percentage calculation
  - Color-coded status indicators
  - Empty state when no tasks exist
- **Learning Note**: Shows data visualization with Progress component and conditional rendering

#### `resources/js/Components/Dashboard/RecentProjects.jsx`
- **Purpose**: Display a list of recent projects
- **Props**:
  - `projects`: Array of project objects
- **Features**:
  - Clickable project cards linking to project details
  - Status badges with color indicators
  - Progress bars showing completion percentage
  - Task count and due date display
  - Empty state with "Create Project" CTA
  - "View all" link to projects index
- **Learning Note**: Demonstrates Inertia Link usage and Ziggy route() helper

#### `resources/js/Components/Dashboard/RecentTasks.jsx`
- **Purpose**: Display a list of recent tasks
- **Props**:
  - `tasks`: Array of task objects
- **Features**:
  - Clickable task cards linking to task details
  - Status and priority badges
  - Overdue indicator badge
  - Assigned user avatar
  - Due date display with days remaining/overdue
  - Empty state with "Create Task" CTA
  - "View all" link to tasks index
- **Learning Note**: Shows complex component with multiple data points and conditional badges

---

### 2. Project Components

Project components handle project display and management.

#### `resources/js/Components/Projects/ProjectCard.jsx`
- **Purpose**: Display a single project in card format
- **Props**:
  - `project`: Project object
  - `onDelete`: Optional callback for delete action
- **Features**:
  - Project name as clickable link
  - Status badge with color indicator
  - Description (truncated to 2 lines)
  - Progress bar with percentage
  - Task count display
  - Start and end date display
  - Dropdown menu with actions (View, Edit, Delete)
  - Footer buttons for quick actions
- **Learning Note**: Demonstrates DropdownMenu component and link navigation

#### `resources/js/Components/Projects/ProjectList.jsx`
- **Purpose**: Display a grid of project cards
- **Props**:
  - `projects`: Array of project objects
  - `onDelete`: Optional callback for delete action
- **Features**:
  - Responsive grid layout (1-3 columns based on screen size)
  - Empty state with "Create Project" CTA
  - Passes delete handler to child cards
- **Learning Note**: Shows grid layout patterns and empty state handling

#### `resources/js/Components/Projects/ProjectForm.jsx`
- **Purpose**: Form for creating or editing projects
- **Props**:
  - `project`: Existing project object for editing (optional)
  - `statuses`: Available project statuses
- **Features**:
  - Automatic mode detection (create vs edit)
  - Inertia form handling with useForm hook
  - Validation error display inline
  - Required field indicators
  - Status select dropdown
  - Date inputs for start/end dates
  - Form submission with proper HTTP methods (POST/PUT)
  - Cancel button to go back
- **Learning Note**: Demonstrates Inertia form helpers and validation error handling

---

### 3. Task Components

Task components handle task display and management.

#### `resources/js/Components/Tasks/TaskStatusBadge.jsx`
- **Purpose**: Display task status as a colored badge
- **Props**:
  - `status`: Status object with value and label
  - `className`: Optional additional CSS classes
- **Features**:
  - Color-coded based on status (pending, in_progress, completed, cancelled)
  - Status dot indicator
  - Dark mode support
- **Learning Note**: Demonstrates reusable badge component with status-specific styling

#### `resources/js/Components/Tasks/TaskCard.jsx`
- **Purpose**: Display a single task in card format
- **Props**:
  - `task`: Task object
  - `onDelete`: Optional callback for delete action
  - `showProject`: Whether to show project name (default: true)
- **Features**:
  - Task title as clickable link
  - Status and priority badges
  - Overdue indicator badge
  - Task description (truncated to 2 lines)
  - Project name link (optional)
  - Due date with days remaining/overdue
  - Assigned user avatar and name
  - Dropdown menu with actions
  - Footer buttons for quick actions
- **Learning Note**: Complex card component with multiple conditional elements

#### `resources/js/Components/Tasks/TaskList.jsx`
- **Purpose**: Display a grid of task cards
- **Props**:
  - `tasks`: Array of task objects
  - `onDelete`: Optional callback for delete action
  - `showProject`: Whether to show project name on cards (default: true)
- **Features**:
  - Responsive grid layout
  - Empty state with "Create Task" CTA
  - Passes props to child cards
- **Learning Note**: Shows list component pattern with prop drilling

#### `resources/js/Components/Tasks/TaskForm.jsx`
- **Purpose**: Form for creating or editing tasks
- **Props**:
  - `task`: Existing task object for editing (optional)
  - `projects`: Available projects for selection
  - `users`: Available users for task assignment
  - `priorities`: Available task priorities
  - `statuses`: Available task statuses
- **Features**:
  - Automatic mode detection (create vs edit)
  - Project selection (required)
  - Task title and description
  - Priority and status selects
  - User assignment select (optional)
  - Due date picker
  - Null handling for optional fields
  - Inertia form handling
  - Validation error display
  - Cancel button
- **Learning Note**: Demonstrates complex form with multiple selects and null handling

---

## Backend Improvements

### Updated Controllers

Modified controllers to provide enum data for forms:

#### `app/Http/Controllers/ProjectController.php`
- **Updated Methods**:
  - `create()`: Added `statuses` array
  - `edit()`: Added `statuses` array
- **Purpose**: Provide status options for project forms

#### `app/Http/Controllers/TaskController.php`
- **Updated Methods**:
  - `create()`: Added `priorities` and `statuses` arrays
  - `edit()`: Added `priorities` and `statuses` arrays
- **Purpose**: Provide priority and status options for task forms

---

### Updated Enums

Added `toArray()` method to all enums for frontend consumption:

#### `app/Enums/ProjectStatus.php`
- **New Method**: `toArray()` - Returns array of objects with `value` and `label`
- **Purpose**: Provide formatted enum data for select dropdowns

#### `app/Enums/TaskStatus.php`
- **New Method**: `toArray()` - Returns array of objects with `value` and `label`
- **Purpose**: Provide formatted enum data for select dropdowns

#### `app/Enums/TaskPriority.php`
- **New Method**: `toArray()` - Returns array of objects with `value` and `label`
- **Purpose**: Provide formatted enum data for select dropdowns

**Example Output**:
```php
[
    ['value' => 'active', 'label' => 'Active'],
    ['value' => 'completed', 'label' => 'Completed'],
    ['value' => 'archived', 'label' => 'Archived'],
]
```

---

### Updated Services

#### `app/Services/TaskService.php`
- **Updated Method**: `getUserTaskStats()`
- **Change**: Added `cancelled` count to task statistics
- **Purpose**: Provide complete task status breakdown for TasksByStatus component

---

## Key React/Inertia Concepts Demonstrated

### 1. Component Composition

```jsx
// Composing shadcn/ui components
<Card>
    <CardHeader>
        <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>Content</CardContent>
</Card>
```

**Benefits**:
- Reusable components
- Consistent styling
- Easy to maintain

### 2. Inertia Links

```jsx
import { Link } from '@inertiajs/react';

<Link href={route('projects.show', project.id)}>
    View Project
</Link>
```

**Similar to**: Next.js Link component, but uses Laravel routes

### 3. Inertia Forms

```jsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, put, errors } = useForm({
    name: '',
    description: '',
});

const handleSubmit = (e) => {
    e.preventDefault();
    post(route('projects.store'));
};
```

**Benefits**:
- Automatic CSRF protection
- Validation error handling
- Progress tracking
- Preserve scroll position

### 4. Conditional Rendering

```jsx
{task.is_overdue && (
    <Badge variant="destructive">
        <AlertCircle className="h-3 w-3 mr-1" />
        Overdue
    </Badge>
)}
```

**Similar to**: Standard React conditional rendering

### 5. Props and Prop Types

```jsx
export default function TaskCard({ task, onDelete, showProject = true }) {
    // Component implementation
}
```

**Learning Note**: Props are documented in JSDoc comments for better IDE support

---

## shadcn/ui Components Used

All the following shadcn/ui components were already installed and used in Phase 3:

1. **Card** - Container for content sections
2. **Badge** - Status and priority indicators
3. **Button** - Interactive elements
4. **Input** - Text input fields
5. **Textarea** - Multi-line text input
6. **Label** - Form field labels
7. **Select** - Dropdown selection
8. **Alert** - Error messages and notifications
9. **Progress** - Progress bars
10. **Avatar** - User profile pictures
11. **DropdownMenu** - Action menus
12. **Separator** - Visual dividers

---

## Component Organization

```
resources/js/Components/
├── Dashboard/
│   ├── StatCard.jsx
│   ├── TasksByStatus.jsx
│   ├── RecentProjects.jsx
│   └── RecentTasks.jsx
├── Projects/
│   ├── ProjectCard.jsx
│   ├── ProjectList.jsx
│   └── ProjectForm.jsx
└── Tasks/
    ├── TaskStatusBadge.jsx
    ├── TaskCard.jsx
    ├── TaskList.jsx
    └── TaskForm.jsx
```

---

## Comparison with Next.js Components

| Aspect | Laravel + Inertia | Next.js |
|--------|-------------------|---------|
| **Routing** | Inertia Link + Ziggy routes | Next.js Link |
| **Forms** | useForm hook | react-hook-form or Server Actions |
| **Data Fetching** | Server-side in controllers | Server Components or API routes |
| **Validation** | Backend + Inertia errors | Zod + frontend or backend |
| **State Management** | Inertia page props | Props or React Context |
| **Navigation** | Inertia router | Next.js router |

---

## What's Next: Phase 4

Phase 4 will focus on **Frontend Pages**:
1. Update Dashboard page with stats and components
2. Create Projects pages (Index, Create, Edit, Show)
3. Create Tasks pages (Index, Create, Edit, Show)
4. Update navigation in AuthenticatedLayout

**Frontend components are complete!** 🎉 All reusable components are ready for page integration.

---

**Phase 3 Complete!** All frontend components are built and ready to use.

---

## Phase 4: Frontend Pages ✅

**Status**: COMPLETED
**Date**: November 1, 2025

---

## Overview

Phase 4 focused on building complete Inertia.js pages that integrate all the components created in Phase 3 with the backend controllers from Phase 2. This phase demonstrates full-stack integration using Laravel + Inertia.js + React.

---

## Created Files

### 1. Dashboard Page

#### `resources/js/Pages/Dashboard.jsx`
- **Purpose**: Main dashboard displaying project and task statistics
- **Props**:
  - `stats`: Statistics object with projects and tasks data
  - `recent_projects`: Array of recent projects
  - `recent_tasks`: Array of recent tasks
  - `overdue_tasks`: Array of overdue tasks
- **Features**:
  - Four stat cards showing totals and key metrics
  - Recent projects grid
  - Tasks by status chart
  - Recent tasks list
  - Responsive grid layout
  - Dynamic stat calculations (completion rate, etc.)
- **Learning Note**: Demonstrates prop destructuring and component composition

---

### 2. Projects Pages

#### `resources/js/Pages/Projects/Index.jsx`
- **Purpose**: Display list of all user's projects
- **Props**:
  - `projects`: Paginated projects collection
- **Features**:
  - Project grid using ProjectList component
  - Create button in header
  - Delete confirmation dialog
  - Toast notifications on success/error
  - Handles pagination data structure
- **Learning Note**: Shows Inertia router usage and AlertDialog component

#### `resources/js/Pages/Projects/Create.jsx`
- **Purpose**: Form page for creating new projects
- **Props**:
  - `statuses`: Available project statuses
- **Features**:
  - ProjectForm component integration
  - Simple page layout with centered form
- **Learning Note**: Minimal page wrapper around reusable form component

#### `resources/js/Pages/Projects/Edit.jsx`
- **Purpose**: Form page for editing existing projects
- **Props**:
  - `project`: Project object to edit
  - `statuses`: Available project statuses
- **Features**:
  - ProjectForm component with pre-filled data
  - Dynamic page title with project name
- **Learning Note**: Same form component used for create and edit

#### `resources/js/Pages/Projects/Show.jsx`
- **Purpose**: Detailed project view with tasks
- **Props**:
  - `project`: Full project object with tasks
  - `stats`: Project-specific statistics
- **Features**:
  - Project metadata display
  - Progress bar and percentage
  - Task statistics grid (pending, in-progress, completed, overdue)
  - Task list (filtered to project)
  - Add task button
  - Edit/Delete actions
  - Delete confirmations for both project and tasks
  - Date formatting
  - Status badges
- **Learning Note**: Complex page combining multiple data sources and actions

---

### 3. Tasks Pages

#### `resources/js/Pages/Tasks/Index.jsx`
- **Purpose**: Display list of all user's tasks
- **Props**:
  - `tasks`: Paginated tasks collection
- **Features**:
  - Task grid using TaskList component
  - Create button in header
  - Delete confirmation dialog
  - Toast notifications
  - Shows project name for each task
- **Learning Note**: Similar structure to Projects/Index with task-specific data

#### `resources/js/Pages/Tasks/Create.jsx`
- **Purpose**: Form page for creating new tasks
- **Props**:
  - `projects`: Available projects
  - `users`: Available users for assignment
  - `priorities`: Task priorities
  - `statuses`: Task statuses
- **Features**:
  - TaskForm component integration
  - All dropdown options provided from backend
- **Learning Note**: Demonstrates passing multiple prop collections to form

#### `resources/js/Pages/Tasks/Edit.jsx`
- **Purpose**: Form page for editing existing tasks
- **Props**:
  - `task`: Task object to edit
  - `projects`: Available projects
  - `users`: Available users
  - `priorities`: Task priorities
  - `statuses`: Task statuses
- **Features**:
  - TaskForm with pre-filled data
  - Dynamic page title
  - All dropdown options available
- **Learning Note**: Consistent pattern with create page

#### `resources/js/Pages/Tasks/Show.jsx`
- **Purpose**: Detailed task view
- **Props**:
  - `task`: Full task object with relationships
- **Features**:
  - Task metadata display
  - Status and priority badges
  - Overdue indicator
  - Project link
  - Assigned user avatar and name
  - Due date with days remaining/overdue calculation
  - Completed timestamp (if applicable)
  - Created/Updated timestamps
  - Edit/Delete actions
  - Delete confirmation dialog
- **Learning Note**: Comprehensive detail page with all task information

---

## Updated Files

### 1. Layout Updates

#### `resources/js/Layouts/AuthenticatedLayout.jsx`
- **Updates**:
  - Added Projects nav link (desktop and mobile)
  - Added Tasks nav link (desktop and mobile)
  - Active route detection using `route().current('projects.*')`
  - Dark mode support for background and navigation
- **Learning Note**: Wildcard route matching for nested routes

### 2. Application Setup

#### `resources/js/app.jsx`
- **Updates**:
  - Added Toaster component from sonner
  - Wrapped App with Fragment to include Toaster
- **Purpose**: Global toast notification system

#### `resources/js/hooks/use-toast.js` (NEW)
- **Purpose**: Toast notification hook
- **Features**:
  - Simple wrapper around sonner
  - Compatible with shadcn/ui toast API
  - Supports success and error variants
- **Learning Note**: Custom hooks for consistent API across app

---

## Backend Fixes

### 1. Model Improvements

#### `app/Models/Task.php`
- **Updated Method**: `scopeDueSoon()`
- **Change**: Now accepts `$days` parameter (default: 7)
- **Purpose**: Make the scope more flexible
- **Before**: `scopeDueSoon($query)`
- **After**: `scopeDueSoon($query, int $days = 7)`

### 2. Service Improvements

#### `app/Services/TaskService.php`
- **Updated Method**: `getTasksDueSoon()`
- **Change**: Now passes `$days` parameter to scope
- **Purpose**: Use the parameter instead of hardcoded value

---

## Key Inertia.js Concepts Demonstrated

### 1. Page Components

```jsx
export default function Index({ projects }) {
    // Page logic
    return (
        <AuthenticatedLayout>
            {/* Page content */}
        </AuthenticatedLayout>
    );
}
```

**Learning Note**: Pages receive props from controllers via Inertia

### 2. Inertia Router

```jsx
import { router } from '@inertiajs/react';

router.delete(route('projects.destroy', project.id), {
    onSuccess: () => {
        toast({ title: "Success", description: "Deleted!" });
    },
});
```

**Benefits**:
- Automatic CSRF protection
- Progress indicator
- Callback hooks (onSuccess, onError, etc.)
- Preserve scroll position

### 3. Route Helpers

```jsx
// Generate URLs using Ziggy
route('projects.show', project.id)
route().current('projects.*') // Check current route
```

**Similar to**: Next.js router, but uses Laravel routes

### 4. Delete Confirmations

```jsx
<AlertDialog open={!!itemToDelete}>
    <AlertDialogContent>
        {/* Confirmation UI */}
    </AlertDialogContent>
</AlertDialog>
```

**Pattern**: Store item in state, show dialog, confirm action

---

## Toast Notification Pattern

### Implementation

```jsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
    title: "Success",
    description: "Operation completed",
    variant: "default" // or "destructive"
});
```

### Integration

- Toaster added to `app.jsx` for global access
- Custom hook wraps sonner for consistent API
- Works with Inertia callbacks

---

## Page Organization

```
resources/js/Pages/
├── Dashboard.jsx                 # Main dashboard
├── Projects/
│   ├── Index.jsx                # Projects list
│   ├── Create.jsx               # Create project
│   ├── Edit.jsx                 # Edit project
│   └── Show.jsx                 # Project details
└── Tasks/
    ├── Index.jsx                # Tasks list
    ├── Create.jsx               # Create task
    ├── Edit.jsx                 # Edit task
    └── Show.jsx                 # Task details
```

---

## Data Flow Pattern

```
1. User navigates to route
   ↓
2. Laravel route matches controller method
   ↓
3. Controller fetches data from service
   ↓
4. Controller returns Inertia::render() with props
   ↓
5. Inertia passes props to React page component
   ↓
6. Page renders with components
   ↓
7. User interacts (click, form submit, etc.)
   ↓
8. Inertia router makes request to backend
   ↓
9. Controller processes, returns redirect or new render
   ↓
10. Inertia updates page (no full reload)
```

**Similar to**: Next.js Server Components + Server Actions, but Laravel-specific

---

## Comparison with Next.js Pages

| Aspect | Laravel + Inertia | Next.js App Router |
|--------|-------------------|---------------------|
| **Page Location** | resources/js/Pages/ | app/[route]/page.tsx |
| **Data Fetching** | Controller passes props | Server Components |
| **Navigation** | Inertia Link + router | Next Link + router |
| **Forms** | useForm hook + POST | Server Actions |
| **Layouts** | React component wrap | layout.tsx |
| **Route Definition** | routes/web.php | File structure |
| **Type Safety** | JSDoc or TypeScript | TypeScript |

---

## Best Practices Implemented

### 1. Consistent Page Structure
- All pages use AuthenticatedLayout
- Header prop for page title
- Consistent spacing and containers

### 2. Delete Confirmations
- AlertDialog for all delete actions
- Clear warning messages
- Cancel and confirm options

### 3. Toast Notifications
- Success messages for create/update/delete
- Error handling with user-friendly messages
- Consistent toast API

### 4. Loading States
- Form processing indicators
- Button disabled states during submission

### 5. Responsive Design
- Grid layouts adapt to screen size
- Mobile navigation menu
- Touch-friendly buttons and links

---

## What's Next: Phase 5

Phase 5 will focus on **Testing**:
1. Write Feature tests for Projects CRUD
2. Write Feature tests for Tasks CRUD
3. Write Unit tests for Services
4. Write Policy tests
5. Test frontend components

**Frontend pages are complete!** 🎉 The full-stack application is now functional.

---

**Phase 4 Complete!** All pages are integrated and working.
---

## Issue Fixes: Projects & Tasks Features (November 3, 2025) ✅

**Status**: COMPLETED
**Date**: November 3, 2025

---

### Overview

After Phase 4 completion, several issues were identified and resolved in the Projects and Tasks management features. All issues were related to Laravel API Resources integration with Inertia.js.

---

### Issues Resolved

#### 1. Ziggy Route Error ✅
- **Problem**: `Ziggy error: 'project' parameter is required for route 'projects.edit'`
- **Cause**: API Resources wrapped data in `data` property, making `project.id` undefined
- **Solution**: Added `->resolve()` to all API Resource returns in controllers

#### 2. Edit Form Data Loading ✅
- **Problem**: Project edit form not displaying existing dates
- **Cause**: Same as Issue #1 - data wrapping prevented form access
- **Solution**: Fixed by unwrapping API Resources

#### 3. Date Picker Implementation ✅
- **Problem**: Basic HTML date inputs instead of proper date picker
- **Solution**: Created reusable DatePicker component using shadcn/ui
- **New Component**: `resources/js/Components/ui/date-picker.jsx`
- **Features**: Visual calendar, date-fns formatting, nullable date handling

#### 4. Nested Collection Wrapping ✅
- **Problem**: `TypeError: tasks.map is not a function`
- **Cause**: Nested TaskResource collection remained wrapped even after parent resolve
- **Solution**: Frontend unwrapping in component where data is consumed

---

### Technical Details

**Laravel API Resource Wrapping**:
```php
// Without resolve
new ProjectResource($project)  // { data: { id: 1 } }

// With resolve (top-level unwrapped)
(new ProjectResource($project))->resolve()  // { id: 1 }

// Nested collections still wrapped
['tasks' => TaskResource::collection($tasks)]  // { data: [...] }
```

**Solution Pattern**:

Backend:
```php
return Inertia::render('Page', [
    'resource' => (new ResourceClass($model))->resolve(),
]);
```

Frontend:
```jsx
const items = Array.isArray(resource.items) 
    ? resource.items 
    : (resource.items?.data || []);
```

---

### Files Modified

**Backend**:
- `app/Http/Controllers/ProjectController.php` - Added `->resolve()` to 3 methods
- `app/Http/Controllers/TaskController.php` - Added `->resolve()` to 4 methods

**Frontend**:
- `resources/js/Components/ui/date-picker.jsx` - **New component**
- `resources/js/Components/Projects/ProjectForm.jsx` - Integrated DatePicker
- `resources/js/Pages/Projects/Show.jsx` - Added nested collection unwrapping

---

### Best Practices Learned

1. Always use `->resolve()` when passing API Resources to Inertia.js
2. Handle nested resource wrapping in frontend components
3. Provide fallback arrays to prevent runtime errors
4. Use proper date libraries (date-fns) for date handling
5. Frontend fixes can be cleaner than backend workarounds for nested wrapping

---

### Documentation

Complete issue details and solutions documented in:
- `docs/ISSUE_FIXES.md` - Comprehensive issue documentation
- `resources/js/Components/ui/date-picker-usage.md` - DatePicker usage examples

---

**All Issues Resolved!** 🎉 Projects and Tasks features are now fully functional and production-ready.

