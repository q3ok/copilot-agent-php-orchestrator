# Project-Specific Copilot Instructions — Symfony 7+ Example

> This is a **filled-in example** of `.github/copilot-instructions.md` for a typical Symfony 7+ project.
> Copy this to `.github/copilot-instructions.md` in your project and adjust the values to match your setup.

---

## Project Overview

- **Project name**: MySymfonyApp
- **Description**: An enterprise content management system with workflow automation and multi-language support
- **PHP version**: 8.4
- **Runs in Docker?**: yes (Docker Compose with PHP-FPM + Nginx)

---

## Architecture

- **Architectural pattern**: Hexagonal / Ports & Adapters with CQRS-lite (commands and queries separated, no event sourcing)
- **Layers / flow**: Controller → Command/Query Bus → Handler → Domain Service → Repository → Database
- **Entry point**: `public/index.php` (Symfony front controller)
- **Routing mechanism**: Symfony Router with PHP attributes (`#[Route]`) in controllers

---

## Tech Stack

| Component         | Technology                                        |
|--------------------|--------------------------------------------------|
| **Framework**      | Symfony 7.2                                      |
| **Template engine** | Twig 3                                          |
| **CSS framework**  | Bootstrap 5 (via Webpack Encore)                 |
| **JS libraries**   | Stimulus, Turbo (Symfony UX)                    |
| **Database**       | PostgreSQL 16                                    |
| **Cache**          | Redis (Symfony Cache component)                  |
| **Queue / Jobs**   | Symfony Messenger + RabbitMQ                     |

---

## Naming Conventions

- **Class naming**: PSR-4 namespaced (`App\Controller\ContentController`, `App\Entity\Content`, `App\Repository\ContentRepository`)
- **File naming**: PSR-4 mapping (`src/Controller/ContentController.php`)
- **Autoloading**: Composer PSR-4 (`"App\\": "src/"`)
- **Method naming**: camelCase (`findPublishedContent()`, `handleCreateCommand()`)
- **Database tables**: snake_case singular (`content`, `workflow_step`, `user_role`)

---

## Security

- **Authentication**: Symfony Security component with form login + remember-me; API auth via JWT (lexik/jwt-authentication-bundle)
- **CSRF protection**: `csrf_token()` in Twig forms; `#[IsCsrfTokenValid]` attribute or `isCsrfTokenValid()` in controllers
- **XSS prevention**: Twig `{{ }}` auto-escapes by default; use `|raw` filter only for trusted HTML
- **SQL injection prevention**: Doctrine DBAL with prepared statements; DQL/QueryBuilder for all queries; never concatenate user input
- **Authorization / ACL**: Symfony Voters (`App\Security\Voter\ContentVoter`); `#[IsGranted]` attribute; role hierarchy in `security.yaml`
- **Secrets management**: Symfony Secrets vault for production; `.env.local` for development

---

## Multi-Tenancy (optional — remove if not applicable)

- **Multi-tenant?**: yes
- **Tenant scoping strategy**: Doctrine filters automatically add `WHERE organization_id = ?` to all queries
- **Tenant identification**: Subdomain-based (`tenant1.myapp.com`)
- **Public ID format**: UUIDs (Symfony Uid component)

---

## Database

- **ORM / abstraction**: Doctrine ORM 3 with Doctrine DBAL
- **Migration system**: `php bin/console doctrine:migrations:migrate` (DoctrineMigrationsBundle)
- **Migration conventions**: Doctrine migration classes in `migrations/`, auto-generated via `doctrine:migrations:diff`
- **Repository conventions**: Doctrine repositories in `src/Repository/`, extending `ServiceEntityRepository`. Custom query methods follow `findBy*` / `findOneBy*` pattern
- **Query conventions**: Use DQL or QueryBuilder. Avoid raw SQL. Complex reporting queries may use DBAL with named parameters (`->setParameter()`)

---

## Templates / Views

- **Engine**: Twig 3
- **Layout structure**: Twig template inheritance with `{% extends 'base.html.twig' %}` and `{% block content %}`. Reusable fragments via `{% include %}` and `{% embed %}`
- **Component system**: Twig Components (Symfony UX) in `src/Twig/Components/` and `templates/components/`
- **Escaping conventions**: `{{ var }}` auto-escapes; `{{ var|raw }}` only for pre-sanitized HTML; `{{ var|e('js') }}` for JS context
- **UI patterns**: Bootstrap 5 cards, tables, forms; Stimulus controllers for interactive behavior; Turbo Frames for partial page updates

---

## File Storage

- **Abstraction**: Flysystem (league/flysystem-bundle) with S3 adapter
- **User uploads**: Stored in S3 via Flysystem; file metadata tracked in `uploaded_file` entity

---

## Logging & Error Handling

- **Logging mechanism**: Monolog (via Symfony MonologBundle); channels: `app`, `security`, `doctrine`
- **Error handling**: Symfony error handling with custom `ExceptionListener`; domain exceptions extend `App\Exception\DomainException`
- **Error display policy**: Never expose stack traces in production; Symfony debug toolbar in `dev` environment only

---

## Audit Logging (optional — remove if not applicable)

- **Audit logging mechanism**: Custom `AuditLogger` service; events dispatched via Symfony EventDispatcher and persisted to `audit_log` table
- **Convention**: Dot-notation event names: `'content.created'`, `'workflow.approved'`, `'user.role_changed'`
- **When to log**: All create/update/delete operations on business entities; all workflow state transitions; permission changes

---

## Translations / i18n

- **System**: Symfony Translator component; `{{ 'key'|trans }}` in Twig; `$translator->trans('key')` in PHP
- **Translation file format**: YAML files in `translations/` (`messages.en.yaml`, `messages.pl.yaml`)

---

## Testing

- **Framework**: PHPUnit 11 (with Symfony test helpers)
- **Test directory**: `tests/Unit/`, `tests/Functional/`, `tests/Integration/`
- **Run command**: `php bin/phpunit` or `vendor/bin/phpunit`
- **Docker test command**: `docker compose exec php php bin/phpunit`
- **Test conventions**: PHPUnit test classes extending `TestCase` or `KernelTestCase` / `WebTestCase`; method names prefixed with `test` or annotated with `#[Test]`

---

## Deployment

- **Docker?**: yes — Docker Compose for dev (PHP-FPM, Nginx, PostgreSQL, Redis, RabbitMQ); multi-stage Dockerfile for production
- **CI/CD**: GitHub Actions with `phpunit`, `phpstan`, `cs-fixer` steps
- **Deployment method**: Docker image push to registry + Kubernetes deployment via Helm chart

---

## Additional Notes

- Use `php bin/console make:*` commands (MakerBundle) to generate boilerplate
- DTOs for command/query objects (`App\Command\CreateContentCommand`)
- Symfony Forms for complex form handling with built-in validation
- Symfony Workflow component for content approval workflows
- Use PHPStan (level 8) and PHP-CS-Fixer for static analysis and code style
