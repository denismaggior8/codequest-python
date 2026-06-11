const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('🧪 Starting DOM User Interaction Unit Tests...\n');

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

  // Mock animation frames
  window.requestAnimationFrame = (callback) => setTimeout(callback, 16);
  window.cancelAnimationFrame = (id) => clearTimeout(id);

  // Intercept locale scripts to resolve instantly without network activity
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

  // Load and execute local scripts sequentially
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

  // Expose window context and storage globals in Node for evaluated scripts
  global.localStorage = window.localStorage;
  global.window = window;
  global.document = document;

  // Append exports to window so they are globally testable
  concatenatedCode += `
    window.synth = synth;
    window.loadLevel = loadLevel;
    window.markLevelCompleted = markLevelCompleted;
    window.LEVELS = LEVELS;
    window.validateLevelConstructs = validateLevelConstructs;

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
    Object.defineProperty(window, 'currentMode', {
      get: () => currentMode,
      set: (val) => { currentMode = val; },
      configurable: true
    });
    Object.defineProperty(window, 'isExpertMode', {
      get: () => isExpertMode,
      set: (val) => { isExpertMode = val; },
      configurable: true
    });
  `;

  window.eval(concatenatedCode);

  // Manually dispatch DOMContentLoaded to trigger application setup
  const event = new window.Event('DOMContentLoaded');
  document.dispatchEvent(event);

  return { dom, window, document };
}

// 1. Initial State verification
runTest('Initial DOM Initialization & Defaults', () => {
  const { document, window } = createTestEnvironment();
  
  const presetSelect = document.getElementById('preset-select');
  assert.strictEqual(presetSelect.value, 'all', 'Default preset should be "all"');
  
  const levelSelect = document.getElementById('level-select');
  assert(levelSelect.options.length > 0, 'Level dropdown should have rooms loaded');
  assert.strictEqual(window.currentLevelIndex, 0, 'Initial level index should be 0');
});

// 2. Preset Filter updates levels list & hearts count
runTest('Preset Filter Updates Levels List & Hearts Count', () => {
  const { document, window } = createTestEnvironment();
  
  const presetSelect = document.getElementById('preset-select');
  const levelSelect = document.getElementById('level-select');
  const heartsDisplay = document.getElementById('hearts-display');

  // Change preset to "base"
  presetSelect.value = 'base';
  presetSelect.dispatchEvent(new window.Event('change'));
  
  // Base preset should contain 5 rooms (Sequences, Variables, Conditionals, Loops, Functions)
  const optionsCountBase = Array.from(levelSelect.querySelectorAll('option')).length;
  assert.strictEqual(optionsCountBase, 5, 'Base preset should show exactly 5 levels');
  assert.strictEqual(Array.from(heartsDisplay.textContent).length, 5, 'Hearts display should show 5 hearts in base preset');

  // Change preset to "intermediate" (Lists, Objects)
  presetSelect.value = 'intermediate';
  presetSelect.dispatchEvent(new window.Event('change'));
  
  const optionsCountInt = Array.from(levelSelect.querySelectorAll('option')).length;
  assert.strictEqual(optionsCountInt, 2, 'Intermediate preset should show exactly 2 levels');
  assert.strictEqual(Array.from(heartsDisplay.textContent).length, 2, 'Hearts display should show 2 hearts in intermediate preset');

  // Change preset to "advanced" (Recursion)
  presetSelect.value = 'advanced';
  presetSelect.dispatchEvent(new window.Event('change'));
  
  const optionsCountAdv = Array.from(levelSelect.querySelectorAll('option')).length;
  assert.strictEqual(optionsCountAdv, 1, 'Advanced preset should show exactly 1 level');
  assert.strictEqual(Array.from(heartsDisplay.textContent).length, 1, 'Hearts display should show 1 heart in advanced preset');
});

// 3. Preset change selection bounds correction
runTest('Preset Change Out-Of-Bounds Auto-Correction', () => {
  const { document, window } = createTestEnvironment();
  
  const presetSelect = document.getElementById('preset-select');
  const levelSelect = document.getElementById('level-select');

  // Navigate to Recursion (index 7) under "all"
  window.loadLevel(7);
  assert.strictEqual(window.currentLevelIndex, 7, 'Should load level 7');

  // Switch preset to "base"
  presetSelect.value = 'base';
  presetSelect.dispatchEvent(new window.Event('change'));
  
  // Current level index 7 is not in "base" preset (only indices 0-4 are).
  // It should auto-correct to the first level in base preset (index 0).
  assert.strictEqual(window.currentLevelIndex, 0, 'Preset switch should auto-correct invalid level index to 0');
  assert.strictEqual(levelSelect.value, '0', 'Level select value should be set to 0');
});

