// The Legend of Python - Main Controller & Sound Synthesizer (i18n Zelda Theme)

// Synthesizer Engine for retro Zelda sound effects
class RetroSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  
  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API is not supported or blocked in this browser:", e);
        this.ctx = null;
      }
    }
  }
  
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
  
  play(type) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(e => console.warn("Failed to resume AudioContext:", e));
      }
    } catch (e) {
      console.warn("Error checking AudioContext state:", e);
      return;
    }
    
    const now = this.ctx.currentTime;
    
    switch (type) {
      case 'click': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'step': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case 'turn': {
        this.playTone(350, 0.03, 'square', 0.06, now);
        this.playTone(450, 0.03, 'square', 0.06, now + 0.04);
        break;
      }
      case 'collect': {
        this.playTone(987.77, 0.07, 'square', 0.07, now); // B5
        this.playTone(1318.51, 0.22, 'square', 0.07, now + 0.07); // E6
        break;
      }
      case 'win': {
        // Zelda Secret Discovered Melody (Ascending 8-Note Chime)
        const notes = [783.99, 739.99, 622.25, 440.00, 415.30, 659.25, 830.61, 1046.50];
        const tempo = 0.07;
        notes.forEach((freq, idx) => {
          this.playTone(freq, 0.06, 'square', 0.08, now + idx * tempo);
        });
        break;
      }
      case 'crash': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.22);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }
      case 'print': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.03);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }
      case 'error': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.setValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
    }
  }
  
  playTone(freq, duration, type, volume, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

// Global Game State
const synth = new RetroSynth();
let currentLevelIndex = 0;
let workspace = null;
let simulator = null;
let completedLevels = {};
let levelsCodeCache = {};
let currentMode = 'blocks';
let isExecutingStart = false;

// Translation interpolation helper
function t(key, replacements = {}) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['it'];
  let text = dict[key] || TRANSLATIONS['en'][key] || key;
  for (const placeholder in replacements) {
    text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
  }
  return text;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  
  // Load saved language or default to IT
  const savedLang = localStorage.getItem('codequest_lang') || 'it';
  currentLanguage = savedLang;
  document.getElementById('lang-select').value = currentLanguage;
  
  // Load Blockly language locale file, then initialize level
  loadBlocklyLocale(currentLanguage, () => {
    applyTranslations(currentLanguage);
    setupUIEventListeners();
    initSimulator();
    loadLevel(currentLevelIndex);
  });
});

// Load Blockly language definitions dynamically
function loadBlocklyLocale(lang, callback) {
  const existing = document.getElementById('blockly-locale-script');
  if (existing) {
    existing.remove();
  }
  
  const script = document.createElement('script');
  script.id = 'blockly-locale-script';
  script.src = `https://unpkg.com/blockly/msg/${lang}.js`;
  script.onload = () => {
    if (callback) callback();
  };
  script.onerror = () => {
    // Fallback if network fails
    console.warn("Failed to load blockly locale from CDN. Defaulting.");
    if (callback) callback();
  };
  document.head.appendChild(script);
}

