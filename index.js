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
      return "This item does not exist...\n>";
    } else if (roomLookUp[currentRoom].inventory[item].takeable === false) {
      return "This item is already in your inventory or it cannot be taken...\n>";
    } else {
      playerInv[item] = roomLookUp[currentRoom].inventory[item];
      roomLookUp[currentRoom].inventory[item].takeable = false;
      return roomLookUp[currentRoom].inventory[item].desc;
    }
  }
  drop(item) {
    if (playerInv[item] != undefined) {
      delete playerInv[item];
      roomLookUp[currentRoom].inventory[item].takeable = true;
      return "Successfully dropped " + item + "...";
    }
    return "Item " + item + " is not in your inventory";
  }
  use(item) {
    if (roomLookUp[currentRoom].inventory[item].name === "first key") {
      delete playerInv[item];
      return "You have unlocked the door to The Billiard room...\n>";
    } else if (roomLookUp[currentRoom].inventory[item].name === "second key") {
      delete playerInv[item];
      return "You have unlocked the door to The Library...\n>";
    } else if (roomLookUp[currentRoom].inventory[item].name === "third key") {
      delete playerInv[item];
      return "You have unlocked the door to the Study...\n>";
    } else if (roomLookUp[currentRoom].inventory[item].name === "computer") {
      return roomLookUp[currentRoom].inventory[item].desc;
    } else if (roomLookUp[currentRoom].inventory[item].name === "keypad") {
      return roomLookUp[currentRoom].inventory[item].desc;
    } else if (roomLookUp[currentRoom].inventory[item].name === "carKey") {
      return "As Post Malone said..'Congratulations!!!'. You've beaten my Escape The Room!!";
    }
  }
  moveTo(roomName) {
    playerLoc(roomName);
  }
  read(item) {
    return roomLookUp[currentRoom].inventory[item].desc;
  }
  type(password) {
    if (password === "garrison") {
      return "You hear a door unlock from the other room...maybe it leads to the Kitchen...\n>";
    } else {
      return "Password Invalid...please try again...\n>";
    }
  }
  enter(code) {
    if (code === "5183") {
      return "The keypad glows green and unlocks the Shed...\n>";
    } else {
      return "The keypad buzzes. Try another code...\n>";
    }
  }
}

/* Seven Room Instances */

let Lounge = new Rooms(
  "Lounge",
  {
    key: {
      name: "first key",
      desc: "You have found your first key!\n>",
      takeable: true,
    },
  },
  "A dim lamp fills the room allowing you to see a few scattered chairs, a round table in the center of the room and a door across the room. On this table you see a dark brown colored whiskey bottle next to a cigarette put out in an ash tray. Laying on one of the chairs is a candle stick and a match box. What are you going to do next?\n>"
);

let Billiard = new Rooms(
  "Billiard Room",
  {
    key: {
      name: "second key",
      desc: "You have found your second key!\n>",
      takeable: true,
    },
    painting: {
      name: "painting",
      desc: "As you take the painting off the wall, a key drops on to the floor from behind the painting...\n>",
      takeable: true,
    },
  },
  "Walking in to The Billiard Room, you see a pool table a few chairs surrounding and an odd painting hanging above one of the chairs...\n>"
);

let Library = new Rooms(
  "Library",
  {
    book: {
      name: "book",
      desc: "As you open the book, it seems like a normal but you flipped a few pages revealing a third key laying in the hidden cut out of the book!\n>",
      takeable: true,
    },
    key: {
      name: "third key",
      desc: "You have found your third key!\n>",
      takeable: true,
    },
  },
  "Walking in to The Library, you see book shelves wrapping around the room and a table in the very center of the room. Sitting on the table is one book titled 'The Shelby's'...\n>"
);

let Study = new Rooms(
  "Study",
  {
    computer: {
      name: "computer",
      desc: "The computer screen radiates a soft light blue across the room and reads 'Password...<_>'...\n>",
      takeable: false,
    },
  },
  "Walking in to The Study, there is only a computer on a desk and a note pad that has a scrambled word written on it that says 'rsonrgia'...\n>"
);

