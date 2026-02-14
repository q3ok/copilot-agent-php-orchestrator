# PHP Agent Orchestrator for GitHub Copilot Chat

**A multi-agent orchestration toolkit for PHP projects — 7 specialized AI agents that plan, design, code, review, and test your PHP application.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![PHP](https://img.shields.io/badge/PHP-8.x-777BB4.svg)](https://www.php.net/)

---

**MAKE PHP GREAT AGAIN**

---

## What is this?

This repository provides a set of **GitHub Copilot Chat Agent definition files** (`.github/agents/*.agent.md`) that turn GitHub Copilot into a coordinated team of specialized AI agents for PHP development.

Instead of a single general-purpose assistant, you get **7 agents** with distinct roles — an Orchestrator that delegates work, a Planner that strategizes, a Designer for UI decisions, a Coder and FastCoder for implementation, a Reviewer for quality gates, and a Tester for verification.

The agents are **framework-agnostic** — they work with Laravel, Symfony, vanilla PHP, or any other PHP stack. You customize them for your project by filling in a single template file (`.github/copilot-instructions.md`).

### Key features

- **Multi-agent orchestration** — complex tasks are broken down and delegated to specialists
- **Security-first mindset** — every agent considers CSRF, XSS, SQL injection, ACL, and data isolation
- **Framework-agnostic** — works with any PHP project via a customizable configuration template
- **Quality gates** — mandatory code review and testing steps before shipping
- **Parallel execution** — independent tasks run concurrently for faster delivery
- **Escalation patterns** — FastCoder escalates to Coder when tasks are too complex

---

## The Orchestration Pattern

```mermaid
graph TD
    User([👤 User Request]) --> Orchestrator

    Orchestrator --> Planner
    Orchestrator --> Designer
    Orchestrator --> Coder
    Orchestrator --> FastCoder
    Orchestrator --> Tester
    Orchestrator --> Reviewer

    Planner -->|plan| Orchestrator
    Designer -->|design spec| Orchestrator
    Coder -->|implementation| Orchestrator
    FastCoder -->|quick fix| Orchestrator
    FastCoder -.->|escalate| Coder
    Tester -->|test results| Orchestrator
    Reviewer -->|review verdict| Orchestrator

    Reviewer -->|NEEDS FIXES| Orchestrator
    Orchestrator -->|fix request| Coder

    Orchestrator --> Response([📋 Final Response])

    style Orchestrator fill:#4A90D9,stroke:#333,color:#fff
    style Planner fill:#7CB342,stroke:#333,color:#fff
    style Designer fill:#AB47BC,stroke:#333,color:#fff
    style Coder fill:#FF7043,stroke:#333,color:#fff
    style FastCoder fill:#FFA726,stroke:#333,color:#fff
    style Tester fill:#26A69A,stroke:#333,color:#fff
    style Reviewer fill:#EF5350,stroke:#333,color:#fff
```

### Agent roles at a glance

| Agent | Role | Writes Code? | Key Trait |
|-------|------|:---:|-----------|
| **Orchestrator** | Breaks down requests, delegates to specialists, coordinates results | ❌ | Never implements — only delegates |
| **Planner** | Researches codebase, identifies edge cases, produces implementation plans | ❌ | Verifies docs, considers security |
| **Designer** | Owns UX/UI decisions within the project's design system | ❌ | Usability + accessibility first |
| **Coder** | Implements features, fixes bugs, writes tests | ✅ | Follows repo conventions strictly |
| **FastCoder** | Executes simple, well-defined tasks quickly | ✅ | Speed — escalates if ambiguous |
| **Reviewer** | Code review against security/architecture checklist | ❌ | Quality gate — finds problems |
| **Tester** | Writes and runs verification tests | ✅ (tests only) | Validates implementations |

---

## Quick Start

### 1. Copy agent files

Copy the `.github/agents/` directory into your PHP project:

```bash
# From your project root
cp -r path/to/php-agent-orchestrator/.github/agents .github/agents
```

### 2. Customize for your project

Copy the template and fill it in with your project's specifics:

```bash
cp path/to/php-agent-orchestrator/.github/copilot-instructions.md .github/copilot-instructions.md
```

Edit `.github/copilot-instructions.md` — replace all `<!-- FILL IN: ... -->` markers with your actual values. See [`examples/`](examples/) for complete examples with Laravel, Symfony, and vanilla PHP.

### 3. Use in VS Code

Open your project in VS Code with GitHub Copilot Chat. The agents are automatically available. Invoke the Orchestrator for complex tasks:

```
@orchestrator Add a user profile page with avatar upload and email change functionality
```

Or invoke specific agents directly:

```
@planner Plan the implementation of a notification system
@coder Fix the pagination bug in the product listing
@reviewer Review all current git changes
```

---

## Agent Roles

### Orchestrator

The central coordinator. Receives user requests, breaks them into tasks, and delegates to the right specialist. Never writes code. Ensures proper workflow: Plan → Design → Code → Test → Review.

**When to use**: Any complex request, multi-step tasks, or when you want the full orchestrated workflow.

### Planner

Researches the codebase and external documentation. Produces structured implementation plans with security considerations, edge cases, and ordered steps. Never writes code.

**When to use**: Before implementing complex features. When you need a strategy before coding.

### Designer

Owns UI/UX decisions. Produces design specs, layout decisions, and interaction patterns within the project's existing design system.

**When to use**: When building new UI, redesigning existing views, or making visual/interaction decisions.

### Coder

The primary implementation agent. Writes code following all repo conventions, security rules, and architectural patterns. Consults documentation for APIs and frameworks.

**When to use**: Feature implementation, bug fixes, refactoring, complex changes.

### FastCoder

A lightweight, fast implementation agent for simple, well-defined tasks. Requires clear specs. Escalates to Coder immediately if ambiguity is found.

**When to use**: Config changes, typo fixes, simple CSS, single-file edits under 5 minutes.

### Reviewer

Performs thorough code review against a comprehensive checklist covering security, architecture, logic, performance, and code quality. Never modifies code — only reports findings.

**When to use**: After implementation, before merging. Quality gate.

### Tester

Writes and runs verification tests for implemented changes. Covers security guards, edge cases, error handling, and regression scenarios. Never modifies production code.

**When to use**: After implementation, to verify changes work correctly.

---

## Customization Guide

### Project configuration (`copilot-instructions.md`)

The `.github/copilot-instructions.md` file is the single source of truth for your project's conventions. Every agent reads it as their "constitution." Key sections:

| Section | What to fill in |
|---------|-----------------|
| **Project Overview** | Name, PHP version, Docker usage |
| **Architecture** | MVC, DDD, hexagonal, etc. + layer flow |
| **Tech Stack** | Framework, template engine, CSS, JS, DB |
| **Security** | Auth, CSRF, XSS, SQL injection, ACL mechanisms |
| **Database** | ORM, migrations, repository conventions |
| **Testing** | Framework, directory, runner command |

### Adjusting models

Each agent file has a `model` field in the frontmatter. Defaults are sensible starting points, but adjust based on your preferences and budget:

```yaml
model: claude-sonnet-4  # Change to your preferred model
```

### Adding MCP tools

If you use MCP tool servers (e.g., Context7 for API docs, Docker tools), add them to the `tools` list in the agent frontmatter:

```yaml
tools: [vscode, execute, read, agent, edit, search, web, todo, 'io.github.upstash/context7/*']
```

---

## Model Recommendations

| Agent | Default Model | Category | Why |
|-------|---------------|----------|-----|
| **Orchestrator** | `claude-sonnet-4` | Strong reasoning | Must understand complex requests and coordinate multiple agents |
| **Planner** | `claude-sonnet-4` | Deep analysis | Needs to research codebases, verify docs, identify edge cases |
| **Designer** | `claude-sonnet-4` | Creative + analytical | Balances aesthetics, usability, and technical constraints |
| **Coder** | `claude-sonnet-4` | Strong coding | Complex implementations, multi-file changes, architecture |
| **FastCoder** | `gpt-4.1-mini` | Fast + cheap | Simple tasks; speed matters more than deep reasoning |
| **Reviewer** | `claude-sonnet-4` | Thorough analysis | Must systematically check security, architecture, logic |
| **Tester** | `claude-sonnet-4` | Strong coding | Writes effective tests, understands edge cases |

---

## Examples

Three complete example configurations are provided in [`examples/`](examples/):

| Example | Stack | Key features |
|---------|-------|-------------|
| [Laravel](examples/copilot-instructions-laravel.md) | Laravel 11, Eloquent, Blade, Tailwind, Pest | Sanctum auth, Spatie permissions, Sail, S3 storage |
| [Symfony](examples/copilot-instructions-symfony.md) | Symfony 7, Doctrine, Twig, Bootstrap 5, PHPUnit | Hexagonal architecture, Symfony Security, Messenger |
| [Vanilla MVC](examples/copilot-instructions-vanilla-mvc.md) | Custom MVC, Smarty 5, AdminLTE 3, custom repos | Front Controller, custom auth guards, CLI test scripts |

---

## Project Structure

```
.github/
├── agents/
│   ├── Orchestrator.agent.md    # Central coordinator
│   ├── Planner.agent.md         # Strategy & planning
│   ├── Designer.agent.md        # UX/UI decisions
│   ├── Coder.agent.md           # Implementation
│   ├── FastCoder.agent.md       # Quick tasks
│   ├── Reviewer.agent.md        # Code review
│   └── Tester.agent.md          # Test writing & execution
└── copilot-instructions.md      # Template — customize for your project
examples/
├── copilot-instructions-laravel.md
├── copilot-instructions-symfony.md
└── copilot-instructions-vanilla-mvc.md
.gitignore
CONTRIBUTING.md
LICENSE                          # GPL v3
README.md
```

---

## FAQ

### Do I need all 7 agents?

No. The Orchestrator, Coder, and Reviewer are the core trio. You can remove agents you don't need. However, the full set provides the most robust workflow.

### Can I add my own agents?

Yes! Create a new `.agent.md` file in `.github/agents/` and add it to the Orchestrator's delegation templates. Follow the conventions in [CONTRIBUTING.md](CONTRIBUTING.md).

### Does this work with non-PHP projects?

The agents are designed for PHP, but the orchestration pattern is language-agnostic. You could adapt the agent files for any language by adjusting the instructions and `copilot-instructions.md` template.

### Which VS Code extension do I need?

[GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) with agent mode support.

### Can I use different AI models for different agents?

Yes — that's the intended design! Each agent has its own `model` field. Use expensive reasoning models for complex agents (Orchestrator, Planner, Reviewer) and fast, cheap models for simple ones (FastCoder).

### How does multi-tenancy work?

Multi-tenancy is optional. If your project is multi-tenant, fill in the Multi-Tenancy section in `copilot-instructions.md`. All agents will then enforce tenant scoping in their work. If not applicable, remove or leave that section empty.

### What if an agent makes a mistake?

The Reviewer agent is your safety net. It performs a structured code review with a comprehensive checklist. The Orchestrator won't accept changes that the Reviewer flags as CRITICAL or MAJOR.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute — fork workflow, PR guidelines, and agent file conventions.

---

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.
