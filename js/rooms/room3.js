const ROOM_3 = {
  id: 3,
  name: {
    it: "Stanza 3: La Lente della Verità",
    en: "Room 3: Eye of Truth"
  },
  badge: "CONDITIONALS",
  difficulty: "base",
  story: {
    it: "Una gigantesca colonna di pietra blocca il corridoio davanti a te! Link deve usare il suo incantesimo sensore 'hero.scan_ahead()' per rilevare gli ostacoli. Se ne vede uno, deve girare a destra!",
    en: "A giant stone pillar is blocking the corridor ahead! Link must use his sensor spell 'hero.scan_ahead()' to check for obstacles. If he detects one, turn right!"
  },
  goalText: {
    it: "Evita di scontrarti con la colonna di pietra usando un costrutto 'if' con la scansione, poi raggiungi il portale della Triforza.",
    en: "Avoid colliding with the stone pillar obstacle using an 'if' statement, then reach the Triforce."
  },
  tip: {
    it: "I condizionali prendono decisioni. In Python, 'if hero.scan_ahead() == \"obstacle\":' controlla la casella di fronte. Se è bloccata, Link eseguirà le istruzioni indentate sotto l'if.",
    en: "Conditionals make decisions. In Python, 'if hero.scan_ahead() == \"obstacle\":' checks the tile in front. If it's blocked, Link will execute the code inside."
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Cammina in avanti." },
      { code: "hero.turn_right()", desc: "Gira a destra di 90 gradi." },
      { code: "hero.scan_ahead()", desc: "Controlla la casella di fronte. Restituisce 'obstacle' se c'è un muro." },
      { code: "if hero.scan_ahead() == \"obstacle\":", desc: "Se c'è un ostacolo di fronte, esegui i comandi indentati." },
      { code: "else:", desc: "Altrimenti (se la casella è vuota), esegui i comandi inseriti sotto 'else:'." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Walk forward." },
      { code: "hero.turn_right()", desc: "Turn Link right 90 degrees." },
      { code: "hero.scan_ahead()", desc: "Scan the tile directly ahead. Returns 'obstacle' if blocked." },
      { code: "if hero.scan_ahead() == \"obstacle\":", desc: "If an obstacle is detected ahead, run the indented code below." },
      { code: "else:", desc: "Otherwise, execute the indented code under else." }
    ]
  },
  gridSize: 6,
  grid: [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 2, 1],
    [1, 0, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1]
  ],
  startX: 1,
  startY: 4,
  startDir: 3, // UP
  targetCrystals: 0,
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Commands",
        categorystyle: "procedure_category",
        contents: [
          { kind: "block", type: "move_forward" },
          { kind: "block", type: "turn_right" },
          { kind: "block", type: "scan_ahead" }
        ]
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
                  fields: { TEXT: "obstacle" }
                }
              }
            }
          },
          {
            kind: "block",
            type: "text",
            fields: { TEXT: "obstacle" }
          }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_3;
}
