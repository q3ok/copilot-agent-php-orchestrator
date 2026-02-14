# Project-Specific Copilot Instructions — Vanilla PHP MVC Example

> This is a **filled-in example** of `.github/copilot-instructions.md` for a vanilla PHP project
> with a custom MVC framework, Smarty templates, and AdminLTE UI.
> Copy this to `.github/copilot-instructions.md` in your project and adjust the values to match your setup.

---

## Project Overview

- **Project name**: MyApp
- **Description**: A multi-tenant business management platform with inventory, invoicing, and reporting modules
- **PHP version**: 8.4
- **Runs in Docker?**: yes (Docker Compose with Apache + PHP + MySQL)

---

## Architecture

- **Architectural pattern**: Front Controller + MVC
- **Layers / flow**: Front Controller (`public/index.php`) → Router → Controller → Service → Repository → MySQL
- **Entry point**: `public/index.php` (front controller dispatches to controllers)
- **Routing mechanism**: Custom front controller dispatch — URL pattern `?controller=Store&action=editAction&id=<uuid>` maps to `Controller_StoreController::editAction()`

---

## Tech Stack

| Component         | Technology                                        |
|--------------------|--------------------------------------------------|
| **Framework**      | None (vanilla PHP with custom MVC framework)     |
| **Template engine** | Smarty 5                                        |
| **CSS framework**  | AdminLTE 3 + Bootstrap 4                         |
| **JS libraries**   | jQuery 3, Select2, SweetAlert2, DataTables       |
| **Database**       | MySQL 8                                          |
| **Cache**          | none                                             |
| **Queue / Jobs**   | none                                             |

---

## Naming Conventions

- **Class naming**: Underscore-to-directory (`Controller_StoreController`, `Repository_StoreRepository`, `Service_StoreService`)
- **File naming**: Underscore auto-load mapping (`app/Controller/StoreController.php`, `app/Repository/StoreRepository.php`)
- **Autoloading**: Custom `spl_autoload_register` with underscore-to-directory mapping (`Controller_StoreController` → `app/Controller/StoreController.php`)
- **Method naming**: camelCase; public actions end in `Action` (`listAction()`, `editAction()`, `deleteAction()`)
- **Database tables**: snake_case plural (`stores`, `products`, `order_items`)

---

## Security

- **Authentication**: Custom session-based authentication with `requireLogin()` guard
- **CSRF protection**: `verifyCsrfToken()` called on all POST actions; forms include `<input type="hidden" name="csrf_token" value="{$csrf_token}">`
- **XSS prevention**: `{$var|escape}` in all Smarty templates; `{$var|escape:'javascript'}` for JS context; never use raw `{$var}` with user-controlled data
- **SQL injection prevention**: Custom `execute_query()` with parameterized queries via `mysqli_stmt`. All DB access through repository methods (`query()/insert()/update()/delete()/select()`). Never use raw `bind_param()` or string concatenation
- **Authorization / ACL**: `requireLogin()`, `requireTenantAdmin($tenantId)`, `requireSuperAdmin()` guards at the start of every action method
- **Secrets management**: `.env` file via `vlucas/phpdotenv`; environment variables for DB credentials, S3 keys, etc.

---

## Multi-Tenancy (optional — remove if not applicable)

- **Multi-tenant?**: yes
- **Tenant scoping strategy**: All DB queries filtered by `tenant_id` column; repositories accept `$tenantId` parameter
- **Tenant identification**: Session / authenticated user's active tenant; resolved via `resolveTenantContextFromQuery()`
- **Public ID format**: UUIDv7 in URLs and UI, bigint internally; never expose bigint IDs to frontend/JS

---

## Database

- **ORM / abstraction**: Custom Repository pattern with PDO/mysqli
- **Migration system**: Manual SQL files in `sql/migrations/`
- **Migration conventions**: Raw SQL files named `YYYYMMDD_NNN_description.sql` (e.g., `20250115_001_add_stores_table.sql`). Applied manually via phpMyAdmin or CLI
- **Repository conventions**: Custom `Repository_*` classes extending `Repository_DatabaseRepository`. Methods: `query()`, `insert()`, `update()`, `delete()`, `select()`. All use `execute_query()` with parameterized queries
- **Query conventions**: All queries go through repository layer. `update()`/`delete()` require non-empty WHERE clause. No ORM — manual SQL with parameter binding

---

## Templates / Views