// 4. Language Selector Translations
runTest('Language Toggling Translations Update', () => {
  const { document, window } = createTestEnvironment();
  
  const langSelect = document.getElementById('lang-select');
  const baseOption = document.querySelector('#preset-select option[value="base"]');

  // Initial Italian
  assert.strictEqual(baseOption.textContent, 'Livello Base', 'Initial preset label should be Italian');

  // Switch to English
  langSelect.value = 'en';
  langSelect.dispatchEvent(new window.Event('change'));
  
  // SetTimeout mock callback triggers onload asynchronously, wait for updates
  setTimeout(() => {
    assert.strictEqual(baseOption.textContent, 'Basic Level', 'English preset label should be active');
    
    // Switch back to Italian
    langSelect.value = 'it';
    langSelect.dispatchEvent(new window.Event('change'));
    
    setTimeout(() => {
      assert.strictEqual(baseOption.textContent, 'Livello Base', 'Should toggle back to Italian');
    }, 10);
  }, 10);
});

// 5. Hearts Completion State & UI Badge Update
runTest('Hearts Completion State updates on Level Solve', () => {
  const { document, window } = createTestEnvironment();
  
  const heartsDisplay = document.getElementById('hearts-display');
  
  // Set preset to base
  const presetSelect = document.getElementById('preset-select');
  presetSelect.value = 'base';
  presetSelect.dispatchEvent(new window.Event('change'));
  
  assert.strictEqual(heartsDisplay.textContent, '🖤🖤🖤🖤🖤', 'All hearts should start uncompleted (black)');

  // Solve the first level (sequences/room1)
  window.markLevelCompleted('sequences/room1');

  // Verify that the first heart is now completed (red)
  assert.strictEqual(heartsDisplay.textContent, '❤️🖤🖤🖤🖤', 'First heart should turn red on completion');
  
  // Check that the dropdown option has a key badge
  const levelSelect = document.getElementById('level-select');
  const option = levelSelect.querySelector('option[value="0"]');
  assert(option.textContent.includes('🗝️'), 'Dropdown item should display completed key emoji');
});

// 6. Navigation Traversals Restricted to Preset
runTest('Next/Prev Navigation Bounds within Active Preset', () => {
  const { document, window } = createTestEnvironment();

  const presetSelect = document.getElementById('preset-select');
  presetSelect.value = 'intermediate'; // Indices [5, 6]
  presetSelect.dispatchEvent(new window.Event('change'));

  // Load first intermediate room (Lists - index 5)
  window.loadLevel(5);
  assert.strictEqual(window.currentLevelIndex, 5, 'Active level index should be 5');

  // Try Prev Button
  const prevBtn = document.getElementById('prev-level-btn');
  prevBtn.dispatchEvent(new window.Event('click'));
  assert.strictEqual(window.currentLevelIndex, 5, 'Should not go back past first level of preset');

  // Try Next Button
  const nextBtn = document.getElementById('next-level-btn');
  nextBtn.dispatchEvent(new window.Event('click'));
  assert.strictEqual(window.currentLevelIndex, 6, 'Should navigate to next level of preset (index 6)');

  // Try Next Button again
  nextBtn.dispatchEvent(new window.Event('click'));
  assert.strictEqual(window.currentLevelIndex, 6, 'Should not go past last level of preset');
});

// 7. Sound Button persistence
runTest('Sound Button Toggles Sound Mode and Persists to LocalStorage', () => {
  const { document, window } = createTestEnvironment();

  const soundBtn = document.getElementById('sound-btn');
  
  // Initially active
  assert.strictEqual(window.synth.enabled, true, 'Sound should default to enabled');
  assert.strictEqual(window.localStorage.getItem('codequest_sound'), null, 'Initial localStorage should be empty');

  // Toggle Off
  soundBtn.dispatchEvent(new window.Event('click'));
  assert.strictEqual(window.synth.enabled, false, 'Sound should disable');
  assert.strictEqual(window.localStorage.getItem('codequest_sound'), 'false', 'LocalStorage state should be "false"');

  // Toggle On
  soundBtn.dispatchEvent(new window.Event('click'));
  assert.strictEqual(window.synth.enabled, true, 'Sound should enable back');
  assert.strictEqual(window.localStorage.getItem('codequest_sound'), 'true', 'LocalStorage state should be "true"');
});

