/* Readline Library */

const readline = require("readline");
const { finished } = require("stream");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

/* Rooms Class */

class Rooms {
  constructor(name, inventory = [], desc) {
    this.name = name;
    this.inventory = inventory;
    this.desc = desc;
  }
  describe() {
    return `\n${this.name}\n${this.desc}`;
  }
  take(item) {
    if (roomLookUp[currentRoom].inventory[item] === undefined) {
      return "This item doesn't exist...\n>";
    } else if (roomLookUp[currentRoom].inventory[item].takeable === false) {
      return "This item is already in your inventory...\n>";
    } else {
      playerInv[item] = roomLookUp[currentRoom].inventory[item];
      roomLookUp[currentRoom].inventory[item].takeable = false;
      return roomLookUp[currentRoom].inventory[item].desc;
    }
  }
  drop(item) {
    if (playerInv[item] != undefined) {
      delete playerInv[item];
      return "Successfully dropped " + item + "...";
    }
    return "Item " + item + " is not in your inventory";
  }
}

function getPlayerInv() {
  let responseString = "Current Inventory:\n";
  for (let item in playerInv) {
    responseString += playerInv[item].name + ",\n";
  }
  return responseString;
}

/* Seven Room Instances */

let roomOne = new Rooms(
  "Lounge",
  {
    firstKey: {
      name: "first key",
      desc: "You have found your first key!\n>",
      takeable: true,
    },
    candleStick: {
      name: "candle stick",
      desc: "I wonder if there is something we can light it with...\n>",
      takeable: true,
    },
    matchBox: {
      name: "match box",
      desc: "Maybe we can use it to light something...\n>",
      takeable: true,
    },
    bottle: {
      name: "bottle",
      desc: "As you picked it up you heard a *clink* from inside the bottle...\n>",
      takeable: true,
    },
  },
  "A dim lamp fills the room allowing you to see a few scattered chairs, a round table in the center of the room and a door across the room. On this table you see a dark brown colored whiskey bottle next to a cigarette put out in an ash tray. Laying on one of the chairs is a candle stick and a match box. What are you going to do next?\n>"
);

let roomTwo = new Rooms(
  "Billiard Room",
  [
    (secondKey = {
      name: "second key",
      desc: "You have found your second key!\n>",
      takeable: true,
    }),
    (eightBall = {
      name: "8 ball",
      desc: "As you feel the weight of the pool ball in your hand you have a flashback of a time (you were playing billiards with all of your lads in your favorite pub) and smirk",
      takeable: true,
    }),
    (nightStand = {
      name: "night stand",
      desc: "Above the two locked drawers you a layer of dust covering the top of the night stand",
      takeable: false,
    }),
  ],
  "desc"
);

let roomThree = new Rooms(
  "Library",
  [
    (bookCase = {
      name: "book case",
      desc: "From the floor to the ceiling the book case towers over you. You notice a few books are missing",
      takeable: false,
    }),
    (bookOne = {
      name: "book one",
      desc: "The front cover reads 'Peaky Blinders' in a bold old english font', and on the first page it reads 'Arthur Shelby 1940' in the bottom left hand corner...\n>",
      takeable: true,
    }),
    (bookTwo = {
      name: "book two",
      desc: "The front cover reads 'Peaky Blinders ' in a bold old english font', and on the first page it reads 'Thomas Shelby 1942' in the bottom left hand corner...\n>",
      takeable: true,
    }),
    (bookThree = {
      name: "book three",
      desc: "The front cover reads 'Peaky Blinders' in a bold old english font', and on the first page it reads 'John Shelby 1945' in the bottom left hand corner...\n>",
      takeable: true,
    }),
    (secretCompartment = {
      name: "secret compartment",
      desc: "Something seems off about this part of the wall but you can't seem to put your finger on it\n>",
      takeable: false,
    }),
    (thirdKey = {
      name: "third key",
      desc: "You have found your third key!\n>",
      takeable: true,
    }),
  ],
  "desc"
);

let roomFour = new Rooms(
  "Study",
  [
    (computer = {
      name: "computer",
      desc: "The computer screen radiates a soft light blue across the room and reads 'Password...<_>'...\n>",
      takeable: false,
    }),
    (deskDrawer = {
      name: "desk drawer",
      desc: "You open the drawer and see the keyboard and a note pad...\n>",
      takeable: false,
    }),
    (keyboard = {
      name: "keyboard",
      desc: "You blow the dust from off the key board clouding the air in front of you *coughs*...\n>",
      takeable: false,
    }),
    (notePad = {
      name: "note pad",
      desc: "a scrambled word on the page reads 'rsonrgia'...\n>",
      takeable: false,
    }),
  ],
  "desc"
);

