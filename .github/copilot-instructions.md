# Project-Specific Copilot Instructions

> **This file is your project's "constitution" for all Copilot Chat Agents.**
> Fill in every section below so that the Orchestrator, Planner, Designer, Coder, FastCoder, Reviewer, and Tester agents understand your project's conventions.
> Replace all `<!-- FILL IN: ... -->` markers with your actual values.

---

## Project Overview

- **Project name**: <!-- FILL IN: e.g., "MyApp" -->
- **Description**: <!-- FILL IN: one-sentence summary of the application -->
- **PHP version**: <!-- FILL IN: e.g., 8.3, 8.4 -->
- **Runs in Docker?**: <!-- FILL IN: yes / no -->

---

## Architecture

- **Architectural pattern**: <!-- FILL IN: e.g., MVC, Hexagonal / Ports & Adapters, DDD, CQRS, Front Controller + MVC, microservices, etc. -->
- **Layers / flow**: <!-- FILL IN: e.g., "Controller → Service → Repository → Database" or "Handler → Command Bus → Domain → Infrastructure" -->
- **Entry point**: <!-- FILL IN: e.g., "public/index.php (front controller)", "bin/console (CLI)", "artisan" -->
- **Routing mechanism**: <!-- FILL IN: e.g., "Symfony Router", "Laravel routes/web.php", "custom front controller dispatch" -->

---

## Tech Stack

| Component         | Technology                                                                 |
|--------------------|---------------------------------------------------------------------------|
| **Framework**      | <!-- FILL IN: e.g., Laravel 11, Symfony 7, Slim 4, none (vanilla PHP) --> |
| **Template engine** | <!-- FILL IN: e.g., Blade, Twig, Smarty 5, plain PHP -->                |
| **CSS framework**  | <!-- FILL IN: e.g., Tailwind CSS, Bootstrap 5, AdminLTE 3 + Bootstrap 4 --> |
| **JS libraries**   | <!-- FILL IN: e.g., Alpine.js, Livewire, jQuery, Stimulus, vanilla JS --> |
| **Database**       | <!-- FILL IN: e.g., MySQL 8, PostgreSQL 16, MariaDB 11, SQLite -->       |
| **Cache**          | <!-- FILL IN: e.g., Redis, Memcached, APCu, none -->                     |
| **Queue / Jobs**   | <!-- FILL IN: e.g., Laravel Queues + Redis, Symfony Messenger, none -->   |

---

## Naming Conventions

- **Class naming**: <!-- FILL IN: e.g., "PSR-4 namespaced (App\Http\Controllers\UserController)", "Underscore-to-directory (Controller_UserController)", "PascalCase" -->
- **File naming**: <!-- FILL IN: e.g., "PSR-4 mapping (src/Http/Controllers/UserController.php)", "underscore auto-load mapping" -->
- **Autoloading**: <!-- FILL IN: e.g., "Composer PSR-4", "custom spl_autoload_register with underscore-to-directory mapping" -->
- **Method naming**: <!-- FILL IN: e.g., "camelCase", "snake_case" -->
- **Database tables**: <!-- FILL IN: e.g., "snake_case plural (users, order_items)", "singular (user, order_item)" -->

---

## Security

- **Authentication**: <!-- FILL IN: e.g., "Laravel Sanctum", "Symfony Security", "custom session-based auth with requireLogin()" -->
- **CSRF protection**: <!-- FILL IN: e.g., "@csrf in Blade forms", "csrf_token() in Twig", "verifyCsrfToken() on all POST actions" -->
- **XSS prevention**: <!-- FILL IN: e.g., "Blade auto-escapes by default", "{$var|escape} in Smarty", "htmlspecialchars() manually" -->
- **SQL injection prevention**: <!-- FILL IN: e.g., "Eloquent ORM / query builder", "Doctrine DBAL prepared statements", "custom execute_query() with parameterized queries" -->
- **Authorization / ACL**: <!-- FILL IN: e.g., "Laravel Gates & Policies", "Symfony Voters", "custom requireLogin() / requireTenantAdmin() / requireSuperAdmin() guards" -->
- **Secrets management**: <!-- FILL IN: e.g., ".env files via vlucas/phpdotenv", "Symfony secrets vault", "environment variables" -->

---

## Multi-Tenancy (optional — remove if not applicable)

