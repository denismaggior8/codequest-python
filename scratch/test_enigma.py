from enigmapython.Enigma import Enigma
from enigmapython.Rotor import Rotor
from enigmapython.Reflector import Reflector
from enigmapython.SwappablePlugboard import SwappablePlugboard
from enigmapython.Etw import Etw
from enigmapython.Alphabets import Alphabets

alphabet = Alphabets.lookup.get("latin_i18n_26chars_lowercase")

# Setup rotors: wiring, turnover notches, alphabet, initial position, ring setting
# Rotor I, II, III
rotor1 = Rotor("ekmflgdqvzntowyhxuspaibrcj", [16], alphabet, 0, 0)
rotor2 = Rotor("ajdksiruxblhwtmcqgznpyfvoe", [4], alphabet, 0, 0)
rotor3 = Rotor("bdfhjlcprtxvznyeiwgakmusqo", [21], alphabet, 0, 0)

reflector = Reflector("yruhqsldpxngokmiebfzcwvjat", alphabet)
plugboard = SwappablePlugboard(alphabet=alphabet)
plugboard.swap("a", "z")
etw = Etw(alphabet, alphabet)

# Assemble with auto_increment_rotors=True
enigma = Enigma(plugboard, [rotor1, rotor2, rotor3], reflector, etw, auto_increment_rotors=True, alphabet=alphabet)

plain_text = "forza"
cipher_text = enigma.input_string(plain_text)
print(f"Plaintext: {plain_text} -> Ciphertext: {cipher_text}")

# Let's verify decryption: we re-create the machine (with same settings) and decrypt
rotor1_dec = Rotor("ekmflgdqvzntowyhxuspaibrcj", [16], alphabet, 0, 0)
rotor2_dec = Rotor("ajdksiruxblhwtmcqgznpyfvoe", [4], alphabet, 0, 0)
rotor3_dec = Rotor("bdfhjlcprtxvznyeiwgakmusqo", [21], alphabet, 0, 0)
reflector_dec = Reflector("yruhqsldpxngokmiebfzcwvjat", alphabet)
plugboard_dec = SwappablePlugboard(alphabet=alphabet)
plugboard_dec.swap("a", "z")
etw_dec = Etw(alphabet, alphabet)

enigma_dec = Enigma(plugboard_dec, [rotor1_dec, rotor2_dec, rotor3_dec], reflector_dec, etw_dec, auto_increment_rotors=True, alphabet=alphabet)
decrypted_text = enigma_dec.input_string(cipher_text)

print(f"Ciphertext: {cipher_text} -> Decrypted: {decrypted_text}")
