# Contributing to PHP Agent Orchestrator

Thank you for your interest in contributing! This guide explains how to participate.

## How to Contribute

### Fork & Pull Request Workflow

1. **Fork** this repository on GitHub.
2. **Clone** your fork locally.
3. **Create a branch** for your change: `git checkout -b feature/my-change`
4. **Make your changes** following the conventions below.
5. **Commit** with a clear, descriptive message.
6. **Push** to your fork and open a **Pull Request** against `main`.

### PR Guidelines

- Keep PRs focused — one logical change per PR.
- Describe **what** you changed and **why** in the PR description.
- If your change affects an agent file, test it with GitHub Copilot Chat to verify behavior.
- Update `README.md` if your change affects usage, setup, or agent roles.

### PR Checklist

- Agent frontmatter includes all required fields: `name`, `description`, `tools`, `model`, `target`.
- Non-implementing agents do not include `edit` in `tools`.
- Agent prompts do not reference non-existent tooling (for example: `askuser`).
- `README.md` model defaults match `.github/agents/*.agent.md`.
- CI workflow `Docs and Agents Validate` passes.

## Agent File Conventions

All agent definition files live in `.github/agents/` and follow these rules:

### Filename

```
<AgentName>.agent.md
```

PascalCase name, `.agent.md` extension.

### Frontmatter

```yaml
---
name: lowercase-agent-name
description: One-line description of the agent's role.
tools: [list, of, tools]
model: "model-name"
target: vscode
---
```

- `model` — Use a sensible default. Add a note in the body about customization.
- `tools` — Include core tools. Mark MCP/optional tools with a comment.

### Body Structure

1. **Role declaration**: `You are the **AgentName**.`
2. **Project context**: Reference `.github/copilot-instructions.md` as the source of truth.
3. **Responsibilities**: What the agent does and does NOT do.
4. **Rules / checklists**: Specific constraints the agent must follow.
5. **Output format**: How the agent should structure its responses.
6. **Delivery requirements**: Handoff instructions.

### Key Principles

- **No hardcoded project specifics** — all project details come from `.github/copilot-instructions.md`.
- **Security-first mindset** — agents must always consider security implications.
- **Multi-tenancy is optional** — reference it as "if applicable per copilot-instructions.md".
- **Keep delegation patterns** — the orchestration workflow is the core value.
- **English only** — agent instructions are for AI models and must be in English.

## Adding Examples

Example `copilot-instructions.md` files go in `examples/`. Name them:

```
copilot-instructions-<framework-or-stack>.md
```

Each example should be a complete, realistic configuration that someone could adapt for their project.

## Code of Conduct

Be respectful, constructive, and collaborative. We follow standard open-source etiquette.

## License

By contributing, you agree that your contributions will be licensed under the GPL v3 license (see [LICENSE](LICENSE)).
