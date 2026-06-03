// The Legend of Python - i18n Translation Dictionary (IT/EN)

const TRANSLATIONS = {
  it: {
    // Header
    logoSub: "EDIZIONE ZELDA",
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
    
    // Tooltips & Default texts
    dragSpells: "# Trascina i blocchi per generare codice Python!",
    spellTipHeader: "SUGGERIMENTO SPELL",
    
    // Modals - Success
    modalCleared: "DUNGEON COMPLETATO!",
    modalBadge: "💚 FRAMMENTO DI TRIFORZA OTTENUTO",
    modalCodeHeader: "HAI LANCIATO QUESTO INCANTESIMO PYTHON:",
    modalReplay: "RIGIOCA",
    modalNext: "PROSSIMA STANZA >",
    
    // Modals - Help
    helpTitle: "COME GIOCARE",
    helpClose: "ENTRA NEL DUNGEON!",
    helpParagraph1: "Benvenuto su <strong>The Legend of Python</strong>! La tua missione è guidare <strong>Link</strong> attraverso dungeon di pietra usando blocchi di codice visuale.",
    helpStep1: "<strong>Trascina e Rilascia Incantesimi</strong>: Sposta i blocchi di codice dal toolbox nel <em>Libro Incantesimi</em> al tuo spazio di lavoro.",
    helpStep2: "<strong>Guarda la Pergamena Python</strong>: Osserva la colonna a destra. Genera codice Python reale basato sui tuoi blocchi.",
    helpStep3: "<strong>Avvia la Simulazione</strong>: Clicca su <strong class='pixel-text-green'>AVVIA</strong> per eseguire il codice. Link camminerà passo dopo passo seguendo i tuoi blocchi.",
    helpStep4: "<strong>Leggi il Registro Dungeon</strong>: Se usi il blocco <code>print()</code>, i risultati appariranno nel registro in basso a sinistra.",
    helpStep5: "<strong>Completa la Missione</strong>: Raggiungi l'obiettivo della stanza (raccogliere rupie, evitare ostacoli) per sbloccare la Triforza d'oro e avanzare!",
    
    // Console status lines
    consoleInit: "Caricamento quest Triforza...",
    consoleCompass: "La bussola punta a Nord.",
    consoleEnter: "Link è entrato nella stanza del dungeon...",
    consoleMove: "⚔️ hero.move_forward() -> Coordinate Dungeon ({x}, {y})",
    consoleTurn: "⚔️ hero.turn_{dir}() -> Orientato a {name}",
    consoleRupeeAcquired: "💎 Rupia ottenuta! Rupie totali: {count}",
    consoleRupeeWarn: "⚠️ hero.collect_rupee() -> Attenzione: Nessuna rupia su questa casella.",
    consoleWin: "🗝️ LA TRIFORZA RISPLENDE! Stanza del dungeon completata.",
    consoleRupeeSeal: "⚠️ Il portale della Triforza è sigillato. Raccogli tutte le rupie! ({count}/{target})",
    consolePrintSeal: "⚠️ Quasi fatta, ma non hai eseguito il print() del conteggio delle rupie!",
    consoleFinishIncomplete: "🧭 Link ha finito i movimenti ma non ha raggiunto il portale della Triforza.",
    consoleErrorEmpty: "⚠️ Errore: Il libro degli incantesimi è vuoto!",
    consoleErrorNoStart: "⚠️ Errore: Il codice deve essere inserito dentro 'def on_start():'!",
    consoleErrorRequireConditional: "⚠️ Errore: Per risolvere questo livello, devi utilizzare un costrutto condizionale 'if'.",
    consoleErrorRequireLoop: "⚠️ Errore: Per risolvere questo livello, devi utilizzare un ciclo 'for'.",
    consoleErrorRequireFunction: "⚠️ Errore: Per risolvere questo livello, devi definire una funzione ('def').",
    consoleStepMode: "🏁 Modalità passo attivo.",
    consoleCrash: "💥 OUCH! Link ha urtato un muro di pietra. Stanza bloccata.",
    consoleSystemStart: "Sistema inizializzato in {name}...",
    
    // Levels/Blocks UI labels
    roomBadge: "STANZA {id}: {badge}",
    objectiveLabel: "🎯 OBIETTIVO:",
    difficulty_base: "Livello Base",
    difficulty_intermediate: "Livello Intermedio",
    difficulty_advanced: "Livello Avanzato"
  },
  en: {
    // Header
    logoSub: "ZELDA EDITION",
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
    
    // Tooltips & Default texts
    dragSpells: "# Drag blocks to write spells and generate Python code!",
    spellTipHeader: "PYTHON SCROLL WISDOM",
    
    // Modals - Success
    modalCleared: "DUNGEON CLEARED!",
    modalBadge: "💚 TRIFORCE PIECE SECURED",
    modalCodeHeader: "YOU CAST THIS PYTHON SPELL:",
    modalReplay: "REPLAY",
    modalNext: "NEXT ROOM >",
    
    // Modals - Help
    helpTitle: "HOW TO PLAY",
    helpClose: "ENTER DUNGEON!",
    helpParagraph1: "Welcome to <strong>The Legend of Python</strong>! Your mission is to help <strong>Link</strong> navigate stone dungeons using visual code blocks.",
    helpStep1: "<strong>Drag & Drop Spells</strong>: Move coding blocks from the toolbox in the <em>Spell Book</em> into the workspace.",
    helpStep2: "<strong>Watch Python Generate</strong>: Observe the <em>Python Scroll</em> column. It generates real-time Python code based on your blocks.",
    helpStep3: "<strong>Run the Simulation</strong>: Click <strong class='pixel-text-green'>RUN</strong> to execute your code. Link will walk step-by-step according to your blocks.",
    helpStep4: "<strong>Read Dungeon Logs</strong>: If you use the <code>print()</code> block, the output will appear in the <em>Dungeon Log</em>.",
    helpStep5: "<strong>Solve the Goal</strong>: Complete the objective listed in the <em>Dungeon Quest</em> (collecting rupees, dodging spike traps) to unlock the gold Triforce warp portal!",
    
    // Console status lines
    consoleInit: "Triforce Quest loaded...",
    consoleCompass: "Compass is pointing North.",
    consoleEnter: "Link has entered the dungeon room...",
    consoleMove: "⚔️ hero.move_forward() -> Dungeon Coordinates ({x}, {y})",
    consoleTurn: "⚔️ hero.turn_{dir}() -> Facing {name}",
    consoleRupeeAcquired: "💎 Rupee acquired! Total rupees: {count}",
    consoleRupeeWarn: "⚠️ hero.collect_rupee() -> Warning: No rupees found on this tile.",
    consoleWin: "🗝️ THE TRIFORCE SHINES! Dungeon room solved.",
    consoleRupeeSeal: "⚠️ The Triforce gate is sealed. Collect all rupees! ({count}/{target})",
    consolePrintSeal: "⚠️ Almost cleared, but you did not print() the rupee count!",
    consoleFinishIncomplete: "🧭 Link finished movements but did not reach the Triforce Gate.",
    consoleErrorEmpty: "⚠️ Error: Spell book is empty!",
    consoleErrorNoStart: "⚠️ Error: All commands must be placed inside 'def on_start():'!",
    consoleErrorRequireConditional: "⚠️ Error: To solve this level, you must use an 'if' conditional construct.",
    consoleErrorRequireLoop: "⚠️ Error: To solve this level, you must use a 'for' loop construct.",
    consoleErrorRequireFunction: "⚠️ Error: To solve this level, you must define a custom function ('def').",
    consoleStepMode: "🏁 Spell stepping mode active.",
    consoleCrash: "💥 OOF! Link collided with a stone wall boundary. Sector locked.",
    consoleSystemStart: "System initialized in {name}...",
    
    // Levels/Blocks UI labels
    roomBadge: "ROOM {id}: {badge}",
    objectiveLabel: "🎯 MISSION:",
    difficulty_base: "Basic Level",
    difficulty_intermediate: "Intermediate Level",
    difficulty_advanced: "Advanced Level"
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
  
  // Apply document title
  document.title = currentLanguage === 'it' 
    ? "The Legend of Python - Impara a programmare in un dungeon 2D a 8 bit"
    : "The Legend of Python - Learn programming in a 2D 8-bit dungeon";

  // Update CRT button label based on active language
  if (typeof updateCrtButtonText === 'function') {
    updateCrtButtonText();
  }
}
