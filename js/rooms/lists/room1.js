const ROOM_LISTS_1 = {
  id: "lists/room1",
  name: {
    it: "Liste stanza 1: Il Sentiero delle Svolte",
    en: "Lists room 1: The Turn Trail"
  },
  badge: "LISTS",
  difficulty: "intermediate",
  requireList: true,
  requireLoop: true,
  runWithPyodide: true,
  story: {
    it: "Il saggio del castello ha segnato su una pergamena le svolte da effettuare a ogni rubino: [1, 2, 1, 2] (dove 1 significa svoltare a sinistra e 2 svoltare a destra). In ogni corridoio Knil deve camminare per esattamente 2 passi prima di svoltare. Crea una lista con questi numeri, poi usa un ciclo per scorrere la lista, camminare in avanti di 2 passi, raccogliere il rubino e svoltare in base al valore della lista!",
    en: "The castle sage has marked the turns to make at each ruby on a scroll: [1, 2, 1, 2] (where 1 means turn left and 2 means turn right). In each hallway, Knil must walk exactly 2 steps before turning. Create a list with these numbers, then use a loop to iterate through the list, walk forward 2 steps, collect the ruby, and turn according to the list value!"
  },
  goalText: {
    it: "Usa una lista con i valori [1, 2, 1, 2] per guidare Knil nel dungeon, raccogli tutti e 4 i rubini ed entra nel portale della Forza.",
    en: "Use a list with values [1, 2, 1, 2] to guide Knil in the dungeon, collect all 4 rubies, and enter the Force portal."
  },
  tip: {
    it: "Usa una lista per definire le svolte, ad esempio: turns = [1, 2, 1, 2]. Scorri la lista con un ciclo. In ogni iterazione, fai fare 2 passi in avanti all'eroe, raccogli il rubino, poi usa una condizione 'if turns[i] == 1:' per svoltare a sinistra, altrimenti a destra.",
    en: "Use a list to define the turns, for example: turns = [1, 2, 1, 2]. Iterate through the list with a loop. In each iteration, make the hero walk forward 2 steps, collect the ruby, then use an 'if turns[i] == 1:' condition to turn left, otherwise turn right."
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Fai camminare Knil in avanti." },
      { code: "hero.collect_ruby()", desc: "Raccogli il rubino corrente." },
      { code: "hero.turn_left() / turn_right()", desc: "Svolta a sinistra o destra." },
      { code: "turns = [1, 2, 1, 2]", desc: "Crea una lista con le svolte specificate (1=sinistra, 2=destra)." },
      { code: "for i in range(len(turns)):", desc: "Scorre gli indici da 0 a 3 della lista." },
      { code: "turns[i]", desc: "Ottiene la svolta corrente dall'elenco." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Make Knil walk forward." },
      { code: "hero.collect_ruby()", desc: "Collect the ruby on the current tile." },
      { code: "hero.turn_left() / turn_right()", desc: "Turn Knil 90 degrees left or right." },
      { code: "turns = [1, 2, 1, 2]", desc: "Create a list with the specified turns (1=left, 2=right)." },
      { code: "for i in range(len(turns)):", desc: "Loops index values from 0 to 3 of the list." },
      { code: "turns[i]", desc: "Gets the current turn from the list." }
    ]
  },
  gridSize: 8,
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 3, 2, 1],
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
          { kind: "block", type: "collect_ruby" },
          { kind: "block", type: "turn_left" },
          { kind: "block", type: "turn_right" }
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
        name: "Lists",
        categorystyle: "list_category",
        contents: [
          { kind: "block", type: "lists_create_with" },
          {
            kind: "block",
            type: "lists_getIndex",
            inputs: {
              VALUE: {
                block: {
                  type: "variables_get",
                  fields: { VAR: "turns" }
                }
              }
            }
          },
          { kind: "block", type: "lists_length" },
          { kind: "block", type: "lists_setIndex" }
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
          {
            kind: "block",
            type: "controls_for",
            inputs: {
              FROM: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 0 }
                }
              },
              TO: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 3 }
                }
              },
              BY: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 1 }
                }
              }
            }
          }
        ]
      },
      {
        kind: "category",
        name: "Logic & Math",
        categorystyle: "logic_category",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "math_number" },
          { kind: "block", type: "math_arithmetic" },
          { kind: "block", type: "math_modulo" }
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_LISTS_1;
}