- **Engine**: Smarty 5
- **Layout structure**: `{extends file='layout.tpl'}` with blocks: `title`, `page_header`, `content`, `styles`, `scripts`
- **Component system**: Smarty `{include file='partials/table.tpl'}` for reusable fragments
- **Escaping conventions**: `{$var|escape}` required on all user-controlled variables; `{$var|escape:'javascript'}` for JS context; never use raw `{$var}` with user data
- **UI patterns**: AdminLTE 3 cards (`card card-outline card-primary` with `card-header app-card-header`, `card-body`, `card-footer`); `table-responsive app-table-responsive` → `table table-hover table-sm app-table`; Bootstrap 4 `form-group` + `form-control-sm`; destructive actions via `confirmAction(...)` (SweetAlert2 + POST with CSRF)

---

## File Storage

- **Abstraction**: Custom `Storage_S3Storage` class wrapping AWS SDK
- **User uploads**: Stored in S3 via `Storage_S3Storage`; never written to local container disk (except temporary `$_FILES['tmp_name']`)

---

## Logging & Error Handling

- **Logging mechanism**: Custom `AppLogger` class (wraps Monolog or file-based logging)
- **Error handling**: Custom error handler that logs with UUID (`AppLogger::errorWithUuid(...)`) and returns safe error messages to user
- **Error display policy**: Never expose stack traces to users; log full details server-side with reference UUID

---

## Audit Logging (optional — remove if not applicable)

- **Audit logging mechanism**: Custom `$this->auditRepo->log($tenantId, $userId, 'domain.action', [details])` via `Repository_AuditRepository`
- **Convention**: Dot-notation event names: `'store.created'`, `'product.updated'`, `'order.deleted'`
- **When to log**: All create/update/delete operations on business entities

---

## Translations / i18n

- **System**: Custom `AppTexts::t('key')` in PHP; `{$texts->text('key')}` in Smarty templates
- **Translation file format**: PHP arrays in `app/translations/` (e.g., `en.php`, `pl.php`)

---

## Testing

- **Framework**: Custom CLI test scripts (standalone, no framework dependency)
- **Test directory**: `app/tests/`
- **Run command**: `php app/tests/test_name.php`
- **Docker test command**: `docker compose exec php php /app/tests/test_name.php`
- **Test conventions**: Each test file is a standalone CLI script using custom `assert_test(string $name, bool $condition)` function. Pattern: require autoload → define tests → print summary → exit with code

---

## Deployment

- **Docker?**: yes — Docker Compose with Apache + PHP 8.4 + MySQL 8. Dockerfile in project root
- **CI/CD**: none (manual deployment)
- **Deployment method**: `docker compose up -d` on server; DB migrations applied manually via phpMyAdmin

---

## Environment Setup

- **Local setup command**: `docker compose up -d`
- **Install dependencies**: `composer install`
- **Database setup**: Import `sql/schema.sql` via phpMyAdmin or CLI; apply migrations from `sql/migrations/` in order
- **Environment file**: Copy `.env.example` to `.env` and fill in database credentials and S3 keys
- **Required services**: MySQL 8

---

## Code Quality & Static Analysis (optional — remove if not applicable)

- **Static analysis**: none
- **Code style**: PSR-12 (manual adherence, no automated tool)
- **Pre-commit hooks**: none
- **CI checks**: none

---

## API (optional — remove if not applicable)

- **API style**: none / server-rendered only

---

## Git Workflow (optional — remove if not applicable)

- **Branch strategy**: GitHub Flow (main + feature branches)
- **Branch naming**: `feature/short-description`
- **Commit conventions**: Free-form descriptive messages
- **PR process**: Manual review

---

## Key Modules / Domains (optional — remove if not applicable)

- **Stores**: Store CRUD, settings, logo upload (`app/Controller/StoreController.php`, `app/Repository/StoreRepository.php`)
- **Products**: Product catalog, categories, pricing, stock (`app/Controller/ProductController.php`, `app/Repository/ProductRepository.php`)
- **Orders**: Order lifecycle, invoicing, PDF generation (`app/Controller/OrderController.php`, `app/Service/InvoiceService.php`)
- **Reports**: Sales reports, inventory reports, CSV export (`app/Controller/ReportController.php`, `app/Service/ReportService.php`)

---

## Additional Notes

- Services are created through `Factory_Service` factory class
- Singletons use `getInstance()` pattern
- Only `*Action` methods (and `index`) are URL-callable in controllers — other public methods are NOT routable
- Flash messages via `addMessage($type, $text)` helper
- FontAwesome 5 icons (`fas fa-*`, `far fa-*`)
- Select2 with Bootstrap 4 theme for enhanced select inputs
- Custom CSS classes: `app-card-header`, `app-table`, `app-table-responsive` — use for consistency
- Validation via `rakit/validation` library
