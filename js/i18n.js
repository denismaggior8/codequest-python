// Code quest - i18n Translation Dictionary (IT/EN)

const TRANSLATIONS = {
  it: {
    // Header
    logoSub: "A 2D #HeroAsCode adventure",
    heartsTitle: "Cuori Guadagnati",
    resetQuest: "RESETTA QUEST",
    exportSaveText: "SALVA PARTITA",
    importSaveText: "CARICA PARTITA",

    // Panels
    dungeonQuest: "QUEST DEL DUNGEON",
    missionTitle: "MISSIONE:",
    dungeonMap: "MAPPA DEL DUNGEON",
    dungeonLog: "REGISTRO DUNGEON",
    spellBook: "LIBRO INCANTESIMI",
    pythonScroll: "PERGAMENA PYTHON",
    pythonScrollWisdom: "SAGGEZZA DELLA PERGAMENA",
    availableCommands: "INCANTESIMI DISPONIBILI",

    // Playback Controls
    run: "AVVIA",
    stop: "FERMA",
    step: "PASSO",
    speed: "VELOCITÀ:",
    copy: "COPIA",
    copied: "COPIATO!",
    crtOn: "📺 CRT ACCESO",
    crtOff: "📺 CRT SPENTO",
    expertOn: "🧠 ESPERTO: ON",
    expertOff: "🧠 ESPERTO: OFF",
    titleSound: "Attiva/Disattiva Audio",
    titleCrt: "Effetto CRT (ON/OFF)",
    titleExpert: "Modalità Esperto (ON/OFF)",
    titleHelp: "Come Giocare",
    titleSave: "Salva Partita",
    titleLoad: "Carica Partita",
    titleReset: "Resetta Progressi Quest",

    // Tooltips & Default texts
    dragSpells: "# Trascina i blocchi per generare codice Python!",
    spellTipHeader: "SUGGERIMENTO SPELL",
    consoleAudioEnabled: "🔊 Sistema Audio: Inizializzato (Attivo).",
    consoleAudioDisabled: "🔇 Sistema Audio: Disattivato (Muto). Clicca sull'altoparlante in alto per attivarlo!",
    consoleAudioError: "⚠️ Sistema Audio: Errore o non supportato in questo browser.",

    // Modals - Success
    modalCleared: "DUNGEON COMPLETATO!",
    modalBadge: "💚 FRAMMENTO DI FORZA OTTENUTO",
    modalCodeHeader: "HAI LANCIATO QUESTO INCANTESIMO PYTHON:",
    modalReplay: "RIGIOCA",
    modalNext: "PROSSIMA STANZA >",

    // Modals - Help
    helpTitle: "COME GIOCARE",
    helpClose: "ENTRA NEL DUNGEON!",
    helpParagraph1: "Benvenuto su <strong>Code quest</strong>! La tua missione è guidare <strong>Knil</strong> attraverso dungeon di pietra usando blocchi di codice visuale.",
    helpStep1: "<strong>Trascina e Rilascia Incantesimi</strong>: Sposta i blocchi di codice dal toolbox nel <em>Libro Incantesimi</em> al tuo spazio di lavoro.",
    helpStep2: "<strong>Guarda la Pergamena Python</strong>: Osserva la colonna a destra. Genera codice Python reale basato sui tuoi blocchi.",
    helpStep3: "<strong>Avvia la Simulazione</strong>: Clicca su <strong class='pixel-text-green'>AVVIA</strong> per eseguire il codice. Knil camminerà passo dopo passo seguendo i tuoi blocchi.",
    helpStep4: "<strong>Leggi il Registro Dungeon</strong>: Se usi il blocco <code>print()</code>, i risultati appariranno nel registro in basso a sinistra.",
    helpStep5: "<strong>Completa la Missione</strong>: Raggiungi l'obiettivo della stanza (raccogliere rubini, evitare ostacoli) per sbloccare la Forza d'oro e avanzare!",

    // Console status lines
    consoleInit: "Caricamento quest Forza...",
    consoleCompass: "La bussola punta a Nord.",
    consoleEnter: "Knil è entrato nella stanza del dungeon...",
    consoleMove: "⚔️ hero.move_forward() -> Coordinate Dungeon ({x}, {y})",
    consoleTurn: "⚔️ hero.turn_{dir}() -> Orientato a {name}",
    consoleRubyAcquired: "💎 Rubino ottenuto! Rubini totali: {count}",
    consoleRubyWarn: "⚠️ hero.collect_ruby() -> Attenzione: Nessun rubino su questa casella.",
    consoleWin: "🗝️ LA FORZA RISPLENDE! Stanza del dungeon completata.",
    consoleRubySeal: "⚠️ Il portale della Forza è sigillato. Raccogli tutti i rubini! ({count}/{target})",
    consolePrintSeal: "⚠️ Quasi fatta, ma non hai eseguito il print() del conteggio dei rubini!",
    consoleFinishIncomplete: "🧭 Knil ha finito i movimenti ma non ha raggiunto il portale della Forza.",
    consoleErrorEmpty: "⚠️ Errore: Il libro degli incantesimi è vuoto!",
    consoleErrorNoStart: "⚠️ Errore: Il codice deve essere inserito dentro 'def on_start():'!",
    consoleErrorRequireConditional: "⚠️ Errore: Per risolvere questo livello, devi utilizzare un costrutto condizionale 'if'.",
    consoleErrorRequireLoop: "⚠️ Errore: Per risolvere questo livello, devi utilizzare un ciclo 'for'.",
    consoleErrorRequireFunction: "⚠️ Errore: Per risolvere questo livello, devi definire una funzione ('def').",
    consoleStepMode: "🏁 Modalità passo attivo.",
    consoleCrash: "💥 OUCH! Knil ha urtato un muro di pietra. Stanza bloccata.",
    consoleSystemStart: "Sistema inizializzato in {name}...",
    consoleGateUnlocked: "🗝️ PORTALE SBLOCCATO! La porta di ferro si apre.",
    consoleGateLocked: "⚠️ Codice non corretto! La porta rimane sigillata.",

    // Levels/Blocks UI labels
    roomBadge: "STANZA {id}: {badge}",
    objectiveLabel: "🎯 OBIETTIVO:",
    difficulty_base: "Livello Base",
    difficulty_intermediate: "Livello Intermedio",
    difficulty_advanced: "Livello Avanzato",
    presetAll: "Tutti i Livelli",
    presetBase: "Livello Base",
    presetIntermediate: "Livello Intermedio",
    presetAdvanced: "Livello Avanzato",
    consoleSimStopped: "Simulazione interrotta.",
    confirmResetProgress: "Sei sicuro di voler cancellare TUTTI i tuoi progressi nel gioco? Questa azione non può essere annullata.",
    consoleResetSuccess: "Progressi resettati!",
    successUnlockedRoom: "Knil ha sbloccato con successo la Stanza {id} e ha ottenuto il frammento della Forza!",
    presetCompletedHeader: "QUEST COMPLETATA!",
    presetCompletedBadge: "🏆 PRESET COMPLETATO!",
    presetCompletedMessage: "Congratulazioni! Hai sbloccato tutti i frammenti della Forza e completato tutti gli argomenti di questo preset! La pace è tornata nel Regno di Python.",
    noSpellsCast: "Nessun incantesimo lanciato."
  },
  en: {
    // Header
    logoSub: "A 2D #HeroAsCode adventure",
    heartsTitle: "Hearts Earned",
    resetQuest: "RESET QUEST",
    exportSaveText: "SAVE GAME",
    importSaveText: "LOAD GAME",

    // Panels
    dungeonQuest: "DUNGEON QUEST",
    missionTitle: "MISSION:",
    dungeonMap: "DUNGEON MAP",
    dungeonLog: "DUNGEON LOG",
    spellBook: "SPELL BOOK",
    pythonScroll: "PYTHON SCROLL",
    pythonScrollWisdom: "PYTHON SCROLL WISDOM",
    availableCommands: "AVAILABLE SPELLS",

    // Playback Controls
    run: "RUN",
    stop: "STOP",
    step: "STEP",
    speed: "SPEED:",
    copy: "COPY",
    copied: "COPIED!",
    crtOn: "📺 CRT ON",
    crtOff: "📺 CRT OFF",
    expertOn: "🧠 EXPERT: ON",
    expertOff: "🧠 EXPERT: OFF",
    titleSound: "Toggle Sound",
    titleCrt: "CRT Effect (ON/OFF)",
    titleExpert: "Expert Mode (ON/OFF)",
    titleHelp: "How to Play",
    titleSave: "Save Game",
    titleLoad: "Load Game",
    titleReset: "Reset Quest Progress",

    // Tooltips & Default texts
    dragSpells: "# Drag blocks to write spells and generate Python code!",
    spellTipHeader: "PYTHON SCROLL WISDOM",
    consoleAudioEnabled: "🔊 Audio System: Initialized (Active).",
    consoleAudioDisabled: "🔇 Audio System: Disabled (Muted). Click the speaker icon at the top to enable!",
    consoleAudioError: "⚠️ Audio System: Error or not supported in this browser.",

    // Modals - Success
    modalCleared: "DUNGEON CLEARED!",
    modalBadge: "💚 FORCE PIECE SECURED",
    modalCodeHeader: "YOU CAST THIS PYTHON SPELL:",
    modalReplay: "REPLAY",
    modalNext: "NEXT ROOM >",

    // Modals - Help
    helpTitle: "HOW TO PLAY",
    helpClose: "ENTER DUNGEON!",
    helpParagraph1: "Welcome to <strong>Code quest</strong>! Your mission is to help <strong>Knil</strong> navigate stone dungeons using visual code blocks.",
    helpStep1: "<strong>Drag & Drop Spells</strong>: Move coding blocks from the toolbox in the <em>Spell Book</em> into the workspace.",
    helpStep2: "<strong>Watch Python Generate</strong>: Observe the <em>Python Scroll</em> column. It generates real-time Python code based on your blocks.",
    helpStep3: "<strong>Run the Simulation</strong>: Click <strong class='pixel-text-green'>RUN</strong> to execute your code. Knil will walk step-by-step according to your blocks.",
    helpStep4: "<strong>Read Dungeon Logs</strong>: If you use the <code>print()</code> block, the output will appear in the <em>Dungeon Log</em>.",
    helpStep5: "<strong>Solve the Goal</strong>: Complete the objective listed in the <em>Dungeon Quest</em> (collecting rubies, dodging spike traps) to unlock the gold Force warp portal!",

    // Console status lines
    consoleInit: "Force Quest loaded...",
    consoleCompass: "Compass is pointing North.",
    consoleEnter: "Knil has entered the dungeon room...",
    consoleMove: "⚔️ hero.move_forward() -> Dungeon Coordinates ({x}, {y})",
    consoleTurn: "⚔️ hero.turn_{dir}() -> Facing {name}",
    consoleRubyAcquired: "💎 Ruby acquired! Total rubies: {count}",
    consoleRubyWarn: "⚠️ hero.collect_ruby() -> Warning: No rubies found on this tile.",
    consoleWin: "🗝️ THE FORCE SHINES! Dungeon room solved.",
    consoleRubySeal: "⚠️ The Force gate is sealed. Collect all rubies! ({count}/{target})",
    consolePrintSeal: "⚠️ Almost cleared, but you did not print() the ruby count!",
    consoleFinishIncomplete: "🧭 Knil finished movements but did not reach the Force Gate.",
    consoleErrorEmpty: "⚠️ Error: Spell book is empty!",
    consoleErrorNoStart: "⚠️ Error: All commands must be placed inside 'def on_start():'!",
    consoleErrorRequireConditional: "⚠️ Error: To solve this level, you must use an 'if' conditional construct.",
    consoleErrorRequireLoop: "⚠️ Error: To solve this level, you must use a 'for' loop construct.",
    consoleErrorRequireFunction: "⚠️ Error: To solve this level, you must define a custom function ('def').",
    consoleStepMode: "🏁 Spell stepping mode active.",
    consoleCrash: "💥 OOF! Knil collided with a stone wall boundary. Sector locked.",
    consoleSystemStart: "System initialized in {name}...",
    consoleGateUnlocked: "🗝️ GATE UNLOCKED! The iron gate opens.",
    consoleGateLocked: "⚠️ Code is incorrect! The gate remains sealed.",

    // Levels/Blocks UI labels
    roomBadge: "ROOM {id}: {badge}",
    objectiveLabel: "🎯 MISSION:",
    difficulty_base: "Basic Level",
    difficulty_intermediate: "Intermediate Level",
    difficulty_advanced: "Advanced Level",
    presetAll: "All Levels",
    presetBase: "Basic Level",
    presetIntermediate: "Intermediate Level",
    presetAdvanced: "Advanced Level",
    consoleSimStopped: "Simulation stopped.",
    confirmResetProgress: "Are you sure you want to reset ALL your achievements and code cache? This action cannot be undone.",
    consoleResetSuccess: "Achievements reset!",
    successUnlockedRoom: "Knil successfully unlocked Room {id} and secured the Force piece!",
    presetCompletedHeader: "QUEST COMPLETED!",
    presetCompletedBadge: "🏆 PRESET COMPLETED!",
    presetCompletedMessage: "Congratulations! You have unlocked all Force pieces and completed all topics in this preset! Peace has returned to the Python Kingdom.",
    noSpellsCast: "No spells cast."
  }
};

let currentLanguage = 'it'; // Default language

function applyTranslations(lang) {
  currentLanguage = lang || 'it';
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['it'];

  // Find all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // If it is a textarea/input or button with specific fields, we handle it
      if (el.tagName === 'INPUT' && el.type === 'button') {
        el.value = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // Translate title tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) {
      el.setAttribute('title', dict[key]);
    }
  });

  // Apply document title
  document.title = currentLanguage === 'it'
    ? "Code quest, an #HeroAsCode adventure"
    : "Code quest, an #HeroAsCode adventure";

  // Update Sound button label based on active language
  if (typeof updateSoundButtonText === 'function') {
    updateSoundButtonText();
  }
  // Update CRT button label based on active language
  if (typeof updateCrtButtonText === 'function') {
    updateCrtButtonText();
  }
  // Update Expert button label based on active language
  if (typeof updateExpertButtonText === 'function') {
    updateExpertButtonText();
  }
}

// Translation interpolation helper
function t(key, replacements = {}) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['it'];
  let text = dict[key] || TRANSLATIONS['en'][key] || key;
  for (const placeholder in replacements) {
    text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
  }
  return text;
}

