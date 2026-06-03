// The Legend of Python - Python-to-JS Transpiler & Sandbox Evaluator

function validateLevelConstructs(level) {
  let hasIf = false;
  let hasLoop = false;
  let hasDef = false;

  if (currentMode === 'blocks') {
    if (typeof workspace !== 'undefined' && workspace) {
      const blocks = workspace.getAllBlocks(false);
      hasIf = blocks.some(b => b.type === 'controls_if');
      hasLoop = blocks.some(b => ['controls_repeat_ext', 'controls_repeat', 'controls_whileUntil', 'controls_for'].includes(b.type));
      hasDef = blocks.some(b => ['procedures_defnoreturn', 'procedures_defreturn'].includes(b.type));
    }
  } else {
    const pyTextarea = document.getElementById('python-textarea');
    const pyCode = pyTextarea ? pyTextarea.value : '';
    // Strip comments to prevent cheating
    const lines = pyCode.split('\n').map(line => {
      const hashIdx = line.indexOf('#');
      return hashIdx === -1 ? line : line.substring(0, hashIdx);
    });
    const cleanCode = lines.join('\n');
    
    hasIf = /\bif\b/.test(cleanCode) || /\belif\b/.test(cleanCode);
    hasLoop = /\bfor\b/.test(cleanCode) || /\bwhile\b/.test(cleanCode);
    hasDef = /\bdef\b/.test(cleanCode);
  }

  if (level.requireConditional && !hasIf) {
    return t('consoleErrorRequireConditional');
  }
  if (level.requireLoop && !hasLoop) {
    return t('consoleErrorRequireLoop');
  }
  if (level.requireFunction && !hasDef) {
    return t('consoleErrorRequireFunction');
  }

  return null;
}

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) {
    while (pyodideLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pyodideInstance;
  }
  
  pyodideLoading = true;
  appendConsoleLine(t('consoleInit'), 'system');
  
  try {
    // Load Pyodide script dynamically if not present
    if (typeof loadPyodide === 'undefined') {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
      document.head.appendChild(script);
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });
    }
    
    pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
    });
    
    appendConsoleLine("Pyodide Engine ready.", 'system');
  } catch (err) {
    console.error("Pyodide load error:", err);
    appendConsoleLine("⚠️ Pyodide failed to load. Falling back to local JS simulator.", 'error');
  } finally {
    pyodideLoading = false;
  }
  
  return pyodideInstance;
}

