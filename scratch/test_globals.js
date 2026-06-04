const fs = require('fs');
const vm = require('vm');

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

const dummyEl = {
  addEventListener: () => {},
  value: '',
  setAttribute: () => {},
  getAttribute: () => '',
  appendChild: () => {},
  remove: () => {},
  classList: {
    contains: () => false,
    add: () => {},
    remove: () => {},
    toggle: () => {}
  }
};

const context = vm.createContext({
  console: console,
  setTimeout: setTimeout,
  document: {
    addEventListener: () => {},
    getElementById: () => dummyEl,
    querySelectorAll: () => [],
    createElement: () => dummyEl,
    head: {
      appendChild: () => {}
    }
  },
  window: {},
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  Blockly: {
    Blocks: {},
    JavaScript: {},
    Python: {}
  },
  globalThis: {}
});

let concatenatedCode = '';
files.forEach(f => {
  concatenatedCode += fs.readFileSync(f, 'utf8') + '\n';
});

try {
  vm.runInContext(concatenatedCode, context);
  console.log("Successfully ran all concatenated files.");
} catch (err) {
  console.error("Error running concatenated files:", err);
}

console.log("\nContext state after load:");
console.log("LEVELS defined:", vm.runInContext("typeof LEVELS !== 'undefined'", context));
console.log("LEVELS length:", vm.runInContext("typeof LEVELS !== 'undefined' ? LEVELS.length : 'undefined'", context));
console.log("completedLevels:", vm.runInContext("typeof completedLevels !== 'undefined' ? completedLevels : 'undefined'", context));