let roomFive = new Rooms(
  "Kitchen",
  [
    (fridge = {
      name: "fridge",
      desc: "You notice scattered on the front door there are four magnets with a number each '8', '3', '5', and '1'. Opening the fridge there is bread and a jug holding an unknown liquid...\n>",
      takeable: false,
    }),
    (bread = {
      name: "bread",
      desc: "*spits out bread* EW, that has mold on it. Quick you need something to wash the mold out of your mouth or you will catch a disease!\n>",
      takeable: true,
    }),
    (jug = {
      name: "jug",
      desc: "*spits out milk* UGH, why would drink an unknown liquid you fool! Who knows how old that milk could be?...\n>",
      takeable: true,
    }),
    (pan = {
      name: "pan",
      desc: "Hm a cast iron pan. That could be useful...\n>",
      takeable: true,
    }),
  ],
  "desc"
);

let roomSix = new Rooms(
  "Backyard",
  [
    (keypad = {
      name: "keypad",
      desc: "Enter code...\n>",
      takeable: false,
    }),
    (car = {
      name: "car",
      desc: "The car door is locked, you need the cars keys...\n>",
      takeable: false,
    }),
  ],
  "desc"
);

let roomSeven = new Rooms(
  "Shed",
  [
    (lightSwitch = {
      name: "light switch",
      desc: "covered in cobwebs, you flicked the light switch on for the light to reveal 3 keys (blue key, red key and yellow key)...\n>",
      takeable: false,
    }),
    (blueKey = { name: "blue key", desc: "hmm...\n>", takeable: true }),
    (redKey = {
      name: "red key",
      desc: "Interesting...\n>",
      takeable: true,
    }),
    (yellowKey = {
      name: "yellow key",
      desc: "Alright then, if that's what you want...\n>",
      takeable: true,
    }),
  ],
  "desc"
);

/* Room Look Up Table */

let roomLookUp = {
  roomOne: roomOne,
  roomTwo: roomTwo,
  roomThree: roomThree,
  roomFour: roomFour,
  roomFive: roomFive,
  roomSix: roomSix,
  roomSeven: roomSeven,
};

/* Player Inventory */

let playerInv = {};

/* State/Move Machine */

let currentRoom = "roomOne";

let rooms = {
  roomOne: ["roomTwo"],
  roomTwo: ["roomOne", "roomThree", "roomFour", "roomFive"],
  roomThree: ["roomTwo"],
  roomFour: ["roomTwo"],
  roomFive: ["roomTwo", "roomSix"],
  roomSix: ["roomFive", "roomSeven"],
  roomSeven: ["roomSix"],
};

function playerLoc(nextLoc) {
  if (rooms[currentRoom].includes(nextLoc)) {
    currentRoom = nextLoc;
    return roomLookUp[currentRoom].describe();
  } else {
    return "You cannot currently access this location...\n>";
  }
}
playerLoc();

/* Text Adventure Async Function */

textAdventure();

async function textAdventure() {
  const welcomeMessage = `Greetings Stranger! You will be playing an Escape the Room Text Adventure: 1940's (War Year's Themed). You will be able to use commands like [take, drop, use/throw, open, read, eat, drink etc.. ], You can also type "inv" to check your inventory.\nWhen you are ready type "begin" to be captured and locked inside "The Garrison" as a 1940's gangster who fixes horse races and gambles their life against all odds to become a success in the harsh society of Birmingham, England...\n>`;

  let answer = await ask(welcomeMessage);

  while (true) {
    if (answer.toLowerCase() === "begin") {
      break;
    } else {
      answer = await ask(
        "Please type begin, none of that gibberesh will suffice.\n>"
      );
    }
  }

  let playerComm = await ask(roomLookUp[currentRoom].describe());
  while (true) {
    let response = playerComm;
    if (response.slice(0, 4).toLowerCase() === "take") {
      playerComm = await ask(roomLookUp[currentRoom].take(response.slice(5)));
    } else if (response.slice(0, 3).toLowerCase().includes("inv")) {
      playerComm = await ask(getPlayerInv() + "\n>");
    } else {
      playerComm = await ask(
        "I didn't understand what you said. Can you repeat that...\n>"
      );
    }
  }
}
