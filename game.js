/* ============================================================
   Pixel Dash: The Lost Coins
   A complete 2D side-scrolling platformer in vanilla JS
   ============================================================ */

"use strict";

/* ============================================================
   1. CANVAS INITIALIZATION
   ============================================================ */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;   // 480 internal resolution
const H = canvas.height;  // 270 internal resolution
ctx.imageSmoothingEnabled = false;

/* ============================================================
   2. COLOR PALETTE
   ============================================================ */
const COLORS = {
    sky:          "#5C94FC",
    ground:       "#8B5E3C",
    grass:        "#4CAF50",
    spike:        "#FF1744",
    playerBody:   "#E44040",
    playerHead:   "#F06060",
    playerOutline:"#1A1A1A",
    eyeWhite:     "#FFFFFF",
    eyePupil:     "#1A1A1A",
    enemy:        "#7B2D8B",
    coinGold:     "#FFD700",
    coinInner:    "#FFA000",
    flagGreen:    "#39FF14",
    flagPole:     "#888888",
    uiWhite:      "#FFFFFF",
    uiBlack:      "#000000",
    overlay:      "rgba(0,0,0,0.7)",
    dead:         "#888888",
};

/* ============================================================
   3. INPUT MODULE
   ============================================================ */
const keys = {};
let jumpJustPressed = false;
let spaceJustPressed = false;

window.addEventListener("keydown", (e) => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) {
        e.preventDefault();
    }
    if (!keys[e.code]) {
        if (e.code === "Space" || e.code === "ArrowUp") {
            jumpJustPressed = true;
            spaceJustPressed = true;
        }
    }
    keys[e.code] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

window.addEventListener("blur", () => {
    for (const k in keys) keys[k] = false;
});

function isLeft()  { return keys["ArrowLeft"]  || keys["KeyA"]; }
function isRight() { return keys["ArrowRight"] || keys["KeyD"]; }
function isJump()  { return keys["Space"]      || keys["ArrowUp"] || keys["KeyW"]; }

/* ============================================================
   4. GAME STATE MACHINE
   ============================================================ */
const STATE = { MENU: 0, PLAYING: 1, GAME_OVER: 2, WIN: 3 };
let gameState = STATE.MENU;

/* ============================================================
   5. TILE & LEVEL DATA
   ============================================================ */
const TILE = 32;
// Tile types: 0=air, 1=solid ground, 3=spikes, 4=goal flag
// Level: 90 tiles wide × 9 tiles tall (fits 270px height with 32px tiles ≈ 8.4, we use 9 rows)
// Row 0 = top, Row 8 = bottom

const LEVEL = [
    // Row 0 (top sky)
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // Row 1
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // Row 2
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // Row 3
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // Row 4
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // Row 5
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],
    // Row 6
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
    // Row 7 — main ground level with gaps and features
    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,3,3,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,4,1],
    // Row 8 — underground fill
    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1],
];

const LEVEL_ROWS = LEVEL.length;
const LEVEL_COLS = LEVEL[0].length;
const LEVEL_W = LEVEL_COLS * TILE;
const LEVEL_H = LEVEL_ROWS * TILE;

/* ============================================================
   6. ENTITY SPAWN DATA
   ============================================================ */
// Coin positions (tile coordinates)
const COIN_SPAWNS = [
    { tx: 4,  ty: 6 },   // Tutorial area
    { tx: 7,  ty: 6 },
    { tx: 10, ty: 6 },
    { tx: 17, ty: 4 },   // On a platform
    { tx: 27, ty: 4 },   // On floating platform
    { tx: 35, ty: 4 },
    { tx: 39, ty: 3 },   // High up reward
    { tx: 45, ty: 2 },   // On high platform
    { tx: 53, ty: 5 },   // Between spikes
    { tx: 59, ty: 4 },
    { tx: 65, ty: 4 },
    { tx: 70, ty: 3 },
    { tx: 75, ty: 5 },
    { tx: 80, ty: 6 },
    { tx: 85, ty: 6 },
];

const TOTAL_COINS = COIN_SPAWNS.length;