async function compileActionQueuePyodide(pyCode) {
  const actionQueue = [];
  const level = LEVELS[currentLevelIndex];
  
  const shadowRobot = {
    x: level.startX,
    y: level.startY,
    dir: level.startDir,
    grid: JSON.parse(JSON.stringify(level.grid)),
    crystals: JSON.parse(JSON.stringify(simulator.crystals)),
    crashed: false
  };
  
  const pyodide = await getPyodide();
  if (!pyodide) {
    throw new Error(currentLanguage === 'it' ? "Impossibile caricare il motore Python." : "Unable to load Python engine.");
  }
  
  // Define hero JS callbacks exposed to Pyodide
  const heroJS = {
    move_forward: () => {
      if (shadowRobot.crashed) return;
      let nextX = shadowRobot.x;
      let nextY = shadowRobot.y;
      switch (shadowRobot.dir) {
        case 0: nextX++; break;
        case 1: nextY++; break;
        case 2: nextX--; break;
        case 3: nextY--; break;
      }
      if (nextX < 0 || nextX >= level.gridSize || nextY < 0 || nextY >= level.gridSize) {
        shadowRobot.crashed = true;
      } else if (shadowRobot.grid[nextY][nextX] === 1) {
        shadowRobot.crashed = true;
      } else {
        shadowRobot.x = nextX;
        shadowRobot.y = nextY;
      }
      actionQueue.push({ type: 'MOVE_FORWARD' });
    },
    turn_left: () => {
      if (shadowRobot.crashed) return;
      shadowRobot.dir = (shadowRobot.dir + 3) % 4;
      actionQueue.push({ type: 'TURN_LEFT' });
    },
    turn_right: () => {
      if (shadowRobot.crashed) return;
      shadowRobot.dir = (shadowRobot.dir + 1) % 4;
      actionQueue.push({ type: 'TURN_RIGHT' });
    },
    collect_rupee: () => {
      if (shadowRobot.crashed) return;
      const rupee = shadowRobot.crystals.find(c => c.x === shadowRobot.x && c.y === shadowRobot.y && !c.collected);
      if (rupee) {
        rupee.collected = true;
      }
      actionQueue.push({ type: 'COLLECT' });
    },
    scan_ahead: () => {
      if (shadowRobot.crashed) return 'obstacle';
      let nextX = shadowRobot.x;
      let nextY = shadowRobot.y;
      switch (shadowRobot.dir) {
        case 0: nextX++; break;
        case 1: nextY++; break;
        case 2: nextX--; break;
        case 3: nextY--; break;
      }
      if (nextX < 0 || nextX >= level.gridSize || nextY < 0 || nextY >= level.gridSize) {
        return "obstacle";
      }
      const tile = shadowRobot.grid[nextY][nextX];
      if (tile === 1) return "obstacle";
      if (tile === 2) return "portal";
      const rupee = shadowRobot.crystals.some(c => c.x === nextX && c.y === nextY && !c.collected);
      if (rupee) return "crystal";
      return "empty";
    },
    unlock_gate: (code) => {
      if (shadowRobot.crashed) return;
      actionQueue.push({ type: 'UNLOCK_GATE', code: String(code) });
      if (code && String(code).toLowerCase().trim() === "triforza") {
        const gateX = level.gateX !== undefined ? level.gateX : 2;
        const gateY = level.gateY !== undefined ? level.gateY : 1;
        shadowRobot.grid[gateY][gateX] = 0;
      }
    },
    print_queue: (msg) => {
      actionQueue.push({ type: 'PRINT', message: String(msg) });
    }
  };
  
  globalThis.hero_js = heroJS;
  
  try {
    const setupPyCode = `
import sys
from js import hero_js

class HeroWrapper:
    def move_forward(self):
        hero_js.move_forward()
    def turn_left(self):
        hero_js.turn_left()
    def turn_right(self):
        hero_js.turn_right()
    def collect_rupee(self):
        hero_js.collect_rupee()
    def scan_ahead(self):
        return hero_js.scan_ahead()
    def unlock_gate(self, code):
        hero_js.unlock_gate(code)

hero = HeroWrapper()

class QueueWriter:
    def write(self, text):
        if text and text != '\\n':
            for line in text.split('\\n'):
                if line:
                    hero_js.print_queue(line)
    def flush(self):
        pass

sys.stdout = QueueWriter()
`;
    pyodide.runPython(setupPyCode);
    
    // Exec code in Pyodide
    pyodide.runPython(pyCode);
    
    const hasOnStart = pyodide.runPython("'on_start' in globals() and callable(globals()['on_start'])");
    if (hasOnStart) {
      pyodide.runPython("on_start()");
    } else {
      actionQueue.push({ type: 'PRINT', message: t('consoleErrorNoStart') });
    }
  } finally {
    delete globalThis.hero_js;
  }
  
  return actionQueue;
}

