// The Legend of Python - Save Management and Persistence

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
  let progressStr = null;
  try {
    progressStr = localStorage.getItem('codequest_completed');
  } catch (e) {
    console.error("Failed to read codequest_completed from localStorage:", e);
  }
  if (progressStr) {
    try {
      completedLevels = JSON.parse(progressStr) || {};
      console.log("📂 loadProgress parsed completedLevels:", completedLevels);
    } catch (e) {
      console.error("Failed to parse codequest_completed JSON:", e);
      completedLevels = {};
    }
  } else {
    completedLevels = {};
  }
  
  let savedCodeStr = null;
  try {
    savedCodeStr = localStorage.getItem('codequest_levels_code');
  } catch (e) {
    console.error("Failed to read codequest_levels_code from localStorage:", e);
  }
  if (savedCodeStr) {
    try {
      levelsCodeCache = JSON.parse(savedCodeStr) || {};
    } catch (e) {
      console.error("Failed to parse codequest_levels_code JSON:", e);
      levelsCodeCache = {};
    }
  } else {
    levelsCodeCache = {};
  }
  
  let savedLvlIdx = null;
  try {
    savedLvlIdx = localStorage.getItem('codequest_current_level_idx');
  } catch (e) {
    console.error("Failed to read codequest_current_level_idx from localStorage:", e);
  }
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

function getActivePresetIndices() {
  const activePreset = typeof localStorage !== 'undefined' ? localStorage.getItem('codequest_preset') || 'all' : 'all';
  if (activePreset === 'all') {
    return LEVELS.map((_, idx) => idx);
  }
  
  const presetsObj = (typeof LEVELS !== 'undefined' && LEVELS.PRESETS) || (typeof window !== 'undefined' && window.PRESETS) || (typeof PRESETS !== 'undefined' ? PRESETS : {});
  const presetRoomIds = presetsObj[activePreset] || [];
  const indices = [];
  LEVELS.forEach((lvl, index) => {
    if (lvl && presetRoomIds.includes(lvl.id)) {
      indices.push(index);
    }
  });
  return indices;
}
window.getActivePresetIndices = getActivePresetIndices;

// Refresh checkmarks
function refreshLevelSelector() {
  const levelSelect = document.getElementById('level-select');
  if (!levelSelect) return;
  
  levelSelect.innerHTML = '';
  
  // Get indices of levels in the active preset
  const activePresetIndices = getActivePresetIndices();
  
  // Group levels in the active preset by difficulty
  const groups = {};
  activePresetIndices.forEach((index) => {
    const lvl = LEVELS[index];
    if (!lvl) return;
    
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
  const hasCurrentOption = Array.from(levelSelect.options).some(opt => parseInt(opt.value, 10) === currentLevelIndex);
  if (hasCurrentOption) {
    levelSelect.value = currentLevelIndex;
  } else if (levelSelect.options.length > 0) {
    // Current level is not in the preset, switch to the first level in this preset
    const firstLvlIndex = parseInt(levelSelect.options[0].value, 10);
    currentLevelIndex = firstLvlIndex;
    levelSelect.value = firstLvlIndex;
  }
  
  updateHeartsDisplay();
}

function updateHeartsDisplay() {
  const display = document.getElementById('hearts-display');
  if (!display) return;
  
  // Get active preset levels
  const activePresetIndices = getActivePresetIndices();
  const activeLevels = activePresetIndices.map(idx => LEVELS[idx]);
  
  // Group active levels by topic (badge) in order of appearance
  const topics = [];
  activeLevels.forEach(lvl => {
    if (lvl && !topics.includes(lvl.badge)) {
      topics.push(lvl.badge);
    }
  });
  
  let completedTopicsCount = 0;
  let heartsStr = "";
  
  topics.forEach(topic => {
    const topicLevels = activeLevels.filter(lvl => lvl.badge === topic);
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
