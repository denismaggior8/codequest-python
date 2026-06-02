# The Legend of Python

**The Legend of Python** is an educational, browser-based retro programming game designed to teach Python and programming logic using a visual, gamified environment inspired by retro Zelda classics. 

Players guide the hero, **Link**, through grid-based stone dungeons to reach the gold **Triforce Warp Gate**, using either visual **Blockly** blocks or writing raw **Python** code.

---

## 🎮 Game Interface & Layout

The application features a dark, 8-bit retro theme with harmonic HSL colors and includes:
- **Interactive Simulator**: A real-time canvas where Link performs movements, collects rupees, detects obstacles, or crashes into walls.
- **Dungeon Console Registry**: A terminal logging actions, game statuses, console prints, and warnings or compilation errors.
- **Spell Book & Code Editor**:
  - **Blocks Mode**: A Blockly workspace containing category drawers (Commands, Variables, Loops, Logic, Functions) to build visual code structures.
  - **Python Mode**: A syntax-highlighted text editor showing the compiled code and allowing advanced players to write Python statements directly.

---

## ⚡ Core Features

### 1. Dual Programming Workspace
Players can toggle seamlessly between a visual **Blockly** editor and a text-based **Python** editor. Changes in Blockly automatically translate to real-time Python code, bridging the gap between block-based and text-based syntax.

### 2. Event-Driven Execution (`on_start`)
To align with standard programming conventions, code must be placed inside the `on_start()` function context:
- In Blockly: Blocks must attach to the `Quando premi avvia` / `on_start` event block.
- In Python: Code must be wrapped inside a `def on_start():` function definition.
- **Visual Disabling**: Blocks placed outside the event block are dynamically greyed out and ignored.
- **Singleton Constraints**: Blockly restricts the workspace to exactly **one** `on_start` block using `maxInstances` configurations.

### 3. Programming Construct Enforcement
To prevent players from bypassing the learning objectives (e.g. writing repeating sequential lines of code instead of a loop), the compiler enforces conceptual requirements before execution:
- **Conditionals Room**: Requires at least one `if` statement block/construct.
- **Loops Room**: Requires at least one `for` or `while` loop construct.
- **Functions Room**: Requires at least one custom function declaration (`def`).
- *Note:* In Python mode, comments are automatically stripped during validation to prevent cheating (e.g., `# using a for loop` will not bypass the check).

### 4. Interactive Step-by-Step Debugger
In addition to the **Run (AVVIA)** button, players can use the **Step (PASSO)** debugger to execute commands one-by-one. The simulator advances Link step-by-step and inspects console outputs without resetting his position between steps, aiding in debugging complex algorithms.

### 5. Retro Sound Synthesizer (`RetroSynth`)
Built using the browser's Web Audio API, a custom synthesizer generates authentic 8-bit sound effects (chimes, clicks, rupee collections, step movements, victory fanfares, and error blips) without loading external audio assets. An interaction unlock listener automatically initializes the AudioContext on the first user click/keypress to comply with browser autoplay restrictions.

### 6. i18n Translation Engine
The interface includes full localization support for English (**EN**) and Italian (**IT**). Story dialogs, objectives, command documentation, help menus, console logs, and Blockly block labels translate dynamically.

---

## 🗂️ Curriculum & Room Progression

Levels are organized in the selection dropdown under difficulty groupings:

### 🟢 Basic Level (Livello Base)
- **Room 1: Sequences** (`sequences/room1`): Linear instructions (`hero.move_forward()`).
- **Room 2: Variables** (`variables/room1`): Declaring, incrementing variables (`rupees = rupees + 1`), and outputting results (`print(rupees)`).
- **Room 3: Conditionals** (`conditionals/room1`): Checking environment tiles using sensors (`if hero.scan_ahead() == "obstacle":`).
- **Room 4: Loops** (`loops/room1`): Repeating routines cleanly (`for i in range(4):`).
- **Room 5: Functions** (`functions/room1`): Defining custom macros (`def step_and_collect():`) to navigate mazes.

### 🟡 Intermediate Level (Livello Intermedio)
- **Room 6: Lists** (`lists/room1`): Using array structures to store coordinates or move queues.

### 🔴 Advanced Level (Livello Avanzato)
- **Room 7: Recursion** (`recursion/room1`): Using recursive calls to solve winding portals and nested chambers.

---

## 💖 Topic-Based Hearts Progress & Save System

- **Hearts Display**: The HUD displays a list of hearts representing the educational topics (concepts). A heart turns red (`❤️`) only when **all rooms** under that specific concept are cleared, promoting complete topic mastery.
- **Auto-Save**: Progress and custom workspace layouts auto-save to browser `localStorage` on level load and win.
- **JSON Save Import/Export**: Players can download their game states (`.json` files) and load them on other machines.
- **Backward-Compatible Migration**: The system features an automatic migration helper (`migrateOldSaveData`). If it detects a legacy save utilizing old numeric IDs (`1` to `7`), it silently maps them to the new folder-based namespaces (e.g. `conditionals/room1`), ensuring players keep their progress across updates.

---

## 📂 Project Modularity & Directory Structure

The codebase is organized modularly to ease maintainability and scaling:
```
├── index.html          # Game Dashboard layout and script dependencies
├── style.css           # Vanilla HSL retro stylesheet & layout styling
├── js/
│   ├── app.js          # Core controller, event bindings, and Synth engine
│   ├── blocks.js       # Custom Blockly definitions & JS/Python generators
│   ├── i18n.js         # Translation dictionaries (IT/EN) and helper
│   ├── simulator.js    # Simulation canvas renderer & action queue evaluator
│   ├── levels.js       # Levels dynamic aggregator & environment check
│   └── rooms/          # Topic-based room configuration files
│       ├── sequences/
│       │   └── room1.js
│       ├── variables/
│       │   └── room1.js
│       ├── conditionals/
│       │   └── room1.js
│       ├── loops/
│       │   └── room1.js
│       ├── functions/
│       │   └── room1.js
│       ├── lists/
│       │   └── room1.js
│       └── recursion/
│           └── room1.js
└── tests/
    └── rooms.test.js   # Automated unit test suite
```

---

## 💻 How to Run & Verify

### 1. Launch the Application Locally
Run a basic HTTP server in the project directory:
```bash
python3 -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

### 2. Run Room Unit Tests
We provide a comprehensive, dependency-free Node.js unit test suite. Run:
```bash
npm test
```
The test suite validates:
- **Schema Conformity**: Checks types and translation coverage for all levels.
- **Bounds Checking**: Assures start coordinates, sizes, and tiles are valid.
- **BFS Pathfinding Solvability**: Runs a Breadth-First Search to programmatically prove a path exists from the hero's start to the Triforce portal without crossing walls.
- **Crystals/Rupee Reachability**: Confirms all crystals placed on the map are fully reachable from the starting point and match the configured target crystals.
