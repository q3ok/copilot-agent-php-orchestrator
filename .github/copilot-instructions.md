# Project-Specific Copilot Instructions
<!-- AutoConfig: generated 2026-02-16 -->
<!-- NOTE: This project is a vanilla HTML/CSS/JS game, NOT a PHP application.
     The template sections below have been adapted accordingly. Inapplicable PHP-specific
     sections have been removed or marked as not applicable. -->

> **This file is your project's "constitution" for all Copilot Chat Agents.**

---

## Project Overview

- **Project name**: Pixel Dash: The Lost Coins
- **Description**: A retro-style 2D side-scrolling platformer game built entirely in vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no external dependencies
- **PHP version**: N/A — this is a pure client-side JavaScript project (no server-side code)
- **Runs in Docker?**: no — open `index.html` directly in a browser

---

## Architecture

- **Architectural pattern**: Single-file game architecture with modular sections (procedural, global scope)
- **Layers / flow**: Input Module → State Machine → Physics/Update Loop → Collision Detection → Entity Updates → Rendering → Game Loop (`requestAnimationFrame`)
- **Entry point**: `index.html` (loads `style.css` and `game.js` via `<script>` tag)
- **Routing mechanism**: N/A — single-page client-side application with no routing; game states managed via state machine (`STATE.MENU`, `STATE.PLAYING`, `STATE.GAME_OVER`, `STATE.WIN`)

---

## Tech Stack

| Component          | Technology                                                       |
|---------------------|------------------------------------------------------------------|
| **Framework**       | None (vanilla HTML + CSS + JavaScript)                           |
| **Template engine** | N/A — plain HTML                                                 |
| **CSS framework**   | None — custom CSS with responsive media queries                  |
| **JS libraries**    | None — vanilla JS only, Canvas 2D API for rendering              |
| **Database**        | None                                                             |
| **Cache**           | None                                                             |
| **Queue / Jobs**    | None                                                             |

---

## Naming Conventions

- **Function naming**: camelCase (e.g., `resetGame()`, `updatePlayer()`, `renderTiles()`, `resolvePlayerTileCollisions()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `PLAYER_SPEED`, `GRAVITY`, `JUMP_SPEED`, `TILE`, `FIXED_DT`)
- **Object constants**: PascalCase keys (e.g., `COLORS.sky`, `STATE.PLAYING`)
- **File naming**: lowercase with hyphens/dots (`index.html`, `style.css`, `game.js`)
- **Code organization**: Numbered section comments in `game.js` (e.g., `/* 1. CANVAS INITIALIZATION */`, `/* 2. COLOR PALETTE */`, etc.)

---

## Security

Not applicable — this is a fully client-side browser game with no server, no user input processing, no authentication, no database, and no external network requests.

---

## Rendering & Game Engine

- **Canvas resolution**: 480×270 pixels (internal), scaled to 960×540 via CSS with `image-rendering: pixelated`
- **Rendering approach**: All visuals drawn with `ctx.fillRect()` — no sprites, no images, no external assets
- **Physics**: Fixed timestep (1/60s = ~16.67ms) with accumulator pattern for frame-rate-independent gameplay
- **Collision detection**: AABB (Axis-Aligned Bounding Box) with split-axis resolution (X then Y)
- **Camera**: Lerp smoothing with level-boundary clamping
- **Game feel**: Coyote time (~83ms), jump buffer (~83ms), variable jump height
- **Parallax**: Background clouds and mountains at different scroll rates

---

## Testing

- **Framework**: none
- **Test conventions**: Manual browser testing — open `index.html` and play; verify controls, collisions, coin collection, enemy stomps, death, and win condition

---

## Deployment

- **Docker?**: no
- **CI/CD**: GitHub Actions — `docs-and-agents-validate.yml` runs agent/doc validation (PowerShell script `scripts/validate-agents.ps1`) and markdown link checking (lychee)
- **Deployment method**: Static files — clone the repo and open `index.html` in any modern browser. No build step, no server required. Works offline.

---

## Environment Setup

- **Local setup command**: Open `index.html` in a web browser (Chrome, Firefox, Edge, Safari)
- **Install dependencies**: None — zero dependencies
- **Required services**: None — runs entirely client-side

---

## Git Workflow

- **Branch strategy**: GitHub Flow (main + feature branches)
- **Commit conventions**: Free-form descriptive messages
- **PR process**: CI must pass (docs-and-agents-validate workflow)

---

## Key Modules / Domains

All code resides in a single file (`game.js`, ~930 lines) organized into numbered sections:

- **Canvas Initialization** (section 1): Canvas setup, 2D context, image smoothing disabled (`game.js`)
- **Color Palette** (section 2): Centralized `COLORS` object with all game colors (`game.js`)
- **Input Module** (section 3): Keyboard event listeners, key state tracking, helper functions `isLeft()`, `isRight()`, `isJump()` (`game.js`)
- **State Machine** (section 4): Game states — MENU, PLAYING, GAME_OVER, WIN (`game.js`)
- **Level Data** (section 5): Tile-based level map (90×9 tiles), tile types: air (0), solid (1), spikes (3), goal flag (4) (`game.js`)
- **Entity Spawns** (section 6): Coin positions (15 coins) and enemy patrol data (6 enemies) (`game.js`)
- **Game Entities** (section 7): Player, coins, enemies, score, camera state (`game.js`)
- **Physics Constants** (section 8): `PLAYER_SPEED`, `GRAVITY`, `JUMP_SPEED`, `TERMINAL_VEL`, `COYOTE_TIME`, `JUMP_BUFFER` (`game.js`)
- **Game Reset** (section 9): `resetGame()` — initializes/resets all entities and state (`game.js`)
- **Collision & Physics** (section 10): `getTile()`, `isSolid()`, `isSpike()`, `isGoal()`, `aabbOverlap()`, `resolvePlayerTileCollisions()` (`game.js`)
- **Update Logic** (section 11): `updatePlayer()`, `killPlayer()`, `updateEnemies()`, `updateCoins()`, `updateCamera()`, `update()` (`game.js`)
- **Rendering** (section 12): `renderBackground()`, `renderTiles()`, `renderPlayer()`, `renderEnemies()`, `renderCoins()`, `renderHUD()`, `renderOverlay()`, screen renderers, `render()` (`game.js`)
- **Game Loop** (section 13): Fixed timestep loop via `requestAnimationFrame` with accumulator and spiral-of-death cap (`game.js`)

---

## Additional Notes

- **No external dependencies** — the entire game is self-contained in 3 files (`index.html`, `style.css`, `game.js`)
- **All code in global scope** — acceptable for a single-file standalone game; no modules or classes
- **`"use strict"`** enabled at the top of `game.js`
- **Color palette** chosen for accessibility (≥3.8:1 contrast ratios); player has a black outline for universal visibility
- **Single level only** — 90 tiles wide (2880px), scrolling camera, 15 collectible coins, 6 patrolling enemies, 1 goal flag
- **Controls**: Arrow keys / WASD for movement, Space/Up/W for jump
- **No sound** — fully silent (no audio files or Web Audio API)
- **No save/checkpoint system** — death restarts the entire level
- **Design spec** available in `DESIGN_SPEC.md` with full color palette, entity visuals, and UI layout details
- **License**: GPL v3
