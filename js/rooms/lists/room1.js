const ROOM_LISTS_1 = {
  id: "lists/room1",
  name: {
    it: "Liste stanza 1: La Via dei Cristalli",
    en: "Lists room 1: Path of Crystals"
  },
  badge: "LISTS",
  difficulty: "intermediate",
  story: {
    it: "[Livello Intermedio - Prossimamente] Impara a usare le liste in Python per memorizzare percorsi o coordinate.",
    en: "[Intermediate Level - Coming Soon] Learn to use Python lists to store paths or coordinates."
  },
  goalText: {
    it: "Usa una lista per definire i movimenti ed entra nel portale.",
    en: "Use a list to define movements and enter the portal."
  },
  tip: {
    it: "In Python, puoi creare una lista racchiudendo gli elementi tra parentesi quadre: path = ['forward', 'left']",
    en: "In Python, you can create a list by wrapping elements in square brackets: path = ['forward', 'left']"
  },
  docs: {
    it: [
      { code: "path = []", desc: "Crea una lista vuota." }
    ],
    en: [
      { code: "path = []", desc: "Create an empty list." }
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
  module.exports = ROOM_LISTS_1;
}
