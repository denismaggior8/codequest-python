const assert = require('assert');
const path = require('path');
const LEVELS = require('../js/levels.js');

console.log('🧪 Starting CodeQuest Room Unit Tests...\n');

let failedTestsCount = 0;
let passedTestsCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ Passed: ${name}`);
    passedTestsCount++;
  } catch (err) {
    console.error(`❌ Failed: ${name}`);
    console.error(err);
    failedTestsCount++;
  }
}

// 1. Check that LEVELS has at least 1 room
runTest('LEVELS array validity', () => {
  assert(Array.isArray(LEVELS), 'LEVELS should be an array');
  assert(LEVELS.length > 0, 'LEVELS should contain at least one room');
});

LEVELS.forEach((room, idx) => {
  const roomLabel = `Room ${room.id || idx + 1} ("${room.name ? room.name.en : 'Untitled'}")`;

  // 2. Validate basic schema and properties
  runTest(`${roomLabel} - Basic Schema Verification`, () => {
    assert(['number', 'string'].includes(typeof room.id), 'id must be a number or a string');
    if (typeof room.id === 'number') {
      assert(room.id > 0, 'id must be positive');
    } else {
      assert(room.id.length > 0, 'id string must not be empty');
      assert(room.id.includes('/'), 'id string must include a slash separating the topic and room (e.g. topic/room)');
    }
    
    // Check names & strings
    assert(room.name && room.name.it && room.name.en, 'name must have "it" and "en" translations');
    assert(room.story && room.story.it && room.story.en, 'story must have "it" and "en" translations');
    assert(room.goalText && room.goalText.it && room.goalText.en, 'goalText must have "it" and "en" translations');
    assert(room.tip && room.tip.it && room.tip.en, 'tip must have "it" and "en" translations');
    
    // Check badge & difficulty
    assert.strictEqual(typeof room.badge, 'string', 'badge must be a string');
    assert.strictEqual(typeof room.difficulty, 'string', 'difficulty must be a string');
    assert(['base', 'intermediate', 'advanced'].includes(room.difficulty), 'difficulty must be "base", "intermediate" or "advanced"');
    
    // Check optional verification constraints
    if (room.requireConditional !== undefined) {
      assert.strictEqual(typeof room.requireConditional, 'boolean', 'requireConditional must be a boolean');
    }
    if (room.requireLoop !== undefined) {
      assert.strictEqual(typeof room.requireLoop, 'boolean', 'requireLoop must be a boolean');
    }
    if (room.requireFunction !== undefined) {
      assert.strictEqual(typeof room.requireFunction, 'boolean', 'requireFunction must be a boolean');
    }
    
    // Check documentation
    assert(room.docs && Array.isArray(room.docs.it) && Array.isArray(room.docs.en), 'docs must have "it" and "en" arrays');
    room.docs.it.forEach((doc, i) => {
      assert(doc.code && doc.desc, `docs.it[${i}] must have "code" and "desc"`);
    });
    room.docs.en.forEach((doc, i) => {
      assert(doc.code && doc.desc, `docs.en[${i}] must have "code" and "desc"`);
    });
  });

  // 3. Grid & Coordinates validation
  runTest(`${roomLabel} - Grid and Coordinates Integrity`, () => {
    const size = room.gridSize;
    assert.strictEqual(typeof size, 'number', 'gridSize must be a number');
    assert(size >= 3 && size <= 25, 'gridSize should be reasonable (3 to 25)');
    
    assert(Array.isArray(room.grid), 'grid must be an array');
    assert.strictEqual(room.grid.length, size, `grid height must equal gridSize (${size})`);
    
    room.grid.forEach((row, rIdx) => {
      assert(Array.isArray(row), `grid row ${rIdx} must be an array`);
      assert.strictEqual(row.length, size, `grid row ${rIdx} length must equal gridSize (${size})`);
      row.forEach((cell, cIdx) => {
        assert(typeof cell === 'number', `cell at row ${rIdx}, col ${cIdx} must be a number`);
        assert([0, 1, 2, 3].includes(cell), `cell at row ${rIdx}, col ${cIdx} has invalid type (${cell})`);
      });
    });

    // Check Start Coordinates
    assert.strictEqual(typeof room.startX, 'number', 'startX must be a number');
    assert.strictEqual(typeof room.startY, 'number', 'startY must be a number');
    assert(room.startX >= 0 && room.startX < size, `startX (${room.startX}) out of bounds`);
    assert(room.startY >= 0 && room.startY < size, `startY (${room.startY}) out of bounds`);
    
    // Start tile must not be a wall (1)
    const startTile = room.grid[room.startY][room.startX];
    assert.notStrictEqual(startTile, 1, `start tile at (${room.startX}, ${room.startY}) cannot be a wall (1)`);
    
    // Check startDir
    assert([0, 1, 2, 3].includes(room.startDir), 'startDir must be 0 (RIGHT), 1 (DOWN), 2 (LEFT), or 3 (UP)');
  });

  // 4. Solvability & Pathfinding (BFS)
  runTest(`${roomLabel} - Pathfinding & Solvability (BFS)`, () => {
    const size = room.gridSize;
    const grid = room.grid;
    
    // BFS to find all reachable tiles
    const queue = [[room.startX, room.startY]];
    const visited = new Set();
    visited.add(`${room.startX},${room.startY}`);
    
    let hasPortal = false;
    let rupeesFound = 0;
    let totalRupeesInGrid = 0;
    
    // Count all rupees in grid
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 3) totalRupeesInGrid++;
      }
    }
    
    const directions = [
      [1, 0],  // right
      [-1, 0], // left
      [0, 1],  // down
      [0, -1]  // up
    ];
    
    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const currentCell = grid[y][x];
      
      if (currentCell === 2) {
        hasPortal = true;
      }
      if (currentCell === 3) {
        rupeesFound++;
      }
      
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        
        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
          const nextCell = grid[ny][nx];
          const isGate = (room.gateX !== undefined && nx === room.gateX && room.gateY !== undefined && ny === room.gateY);
          if ((nextCell !== 1 || isGate) && !visited.has(key)) {
            visited.add(key);
            queue.push([nx, ny]);
          }
        }
      }
    }
    
    // Assert there is a path to the portal
    assert(hasPortal, 'There must be a walkable path from start coordinates to the portal (2)');
    
    // Assert all rupees in the grid are reachable
    assert.strictEqual(rupeesFound, totalRupeesInGrid, `Only ${rupeesFound} of ${totalRupeesInGrid} rupees are reachable from start coordinates`);
    
    // Verify targetCrystals match rupees count
    const targetCrystals = room.targetCrystals || 0;
    assert.strictEqual(totalRupeesInGrid, targetCrystals, `Expected ${targetCrystals} rupees, but grid has ${totalRupeesInGrid}`);
  });

  // 5. Toolbox XML/JSON Schema integrity
  runTest(`${roomLabel} - Toolbox configuration integrity`, () => {
    assert(room.toolbox, 'Room must have a toolbox configured');
    assert.strictEqual(room.toolbox.kind, 'categoryToolbox', 'toolbox kind must be "categoryToolbox"');
    assert(Array.isArray(room.toolbox.contents), 'toolbox contents must be an array');
    assert(room.toolbox.contents.length > 0, 'toolbox contents must not be empty');
  });
});

const fs = require('fs');
const appContent = fs.readFileSync(path.join(__dirname, '../js/transpiler.js'), 'utf8');
const startIdx = appContent.indexOf('function translateTernaryInLine(line) {');

if (startIdx !== -1) {
  const endMarker = 'return jsCode;\n}';
  const endMarkerIdx = appContent.indexOf(endMarker, startIdx);
  if (endMarkerIdx !== -1) {
    const endIdx = endMarkerIdx + endMarker.length;
    const fnSource = appContent.substring(startIdx, endIdx);
    eval(fnSource); // Defines transpilePythonToJS locally in the test context
    
    runTest('Transpiler - Basic function structure and commands', () => {
      const py = 'def on_start():\n    hero.move_forward()\n    hero.collect_rupee()';
      const js = transpilePythonToJS(py);
      assert(js.includes('function on_start() {'), 'Should translate def to function');
      assert(js.includes('moveForward();'), 'Should translate hero.move_forward()');
      assert(js.includes('collectRupee();'), 'Should translate hero.collect_rupee()');
    });

    runTest('Transpiler - unlock_gate command', () => {
      const py = 'def on_start():\n    hero.unlock_gate("secret")';
      const js = transpilePythonToJS(py);
      assert(js.includes('unlockGate("secret");'), 'Should translate hero.unlock_gate("secret")');
    });

    runTest('Transpiler - Global variable declarations', () => {
      const py = 'def on_start():\n    global rupees, numbers\n    rupees = 0';
      const js = transpilePythonToJS(py);
      assert(js.includes('// global rupees, numbers'), 'Should comment out global statement');
      assert(js.includes('rupees = 0;'), 'Should preserve assignment');
    });

    runTest('Transpiler - Variable range loops', () => {
      const py = 'for i in range(rupees):\n    hero.move_forward()';
      const js = transpilePythonToJS(py);
      assert(js.includes('for (let i = 0; i < rupees; i++) {'), 'Should support variable limit in range()');
    });

    runTest('Transpiler - Range loop with start and stop parameters', () => {
      const py = 'for i in range(1, 5):\n    hero.move_forward()';
      const js = transpilePythonToJS(py);
      assert(js.includes('for (let i = 1; i < 5; i++) {'), 'Should support range(start, stop)');
    });

    runTest('Transpiler - Comments handling', () => {
      const py = '# Whole line comment\nhero.move_forward() # End-of-line comment';
      const js = transpilePythonToJS(py);
      assert(js.includes('// Whole line comment'), 'Should convert whole line comment');
      assert(js.includes('moveForward(); // End-of-line comment'), 'Should convert end-of-line comment');
    });

    runTest('Transpiler - Booleans, None, and logical operators', () => {
      const py = 'is_empty = None\nif True and not False:\n    pass';
      const js = transpilePythonToJS(py);
      assert(js.includes('is_empty = null;'), 'Should translate None to null');
      assert(js.includes('if (true && !false) {'), 'Should translate boolean/logical keywords in conditions');
      assert(!js.includes('pass'), 'Should strip pass statements');
    });

    runTest('Transpiler - Protecting string literals from translation', () => {
      const py = 'print("do not touch True or False or None or global inside strings")';
      const js = transpilePythonToJS(py);
      assert(js.includes('printConsole("do not touch True or False or None or global inside strings");'), 'Keywords inside strings should be protected');
    });

    runTest('Transpiler - Imports and from-imports', () => {
      const py = 'import math\nfrom numbers import Number';
      const js = transpilePythonToJS(py);
      assert(js.includes('// import math'), 'Should comment out import math');
      assert(js.includes('// from numbers import Number'), 'Should comment out from numbers import Number');
    });

    runTest('Transpiler - isinstance checks', () => {
      const py = 'isinstance(rupees, Number)\nisinstance(name, str)\nisinstance(items, list)';
      const js = transpilePythonToJS(py);
      assert(js.includes('(typeof rupees === \'number\')'), 'Should translate isinstance with Number to typeof === number');
      assert(js.includes('(typeof name === \'string\')'), 'Should translate isinstance with str to typeof === string');
      assert(js.includes('Array.isArray(items)'), 'Should translate isinstance with list to Array.isArray');
    });

    runTest('Transpiler - Inline ternary operators', () => {
      const py = 'rupees = (rupees if isinstance(rupees, Number) else 0) + 1';
      const js = transpilePythonToJS(py);
      assert(js.includes('rupees = (((typeof rupees === \'number\') ? rupees : 0)) + 1;'), 'Should translate inline ternary operator correctly');
    });
  } else {
    console.error('⚠️ Could not extract transpilePythonToJS from app.js (matching brace not found)');
  }
} else {
  console.error('⚠️ Could not find transpilePythonToJS in app.js for testing');
}

console.log('\n--- Test Run Summary ---');
console.log(`Passed: ${passedTestsCount}`);
console.log(`Failed: ${failedTestsCount}`);

if (failedTestsCount > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
