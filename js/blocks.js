// The Legend of Python - Custom Blockly Blocks & Generators (i18n Zelda Theme)

// Translations for tooltips
const BLOCK_TOOLTIPS = {
  it: {
    move_forward: "Fai muovere Link di una casella in avanti nella direzione in cui è rivolto.",
    collect_rupee: "Raccoglie la rupia sulla casella corrente.",
    turn_left: "Gira Link di 90 gradi in senso antiorario.",
    turn_right: "Gira Link di 90 gradi in senso orario.",
    scan_ahead: "Controlla cosa c'è nella casella davanti a Link. Restituisce 'obstacle' (ostacolo), 'crystal' (rupia), 'portal' (Triforza) o 'empty' (vuoto)."
  },
  en: {
    move_forward: "Make Link move one step forward in the direction he is facing.",
    collect_rupee: "Collects the green/blue rupee treasure on the current tile.",
    turn_left: "Turns Link 90 degrees counter-clockwise.",
    turn_right: "Turns Link 90 degrees clockwise.",
    scan_ahead: "Scans the dungeon tile directly in front of Link. Returns 'obstacle', 'crystal', 'portal', or 'empty'."
  }
};

// Helper to safely get the current active language tooltips
function getTooltipText(key) {
  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'it';
  return BLOCK_TOOLTIPS[lang][key] || BLOCK_TOOLTIPS['it'][key];
}

// 1. Block Definitions
Blockly.Blocks['move_forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("hero.move_forward()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120); // Green
    this.setTooltip(() => getTooltipText('move_forward'));
    this.setHelpUrl("");
  }
};

Blockly.Blocks['collect_rupee'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("hero.collect_rupee()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290); // Purple
    this.setTooltip(() => getTooltipText('collect_rupee'));
    this.setHelpUrl("");
  }
};

Blockly.Blocks['turn_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("hero.turn_left()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220); // Blue
    this.setTooltip(() => getTooltipText('turn_left'));
    this.setHelpUrl("");
  }
};

Blockly.Blocks['turn_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("hero.turn_right()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220); // Blue
    this.setTooltip(() => getTooltipText('turn_right'));
    this.setHelpUrl("");
  }
};

Blockly.Blocks['scan_ahead'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("hero.scan_ahead()");
    this.setOutput(true, "String");
    this.setColour(45); // Orange/Yellow
    this.setTooltip(() => getTooltipText('scan_ahead'));
    this.setHelpUrl("");
  }
};

// 2. Safe Generator Registration Helpers
function registerJS(blockType, func) {
  // Support both classic Blockly.JavaScript and modern javascript.javascriptGenerator namespaces
  const gen = Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  if (gen) {
    gen[blockType] = func;
    if (gen.forBlock) {
      gen.forBlock[blockType] = func;
    }
  } else {
    // If not loaded yet, queue it
    setTimeout(() => registerJS(blockType, func), 100);
  }
}

function registerPy(blockType, func) {
  // Support both classic Blockly.Python and modern python.pythonGenerator namespaces
  const gen = Blockly.Python || (window.python && window.python.pythonGenerator);
  if (gen) {
    gen[blockType] = func;
    if (gen.forBlock) {
      gen.forBlock[blockType] = func;
    }
  } else {
    // If not loaded yet, queue it
    setTimeout(() => registerPy(blockType, func), 100);
  }
}

// 3. Register Generators
registerJS('move_forward', function(block) {
  return 'moveForward();\n';
});
registerPy('move_forward', function(block) {
  return 'hero.move_forward()\n';
});

registerJS('collect_rupee', function(block) {
  return 'collectRupee();\n';
});
registerPy('collect_rupee', function(block) {
  return 'hero.collect_rupee()\n';
});

registerJS('turn_left', function(block) {
  return 'turnLeft();\n';
});
registerPy('turn_left', function(block) {
  return 'hero.turn_left()\n';
});

registerJS('turn_right', function(block) {
  return 'turnRight();\n';
});
registerPy('turn_right', function(block) {
  return 'hero.turn_right()\n';
});

registerJS('scan_ahead', function(block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const order = gen ? (gen.ORDER_FUNCTION_CALL || 0) : 0;
  return ['scanAhead()', order];
});
registerPy('scan_ahead', function(block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  const order = gen ? (gen.ORDER_FUNCTION_CALL || 0) : 0;
  return ['hero.scan_ahead()', order];
});

registerJS('text_print', function(block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const msg = gen ? (gen.valueToCode(block, 'TEXT', order) || "''") : "''";
  return 'printConsole(' + msg + ');\n';
});
registerPy('text_print', function(block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const msg = gen ? (gen.valueToCode(block, 'TEXT', order) || "''") : "''";
  return 'print(' + msg + ')\n';
});
