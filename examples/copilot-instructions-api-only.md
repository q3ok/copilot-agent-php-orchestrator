# Project-Specific Copilot Instructions — API-Only (Laravel) Example

> This is a **filled-in example** of `.github/copilot-instructions.md` for a headless API-only Laravel project.
> No Blade templates, no frontend — pure REST API with Sanctum token authentication.
> Copy this to `.github/copilot-instructions.md` in your project and adjust the values to match your setup.

---

## Project Overview

- **Project name**: MyAPI
- **Description**: A headless REST API for a mobile e-commerce application — products, orders, payments, and user management
- **PHP version**: 8.4
- **Runs in Docker?**: yes (Docker Compose with PHP-FPM + Nginx)

---

## Architecture

- **Architectural pattern**: MVC with Service layer + Action classes for complex operations
- **Layers / flow**: Route → Middleware → Controller → Action/Service → Model (Eloquent) → Database
- **Entry point**: `public/index.php` (Laravel front controller)
- **Routing mechanism**: Laravel Router (`routes/api.php` only — no `routes/web.php`)

---

## Tech Stack

| Component         | Technology                                        |
|--------------------|--------------------------------------------------|
| **Framework**      | Laravel 11                                       |
| **Template engine** | None (API-only, no views)                       |
| **CSS framework**  | None                                             |
| **JS libraries**   | None                                             |
| **Database**       | PostgreSQL 16                                    |
| **Cache**          | Redis (Laravel Cache)                            |
| **Queue / Jobs**   | Laravel Queues + Redis                           |

---

## Naming Conventions

- **Class naming**: PSR-4 namespaced (`App\Http\Controllers\Api\V1\ProductController`, `App\Models\Product`, `App\Services\OrderService`, `App\Actions\PlaceOrderAction`)
- **File naming**: PSR-4 mapping (`app/Http/Controllers/Api/V1/ProductController.php`)
- **Autoloading**: Composer PSR-4 (`"App\\": "app/"`)
- **Method naming**: camelCase (`getActiveProducts()`, `calculateDiscount()`)
- **Database tables**: snake_case plural (`users`, `products`, `order_items`, `payment_transactions`)

---

## Security

- **Authentication**: Laravel Sanctum (API token-based — `Authorization: Bearer <token>`)
- **CSRF protection**: Not applicable (API-only, no web routes; Sanctum tokens are used instead)
- **XSS prevention**: Not applicable (no HTML rendering; all responses are JSON)
- **SQL injection prevention**: Eloquent ORM / query builder with parameterized queries; never use `DB::raw()` with user input
- **Authorization / ACL**: Laravel Gates & Policies for resource-level authorization; Spatie Permission for role-based access (`admin`, `customer`, `vendor`)
- **Secrets management**: `.env` files; never commit `.env`; production secrets via environment variables

---

## Multi-Tenancy (optional — remove if not applicable)

- **Multi-tenant?**: no

---

## Database

- **ORM / abstraction**: Eloquent ORM
- **Migration system**: `php artisan migrate` (Laravel migrations)
- **Migration conventions**: Laravel migration classes in `database/migrations/`, named `YYYY_MM_DD_HHMMSS_description.php`
- **Repository conventions**: Eloquent models in `app/Models/`. Complex query logic in Action classes (`app/Actions/`) or dedicated query classes (`app/Queries/`)
- **Query conventions**: Use Eloquent query builder. Avoid raw SQL. Always scope `update()`/`delete()` with `->where()`. Use eager loading (`->with()`) to prevent N+1 queries

---

## Templates / Views

- **Engine**: None (API-only — no HTML rendering)
- **Layout structure**: N/A
- **Component system**: N/A
- **Escaping conventions**: N/A
- **UI patterns**: N/A

---

## File Storage

- **Abstraction**: Laravel Storage facade (Flysystem)
- **User uploads**: Stored in S3 via `Storage::disk('s3')->put(...)`. Upload via multipart form-data API endpoints. Signed URLs for private file access

---

## Logging & Error Handling

- **Logging mechanism**: Laravel `Log` facade (Monolog); JSON-formatted logs for production (parsed by centralized log system)
- **Error handling**: Custom exception handler renders all errors as JSON (`{"message": "...", "errors": {...}}`); custom exception classes in `app/Exceptions/`
- **Error display policy**: Never expose stack traces in production; standard HTTP status codes (400, 401, 403, 404, 422, 500); validation errors return 422 with field-level details

---

## Audit Logging (optional — remove if not applicable)

