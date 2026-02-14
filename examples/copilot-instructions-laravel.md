# Project-Specific Copilot Instructions — Laravel 11+ Example

> This is a **filled-in example** of `.github/copilot-instructions.md` for a typical Laravel 11+ project.
> Copy this to `.github/copilot-instructions.md` in your project and adjust the values to match your setup.

---

## Project Overview

- **Project name**: MyLaravelApp
- **Description**: A multi-tenant SaaS application for project management with team collaboration features
- **PHP version**: 8.3
- **Runs in Docker?**: yes (Laravel Sail)

---

## Architecture

- **Architectural pattern**: MVC (Model-View-Controller) with Service layer
- **Layers / flow**: Route → Controller → Service → Model (Eloquent) → Database
- **Entry point**: `public/index.php` (front controller via Laravel)
- **Routing mechanism**: Laravel Router (`routes/web.php`, `routes/api.php`)

---

## Tech Stack

| Component         | Technology                                        |
|--------------------|--------------------------------------------------|
| **Framework**      | Laravel 11                                       |
| **Template engine** | Blade                                           |
| **CSS framework**  | Tailwind CSS 3                                   |
| **JS libraries**   | Alpine.js, Livewire 3                           |
| **Database**       | MySQL 8                                          |
| **Cache**          | Redis                                            |
| **Queue / Jobs**   | Laravel Queues + Redis                           |

---

## Naming Conventions

- **Class naming**: PSR-4 namespaced (`App\Http\Controllers\ProjectController`, `App\Models\Project`, `App\Services\ProjectService`)
- **File naming**: PSR-4 mapping (`app/Http/Controllers/ProjectController.php`)
- **Autoloading**: Composer PSR-4 (`"App\\": "app/"`)
- **Method naming**: camelCase (`getActiveProjects()`, `createTask()`)
- **Database tables**: snake_case plural (`users`, `projects`, `task_comments`)

---

## Security

- **Authentication**: Laravel Sanctum (API tokens + SPA cookie-based auth)
- **CSRF protection**: `@csrf` directive in all Blade forms; `VerifyCsrfToken` middleware on web routes
- **XSS prevention**: Blade `{{ }}` auto-escapes by default; use `{!! !!}` only for trusted HTML
- **SQL injection prevention**: Eloquent ORM / query builder with parameterized queries; never use `DB::raw()` with user input
- **Authorization / ACL**: Laravel Gates & Policies (`App\Policies\ProjectPolicy`); Spatie Permission package for role-based access (`hasRole()`, `hasPermission()`)
- **Secrets management**: `.env` files; never commit `.env` to version control

---

## Multi-Tenancy (optional — remove if not applicable)

- **Multi-tenant?**: yes
- **Tenant scoping strategy**: All DB queries filtered by `team_id` column using Eloquent global scopes
- **Tenant identification**: Authenticated user's current team (session-based)
- **Public ID format**: UUIDs everywhere (`$table->uuid('id')->primary()`)

---

## Database

- **ORM / abstraction**: Eloquent ORM
- **Migration system**: `php artisan migrate` (Laravel migrations)
- **Migration conventions**: Laravel migration classes in `database/migrations/`, named `YYYY_MM_DD_HHMMSS_description.php`
- **Repository conventions**: Eloquent models in `app/Models/`. For complex queries, use dedicated query classes in `app/Queries/`
- **Query conventions**: Use Eloquent query builder. Avoid raw SQL. Complex queries go through dedicated query classes. Always use `->where()` on update/delete

---

## Templates / Views

- **Engine**: Blade
- **Layout structure**: Blade layouts with `@extends('layouts.app')` and `@section('content')`. Component-based UI with `<x-*>` components
- **Component system**: Blade components in `app/View/Components/` and `resources/views/components/`
- **Escaping conventions**: `{{ $var }}` auto-escapes; `{!! $var !!}` only for pre-sanitized HTML
- **UI patterns**: Tailwind utility classes; reusable Blade components for cards, tables, forms, modals

