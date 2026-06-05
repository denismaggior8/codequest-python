const ROOM_OBJECTS_1 = {
  id: "objects/room1",
  name: {
    it: "Oggetti stanza 1: Enigma ed Oggetti",
    en: "Objects room 1: Enigma and Objects"
  },
  badge: "OBJECTS",
  difficulty: "intermediate",
  story: {
    it: "Link si trova bloccato davanti a un'enorme porta di ferro. Al centro della stanza ci sono una macchina Enigma smontata e una pergamena che spiega come rimontarla e configurarla. Per aprire la porta d'acciaio, dovrai configurare la macchina Enigma M3, decifrare la stringa cifrata ed inserire il testo in chiaro per sbloccare la porta!",
    en: "Link is stuck in front of a massive iron gate. In the center of the room, there is a disassembled Enigma machine and a scroll explaining how to assemble and configure it. To open the steel gate, you must configure the Enigma M3 machine, decrypt the ciphertext, and enter the plaintext to unlock the gate!"
  },
  goalText: {
    it: "Configura la macchina Enigma per decifrare 'codjzbcl', sblocca la porta usando 'hero.unlock_gate(decrypted)' e raggiungi il portale della Triforza.",
    en: "Configure the Enigma machine to decrypt 'codjzbcl', unlock the gate using 'hero.unlock_gate(decrypted)', and reach the Triforce portal."
  },
  tip: {
    it: "Configurazione: Rotor I (pos: 1, ring: 4), Rotor II (pos: 1, ring: 2), Rotor III (pos: 1, ring: 6). SwappablePlugboard con swap 'a'-'z', reflector UKWB, etw pass-through. auto_increment: True.",
    en: "Configuration: Rotor I (pos: 1, ring: 4), Rotor II (pos: 1, ring: 2), Rotor III (pos: 1, ring: 6). SwappablePlugboard with swap 'a'-'z', reflector UKWB, etw pass-through. auto_increment: True."
  },
  docs: {
    it: [
      { code: "from enigmapython.EnigmaM3 import EnigmaM3", desc: "Importa la macchina Enigma M3." },
      { code: "from enigmapython.EnigmaM3RotorI import EnigmaM3RotorI", desc: "Importa il Rotore I per Enigma M3." },
      { code: "from enigmapython.EnigmaM3RotorII import EnigmaM3RotorII", desc: "Importa il Rotore II per Enigma M3." },
      { code: "from enigmapython.EnigmaM3RotorIII import EnigmaM3RotorIII", desc: "Importa il Rotore III per Enigma M3." },
      { code: "from enigmapython.ReflectorUKWB import ReflectorUKWB", desc: "Importa il Riflettore UKW-B." },
      { code: "from enigmapython.SwappablePlugboard import SwappablePlugboard", desc: "Importa la plugboard configurabile." },
      { code: "from enigmapython.EtwPassthrough import EtwPassthrough", desc: "Importa l'entry wheel pass-through." },
      { code: "plugboard = SwappablePlugboard()", desc: "Istanzia una plugboard configurabile." },
      { code: "plugboard.swap('a', 'z')", desc: "Scambia due lettere nella plugboard." },
      { code: "rotor1 = EnigmaM3RotorI(pos, ring)", desc: "Istanzia un Rotore I con posizione iniziale (1-26) e ring setting (1-26)." },
      { code: "rotor2 = EnigmaM3RotorII(pos, ring)", desc: "Istanzia un Rotore II con posizione iniziale (1-26) e ring setting (1-26)." },
      { code: "rotor3 = EnigmaM3RotorIII(pos, ring)", desc: "Istanzia un Rotore III con posizione iniziale (1-26) e ring setting (1-26)." },
      { code: "enigma = EnigmaM3(plugboard, rotor3, rotor2, rotor1, reflector, etw, True)", desc: "Istanzia una macchina Enigma M3 (plugboard, rotor L, rotor M, rotor R, reflector, etw, auto_increment)." },
      { code: "decrypted = enigma.input_string('codjzbcl')", desc: "Cifra o decifra una stringa usando la macchina Enigma." },
      { code: "hero.unlock_gate(decrypted)", desc: "Invia il codice decifrato alla porta per aprirla." }
    ],
    en: [
      { code: "from enigmapython.EnigmaM3 import EnigmaM3", desc: "Import the Enigma M3 machine class." },
      { code: "from enigmapython.EnigmaM3RotorI import EnigmaM3RotorI", desc: "Import the Enigma M3 Rotor I class." },
      { code: "from enigmapython.EnigmaM3RotorII import EnigmaM3RotorII", desc: "Import the Enigma M3 Rotor II class." },
      { code: "from enigmapython.EnigmaM3RotorIII import EnigmaM3RotorIII", desc: "Import the Enigma M3 Rotor III class." },
      { code: "from enigmapython.ReflectorUKWB import ReflectorUKWB", desc: "Import the Reflector UKW-B class." },
      { code: "from enigmapython.SwappablePlugboard import SwappablePlugboard", desc: "Import the SwappablePlugboard class." },
      { code: "from enigmapython.EtwPassthrough import EtwPassthrough", desc: "Import the pass-through entry wheel class." },
      { code: "plugboard = SwappablePlugboard()", desc: "Instantiates a swappable plugboard." },
      { code: "plugboard.swap('a', 'z')", desc: "Swaps two letters in the plugboard." },
      { code: "rotor1 = EnigmaM3RotorI(pos, ring)", desc: "Instantiates Rotor I with initial position (1-26) and ring setting (1-26)." },
      { code: "rotor2 = EnigmaM3RotorII(pos, ring)", desc: "Instantiates Rotor II with initial position (1-26) and ring setting (1-26)." },
      { code: "rotor3 = EnigmaM3RotorIII(pos, ring)", desc: "Instantiates Rotor III with initial position (1-26) and ring setting (1-26)." },
      { code: "enigma = EnigmaM3(plugboard, rotor3, rotor2, rotor1, reflector, etw, True)", desc: "Instantiates an Enigma M3 machine (plugboard, rotor L, rotor M, rotor R, reflector, etw, auto_increment)." },
      { code: "decrypted = enigma.input_string('codjzbcl')", desc: "Encrypt or decrypt a string using the Enigma machine." },
      { code: "hero.unlock_gate(decrypted)", desc: "Unlock the gate using the decrypted code." }
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
  pythonOnly: false,
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Commands",
        categorystyle: "procedure_category",
        contents: [
          { kind: "block", type: "move_forward" },
          { kind: "block", type: "hero_unlock_gate" }
        ]
      },
      {
        kind: "category",
        name: "Enigma Components",
        categorystyle: "logic_category",
        contents: [
          { kind: "block", type: "swappable_plugboard" },
          { kind: "block", type: "plugboard_swap" },
          { kind: "block", type: "enigma_m3_rotor1" },
          { kind: "block", type: "enigma_m3_rotor2" },
          { kind: "block", type: "enigma_m3_rotor3" },
          { kind: "block", type: "reflector_ukwb" },
          { kind: "block", type: "etw_passthrough" },
          { kind: "block", type: "enigma_m3" }
        ]
      },
      {
        kind: "category",
        name: "Enigma Actions",
        categorystyle: "text_category",
        contents: [
          { kind: "block", type: "enigma_input_string" }
        ]
      },
      {
        kind: "category",
        name: "Variables",
        categorystyle: "variable_category",
        custom: "VARIABLE"
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_OBJECTS_1;
}