// Enemy spawn data: tile position + patrol range in tiles
const ENEMY_SPAWNS = [
    { tx: 8,  ty: 6, patrolLeft: 5,  patrolRight: 11 },
    { tx: 19, ty: 6, patrolLeft: 17, patrolRight: 21 },
    { tx: 36, ty: 6, patrolLeft: 34, patrolRight: 42 },
    { tx: 48, ty: 6, patrolLeft: 46, patrolRight: 50 },
    { tx: 63, ty: 6, patrolLeft: 61, patrolRight: 67 },
    { tx: 84, ty: 6, patrolLeft: 83, patrolRight: 87 },
];

/* ============================================================
   7. GAME ENTITIES & VARIABLES
   ============================================================ */
let player, coins, enemies, score, camera, gameTime, deathTimer, coinsCollected, playTime;

/* ============================================================
   8. PLAYER PHYSICS CONSTANTS
   ============================================================ */
const PLAYER_SPEED   = 150;   // px/s horizontal
const GRAVITY        = 1500;  // px/s²
const JUMP_SPEED     = -420;  // px/s (negative = up)
const TERMINAL_VEL   = 600;   // px/s max fall speed
const COYOTE_TIME    = 0.083; // ~5 frames at 60fps
const JUMP_BUFFER    = 0.083; // ~5 frames at 60fps

/* Background decoration data (hoisted to avoid per-frame allocation) */
const CLOUDS = [
    { x: 50,  y: 30,  w: 60, h: 16 },
    { x: 200, y: 50,  w: 80, h: 14 },
    { x: 400, y: 25,  w: 50, h: 12 },
    { x: 600, y: 45,  w: 70, h: 16 },
    { x: 850, y: 35,  w: 55, h: 13 },
    { x: 1100,y: 55,  w: 65, h: 15 },
    { x: 1400,y: 28,  w: 75, h: 14 },
    { x: 1700,y: 40,  w: 60, h: 12 },
    { x: 2000,y: 50,  w: 80, h: 16 },
    { x: 2300,y: 30,  w: 55, h: 14 },
];
const MOUNTAINS = [
    { x: 0, peak: 140, w: 200 },
    { x: 180, peak: 120, w: 250 },
    { x: 400, peak: 150, w: 180 },
    { x: 600, peak: 130, w: 220 },
    { x: 850, peak: 145, w: 200 },
    { x: 1100, peak: 125, w: 240 },
    { x: 1400, peak: 155, w: 190 },
    { x: 1700, peak: 135, w: 210 },
    { x: 2000, peak: 140, w: 200 },
    { x: 2300, peak: 128, w: 230 },
];

/* ============================================================
   9. RESET / INIT GAME
   ============================================================ */
function resetGame() {
    player = {
        x: 2 * TILE,
        y: 5 * TILE,
        width: 20,
        height: 28,
        vx: 0,
        vy: 0,
        onGround: false,
        alive: true,
        facing: 1, // 1=right, -1=left
        coyoteTimer: 0,
        jumpBufferTimer: 0,
    };

    coins = COIN_SPAWNS.map(c => ({
        x: c.tx * TILE + (TILE - 16) / 2,
        y: c.ty * TILE + (TILE - 16) / 2,
        width: 16,
        height: 16,
        collected: false,
    }));

    enemies = ENEMY_SPAWNS.map(e => ({
        x: e.tx * TILE + 2,
        y: e.ty * TILE + (TILE - 20),
        width: 28,
        height: 20,
        vx: 40,
        direction: 1,
        alive: true,
        patrolStart: e.patrolLeft * TILE,
        patrolEnd: (e.patrolRight + 1) * TILE - 28,
    }));

    score = 0;
    coinsCollected = 0;
    camera = { x: 0 };
    gameTime = 0;
    playTime = 0;
    deathTimer = 0;
    gameState = STATE.PLAYING;
}

/* ============================================================
   10. TILE COLLISION HELPERS
   ============================================================ */
function getTile(col, row) {
    if (col < 0 || col >= LEVEL_COLS || row < 0 || row >= LEVEL_ROWS) return 0;
    return LEVEL[row][col];
}

function isSolid(tileType) {
    return tileType === 1 || tileType === 4;
}

function isSpike(tileType) {
    return tileType === 3;
}

function isGoal(tileType) {
    return tileType === 4;
}

