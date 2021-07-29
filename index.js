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
// Each room instance has three parameters (name, inventory & a description), Also inside the class there are 8 methods (7 out of 8 methods are player commands)
class Rooms {
  constructor(name, inventory = [], desc, locked) {
    this.name = name;
    this.inventory = inventory;
    this.desc = desc;
    this.locked = locked;
  }
  // checks if an item exists in a rooms inventory, if an item is takeable or not & anything else it will add the item to the player inventory, reassign an items take ability to false and return the items description
  take(item) {
    //checks if the item is painting or book then make the key's takeable = true
    if (item === "painting" || item === "book") {
      roomLookUp[currentRoom].inventory.key.takeable = true;
    }
    //if the item the user typed cannot be found then return the prompt
    if (roomLookUp[currentRoom].inventory[item] === undefined) {
      return "This item does not exist...\n>";
      //if the item's takeable = false then return the prompt
    } else if (roomLookUp[currentRoom].inventory[item].takeable === false) {
      return "This item is already in your inventory or it cannot be taken yet...\n>";
      //anything else move room inventory item to player inventory, make its takeable false and return the items description
    } else {
      playerInv[item] = roomLookUp[currentRoom].inventory[item];
      roomLookUp[currentRoom].inventory[item].takeable = false;
      return roomLookUp[currentRoom].inventory[item].desc;
    }
  } // will check if the item inside the players inventory is not undefined and will delete it from there, reassign the take ability of the item to true and print a message telling the player they dropped that item
  drop(item) {
    if (playerInv[item] != undefined) {
      delete playerInv[item];
      roomLookUp[currentRoom].inventory[item].takeable = true;
      return "Successfully dropped " + item + "...";
      //if they drop the item painting then return the prompt
    } else if (playerInv[item] === "painting") {
      return "Sorry but this painting is priceless, you cannot take it..";
      //for anything else then return the prompt
    } else {
      return "Item " + item + " is not in your inventory";
    }
  } // checks against, specified item names and prints specified descriptions for the different cases
  use(item) {
    //if item = any of the four items below then proceed to the next if block
    if (
      item === "key" ||
      item === "computer" ||
      item === "keypad" ||
      item === "carKey"
    ) {
      //if user tries to use anything in the shed then return prompt
      if (
        roomLookUp[currentRoom].name === "Shed"
      ) {
        return "You cannot use this item in the shed...\n>";
        //if item = car key then return the prompt
      } else if (item === "carKey") {
        return "As Post Malone once said..'Congratulations!!!'. You've beaten my Escape The Room!!";
        //if item = key pad then return the items description
      } else if (roomLookUp[currentRoom].inventory[item].name === "keypad") {
        return roomLookUp[currentRoom].inventory[item].desc;
        //if item = computer then return the items description
      } else if (roomLookUp[currentRoom].inventory[item].name === "computer") {
        return roomLookUp[currentRoom].inventory[item].desc;
      }
      //if there is no key in the players inventory then return the prompt
      if (playerInv.key === undefined) {
        return `You don't have ${item} in your inventory yet or you cannot use this item...\n>`;
        //for anything else then check the item key's name
      } else {
        //if first key then delete from player inventory and unlock the next room and return the prompt
        //the same thing goes for the second and third keys
        if (playerInv.key.name === "first key") {
          delete playerInv[item];
          roomLookUp.Billiard.locked = false;
          return "You have unlocked the door to The Billiard room... You can now use to move to command to enter the Billiard room...\n>";
        } else if (playerInv.key.name === "second key") {
          delete playerInv[item];
          roomLookUp.Library.locked = false;
          return "You have unlocked the door to The Library... You can now use to move to command to enter the Library room...\n>";
          //if the player has the third key and is in the Library return the prompt
        } else if (
          playerInv.key.name === "third key" &&
          roomLookUp[currentRoom].name === "Library"
        ) {
          return "You must move to the Billiard room to use the key...\n>";
          //if player is in Billiard room and has third key then delete the item from the inventory and unlock the next room then return the rooms description
        } else if (
          playerInv.key.name === "third key" &&
          roomLookUp[currentRoom].name === "Billiard"
        ) {
          delete playerInv[item];
          roomLookUp.Study.locked = false;
          return "You have unlocked the door to the Study...\n>";
        }
      }
      //anything else return the prompt
    } else {
      return "That is not an item...\n>";
    }
  } // calls the state machine function to input players move request and moves them to the specified room if possible. Also adds their current inventory into the next rooms inventory.
  moveTo(roomName) {
    //checks if the room name entered was any of the rooms listed below. if so then proceed with method
    if (
      roomName === "Billiard" ||
      roomName === "Library" ||
      roomName === "Study" ||
      roomName === "Kitchen" ||
      roomName === "Shed" ||
      roomName === "Backyard"
    ) {
      //if the room locked = true then return prompt
      if (roomLookUp[roomName].locked === true) {
        return "The room is locked, your going to need a key to unlock the door...\n>";
        //if roomName is true then return playerLoc function passing through the roomName
      } else if (roomName) {
        return playerLoc(roomName);
        //if the rooms key takeable is true then return the prompt
      } else if (roomLookUp[currentRoom].inventory.key.takeable === true) {
        return "This room is locked, looks like you need a key...\n>";
      }
      //anything else then return prompt
    } else {
      return "Please use the move to command followed by the properly spelled room name...\n>";
    }
  }
  //checks the players "password" input and either prints the next leading message with clues or says they need to try again
  type(password) {
    if (password === "garrison") {
      roomLookUp.Kitchen.locked = false;
      return "You hear a door unlock from the other room...maybe it leads to the Kitchen...\n>";
    } else {
      return "Password Invalid...please try again...You might want to re read the Welcome Message\n>";
    }
  } //checks the players entered code and either prints the next leading message with clues or says they need to try again
  enter(code) {
    if (code === "5183") {
      roomLookUp.Shed.locked = false;
      return "The keypad glows green and unlocks the Shed...\n>";
    } else {
      return "The keypad buzzes. Try another code...I'll give you a clue, the third number is even...\n>";
    }
  }
}

