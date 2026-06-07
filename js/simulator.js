// Code quest - 2D Zelda Dungeon Canvas Simulator

// Sprite Color Palette (Zelda Retro Palette)
const SPRITE_PALETTE = {
  '.': 'transparent',
  'k': '#000000', // Outline
  'w': '#ffffff', // Shininess
  'g': '#387a22', // Knil Tunic green
  'l': '#56b833', // Knil Tunic light green
  'c': '#fcd2a3', // Knil Skin peach
  'h': '#f1c40f', // Force / Knil hair yellow
  'o': '#b89308', // Force shadow yellow
  's': '#995a3d', // Knil shield / strap brown
  'q': '#5c3624', // Knil hair shadow / boots brown
  'd': '#3a4454', // Dungeon wall slate
  'p': '#53627c', // Dungeon wall light slate
  'm': '#1b2027', // Dungeon wall shadow
  'e': '#e74c3c', // Ruby red
  'u': '#ff7675', // Ruby red highlight
  'r': '#e74c3c', // Hurt red / heart red
  'x': '#2d241e'  // Ground stone tile lines
};

// 16x16 Sprite Definitions
const SPRITES = {
  // Ground Tile (Dungeon floor)
  ground: [
    "xxxxxxxxxxxxxxxk",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "x..............k",
    "kkkkkkkkkkkkkkkk"
  ],
  
  // Dungeon Wall / Stone block
  wall: [
    "kkkkkkkkkkkkkkkk",
    "kpppppppppppppmk",
    "kpddddddddddddmk",
    "kpddddddddddddmk",
    "kpddppppddppppmk",
    "kpddpmmpddpmmpmk",
    "kpddddddddddddmk",
    "kpddddddddddddmk",
    "kpdpppppddddddmk",
    "kpdpmmmmddddddmk",
    "kpddddddddddddmk",
    "kpppppppppppppmk",
    "kpddddddddddddmk",
    "kpmmmmmmmmmmmmk",
    "kpmmmmmmmmmmmmk",
    "kkkkkkkkkkkkkkkk"
  ],

  // Ruby (Classic Vertical Hexagon Gem)
  crystal: [
    "......kk......",
    "....kkeekk....",
    "...kkeeeekk...",
    "..kkeeeuuukk..",
    "..keeeeuuuukk.",
    ".keeeeuuuuukk.",
    "keeeeuuuuuuukk",
    "keeeuuuuuuuukk",
    "keeeuuuuuuuukk",
    "keeeeuuuuuuukk",
    ".keeeeuuuuukk.",
    "..keeeeuuukk..",
    "...kkeeeekk...",
    "....kkeekk....",
    "......kk......",
    ".............."
  ],

  // Gold Force Gate
  portal: [
    ".......kk.......",
    "......khhk......",
    ".....khhhhk.....",
    "....khhhhhhk....",
    "...khkkkkkkhk...",
    "..khhkkkkkkhhk..",
    ".khhhkkkkkkhhhk.",
    "khhhhhkkkkhhhhhk",
    "khkkkkhkkhkkkkhk",
    "khhkkkhhkhhkkkhh",
    "khhhkkhhhkhhhkkh",
    "khhhhhhhhhhhhhhh",
    "kkkkkkkkkkkkkkkk",
    "................",
    "................",
    "................"
  ],

  // Knil Sprite - Facing Right (0)
  zog_0: [
    ".....kkkkkk.....",
    "....kggggggk....",
    "...kglggggglk...",
    "..kglgchhhcglk..",
    "..kglcchwwcclk..",
    "..kglcccccccck..",
    "...kggccccccks..",
    "....kggccccks...",
    "....kggggggss...",
    "...kglgggggss...",
    "..kglggggggss...",
    "..kkkkkkkkkkk...",
    "....kqq..qqk....",
    "....kqq..qqk....",
    "....kkq..qkk....",
    "................"
  ],

  // Knil Sprite - Facing Down (1)
  zog_1: [
    ".....kkkkkk.....",
    "....kggggggk....",
    "...kglggggglk...",
    "..kglghhhhglgkk.",
    "..kglhwwbwwlhgk.",
    "..kglhcccccckhk.",
    "...kglccccckk...",
    "....kkcccccsk...",
    "....kggggggssk..",
    "...kglgggggss...",
    "..kglggggggss...",
    "..kkkkkkkkkkk...",
    "....kqq..qqk....",
    "....kqq..qqk....",
    "....kkq..qkk....",
    "................"
  ],

  // Knil Sprite - Facing Left (2)
  zog_2: [
    ".....kkkkkk.....",
    "....kggggggk....",
    "...kglggggglk...",
    "..kglgchhhcglk..",
    "..kglcchwwcclk..",
    "..kglcccccccck..",
    "..skccccccggk...",
    "..skkccccggk....",
    "..ssggggggk.....",
    "..ssggggglk.....",
    "..ssgggggglk....",
    "..kkkkkkkkkkk...",
    "....kqq..qqk....",
    "....kqq..qqk....",
    "....kkq..qkk....",
    "................"
  ],

  // Knil Sprite - Facing Up (3)
  zog_3: [
    ".....kkkkkk.....",
    "....kggggggk....",
    "...kglggggglk...",
    "..kglggggggglk..",
    "..kglggggggglk..",
    "..kglggggggglk..",
    "...kglgggggk....",
    "....kkgggggk....",
    "....kggggggk....",
    "...kglggggglk...",
    "..kglggggggglk..",
    "..kkkkkkkkkkk...",
    "....kqq..qqk....",
    "....kqq..qqk....",
    "....kkq..qkk....",
    "................"
  ],

  // Knil Sprite - Hurt state
  zog_crashed: [
    "......kk........",
    "....kkrrkk..k...",
    "...krrkkrrkkk...",
    "..krrkkkkrrkk...",
    "..krkkwwkkrk....",
    "..krkkrrkkrk.k..",
    "...kccrrcck.k...",
    "....kkcckk.k....",
    "...kkggggkk.....",
    "..kgggkkgggk....",
    ".kgggkkkkgggk...",
    ".kkk.kkkk.kkk...",
    "....k.....k.....",
    "...kk....kk.....",
    "................",
    "................"
  ]
};

