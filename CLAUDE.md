# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 application using Inertia.js with React as the frontend framework. The stack includes:

- **Laravel 12** with Inertia.js adapter
- **React 18** for frontend UI
- **Laravel Breeze** for authentication scaffolding
- **Tailwind CSS** for styling
- **shadcn/ui** for pre-built React components (New York style)
- **Pest** for testing
- **Laravel Pint** for PHP code style
- **Ziggy** for Laravel route access in JavaScript

## Development Commands

### Running the Application

```bash
# Start all development services (server, queue, logs, vite)
composer dev

# Alternatively, run services individually:
php artisan serve              # Development server
php artisan queue:listen       # Queue worker
php artisan pail               # Log viewer
npm run dev                    # Vite dev server for frontend assets
```

### Testing

```bash
# Run all tests
composer test

# Run tests with Pest directly
php artisan test

# Run specific test file
php artisan test tests/Feature/ExampleTest.php

# Run specific test by name
php artisan test --filter test_name
```

### Frontend Build

```bash
# Development
npm run dev

# Production build
npm run build
```

### Code Quality

```bash
# Laravel Pint (PHP code style fixer)
./vendor/bin/pint

# Run Pint on specific file/directory
./vendor/bin/pint app/Http/Controllers
```

## Architecture

### Backend (Laravel)

- **Routes**: Defined in `routes/web.php` (web routes) and `routes/auth.php` (authentication routes)
- **Controllers**: Located in `app/Http/Controllers/`
  - `Auth/` - Authentication controllers provided by Breeze
  - `ProfileController.php` - User profile management
- **Models**: Located in `app/Models/`
- **Middleware**: Located in `app/Http/Middleware/`
- **Form Requests**: Located in `app/Http/Requests/`
- **Database**: Uses SQLite (`database/database.sqlite`)
  - Migrations in `database/migrations/`
  - Factories in `database/factories/`
  - Seeders in `database/seeders/`

### Frontend (React + Inertia.js)

- **Entry Point**: `resources/js/app.jsx` - Configures Inertia.js app
- **Pages**: `resources/js/Pages/` - Inertia page components (one per route)
  - `Auth/` - Authentication pages (Login, Register, etc.)
  - `Profile/` - Profile management pages
  - `Dashboard.jsx` - Main dashboard
  - `Welcome.jsx` - Public landing page
- **Layouts**: `resources/js/Layouts/` - Shared layout components
- **Components**: `resources/js/Components/` - Reusable React components
  - `ui/` - shadcn/ui components (button, card, dialog, etc.)
- **Hooks**: `resources/js/hooks/` - Custom React hooks
- **Utilities**: `resources/js/lib/` - Utility functions (including `cn()` for className merging)
- **Styles**: `resources/css/app.css` - Tailwind CSS entry point

**Path Aliases** (configured in `jsconfig.json`):
- `@/*` → `resources/js/*`
- `@/components` → `resources/js/Components`
- `@/components/ui` → `resources/js/Components/ui`
- `@/lib` → `resources/js/lib`
- `@/hooks` → `resources/js/hooks`

### Inertia.js Pattern

This app uses Inertia.js to connect Laravel backend with React frontend:

- Controllers return `Inertia::render('PageName', $data)` instead of views
- Pages are React components in `resources/js/Pages/`
- Data flows from controller to React component as props
- Forms use Inertia's form helpers for seamless POST/PATCH/DELETE requests
- Page components are auto-loaded based on route via `resolvePageComponent()`

### Ziggy Routes

This app uses Tightenco Ziggy for accessing Laravel routes in JavaScript:

- Use `route('route.name')` in React components to generate URLs
- Route definitions from `routes/web.php` are available on the frontend

### shadcn/ui Components

This project uses shadcn/ui (New York style) for pre-built, customizable React components:

- Components are located in `resources/js/Components/ui/`
- Configuration is in `components.json`
- Uses Radix UI primitives under the hood
- Styling with Tailwind CSS and CSS variables
- Use the `cn()` utility from `@/lib/utils` for className merging

To add new shadcn/ui components, you would typically use:
```bash
npx shadcn@latest add [component-name]
```

## Key Configuration Files

- `vite.config.js` - Vite bundler configuration with Laravel plugin
- `tailwind.config.js` - Tailwind CSS configuration
- `phpunit.xml` - PHPUnit/Pest test configuration
- `composer.json` - PHP dependencies and scripts
- `package.json` - Node.js dependencies and scripts

## Database

The application uses SQLite by default. The database file is at `database/database.sqlite`.

To reset and reseed the database:

```bash
php artisan migrate:fresh --seed
```

## Authentication

Authentication is handled by Laravel Breeze with Inertia.js stack:

- Authentication routes are in `routes/auth.php`
- Auth controllers are in `app/Http/Controllers/Auth/`
- Auth pages (React) are in `resources/js/Pages/Auth/`
- Uses Laravel Sanctum for API authentication
