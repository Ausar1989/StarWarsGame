$(document).ready(function() {
  
    var characters = {
      "Mace Windu": {
      name: "Mace Windu",
      health: 190,
      attack: 25,
      defense: 10,
      imageURL: "assets/images/mace-windu.jpg",
      enemyAttackBack: 33
      },
      "Darth Vader": {
      name: "Darth Vader",
      health: 160,
      attack: 30,
      defense: 20,
      imageURL: "assets/images/darth-vader.jpg",
      enemyAttackBack: 15
      },
      "Yoda": {
      name: "Yoda",
      health: 140,
      attack: 27,
      defense: 15,
      imageURL: "assets/images/yoda2.jpg",
      enemyAttackBack: 25
      },
      "Darth Maul": {
      name: "Darth Maul",
      health: 150,
      attack: 35,
      defense: 25,
      imageURL: "assets/images/darth-maul.jpg",
      enemyAttackBack: 10
      }
    };

    var attacker;

    var combatants = [];

    var defender;

    var turnCounter = 1;

    var killCount = 0;

    var renderCharacter = function(character, renderArea) {
      // This block of code builds the character card, and renders it to the page.
      var charDiv = $("<div class='character' data-name='" + character.name + "'>");
      var charName = $("<div class='character-name'>").text(character.name);
      var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageURL);
      var charHealth = $("<div class='character-health'>").text(character.health);
      charDiv.append(charName).append(charImage).append(charHealth);
      $(renderArea).append(charDiv);
    };
  
    // this function will load all the characters into the character section to be selected
    var initializeGame = function() {
      // Loop through the characters object and call the renderCharacter function on each character to render their card.
      for (var key in characters) {
        renderCharacter(characters[key], "#characters-section");
      }
    };
  
    // remember to run the function here
    initializeGame();
  
    // This function handles updating the selected player or the current defender. If there is no selected player/defender this
    // function will also place the character based on the areaRender chosen (e.g. #selected-character or #defender)
    var updateCharacter = function(charObj, areaRender) {
      // First we empty the area so that we can re-render the new object
      $(areaRender).empty();
      renderCharacter(charObj, areaRender);
    };
  
    // This function will render the available-to-attack enemies. This should be run once after a character has been selected
    var renderEnemies = function(enemyArr) {
      for (var i = 0; i < enemyArr.length; i++) {
        renderCharacter(enemyArr[i], "#available-to-attack-section");
      }
    };
  
    // Function to handle rendering game messages.
    var renderMessage = function(message) {
      // Builds the message and appends it to the page.
      var gameMessageSet = $("#game-message");
      var newMessage = $("<div>").text(message);
      gameMessageSet.append(newMessage);
    };
  
    // Function which handles restarting the game after victory or defeat.
    var restartGame = function(resultMessage) {
      // When the 'Restart' button is clicked, reload the page.
      var restart = $("<button>Restart</button>").click(function() {
        location.reload();
      });
  
      // Build div that will display the victory/defeat message.
      var gameState = $("<div>").text(resultMessage);
  
      // Render the restart button and victory/defeat message to the page.
      $("body").append(gameState);
      $("body").append(restart);
    };
  
    // Function to clear the game message section
    var clearMessage = function() {
      var gameMessage = $("#game-message");
  
      gameMessage.text("");
    };
  
    // ===================================================================
  
    // On click event for selecting our character.
    $("#characters-section").on("click", ".character", function() {
      // Saving the clicked character's name.
      var name = $(this).attr("data-name");
  
      // If a player character has not yet been chosen...
      if (!attacker) {
        // We populate attacker with the selected character's information.
        attacker = characters[name];
        // We then loop through the remaining characters and push them to the combatants array.
        for (var key in characters) {
          if (key !== name) {
            combatants.push(characters[key]);
          }
        }
  
        // Hide the character select div.
        $("#characters-section").hide();
  
        // Then render our selected character and our combatants.
        updateCharacter(attacker, "#selected-character");
        renderEnemies(combatants);
      }
    });
  
    // Creates an on click event for each enemy.
    $("#available-to-attack-section").on("click", ".character", function() {
      // Saving the opponent's name.
      var name = $(this).attr("data-name");
  
      // If there is no defender, the clicked enemy will become the defender.
      if ($("#defender").children().length === 0) {
        defender = characters[name];
        updateCharacter(defender, "#defender");
  
        // remove element as it will now be a new defender
        $(this).remove();
        clearMessage();
      }
    });
  
    // When you click the attack button, run the following game logic...
    $("#attack-button").on("click", function() {
      // If there is a defender, combat will occur.
      if ($("#defender").children().length !== 0) {
        // Creates messages for our attack and our opponents counter attack.
        var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage; defender's defense subtracted.";
        var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage; your defense subtracted.";
        clearMessage();
  
        // Reduce defender's health by your attack value.
        defender.health -= attacker.attack * turnCounter - defender.defense;
  
        // If the enemy still has health..
        if (defender.health > 0) {
          // Render the enemy's updated character card.
          updateCharacter(defender, "#defender");
  
          // Render the combat messages.
          renderMessage(attackMessage);
          renderMessage(counterAttackMessage);
  
          // Reduce your health by the opponent's attack value.
          attacker.health -= defender.enemyAttackBack - attacker.defense;
  
          // Render the player's updated character card.
          updateCharacter(attacker, "#selected-character");
  
          // If you have less than zero health the game ends.
          // We call the restartGame function to allow the user to restart the game and play again.
          if (attacker.health <= 0) {
            clearMessage();
            restartGame("You have been defeated...GAME OVER!!!");
            $("#attack-button").off("click");
          }
        }
        else {
          // If the enemy has less than zero health they are defeated.
          // Remove your opponent's character card.
          $("#defender").empty();
  
          var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another enemy.";
          renderMessage(gameStateMessage);
  
          // Increment your kill count.
          killCount++;
  
          // If you have killed all of your opponents you win.
          // Call the restartGame function to allow the user to restart the game and play again.
          if (killCount >= combatants.length) {
            clearMessage();
            $("#attack-button").off("click");
            restartGame("You Won!!!! GAME OVER!!!");
          }
        }
        // Increment turn counter. This is used for determining how much damage the player does.
        turnCounter++;
      }
      else {
        // If there is no defender, render an error message.
        clearMessage();
        renderMessage("No enemy here.");
      }
    });

});