// 8. Game state import/export containing preset
runTest('GameState Import/Export Preserves Active Preset', () => {
  const { document, window } = createTestEnvironment();

  // Mock document.createElement / appendChild for file downloads
  let clickTriggered = false;
  let downloadedBlobContent = null;
  const originalCreate = document.createElement.bind(document);
  document.createElement = (tag) => {
    const el = originalCreate(tag);
    if (tag === 'a') {
      el.click = () => { clickTriggered = true; };
    }
    return el;
  };
  const originalCreateBlob = window.Blob;
  window.Blob = class {
    constructor(content, options) {
      downloadedBlobContent = content[0];
      this.content = content;
      this.options = options;
    }
  };
  const originalRevoke = window.URL.revokeObjectURL;
  const originalCreateURL = window.URL.createObjectURL;
  window.URL.createObjectURL = () => 'blob:mock';
  window.URL.revokeObjectURL = () => {};

  // Set preset to "intermediate"
  const presetSelect = document.getElementById('preset-select');
  presetSelect.value = 'intermediate';
  presetSelect.dispatchEvent(new window.Event('change'));
  
  // Trigger export
  window.eval('exportGameState()');
  
  assert(clickTriggered, 'Export should trigger download click event');
  assert(downloadedBlobContent, 'Blob content should be captured');
  
  const parsedSave = JSON.parse(downloadedBlobContent);
  assert.strictEqual(parsedSave.settings.preset, 'intermediate', 'Save payload should store intermediate preset');

  // Clear environment for import test
  presetSelect.value = 'all';
  presetSelect.dispatchEvent(new window.Event('change'));
  assert.strictEqual(presetSelect.value, 'all', 'Preset reset to all');

  // Trigger import
  const mockFile = { name: 'save.json' };
  const mockReaderInstance = {
    readAsText: function() {
      // Simulate file reading completion
      if (typeof this.onload === 'function') {
        this.onload({
          target: {
            result: JSON.stringify(parsedSave)
          }
        });
      }
    }
  };
  window.FileReader = function() {
    return mockReaderInstance;
  };

  window.eval('importGameState(true)'); // passes truthy file to trigger load

  // Wait for translations/locale callbacks to resolve
  assert.strictEqual(presetSelect.value, 'intermediate', 'Import should restore intermediate preset on selector dropdown');
  assert.strictEqual(window.localStorage.getItem('codequest_preset'), 'intermediate', 'Import should save intermediate preset in localStorage');

  // Restore global constructors
  window.Blob = originalCreateBlob;
  window.URL.createObjectURL = originalCreateURL;
  window.URL.revokeObjectURL = originalRevoke;
  document.createElement = originalCreate;
});

// 9. Preset Complete Quest Victory Modal
runTest('Game Ends and Success Modal Updates when Preset is Fully Completed', () => {
  const { document, window } = createTestEnvironment();

  const presetSelect = document.getElementById('preset-select');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const headerEl = document.querySelector('[data-i18n="modalCleared"]');
  const badgeEl = document.querySelector('[data-i18n="modalBadge"]');
  const successMsg = document.getElementById('success-message');

  // Switch to advanced preset (contains index 7)
  presetSelect.value = 'advanced';
  presetSelect.dispatchEvent(new window.Event('change'));

  // Mark all rooms in advanced preset completed (recursion/room1)
  window.markLevelCompleted('recursion/room1');

  // Trigger success modal show
  window.eval('showSuccessModal()');

  // Assertions
  assert.strictEqual(headerEl.textContent, 'QUEST COMPLETATA!', 'Header should say Quest Completata');
  assert.strictEqual(badgeEl.textContent, '🏆 PRESET COMPLETATO!', 'Badge should say Preset Completato');
  assert(successMsg.textContent.includes('congratulazioni') || successMsg.textContent.includes('Congratulazioni'), 'Message should show congratulations text');
  assert.strictEqual(modalNextBtn.style.display, 'none', 'Next button should be hidden when preset is completed');
});

