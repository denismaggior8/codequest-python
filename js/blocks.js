// Code quest - Custom Blockly Blocks & Generators (i18n Zelda Theme)

// Translations for tooltips
const BLOCK_TOOLTIPS = {
  it: {
    move_forward: "Fai muovere Knil di una casella in avanti nella direzione in cui è rivolto.",
    collect_ruby: "Raccoglie il rubino sulla casella corrente.",
    turn_left: "Gira Knil di 90 gradi in senso antiorario.",
    turn_right: "Gira Knil di 90 gradi in senso orario.",
    scan_ahead: "Controlla cosa c'è nella casella davanti a Knil. Restituisce 'obstacle' (ostacolo), 'crystal' (rubino), 'portal' (Forza) o 'empty' (vuoto).",
    plugboard_passthrough: "Crea una Plugboard pass-through (senza scambi).",
    enigma_m3_rotor1: "Crea un Rotore di tipo I per Enigma M3.",
    enigma_m3_rotor2: "Crea un Rotore di tipo II per Enigma M3.",
    enigma_m3_rotor3: "Crea un Rotore di tipo III per Enigma M3.",
    reflector_ukwb: "Crea il riflettore di tipo UKWB per Enigma M3.",
    etw_passthrough: "Crea l'entry wheel pass-through.",
    enigma_m3: "Assembla la macchina Enigma M3 con i suoi componenti.",
    enigma_input_string: "Esegue la decifratura o cifratura di una stringa con la macchina Enigma.",
    hero_unlock_gate: "Usa la parola decifrata per sbloccare la porta di ferro."
  },
  en: {
    move_forward: "Make Knil move one step forward in the direction he is facing.",
    collect_ruby: "Collects the red ruby treasure on the current tile.",
    turn_left: "Turns Knil 90 degrees counter-clockwise.",
    turn_right: "Turns Knil 90 degrees clockwise.",
    scan_ahead: "Scans the dungeon tile directly in front of Knil. Returns 'obstacle', 'crystal', 'portal', or 'empty'.",
    plugboard_passthrough: "Creates a pass-through plugboard (no swaps).",
    enigma_m3_rotor1: "Creates a type I rotor for Enigma M3.",
    enigma_m3_rotor2: "Creates a type II rotor for Enigma M3.",
    enigma_m3_rotor3: "Creates a type III rotor for Enigma M3.",
    reflector_ukwb: "Creates a UKWB type reflector for Enigma M3.",
    etw_passthrough: "Creates a pass-through entry wheel.",
    enigma_m3: "Assembles the Enigma M3 machine with its components.",
    enigma_input_string: "Encrypts or decrypts a string using the Enigma machine.",
    hero_unlock_gate: "Use the decrypted word to unlock the iron gate."
  }
};

// Helper to safely get the current active language tooltips
function getTooltipText(key) {
  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'it';
  return BLOCK_TOOLTIPS[lang][key] || BLOCK_TOOLTIPS['it'][key];
}

// 1. Block Definitions
Blockly.Blocks['on_start'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("def on_start():");
    this.appendStatementInput("STACK")
      .setCheck(null);
    this.setColour(20);
    this.setTooltip(() => typeof currentLanguage !== 'undefined' && currentLanguage === 'en' ? "Define what to do when start is pressed." : "Definisci cosa fare quando premi avvia.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['move_forward'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("hero.move_forward()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120); // Green
    this.setTooltip(() => getTooltipText('move_forward'));
    this.setHelpUrl("");
  }
};

Blockly.Blocks['collect_ruby'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("hero.collect_ruby()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290); // Purple
    this.setTooltip(() => getTooltipText('collect_ruby'));
    this.setHelpUrl("");
  }
};

