// The Legend of Python - Main App Controller and UI Bindings

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
    refreshLevelSelector();
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
  // Setup audio unlocking via normal bubbling clicks on specific interactive UI elements
  // (Safari/Firefox compatibility workaround since they can block capturing-phase window gestures).
  const forceAudioUnlock = () => {
    synth.init();
    if (synth.ctx && synth.ctx.state === 'suspended' && typeof synth.ctx.resume === 'function') {
      synth.ctx.resume().then(() => {
        console.log("🔊 AudioContext resumed successfully via button/page bubbling gesture.");
      }).catch(e => console.warn("Failed to resume AudioContext:", e));
    }
  };

  const triggerElements = [
    document.getElementById('run-btn'),
    document.getElementById('step-btn'),
    document.getElementById('stop-btn'),
    document.getElementById('sound-btn'),
    document.getElementById('crt-btn'),
    document.getElementById('expert-btn'),
    document.getElementById('help-btn'),
    document.getElementById('export-save-btn'),
    document.getElementById('import-save-btn'),
    document.getElementById('reset-progress-btn'),
    document.getElementById('level-select'),
    document.getElementById('prev-level-btn'),
    document.getElementById('next-level-btn'),
    document.getElementById('modal-next-btn'),
    document.getElementById('modal-retry-btn'),
    document.getElementById('close-help-btn')
  ];

  triggerElements.forEach(el => {
    if (el) {
      el.addEventListener('click', forceAudioUnlock, false);
      el.addEventListener('touchstart', forceAudioUnlock, false);
    }
  });

  document.body.addEventListener('click', forceAudioUnlock, false);
  document.body.addEventListener('keydown', forceAudioUnlock, false);
  document.body.addEventListener('touchstart', forceAudioUnlock, false);

  // One-time interaction to unlock/resume Web Audio API in modern browsers (capturing phase fallback)
  const unlockAudio = () => {
    synth.init();
    if (synth.ctx) {
      // Play a tiny silent tone to satisfy browser user gesture requirements
      try {
        const osc = synth.ctx.createOscillator();
        const gain = synth.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, synth.ctx.currentTime);
        osc.connect(gain);
        gain.connect(synth.ctx.destination);
        osc.start(0);
        osc.stop(0.01);
      } catch (e) {
        console.warn("Failed to play silent unlock note:", e);
      }
      
      console.log("🔒 unlockAudio interaction. AudioContext state before resume:", synth.ctx.state);
      if (synth.ctx.state === 'suspended' && typeof synth.ctx.resume === 'function') {
        synth.ctx.resume().then(() => {
          console.log("🔊 AudioContext resumed successfully via window capture interaction. State:", synth.ctx.state);
          appendConsoleLine(t('consoleAudioEnabled'), 'system');
        }).catch(err => {
          console.warn("⚠️ Failed to resume AudioContext:", err);
        });
      }
    }
    window.removeEventListener('click', unlockAudio, true);
    window.removeEventListener('keydown', unlockAudio, true);
    window.removeEventListener('touchstart', unlockAudio, true);
  };
  window.addEventListener('click', unlockAudio, true);
  window.addEventListener('keydown', unlockAudio, true);
  window.addEventListener('touchstart', unlockAudio, true);

  // Playback control button listeners
  const runBtn = document.getElementById('run-btn');
  if (runBtn) {
    runBtn.addEventListener('click', () => runProgram());
  }
  
  const stopBtn = document.getElementById('stop-btn');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      synth.play('click');
      simulator.stop();
      appendConsoleLine("⏹️ " + (currentLanguage === 'it' ? "Simulazione interrotta." : "Simulation stopped."), "system");
    });
  }
  
  const stepBtn = document.getElementById('step-btn');
  if (stepBtn) {
    stepBtn.addEventListener('click', () => stepProgram());
  }

  // Speed slider configuration
  const speedSlider = document.getElementById('speed-slider');
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      let stepDelay = 400;
      switch (val) {
        case 1: stepDelay = 800; break;
        case 2: stepDelay = 600; break;
        case 3: stepDelay = 400; break;
        case 4: stepDelay = 200; break;
        case 5: stepDelay = 80; break;
      }
      if (simulator) {
        simulator.stepDelay = stepDelay;
      }
    });
  }

  // Sound Synth toggle button listener
  const soundBtn = document.getElementById('sound-btn');
  if (soundBtn) {
    const updateSoundButtonText = () => {
      const active = synth.enabled;
      soundBtn.textContent = active ? '🔊' : '🔇';
      soundBtn.title = t('titleSound') + (active ? ' (ON)' : ' (OFF)');
      soundBtn.style.opacity = active ? '1' : '0.6';
    };
    window.updateSoundButtonText = updateSoundButtonText;
    updateSoundButtonText();

    soundBtn.addEventListener('click', () => {
      const enabled = synth.toggle();
      localStorage.setItem('codequest_sound', String(enabled));
      updateSoundButtonText();
      if (enabled) {
        synth.init();
        if (synth.ctx) {
          console.log("🔊 Sound toggled ON. AudioContext state:", synth.ctx.state);
          if (synth.ctx.state === 'suspended') {
            synth.ctx.resume().then(() => {
              console.log("🔊 AudioContext resumed successfully on button click. State:", synth.ctx.state);
              appendConsoleLine(t('consoleAudioEnabled'), 'system');
              synth.play('click');
            }).catch(err => {
              console.warn("⚠️ Failed to resume AudioContext on button click:", err);
              appendConsoleLine(t('consoleAudioError') + ": " + err.message, 'error');
            });
          } else {
            console.log("🔊 AudioContext is already running. Playing test chime...");
            appendConsoleLine(t('consoleAudioEnabled'), 'system');
            synth.play('click');
          }
        } else {
          console.warn("⚠️ AudioContext not created.");
          appendConsoleLine(t('consoleAudioError'), 'error');
        }
      } else {
        console.log("🔇 Sound toggled OFF.");
        appendConsoleLine(t('consoleAudioDisabled'), 'error');
      }
    });

    // Log initial audio system status
    setTimeout(() => {
      if (!window.AudioContext && !window.webkitAudioContext) {
        appendConsoleLine(t('consoleAudioError'), 'error');
      } else if (!synth.enabled) {
        appendConsoleLine(t('consoleAudioDisabled'), 'error');
      } else {
        appendConsoleLine(t('consoleAudioEnabled'), 'system');
      }
    }, 200);
  }
  
  // CRT visual effects toggler
  const crtBtn = document.getElementById('crt-btn');
  if (crtBtn) {
    // Apply initial state from persistence (default ON)
    const isCrtOn = localStorage.getItem('codequest_crt') !== 'false';
    if (isCrtOn) {
      document.body.classList.remove('crt-off');
    } else {
      document.body.classList.add('crt-off');
    }
    
    const updateCrtButtonText = () => {
      const active = !document.body.classList.contains('crt-off');
      crtBtn.title = t('titleCrt') + (active ? ' (ON)' : ' (OFF)');
      crtBtn.style.opacity = active ? '1' : '0.6';
    };
    window.updateCrtButtonText = updateCrtButtonText;
    updateCrtButtonText();
    
    crtBtn.addEventListener('click', () => {
      synth.play('click');
      document.body.classList.toggle('crt-off');
      const active = !document.body.classList.contains('crt-off');
      localStorage.setItem('codequest_crt', String(active));
      updateCrtButtonText();
    });
  }

  // Expert Mode toggler
  const expertBtn = document.getElementById('expert-btn');
  if (expertBtn) {
    // Apply initial state from persistence (default OFF)
    isExpertMode = localStorage.getItem('codequest_expert') === 'true';
    
    const updateExpertButtonText = () => {
      expertBtn.title = t('titleExpert') + (isExpertMode ? ' (ON)' : ' (OFF)');
      expertBtn.style.opacity = isExpertMode ? '1' : '0.6';
    };
    window.updateExpertButtonText = updateExpertButtonText;
    updateExpertButtonText();
    
    expertBtn.addEventListener('click', () => {
      synth.play('click');
      isExpertMode = !isExpertMode;
      localStorage.setItem('codequest_expert', String(isExpertMode));
      updateExpertButtonText();
      
      // Update tab layout and active mode
      const tabBlocks = document.getElementById('tab-blocks');
      const tabPython = document.getElementById('tab-python');
      if (tabBlocks && tabPython) {
        if (isExpertMode) {
          // Hide blocks tab
          tabBlocks.style.display = 'none';
          // Switch to Python mode if we are in blocks
          if (currentMode === 'blocks') {
            tabPython.click();
          }
        } else {
          // Show blocks tab (unless the level itself is pythonOnly)
          const level = LEVELS[currentLevelIndex];
          if (level && !level.pythonOnly) {
            tabBlocks.style.display = 'block';
          }
        }
      }
    });
  }

  // Level selector list listener
  const levelSelect = document.getElementById('level-select');
  if (levelSelect) {
    levelSelect.addEventListener('change', (e) => {
      synth.play('click');
      loadLevel(parseInt(e.target.value, 10));
    });
  }
  
  // Level navigation button listeners
  const prevBtn = document.getElementById('prev-level-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentLevelIndex > 0) {
        synth.play('click');
        loadLevel(currentLevelIndex - 1);
      } else {
        synth.play('error');
      }
    });
  }
  
  const nextBtn = document.getElementById('next-level-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentLevelIndex < LEVELS.length - 1) {
        synth.play('click');
        loadLevel(currentLevelIndex + 1);
      } else {
        synth.play('error');
      }
    });
  }

  // Success Modal navigation buttons
  const modalNextBtn = document.getElementById('modal-next-btn');
  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', () => {
      document.getElementById('success-modal').classList.add('hidden');
      if (currentLevelIndex < LEVELS.length - 1) {
        synth.play('click');
        loadLevel(currentLevelIndex + 1);
      } else {
        synth.play('win');
      }
    });
  }
  
  const modalRetryBtn = document.getElementById('modal-retry-btn');
  if (modalRetryBtn) {
    modalRetryBtn.addEventListener('click', () => {
      document.getElementById('success-modal').classList.add('hidden');
      synth.play('click');
      loadLevel(currentLevelIndex);
    });
  }

  // Help Modal listeners
  const helpBtn = document.getElementById('help-btn');
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      synth.play('click');
      document.getElementById('help-modal').classList.remove('hidden');
    });
  }
  
  const closeHelpBtn = document.getElementById('close-help-btn');
  if (closeHelpBtn) {
    closeHelpBtn.addEventListener('click', () => {
      synth.play('click');
      document.getElementById('help-modal').classList.add('hidden');
    });
  }

  // Export / Import game state triggers
  const exportBtn = document.getElementById('export-save-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => exportGameState());
  }
  
  const importBtn = document.getElementById('import-save-btn');
  const importFile = document.getElementById('import-save-file');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => {
      synth.play('click');
      importFile.click();
    });
    importFile.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        importGameState(e.target.files[0]);
      }
    });
  }

  // Reset progress listener
  const resetBtn = document.getElementById('reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const confirmMsg = currentLanguage === 'it'
        ? "Sei sicuro di voler cancellare TUTTI i tuoi progressi nel gioco? Questa azione non può essere annullata."
        : "Are you sure you want to reset ALL your achievements and code cache? This action cannot be undone.";
      
      if (confirm(confirmMsg)) {
        synth.play('error');
        localStorage.removeItem('codequest_completed');
        localStorage.removeItem('codequest_levels_code');
        localStorage.removeItem('codequest_current_level_idx');
        completedLevels = {};
        levelsCodeCache = {};
        currentLevelIndex = 0;
        
        loadProgress();
        refreshLevelSelector();
        updateHeartsDisplay();
        loadLevel(currentLevelIndex);
        
        appendConsoleLine("⚠️ " + (currentLanguage === 'it' ? "Progressi resettati!" : "Achievements reset!"), "error");
      }
    });
  }

  // Tab switcher listeners for Blocks / Code Editor Modes
  const tabBlocks = document.getElementById('tab-blocks');
  const tabPython = document.getElementById('tab-python');
  const blocklyContainer = document.getElementById('blockly-container');
  const editorContainer = document.getElementById('editor-container');
  const pyTextarea = document.getElementById('python-textarea');

  if (tabBlocks && tabPython && blocklyContainer && editorContainer && pyTextarea) {
    tabBlocks.addEventListener('click', () => {
      if (LEVELS[currentLevelIndex].pythonOnly) return;
      
      synth.play('click');
      clearHighlights();
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
      
      // Sync python text with blocks
      updateCodeOutput();
      
      // Resize workspace
      Blockly.svgResize(workspace);
    });

    tabPython.addEventListener('click', () => {
      synth.play('click');
      clearHighlights();
      currentMode = 'python';
      tabPython.classList.add('active');
      tabBlocks.classList.remove('active');
      blocklyContainer.classList.add('hidden');
      editorContainer.classList.remove('hidden');
      
      const lvlId = LEVELS[currentLevelIndex].id;
      if (!levelsCodeCache[lvlId]) {
        levelsCodeCache[lvlId] = { mode: 'blocks', blocksState: null, pythonCode: '' };
      }
      
      // Auto-populate python editor with generated code if empty or not customized by the user
      if (!levelsCodeCache[lvlId].isPythonDirty || pyTextarea.value.trim() === '') {
        const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
        let generatedPyCode = pyGen ? pyGen.workspaceToCode(workspace) : '';
        // Clean block_id parameters
        generatedPyCode = generatedPyCode.replace(/(?:,\s*)?block_id=['"][^'"]*['"]/g, '');
        pyTextarea.value = generatedPyCode;
        levelsCodeCache[lvlId].isPythonDirty = false; // Reset to clean
      }
      
      // Auto-save active tab change
      levelsCodeCache[lvlId].mode = 'python';
      levelsCodeCache[lvlId].pythonCode = pyTextarea.value;
      saveProgress();
      
      // Focus and update line numbers
      pyTextarea.focus();
      updateLineNumbers();
      updateCodeOutput();
    });
  }
  
  // Language Selector trigger
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      synth.play('click');
      const newLang = e.target.value;
      localStorage.setItem('codequest_lang', newLang);
      
      loadBlocklyLocale(newLang, () => {
        applyTranslations(newLang);
        refreshLevelSelector();
        updateHeartsDisplay();
        loadLevel(currentLevelIndex);
      });
    });
  }
  
  // Copy to clipboard helper
  const copyBtn = document.getElementById('copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      let code = '';
      if (currentMode === 'blocks') {
        const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
        code = pyGen ? pyGen.workspaceToCode(workspace) : '';
        code = code.replace(/(?:,\s*)?block_id=['"][^'"]*['"]/g, '');
      } else {
        code = pyTextarea.value;
      }
      
      navigator.clipboard.writeText(code).then(() => {
        synth.play('win');
        copyBtn.textContent = t('copied');
        setTimeout(() => {
          copyBtn.textContent = t('copy');
        }, 1500);
      }).catch(err => {
        synth.play('error');
        console.error("Failed to copy code: ", err);
      });
    });
  }
  
  // Textarea input event for line numbers and output highlights
  pyTextarea.addEventListener('input', () => {
    // Auto-save python code changes
    const lvlId = LEVELS[currentLevelIndex].id;
    if (!levelsCodeCache[lvlId]) {
      levelsCodeCache[lvlId] = { mode: 'blocks', blocksState: null, pythonCode: '' };
    }
    levelsCodeCache[lvlId].pythonCode = pyTextarea.value;
    levelsCodeCache[lvlId].mode = currentMode;
    
    // Mark if user has customized code (if empty, allow auto-generation again)
    if (pyTextarea.value.trim() === '') {
      levelsCodeCache[lvlId].isPythonDirty = false;
    } else {
      levelsCodeCache[lvlId].isPythonDirty = true;
    }
    
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

  // Handle clicking/tapping the trashcan icon to delete the currently selected block
  const handleTrashInteraction = (e) => {
    const trash = e.target.closest('.blocklyTrash');
    if (trash) {
      const selectedBlock = Blockly.common ? Blockly.common.getSelected() : Blockly.selected;
      if (selectedBlock) {
        if (typeof selectedBlock.checkAndDelete === 'function') {
          selectedBlock.checkAndDelete();
        } else if (typeof selectedBlock.dispose === 'function') {
          selectedBlock.dispose(true);
        }
        if (typeof synth !== 'undefined' && typeof synth.play === 'function') {
          synth.play('error');
        }
        e.stopPropagation();
        e.preventDefault();
      }
    }
  };
  document.addEventListener('pointerdown', handleTrashInteraction, true);
  document.addEventListener('mousedown', handleTrashInteraction, true);
  document.addEventListener('touchstart', handleTrashInteraction, true);
}

function initSimulator() {
  // We feed translated logging hooks to the simulator
  simulator = new GameSimulator('simulator-canvas', appendConsoleLine, playSynthSound);
  
  simulator.onActionStart = (action) => {
    highlightActiveElement(action.blockId, action.lineNumber);
  };

  simulator.onFinishedCallback = (success, reason) => {
    document.getElementById('run-btn').disabled = false;
    document.getElementById('step-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
    
    if (simulator) {
      simulator.actionQueue = [];
      simulator.currentActionIndex = 0;
    }
    
    clearHighlights();
    
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
    } else if (msg.startsWith("🗝️ GATE UNLOCKED!")) {
      appendConsoleLine(t('consoleGateUnlocked'), 'system');
    } else if (msg.startsWith("⚠️ Code is incorrect!")) {
      appendConsoleLine(t('consoleGateLocked'), 'error');
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
  
  let cleanName = nameText;
  if (nameText.includes(": ")) {
    cleanName = nameText.split(": ").slice(1).join(": ");
  }

  const questHeader = document.getElementById('dungeon-quest-header');
  if (questHeader) {
    questHeader.textContent = cleanName.toUpperCase();
  }
  const questTitle = document.getElementById('quest-title');
  if (questTitle) {
    questTitle.textContent = cleanName;
  }
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
  clearHighlights();
  
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
  
  if (level.pythonOnly || isExpertMode) {
    currentMode = 'python';
  } else {
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
    } else {
      currentMode = 'blocks';
    }
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

  // Restore or generate Python text editor content
  if (pyTextarea) {
    if (savedState && savedState.pythonCode) {
      pyTextarea.value = savedState.pythonCode;
    } else if (level.pythonOnly) {
      pyTextarea.value = '';
    } else {
      // Auto-generate clean Python code from initial Blockly workspace
      const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
      let generatedPyCode = pyGen ? pyGen.workspaceToCode(workspace) : '';
      generatedPyCode = generatedPyCode.replace(/(?:,\s*)?block_id=['"][^'"]*['"]/g, '');
      pyTextarea.value = generatedPyCode;
      
      // Save it in the cache too so it's persistent
      if (!levelsCodeCache[levelId]) {
        levelsCodeCache[levelId] = { mode: currentMode, blocksState: null, pythonCode: '' };
      }
      levelsCodeCache[levelId].pythonCode = pyTextarea.value;
    }
  }

  // Update Tab active UI
  if (tabBlocks && tabPython && blocklyContainer && editorContainer) {
    if (level.pythonOnly || isExpertMode) {
      tabBlocks.style.display = 'none';
      tabPython.classList.add('active');
      tabBlocks.classList.remove('active');
      blocklyContainer.classList.add('hidden');
      editorContainer.classList.remove('hidden');
    } else {
      tabBlocks.style.display = 'block';
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

function getLevelDisplayId(level) {
  if (level && level.id) {
    const match = level.id.match(/\/room(\d+)/);
    if (match) {
      return match[1];
    }
  }
  const idx = LEVELS.indexOf(level);
  return idx !== -1 ? String(idx + 1) : "";
}

function appendConsoleLine(text, styleClass) {
  const consoleEl = document.getElementById('terminal-console');
  if (!consoleEl) return;
  
  const line = document.createElement('div');
  line.className = `terminal-line ${styleClass || ''}`;
  line.textContent = text;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

async function runProgram() {
  const level = LEVELS[currentLevelIndex];
  let actionQueue = [];
  const runBtn = document.getElementById('run-btn');
  const stepBtn = document.getElementById('step-btn');
  
  if (level.runWithPyodide) {
    runBtn.disabled = true;
    stepBtn.disabled = true;
    try {
      const pyCode = currentMode === 'blocks'
        ? (Blockly.Python ? Blockly.Python.workspaceToCode(workspace) : '')
        : document.getElementById('python-textarea').value;
      actionQueue = await compileActionQueuePyodide(pyCode);
    } catch (err) {
      appendConsoleLine(`❌ Error: ${err.message}`, "error");
      runBtn.disabled = false;
      stepBtn.disabled = false;
      return;
    }
  } else {
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
    
    const validationError = validateLevelConstructs(level);
    if (validationError) {
      synth.play('error');
      appendConsoleLine(validationError, "error");
      return;
    }
    
    actionQueue = compileActionQueue(jsCode);
  }
  
  synth.play('click');
  document.getElementById('run-btn').disabled = true;
  document.getElementById('step-btn').disabled = true;
  document.getElementById('stop-btn').disabled = false;
  
  simulator.initLevel(level);
  simulator.loadActionQueue(actionQueue);
}

async function stepProgram() {
  const level = LEVELS[currentLevelIndex];
  const runBtn = document.getElementById('run-btn');
  const stepBtn = document.getElementById('step-btn');
  
  if (!simulator.isPlaying && simulator.actionQueue.length === 0) {
    let actionQueue = [];
    if (level.runWithPyodide) {
      runBtn.disabled = true;
      stepBtn.disabled = true;
      try {
        const pyCode = currentMode === 'blocks'
          ? (Blockly.Python ? Blockly.Python.workspaceToCode(workspace) : '')
          : document.getElementById('python-textarea').value;
        actionQueue = await compileActionQueuePyodide(pyCode);
      } catch (err) {
        appendConsoleLine(`❌ Error: ${err.message}`, "error");
        runBtn.disabled = false;
        stepBtn.disabled = false;
        return;
      }
      runBtn.disabled = false;
      stepBtn.disabled = false;
    } else {
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
      
      const validationError = validateLevelConstructs(level);
      if (validationError) {
        synth.play('error');
        appendConsoleLine(validationError, "error");
        return;
      }
      
      actionQueue = compileActionQueue(jsCode);
    }
    
    synth.play('click');
    simulator.initLevel(level);
    simulator.actionQueue = actionQueue;
    simulator.currentActionIndex = 0;
    simulator.isPlaying = false;
    appendConsoleLine(t('consoleStepMode'), "system");
  }
  
  simulator.executeNextAction();
}

function showSuccessModal() {
  const level = LEVELS[currentLevelIndex];
  let pyCode = '';
  if (currentMode === 'blocks') {
    const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
    pyCode = pyGen ? pyGen.workspaceToCode(workspace) : '';
    pyCode = pyCode.replace(/(?:,\s*)?block_id=['"][^'"]*['"]/g, '');
  } else {
    pyCode = document.getElementById('python-textarea').value;
  }
  
  const successText = currentLanguage === 'it'
    ? `Link ha sbloccato con successo la Stanza ${level.id} e ha ottenuto il frammento della Triforza!`
    : `Link successfully unlocked Room ${level.id} and secured the Triforce piece!`;
  
  document.getElementById('success-message').textContent = successText;
  document.getElementById('success-code-text').textContent = pyCode || 'No spells cast.';
  document.getElementById('success-modal').classList.remove('hidden');
}

// Text Editor line numbering helper
function updateLineNumbers(highlightLine = null) {
  const textarea = document.getElementById('python-textarea');
  const lineNumbers = document.getElementById('editor-line-numbers');
  if (!textarea || !lineNumbers) return;
  
  const linesCount = textarea.value.split('\n').length;
  lineNumbers.innerHTML = '';
  for (let i = 1; i <= linesCount; i++) {
    const lineEl = document.createElement('div');
    lineEl.className = 'line-num-item';
    if (i === highlightLine) {
      lineEl.classList.add('highlighted-line');
    }
    lineEl.textContent = i;
    lineNumbers.appendChild(lineEl);
  }
}

function highlightActiveElement(blockId, lineNumber) {
  console.log("🔦 highlightActiveElement. Mode:", currentMode, "blockId:", blockId, "lineNumber:", lineNumber);
  if (currentMode === 'blocks') {
    if (workspace && blockId) {
      console.log("   highlighting block:", blockId);
      workspace.highlightBlock(blockId);
    }
  } else {
    // Python mode
    updateLineNumbers(lineNumber);
    updateCodeOutput(lineNumber);
  }
}

function clearHighlights() {
  if (workspace) {
    workspace.highlightBlock(null);
  }
  updateLineNumbers(null);
  updateCodeOutput(null);
}
