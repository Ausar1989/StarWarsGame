$(document).ready(function() {
  
    var characters = {
      "Mace Windu": {
      name: "Mace Windu",
      imageURL: "assets/images/mace-windu.jpg",
      health: 190,
      attack: 20,
      enemyAttackBack: 33
      },
      "Darth Vader": {
      name: "Darth Vader",
      imageURL: "assets/images/darth-vader.jpg",
      health: 160,
      attack: 30,
      enemyAttackBack: 15
      },
      "Yoda": {
      name: "Yoda",
      imageURL: "assets/images/yoda.jpg",
      health: 140,
      attack: 25,
      enemyAttackBack: 25
      },
      "Palpatine": {
      name: "Palpatine",
      imageURL: "assets/images/palpatine.jpg",
      health: 150,
      attack: 35,
      enemyAttackBack: 10
      }
    };

    var attacker;

    var combatants = [];

    var defender;

    var turnCounter = 1;

    var killCount = 0;

    function renderCharacter(character, renderArea) {
     var charDiv = $("<div class='character' data-name='" + character.name + "'>");
     var charName = $("<div class='character-name'>").text(character.name);
     var charImage = $("<img alt='image' class='character-name'>").attr("src", character.imageURL);
     var charHealth =$("<div class='character-health'>").text(character.health);
     $(charDiv).append(charName).append(charImage).append(charHealth);
     $(renderArea).append(charDiv);
    };

    function initializeGame() {
     for (var key in characters) {
         renderCharacter(characters[key], "#characters-selection");
     }
    };

    initializeGame();

    function updateCharacter(charObj,areaRender) {
     $(areaRender).empty();
     renderCharacter(charObj, areaRender);
    };

    function renderEnemies(enemyArr) {
     for (var i = 0; i < enemyArr.length; i++) {
        renderCharacter(enemyArr, "#available-to-attack-section"); 
     }
    };

    function renderMessage(message) {
     var gameMessageSet = $("#game-message");
     var newMessage = $("<div>").text(message);  
     gameMessageSet.append(newMessage); 
    };

    function restartGame(resultMessage) {
     var restart = $("<button>Restart<button>").click(function() {
         location.reload();
     }) 
     
     var gameState = $("<div>").text(resultMessage);

     $("body").append(gameState);
     $("body").append(restart);
    };

    function clearMessage() {
     var gameMessage = $("#game-message");
     
     gameMessage.text("");
    };

    $("#characters-section").on("click", ".characters", function() {
        var name = $(this).attr("data-name");

        if (!attacker) {
          attacker = characters[name];

          for (var key in characters) {
              if(key !== name) {
                  combatants.push(characters[key]);
              }
          }
          
          $("characters-section").hide();

          updateCharacter(attacker, "#selected-character");
          renderEnemies(combatants);
        }
    });

    $("#available-to-attack-section").on("click", ".characters", function() {
        var name =$(this).attr("data-name");


        if($(defender).children().length === 0) {
          defender = characters[name];
          updateCharacter(defender, "#defender");
          
          
          $(this).remove();
          clearMessage();
        }
    });

    $("#attack-button").on("click", function() {
        if ($("#defender").children().length !== 0) {
            // Creates messages for our attack and our opponents counter attack.
            var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage.";
            var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage.";
            clearMessage();
      
            // Reduce defender's health by your attack value.
            defender.health -= attacker.attack * turnCounter;
      
            // If the enemy still has health..
            if (defender.health > 0) {
              // Render the enemy's updated character card.
              updateCharacter(defender, "#defender");
      
              // Render the combat messages.
              renderMessage(attackMessage);
              renderMessage(counterAttackMessage);
      
              // Reduce your health by the opponent's attack value.
              attacker.health -= defender.enemyAttackBack;
      
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
    })

});