let Kitchen = new Rooms(
  "Kitchen",
  {},
  "As you push the door open, the first thing you notice is four magnets on the fridge door that read '8', '3', '5', and '1'. next to the fridge there is an open door that leads to the backyard...\n>"
);

let Backyard = new Rooms(
  "Backyard",
  {
    keypad: {
      name: "keypad",
      desc: "Enter code...\n>",
      takeable: false,
    },
    car: {
      name: "car",
      desc: "The car door is locked, you need the cars keys...\n>",
      takeable: false,
    },
  },
  "Feeling the cold air on your skin as you step outside into the Backyard, you see a car and a shed with a keypad on it...\n>"
);

let Shed = new Rooms(
  "Shed",
  {
    carKey: {
      name: "car key",
      desc: "car key has been added to your inventory...\n>",
      takeable: true,
    },
  },
  "As the moonlight creeps through the shed windows you see your ticket home hanging in front of you...a singular car key...\n>"
);

/* Room Look Up Table */

let roomLookUp = {
  Lounge: Lounge,
  Billiard: Billiard,
  Library: Library,
  Study: Study,
  Kitchen: Kitchen,
  Backyard: Backyard,
  Shed: Shed,
};

/* Player Inventory */

function getPlayerInv() {
  let responseString = "Current Inventory:\n";
  for (let item in playerInv) {
    responseString += playerInv[item].name + "\n";
  }
  return responseString;
}

let playerInv = {};

/* State/Move Machine */

let currentRoom = "Lounge";

let rooms = {
  Lounge: ["Billiard"],
  Billiard: ["Lounge", "Library", "Study", "Kitchen"],
  Library: ["Billiard"],
  Study: ["Billiard"],
  Kitchen: ["Billiard", "Backyard"],
  Backyard: ["Kitchen", "Shed"],
  Shed: ["Backyard"],
};

function playerLoc(nextLoc) {
  if (rooms[currentRoom].includes(nextLoc)) {
    currentRoom = nextLoc;
    console.log(roomLookUp[currentRoom].describe());
  } else {
    return "You cannot currently access this location...\n>";
  }
}
playerLoc();

/* Text Adventure Async Function */

textAdventure();

async function textAdventure() {
  const welcomeMessage = `Greetings Stranger! You will be playing an Escape the Room Text Adventure: 1940's (War Year's Themed). You will be able to use commands like [take, drop, use, read, type, enter, and move to (move to 'room name ex. Billiard')], You can also type "Inv" to check your inventory.\nWhen you are ready type "begin" to be captured and locked inside "The Garrison" as a 1940's gangster who fixes horse races and gambles their life against all odds to become a success in the harsh society of Birmingham, England...\n>`;

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
    } else if (response.slice(0, 4).toLowerCase() === "drop") {
      playerComm = await ask(roomLookUp[currentRoom].drop(response.slice(5)));
    } else if (response.slice(0, 3).toLowerCase() === "use") {
      playerComm = await ask(roomLookUp[currentRoom].use(response.slice(4)));
    } else if (response.slice(0, 4).toLowerCase() === "read") {
      playerComm = await ask(roomLookUp[currentRoom].read(response.slice(5)));
    } else if (response.slice(0, 7).toLowerCase() === "move to") {
      playerComm = await ask(roomLookUp[currentRoom].moveTo(response.slice(8)));
    } else if (response.slice(0, 4).toLowerCase() === "type") {
      playerComm = await ask(roomLookUp[currentRoom].type(response.slice(5)));
    } else if (response.slice(0, 5).toLowerCase() === "enter") {
      playerComm = await ask(roomLookUp[currentRoom].enter(response.slice(6)));
    } else {
      playerComm = await ask(
        "I didn't understand what you said. Can you repeat that...\n>"
      );
    }
  }
}
