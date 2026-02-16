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