class GameSimulator {
  constructor(canvasId, onStatusMessage, onSoundTrigger) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onStatus = onStatusMessage;
    this.onSound = onSoundTrigger;
    this.onActionStart = null;
    
    this.level = null;
    this.grid = [];
    
    // Physical state
    this.x = 0;
    this.y = 0;
    this.dir = 0; // 0=Right, 1=Down, 2=Left, 3=Up
    this.collectedCount = 0;
    this.crystals = []; // List of rubies
    
    // Animation rendering interpolation
    this.rx = 0;
    this.ry = 0;
    this.rdir = 0;
    this.isCrashed = false;
    
    // Simulation execution states
    this.isPlaying = false;
    this.actionQueue = [];
    this.currentActionIndex = 0;
    this.actionDelay = 600;
    this.lastActionTime = 0;
    
    this.animId = null;
    this.animate = this.animate.bind(this);
  }

  initLevel(levelData) {
    this.level = JSON.parse(JSON.stringify(levelData));
    this.gridSize = this.level.gridSize;
    this.grid = this.level.grid;
    
    this.x = this.level.startX;
    this.y = this.level.startY;
    this.dir = this.level.startDir;
    
    this.rx = this.x;
    this.ry = this.y;
    this.rdir = this.dir;
    this.isCrashed = false;
    
    this.collectedCount = 0;
    this.crystals = [];
    
    // Find rubies
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        if (this.grid[r][c] === 3) {
          this.crystals.push({ x: c, y: r, collected: false });
        }
      }
    }
    
    this.isPlaying = false;
    this.actionQueue = [];
    this.currentActionIndex = 0;
    
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
    this.animId = requestAnimationFrame(this.animate);
    
    this.draw();
  }

  setSpeed(speedVal) {
    const delays = [1200, 900, 600, 350, 150];
    this.actionDelay = delays[speedVal - 1] || 600;
  }

  drawSprite(spriteName, targetX, targetY, cellSize) {
    const sprite = SPRITES[spriteName];
    if (!sprite) return;
    
    const pixelSize = cellSize / 16;
    
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 16; col++) {
        const colorChar = sprite[row][col];
        const color = SPRITE_PALETTE[colorChar];
        
        if (color && color !== 'transparent') {
          this.ctx.fillStyle = color;
          this.ctx.fillRect(
            targetX + col * pixelSize, 
            targetY + row * pixelSize, 
            Math.ceil(pixelSize), 
            Math.ceil(pixelSize)
          );
        }
      }
    }
  }

  draw() {
    if (!this.level) return;
    
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cellSize = width / this.gridSize;
    
    this.ctx.clearRect(0, 0, width, height);
    
    // 1. Draw Grid Tiles
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const tileX = c * cellSize;
        const tileY = r * cellSize;
        const tileType = this.grid[r][c];
        
        // Base floor
        this.ctx.fillStyle = '#221914'; // Dark stone floor brown
        this.ctx.fillRect(tileX, tileY, cellSize, cellSize);
        this.drawSprite('ground', tileX, tileY, cellSize);
        
        if (tileType === 1) {
          this.drawSprite('wall', tileX, tileY, cellSize);
        } else if (tileType === 2) {
          this.drawSprite('portal', tileX, tileY, cellSize);
        }
      }
    }
    
    // 2. Draw Rubies
    this.crystals.forEach(ruby => {
      if (!ruby.collected) {
        this.drawSprite('crystal', ruby.x * cellSize, ruby.y * cellSize, cellSize);
      }
    });
    
    // 3. Draw Knil
    const robotSprite = this.isCrashed ? 'zog_crashed' : `zog_${this.dir}`;
    this.drawSprite(robotSprite, this.rx * cellSize, this.ry * cellSize, cellSize);
  }

  animate(timestamp) {
    if (!this.level) return;
    
    const dx = this.x - this.rx;
    const dy = this.y - this.ry;
    const ease = 0.15;
    
    if (Math.abs(dx) > 0.01) {
      this.rx += dx * ease;
    } else {
      this.rx = this.x;
    }
    
    if (Math.abs(dy) > 0.01) {
      this.ry += dy * ease;
    } else {
      this.ry = this.y;
    }
    
    this.draw();
    
    if (this.isPlaying) {
      if (!this.lastActionTime) this.lastActionTime = timestamp;
      const elapsed = timestamp - this.lastActionTime;
      if (elapsed >= this.actionDelay) {
        this.executeNextAction();
        this.lastActionTime = timestamp;
      }
    }
    
    this.animId = requestAnimationFrame(this.animate);
  }

  loadActionQueue(queue) {
    this.actionQueue = queue;
    this.currentActionIndex = 0;
    this.isPlaying = true;
    this.lastActionTime = 0;
    this.onStatus("⚔️ Knil has entered the dungeon room...", "system");
  }

  stopSimulation() {
    this.isPlaying = false;
    if (this.onFinishedCallback) {
      this.onFinishedCallback(false, "Stopped");
    }
  }

  executeNextAction() {
    if (this.currentActionIndex >= this.actionQueue.length) {
      this.isPlaying = false;
      this.checkWinCondition();
      return;
    }
    
    const action = this.actionQueue[this.currentActionIndex];
    this.currentActionIndex++;
    
    if (this.onActionStart) {
      this.onActionStart(action);
    }
    
    switch (action.type) {
      case 'MOVE_FORWARD':
        this.moveHeroForward();
        break;
      case 'TURN_LEFT':
        this.turnHeroLeft();
        break;
      case 'TURN_RIGHT':
        this.turnHeroRight();
        break;
      case 'COLLECT':
        this.collectRubyAtCurrent();
        break;
      case 'UNLOCK_GATE':
        this.unlockGate(action.code);
        break;
      case 'PRINT':
        this.onStatus(action.message, "output");
        this.onSound('print');
        break;
    }
    
    if (this.isCrashed) {
      this.isPlaying = false;
      this.onStatus("💥 OOF! Knil collided with a stone wall boundary. Sector locked.", "error");
      this.onSound('crash');
      if (this.onFinishedCallback) {
        this.onFinishedCallback(false, "crashed");
      }
    }
  }

  unlockGate(code) {
    if (code && (code.toLowerCase().trim() === "forza" || code.toLowerCase().trim() === "forza")) {
      const gateX = this.level.gateX !== undefined ? this.level.gateX : 2;
      const gateY = this.level.gateY !== undefined ? this.level.gateY : 1;
      if (this.grid[gateY][gateX] === 1) {
        this.grid[gateY][gateX] = 0; // Clear the wall
        this.onStatus("🗝️ GATE UNLOCKED! The iron gate opens.", "system");
        this.onSound('win');
      }
    } else {
      this.onStatus(`⚠️ Code is incorrect! The gate remains sealed.`, "error");
      this.onSound('error');
    }
  }

  moveHeroForward() {
    let nextX = this.x;
    let nextY = this.y;
    
    switch (this.dir) {
      case 0: nextX++; break;
      case 1: nextY++; break;
      case 2: nextX--; break;
      case 3: nextY--; break;
    }
    
    if (nextX < 0 || nextX >= this.gridSize || nextY < 0 || nextY >= this.gridSize) {
      this.isCrashed = true;
      this.x = nextX;
      this.y = nextY;
      return;
    }
    
    if (this.grid[nextY][nextX] === 1) {
      this.isCrashed = true;
      this.x = nextX;
      this.y = nextY;
      return;
    }
    
    this.x = nextX;
    this.y = nextY;
    this.onStatus(`⚔️ hero.move_forward() -> Dungeon Coordinates (${this.x}, ${this.y})`, "system");
    this.onSound('step');
  }

  turnHeroLeft() {
    this.dir = (this.dir + 3) % 4;
    this.onStatus(`⚔️ hero.turn_left() -> Facing ${this.getDirectionName(this.dir)}`, "system");
    this.onSound('turn');
  }

  turnHeroRight() {
    this.dir = (this.dir + 1) % 4;
    this.onStatus(`⚔️ hero.turn_right() -> Facing ${this.getDirectionName(this.dir)}`, "system");
    this.onSound('turn');
  }

  collectRubyAtCurrent() {
    const ruby = this.crystals.find(c => c.x === this.x && c.y === this.y && !c.collected);
    if (ruby) {
      ruby.collected = true;
      this.collectedCount++;
      this.onStatus(`💎 Ruby acquired! Total rubies: ${this.collectedCount}`, "output");
      this.onSound('collect');
    } else {
      this.onStatus("⚠️ hero.collect_ruby() -> Warning: No rubies found on this tile.", "error");
      this.onSound('error');
    }
  }

  checkWinCondition() {
    const isOnPortal = (this.grid[this.y][this.x] === 2);
    const hasAllCrystals = (this.collectedCount >= this.level.targetCrystals);
    
    let printSuccess = true;
    if (this.level.requirePrint) {
      const prints = this.actionQueue.filter(a => a.type === 'PRINT');
      const correctPrint = prints.some(p => String(p.message).trim() === String(this.level.targetCrystals));
      if (!correctPrint) {
        printSuccess = false;
      }
    }
    
    if (isOnPortal && hasAllCrystals && printSuccess) {
      this.onStatus("🗝️ THE FORCE SHINES! Dungeon room solved.", "system");
      this.onSound('win');
      if (this.onFinishedCallback) {
        this.onFinishedCallback(true, "success");
      }
    } else if (isOnPortal && !hasAllCrystals) {
      this.onStatus(`⚠️ The Force gate is sealed. Collect all rubies! (${this.collectedCount}/${this.level.targetCrystals})`, "error");
      this.onSound('error');
      if (this.onFinishedCallback) {
        this.onFinishedCallback(false, "missing_crystals");
      }
    } else if (isOnPortal && !printSuccess) {
      this.onStatus(`⚠️ Almost cleared, but you did not print() the ruby count!`, "error");
      this.onSound('error');
      if (this.onFinishedCallback) {
        this.onFinishedCallback(false, "missing_print");
      }
    } else {
      this.onStatus("🧭 Knil finished movements but did not reach the Force Gate.", "error");
      this.onSound('error');
      if (this.onFinishedCallback) {
        this.onFinishedCallback(false, "incomplete");
      }
    }
  }

  getDirectionName(dir) {
    const names = ["East (Right)", "South (Down)", "West (Left)", "North (Up)"];
    return names[dir] || "Unknown";
  }

  scanAhead(shadowX, shadowY, shadowDir) {
    if (this.isCrashed) return 'obstacle';
    
    let nextX = shadowX;
    let nextY = shadowY;
    switch (shadowDir) {
      case 0: nextX++; break;
      case 1: nextY++; break;
      case 2: nextX--; break;
      case 3: nextY--; break;
    }
    
    if (nextX < 0 || nextX >= this.gridSize || nextY < 0 || nextY >= this.gridSize) {
      return "obstacle";
    }
    
    const tile = this.grid[nextY][nextX];
    if (tile === 1) return "obstacle";
    if (tile === 2) return "portal";
    
    const ruby = this.crystals.some(c => c.x === nextX && c.y === nextY && !c.collected);
    if (ruby) return "crystal";
    
    return "empty";
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameSimulator;
}
