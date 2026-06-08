const ROOM_RECURSION_1 = {
  id: "recursion/room1",
  name: {
    it: "Ricorsione stanza 1: Il Labirinto Ricorsivo",
    en: "Recursion room 1: Recursive Maze"
  },
  badge: "RECURSION",
  difficulty: "advanced",
  requireConditional: true,
  requireFunction: true,
  requireRecursion: true,
  story: {
    it: "Knil deve salire lungo un corridoio verticale per raggiungere il portale della Forza, raccogliendo un rubino in ogni stanza sul suo cammino. Crea una funzione ricorsiva (che chiama se stessa) per avanzare e raccogliere i rubini finché non rileva il portale davanti a sé.",
    en: "Knil must climb up a vertical corridor to reach the Force portal, collecting a ruby in each room along his path. Create a recursive function (one that calls itself) to move forward and collect the rubies until he detects the portal ahead of him."
  },
  goalText: {
    it: "Scrivi una funzione ricorsiva per raccogliere 3 rubini e raggiungere il portale della Forza.",
    en: "Write a recursive function to collect 3 rubies and reach the Force portal."
  },
  tip: {
    it: "Definisci una funzione ricorsiva (es. `solve()`). All'interno, usa un condizionale per controllare se davanti c'è il portale (`if hero.scan_ahead() == \"portal\"`). Se NON c'è, cammina in avanti, raccogli il rubino e chiama ricorsivamente `solve()`. Se c'è, fai semplicemente un passo avanti per completare la quest!",
    en: "Define a recursive function (e.g. `solve()`). Inside, use a conditional to check if the portal is ahead (`if hero.scan_ahead() == \"portal\"`). If it is NOT, walk forward, collect the ruby, and call `solve()` recursively. If it is, simply walk forward once to clear the room!"
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Cammina in avanti." },
      { code: "hero.collect_ruby()", desc: "Raccogli il rubino corrente." },
      { code: "hero.scan_ahead()", desc: "Controlla la casella di fronte. Restituisce 'portal' se c'è la Forza." },
      { code: "def solve():", desc: "Definisce una funzione personalizzata." },
      { code: "solve()", desc: "Chiama la funzione per eseguirla." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Walk forward." },
      { code: "hero.collect_ruby()", desc: "Collect the ruby on the current tile." },
      { code: "hero.scan_ahead()", desc: "Scan the tile directly ahead. Returns 'portal' if the gate is there." },
      { code: "def solve():", desc: "Defines a custom function." },
      { code: "solve()", desc: "Calls the function to execute it." }
    ]
  },
  gridSize: 7,
  grid: [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 2, 1, 1, 1], // y = 1 (portal)
    [1, 1, 1, 3, 1, 1, 1], // y = 2 (crystal)
    [1, 1, 1, 3, 1, 1, 1], // y = 3 (crystal)
    [1, 1, 1, 3, 1, 1, 1], // y = 4 (crystal)
    [1, 1, 1, 0, 1, 1, 1], // y = 5 (start)
    [1, 1, 1, 1, 1, 1, 1]
  ],
  startX: 3,
  startY: 5,
  startDir: 3, // UP
  targetCrystals: 3,
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Commands",
        categorystyle: "procedure_category",
        contents: [
          { kind: "block", type: "move_forward" },
          { kind: "block", type: "collect_ruby" },
          { kind: "block", type: "scan_ahead" }
        ]
      },
      {
        kind: "category",
        name: "Functions",
        categorystyle: "procedure_category",
        custom: "PROCEDURE"
      },
      {
        kind: "category",
        name: "Logic",
        categorystyle: "logic_category",
        contents: [
          {
            kind: "block",
            type: "controls_if",
            inputs: {
              IF0: {
                shadow: {
                  type: "logic_compare"
                }
              }
            }
          },
          {
            kind: "block",
            type: "logic_compare",
            inputs: {
              A: {
                shadow: {
                  type: "scan_ahead"
                }
              },
              B: {
                shadow: {
                  type: "text",
                  fields: { TEXT: "portal" }
                }
              }
            }
          },
          {
            kind: "block",
            type: "text",
            fields: { TEXT: "portal" }
          }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_RECURSION_1;
}