---

## File Storage

- **Abstraction**: Laravel Storage facade (Flysystem)
- **User uploads**: Stored in S3 via `Storage::disk('s3')->put(...)`

---

## Logging & Error Handling

- **Logging mechanism**: Laravel `Log` facade (Monolog); channels configured in `config/logging.php`
- **Error handling**: Laravel exception handler (`app/Exceptions/Handler.php`); custom exception classes for domain errors
- **Error display policy**: Never expose stack traces in production; detailed errors only when `APP_DEBUG=true`

---

## Audit Logging (optional — remove if not applicable)

- **Audit logging mechanism**: Spatie Activity Log (`activity()->performedOn($model)->log('created')`)
- **Convention**: Verb-based event names: `'created'`, `'updated'`, `'deleted'`
- **When to log**: All create/update/delete operations on business entities (projects, tasks, team members)

---

## Translations / i18n

- **System**: Laravel `__()` / `trans()` helpers; `@lang()` Blade directive
- **Translation file format**: PHP arrays in `lang/en/`, `lang/pl/`, etc.

---

## Testing

- **Framework**: Pest
- **Test directory**: `tests/Unit/` and `tests/Feature/`
- **Run command**: `php artisan test`
- **Docker test command**: `./vendor/bin/sail test` or `docker compose exec laravel.test php artisan test`
- **Test conventions**: Pest style with `it()` / `expect()` / `test()`; feature tests use `$this->get()`, `$this->post()`, etc.

---

## Deployment

- **Docker?**: yes — Laravel Sail for development; custom Dockerfile for production
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)
- **Deployment method**: Docker image push to container registry + Kubernetes deployment

---

## Environment Setup

- **Local setup command**: `./vendor/bin/sail up -d` or `docker compose up -d`
- **Install dependencies**: `composer install && npm install && npm run build`
- **Database setup**: `php artisan migrate --seed`
- **Environment file**: Copy `.env.example` to `.env` and run `php artisan key:generate`
- **Required services**: MySQL 8, Redis

---

## Code Quality & Static Analysis (optional — remove if not applicable)

- **Static analysis**: PHPStan level 6 (`vendor/bin/phpstan analyse`)
- **Code style**: Laravel Pint (`vendor/bin/pint`)
- **Pre-commit hooks**: none
- **CI checks**: PHPStan + Pint + Pest in GitHub Actions

---

## API (optional — remove if not applicable)

- **API style**: REST
- **API prefix / versioning**: `/api/v1/*` (routes defined in `routes/api.php`)
- **Response format**: Laravel API Resources (`App\Http\Resources\*`)
- **Authentication**: Bearer token via Sanctum
- **Rate limiting**: Laravel RateLimiter (60 requests/min)
- **API documentation**: none

---

## Git Workflow (optional — remove if not applicable)

- **Branch strategy**: GitHub Flow (main + feature branches)
- **Branch naming**: `feature/short-description`, `fix/short-description`
- **Commit conventions**: Conventional Commits (`feat:`, `fix:`, `chore:`)
- **PR process**: Require 1 approval + passing CI

---

## Key Modules / Domains (optional — remove if not applicable)

- **Users**: Registration, authentication, profile, team management (`app/Models/User.php`, `app/Http/Controllers/UserController.php`)
- **Projects**: Project CRUD, team collaboration, settings (`app/Models/Project.php`, `app/Services/ProjectService.php`)
- **Tasks**: Task lifecycle, assignments, comments, attachments (`app/Models/Task.php`, `app/Http/Controllers/TaskController.php`)
- **Reports**: Analytics dashboards, CSV/PDF exports (`app/Services/ReportService.php`)

---

## Additional Notes

- Use `php artisan make:*` commands to generate boilerplate (controllers, models, migrations, etc.)
- Form Requests (`App\Http\Requests\*`) for input validation
- Resource classes (`App\Http\Resources\*`) for API responses
- Events and Listeners for cross-cutting concerns
- Jobs for async processing (email sending, report generation, etc.)
