# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **Researcher agent** (`Researcher.agent.md`) — new specialized agent for deep codebase analysis, external library evaluation, dependency mapping, and information gathering. Produces structured findings reports with evidence. Fills the gap between user requests and Planner's plans by providing thorough investigation.
- **Devil's advocate analysis** in Reviewer agent — new adversarial review section that challenges assumptions and probes for edge cases beyond standard compliance checks (race conditions, unexpected inputs, temporal coupling, abstraction fitness, business logic abuse).
- **Anti-pattern rules** in Orchestrator agent — explicit prohibition against reading source code, running commands, or analyzing the codebase directly. All investigation must be delegated to Researcher or Planner.
- **Researcher delegation template** in Orchestrator — prompt template and example (Example F) for Researcher usage.
- **Designer skip prevention** — new anti-pattern in Orchestrator explicitly prohibiting skipping Designer when the request involves new views, templates, layouts, or any user-facing UI changes. Includes clear REQUIRED/SKIP criteria in the workflow step.

### Changed
- **FastCoder model changed** — switched from `Claude Haiku 4.5` to `GPT-5 mini` for zero premium request cost. FastCoder handles simple, well-defined tasks where deep reasoning is not required, making it ideal for a free-tier model.
- **Orchestrator agents list** — expanded to include `researcher` subagent.
- **Orchestrator workflow** — updated default workflow to include Researcher step (step 2) before Planner. Step numbers shifted accordingly.
- **Orchestrator Designer delegation** — changed from conditional `(if UI/UX involved)` to explicit criteria: REQUIRED for new views/templates/layouts/UI components; SKIP only for pure backend/API/config/CLI changes.
- **Orchestrator anti-patterns restructured** — split into two logical subsections ("Do not analyze or implement directly" and "Do not skip Designer for UI work") with clear ❌/✅ pairing for each group.
- **Consistent ❌/✅ markers across all agents** — added visual markers to "What you do NOT do" sections in Planner, Researcher, Reviewer, Tester, and AutoConfig. Added ✅/❌ markers to FastCoder task eligibility lists. All use gerund form (e.g., "❌ **Writing code**") to avoid double negatives with the ❌ symbol.
- **Tester model changed** — switched from `GPT-5.3-Codex` to `Gemini 3 Pro (Preview)` for model diversity (Tester now uses a different model than Coder, reducing shared blind spots).
- **Reviewer output format** — added `Devil's Advocate` as a finding category alongside Security, Architecture, Logic, and Quality.

## [v0.1.0] - 2026-02-15

### Added
- **AutoConfig agent** (`AutoConfig.agent.md`) — one-shot utility agent that scans the entire PHP project and auto-fills `.github/copilot-instructions.md`. Detects framework, architecture, naming conventions, database, security, testing, CI/CD, and more. Provides confidence levels (HIGH/MEDIUM/LOW) per section. Re-runnable: preserves manual customizations when the project evolves.
- **Cost considerations** section in README — explains premium request usage and cost optimization tips.
- **Complexity estimation** in Planner agent — outputs Low/Medium/High rating with time estimate to help Orchestrator decide between FastCoder and Coder.
- **Dark mode / theming** requirement in Designer agent — ensures new UI works across all themes.
- **New template sections** in `copilot-instructions.md`: Environment Setup, Code Quality & Static Analysis, API, Git Workflow, Key Modules / Domains.
- **API-Only example** (`examples/copilot-instructions-api-only.md`) — headless Laravel REST API with Sanctum, Scribe docs, and Action classes.
- **New sections** added to all existing examples (Laravel, Symfony, Vanilla MVC): Environment Setup, Code Quality, API, Git Workflow, Key Modules.
- **CI validation** for template and examples — verifies `copilot-instructions.md` template contains `<!-- FILL IN: -->` markers and examples do not.

### Changed
- **Consistent frontmatter** — all agent files use standard YAML frontmatter (`---` delimited). Validation script supports both plain frontmatter and optional `chatagent` fencing.

## Links
- [Unreleased]: https://github.com/q3ok/copilot-agent-php-orchestrator/compare/v0.1.0...HEAD
- [v0.1.0]: https://github.com/q3ok/copilot-agent-php-orchestrator/releases/tag/v0.1.0