/* ============================================================
   11. AABB COLLISION (SPLIT-AXIS)
   ============================================================ */
function aabbOverlap(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resolvePlayerTileCollisions(axis) {
    const p = player;

    // Determine tile range to check
    const left   = Math.floor(p.x / TILE);
    const right  = Math.floor((p.x + p.width - 1) / TILE);
    const top    = Math.floor(p.y / TILE);
    const bottom = Math.floor((p.y + p.height - 1) / TILE);

    for (let row = top; row <= bottom; row++) {
        for (let col = left; col <= right; col++) {
            const tile = getTile(col, row);
            if (tile === 0) continue;

            const tileBox = { x: col * TILE, y: row * TILE, width: TILE, height: TILE };

            if (!aabbOverlap(p, tileBox)) continue;

            // Spike collision
            if (isSpike(tile)) {
                killPlayer();
                return;
            }

            // Goal collision
            if (isGoal(tile)) {
                gameState = STATE.WIN;
                return;
            }

            // Solid collision resolution
            if (isSolid(tile)) {
                if (axis === "x") {
                    if (p.vx > 0) {
                        p.x = tileBox.x - p.width;
                    } else if (p.vx < 0) {
                        p.x = tileBox.x + TILE;
                    }
                    p.vx = 0;
                } else {
                    if (p.vy > 0) {
                        p.y = tileBox.y - p.height;
                        p.vy = 0;
                        p.onGround = true;
                        p.coyoteTimer = COYOTE_TIME;
                    } else if (p.vy < 0) {
                        p.y = tileBox.y + TILE;
                        p.vy = 0;
                    }
                }
            }
        }
    }
}

/* ============================================================
   12. PLAYER UPDATE
   ============================================================ */
function updatePlayer(dt) {
    const p = player;
    if (!p.alive) {
        deathTimer -= dt;
        if (deathTimer <= 0) {
            gameState = STATE.GAME_OVER;
        }
        return;
    }

    // Horizontal input
    let moveX = 0;
    if (isLeft())  moveX -= 1;
    if (isRight()) moveX += 1;
    p.vx = moveX * PLAYER_SPEED;
    if (moveX !== 0) p.facing = moveX;

    // Jump buffer
    if (jumpJustPressed) {
        p.jumpBufferTimer = JUMP_BUFFER;
        jumpJustPressed = false;
    }
    if (p.jumpBufferTimer > 0) p.jumpBufferTimer -= dt;

    // Coyote time
    if (!p.onGround) {
        p.coyoteTimer -= dt;
    }

    // Jump execution
    if (p.jumpBufferTimer > 0 && p.coyoteTimer > 0) {
        p.vy = JUMP_SPEED;
        p.onGround = false;
        p.coyoteTimer = 0;
        p.jumpBufferTimer = 0;
    }

    // Variable jump height — cut velocity on release
    if (!isJump() && p.vy < JUMP_SPEED * 0.4) {
        p.vy = p.vy * 0.5;
    }

    // Gravity
    p.vy += GRAVITY * dt;
    if (p.vy > TERMINAL_VEL) p.vy = TERMINAL_VEL;

    // Reset onGround before collision
    p.onGround = false;

    // Move X → resolve
    p.x += p.vx * dt;
    resolvePlayerTileCollisions("x");
    if (!p.alive || gameState === STATE.WIN) return;

    // Move Y → resolve
    p.y += p.vy * dt;
    resolvePlayerTileCollisions("y");
    if (!p.alive || gameState === STATE.WIN) return;

    // Clamp left side
    if (p.x < 0) { p.x = 0; p.vx = 0; }
    // Clamp right side
    if (p.x + p.width > LEVEL_W) { p.x = LEVEL_W - p.width; p.vx = 0; }

    // Fall off bottom = death
    if (p.y > LEVEL_H + 50) {
        killPlayer();
    }
}

function killPlayer() {
    player.alive = false;
    deathTimer = 1.0; // 1 second before game over screen
}

/* ============================================================
   13. ENEMY UPDATE
   ============================================================ */
function updateEnemies(dt) {
    for (const e of enemies) {
        if (!e.alive) continue;

        e.x += e.vx * e.direction * dt;

        // Patrol bounds
        if (e.x <= e.patrolStart) {
            e.x = e.patrolStart;
            e.direction = 1;
        }
        if (e.x >= e.patrolEnd) {
            e.x = e.patrolEnd;
            e.direction = -1;
        }

        // Collision with player
        if (player.alive && aabbOverlap(player, e)) {
            // Check if player is stomping (player bottom near enemy top + falling)
            const playerBottom = player.y + player.height;
            const enemyTop = e.y;
            if (player.vy > 0 && playerBottom < enemyTop + e.height * 0.5) {
                // Stomp enemy
                e.alive = false;
                player.vy = JUMP_SPEED * 0.6; // bounce
                score += 5; // bonus for stomping
            } else {
                // Player dies
                killPlayer();
            }
        }
    }
}

/* ============================================================
   14. COIN UPDATE
   ============================================================ */
function updateCoins(dt) {
    for (const c of coins) {
        if (c.collected) continue;
        if (player.alive && aabbOverlap(player, c)) {
            c.collected = true;
            score += 1;
            coinsCollected += 1;
        }
    }
}

/* ============================================================
   15. CAMERA UPDATE
   ============================================================ */
function updateCamera() {
    // Follow player with dead zone centering
    const targetX = player.x + player.width / 2 - W / 2;
    // Smooth camera with lerp
    camera.x += (targetX - camera.x) * 0.1;
    // Clamp to level bounds
    if (camera.x < 0) camera.x = 0;
    if (camera.x > LEVEL_W - W) camera.x = LEVEL_W - W;
}

/* ============================================================
   16. MAIN UPDATE
   ============================================================ */
function update(dt) {
    gameTime += dt;

    if (gameState === STATE.PLAYING) {
        playTime += dt;
        updatePlayer(dt);
        if (gameState !== STATE.PLAYING) {
            jumpJustPressed = false;
            spaceJustPressed = false;
            return;
        }
        updateEnemies(dt);
        updateCoins(dt);
        updateCamera();
    }

    // Menu / Game Over / Win — press space to transition
    if (gameState === STATE.MENU || gameState === STATE.GAME_OVER || gameState === STATE.WIN) {
        if (spaceJustPressed) {
            spaceJustPressed = false;
            resetGame();
        }
    }

    // Clear just-pressed flags at end of update
    jumpJustPressed = false;
    spaceJustPressed = false;
}

/* ============================================================
   17. RENDERING — TILES
   ============================================================ */
function renderTiles() {
    const startCol = Math.floor(camera.x / TILE);
    const endCol = Math.ceil((camera.x + W) / TILE);

    for (let row = 0; row < LEVEL_ROWS; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const tile = getTile(col, row);
            if (tile === 0) continue;

            const sx = col * TILE - camera.x;
            const sy = row * TILE;

            if (tile === 1) {
                // Ground block
                ctx.fillStyle = COLORS.ground;
                ctx.fillRect(sx, sy, TILE, TILE);
                // Check if tile above is air — draw grass strip on top
                const above = getTile(col, row - 1);
                if (above === 0) {
                    ctx.fillStyle = COLORS.grass;
                    ctx.fillRect(sx, sy, TILE, 6);
                }
                // Subtle outline
                ctx.strokeStyle = "#6B4226";
                ctx.lineWidth = 1;
                ctx.strokeRect(sx + 0.5, sy + 0.5, TILE - 1, TILE - 1);
            } else if (tile === 3) {
                // Spikes
                ctx.fillStyle = COLORS.spike;
                // Draw triangular spikes using triangles
                const spikes = 4;
                const sw = TILE / spikes;
                for (let i = 0; i < spikes; i++) {
                    ctx.beginPath();
                    ctx.moveTo(sx + i * sw, sy + TILE);
                    ctx.lineTo(sx + i * sw + sw / 2, sy + 6);
                    ctx.lineTo(sx + (i + 1) * sw, sy + TILE);
                    ctx.closePath();
                    ctx.fill();
                }
                // Base
                ctx.fillRect(sx, sy + TILE - 4, TILE, 4);
            } else if (tile === 4) {
                // Goal flag
                // Ground under flag
                ctx.fillStyle = COLORS.ground;
                ctx.fillRect(sx, sy, TILE, TILE);
                const above = getTile(col, row - 1);
                if (above === 0) {
                    ctx.fillStyle = COLORS.grass;
                    ctx.fillRect(sx, sy, TILE, 6);
                }
                // Pole
                ctx.fillStyle = COLORS.flagPole;
                ctx.fillRect(sx + TILE / 2 - 2, sy - TILE + 4, 4, TILE);
                // Flag
                const flagWave = Math.sin(gameTime * 4) * 2;
                ctx.fillStyle = COLORS.flagGreen;
                ctx.fillRect(sx + TILE / 2 + 2, sy - TILE + 4 + flagWave, 20, 14);
                // Flag highlight
                ctx.fillStyle = "#80FF60";
                ctx.fillRect(sx + TILE / 2 + 4, sy - TILE + 8 + flagWave, 8, 6);
            }
        }
    }
}