// 10. Layout Resizers and Persistence
runTest('Layout Resizers exist and restore saved styles', () => {
  const { document, window } = createTestEnvironment();

  // Save custom layout widths in the environment's mock storage
  window.localStorage.setItem('codequest_layout_left', '35%');
  window.localStorage.setItem('codequest_layout_center', '40%');
  window.localStorage.setItem('codequest_layout_right', '25%');

  // Re-run initialization to apply the settings
  window.eval('initColumnResizers()');

  const leftResizer = document.getElementById('resizer-left');
  const rightResizer = document.getElementById('resizer-right');
  assert(leftResizer, 'Left resizer should exist in DOM');
  assert(rightResizer, 'Right resizer should exist in DOM');

  const leftPanel = document.querySelector('.left-panel');
  const centerPanel = document.querySelector('.center-panel');
  const rightPanel = document.querySelector('.right-panel');

  assert.strictEqual(leftPanel.style.width, '35%', 'Left panel width should be restored');
  assert.strictEqual(centerPanel.style.width, '40%', 'Center panel width should be restored');
  assert.strictEqual(rightPanel.style.width, '25%', 'Right panel width should be restored');
});

// 11. Legacy save data migration aligns naming schemes
runTest('Importing legacy save file migrates rupee and triforce/triforza terms', () => {
  const { document, window } = createTestEnvironment();

  // Create an old save with legacy name references
  const legacySave = {
    app: "codequest-python",
    version: 1,
    timestamp: Date.now(),
    completedLevels: {
      "1": true,
      "variables/room1": true
    },
    levelsCode: {
      "variables/room1": {
        mode: "blocks",
        pythonCode: "def on_start():\n  rupees = 0\n  hero.collect_rupee()\n  rupees = rupees + 1\n  print('triforza')\n",
        blocksState: {
          blocks: {
            languageVersion: 0,
            blocks: [
              {
                type: "collect_rupee",
                id: "cr1"
              }
            ]
          }
        }
      }
    },
    settings: {
      language: "en",
      currentLevelIndex: 1,
      preset: "all"
    }
  };

  // Mock FileReader to return legacySave
  const mockReaderInstance = {
    readAsText: function() {
      if (typeof this.onload === 'function') {
        this.onload({
          target: {
            result: JSON.stringify(legacySave)
          }
        });
      }
    }
  };
  window.FileReader = function() {
    return mockReaderInstance;
  };

  // Trigger import
  window.eval('importGameState(true)');

  // Verify that the level variables/room1 has been updated
  const migratedItem = window.levelsCodeCache['variables/room1'];
  assert(migratedItem, 'Level item should exist after import');
  
  // Python Code migration check
  assert.strictEqual(
    migratedItem.pythonCode,
    "def on_start():\n  rubies = 0\n  hero.collect_ruby()\n  rubies = rubies + 1\n  print('forza')\n",
    'Should migrate python code references from rupee/triforza to ruby/forza'
  );

  // Blockly state JSON object migration check
  assert.strictEqual(
    migratedItem.blocksState.blocks.blocks[0].type,
    "collect_ruby",
    'Blockly state blocks should be migrated to collect_ruby'
  );

  // Check numeric level ID migration was also called
  assert.strictEqual(window.completedLevels['sequences/room1'], true, 'Old numeric level IDs should also be migrated');
});

// 12. List Validation Level Constraints
runTest('validateLevelConstructs checks requireList constraints on lists/room1', () => {
  const { document, window } = createTestEnvironment();

  // Load level 5 (lists/room1)
  window.eval('loadLevel(5)');

  // Verify it is the lists level
  const level = window.eval('LEVELS[5]');
  assert.strictEqual(level.id, 'lists/room1');
  assert.strictEqual(level.requireList, true);

  // Set mock python code with loop but without list definition
  const textarea = document.getElementById('python-textarea');
  textarea.value = "def on_start():\n  for i in range(4):\n    hero.move_forward()\n";

  // Force python mode
  window.eval('currentMode = "python"');

  // Validate should return error requiring a list
  const err = window.eval('validateLevelConstructs(LEVELS[5])');
  assert(err && err.includes('lista'), 'Should return a validation error requiring lists');

  // Set mock python code with valid list definition
  textarea.value = "def on_start():\n  turns = [0, 1, 0, 1]\n  for count in turns:\n    hero.move_forward()\n";
  const noErr = window.eval('validateLevelConstructs(LEVELS[5])');
  assert.strictEqual(noErr, null, 'Should pass validation when list syntax [] is present');
});