/* Seven Room Instances */

//inside each room instances inventory there are three keys labeled name, desc(description) & if it takeable or not defining each item
let Lounge = new Rooms(
  "Lounge",
  {
    key: {
      name: "first key",
      desc: "You have found your first key!\n>",
      takeable: true,
    },
  },
  "A dim lamp fills the room allowing you to see a few scattered chairs, a round table in the center of the room and a door across the room. On this table you see a key...What are you going to do next?\n>",
  false
);

let Billiard = new Rooms(
  "Billiard",
  {
    key: {
      name: "second key",
      desc: "You have found your second key!\n>",
      takeable: false,
    },
    painting: {
      name: "painting",
      desc: "As you take the painting off the wall, a key drops on to the floor from behind the painting...\n>",
      takeable: true,
    },
  },
  "Walking in to The Billiard Room, you see a pool table a few chairs surrounding and an odd painting hanging above one of the chairs...\n>",
  true
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
      takeable: false,
    },
  },
  "Walking in to The Library, you see book shelves wrapping around the room and a table in the very center of the room. Sitting on the table is one book titled 'The Shelby's'...\n>",
  true
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
  "Walking in to The Study, there is only a computer on a desk and a note pad that has a scrambled word written on it that says 'rsonrgia'...\n>",
  true
);

let Kitchen = new Rooms(
  "Kitchen",
  {},
  "As you push the door open, the first thing you notice is four magnets on the fridge door that read '8', '3', '5', and '1'. next to the fridge there is an open door that leads to the Backyard...\n>",
  true
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
  "Feeling the cold air on your skin as you step outside into the Backyard, you see a car and a shed with a keypad on it...\n>",
  false
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
  "As the moonlight creeps through the shed windows you see your ticket home hanging in front of you...a singular carKey...\n>",
  true
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

//Player inventory function that assigns a variable the players inventory and through a loop it adds the newly added item to the player inventory and prints it out
function getPlayerInv() {
  let responseString = "Current Inventory:\n";
  for (let item in playerInv) {
    responseString += playerInv[item].name + "\n";
  }
  return responseString;
}

//Player Inventory

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
//state machine function that changes the players location to the specified room if possible
function playerLoc(nextLoc) {
  if (rooms[currentRoom].includes(nextLoc)) {
    currentRoom = nextLoc;
    return roomLookUp[currentRoom].name + "\n" + roomLookUp[currentRoom].desc;
  } else {
    return "You cannot currently access this location or you are in a room that isn't connected to the room you are trying to reach...\n>";
  }
}

/* Text Adventure Async Function */

textAdventure();
//main game function that starts with a welcome message explaining the game and waits for the player to type begin to begin, if anything else it loops over a message saying that input is invalid
async function textAdventure() {
  const welcomeMessage = `Greetings Stranger! You will be playing an Escape the Room Text Adventure: 1940's (War Year's Themed). You will be able to use commands like [take, drop, use, type, enter, and move to (move to 'room name ex. Billiard')], You can also type "Inv" to check your inventory.\nWhen you are ready type "begin" to be captured and locked inside "The Garrison" as a 1940's gangster who fixes horse races and gambles their life against all odds to become a success in the harsh society of Birmingham, England...\n>`;

  let answer = await ask(welcomeMessage);
  //while loop checking for user input of begin, if so then prompt the user with the first rooms name and description. If no then return the prompt saying that incorrect and loop back
  while (true) {
    if (answer.toLowerCase() === "begin") {
      break;
    } else {
      answer = await ask(
        "Please type begin, none of that gibberesh will suffice.\n>"
      );
    }
  }
  //prints the first rooms name and description, awaiting for the players next input
  let playerComm = await ask(
    `${roomLookUp[currentRoom].name}\n${roomLookUp[currentRoom].desc}`
  );
  //while loop that will check the players input for any commands calling their matching method in the Rooms class and run the target through its parameter. If no response is valid it displays a message saying "I do not understand that, please repeat"
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
    } else if (response.slice(0, 7).toLowerCase() === "move to") {
      playerComm = await ask(
        await roomLookUp[currentRoom].moveTo(response.slice(8))
      );
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