/* ============================================================
   18. RENDERING — PLAYER
   ============================================================ */
function renderPlayer() {
    const p = player;
    const sx = Math.round(p.x - camera.x);
    const sy = Math.round(p.y);

    if (!p.alive) {
        // Dead — gray tint, slight upward motion animation
        ctx.globalAlpha = Math.max(0, deathTimer);
        // Body
        ctx.fillStyle = COLORS.dead;
        ctx.fillRect(sx, sy, p.width, 16);
        // Head
        ctx.fillRect(sx + 2, sy - 12, 16, 12);
        ctx.globalAlpha = 1;
        return;
    }

    const dir = p.facing;

    // Body outline
    ctx.fillStyle = COLORS.playerOutline;
    ctx.fillRect(sx - 1, sy + 11, p.width + 2, 18);

    // Body
    ctx.fillStyle = COLORS.playerBody;
    ctx.fillRect(sx, sy + 12, p.width, 16);

    // Head
    ctx.fillStyle = COLORS.playerHead;
    ctx.fillRect(sx + 2, sy, 16, 12);

    // Head outline
    ctx.strokeStyle = COLORS.playerOutline;
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 1.5, sy - 0.5, 17, 13);

    // Eye
    const eyeX = dir === 1 ? sx + 12 : sx + 4;
    ctx.fillStyle = COLORS.eyeWhite;
    ctx.fillRect(eyeX, sy + 3, 4, 4);
    // Pupil
    const pupilX = dir === 1 ? eyeX + 2 : eyeX;
    ctx.fillStyle = COLORS.eyePupil;
    ctx.fillRect(pupilX, sy + 4, 2, 2);
}

