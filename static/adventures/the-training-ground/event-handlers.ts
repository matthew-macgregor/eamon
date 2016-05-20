import {Game} from "../../core/models/game";
import {Artifact} from "../../core/models/artifact";
import {Monster} from "../../core/models/monster";
import {ReadCommand, OpenCommand} from "../../core/commands/core-commands";
import {RoomExit} from "../../core/models/room";
import {Room} from "../../core/models/room";

export var event_handlers = {

  "start": function(arg: string) {
    let game = Game.getInstance();

    // add your custom game start code here
    game.effects.print(17);
    if (game.player.armor_expertise > 25) {
      game.effects.print(18);
    }
    let a = game.player.gender === 'm' ? "son" : "miss";
    game.history.write('"OK, let\'s be careful in there, ' + a + '", he says, as he walks away.');

    // set up game data
    game.data["red_sun_speaks"] = false;
    game.data["jacques_shouts"] = false;
    game.data["kobolds_appear"] = false;
    game.data["sylvani_speaks"] = false;
    game.data["thors_hammer_found"] = false;
    game.data["thors_hammer_courage"] = [];
    game.data["secret_library"] = false;
    game.data["sounds_room_26"] = false;
    game.data["sex_change_counter"] = 0;
    game.data["charisma_boost"] = false;

    // set the "seen" flag on kobold6 and the dummy obsidian scroll case
    game.monsters.get(11).seen = true;
    game.artifacts.get(51).seen = true;
    game.artifacts.get(51).name = game.artifacts.get(30).name;

    // rename the "graffiti" artifacts
    for (let a = 46; a <= 50; a++) {
      game.artifacts.get(a).name = game.artifacts.get(46).name;
    }

  },

  "endTurn": function() {
    let game = Game.getInstance();
    // jacques shouts at you from the room he's locked in
    if (game.rooms.current_room.id === 8 && !game.data["jacques_shouts"]) {
      game.effects.print(5);
      game.data["jacques_shouts"] = true;
    }
    // Kobolds appear (30% chance)
    if (game.player.room_id >= 11 && game.player.room_id <= 15 && !game.data["kobolds_appear"]) {
      let roll = game.diceRoll(1, 100);
      if (roll < 31) {
        for (let i = 6; i <= 9; i++) {
          game.monsters.get(i).room_id = game.player.room_id;
        }
        game.data['kobolds_appear'] = true;
      }
    }
    // You hear sounds...
    if (game.player.room_id === 26 && !game.data["sounds_room_26"]) {
      game.effects.print(15);
      game.data["sounds_room_26"] = true;
    }
    // Zapf the Conjurer brings in strangers (15% Chance)
    if (game.monsters.get(15).isHere()) {
      let roll = game.diceRoll(1, 100);
      if (roll <= 15) {
        game.effects.print(16, "special");
        let m = game.monsters.getRandom();
        // Zapf's spell only brings in monsters the player has already seen
        if (!m.isHere() && !m.seen) {
          game.history.write("<<POOF!!>>  " + m.name + " appears!", "special");
          m.room_id = game.player.room_id;
        }
      }
    }
  },

  "endTurn2": function() {
    let game = Game.getInstance();
    // some monsters speak when you first see them. this happens in the "endTurn2" event because their words should
    // appear after their descriptions.

    // red sun's opening remarks
    if (game.monsters.get(1).isHere() && !game.data["red_sun_speaks"]) {
      game.effects.print(4);
      game.data["red_sun_speaks"] = true;
    }
    // Sylvani speaks
    if (game.monsters.get(12).isHere() && !game.data["sylvani_speaks"]) {
      game.effects.print(6);
      game.data["sylvani_speaks"] = true;
    }
  },

  "beforeGet": function(arg: string, artifact: Artifact) {
    let game = Game.getInstance();
    // special handling for the obsidian scroll case, which is a concealed monster and is replaced with a
    // dummy artifact when you try to get it.
    // (#30 is the "concealed monster" version which summons the emerald warrior. #51 is the dummy version.)
    if (artifact && artifact.id === 30) {
      game.artifacts.get(51).room_id = game.player.room_id;
    }
    return true;
  },

  "afterGet": function (arg: string, artifact: Artifact) {
    let game = Game.getInstance();
    // Taking Purple book reveals secret passage
    if (artifact && artifact.id === 27 && game.player.room_id === 24 && !game.data["secret_library"]) {
      game.effects.print(12, "special");
      game.rooms.getRoomById(24).getExit("e").room_to = 25;
      game.rooms.getRoomById(24).name = "You are in the library. (E/W)";
      game.data["secret_library"] = true;
    }
  },

  "read": function(arg: string, artifact: Artifact, command: ReadCommand) {
    let game = Game.getInstance();
    // Plain scroll increases BLAST ability
    if (artifact && artifact.id === 29) {
      game.player.spell_abilities["blast"] += 250;  // big boost to current spell ability
      game.player.spell_abilities_original["blast"] += 10;  // smaller boost to permanent spell ability
      artifact.destroy();
      command.markings_read = true;
    }
  },

  "ready": function(arg: string, old_wpn: Artifact, new_wpn: Artifact) {
    let game = Game.getInstance();
    // player tries to ready the Hammer of Thor
    if (new_wpn.id === 24) {
      game.history.write("Only Thor himself could do that!", "special");
      return false;
    }
    return true;
  },

  "use": function(arg: string, artifact: Artifact) {
    let game = Game.getInstance();
    // use the thor's hammer
    if (artifact && artifact.id === 24) {
      game.command_parser.run('say thor');
    }
  },

  "give": function(arg: string, artifact: Artifact, monster: Monster) {
    let game = Game.getInstance();
    // Give obsidian scroll case to Emerald Warrior
    if (monster.id === 14 && artifact.id === 51) {
      game.effects.print(14);
      game.monsters.get(14).room_id = null;
    }
    // giving the rapier to Jacques
    if (monster.id === 5 && artifact.id === 8) {
      game.effects.print(22);
    }
    return true;
  },

  "say": function(arg: string) {
    let game = Game.getInstance();
    if (arg === 'thor' && game.artifacts.get(24).isHere()) {
      game.effects.print(32);
      for (let i in game.monsters.visible) {
        let m = game.monsters.visible[i];
        if (game.data["thors_hammer_courage"].indexOf(m.id) !== -1 && m.reaction === Monster.RX_HOSTILE) {
          m.courage /= 4;
          // this effect can only happen once per monster
          game.data["thors_hammer_courage"].push(m.id);
        }
      }
    }

  },

  // TODO: attack/blast bozworth

  // every adventure should have a "power" event handler.
  // 'power' event handler takes a 1d100 dice roll as an argument
  "power": function(roll) {
    let game = Game.getInstance();
    if (!game.data["thors_hammer_found"] && game.player.room_id === 22 && !game.artifacts.get(24).seen) {
      game.effects.print(7, "special");
      game.artifacts.get(24).room_id = game.player.room_id;
      game.data["thors_hammer_found"] = true;
      return;
    }

    // 20% chance of sex change
    if (roll < 21 && game.data["sex_change_counter"] < 2) {
      game.data["sex_change_counter"]++;
      let word = game.player.gender === "m" ? "feminine" : "masculine";
      game.history.write("You feel different...more " + word + ".");
      game.player.gender = game.player.gender === "m" ? "f" : "m";
      return;
    }
    // 40% chance Charisma up (one time only)
    if (roll < 41 && !game.data["charisma_boost"]) {
      game.data["charisma_boost"] = true;
      let word = game.player.gender === "m" ? "handsome" : "beautiful";
      game.player.charisma += 2;
      return;
    }
    // 5% Chance of being hit by lightning!
    if (roll > 94) {
      game.effects.print(33, "danger");
      game.player.injure(10, true);
      return;
    }
    // default
    game.history.write("You hear a loud sonic boom which echoes all around you!");
  },

}; // end event handlers


// declare any functions used by event handlers and custom commands
