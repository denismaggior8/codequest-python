const ROOM_VARIABLES_1 = {
  id: "variables/room1",
  name: {
    it: "Variabili stanza 1: La Grotta dei Rubini",
    en: "Variables room 1: The Ruby Caves"
  },
  badge: "VARIABLES",
  difficulty: "base",
  story: {
    it: "Il cancello della Forza è sigillato! Knil deve raccogliere 2 rubini luccicanti, registrarli in una variabile chiamata 'rubies' e stampare il conteggio per aprire il passaggio.",
    en: "The Force gate is sealed! Knil must collect 2 shiny rubies, record them in a variable named 'rubies', and print the count to open the path."
  },
  goalText: {
    it: "Raccogli entrambi i rubini, aumenta la variabile 'rubies' per ciascuno, stampa il valore finale con print() ed entra nel portale della Forza.",
    en: "Collect both rubies, increment the 'rubies' variable, print its value, and enter the Force gate."
  },
  tip: {
    it: "Una variabile è come uno scrigno in cui salvare valori. In Python, 'rubies = 0' crea una variabile per tracciare il conteggio. 'print(rubies)' mostra il valore nel registro del dungeon.",
    en: "A variable is like a chest to store values. In Python, 'rubies = 0' creates a variable to track our count. 'print(rubies)' shows its value in the dungeon log console."
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Fai camminare Knil in avanti." },
      { code: "hero.collect_ruby()", desc: "Raccogli il rubino sulla casella corrente." },
      { code: "rubies = 0", desc: "Inizializza una variabile 'rubies' col valore 0." },
      { code: "rubies = rubies + 1", desc: "Aggiungi 1 al valore della variabile dei rubini." },
      { code: "print(rubies)", desc: "Stampa il conteggio dei rubini a schermo." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Make Knil walk forward." },
      { code: "hero.collect_ruby()", desc: "Collect the ruby on the current tile." },
      { code: "rubies = 0", desc: "Initialize 'rubies' variable with value 0." },
      { code: "rubies = rubies + 1", desc: "Add 1 to the current value of the rubies variable." },
      { code: "print(rubies)", desc: "Print the ruby count into the log console." }
    ]
  },
  gridSize: 6,
  grid: [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 0, 3, 3, 2, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1]
  ],
  startX: 1,
  startY: 2,
  startDir: 0,
  targetCrystals: 2,
  requirePrint: true,
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Commands",
        categorystyle: "procedure_category",
        contents: [
          { kind: "block", type: "move_forward" },
          { kind: "block", type: "collect_ruby" }
        ]
      },
      {
        kind: "category",
        name: "Variables",
        categorystyle: "variable_category",
        custom: "VARIABLE"
      },
      {
        kind: "category",
        name: "Logs Console",
        categorystyle: "text_category",
        contents: [
          { kind: "block", type: "text_print" },
          { kind: "block", type: "variables_get", fields: { VAR: { id: "rubies", name: "rubies" } } }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_VARIABLES_1;
}