/* ============================================================
   19. RENDERING — ENEMIES
   ============================================================ */
function renderEnemies() {
    for (const e of enemies) {
        if (!e.alive) continue;

        const sx = Math.round(e.x - camera.x);
        const sy = Math.round(e.y);

        // Body
        ctx.fillStyle = COLORS.enemy;
        ctx.fillRect(sx, sy, e.width, e.height);

        // Outline
        ctx.strokeStyle = "#5A1A6B";
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + 0.5, sy + 0.5, e.width - 1, e.height - 1);

        // Eyes
        const dir = e.direction;
        ctx.fillStyle = COLORS.eyeWhite;
        ctx.fillRect(sx + 6, sy + 4, 5, 5);
        ctx.fillRect(sx + 17, sy + 4, 5, 5);

        // Pupils
        ctx.fillStyle = COLORS.eyePupil;
        const pOff = dir === 1 ? 3 : 0;
        ctx.fillRect(sx + 6 + pOff, sy + 5, 2, 3);
        ctx.fillRect(sx + 17 + pOff, sy + 5, 2, 3);

        // Angry eyebrows
        ctx.fillStyle = COLORS.eyePupil;
        if (dir === 1) {
            ctx.fillRect(sx + 5, sy + 3, 5, 1);
            ctx.fillRect(sx + 18, sy + 2, 5, 1);
        } else {
            ctx.fillRect(sx + 5, sy + 2, 5, 1);
            ctx.fillRect(sx + 18, sy + 3, 5, 1);
        }
    }
}

/* ============================================================
   20. RENDERING — COINS
   ============================================================ */