Blockly.Blocks['turn_left'] = {
  init: function () {
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
  init: function () {
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
  init: function () {
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
registerJS('move_forward', function (block) {
  return `moveForward("${block.id}");\n`;
});
registerPy('move_forward', function (block) {
  return `hero.move_forward(block_id="${block.id}")\n`;
});

registerJS('collect_ruby', function (block) {
  return `collectRuby("${block.id}");\n`;
});
registerPy('collect_ruby', function (block) {
  return `hero.collect_ruby(block_id="${block.id}")\n`;
});

registerJS('turn_left', function (block) {
  return `turnLeft("${block.id}");\n`;
});
registerPy('turn_left', function (block) {
  return `hero.turn_left(block_id="${block.id}")\n`;
});

registerJS('turn_right', function (block) {
  return `turnRight("${block.id}");\n`;
});
registerPy('turn_right', function (block) {
  return `hero.turn_right(block_id="${block.id}")\n`;
});

registerJS('scan_ahead', function (block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const order = gen ? (gen.ORDER_FUNCTION_CALL || 0) : 0;
  return [`scanAhead("${block.id}")`, order];
});
registerPy('scan_ahead', function (block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  const order = gen ? (gen.ORDER_FUNCTION_CALL || 0) : 0;
  return [`hero.scan_ahead(block_id="${block.id}")`, order];
});

registerJS('text_print', function (block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const msg = gen ? (gen.valueToCode(block, 'TEXT', order) || "''") : "''";
  return 'printConsole(' + msg + ', "' + block.id + '");\n';
});
registerPy('text_print', function (block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const msg = gen ? (gen.valueToCode(block, 'TEXT', order) || "''") : "''";
  return 'print(' + msg + ', block_id="' + block.id + '")\n';
});

registerJS('on_start', function (block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const statements = gen ? (gen.statementToCode(block, 'STACK') || '') : '';
  return 'function on_start() {\n' + statements + '}\n';
});

registerPy('on_start', function (block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  let statements = gen ? (gen.statementToCode(block, 'STACK') || '') : '';
  if (!statements.trim()) {
    statements = '  pass\n';
  }
  return 'def on_start():\n' + statements + '\n';
});

// 4. Enigma M3 Blocks Definition
Blockly.Blocks['swappable_plugboard'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("SwappablePlugboard(swap")
      .appendField(new Blockly.FieldTextInput("a"), "CHAR1")
      .appendField(",")
      .appendField(new Blockly.FieldTextInput("z"), "CHAR2")
      .appendField(")");
    this.setOutput(true, "Plugboard");
    this.setColour(200);
    this.setTooltip(() => getTooltipText('swappable_plugboard'));
  }
};

Blockly.Blocks['plugboard_swap'] = {
  init: function () {
    this.appendValueInput("PLUGBOARD").setCheck("Plugboard");
    this.appendDummyInput()
      .appendField(".swap(")
      .appendField(new Blockly.FieldTextInput("a"), "CHAR1")
      .appendField(",")
      .appendField(new Blockly.FieldTextInput("z"), "CHAR2")
      .appendField(")");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip(() => getTooltipText('plugboard_swap'));
  }
};

Blockly.Blocks['enigma_m3_rotor1'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("EnigmaM3RotorI(")
      .appendField(new Blockly.FieldNumber(1, 1, 26), "POS")
      .appendField(",")
      .appendField(new Blockly.FieldNumber(1, 1, 26), "RING")
      .appendField(")");
    this.setOutput(true, "Rotor");
    this.setColour(230);
    this.setTooltip(() => getTooltipText('enigma_m3_rotor1'));
  }
};

Blockly.Blocks['enigma_m3_rotor2'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("EnigmaM3RotorII(")
      .appendField(new Blockly.FieldNumber(1, 1, 26), "POS")
      .appendField(",")
      .appendField(new Blockly.FieldNumber(1, 1, 26), "RING")
      .appendField(")");
    this.setOutput(true, "Rotor");
    this.setColour(230);
    this.setTooltip(() => getTooltipText('enigma_m3_rotor2'));
  }
};

Blockly.Blocks['enigma_m3_rotor3'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("EnigmaM3RotorIII(")
      .appendField(new Blockly.FieldNumber(1, 1, 26), "POS")
      .appendField(",")
      .appendField(new Blockly.FieldNumber(1, 1, 26), "RING")
      .appendField(")");
    this.setOutput(true, "Rotor");
    this.setColour(230);
    this.setTooltip(() => getTooltipText('enigma_m3_rotor3'));
  }
};

Blockly.Blocks['reflector_ukwb'] = {
  init: function () {
    this.appendDummyInput().appendField("ReflectorUKWB()");
    this.setOutput(true, "Reflector");
    this.setColour(250);
    this.setTooltip(() => getTooltipText('reflector_ukwb'));
  }
};

Blockly.Blocks['etw_passthrough'] = {
  init: function () {
    this.appendDummyInput().appendField("EtwPassthrough()");
    this.setOutput(true, "Etw");
    this.setColour(270);
    this.setTooltip(() => getTooltipText('etw_passthrough'));
  }
};