- **Multi-tenant?**: <!-- FILL IN: yes / no -->
- **Tenant scoping strategy**: <!-- FILL IN: e.g., "All DB queries filtered by tenant_id column", "Separate databases per tenant", "Schema-based isolation" -->
- **Tenant identification**: <!-- FILL IN: e.g., "Subdomain", "Session / authenticated user", "URL path prefix", "Request header" -->
- **Public ID format**: <!-- FILL IN: e.g., "UUIDv7 in URLs, bigint internally", "UUIDs everywhere", "sequential IDs" -->

---

## Database

- **ORM / abstraction**: <!-- FILL IN: e.g., "Eloquent", "Doctrine ORM", "custom Repository pattern with PDO", "plain PDO" -->
- **Migration system**: <!-- FILL IN: e.g., "php artisan migrate", "doctrine:migrations:migrate", "manual SQL files in sql/migrations/", "Phinx" -->
- **Migration conventions**: <!-- FILL IN: e.g., "Laravel migration classes", "Doctrine migration classes", "raw SQL files named YYYYMMDD_NNN_description.sql" -->
- **Repository conventions**: <!-- FILL IN: e.g., "Eloquent models in app/Models/", "Doctrine repositories", "custom Repository_* classes extending a base DatabaseRepository" -->
- **Query conventions**: <!-- FILL IN: e.g., "Use query builder, avoid raw SQL", "All queries go through repository layer", "update()/delete() require non-empty WHERE clause" -->

---

## Templates / Views

- **Engine**: <!-- FILL IN: same as template engine above -->
- **Layout structure**: <!-- FILL IN: e.g., "Blade layouts with @extends/@section", "Twig base template with blocks", "Smarty {extends file='layout.tpl'} with blocks (title, content, scripts, styles)" -->
- **Component system**: <!-- FILL IN: e.g., "Blade components", "Twig includes/embeds", "Smarty includes", "none" -->
- **Escaping conventions**: <!-- FILL IN: e.g., "Blade {{ }} auto-escapes", "Twig {{ }} auto-escapes", "{$var|escape} required in Smarty" -->
- **UI patterns**: <!-- FILL IN: e.g., "Cards for content, DataTables for lists", "AdminLTE cards with card-header/card-body/card-footer", "custom component library" -->

---

## File Storage

- **Abstraction**: <!-- FILL IN: e.g., "Laravel Storage (Flysystem)", "Flysystem directly", "custom S3 wrapper", "local disk only" -->
- **User uploads**: <!-- FILL IN: e.g., "Stored in S3 via Storage facade", "Stored via custom Storage_S3Storage class", "local public/uploads/" -->

---

## Logging & Error Handling

- **Logging mechanism**: <!-- FILL IN: e.g., "Laravel Log facade (Monolog)", "Symfony Logger", "custom AppLogger class", "Monolog directly" -->
- **Error handling**: <!-- FILL IN: e.g., "Laravel exception handler", "Symfony error listener", "custom error handler that logs with UUID and returns safe messages" -->
- **Error display policy**: <!-- FILL IN: e.g., "Never expose stack traces to users", "Show detailed errors only in debug mode" -->

---

## Audit Logging (optional — remove if not applicable)

- **Audit logging mechanism**: <!-- FILL IN: e.g., "Custom auditRepo->log(tenantId, userId, 'domain.action', [details])", "Spatie Activity Log", "custom events table" -->
- **Convention**: <!-- FILL IN: e.g., "Dot-notation event names: 'user.created', 'order.deleted'", "Enum-based event types" -->
- **When to log**: <!-- FILL IN: e.g., "All create/update/delete operations on business entities" -->

---

## Translations / i18n

- **System**: <!-- FILL IN: e.g., "Laravel __() / trans()", "Symfony Translator", "custom AppTexts::t(...) / {$texts->text('key')}", "gettext", "none" -->
- **Translation file format**: <!-- FILL IN: e.g., "PHP arrays in lang/", "YAML in translations/", "JSON files", "PO/MO files" -->

---

## Testing

- **Framework**: <!-- FILL IN: e.g., "Pest", "PHPUnit", "custom CLI test scripts", "Codeception" -->
- **Test directory**: <!-- FILL IN: e.g., "tests/", "app/tests/", "tests/Unit/ and tests/Feature/" -->
- **Run command**: <!-- FILL IN: e.g., "php artisan test", "vendor/bin/phpunit", "docker compose exec php php /app/tests/<test>.php" -->
- **Docker test command** (if applicable): <!-- FILL IN: e.g., "docker compose exec php vendor/bin/phpunit", "docker compose exec app php artisan test" -->
- **Test conventions**: <!-- FILL IN: e.g., "Pest style with it() / expect()", "PHPUnit with test methods", "Custom assert_test() function in standalone CLI scripts" -->