// Setup UI Interactivity
function setupUIEventListeners() {
  // One-time interaction to unlock/resume Web Audio API in modern browsers
  const unlockAudio = () => {
    synth.init();
    if (synth.ctx && synth.ctx.state === 'suspended') {
      synth.ctx.resume().then(() => {
        console.log("🔊 AudioContext resumed successfully via user interaction.");
      }).catch(err => {
        console.warn("⚠️ Failed to resume AudioContext:", err);
      });
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('keydown', unlockAudio);

  const prevBtn = document.getElementById('prev-level-btn');
  const nextBtn = document.getElementById('next-level-btn');
  const levelSelect = document.getElementById('level-select');
  const soundBtn = document.getElementById('sound-btn');
  const helpBtn = document.getElementById('help-btn');
  const closeHelpBtn = document.getElementById('close-help-btn');
  const resetProgressBtn = document.getElementById('reset-progress-btn');
  const langSelect = document.getElementById('lang-select');
  
  const exportSaveBtn = document.getElementById('export-save-btn');
  const importSaveBtn = document.getElementById('import-save-btn');
  const importSaveFile = document.getElementById('import-save-file');
  
  const runBtn = document.getElementById('run-btn');
  const stopBtn = document.getElementById('stop-btn');
  const stepBtn = document.getElementById('step-btn');
  const speedSlider = document.getElementById('speed-slider');
  
  const modalRetryBtn = document.getElementById('modal-retry-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  
  // Populate level select dropdown
  refreshLevelSelector();

  levelSelect.addEventListener('change', (e) => {
    synth.play('click');
    loadLevel(parseInt(e.target.value, 10));
  });

  prevBtn.addEventListener('click', () => {
    synth.play('click');
    if (currentLevelIndex > 0) {
      loadLevel(currentLevelIndex - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    synth.play('click');
    if (currentLevelIndex < LEVELS.length - 1) {
      loadLevel(currentLevelIndex + 1);
    }
  });

  soundBtn.addEventListener('click', () => {
    const isEnabled = synth.toggle();
    soundBtn.textContent = isEnabled ? '🔊' : '🔇';
    synth.play('click');
    localStorage.setItem('codequest_sound', isEnabled ? '1' : '0');
  });
  
  const savedSound = localStorage.getItem('codequest_sound');
  if (savedSound === '0') {
    synth.enabled = false;
    soundBtn.textContent = '🔇';
  }

  // Language Selector Trigger
  langSelect.addEventListener('change', (e) => {
    synth.play('click');
    currentLanguage = e.target.value;
    localStorage.setItem('codequest_lang', currentLanguage);
    
    // Load Blockly bundle, then re-render workspace
    loadBlocklyLocale(currentLanguage, () => {
      applyTranslations(currentLanguage);
      refreshLevelSelector();
      loadLevel(currentLevelIndex);
    });
  });

  // Help Modal
  helpBtn.addEventListener('click', () => {
    synth.play('click');
    document.getElementById('help-modal').classList.remove('hidden');
  });
  
  closeHelpBtn.addEventListener('click', () => {
    synth.play('click');
    document.getElementById('help-modal').classList.add('hidden');
  });

  // Save Game and Load Game Button Triggers
  if (exportSaveBtn) {
    exportSaveBtn.addEventListener('click', () => {
      exportGameState();
    });
  }
  
  if (importSaveBtn && importSaveFile) {
    importSaveBtn.addEventListener('click', () => {
      synth.play('click');
      importSaveFile.click();
    });
    
    importSaveFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        importGameState(file);
      }
      importSaveFile.value = '';
    });
  }

  resetProgressBtn.addEventListener('click', () => {
    const promptMsg = currentLanguage === 'it' 
      ? "Resettare tutti i progressi? Perderai tutti i tuoi cuori."
      : "Reset all dungeon achievements? You will lose your hearts.";
    if (confirm(promptMsg)) {
      completedLevels = {};
      levelsCodeCache = {};
      localStorage.removeItem('codequest_completed');
      localStorage.removeItem('codequest_levels_code');
      localStorage.removeItem('codequest_current_level_idx');
      synth.play('crash');
      refreshLevelSelector();
      updateHeartsDisplay();
      loadLevel(0);
    }
  });

  // Simulator controls
  runBtn.addEventListener('click', () => {
    runProgram();
  });

  stopBtn.addEventListener('click', () => {
    synth.play('click');
    simulator.stopSimulation();
    stopBtn.disabled = true;
    runBtn.disabled = false;
    stepBtn.disabled = false;
  });

  stepBtn.addEventListener('click', () => {
    stepProgram();
  });

  speedSlider.addEventListener('input', (e) => {
    simulator.setSpeed(parseInt(e.target.value, 10));
  });

  // Modal actions
  modalRetryBtn.addEventListener('click', () => {
    synth.play('click');
    document.getElementById('success-modal').classList.add('hidden');
    loadLevel(currentLevelIndex);
  });

  modalNextBtn.addEventListener('click', () => {
    synth.play('click');
    document.getElementById('success-modal').classList.add('hidden');
    if (currentLevelIndex < LEVELS.length - 1) {
      loadLevel(currentLevelIndex + 1);
    } else {
      const victoryAlert = currentLanguage === 'it'
        ? "🗝️ CONGRATULAZIONI! Hai ottenuto tutti i pezzi della Triforza e masterizzato cicli, variabili e logiche in Python! Link ha vinto!"
        : "🗝️ CONGRATULATIONS! You secured all pieces of the Triforce and mastered Python loops, variables, and logic! Link is victorious!";
      alert(victoryAlert);
    }
  });

  copyCodeBtn.addEventListener('click', () => {
    const code = document.getElementById('python-output').textContent;
    navigator.clipboard.writeText(code).then(() => {
      synth.play('click');
      const originalText = copyCodeBtn.textContent;
      copyCodeBtn.textContent = t('copied');
      setTimeout(() => {
        copyCodeBtn.textContent = t('copy');
      }, 1500);
    });
  });

  // Mode tabs events (Blocks vs Python Editor)
  const tabBlocks = document.getElementById('tab-blocks');
  const tabPython = document.getElementById('tab-python');
  const blocklyContainer = document.getElementById('blockly-container');
  const editorContainer = document.getElementById('editor-container');
  const pyTextarea = document.getElementById('python-textarea');
  
  tabBlocks.addEventListener('click', () => {
    if (currentMode === 'blocks') return;
    synth.play('click');
    
    // Check if user changed the code in python mode
    const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
    const blocksCode = pyGen ? pyGen.workspaceToCode(workspace) : '';
    const textareaCode = pyTextarea.value;
    
    if (blocksCode.trim() !== textareaCode.trim()) {
      const confirmMsg = currentLanguage === 'it'
        ? "Attenzione: Passando alla modalità Blocchi perderai le modifiche scritte a testo in Python. Vuoi continuare?"
        : "Warning: Switching back to Blocks will discard changes you wrote in Python. Do you want to continue?";
      if (!confirm(confirmMsg)) return;
    }
    
    currentMode = 'blocks';
    tabBlocks.classList.add('active');
    tabPython.classList.remove('active');
    
    blocklyContainer.classList.remove('hidden');
    editorContainer.classList.add('hidden');
    
    // Auto-save active tab change
    const lvlId = LEVELS[currentLevelIndex].id;
    if (!levelsCodeCache[lvlId]) {
      levelsCodeCache[lvlId] = { mode: 'blocks', blocksState: null, pythonCode: '' };
    }
    levelsCodeCache[lvlId].mode = 'blocks';
    saveProgress();
    
    // Refresh workspace size
    Blockly.svgResize(workspace);
    updateCodeOutput();
  });
  
  tabPython.addEventListener('click', () => {
    if (currentMode === 'python') return;
    synth.play('click');
    
    currentMode = 'python';
    tabPython.classList.add('active');
    tabBlocks.classList.remove('active');
    
    blocklyContainer.classList.add('hidden');
    editorContainer.classList.remove('hidden');
    
    // Populate textarea with current blocks code
    const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
    const blocksCode = pyGen ? pyGen.workspaceToCode(workspace) : '';
    pyTextarea.value = blocksCode;
    
    // Auto-save active tab change
    const lvlId = LEVELS[currentLevelIndex].id;
    if (!levelsCodeCache[lvlId]) {
      levelsCodeCache[lvlId] = { mode: 'blocks', blocksState: null, pythonCode: '' };
    }
    levelsCodeCache[lvlId].mode = 'python';
    levelsCodeCache[lvlId].pythonCode = pyTextarea.value;
    saveProgress();
    
    // Focus and update line numbers
    pyTextarea.focus();
    updateLineNumbers();
    updateCodeOutput();
  });
  
  // Textarea input event for line numbers and output highlights
  pyTextarea.addEventListener('input', () => {
    // Auto-save python code changes
    const lvlId = LEVELS[currentLevelIndex].id;
    if (!levelsCodeCache[lvlId]) {
      levelsCodeCache[lvlId] = { mode: 'blocks', blocksState: null, pythonCode: '' };
    }
    levelsCodeCache[lvlId].pythonCode = pyTextarea.value;
    levelsCodeCache[lvlId].mode = currentMode;
    saveProgress();
    
    updateLineNumbers();
    updateCodeOutput();
  });
  
  // Sync scrolling of line numbers with textarea scroll
  pyTextarea.addEventListener('scroll', () => {
    const lineNumbers = document.getElementById('editor-line-numbers');
    if (lineNumbers) {
      lineNumbers.scrollTop = pyTextarea.scrollTop;
    }
  });
}

function initSimulator() {
  // We feed translated logging hooks to the simulator
  simulator = new GameSimulator('simulator-canvas', appendConsoleLine, playSynthSound);
  
  simulator.onFinishedCallback = (success, reason) => {
    document.getElementById('run-btn').disabled = false;
    document.getElementById('step-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
    
    if (simulator) {
      simulator.actionQueue = [];
      simulator.currentActionIndex = 0;
    }
    
    if (success) {
      markLevelCompleted(LEVELS[currentLevelIndex].id);
      showSuccessModal();
    }
  };
  
  // Custom simulator status wrappers using i18n
  simulator.onStatus = (msg, type) => {
    // Check if the simulator sent a raw system action that we can translate
    if (msg.startsWith("⚔️ hero.move_forward()")) {
      appendConsoleLine(t('consoleMove', { x: simulator.x, y: simulator.y }), 'system');
    } else if (msg.startsWith("⚔️ hero.turn_left()")) {
      appendConsoleLine(t('consoleTurn', { dir: 'left', name: simulator.getDirectionName(simulator.dir) }), 'system');
    } else if (msg.startsWith("⚔️ hero.turn_right()")) {
      appendConsoleLine(t('consoleTurn', { dir: 'right', name: simulator.getDirectionName(simulator.dir) }), 'system');
    } else if (msg.startsWith("💎 Rupee acquired!")) {
      appendConsoleLine(t('consoleRupeeAcquired', { count: simulator.collectedCount }), 'output');
    } else if (msg.startsWith("⚠️ hero.collect_rupee()")) {
      appendConsoleLine(t('consoleRupeeWarn'), 'error');
    } else if (msg.startsWith("🗝️ THE TRIFORCE SHINES!")) {
      appendConsoleLine(t('consoleWin'), 'system');
    } else if (msg.startsWith("⚠️ The Triforce gate is sealed")) {
      appendConsoleLine(t('consoleRupeeSeal', { count: simulator.collectedCount, target: simulator.level.targetCrystals }), 'error');
    } else if (msg.startsWith("⚠️ Almost cleared")) {
      appendConsoleLine(t('consolePrintSeal'), 'error');
    } else if (msg.startsWith("🧭 Link finished movements")) {
      appendConsoleLine(t('consoleFinishIncomplete'), 'error');
    } else if (msg.startsWith("💥 OOF!")) {
      appendConsoleLine(t('consoleCrash'), 'error');
    } else if (msg.startsWith("⚔️ Link has entered")) {
      appendConsoleLine(t('consoleEnter'), 'system');
    } else {
      appendConsoleLine(msg, type);
    }
  };
}

function playSynthSound(type) {
  synth.play(type);
}

// Load level configuration
function loadLevel(index) {
  const tabBlocks = document.getElementById('tab-blocks');
  const tabPython = document.getElementById('tab-python');
  const blocklyContainer = document.getElementById('blockly-container');
  const editorContainer = document.getElementById('editor-container');

  currentLevelIndex = index;
  const level = LEVELS[index];
  
  document.getElementById('level-select').value = index;
  
  // Extract translations
  const nameText = level.name[currentLanguage] || level.name['it'];
  const storyText = level.story[currentLanguage] || level.story['it'];
  const goalText = level.goalText[currentLanguage] || level.goalText['it'];
  const tipText = level.tip[currentLanguage] || level.tip['it'];
  
  document.getElementById('quest-title').textContent = nameText;
  document.getElementById('level-badge').textContent = t('roomBadge', { id: getLevelDisplayId(level), badge: level.badge });
  document.getElementById('quest-desc').textContent = storyText;
  document.getElementById('quest-goal').textContent = goalText;
  document.getElementById('python-explanation-text').textContent = tipText;
  
  // Render available spells guide
  const docsListEl = document.getElementById('python-docs-list');
  if (docsListEl) {
    docsListEl.innerHTML = '';
    const docs = level.docs ? (level.docs[currentLanguage] || level.docs['it'] || []) : [];
    if (docs.length > 0) {
      document.getElementById('python-docs-section').style.display = 'block';
      docs.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'docs-item';
        
        const codeDiv = document.createElement('div');
        codeDiv.className = 'docs-code';
        codeDiv.textContent = doc.code;
        
        const descDiv = document.createElement('div');
        descDiv.className = 'docs-desc';
        descDiv.textContent = doc.desc;
        
        item.appendChild(codeDiv);
        item.appendChild(descDiv);
        docsListEl.appendChild(item);
      });
    } else {
      document.getElementById('python-docs-section').style.display = 'none';
    }
  }
  
  const consoleEl = document.getElementById('terminal-console');
  consoleEl.innerHTML = '';
  appendConsoleLine(t('consoleSystemStart', { name: nameText }), 'system');
  
  simulator.initLevel(level);
  updateHeartsDisplay();
  
  document.getElementById('run-btn').disabled = false;
  document.getElementById('step-btn').disabled = false;
  document.getElementById('stop-btn').disabled = true;

  // Inject "on_start" into toolbox dynamically if not present
  if (level.toolbox && level.toolbox.contents && level.toolbox.contents[0] && level.toolbox.contents[0].contents) {
    const firstCatContents = level.toolbox.contents[0].contents;
    const hasOnStart = firstCatContents.some(b => b.type === "on_start");
    if (!hasOnStart) {
      firstCatContents.unshift({ kind: "block", type: "on_start" });
    }
  }
  
  // Re-inject Blockly workspace
  blocklyContainer.innerHTML = '<div id="blocklyDiv"></div>';
  
  workspace = Blockly.inject('blocklyDiv', {
    toolbox: level.toolbox,
    scrollbars: true,
    trashcan: true,
    maxInstances: {
      'on_start': 1
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 2.0,
      minScale: 0.5,
    },
    theme: {
      componentStyles: {
        workspaceBackgroundColour: '#16110d',
        toolboxBackgroundColour: '#3d2f26',
        toolboxTextColour: '#f5efe6',
        flyoutBackgroundColour: '#211914',
        scrollbarColour: '#3d2f26',
        scrollbarOpacity: 0.8
      }
    }
  });

  // Restore saved code/blocks state if exists
  const levelId = level.id;
  const savedState = levelsCodeCache[levelId];
  const pyTextarea = document.getElementById('python-textarea');
  
  if (savedState) {
    currentMode = savedState.mode || 'blocks';
    
    // Restore Blockly
    if (savedState.blocksState) {
      try {
        if (Blockly.serialization && typeof savedState.blocksState === 'object') {
          Blockly.serialization.workspaces.load(savedState.blocksState, workspace);
        } else {
          // Fallback XML
          const xml = Blockly.Xml.textToDom(savedState.blocksState);
          Blockly.Xml.domToWorkspace(xml, workspace);
        }
      } catch (e) {
        console.warn("Failed to restore blockly state: ", e);
      }
    }
    
    // Restore Python text
    if (savedState.pythonCode) {
      if (pyTextarea) pyTextarea.value = savedState.pythonCode;
    } else {
      if (pyTextarea) pyTextarea.value = '';
    }
  } else {
    currentMode = 'blocks';
    if (pyTextarea) pyTextarea.value = '';
  }

  // Auto-create/restore on_start event block if it is missing
  const allBlocks = workspace.getAllBlocks(false);
  let startBlock = allBlocks.find(b => b.type === 'on_start');
  if (!startBlock) {
    startBlock = workspace.newBlock('on_start');
    startBlock.initSvg();
    startBlock.render();
    startBlock.setDeletable(false);
    startBlock.moveBy(380, 30);
  } else {
    startBlock.setDeletable(false);
    // Automatically migrate old coordinates if the block is too close to the left boundary (covered by toolbox)
    const pos = startBlock.getRelativeToSurfaceXY();
    if (pos && pos.x < 350) {
      startBlock.moveTo({ x: 380, y: 30 });
    }
  }

  // Update Tab active UI
  if (tabBlocks && tabPython && blocklyContainer && editorContainer) {
    if (currentMode === 'python') {
      tabPython.classList.add('active');
      tabBlocks.classList.remove('active');
      blocklyContainer.classList.add('hidden');
      editorContainer.classList.remove('hidden');
    } else {
      tabBlocks.classList.add('active');
      tabPython.classList.remove('active');
      blocklyContainer.classList.remove('hidden');
      editorContainer.classList.add('hidden');
    }
  }

  workspace.addChangeListener(updateCodeOutput);

  // Auto-save blocks state listener
  workspace.addChangeListener((event) => {
    if (event.isUiEvent) return;
    
    const lvlId = LEVELS[currentLevelIndex].id;
    if (!levelsCodeCache[lvlId]) {
      levelsCodeCache[lvlId] = { mode: 'blocks', blocksState: null, pythonCode: '' };
    }
    
    try {
      if (Blockly.serialization) {
        levelsCodeCache[lvlId].blocksState = Blockly.serialization.workspaces.save(workspace);
      } else {
        const xml = Blockly.Xml.workspaceToDom(workspace);
        levelsCodeCache[lvlId].blocksState = Blockly.Xml.domToText(xml);
      }
    } catch (e) {
      console.warn("Failed to auto-save blockly state: ", e);
    }
    
    levelsCodeCache[lvlId].mode = currentMode;
    saveProgress();
  });

  // Visual disable listener for loose blocks not inside the on_start event block
  workspace.addChangeListener((event) => {
    if (event.type === Blockly.Events.BLOCK_MOVE || 
        event.type === Blockly.Events.BLOCK_CREATE || 
        event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.FINISHED_LOADING) {
      
      const blocks = workspace.getAllBlocks(false);
      const sBlock = blocks.find(b => b.type === 'on_start');
      if (sBlock) {
        const descendants = sBlock.getDescendants(false);
        const connectedIds = new Set(descendants.map(b => b.id));
        
        Blockly.Events.disable();
        try {
          blocks.forEach(b => {
            if (b.type === 'on_start') {
              b.setEnabled(true);
            } else {
              const shouldBeEnabled = connectedIds.has(b.id);
              if (b.isEnabled() !== shouldBeEnabled) {
                b.setEnabled(shouldBeEnabled);
              }
            }
          });
        } finally {
          Blockly.Events.enable();
        }
      }
    }
  });

  Blockly.svgResize(workspace);
  window.addEventListener('resize', onResizeWorkspace);
  
  // Automatically select and open the first toolbox category (Commands)
  setTimeout(() => {
    if (workspace && workspace.getToolbox()) {
      workspace.getToolbox().selectItemByPosition(0);
    }
  }, 100);
  
  // Update placeholders
  updateCodeOutput();
}

function onResizeWorkspace() {
  if (workspace) {
    Blockly.svgResize(workspace);
  }
}

// Code Highlighter
function updateCodeOutput() {
  const outputEl = document.getElementById('python-output');
  if (!outputEl) return;
  
  if (currentMode === 'python') {
    const pyCode = document.getElementById('python-textarea').value;
    if (pyCode.trim() === "") {
      outputEl.innerHTML = `<span class="py-comment">${t('dragSpells')}</span>`;
      return;
    }
    outputEl.innerHTML = highlightPython(pyCode);
    return;
  }
  
  const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
  const code = pyGen ? pyGen.workspaceToCode(workspace) : '';
  
  if (code.trim() === "") {
    outputEl.innerHTML = `<span class="py-comment">${t('dragSpells')}</span>`;
    return;
  }
  
  outputEl.innerHTML = highlightPython(code);
}

function highlightPython(code) {
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  escaped = escaped.replace(/(#[^\n]*)/g, '<span class="py-comment">$1</span>');
  escaped = escaped.replace(/(['"])(.*?)\1/g, '<span class="py-str">$1$2$1</span>');
  escaped = escaped.replace(/\b(\d+)\b/g, '<span class="py-num">$1</span>');
  
  const keywords = ['def', 'for', 'in', 'range', 'if', 'else', 'while', 'return', 'pass'];
  keywords.forEach(kw => {
    const regex = new RegExp('\\b(' + kw + ')\\b', 'g');
    escaped = escaped.replace(regex, '<span class="py-kw">$1</span>');
  });
  
  const funcs = ['hero\\.move_forward', 'hero\\.collect_rupee', 'hero\\.turn_left', 'hero\\.turn_right', 'hero\\.scan_ahead', 'print'];
  funcs.forEach(f => {
    const regex = new RegExp('\\b(' + f + ')\\b', 'g');
    escaped = escaped.replace(regex, '<span class="py-func">$1</span>');
  });
  
  return escaped;
}

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

function getLevelDisplayId(level) {
  if (typeof level.id === 'string') {
    const match = level.id.match(/room(\d+)$/i);
    if (match) {
      return match[1];
    }
    return level.id;
  }
  return level.id;
}

function appendConsoleLine(text, styleClass) {
  const consoleEl = document.getElementById('terminal-console');
  const line = document.createElement('div');
  line.className = `terminal-line ${styleClass || ''}`;
  line.textContent = text;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

// Code evaluation
function runProgram() {
  let jsCode = '';
  if (currentMode === 'blocks') {
    const jsGen = Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
    jsCode = jsGen ? jsGen.workspaceToCode(workspace) : '';
  } else {
    const pyCode = document.getElementById('python-textarea').value;
    jsCode = transpilePythonToJS(pyCode);
  }
  
  if (jsCode.trim() === "") {
    synth.play('error');
    appendConsoleLine(t('consoleErrorEmpty'), "error");
    return;
  }
  
  const validationError = validateLevelConstructs(LEVELS[currentLevelIndex]);
  if (validationError) {
    synth.play('error');
    appendConsoleLine(validationError, "error");
    return;
  }
  
  synth.play('click');
  document.getElementById('run-btn').disabled = true;
  document.getElementById('step-btn').disabled = true;
  document.getElementById('stop-btn').disabled = false;
  
  const actionQueue = compileActionQueue(jsCode);
  
  simulator.initLevel(LEVELS[currentLevelIndex]);
  simulator.loadActionQueue(actionQueue);
}

function stepProgram() {
  let jsCode = '';
  if (currentMode === 'blocks') {
    const jsGen = Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
    jsCode = jsGen ? jsGen.workspaceToCode(workspace) : '';
  } else {
    const pyCode = document.getElementById('python-textarea').value;
    jsCode = transpilePythonToJS(pyCode);
  }
  
  if (jsCode.trim() === "") {
    synth.play('error');
    appendConsoleLine(t('consoleErrorEmpty'), "error");
    return;
  }
  
  const validationError = validateLevelConstructs(LEVELS[currentLevelIndex]);
  if (validationError) {
    synth.play('error');
    appendConsoleLine(validationError, "error");
    return;
  }
  
  if (!simulator.isPlaying && simulator.actionQueue.length === 0) {
    synth.play('click');
    const actionQueue = compileActionQueue(jsCode);
    simulator.initLevel(LEVELS[currentLevelIndex]);
    simulator.actionQueue = actionQueue;
    simulator.currentActionIndex = 0;
    simulator.isPlaying = false;
    appendConsoleLine(t('consoleStepMode'), "system");
  }
  
  simulator.executeNextAction();
}

function compileActionQueue(jsCode) {
  const actionQueue = [];
  const level = LEVELS[currentLevelIndex];
  
  const shadowRobot = {
    x: level.startX,
    y: level.startY,
    dir: level.startDir,
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
    } else if (level.grid[nextY][nextX] === 1) {
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
    
    const tile = level.grid[nextY][nextX];
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
  
  globalThis.hero = {
    move_forward: () => globalThis.moveForward(),
    collect_rupee: () => globalThis.collectRupee(),
    turn_left: () => globalThis.turnLeft(),
    turn_right: () => globalThis.turnRight(),
    scan_ahead: () => globalThis.scanAhead()
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
  delete globalThis.hero;
  delete globalThis.on_start;
  
  return actionQueue;
}

// Save achievements & progress helper
// Save achievements & progress helper
function saveProgress() {
  try {
    localStorage.setItem('codequest_completed', JSON.stringify(completedLevels));
  } catch (e) {
    console.error("Failed to save codequest_completed:", e);
  }
  
  try {
    localStorage.setItem('codequest_levels_code', JSON.stringify(levelsCodeCache));
  } catch (e) {
    console.error("Failed to save codequest_levels_code:", e);
  }
  
  try {
    localStorage.setItem('codequest_current_level_idx', currentLevelIndex);
  } catch (e) {
    console.error("Failed to save codequest_current_level_idx:", e);
  }
  
  console.log("💾 saveProgress executed. completedLevels:", completedLevels, "levelsCodeCache keys:", Object.keys(levelsCodeCache), "currentLevelIndex:", currentLevelIndex);
}

function markLevelCompleted(levelId) {
  console.log("🏆 markLevelCompleted called with id:", levelId);
  completedLevels[levelId] = true;
  completedLevels[String(levelId)] = true;
  
  saveProgress();
  refreshLevelSelector();
  updateHeartsDisplay();
}

function migrateOldSaveData() {
  const mapping = {
    "1": "sequences/room1",
    "2": "variables/room1",
    "3": "conditionals/room1",
    "4": "loops/room1",
    "5": "functions/room1",
    "6": "lists/room1",
    "7": "recursion/room1"
  };

  let migratedCompleted = false;
  for (const oldId in mapping) {
    const newId = mapping[oldId];
    if (completedLevels[oldId] && !completedLevels[newId]) {
      completedLevels[newId] = true;
      migratedCompleted = true;
    }
  }

  let migratedCode = false;
  for (const oldId in mapping) {
    const newId = mapping[oldId];
    if (levelsCodeCache[oldId] && !levelsCodeCache[newId]) {
      levelsCodeCache[newId] = levelsCodeCache[oldId];
      migratedCode = true;
    }
  }

  if (migratedCompleted || migratedCode) {
    console.log("🔄 Migrated old numeric save data keys to new string path namespaces.");
    try {
      localStorage.setItem('codequest_completed', JSON.stringify(completedLevels));
      localStorage.setItem('codequest_levels_code', JSON.stringify(levelsCodeCache));
    } catch (e) {
      console.warn("Failed to write migrated data: ", e);
    }
  }
}

function loadProgress() {
  const progressStr = localStorage.getItem('codequest_completed');
  if (progressStr) {
    try {
      completedLevels = JSON.parse(progressStr);
      console.log("📂 loadProgress parsed completedLevels:", completedLevels);
    } catch (e) {
      console.error("Failed to parse codequest_completed JSON:", e);
      completedLevels = {};
    }
  } else {
    completedLevels = {};
  }
  
  const savedCodeStr = localStorage.getItem('codequest_levels_code');
  if (savedCodeStr) {
    try {
      levelsCodeCache = JSON.parse(savedCodeStr);
    } catch (e) {
      console.error("Failed to parse codequest_levels_code JSON:", e);
      levelsCodeCache = {};
    }
  } else {
    levelsCodeCache = {};
  }
  
  const savedLvlIdx = localStorage.getItem('codequest_current_level_idx');
  if (savedLvlIdx !== null) {
    currentLevelIndex = parseInt(savedLvlIdx, 10);
    // Boundary check
    if (isNaN(currentLevelIndex) || currentLevelIndex < 0 || currentLevelIndex >= LEVELS.length) {
      currentLevelIndex = 0;
    }
  }
  
  migrateOldSaveData();
  console.log("📂 loadProgress complete. completedLevels:", completedLevels, "currentLevelIndex:", currentLevelIndex);
}

// Refresh checkmarks
function refreshLevelSelector() {
  const levelSelect = document.getElementById('level-select');
  if (!levelSelect) return;
  
  levelSelect.innerHTML = '';
  
  // Group levels by difficulty
  const groups = {};
  LEVELS.forEach((lvl, index) => {
    let diff = lvl.difficulty || 'base';
    // Normalize difficulty names to handle cached files robustly
    if (diff === 'Easy' || diff === 'base') {
      diff = 'base';
    } else if (diff === 'Medium' || diff === 'intermediate') {
      diff = 'intermediate';
    } else if (diff === 'Hard' || diff === 'advanced') {
      diff = 'advanced';
    } else {
      diff = 'base';
    }
    
    if (!groups[diff]) {
      groups[diff] = [];
    }
    groups[diff].push({ lvl, index });
  });
  
  // The order of difficulties we want to display
  const diffOrder = ['base', 'intermediate', 'advanced'];
  
  diffOrder.forEach(diffKey => {
    const items = groups[diffKey];
    if (items && items.length > 0) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = t(`difficulty_${diffKey}`);
      
      items.forEach(({ lvl, index }) => {
        const option = document.createElement('option');
        option.value = index;
        const isCompleted = completedLevels[lvl.id] || completedLevels[String(lvl.id)];
        const check = isCompleted ? " 🗝️" : "";
        option.textContent = `${lvl.id}${check}`;
        optgroup.appendChild(option);
      });
      
      levelSelect.appendChild(optgroup);
    }
  });
  
  // Set back to current index
  levelSelect.value = currentLevelIndex;
}

function updateHeartsDisplay() {
  const display = document.getElementById('hearts-display');
  if (!display) return;
  
  // Group levels by topic (badge) in order of appearance
  const topics = [];
  LEVELS.forEach(lvl => {
    if (!topics.includes(lvl.badge)) {
      topics.push(lvl.badge);
    }
  });
  
  let completedTopicsCount = 0;
  let heartsStr = "";
  
  topics.forEach(topic => {
    const topicLevels = LEVELS.filter(lvl => lvl.badge === topic);
    const allCompleted = topicLevels.every(lvl => {
      return completedLevels[lvl.id] || completedLevels[String(lvl.id)];
    });
    
    if (allCompleted) {
      heartsStr += "❤️";
      completedTopicsCount++;
    } else {
      heartsStr += "🖤";
    }
  });
  
  console.log("❤️ updateHeartsDisplay. completedLevels:", completedLevels, "heartsStr:", heartsStr, "completedTopicsCount:", completedTopicsCount);
  display.textContent = heartsStr;
  
  // Tooltip dinamico e localizzato per argomenti completati
  const tooltipText = currentLanguage === 'it'
    ? `Argomenti completati: ${completedTopicsCount} su ${topics.length}`
    : `Topics completed: ${completedTopicsCount} of ${topics.length}`;
  display.title = tooltipText;
}

function showSuccessModal() {
  const level = LEVELS[currentLevelIndex];
  let pyCode = '';
  if (currentMode === 'blocks') {
    const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
    pyCode = pyGen ? pyGen.workspaceToCode(workspace) : '';
  } else {
    pyCode = document.getElementById('python-textarea').value;
  }
  
  const successText = currentLanguage === 'it'
    ? `Link ha sbloccato con successo la Stanza ${getLevelDisplayId(level)} e ha ottenuto il frammento della Triforza!`
    : `Link successfully unlocked Room ${getLevelDisplayId(level)} and secured the Triforce piece!`;
  
  document.getElementById('success-message').textContent = successText;
  document.getElementById('success-code-text').textContent = pyCode || 'No spells cast.';
  document.getElementById('success-modal').classList.remove('hidden');
}

// Text Editor line numbering helper
function updateLineNumbers() {
  const textarea = document.getElementById('python-textarea');
  const lineNumbers = document.getElementById('editor-line-numbers');
  if (!textarea || !lineNumbers) return;
  
  const linesCount = textarea.value.split('\n').length;
  let numStr = '';
  for (let i = 1; i <= linesCount; i++) {
    numStr += i + '\n';
  }
  lineNumbers.textContent = numStr;
}

// Simple Python-to-JavaScript Transpiler
function transpilePythonToJS(pyCode) {
  const lines = pyCode.split('\n');
  let jsCode = '';
  let indentStack = [0];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip empty lines or comment-only lines
    if (line.trim() === '' || line.trim().startsWith('#')) {
      jsCode += line + '\n';
      continue;
    }
    
    // Measure indentation
    const match = line.match(/^(\s*)/);
    const currentIndent = match ? match[1].length : 0;
    
    // If indentation decreased, close braces
    while (indentStack[indentStack.length - 1] > currentIndent) {
      indentStack.pop();
      jsCode += ' '.repeat(indentStack[indentStack.length - 1]) + '}\n';
    }
    
    let content = line.trim();
    let isBlockHeader = false;
    
    // Translate Python syntax to JS syntax
    if (content.startsWith('def ')) {
      content = content.replace(/def\s+(\w+)\s*\((.*)\)\s*:/, 'function $1($2) {');
      isBlockHeader = true;
    } else if (content.startsWith('for ') && content.includes('in range(')) {
      content = content.replace(/for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*\)\s*:/, 'for (let $1 = 0; $1 < $2; $1++) {');
      isBlockHeader = true;
    } else if (content.startsWith('if ')) {
      content = content.replace(/if\s+(.+)\s*:/, 'if ($1) {');
      content = content.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
      isBlockHeader = true;
    } else if (content.startsWith('elif ')) {
      content = content.replace(/elif\s+(.+)\s*:/, 'else if ($1) {');
      content = content.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
      isBlockHeader = true;
    } else if (content.startsWith('else:')) {
      content = 'else {';
      isBlockHeader = true;
    } else if (content.startsWith('while ')) {
      content = content.replace(/while\s+(.+)\s*:/, 'while ($1) {');
      isBlockHeader = true;
    }
    
    // Translate custom commands
    content = content.replace(/hero\.move_forward\(\)/g, 'moveForward()');
    content = content.replace(/hero\.collect_rupee\(\)/g, 'collectRupee()');
    content = content.replace(/hero\.turn_left\(\)/g, 'turnLeft()');
    content = content.replace(/hero\.turn_right\(\)/g, 'turnRight()');
    content = content.replace(/hero\.scan_ahead\(\)/g, 'scanAhead()');
    
    // Translate print() to printConsole()
    content = content.replace(/print\s*\((.*)\)/g, 'printConsole($1)');
    
    // Append semicolons to expression lines (non-headers)
    if (!isBlockHeader && !content.endsWith(';') && !content.endsWith('}')) {
      content += ';';
    }
    
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
    
    jsCode += ' '.repeat(currentIndent) + content + '\n';
  }
  
  // Close any remaining open braces
  while (indentStack.length > 1) {
    indentStack.pop();
    jsCode += ' '.repeat(indentStack[indentStack.length - 1]) + '}\n';
  }
  
  return jsCode;
}

function exportGameState() {
  synth.play('click');
  
  // Make sure current workspace is auto-saved first
  if (workspace) {
    const lvlId = LEVELS[currentLevelIndex].id;
    if (!levelsCodeCache[lvlId]) {
      levelsCodeCache[lvlId] = { mode: 'blocks', blocksState: null, pythonCode: '' };
    }
    try {
      if (Blockly.serialization) {
        levelsCodeCache[lvlId].blocksState = Blockly.serialization.workspaces.save(workspace);
      } else {
        const xml = Blockly.Xml.workspaceToDom(workspace);
        levelsCodeCache[lvlId].blocksState = Blockly.Xml.domToText(xml);
      }
    } catch (e) {
      console.warn("Failed to serialize workspace on export: ", e);
    }
    levelsCodeCache[lvlId].mode = currentMode;
    
    const pyTextarea = document.getElementById('python-textarea');
    if (pyTextarea) {
      levelsCodeCache[lvlId].pythonCode = pyTextarea.value;
    }
  }

  const saveData = {
    app: "codequest-python",
    version: 1,
    timestamp: Date.now(),
    completedLevels: completedLevels,
    levelsCode: levelsCodeCache,
    settings: {
      language: currentLanguage,
      currentLevelIndex: currentLevelIndex
    }
  };

  const dataStr = JSON.stringify(saveData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  const a = document.createElement('a');
  a.href = url;
  a.download = `codequest_save_${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  appendConsoleLine("💾 " + (currentLanguage === 'it' ? "Stato del gioco esportato con successo!" : "Game state exported successfully!"), "system");
}

function importGameState(file) {
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      // Simple validation
      if (data.app !== "codequest-python" || !data.completedLevels || !data.levelsCode) {
        throw new Error(currentLanguage === 'it' 
          ? "File di salvataggio non valido o corrotto." 
          : "Invalid or corrupted save file.");
      }
      
      // Load progress
      completedLevels = data.completedLevels;
      levelsCodeCache = data.levelsCode;
      
      migrateOldSaveData();
      
      if (data.settings) {
        if (data.settings.language) {
          currentLanguage = data.settings.language;
          document.getElementById('lang-select').value = currentLanguage;
        }
        if (data.settings.currentLevelIndex !== undefined) {
          currentLevelIndex = data.settings.currentLevelIndex;
        }
      }
      
      // Persist to local storage
      saveProgress();
      localStorage.setItem('codequest_lang', currentLanguage);
      
      // Play sound
      synth.play('win');
      
      // Re-initialize UI
      loadBlocklyLocale(currentLanguage, () => {
        applyTranslations(currentLanguage);
        refreshLevelSelector();
        updateHeartsDisplay();
        loadLevel(currentLevelIndex);
        appendConsoleLine("📂 " + (currentLanguage === 'it' ? "Partita caricata con successo!" : "Game state loaded successfully!"), "system");
      });
      
    } catch (err) {
      synth.play('error');
      alert((currentLanguage === 'it' ? "Errore nel caricamento del salvataggio: " : "Error loading save file: ") + err.message);
    }
  };
  reader.readAsText(file);
}

