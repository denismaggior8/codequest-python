const ROOM_4 = {
  id: 4,
  name: {
    it: "Stanza 4: La Caverna delle Rupie",
    en: "Room 4: The Rupee Vault"
  },
  badge: "LOOPS",
  difficulty: "base",
  story: {
    it: "Davanti a te c'è un lungo corridoio pieno di rupie verdi! Evita di riempire il tuo libro degli incantesimi con istruzioni ripetitive. Usa un ciclo 'for' per ripetere i movimenti e la raccolta.",
    en: "A long hallway of sparkling green Rupees is ahead! Avoid cluttering your spell book with redundant actions. Use a 'for' loop to repeat the step-and-collect actions."
  },
  goalText: {
    it: "Usa un blocco ciclo per raccogliere tutte e 4 le rupie in fila ed entra nel portale della Triforza.",
    en: "Use a loop block to collect all 4 rupees in a row, then enter the Triforce gate."
  },
  tip: {
    it: "I cicli ripetono le azioni. In Python, 'for i in range(4):' esegue le istruzioni 4 volte. Questo rende il tuo codice più pulito ed evita le ripetizioni inutili.",
    en: "Loops repeat actions. In Python, 'for i in range(4):' runs instructions 4 times. This is vital to keep your code clean and dry (Don't Repeat Yourself)."
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Cammina in avanti." },
      { code: "hero.collect_rupee()", desc: "Raccogli la rupia corrente." },
      { code: "for i in range(4):", desc: "Ripete tutti i comandi indentati sotto per 4 volte." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Walk forward." },
      { code: "hero.collect_rupee()", desc: "Collect the rupee on the tile." },
      { code: "for i in range(4):", desc: "Loops and executes the indented code below 4 times." }
    ]
  },
  gridSize: 8,
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 3, 3, 3, 3, 0, 2],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ],
  startX: 1,
  startY: 3,
  startDir: 0,
  targetCrystals: 4,
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
        name: "Loops",
        categorystyle: "loop_category",
        contents: [
          {
            kind: "block",
            type: "controls_repeat_ext",
            inputs: {
              TIMES: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 4 }
                }
              }
            }
          },
          { kind: "block", type: "math_number" }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_4;
}
