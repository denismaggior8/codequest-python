const ROOM_FUNCTIONS_1 = {
  id: "functions/room1",
  name: {
    it: "Stanza 5: Il Santuario della Triforza",
    en: "Room 5: The Triforce Chamber"
  },
  badge: "FUNCTIONS",
  difficulty: "base",
  requireFunction: true,
  story: {
    it: "Hai raggiunto l'ultima stanza! La Triforza finale è protetta da mura in un labirinto a zig-zag. Definisci una funzione personalizzata 'step_and_collect' per fare due passi in avanti e raccogliere una rupia, poi usala per navigare.",
    en: "You have reached the final chamber! The ultimate Triforce is guarded by walls in a zig-zag labyrinth. Define a custom function called 'step_and_collect' to move forward twice and collect a rupee, then call it to navigate through."
  },
  goalText: {
    it: "Definisci una funzione che fa due passi in avanti e raccoglie una rupia. Chiamala 4 volte per raccogliere tutte le rupie e raggiungere la Triforza.",
    en: "Define a function that moves twice and collects a rupee. Call it 4 times to collect the rupees and reach the Triforce."
  },
  tip: {
    it: "Le funzioni raggruppano blocchi di codice. In Python, 'def step_and_collect():' definisce un blocco personalizzato che può essere richiamato scrivendone il nome.",
    en: "Functions group blocks of code together. In Python, 'def step_and_collect():' defines a custom block that can be run repeatedly by writing its name."
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Cammina in avanti." },
      { code: "hero.collect_rupee()", desc: "Raccogli la rupia." },
      { code: "hero.turn_left() / turn_right()", desc: "Gira Link a sinistra o destra." },
      { code: "def step_and_collect():", desc: "Crea una funzione/macro chiamata step_and_collect con all'interno i comandi indentati." },
      { code: "step_and_collect()", desc: "Chiama ed esegui la funzione personalizzata creata." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Walk forward." },
      { code: "hero.collect_rupee()", desc: "Collect the rupee." },
      { code: "hero.turn_left() / turn_right()", desc: "Turn Link 90 degrees left or right." },
      { code: "def step_and_collect():", desc: "Defines a custom function/spell called step_and_collect." },
      { code: "step_and_collect()", desc: "Calls and executes the custom function defined." }
    ]
  },
  gridSize: 8,
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 3, 0, 2],
    [1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 3, 0, 3, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 3, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ],
  startX: 1,
  startY: 6,
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
          { kind: "block", type: "collect_rupee" },
          { kind: "block", type: "turn_left" },
          { kind: "block", type: "turn_right" }
        ]
      },
      {
        kind: "category",
        name: "Functions",
        categorystyle: "procedure_category",
        custom: "PROCEDURE"
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_FUNCTIONS_1;
}