function compileActionQueue(jsCode) {
  const actionQueue = [];
  const level = LEVELS[currentLevelIndex];
  
  const shadowRobot = {
    x: level.startX,
    y: level.startY,
    dir: level.startDir,
    grid: JSON.parse(JSON.stringify(level.grid)),
    crystals: JSON.parse(JSON.stringify(simulator.crystals)),
    crashed: false
  };
  
  globalThis.moveForward = () => {
    if (!isExecutingStart) return;
    if (shadowRobot.crashed) return;
    
    let nextX = shadowRobot.x;
    let nextY = shadowRobot.y;
    switch (shadowRobot.dir) {
      case 0: nextX++; break;
      case 1: nextY++; break;
      case 2: nextX--; break;
      case 3: nextY--; break;
    }
    
    if (nextX < 0 || nextX >= level.gridSize || nextY < 0 || nextY >= level.gridSize) {
      shadowRobot.crashed = true;
    } else if (shadowRobot.grid[nextY][nextX] === 1) {
      shadowRobot.crashed = true;
    } else {
      shadowRobot.x = nextX;
      shadowRobot.y = nextY;
    }
    actionQueue.push({ type: 'MOVE_FORWARD' });
  };
  
  globalThis.turnLeft = () => {
    if (!isExecutingStart) return;
    if (shadowRobot.crashed) return;
    shadowRobot.dir = (shadowRobot.dir + 3) % 4;
    actionQueue.push({ type: 'TURN_LEFT' });
  };
  
  globalThis.turnRight = () => {
    if (!isExecutingStart) return;
    if (shadowRobot.crashed) return;
    shadowRobot.dir = (shadowRobot.dir + 1) % 4;
    actionQueue.push({ type: 'TURN_RIGHT' });
  };
  
  globalThis.collectRupee = () => {
    if (!isExecutingStart) return;
    if (shadowRobot.crashed) return;
    const rupee = shadowRobot.crystals.find(c => c.x === shadowRobot.x && c.y === shadowRobot.y && !c.collected);
    if (rupee) {
      rupee.collected = true;
    }
    actionQueue.push({ type: 'COLLECT' });
  };
  
  globalThis.scanAhead = () => {
    if (!isExecutingStart) return "obstacle";
    if (shadowRobot.crashed) return 'obstacle';
    
    let nextX = shadowRobot.x;
    let nextY = shadowRobot.y;
    switch (shadowRobot.dir) {
      case 0: nextX++; break;
      case 1: nextY++; break;
      case 2: nextX--; break;
      case 3: nextY--; break;
    }
    
    if (nextX < 0 || nextX >= level.gridSize || nextY < 0 || nextY >= level.gridSize) {
      return "obstacle";
    }
    
    const tile = shadowRobot.grid[nextY][nextX];
    if (tile === 1) return "obstacle";
    if (tile === 2) return "portal";
    
    const rupee = shadowRobot.crystals.some(c => c.x === nextX && c.y === nextY && !c.collected);
    if (rupee) return "crystal";
    
    return "empty";
  };
  
  globalThis.printConsole = (msg) => {
    if (!isExecutingStart) return;
    actionQueue.push({ type: 'PRINT', message: String(msg) });
  };
  
  globalThis.unlockGate = (code) => {
    if (!isExecutingStart) return;
    if (shadowRobot.crashed) return;
    actionQueue.push({ type: 'UNLOCK_GATE', code: String(code) });
    if (code && String(code).toLowerCase().trim() === "triforza") {
      const gateX = level.gateX !== undefined ? level.gateX : 2;
      const gateY = level.gateY !== undefined ? level.gateY : 1;
      shadowRobot.grid[gateY][gateX] = 0;
    }
  };
  
  globalThis.hero = {
    move_forward: () => globalThis.moveForward(),
    collect_rupee: () => globalThis.collectRupee(),
    turn_left: () => globalThis.turnLeft(),
    turn_right: () => globalThis.turnRight(),
    scan_ahead: () => globalThis.scanAhead(),
    unlock_gate: (code) => globalThis.unlockGate(code)
  };
  
  globalThis.SwappablePlugboard = class SwappablePlugboard {
    constructor() {
      this.swaps = {};
    }
    swap(c1, c2) {
      this.swaps[c1] = c2;
      this.swaps[c2] = c1;
    }
  };
  globalThis.EnigmaM3RotorI = class EnigmaM3RotorI {
    constructor(pos, ring) {
      this.pos = pos;
      this.ring = ring;
    }
  };
  globalThis.EnigmaM3RotorII = class EnigmaM3RotorII {
    constructor(pos, ring) {
      this.pos = pos;
      this.ring = ring;
    }
  };
  globalThis.EnigmaM3RotorIII = class EnigmaM3RotorIII {
    constructor(pos, ring) {
      this.pos = pos;
      this.ring = ring;
    }
  };
  globalThis.ReflectorUKWB = class ReflectorUKWB {};
  globalThis.EtwPassthrough = class EtwPassthrough {};
  globalThis.EnigmaM3 = class EnigmaM3 {
    constructor(plugboard, rotor3, rotor2, rotor1, reflector, etw, auto) {
      this.plugboard = plugboard;
      this.rotor3 = rotor3;
      this.rotor2 = rotor2;
      this.rotor1 = rotor1;
      this.reflector = reflector;
      this.etw = etw;
      this.auto = auto;
    }
    input_string(text) {
      const pbOk = this.plugboard && this.plugboard.swaps &&
                   ((this.plugboard.swaps['a'] === 'z' && this.plugboard.swaps['z'] === 'a'));
      const r1Ok = this.rotor1 && this.rotor1.pos === 1 && this.rotor1.ring === 4;
      const r2Ok = this.rotor2 && this.rotor2.pos === 1 && this.rotor2.ring === 2;
      const r3Ok = this.rotor3 && this.rotor3.pos === 1 && this.rotor3.ring === 6;
      if (text === "codjzbcl" && pbOk && r1Ok && r2Ok && r3Ok) {
        return "triforza";
      }
      return "";
    }
  };
  
  try {
    const boundJsCode = jsCode + "\n; if (typeof on_start === 'function') { globalThis.on_start = on_start; }";
    eval(boundJsCode);
    
    // Check if on_start function is defined either locally or globally
    let startFn = null;
    if (typeof on_start === 'function') {
      startFn = on_start;
    } else if (typeof globalThis.on_start === 'function') {
      startFn = globalThis.on_start;
    }
    
    if (startFn) {
      isExecutingStart = true;
      startFn();
    } else {
      appendConsoleLine(t('consoleErrorNoStart'), "error");
    }
  } catch (err) {
    console.error("Evaluation error: ", err);
    actionQueue.push({ type: 'PRINT', message: `❌ Runtime error: ${err.message}` });
  } finally {
    isExecutingStart = false;
  }
  
  delete globalThis.moveForward;
  delete globalThis.turnLeft;
  delete globalThis.turnRight;
  delete globalThis.collectRupee;
  delete globalThis.scanAhead;
  delete globalThis.printConsole;
  delete globalThis.unlockGate;
  delete globalThis.hero;
  delete globalThis.on_start;
  delete globalThis.SwappablePlugboard;
  delete globalThis.EnigmaM3RotorI;
  delete globalThis.EnigmaM3RotorII;
  delete globalThis.EnigmaM3RotorIII;
  delete globalThis.ReflectorUKWB;
  delete globalThis.EtwPassthrough;
  delete globalThis.EnigmaM3;
  
  return actionQueue;
}

