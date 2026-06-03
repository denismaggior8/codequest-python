const ROOM_OBJECTS_1 = {
  id: "objects/room1",
  name: {
    it: "Stanza 7: Enigma ed Oggetti",
    en: "Room 7: Enigma and Objects"
  },
  badge: "OBJECTS",
  difficulty: "intermediate",
  story: {
    it: "Link si trova bloccato davanti a un'enorme porta di ferro. Al centro della stanza ci sono una macchina Enigma smontata e una pergamena che spiega come rimontarla e configurarla. Per aprire la porta d'acciaio, dovrai instanziare gli oggetti della libreria 'enigmapython' in Python, decifrare la stringa ed inserire il testo in chiaro per sbloccare la porta!",
    en: "Link is stuck in front of a massive iron gate. In the center of the room, there is a disassembled Enigma machine and a scroll explaining how to assemble and configure it. To open the steel gate, you must instantiate the objects from the 'enigmapython' library in Python, decrypt the string, and enter the plaintext to unlock the gate!"
  },
  goalText: {
    it: "Configura la macchina Enigma per decifrare 'asjkahsi', sblocca la porta usando 'hero.unlock_gate(decrypted)' e raggiungi il portale della Triforza.",
    en: "Configure the Enigma machine to decrypt 'asjkahsi', unlock the gate using 'hero.unlock_gate(decrypted)', and reach the Triforce portal."
  },
  tip: {
    it: "Configurazione: Rotor I ('ekmflgdqvzntowyhxuspaibrcj', notch: [16]), Rotor II ('ajdksiruxblhwtmcqgznpyfvoe', notch: [4]), Rotor III ('bdfhjlcprtxvznyeiwgakmusqo', notch: [21]). Reflector B ('yruhqsldpxngokmiebfzcwvjat'). Plugboard swap 'a'-'z'. Enigma(plugboard, [r1, r2, r3], reflector, etw, auto_increment_rotors=True).",
    en: "Configuration: Rotor I ('ekmflgdqvzntowyhxuspaibrcj', notch: [16]), Rotor II ('ajdksiruxblhwtmcqgznpyfvoe', notch: [4]), Rotor III ('bdfhjlcprtxvznyeiwgakmusqo', notch: [21]). Reflector B ('yruhqsldpxngokmiebfzcwvjat'). Plugboard swap 'a'-'z'. Enigma(plugboard, [r1, r2, r3], reflector, etw, auto_increment_rotors=True)."
  },
  docs: {
    it: [
      { code: "from enigmapython.Enigma import Enigma", desc: "Importa la macchina Enigma." },
      { code: "from enigmapython.Rotor import Rotor", desc: "Importa il Rotore." },
      { code: "from enigmapython.Reflector import Reflector", desc: "Importa il Riflettore." },
      { code: "from enigmapython.SwappablePlugboard import SwappablePlugboard", desc: "Importa la tastiera a spinotti (plugboard)." },
      { code: "from enigmapython.Etw import Etw", desc: "Importa l'entry wheel." },
      { code: "from enigmapython.Alphabets import Alphabets", desc: "Importa gli alfabeti." },
      { code: "alphabet = Alphabets.lookup.get('latin_i18n_26chars_lowercase')", desc: "Ottiene l'alfabeto a 26 lettere minuscole." },
      { code: "r1 = Rotor('ekmflgdqvzntowyhxuspaibrcj', [16], alphabet, 0, 0)", desc: "Istanzia un rotore con cablaggio, notch, alfabeto, posizione e ring." },
      { code: "plugboard.swap('a', 'z')", desc: "Scambia due caratteri nella plugboard." },
      { code: "hero.unlock_gate(decrypted)", desc: "Invia il testo in chiaro alla porta d'acciaio per aprirla." }
    ],
    en: [
      { code: "from enigmapython.Enigma import Enigma", desc: "Import the Enigma machine class." },
      { code: "from enigmapython.Rotor import Rotor", desc: "Import the Rotor class." },
      { code: "from enigmapython.Reflector import Reflector", desc: "Import the Reflector class." },
      { code: "from enigmapython.SwappablePlugboard import SwappablePlugboard", desc: "Import the SwappablePlugboard class." },
      { code: "from enigmapython.Etw import Etw", desc: "Import the Etw entry wheel class." },
      { code: "from enigmapython.Alphabets import Alphabets", desc: "Import the Alphabets helper dictionary." },
      { code: "alphabet = Alphabets.lookup.get('latin_i18n_26chars_lowercase')", desc: "Gets the 26-character lowercase latin alphabet." },
      { code: "r1 = Rotor('ekmflgdqvzntowyhxuspaibrcj', [16], alphabet, 0, 0)", desc: "Instantiates a rotor with wiring, turnover notches, alphabet, initial position, and ring setting." },
      { code: "plugboard.swap('a', 'z')", desc: "Swaps two letters in the plugboard." },
      { code: "hero.unlock_gate(decrypted)", desc: "Feed the decrypted code to the iron gate to unlock it." }
    ]
  },
  gridSize: 5,
  grid: [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 2, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ],
  startX: 1,
  startY: 1,
  startDir: 0,
  gateX: 2,
  gateY: 1,
  targetCrystals: 0,
  runWithPyodide: true,
  pythonOnly: true,
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
  module.exports = ROOM_OBJECTS_1;
}