function renderCoins() {
    for (const c of coins) {
        if (c.collected) continue;

        const sx = Math.round(c.x - camera.x);
        const sy = Math.round(c.y);

        // Oscillate width for spin effect
        const scale = Math.abs(Math.sin(gameTime * 5));
        const drawW = Math.max(4, Math.round(16 * scale));
        const offsetX = Math.round((16 - drawW) / 2);

        // Outer gold
        ctx.fillStyle = COLORS.coinGold;
        ctx.fillRect(sx + offsetX, sy, drawW, 16);

        // Inner detail (only when wide enough)
        if (drawW > 8) {
            const innerW = Math.max(2, Math.round(drawW * 0.5));
            const innerOff = Math.round((drawW - innerW) / 2);
            ctx.fillStyle = COLORS.coinInner;
            ctx.fillRect(sx + offsetX + innerOff, sy + 4, innerW, 8);
        }

        // Outline
        ctx.strokeStyle = "#CC8800";
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + offsetX + 0.5, sy + 0.5, drawW - 1, 15);
    }
}

/* ============================================================
   21. RENDERING — BACKGROUND
   ============================================================ */
function renderBackground() {
    // Sky gradient
    ctx.fillStyle = COLORS.sky;
    ctx.fillRect(0, 0, W, H);

    // Simple decorative clouds (parallax)
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    const cloudOffset = camera.x * 0.2;
    for (const cl of CLOUDS) {
        const cx = cl.x - cloudOffset;
        // Wrap clouds or just skip if off-screen
        if (cx + cl.w < 0 || cx > W) continue;
        // Cloud = rounded rectangles via multiple rects
        ctx.fillRect(cx, cl.y, cl.w, cl.h);
        ctx.fillRect(cx + cl.w * 0.15, cl.y - cl.h * 0.4, cl.w * 0.5, cl.h * 0.5);
        ctx.fillRect(cx + cl.w * 0.4, cl.y - cl.h * 0.6, cl.w * 0.35, cl.h * 0.5);
    }

    // Distant mountains (parallax)
    ctx.fillStyle = "rgba(60, 100, 180, 0.3)";
    const mtOffset = camera.x * 0.1;
    for (const mt of MOUNTAINS) {
        const mx = mt.x - mtOffset;
        ctx.beginPath();
        ctx.moveTo(mx, H);
        ctx.lineTo(mx + mt.w / 2, mt.peak);
        ctx.lineTo(mx + mt.w, H);
        ctx.closePath();
        ctx.fill();
    }
}

/* ============================================================
   22. RENDERING — HUD
   ============================================================ */
function renderHUD() {
    const text = "COINS: " + coinsCollected + " / " + TOTAL_COINS;
    ctx.font = "bold 14px monospace";
    ctx.textBaseline = "top";
    // Shadow
    ctx.fillStyle = COLORS.uiBlack;
    ctx.fillText(text, 9, 9);
    // Main text
    ctx.fillStyle = COLORS.uiWhite;
    ctx.fillText(text, 8, 8);
}

/* ============================================================
   23. RENDERING — OVERLAY SCREENS
   ============================================================ */
function renderOverlay() {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, W, H);
}

function renderMenuScreen() {
    renderOverlay();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Title
    ctx.font = "bold 28px monospace";
    ctx.fillStyle = COLORS.uiBlack;
    ctx.fillText("PIXEL DASH", W / 2 + 1, H * 0.32 + 1);
    ctx.fillStyle = COLORS.uiWhite;
    ctx.fillText("PIXEL DASH", W / 2, H * 0.32);

    // Subtitle
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = COLORS.coinGold;
    ctx.fillText("The Lost Coins", W / 2, H * 0.45);

    // Controls info
    ctx.font = "10px monospace";
    ctx.fillStyle = "#AAAAAA";
    ctx.fillText("Arrow Keys / WASD to move, Space / Up to jump", W / 2, H * 0.57);

    // Blinking prompt
    if (Math.floor(gameTime * 2) % 2 === 0) {
        ctx.font = "bold 12px monospace";
        ctx.fillStyle = COLORS.uiWhite;
        ctx.fillText("Press SPACE to Start", W / 2, H * 0.72);
    }

    ctx.textAlign = "left";
}