- **Audit logging mechanism**: Spatie Activity Log for model changes; custom `AuditService` for business events
- **Convention**: Verb-based event names: `'created'`, `'updated'`, `'deleted'`, `'order.placed'`, `'payment.processed'`
- **When to log**: All CRUD operations on business entities; payment transactions; authentication events (login, logout, token creation)

---

## Translations / i18n

- **System**: Laravel `__()` for API error messages and validation messages
- **Translation file format**: PHP arrays in `lang/en/`, `lang/pl/`

---

## Testing

- **Framework**: Pest
- **Test directory**: `tests/Unit/` and `tests/Feature/`
- **Run command**: `php artisan test`
- **Docker test command**: `docker compose exec app php artisan test`
- **Test conventions**: Pest style with `it()` / `expect()`; feature tests use `$this->getJson()`, `$this->postJson()`, etc.; always assert JSON structure and HTTP status codes; use `actingAs($user)` for authenticated requests

---

## Deployment

- **Docker?**: yes — Docker Compose for dev (PHP-FPM 8.4, Nginx, PostgreSQL 16, Redis); multi-stage Dockerfile for production
- **CI/CD**: GitHub Actions (lint + test + build + deploy)
- **Deployment method**: Docker image push to ECR + ECS Fargate deployment

---

## Environment Setup

- **Local setup command**: `docker compose up -d`
- **Install dependencies**: `docker compose exec app composer install`
- **Database setup**: `docker compose exec app php artisan migrate --seed`
- **Environment file**: Copy `.env.example` to `.env` and run `docker compose exec app php artisan key:generate`
- **Required services**: PostgreSQL 16, Redis

---

## Code Quality & Static Analysis (optional — remove if not applicable)

- **Static analysis**: PHPStan level 8 (`vendor/bin/phpstan analyse`)
- **Code style**: Laravel Pint (`vendor/bin/pint`)
- **Pre-commit hooks**: none
- **CI checks**: PHPStan + Pint + Pest in GitHub Actions

---

## API (optional — remove if not applicable)

- **API style**: REST
- **API prefix / versioning**: `/api/v1/*` (versioned via URL prefix; `routes/api.php` uses `Route::prefix('v1')`)
- **Response format**: Laravel API Resources (`App\Http\Resources\ProductResource`, `App\Http\Resources\OrderResource`); collections wrap in `data` key with pagination metadata
- **Authentication**: Bearer token via Sanctum (`Authorization: Bearer <token>`); tokens issued via `POST /api/v1/auth/login`
- **Rate limiting**: Laravel RateLimiter — 60 requests/min for authenticated users, 20/min for guests (configured in `app/Providers/RouteServiceProvider.php`)
- **API documentation**: Scribe (`php artisan scribe:generate`) — auto-generated OpenAPI docs at `/docs`

---

## Git Workflow (optional — remove if not applicable)

- **Branch strategy**: GitHub Flow (main + feature branches)
- **Branch naming**: `feature/short-description`, `fix/short-description`, `hotfix/short-description`
- **Commit conventions**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`)
- **PR process**: Require 1 approval + passing CI; squash merge to main

---

## Key Modules / Domains (optional — remove if not applicable)

- **Auth**: Registration, login, token management, password reset (`app/Http/Controllers/Api/V1/AuthController.php`, `app/Actions/Auth/`)
- **Products**: Product catalog, categories, search, filtering (`app/Models/Product.php`, `app/Http/Controllers/Api/V1/ProductController.php`)
- **Orders**: Order lifecycle, cart → checkout → fulfillment (`app/Models/Order.php`, `app/Actions/PlaceOrderAction.php`)
- **Payments**: Payment processing via Stripe, refunds, webhooks (`app/Services/PaymentService.php`, `app/Http/Controllers/Api/V1/WebhookController.php`)
- **Users**: Profile management, addresses, preferences (`app/Models/User.php`, `app/Http/Controllers/Api/V1/UserController.php`)

---

## Additional Notes

- All controllers extend `App\Http\Controllers\Api\BaseApiController` with common JSON response helpers
- Form Requests (`App\Http\Requests\*`) for all input validation
- API Resources (`App\Http\Resources\*`) for all output formatting — never return raw models
- Action classes (`App\Actions\*`) for complex business operations (single-responsibility)
- Events + Listeners for cross-cutting concerns (email notifications, audit logging)
- Jobs for async processing (payment webhooks, order confirmation emails, report generation)
- Custom middleware: `EnsureJsonRequest` (forces `Accept: application/json`), `LogApiRequest` (request/response logging)
- Health check endpoint: `GET /api/health` (no auth required)
