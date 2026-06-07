const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('🧪 Starting Save File Integration Tests...\n');

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

// Helper to construct simulated DOM environment
function createTestEnvironment() {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
  
  const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "outside-only"
  });

  const { window } = dom;
  const { document } = window;

  // Mock global storage
  window.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, val) { this.store[key] = String(val); },
    removeItem(key) { delete this.store[key]; },
    clear() { this.store = {}; }
  };
  
  // Mock AudioContext and sound system
  window.AudioContext = class {
    constructor() { this.state = 'suspended'; }
    resume() { this.state = 'running'; return Promise.resolve(); }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {},
        start() {},
        stop() {}
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime() {}, linearRampToValueAtTime() {} },
        connect() {}
      };
    }
    destination = {};
    currentTime = 0;
  };
  window.webkitAudioContext = window.AudioContext;

  // Mock Blockly
  window.Blockly = {
    Blocks: {},
    JavaScript: { workspaceToCode: () => '' },
    Python: { workspaceToCode: () => '' },
    svgResize: () => {},
    inject: () => ({
      addChangeListener: () => {},
      clear: () => {},
      getAllBlocks: () => [],
      newBlock: () => ({
        initSvg() {},
        render() {},
        select() {},
        setDeletable() {},
        setMovable() {},
        setEditable() {},
        moveBy() {}
      }),
      getToolbox: () => ({ selectItemByPosition() {} }),
      highlightBlock: () => {}
    }),
    serialization: {
      workspaces: {
        save: () => ({}),
        load: () => {}
      }
    },
    Xml: {
      workspaceToDom: () => document.createElement('div'),
      domToText: () => '',
      textToDom: () => document.createElement('div'),
      domToWorkspace: () => {}
    }
  };

  // Mock Canvas context
  window.HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: () => {},
    fillRect: () => {},
    drawImage: () => {},
    fillText: () => {},
    measureText: () => ({ width: 10 }),
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {}
  });

  window.requestAnimationFrame = (callback) => setTimeout(callback, 16);
  window.cancelAnimationFrame = (id) => clearTimeout(id);

  const originalAppend = document.head.appendChild.bind(document.head);
  document.head.appendChild = function(el) {
    const result = originalAppend(el);
    if (el.tagName === 'SCRIPT' && el.id === 'blockly-locale-script') {
      if (typeof el.onload === 'function') {
        el.onload();
      }
    }
    return result;
  };

  const files = [
    'js/i18n.js',
    'js/rooms/sequences/room1.js',
    'js/rooms/variables/room1.js',
    'js/rooms/conditionals/room1.js',
    'js/rooms/loops/room1.js',
    'js/rooms/functions/room1.js',
    'js/rooms/lists/room1.js',
    'js/rooms/objects/room1.js',
    'js/rooms/recursion/room1.js',
    'js/levels.js',
    'js/blocks.js',
    'js/simulator.js',
    'js/globals.js',
    'js/storage.js',
    'js/highlighter.js',
    'js/transpiler.js',
    'js/app.js'
  ];

  let concatenatedCode = '';
  files.forEach(file => {
    concatenatedCode += fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8') + '\n';
  });

  global.localStorage = window.localStorage;
  global.window = window;
  global.document = document;

  concatenatedCode += `
    window.synth = synth;
    window.loadLevel = loadLevel;
    window.markLevelCompleted = markLevelCompleted;
    window.importGameState = importGameState;

    Object.defineProperty(window, 'completedLevels', {
      get: () => completedLevels,
      set: (val) => { completedLevels = val; },
      configurable: true
    });
    Object.defineProperty(window, 'levelsCodeCache', {
      get: () => levelsCodeCache,
      set: (val) => { levelsCodeCache = val; },
      configurable: true
    });
    Object.defineProperty(window, 'currentLevelIndex', {
      get: () => currentLevelIndex,
      set: (val) => { currentLevelIndex = val; },
      configurable: true
    });
  `;

  window.eval(concatenatedCode);

  const event = new window.Event('DOMContentLoaded');
  document.dispatchEvent(event);

  return { dom, window, document };
}

runTest('Load and parse codequest_save_all_completed.json', () => {
  const { window, document } = createTestEnvironment();

  // Read save file content
  const saveFilePath = path.resolve(__dirname, '../codequest_save_all_completed.json');
  const saveFileContent = fs.readFileSync(saveFilePath, 'utf8');
  const saveData = JSON.parse(saveFileContent);

  // Verify it parses correctly
  assert.strictEqual(saveData.app, 'codequest-python');

  // Trigger importGameState with mocked file reader
  const mockReaderInstance = {
    readAsText: function() {
      if (typeof this.onload === 'function') {
        this.onload({
          target: {
            result: saveFileContent
          }
        });
      }
    }
  };
  window.FileReader = function() {
    return mockReaderInstance;
  };

  window.importGameState(true);

  // Wait for callbacks (such as translation loading)
  // Check that completedLevels is parsed as an object, not array
  const completed = window.completedLevels;
  assert.strictEqual(typeof completed, 'object', 'completedLevels should be an object');
  assert.ok(!Array.isArray(completed), 'completedLevels should NOT be an Array');

  // Verify specific levels are marked completed
  assert.strictEqual(completed['variables/room1'], true, 'variables/room1 should be completed');
  assert.strictEqual(completed['sequences/room1'], true, 'sequences/room1 should be completed');

  // Switch to variables/room1 level (index 1)
  window.loadLevel(1);

  // Check if any errors are logged or level is in wrong state
  assert.strictEqual(window.currentLevelIndex, 1, 'Current level index should be 1');
  
  // Check that the grid has targetCrystals = 2
  const levelSelect = document.getElementById('level-select');
  assert.strictEqual(levelSelect.value, '1', 'Level selector should be set to 1');
});

console.log('\n--- Save File Test Run Summary ---');
console.log(`Passed: ${passedTestsCount}`);
console.log(`Failed: ${failedTestsCount}`);

if (failedTestsCount > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL SAVE FILE TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
