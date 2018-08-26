// define character object
var arObChars = [{ "name": "Eddard", "picture": "Eddard.jpg", "health": 150, "attack": 9, "counter": 15 },
{ "name": "Robert", "picture": "Robert.jpg", "health": 160, "attack": 11, "counter": 15 },
{ "name": "Joffery", "picture": "Joffery.jpg", "health": 140, "attack": 8, "counter": 14 },
{ "name": "Drago", "picture": "Drago.jpg", "health": 120, "attack": 10, "counter": 25 }];

// define variables
var playerID = -1;
var enemyID = -1;
var playerHealth = 0;
var playerAttack = 0;
var enemyHealth = 0;
var opponentsLeft = 0;
// flags
var gameRunning = false;
var playerPicked = false;
var enemyPicked = false;

// define html tags
var $characters = $("#characters");
var $player = $("#player");
var $enemy = $("#enemy");
var $opponets = $("#opponets");
var $messages = $("#messages");
var $attack = $("#attack");
var $newGame = $("#newGame");
var $playerHealth;
var $enemyHealth;

// function to display opening game board
//   for each character object
//     call create character card (character, characters)
function newGame() {
  for (var i = 0; i < arObChars.length; i++) {
    createCharCard(i, $characters);
  }
  $(".card").click(function () {
    if (!playerPicked) {
      var idSeleted = $(this).attr("id");
      playerSelected(idSeleted);
      playerPicked = true;
    }
  });

  $player.empty();
  $enemy.empty();
  $opponets.empty();
  $messages.text("Select a character to play.")
  $attack.hide();
  $newGame.hide();
  playerID = -1;
  enemyID = -1;
  gameRunning = true;
  playerPicked = false;
  enemyPicked = false;
  playerHealth = 0;
  playerAttack = 0;
  enemyHealth = 0;
}


// function create character card (character_object, location)
//   Create card div
//     add character name
//     add character image
//     add character health
//   add card to location
function createCharCard(intChar, $obPos) {
  var obCard = $("<div>");
  obCard.addClass("card m-auto charCard");
  obCard.attr("id", intChar);
  obCard.append("<h4>" + arObChars[intChar]["name"] + "</h4>");
  obCard.append('<img class="charPicture" src="./assets/images/' + arObChars[intChar]["picture"] + '" alt=' + arObChars[intChar]["name"] + '/>');
  obCard.append("<h5 class='health'>" + arObChars[intChar]["health"] + "</h5>");
  $obPos.append(obCard);
}

// on click event on characters div
//   get character clicked
//   call create character card (character_selected, player)
//   for the other character
//     call create character card (character, oppents)
//   hide character div
function playerSelected(idSelected) {
  for (var i = 0; i < arObChars.length; i++) {
    if (idSelected == i) {
      createCharCard(i, $player);
      $playerHealth = $("#player .card .health");
      playerID = i;
      playerHealth = arObChars[i]["health"];
      playerAttack = arObChars[i]["attack"];
    } else {
      createCharCard(i, $opponets);
    }
  }
  opponentsLeft = arObChars.length - 1;
  $characters.empty();
  $messages.text("Select who to fight.")

  $("#opponets .card").click(function () {
    if (!enemyPicked) {
      var idSeleted = $(this).attr("id");
      enemySelected(idSeleted);
      enemyPicked = true;
    }
  });

}

// on click event on opponets div
//   get character clicked
//   call create character card (character_selected, enemy)
//   remove character from opponets
function enemySelected(idSelected) {
  createCharCard(idSelected, $enemy);
  $enemyHealth = $("#enemy .card .health");
  enemyID = idSelected;
  enemyHealth = arObChars[idSelected]["health"];
  enemyPicked = true;
  var opponentCards = $("#opponets .card");
  for (var i = 0; i < opponentCards.length; i++) {
    if (opponentCards[i]["id"] === idSelected) {
      opponentCards[i].remove();
    }
  }
  $attack.show();
  $messages.text("Click 'Attack' to strike the opponent.");
}
// on click event on attack button
//   enemy takes players attack
//   display player's attack result
//   if enemy's health zero or less
//     remove charater from enemy
//     if opponets list is empty
//        display player wins
//        mark game end and exit 
//   else
//     update enemy health
//     player takes enemy's counter attack
//     display enemy's counter attack result
//     if player's health zero
//        display plyer loses
//        mark game end and exit 
function attackEnemy() {
  enemyHealth -= playerAttack;
  $messages.text("You struck your opponent for " + playerAttack + " damage!");
  if (enemyHealth <= 0) {
    $messages.append("<br>You have vanquished " + arObChars[enemyID]["name"] + "!");
    $enemy.empty();
    enemyPicked = false;
    opponentsLeft--;
    if (opponentsLeft > 0) {
      $messages.append("<br>Select your next opponent.");
    } else {
      $messages.append("<br>Congratulations, that was your last opponent, you win!");
      gameRunning = false;
      $newGame.show();
      $attack.hide();
    }
  } else {
    $enemyHealth.text(enemyHealth);
    playerHealth -= arObChars[enemyID]["counter"];
    $messages.append("<br>" + arObChars[enemyID]["name"] + " counter attacked you doing " + arObChars[enemyID]["counter"] + " damage!");
    if (playerHealth <= 0) {
      $playerHealth.text("0");
      $messages.append("<br>You have been defeated by " + arObChars[enemyID]["name"] + "!");
      $attack.hide();
      $newGame.show();
      gameRunning = false;
    } else {
      $playerHealth.text(playerHealth);
    }
  }
  playerAttack += arObChars[playerID]["attack"];
}

$(document).ready(function () {
  // call display opening game board
  newGame();

  $("#newGame").click(function () {
    if (!gameRunning) {
      newGame();
    }
  });

  $("#attack").click(function () {
    if (playerPicked && enemyPicked) {
      attackEnemy();
    } else {
      console.log("Player " + playerPicked + " Enemy " + enemyPicked);
    }
  });

});
