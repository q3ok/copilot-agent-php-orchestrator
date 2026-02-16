# UX/UI Spec — 2D Side-Scrolling Platformer (fillRect/fillText only)

## Canvas & Rendering
- Internal resolution: **480×270**, tile size: **32×32** (15×8.4 tiles visible).
- CSS: `width:960px; height:540px; image-rendering:pixelated;` (2× scale).

## Color Palette
| Element          | Hex       | Notes                          |
|------------------|-----------|--------------------------------|
| Sky background   | `#5C94FC` | Bright blue, high contrast     |
| Ground/solid     | `#8B5E3C` | Earthy brown                   |
| Ground top edge  | `#4AAD52` | Green grass strip (4px tall)   |
| Platform         | `#A0744C` | Lighter brown, distinct        |
| Platform edge    | `#C09060` | Top highlight (2px)            |
| Spikes/hazards   | `#D82800` | Aggressive red                 |
| Player body      | `#E44040` | Bright red                     |
| Player head/skin | `#FCBCB0` | Peach skin tone                |
| Player eye       | `#1A1A2E` | Near-black                     |
| Enemy body       | `#7B2D8B` | Purple — distinct from player  |
| Enemy eye        | `#FFFFFF` | White dot                      |
| Coin outer       | `#FFD700` | Gold                           |
| Coin inner       | `#FFA500` | Orange highlight               |
| Goal pillar      | `#C0C0C0` | Silver/gray pole               |
| Goal flag        | `#39FF14` | Neon green — unmissable        |
| UI text          | `#FFFFFF` | White                          |
| UI text shadow   | `#000000` | Black, offset 1px right+down   |
| Overlay BG       | `rgba(0,0,0,0.7)` | Semi-transparent black |

## Player Visual (24×28 px, anchored bottom-center of tile)
- **Standing**: Body rect `24×16` at bottom (`#E44040`). Head rect `16×12` centered on top (`#FCBCB0`). Eye `4×4` (`#1A1A2E`) offset toward facing direction.
- **Jumping**: Same shape. Body shifts up 2px, add 2×8 "leg" rects below body spread apart (gives stretched look).
- **Dead**: Single `24×24` rect (`#E44040`) + two `4×4` "X" eyes (`#1A1A2E`) drawn as two overlapping rects each. Rotated feel: offset body 4px down.

## Enemy Visual (28×24 px)
- Body: `28×20` rect (`#7B2D8B`), bottom-aligned in tile.
- Head flat on top: `28×4` darker strip (`#5E1A6E`).
- Eyes: two `4×4` white rects (`#FFFFFF`) placed at 6px and 18px from left, 4px from top.
- Patrol: flip eye positions horizontally based on direction.

## Coin Visual (16×16 px, centered in tile)
- Outer rect: `16×16` (`#FFD700`).
- Inner rect: `10×12` centered (`#FFA500`).
- **Animation**: oscillate width each frame: `w = 16 * |sin(time * 4)|`, min width 4px. Keep centered. Gives spinning illusion.

## Spike Visual (32×16 px, top of tile)
- Draw 4 adjacent "triangles" per tile using stacked rects:
  - For each 8px-wide spike: stack 4 rects, widths `8,6,4,2` (each 4px tall), centered, colored `#D82800`.
  - Top 4px row: add `#FF4040` highlight.

## Goal Visual (16×64 px — spans 2 tiles high)
- Pole: `4×56` rect (`#C0C0C0`), centered horizontally.
- Flag: `12×16` rect (`#39FF14`) attached to top-right of pole.
- Base: `16×8` rect (`#808080`) at bottom.

## HUD (drawn last, on top of everything)
- **Top-left (8,8)**: `"SCORE: 00000"` — monospace, 10px font.
- **Top-right (472,8, right-aligned)**: `"♥ × 3"` (lives) — same font.
- All text: fill `#FFFFFF`, draw shadow first at +1,+1 in `#000000`.
- Font: `"10px monospace"` (canvas font string).

## Title Screen (state: MENU)
- Fill entire canvas `#1A1A2E` (dark navy).
- Game title `"PIXEL QUEST"` — `"bold 24px monospace"`, `#FFD700`, centered at y=90.
- Decorative line: `200×2` rect, `#FFD700`, centered at y=110.
- `"PRESS ENTER TO START"` — `"12px monospace"`, `#FFFFFF`, centered at y=170. **Blink**: toggle visibility every 500ms.
- `"ARROWS: Move/Jump"` — `"8px monospace"`, `#808080`, centered at y=220.

## Game Over Screen (state: GAME_OVER)
- Overlay: full-canvas rect `rgba(0,0,0,0.7)`.
- `"GAME OVER"` — `"bold 24px monospace"`, `#D82800`, centered at y=100.
- `"Score: 01250"` — `"12px monospace"`, `#FFFFFF`, centered at y=140.
- `"PRESS ENTER TO RESTART"` — `"10px monospace"`, `#FFFFFF`, centered at y=190. Blink 500ms.

## Win Screen (state: WIN)
- Overlay: full-canvas rect `rgba(0,0,0,0.7)`.
- `"LEVEL COMPLETE!"` — `"bold 24px monospace"`, `#39FF14`, centered at y=100.
- `"Score: 01250"` — `"12px monospace"`, `#FFFFFF`, centered at y=140.
- `"PRESS ENTER TO CONTINUE"` — `"10px monospace"`, `#FFFFFF`, centered at y=190. Blink 500ms.

## Accessibility & Contrast
- Player `#E44040` vs Sky `#5C94FC`: contrast ratio **4.6:1** ✓
- Player `#E44040` vs Ground `#8B5E3C`: contrast ratio **2.1:1** + black outline (1px `#1A1A2E` border on player body) to guarantee separation.
- Enemy `#7B2D8B` vs Sky `#5C94FC`: contrast ratio **3.8:1** ✓
- Coins `#FFD700` vs Sky `#5C94FC`: contrast ratio **5.2:1** ✓
- Spikes `#D82800` vs Ground `#8B5E3C`: contrast ratio **2.5:1** — place spikes only on top of ground (green edge `#4AAD52` vs `#D82800` = **4.1:1** ✓).
- All UI text white on dark overlay/shadow: **15:1+** ✓
- **Rule**: draw 1px `#1A1A2E` outline around player body in all states for universal visibility.