function renderGameOverScreen() {
    renderOverlay();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Title
    ctx.font = "bold 24px monospace";
    ctx.fillStyle = COLORS.uiBlack;
    ctx.fillText("GAME OVER", W / 2 + 1, H * 0.32 + 1);
    ctx.fillStyle = COLORS.playerBody;
    ctx.fillText("GAME OVER", W / 2, H * 0.32);

    // Score
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = COLORS.uiWhite;
    ctx.fillText("Score: " + score, W / 2, H * 0.48);

    // Blinking prompt
    if (Math.floor(gameTime * 2) % 2 === 0) {
        ctx.font = "bold 12px monospace";
        ctx.fillStyle = COLORS.uiWhite;
        ctx.fillText("Press SPACE to Retry", W / 2, H * 0.65);
    }

    ctx.textAlign = "left";
}

function renderWinScreen() {
    renderOverlay();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Title
    ctx.font = "bold 22px monospace";
    ctx.fillStyle = COLORS.uiBlack;
    ctx.fillText("LEVEL COMPLETE!", W / 2 + 1, H * 0.32 + 1);
    ctx.fillStyle = COLORS.flagGreen;
    ctx.fillText("LEVEL COMPLETE!", W / 2, H * 0.32);

    // Score
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = COLORS.uiWhite;
    ctx.fillText("Score: " + score, W / 2, H * 0.45);

    // Time
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = COLORS.uiBlack;
    ctx.fillText("Time: " + playTime.toFixed(1) + "s", W / 2 + 1, H * 0.55 + 1);
    ctx.fillStyle = COLORS.uiWhite;
    ctx.fillText("Time: " + playTime.toFixed(1) + "s", W / 2, H * 0.55);

    // Blinking prompt
    if (Math.floor(gameTime * 2) % 2 === 0) {
        ctx.font = "bold 12px monospace";
        ctx.fillStyle = COLORS.uiWhite;
        ctx.fillText("Press SPACE to Play Again", W / 2, H * 0.72);
    }

    ctx.textAlign = "left";
}

/* ============================================================
   24. MAIN RENDER
   ============================================================ */
function render() {
    // Clear
    ctx.clearRect(0, 0, W, H);

    if (gameState === STATE.MENU) {
        renderBackground();
        renderTiles();
        renderCoins();
        renderEnemies();
        renderMenuScreen();
        return;
    }

    // World rendering
    renderBackground();
    renderTiles();
    renderCoins();
    renderEnemies();
    renderPlayer();
    renderHUD();

    // Overlays
    if (gameState === STATE.GAME_OVER) {
        renderGameOverScreen();
    } else if (gameState === STATE.WIN) {
        renderWinScreen();
    }
}

/* ============================================================
   25. GAME LOOP (FIXED TIMESTEP)
   ============================================================ */
const FIXED_DT = 1 / 60;
const MAX_STEPS = 5;
let accumulator = 0;
let lastTime = 0;

// Initialize camera for menu screen
camera = { x: 0 };
gameTime = 0;
// Pre-create entities for menu visual
coins = COIN_SPAWNS.map(c => ({
    x: c.tx * TILE + (TILE - 16) / 2,
    y: c.ty * TILE + (TILE - 16) / 2,
    width: 16, height: 16, collected: false,
}));
enemies = ENEMY_SPAWNS.map(e => ({
    x: e.tx * TILE + 2,
    y: e.ty * TILE + (TILE - 20),
    width: 28, height: 20, vx: 40, direction: 1, alive: true,
    patrolStart: e.patrolLeft * TILE,
    patrolEnd: (e.patrolRight + 1) * TILE - 28,
}));
player = { x: 2 * TILE, y: 5 * TILE, width: 20, height: 28,
           vx: 0, vy: 0, onGround: false, alive: true, facing: 1,
           coyoteTimer: 0, jumpBufferTimer: 0 };
score = 0;
coinsCollected = 0;
playTime = 0;
deathTimer = 0;

function gameLoop(timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Cap dt to prevent spiral of death
    if (dt > 0.25) dt = 0.25;

    accumulator += dt;

    let steps = 0;
    while (accumulator >= FIXED_DT && steps < MAX_STEPS) {
        update(FIXED_DT);
        accumulator -= FIXED_DT;
        steps++;
    }

    render();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
