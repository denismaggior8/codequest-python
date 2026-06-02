const ROOM_VARIABLES_1 = {
  id: "variables/room1",
  name: {
    it: "Stanza 2: La Grotta delle Rupie",
    en: "Room 2: The Rupee Caves"
  },
  badge: "VARIABLES",
  difficulty: "base",
  story: {
    it: "Il cancello della Triforza è sigillato! Link deve raccogliere 2 Rupie luccicanti, registrarle in una variabile chiamata 'rupees' e stampare il conteggio per aprire il passaggio.",
    en: "The Triforce gate is sealed! Link must collect 2 shiny Rupees, record them in a variable named 'rupees', and print the count to open the path."
  },
  goalText: {
    it: "Raccogli entrambe le rupie, aumenta la variabile 'rupees' per ciascuna, stampa il valore finale con print() ed entra nel portale della Triforza.",
    en: "Collect both rupees, increment the 'rupees' variable, print its value, and enter the Triforce gate."
  },
  tip: {
    it: "Una variabile è come uno scrigno in cui salvare valori. In Python, 'rupees = 0' crea una variabile per tracciare il conteggio. 'print(rupees)' mostra il valore nel registro del dungeon.",
    en: "A variable is like a chest to store values. In Python, 'rupees = 0' creates a variable to track our count. 'print(rupees)' shows its value in the dungeon log console."
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Fai camminare Link in avanti." },
      { code: "hero.collect_rupee()", desc: "Raccogli la rupia sulla casella corrente." },
      { code: "rupees = 0", desc: "Inizializza una variabile 'rupees' col valore 0." },
      { code: "rupees = rupees + 1", desc: "Aggiungi 1 al valore della variabile delle rupie." },
      { code: "print(rupees)", desc: "Stampa il conteggio delle rupie a schermo." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Make Link walk forward." },
      { code: "hero.collect_rupee()", desc: "Collect the rupee on the current tile." },
      { code: "rupees = 0", desc: "Initialize 'rupees' variable with value 0." },
      { code: "rupees = rupees + 1", desc: "Add 1 to the current value of the rupees variable." },
      { code: "print(rupees)", desc: "Print the rupee count into the log console." }
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
          { kind: "block", type: "collect_rupee" }
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
          { kind: "block", type: "variables_get", fields: { VAR: { id: "rupees", name: "rupees" } } }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_VARIABLES_1;
}