function translateTernaryInLine(line) {
  let ternaryIdx;
  while ((ternaryIdx = line.indexOf(' if ')) !== -1) {
    const spaceBeforeIf = ternaryIdx;
    
    let parenDepth = 0;
    let bracketDepth = 0;
    let leftIdx = spaceBeforeIf;
    
    // Scan left to find the start of the first expression (A)
    while (leftIdx > 0) {
      const char = line[leftIdx - 1];
      if (char === '(') {
        if (parenDepth === 0) break;
        parenDepth--;
      } else if (char === ')') {
        parenDepth++;
      } else if (char === '[') {
        if (bracketDepth === 0) break;
        bracketDepth--;
      } else if (char === ']') {
        bracketDepth++;
      } else if (parenDepth === 0 && bracketDepth === 0) {
        if (char === '=' || char === '+' || char === '-' || char === '*' || char === '/' || char === ',' || char === ';') {
          break;
        }
      }
      leftIdx--;
    }
    
    const A = line.substring(leftIdx, spaceBeforeIf).trim();
    
    // Find the end of condition (B)
    const condStart = spaceBeforeIf + 4; // ' if ' is 4 chars
    const elseIdx = line.indexOf(' else ', condStart);
    if (elseIdx === -1) {
      break; 
    }
    const B = line.substring(condStart, elseIdx).trim();
    
    // Find the end of the second expression (C)
    const startC = elseIdx + 6; // ' else ' is 6 chars
    parenDepth = 0;
    bracketDepth = 0;
    let rightIdx = startC;
    
    while (rightIdx < line.length) {
      const char = line[rightIdx];
      if (char === ')') {
        if (parenDepth === 0) break;
        parenDepth--;
      } else if (char === '(') {
        parenDepth++;
      } else if (char === ']') {
        if (bracketDepth === 0) break;
        bracketDepth--;
      } else if (char === '[') {
        bracketDepth++;
      } else if (parenDepth === 0 && bracketDepth === 0) {
        if (char === ',' || char === ';') {
          break;
        }
      }
      rightIdx++;
    }
    const C = line.substring(startC, rightIdx).trim();
    
    const jsTernary = `(${B} ? ${A} : ${C})`;
    line = line.substring(0, leftIdx) + jsTernary + line.substring(rightIdx);
  }
  return line;
}