---

## Deployment

- **Docker?**: <!-- FILL IN: yes / no — describe Dockerfile / docker-compose setup if yes -->
- **CI/CD**: <!-- FILL IN: e.g., "GitHub Actions", "GitLab CI", "Jenkins", "none" -->
- **Deployment method**: <!-- FILL IN: e.g., "Docker image push + Kubernetes", "Laravel Forge", "manual FTP", "Deployer" -->

---

## Environment Setup

- **Local setup command**: <!-- FILL IN: e.g., "docker compose up -d", "php artisan serve", "symfony server:start" -->
- **Install dependencies**: <!-- FILL IN: e.g., "composer install", "composer install && npm install && npm run build" -->
- **Database setup**: <!-- FILL IN: e.g., "php artisan migrate --seed", "php bin/console doctrine:migrations:migrate", "import sql/schema.sql" -->
- **Environment file**: <!-- FILL IN: e.g., "Copy .env.example to .env and run php artisan key:generate", "Copy .env.dist to .env.local" -->
- **Required services**: <!-- FILL IN: e.g., "MySQL, Redis", "PostgreSQL, RabbitMQ, Redis", "MySQL only" -->

---

## Code Quality & Static Analysis (optional — remove if not applicable)

- **Static analysis**: <!-- FILL IN: e.g., "PHPStan level 8 (vendor/bin/phpstan analyse)", "Psalm", "none" -->
- **Code style**: <!-- FILL IN: e.g., "Laravel Pint (vendor/bin/pint)", "PHP-CS-Fixer (vendor/bin/php-cs-fixer fix)", "PSR-12 manual", "none" -->
- **Pre-commit hooks**: <!-- FILL IN: e.g., "Husky + lint-staged", "GrumPHP", "none" -->
- **CI checks**: <!-- FILL IN: e.g., "PHPStan + Pint + PHPUnit in GitHub Actions", "PHP-CS-Fixer + PHPUnit in GitLab CI", "none" -->

---

## API (optional — remove if not applicable)

- **API style**: <!-- FILL IN: e.g., "REST", "GraphQL (Lighthouse)", "JSON-RPC", "none / server-rendered only" -->
- **API prefix / versioning**: <!-- FILL IN: e.g., "/api/v1/*", "/graphql", "no versioning" -->
- **Response format**: <!-- FILL IN: e.g., "Laravel API Resources (App\Http\Resources\*)", "Symfony Serializer + DTO", "manual json_encode()", "Fractal transformers" -->
- **Authentication**: <!-- FILL IN: e.g., "Bearer token via Sanctum", "JWT via lexik/jwt-authentication-bundle", "API key in header" -->
- **Rate limiting**: <!-- FILL IN: e.g., "Laravel RateLimiter (60/min)", "Symfony rate_limiter", "none" -->
- **API documentation**: <!-- FILL IN: e.g., "Swagger / OpenAPI via L5-Swagger", "API Platform", "Scribe", "none" -->

---

## Git Workflow (optional — remove if not applicable)

- **Branch strategy**: <!-- FILL IN: e.g., "Git Flow (main, develop, feature/*, hotfix/*)", "GitHub Flow (main + feature branches)", "trunk-based development" -->
- **Branch naming**: <!-- FILL IN: e.g., "feature/JIRA-123-short-description", "feature/short-description", "no convention" -->
- **Commit conventions**: <!-- FILL IN: e.g., "Conventional Commits (feat:, fix:, chore:)", "Free-form descriptive messages", "Jira ticket prefix" -->
- **PR process**: <!-- FILL IN: e.g., "Require 1 approval + passing CI", "Self-merge after CI passes", "manual review" -->

---

## Key Modules / Domains (optional — remove if not applicable)

<!-- FILL IN: List the main business modules/domains of your application so agents understand the project scope and can navigate the codebase more effectively. Example:

- **Users**: Registration, authentication, profile management (`app/Models/User.php`, `app/Http/Controllers/UserController.php`)
- **Products**: Product catalog, categories, pricing (`app/Models/Product.php`, `app/Services/ProductService.php`)
- **Orders**: Order lifecycle, checkout, payments (`app/Models/Order.php`, `app/Services/OrderService.php`)
- **Reports**: Analytics dashboards, CSV exports (`app/Services/ReportService.php`)

Remove this section if not needed. -->

---

## Additional Notes

<!-- FILL IN: Any other project-specific conventions, patterns, or rules that agents should know about. Remove this section if not needed. -->
