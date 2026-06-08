const ROOM_LISTS_1 = {
  id: "lists/room1",
  name: {
    it: "Liste stanza 1: Il Sentiero dei Rubini",
    en: "Lists room 1: The Ruby Trail"
  },
  badge: "LISTS",
  difficulty: "intermediate",
  requireList: true,
  requireLoop: true,
  runWithPyodide: true,
  story: {
    it: "Il saggio del castello ha segnato su una pergamena il sentiero sicuro dei rubini: [2, 3, 2, 2]. Questo elenco indica quanti passi fare in avanti in ogni corridoio prima di svoltare. Crea una lista con questi numeri, poi usa un ciclo per scorrere la lista, camminare in avanti e raccogliere tutti i rubini!",
    en: "The castle sage has marked the safe ruby path on a scroll: [2, 3, 2, 2]. This list indicates how many steps to walk forward in each hallway before turning. Create a list with these numbers, then use a loop to iterate through the list, walk forward, and collect all the rubies!"
  },
  goalText: {
    it: "Usa una lista con i valori [2, 3, 2, 2] per guidare Knil nel dungeon, raccogli tutti e 4 i rubini ed entra nel portale della Forza.",
    en: "Use a list with values [2, 3, 2, 2] to guide Knil in the dungeon, collect all 4 rubies, and enter the Force portal."
  },
  tip: {
    it: "Usa una lista per definire il sentiero, ad esempio: steps = [2, 3, 2, 2]. Per scorrere la lista, fai: for count in steps:. Ricordati di alternare le svolte: a sinistra dopo i segmenti dispari e a destra dopo quelli pari, oppure usa l'operatore modulo (i % 2) in un ciclo sull'indice 'range(len(steps))'.",
    en: "Use a list to define the path, for example: steps = [2, 3, 2, 2]. To iterate through the list, write: for count in steps:. Remember to alternate turns: turn left after odd segments and turn right after even segments, or use the modulo operator (i % 2) in an index-based loop 'range(len(steps))'."
  },
  docs: {
    it: [
      { code: "hero.move_forward()", desc: "Fai camminare Knil in avanti." },
      { code: "hero.collect_ruby()", desc: "Raccogli il rubino corrente." },
      { code: "hero.turn_left() / turn_right()", desc: "Svolta a sinistra o destra." },
      { code: "steps = [2, 3, 2, 2]", desc: "Crea una lista con i numeri specificati." },
      { code: "for i in range(len(steps)):", desc: "Scorre gli indici da 0 a 3 della lista." },
      { code: "steps[i]", desc: "Ottiene l'elemento all'indice specificato." },
      { code: "steps.append(5)", desc: "Aggiunge l'elemento 5 alla fine della lista." }
    ],
    en: [
      { code: "hero.move_forward()", desc: "Make Knil walk forward." },
      { code: "hero.collect_ruby()", desc: "Collect the ruby on the current tile." },
      { code: "hero.turn_left() / turn_right()", desc: "Turn Knil 90 degrees left or right." },
      { code: "steps = [2, 3, 2, 2]", desc: "Create a list with the specified numbers." },
      { code: "for i in range(len(steps)):", desc: "Loops index values from 0 to 3 of the list." },
      { code: "steps[i]", desc: "Gets the element at the specified index." },
      { code: "steps.append(5)", desc: "Appends the number 5 to the end of the list." }
    ]
  },
  gridSize: 8,
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 3, 2, 1],
    [1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 3, 0, 3, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1],
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
                  fields: { VAR: "steps" }
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
