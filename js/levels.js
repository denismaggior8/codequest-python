// The Legend of Python - Levels Configuration Loader (Zelda Themed, i18n Compatible)

let room1, room2, room3, room4, room5, room6, room7;

if (typeof require !== 'undefined') {
  // Node.js environment (e.g. testing)
  room1 = require('./rooms/sequences/room1.js');
  room2 = require('./rooms/variables/room1.js');
  room3 = require('./rooms/conditionals/room1.js');
  room4 = require('./rooms/loops/room1.js');
  room5 = require('./rooms/functions/room1.js');
  room6 = require('./rooms/lists/room1.js');
  room7 = require('./rooms/recursion/room1.js');
} else {
  // Browser environment (loaded via global script tags)
  room1 = ROOM_SEQUENCES_1;
  room2 = ROOM_VARIABLES_1;
  room3 = ROOM_CONDITIONALS_1;
  room4 = ROOM_LOOPS_1;
  room5 = ROOM_FUNCTIONS_1;
  room6 = ROOM_LISTS_1;
  room7 = ROOM_RECURSION_1;
}

const LEVELS = [
  room1,
  room2,
  room3,
  room4,
  room5,
  room6,
  room7
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LEVELS;
}
