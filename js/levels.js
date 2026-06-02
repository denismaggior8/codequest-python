// The Legend of Python - Levels Configuration (Zelda Themed, i18n Compatible)

const LEVELS = [
  {
    id: 1,
    name: {
      it: "Stanza 1: Il Risveglio dell'Eroe",
      en: "Room 1: The Hero's Awakening"
    },
    badge: "SEQUENCES",
    difficulty: "Easy",
    story: {
      it: "Link si è svegliato in un misterioso dungeon di pietra! Il portale dorato della Triforza è dritto davanti a lui, ma ha bisogno dei tuoi comandi per muoversi. Scrivi una sequenza di comandi per guidarlo alla Triforza.",
      en: "Link has awakened in a mysterious stone dungeon! The gold Triforce warp gate is straight ahead, but Link needs your commands to move. Write a sequence of movements to guide him to the Triforce."
    },
    goalText: {
      it: "Fai muovere Link in avanti di 2 spazi per raggiungere la Triforza d'oro.",
      en: "Move Link forward 2 spaces to reach the gold Triforce gate."
    },
    tip: {
      it: "In Python, chiamiamo delle funzioni per eseguire azioni. Il comando 'hero.move_forward()' dice all'eroe di fare un passo in avanti nella direzione in cui è rivolto.",
      en: "In Python, we call functions to perform actions. The command 'hero.move_forward()' tells the hero to move one square in the direction they are facing."
    },
    
    gridSize: 5,
    grid: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 2, 1], // Path from (1,2) to (3,2)
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    
    startX: 1,
    startY: 2,
    startDir: 0, // Right
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
  },
  {
    id: 2,
    name: {
      it: "Stanza 2: La Grotta delle Rupie",
      en: "Room 2: The Rupee Caves"
    },
    badge: "VARIABLES",
    difficulty: "Easy",
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
  },
  {
    id: 3,
    name: {
      it: "Stanza 3: La Lente della Verità",
      en: "Room 3: Eye of Truth"
    },
    badge: "CONDITIONALS",
    difficulty: "Medium",
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
  },
  {
    id: 4,
    name: {
      it: "Stanza 4: La Caverna delle Rupie",
      en: "Room 4: The Rupee Vault"
    },
    badge: "LOOPS",
    difficulty: "Medium",
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
  },
  {
    id: 5,
    name: {
      it: "Stanza 5: Il Santuario della Triforza",
      en: "Room 5: The Triforce Chamber"
    },
    badge: "FUNCTIONS",
    difficulty: "Hard",
    story: {
      it: "Hai raggiunto l'ultima stanza! La Triforza finale è protetta da mura in un labirinto a zig-zag. Definisci una funzione personalizzata 'step_and_collect' per fare due passi in avanti e raccogliere una rupia, poi usala per navigare.",
      en: "You have reached the final chamber! The ultimate Triforce is guarded by walls in a zig-zag labyrinth. Define a custom function called 'step_and_collect' to move forward twice and collect a rupee, then call it to navigate through."
    },
    goalText: {
      it: "Definisci una funzione che fa due passi in avanti e raccoglie una rupia. Chiamala 3 volte per raccogliere tutte le rupie e raggiungere la Triforza.",
      en: "Define a function that moves twice and collects a rupee. Call it 3 times to collect the rupees and reach the Triforce."
    },
    tip: {
      it: "Le funzioni raggruppano blocchi di codice. In Python, 'def step_and_collect():' definisce un blocco personalizzato che può essere richiamato scrivendone il nome.",
      en: "Functions group blocks of code together. In Python, 'def step_and_collect():' defines a custom block that can be run repeatedly by writing its name."
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
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LEVELS;
}