Blockly.Blocks['enigma_m3'] = {
  init: function () {
    this.appendDummyInput().appendField("EnigmaM3");
    this.appendValueInput("PLUGBOARD").setCheck("Plugboard").appendField("plugboard:");
    this.appendValueInput("ROTOR3").setCheck("Rotor").appendField("rotor R (I):");
    this.appendValueInput("ROTOR2").setCheck("Rotor").appendField("rotor M (II):");
    this.appendValueInput("ROTOR1").setCheck("Rotor").appendField("rotor L (III):");
    this.appendValueInput("REFLECTOR").setCheck("Reflector").appendField("reflector:");
    this.appendValueInput("ETW").setCheck("Etw").appendField("etw:");
    this.appendDummyInput().appendField("auto_increment:")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "AUTO");
    this.setOutput(true, "Enigma");
    this.setColour(290);
    this.setTooltip(() => getTooltipText('enigma_m3'));
  }
};

Blockly.Blocks['enigma_input_string'] = {
  init: function () {
    this.appendValueInput("ENIGMA").setCheck("Enigma").appendField("enigma");
    this.appendDummyInput().appendField(".input_string(")
      .appendField(new Blockly.FieldTextInput("codjabrn"), "TEXT")
      .appendField(")");
    this.setOutput(true, "String");
    this.setColour(310);
    this.setTooltip(() => getTooltipText('enigma_input_string'));
  }
};

Blockly.Blocks['hero_unlock_gate'] = {
  init: function () {
    this.appendValueInput("CODE").setCheck("String").appendField("hero.unlock_gate(");
    this.appendDummyInput().appendField(")");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip(() => getTooltipText('hero_unlock_gate'));
  }
};

// JS Generators for Enigma Blocks
registerJS('swappable_plugboard', function (block) {
  const char1 = block.getFieldValue('CHAR1') || 'a';
  const char2 = block.getFieldValue('CHAR2') || 'z';
  return [`new SwappablePlugboard({"${char1}": "${char2}"})`, 0];
});

registerJS('plugboard_swap', function (block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const pb = gen ? (gen.valueToCode(block, 'PLUGBOARD', order) || 'null') : 'null';
  const char1 = block.getFieldValue('CHAR1') || 'a';
  const char2 = block.getFieldValue('CHAR2') || 'z';
  return `${pb}.swap("${char1}", "${char2}");\n`;
});

registerJS('enigma_m3_rotor1', function (block) {
  const pos = block.getFieldValue('POS') || 1;
  const ring = block.getFieldValue('RING') || 1;
  return [`new EnigmaM3RotorI(${pos}, ${ring})`, 0];
});

registerJS('enigma_m3_rotor2', function (block) {
  const pos = block.getFieldValue('POS') || 1;
  const ring = block.getFieldValue('RING') || 1;
  return [`new EnigmaM3RotorII(${pos}, ${ring})`, 0];
});

registerJS('enigma_m3_rotor3', function (block) {
  const pos = block.getFieldValue('POS') || 1;
  const ring = block.getFieldValue('RING') || 1;
  return [`new EnigmaM3RotorIII(${pos}, ${ring})`, 0];
});

registerJS('reflector_ukwb', function (block) {
  return ['new ReflectorUKWB()', 0];
});

registerJS('etw_passthrough', function (block) {
  return ['new EtwPassthrough()', 0];
});

registerJS('enigma_m3', function (block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const pb = gen ? (gen.valueToCode(block, 'PLUGBOARD', order) || 'null') : 'null';
  const r3 = gen ? (gen.valueToCode(block, 'ROTOR3', order) || 'null') : 'null';
  const r2 = gen ? (gen.valueToCode(block, 'ROTOR2', order) || 'null') : 'null';
  const r1 = gen ? (gen.valueToCode(block, 'ROTOR1', order) || 'null') : 'null';
  const ref = gen ? (gen.valueToCode(block, 'REFLECTOR', order) || 'null') : 'null';
  const etw = gen ? (gen.valueToCode(block, 'ETW', order) || 'null') : 'null';
  const auto = block.getFieldValue('AUTO') === 'TRUE' ? 'true' : 'false';
  return [`new EnigmaM3(${pb}, ${r3}, ${r2}, ${r1}, ${ref}, ${etw}, ${auto})`, 0];
});

registerJS('enigma_input_string', function (block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const enigma = gen ? (gen.valueToCode(block, 'ENIGMA', order) || 'null') : 'null';
  const text = block.getFieldValue('TEXT') || '';
  return [`(${enigma} ? ${enigma}.input_string("${text}") : "")`, 0];
});

registerJS('hero_unlock_gate', function (block, generator) {
  const gen = generator || Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const code = gen ? (gen.valueToCode(block, 'CODE', order) || '""') : '""';
  return `unlockGate(${code}, "${block.id}");\n`;
});