// Simple Python-to-JavaScript Transpiler
function transpilePythonToJS(pyCode) {
  const lines = pyCode.split('\n');
  let jsCode = '';
  let indentStack = [0];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip empty lines
    if (line.trim() === '') {
      jsCode += '\n';
      continue;
    }
    
    // Measure indentation on the original line
    const match = line.match(/^(\s*)/);
    const currentIndent = match ? match[1].length : 0;
    
    // Extract strings to prevent transpiling keywords inside them
    const strings = [];
    let processedLine = line.replace(/(['"])(.*?)\1/g, (match) => {
      strings.push(match);
      return `__STR_${strings.length - 1}__`;
    });
    
    // Handle comments: replace '#' with '//' in the code portion
    let comment = '';
    const hashIdx = processedLine.indexOf('#');
    if (hashIdx !== -1) {
      comment = '//' + processedLine.substring(hashIdx + 1);
      processedLine = processedLine.substring(0, hashIdx);
    }
    
    let content = processedLine.trim();
    
    // If indentation decreased, close braces
    while (indentStack[indentStack.length - 1] > currentIndent) {
      indentStack.pop();
      jsCode += ' '.repeat(indentStack[indentStack.length - 1]) + '}\n';
    }
    
    // If the line is empty (excluding comments), output just the comment or empty line
    if (content === '') {
      if (comment !== '') {
        jsCode += ' '.repeat(currentIndent) + comment + '\n';
      } else {
        jsCode += '\n';
      }
      continue;
    }
    
    // Skip import lines (but output as a comment to preserve line count & debuggability)
    if (content.startsWith('import ') || /^import\b/.test(content) || content.startsWith('from ') || /^from\b/.test(content)) {
      jsCode += ' '.repeat(currentIndent) + '// ' + content + (comment ? ' ' + comment : '') + '\n';
      continue;
    }
    
    // Skip 'global' declaration lines (but output as a comment to preserve line count & debuggability)
    if (content.startsWith('global ') || /^global\b/.test(content)) {
      jsCode += ' '.repeat(currentIndent) + '// ' + content + (comment ? ' ' + comment : '') + '\n';
      continue;
    }
    
    let isBlockHeader = false;
    
    // Translate Python syntax to JS syntax
    if (content.startsWith('def ')) {
      content = content.replace(/def\s+(\w+)\s*\((.*)\)\s*:/, 'function $1($2) {');
      isBlockHeader = true;
    } else if (content.startsWith('for ') && content.includes('in range(')) {
      if (content.includes(',')) {
        // e.g., for i in range(1, limit): -> for (let i = $2; i < $3; i++) {
        content = content.replace(/for\s+(\w+)\s+in\s+range\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*:/, 'for (let $1 = $2; $1 < $3; $1++) {');
      } else {
        // e.g., for i in range(limit): -> for (let i = 0; i < limit; i++) {
        content = content.replace(/for\s+(\w+)\s+in\s+range\s*\(\s*([^)]+)\s*\)\s*:/, 'for (let $1 = 0; $1 < $2; $1++) {');
      }
      isBlockHeader = true;
    } else if (content.startsWith('if ')) {
      content = content.replace(/if\s+(.+)\s*:/, 'if ($1) {');
      content = content.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\s*/g, '!');
      isBlockHeader = true;
    } else if (content.startsWith('elif ')) {
      content = content.replace(/elif\s+(.+)\s*:/, 'else if ($1) {');
      content = content.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\s*/g, '!');
      isBlockHeader = true;
    } else if (content.startsWith('else:')) {
      content = 'else {';
      isBlockHeader = true;
    } else if (content.startsWith('while ')) {
      content = content.replace(/while\s+(.+)\s*:/, 'while ($1) {');
      content = content.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\s*/g, '!');
      isBlockHeader = true;
    }
    
    // Translate other general boolean & null keywords globally in the line
    content = content.replace(/\band\b/g, '&&')
                     .replace(/\bor\b/g, '||')
                     .replace(/\bnot\s*/g, '!')
                     .replace(/\bTrue\b/g, 'true')
                     .replace(/\bFalse\b/g, 'false')
                     .replace(/\bNone\b/g, 'null')
                     .replace(/\bpass\b/g, '');
    
    // Translate custom commands
    content = content.replace(/hero\.move_forward\(\)/g, 'moveForward()');
    content = content.replace(/hero\.collect_rupee\(\)/g, 'collectRupee()');
    content = content.replace(/hero\.turn_left\(\)/g, 'turnLeft()');
    content = content.replace(/hero\.turn_right\(\)/g, 'turnRight()');
    content = content.replace(/hero\.scan_ahead\(\)/g, 'scanAhead()');
    content = content.replace(/hero\.unlock_gate\(\s*([^)]+)\s*\)/g, 'unlockGate($1)');
    
    // Translate print() to printConsole()
    content = content.replace(/print\s*\((.*)\)/g, 'printConsole($1)');
    
    // Translate isinstance(var, type) to typeof or Array checks
    content = content.replace(/isinstance\s*\(\s*([^,]+)\s*,\s*(\w+)\s*\)/g, (match, varName, typeName) => {
      if (['Number', 'int', 'float'].includes(typeName)) {
        return `(typeof ${varName} === 'number')`;
      }
      if (['str'].includes(typeName)) {
        return `(typeof ${varName} === 'string')`;
      }
      if (['bool'].includes(typeName)) {
        return `(typeof ${varName} === 'boolean')`;
      }
      if (['list'].includes(typeName)) {
        return `Array.isArray(${varName})`;
      }
      return `(${varName} instanceof ${typeName})`;
    });
    
    // Translate Python ternary operator (expr1 if cond else expr2) to JS ternary (cond ? expr1 : expr2)
    content = translateTernaryInLine(content);
    
    // Append semicolons to expression lines (non-headers)
    if (!isBlockHeader && !content.endsWith(';') && !content.endsWith('}')) {
      if (content.trim() !== '') {
        content += ';';
      }
    }
    
    // Restore string literals
    content = content.replace(/__STR_(\d+)__/g, (match, id) => {
      return strings[parseInt(id)];
    });
    
    // If indentation increased, push to stack
    if (isBlockHeader) {
      let nextIndent = currentIndent + 4;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() !== '') {
          const nextMatch = lines[j].match(/^(\s*)/);
          nextIndent = nextMatch ? nextMatch[1].length : currentIndent + 4;
          break;
        }
      }
      if (nextIndent > currentIndent) {
        indentStack.push(nextIndent);
      }
    }
    
    jsCode += ' '.repeat(currentIndent) + content + (comment ? ' ' + comment : '') + '\n';
  }
  
  // Close any remaining open braces
  while (indentStack.length > 1) {
    indentStack.pop();
    jsCode += ' '.repeat(indentStack[indentStack.length - 1]) + '}\n';
  }
  
  return jsCode;
}
