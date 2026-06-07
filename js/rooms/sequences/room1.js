const ROOM_SEQUENCES_1 = {
  id: "sequences/room1",
  name: {
    it: "Sequenze stanza 1: Il Risveglio dell'Eroe",
    en: "Sequences room 1: The Hero's Awakening"
  },
  badge: "SEQUENCES",
  difficulty: "base",
  story: {
    it: "Knil si è svegliato in un misterioso dungeon di pietra! Il portale dorato della Triforza è dritto davanti a lui, ma ha bisogno dei tuoi comandi per muoversi. Scrivi una sequenza di comandi per guidarlo alla Triforza.",
    en: "Knil has awakened in a mysterious stone dungeon! The gold Triforce warp gate is straight ahead, but Knil needs your commands to move. Write a sequence of movements to guide him to the Triforce."
  },
  goalText: {
    it: "Fai muovere Knil in avanti di 2 spazi per raggiungere la Triforza d'oro.",
    en: "Move Knil forward 2 spaces to reach the gold Triforce gate."
  },
  tip: {
    it: "In Python, chiamiamo delle funzioni per eseguire azioni. Il comando 'hero.move_forward()' dice all'eroe di fare un passo in avanti nella direzione in cui è rivolto.",
    en: "In Python, we call functions to perform actions. The command 'hero.move_forward()' tells the hero to move one square in the direction they are facing."
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Fai camminare Knil in avanti di una casella." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Make Knil walk forward one space." }
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
  module.exports = ROOM_SEQUENCES_1;
}
