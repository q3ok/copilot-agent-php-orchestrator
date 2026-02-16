# 🎮 Pixel Dash: The Lost Coins

A retro-style 2D side-scrolling platformer game built entirely in vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no external dependencies. Just open `index.html` and play.

---

## 🚀 Demo

**[▶ Play the Live Demo](https://q3ok.github.io/copilot-agent-php-orchestrator/demo-platform-2d-game/)**  — hosted on GitHub Pages, no install needed.

---

## How to Run

1. Clone or download this repository
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari)
3. No build step, no server, no installation needed
4. Works offline — no internet connection required

---

## Controls

| Key | Action |
|-----|--------|
| Arrow Left / A | Move left |
| Arrow Right / D | Move right |
| Arrow Up / W / Space | Jump |
| Space | Start game / Restart (on menu and end screens) |

> **Tip:** Tap jump briefly for a short hop, hold for maximum height (variable jump height).

---

## Gameplay

- Navigate through the level, jumping across platforms and gaps
- Collect coins scattered throughout the level (15 total)
- Avoid spikes (instant death) and enemies (contact from the side = death)
- Defeat enemies by jumping on their heads (stomp) — you get a bounce and +5 bonus points
- Reach the green flag at the end of the level to win
- One hit = game over — be careful!
- Your score = coins collected + enemy stomp bonuses
- Try to collect all coins and finish in the shortest time!

---

## Project Structure

| File | Description |
|------|-------------|
| `index.html` | HTML skeleton with canvas element, links CSS and JS |
| `style.css` | Canvas centering, pixelated scaling, responsive layout, dark page background |
| `game.js` | Complete game logic (~600 lines): game loop, physics, collisions, rendering, level data, entities, HUD, state management |

---

## Design Decisions

- **Internal canvas resolution:** 480×270 pixels, scaled up via CSS with `image-rendering: pixelated` for a chunky retro pixel-art aesthetic
- **All visuals drawn with `fillRect`** — no sprites or images needed
- **Fixed timestep physics** (1/60s) with accumulator for deterministic, frame-rate-independent gameplay
- **AABB collision detection** with split-axis resolution (X then Y) prevents clipping through walls and floors
- **Platformer "game feel" features:** coyote time (~83ms), jump buffer (~83ms), variable jump height
- **Camera** with lerp smoothing and level-boundary clamping
- **Parallax background** (clouds and mountains) for visual depth
- **Color palette** chosen for accessibility (≥3.8:1 contrast ratios), player has black outline for visibility

---

## Known Limitations

- No sound effects or music (would require external audio files or Web Audio API synthesis)
- Single level only (no level progression system)
- No save/checkpoint system — death restarts the entire level
- No pause menu
- No mobile/touch controls — keyboard only
- No sprite animations — characters are drawn with colored rectangles
- 2–3 coins placed at high altitudes may be very difficult to reach
- All code in global scope (acceptable for a single-file standalone game)
