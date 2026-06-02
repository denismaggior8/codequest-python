// The Legend of Python - Levels Configuration Loader (Zelda Themed, i18n Compatible)

let room1, room2, room3, room4, room5, room6, room7;

if (typeof require !== 'undefined') {
  // Node.js environment (e.g. testing)
  room1 = require('./rooms/room1.js');
  room2 = require('./rooms/room2.js');
  room3 = require('./rooms/room3.js');
  room4 = require('./rooms/room4.js');
  room5 = require('./rooms/room5.js');
  room6 = require('./rooms/room6.js');
  room7 = require('./rooms/room7.js');
} else {
  // Browser environment (loaded via global script tags)
  room1 = ROOM_1;
  room2 = ROOM_2;
  room3 = ROOM_3;
  room4 = ROOM_4;
  room5 = ROOM_5;
  room6 = ROOM_6;
  room7 = ROOM_7;
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