// Python Generators for Enigma Blocks
registerPy('swappable_plugboard', function (block) {
  const gen = Blockly.Python || (window.python && window.python.pythonGenerator);
  if (gen) {
    gen.definitions_['import_swappableplugboard'] = 'from enigmapython.SwappablePlugboard import SwappablePlugboard';
  }
  const char1 = block.getFieldValue('CHAR1') || 'a';
  const char2 = block.getFieldValue('CHAR2') || 'z';
  return [`SwappablePlugboard(chars={"${char1}": "${char2}"})`, 0];
});

registerPy('plugboard_swap', function (block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const pb = gen ? (gen.valueToCode(block, 'PLUGBOARD', order) || 'None') : 'None';
  const char1 = block.getFieldValue('CHAR1') || 'a';
  const char2 = block.getFieldValue('CHAR2') || 'z';
  return `${pb}.swap("${char1}", "${char2}")\n`;
});

registerPy('enigma_m3_rotor1', function (block) {
  const gen = Blockly.Python || (window.python && window.python.pythonGenerator);
  if (gen) {
    gen.definitions_['import_rotor1'] = 'from enigmapython.EnigmaM3RotorI import EnigmaM3RotorI';
  }
  const pos = block.getFieldValue('POS') || 1;
  const ring = block.getFieldValue('RING') || 1;
  return [`EnigmaM3RotorI(${pos}, ${ring})`, 0];
});

registerPy('enigma_m3_rotor2', function (block) {
  const gen = Blockly.Python || (window.python && window.python.pythonGenerator);
  if (gen) {
    gen.definitions_['import_rotor2'] = 'from enigmapython.EnigmaM3RotorII import EnigmaM3RotorII';
  }
  const pos = block.getFieldValue('POS') || 1;
  const ring = block.getFieldValue('RING') || 1;
  return [`EnigmaM3RotorII(${pos}, ${ring})`, 0];
});

registerPy('enigma_m3_rotor3', function (block) {
  const gen = Blockly.Python || (window.python && window.python.pythonGenerator);
  if (gen) {
    gen.definitions_['import_rotor3'] = 'from enigmapython.EnigmaM3RotorIII import EnigmaM3RotorIII';
  }
  const pos = block.getFieldValue('POS') || 1;
  const ring = block.getFieldValue('RING') || 1;
  return [`EnigmaM3RotorIII(${pos}, ${ring})`, 0];
});

registerPy('reflector_ukwb', function (block) {
  const gen = Blockly.Python || (window.python && window.python.pythonGenerator);
  if (gen) {
    gen.definitions_['import_reflector'] = 'from enigmapython.ReflectorUKWB import ReflectorUKWB';
  }
  return ['ReflectorUKWB()', 0];
});

registerPy('etw_passthrough', function (block) {
  const gen = Blockly.Python || (window.python && window.python.pythonGenerator);
  if (gen) {
    gen.definitions_['import_etw'] = 'from enigmapython.EtwPassthrough import EtwPassthrough';
  }
  return ['EtwPassthrough()', 0];
});

registerPy('enigma_m3', function (block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  if (gen) {
    gen.definitions_['import_enigmam3'] = 'from enigmapython.EnigmaM3 import EnigmaM3';
  }
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const pb = gen ? (gen.valueToCode(block, 'PLUGBOARD', order) || 'None') : 'None';
  const r3 = gen ? (gen.valueToCode(block, 'ROTOR3', order) || 'None') : 'None';
  const r2 = gen ? (gen.valueToCode(block, 'ROTOR2', order) || 'None') : 'None';
  const r1 = gen ? (gen.valueToCode(block, 'ROTOR1', order) || 'None') : 'None';
  const ref = gen ? (gen.valueToCode(block, 'REFLECTOR', order) || 'None') : 'None';
  const etw = gen ? (gen.valueToCode(block, 'ETW', order) || 'None') : 'None';
  const auto = block.getFieldValue('AUTO') === 'TRUE' ? 'True' : 'False';
  return [`EnigmaM3(${pb}, ${r3}, ${r2}, ${r1}, ${ref}, ${etw}, ${auto})`, 0];
});

registerPy('enigma_input_string', function (block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const enigma = gen ? (gen.valueToCode(block, 'ENIGMA', order) || 'None') : 'None';
  const text = block.getFieldValue('TEXT') || '';
  return [`${enigma}.input_string("${text}")`, 0];
});

registerPy('hero_unlock_gate', function (block, generator) {
  const gen = generator || Blockly.Python || (window.python && window.python.pythonGenerator);
  const order = gen ? (gen.ORDER_NONE || 0) : 0;
  const code = gen ? (gen.valueToCode(block, 'CODE', order) || '""') : '""';
  return `hero.unlock_gate(${code}, block_id="${block.id}")\n`;
});
