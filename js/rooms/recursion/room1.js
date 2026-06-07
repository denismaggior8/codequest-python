const ROOM_RECURSION_1 = {
  id: "recursion/room1",
  name: {
    it: "Ricorsione stanza 1: Il Labirinto Ricorsivo",
    en: "Recursion room 1: Recursive Maze"
  },
  badge: "RECURSION",
  difficulty: "advanced",
  story: {
    it: "[Livello Avanzato - Prossimamente] Impara ad usare la ricorsione per risolvere dungeon complessi o labirinti.",
    en: "[Advanced Level - Coming Soon] Learn to use recursion to solve complex dungeons or mazes."
  },
  goalText: {
    it: "Scrivi una funzione ricorsiva per raggiungere la Forza.",
    en: "Write a recursive function to reach the Force."
  },
  tip: {
    it: "La ricorsione si verifica quando una funzione chiama se stessa all'interno del proprio corpo.",
    en: "Recursion happens when a function calls itself inside its own body."
  },
  docs: {
    it: [
      { code: "def navigate():", desc: "Definisce una funzione ricorsiva." }
    ],
    en: [
      { code: "def navigate():", desc: "Defines a recursive function." }
    ]
  },
  gridSize: 5,
  grid: [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 2, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ],
  startX: 1,
  startY: 2,
  startDir: 0,
  targetCrystals: 0,
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Commands",
        categorystyle: "procedure_category",
        contents: [
          { kind: "block", type: "move_forward" }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_RECURSION_1;
}