// 13. Recursion Validation Level Constraints
runTest('validateLevelConstructs checks requireRecursion constraints on recursion/room1', () => {
  const { document, window } = createTestEnvironment();

  // Load level 7 (recursion/room1)
  window.eval('loadLevel(7)');

  // Verify it is the recursion level
  const level = window.eval('LEVELS[7]');
  assert.strictEqual(level.id, 'recursion/room1');
  assert.strictEqual(level.requireRecursion, true);

  // Set mock python code without recursion (has if, but not recursion)
  const textarea = document.getElementById('python-textarea');
  textarea.value = "def solve():\n  if True:\n    hero.move_forward()\n\ndef on_start():\n  solve()\n";

  // Force python mode
  window.eval('currentMode = "python"');

  // Validate should return error requiring recursion
  const err = window.eval('validateLevelConstructs(LEVELS[7])');
  assert(err && err.includes('ricorsiv'), 'Should return a validation error requiring recursion');

  // Set mock python code with valid recursion call (including if to satisfy requireConditional)
  textarea.value = "def solve():\n  if True:\n    solve()\n\ndef on_start():\n  solve()\n";
  const noErr = window.eval('validateLevelConstructs(LEVELS[7])');
  assert.strictEqual(noErr, null, 'Should pass validation when recursion is present');
});

// 14. Custom Reset Confirmation Modal Behavior
runTest('Custom Reset Confirmation Modal Behavior', () => {
  const { document, window } = createTestEnvironment();

  const resetBtn = document.getElementById('reset-progress-btn');
  const resetModal = document.getElementById('reset-modal');
  const resetCancelBtn = document.getElementById('reset-cancel-btn');
  const resetConfirmBtn = document.getElementById('reset-confirm-btn');

  assert(resetBtn, 'Reset progress button should exist');
  assert(resetModal, 'Reset modal should exist');
  assert(resetCancelBtn, 'Reset cancel button should exist');
  assert(resetConfirmBtn, 'Reset confirm button should exist');

  // Verify modal starts hidden
  assert(resetModal.classList.contains('hidden'), 'Reset modal should be hidden by default');

  // Trigger click on reset progress button
  resetBtn.dispatchEvent(new window.Event('click'));

  // Modal should be visible
  assert(!resetModal.classList.contains('hidden'), 'Reset modal should be visible after clicking reset button');

  // Set mock progress in localStorage
  window.localStorage.setItem('codequest_completed', JSON.stringify({ 'sequences/room1': true }));
  window.completedLevels = { 'sequences/room1': true };

  // Trigger cancel
  resetCancelBtn.dispatchEvent(new window.Event('click'));

  // Modal should be hidden again, progress should NOT be reset
  assert(resetModal.classList.contains('hidden'), 'Reset modal should be hidden after cancel');
  assert.strictEqual(window.localStorage.getItem('codequest_completed'), JSON.stringify({ 'sequences/room1': true }), 'Progress should not be deleted on cancel');

  // Open modal again
  resetBtn.dispatchEvent(new window.Event('click'));
  assert(!resetModal.classList.contains('hidden'), 'Reset modal should be visible again');

  // Trigger confirm
  resetConfirmBtn.dispatchEvent(new window.Event('click'));

  // Modal should be hidden, storage should be cleared
  assert(resetModal.classList.contains('hidden'), 'Reset modal should be hidden after confirm');
  assert.strictEqual(window.localStorage.getItem('codequest_completed'), null, 'Progress completed levels should be removed');
  assert.strictEqual(window.currentLevelIndex, 0, 'Current level index should be reset to 0');
  
  // Splash screen overlay should be displayed
  const splash = document.getElementById('splash-screen');
  assert.strictEqual(splash.style.display, 'flex', 'Splash screen overlay should be visible again after confirm');
});

console.log('\n--- DOM Test Run Summary ---');
console.log(`Passed: ${passedTestsCount}`);
console.log(`Failed: ${failedTestsCount}`);

if (failedTestsCount > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL DOM TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
