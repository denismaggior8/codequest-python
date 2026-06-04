const fs = require('fs');
const path = require('path');

// Read highlightPython from js/app.js
const appJsPath = path.join(__dirname, '../js/highlighter.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Extract highlightPython function
const highlightPythonMatch = appJsContent.match(/function highlightPython[\s\S]*?\n\}/);
if (!highlightPythonMatch) {
  console.error("Could not find highlightPython in js/app.js");
  process.exit(1);
}

const highlightPythonStr = highlightPythonMatch[0];

// Create an evaluation context
const context = {};
const t = (key) => {
  if (key === 'dragSpells') return '# Trascina i blocchi per generare codice Python!';
  return key;
};
const currentMode = 'blocks';

// Evaluate it
const runHighlight = new Function('code', 't', 'currentMode', `
  ${highlightPythonStr}
  return highlightPython(code);
`);

const testCode = `def step_and_collect():
  # Descrivi questa funzione
  pass

step_and_collect()`;

console.log("=== TEST 1 ===");
console.log(runHighlight(testCode, t, currentMode));

const testCode2 = `def step_and_collect():
  # TODO: Describe this function
  pass`;
console.log("=== TEST 2 ===");
console.log(runHighlight(testCode2, t, currentMode));

const testCode3 = `def step_and_collect():
  """Descrivi questa funzione
  """
  pass`;
console.log("=== TEST 3 ===");
console.log(runHighlight(testCode3, t, currentMode));

const testCode4 = `def step_and_collect():
  hero.move_forward()
  hero.move_forward()
  hero.collect_rupee()

def on_start():
  step_and_collect()
  hero.turn_left()
  step_and_collect()
  hero.turn_right()
  step_and_collect()
  hero.turn_left()
  step_and_collect()
  hero.turn_right()
  hero.move_forward()
  hero.move_forward()`;
console.log("=== TEST 4 ===");
console.log(runHighlight(testCode4, t, currentMode));

const testCode5 = `"""
This is a comment about hero.move_forward in a function.
"""`;
console.log("=== TEST 5 ===");
console.log(runHighlight(testCode5, t, currentMode));




