## Prompt
### This prompt was made by ChatGPT in web chat app and sent to orchestrator, no other things (than responding to questions from orchestrator in copilot chat and creating this file) was done.

```
You are a coordinated multi-agent engineering team (Orchestrator, Researcher, Planner, Designer, Coder, FastCoder, Reviewer, Tester). Build a fully playable 2D side-scrolling platformer (Mario-like) as a web game in plain HTML/CSS/JavaScript.

High-level goals
- The game must be immediately playable in a browser by opening index.html (no build, no external dependencies).
- Pick an original game name yourselves and use it in the title screen and document title.
- Deliver a complete playable loop: start -> play -> win/lose -> restart.
- Use keyboard controls (arrow keys for movement; jump via Up or Space).
- Keep scope realistic and finish in the optimal time: prioritize “playable + stable” over extra features.

Constraints
- Tech: vanilla HTML + CSS + JS only. No frameworks, no CDN, no remote assets.
- Output exactly these files (unless you have a strong reason): index.html, style.css, game.js.
- Must run smoothly (target 60 FPS) and be reasonably well-structured (input/physics/render/entities/levels).

Minimum gameplay content
- At least one level larger than the screen with side-scrolling camera.
- Solid platforms + gravity + collisions (player shouldn’t clip through floors/walls).
- Some challenge element: simple enemies OR hazards, plus collectibles and score.
- Clear goal at the end (flag/door/etc.).

Process requirements (use your agent roles)
- Orchestrator: delegate tasks; do not implement.
- Researcher: quickly research best-practice patterns for small JS platformers (collision + camera + loop). Summarize only what’s needed.
- Planner: define an MVP scope and an implementation plan that fits “optimal time”.
- Designer: decide a simple pixel/retro visual style and minimal HUD.
- Coder/FastCoder: implement the game and basic polish.
- Reviewer: run a strict review (bugs, edge cases, performance, security basics for web).
- Tester: verify playability and key mechanics; provide a short test checklist.

Documentation requirement
- Replace the current README.md with a final README that contains:
  - Game title and short description
  - How to run the game (local usage, no build)
  - Controls
  - Basic gameplay rules/objective
  - Project structure (index.html, style.css, game.js)
  - Notes about design decisions and any known limitations

Deliverables
1) Final code for index.html, style.css, game.js.
2) The new README.md file as described above (this replaces the existing README).
3) A brief summary of what was implemented and what was intentionally cut for time.

Do the research and planning internally, then ship working code.
```

## Prompt 2
```
@autoconfig Scan this project and fill in .github/copilot-instructions.md
```

## Prompt 3
```
Goal:
Publish a working DEMO of this repository to GitHub Pages automatically, and add a visible DEMO link to README.md.

Key requirement (most important):
Update README.md by adding a section near the top:

## 🚀 Demo
Live demo: <URL>

The URL should be the GitHub Pages URL in the form:
https://q3ok.github.io/copilot-agent-php-orchestrator/demo-platform-2d-game/

You must decide what and how to deploy:
1) Inspect the repository structure and determine whether this can be served as a static site on GitHub Pages.
2) Decide the publishing source:
   - Prefer publishing a built static output if the repo contains a frontend build (dist/, build/, docs/, site/, public/ etc.).
   - If it already contains static HTML/CSS/JS, publish the correct folder.
   - If it is not directly runnable as static, create a minimal static demo page (index.html) that explains what the project is and how to run it locally, and publish that page as the DEMO.
3) Decide whether to use Jekyll or disable it:
   - If filenames/folders could be broken by Jekyll processing (e.g., directories starting with "_", or you want raw static hosting), add a ".nojekyll" file.
   - Otherwise, you may keep default behavior.

Implementation requirements:
- Add a GitHub Actions workflow that deploys to GitHub Pages on push to the default branch (main/master) and supports workflow_dispatch.
- Use the official GitHub Pages actions (configure-pages, upload-pages-artifact, deploy-pages).
- Set correct permissions (pages: write, id-token: write, contents: read).
- The workflow must publish ONLY the chosen demo output directory.
- Keep changes minimal and repository-appropriate.
```
