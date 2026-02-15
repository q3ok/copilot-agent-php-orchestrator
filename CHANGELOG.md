# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **Cost considerations** section in README — explains premium request usage and cost optimization tips.
- **Complexity estimation** in Planner agent — outputs Low/Medium/High rating with time estimate to help Orchestrator decide between FastCoder and Coder.
- **Dark mode / theming** requirement in Designer agent — ensures new UI works across all themes.
- **New template sections** in `copilot-instructions.md`: Environment Setup, Code Quality & Static Analysis, API, Git Workflow, Key Modules / Domains.
- **API-Only example** (`examples/copilot-instructions-api-only.md`) — headless Laravel REST API with Sanctum, Scribe docs, and Action classes.
- **New sections** added to all existing examples (Laravel, Symfony, Vanilla MVC): Environment Setup, Code Quality, API, Git Workflow, Key Modules.
- **CI validation** for template and examples — verifies `copilot-instructions.md` template contains `<!-- FILL IN: -->` markers and examples do not.

### Changed
- **Consistent frontmatter** — all agent files use standard YAML frontmatter (`---` delimited). Validation script supports both plain frontmatter and optional `chatagent` fencing.

