// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "robinleaver",
    color: "#57b3cf",
    head: "beluga", 
    tail: "do-sammy", 
  };
}


// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// return the coordinates of an adjacent tile (to head)
function getAdjacentTiles(head){
  let adjacentTiles = {
    left: {"x":(head.x - 1), "y":head.y},
    right: {"x":(head.x + 1), "y":head.y},
    up: {"x":head.x, "y":(head.y + 1)},
    down: {"x":head.x, "y":(head.y - 1)}
  };

  return adjacentTiles;
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

   // Prevent Battlesnake from colliding with itself and other snakes
  const myHead = gameState.you.body[0];
  const myBody = gameState.you.body;
  const snakes = gameState.board.snakes;
  const adjacentTiles = getAdjacentTiles(myHead);
  console.log(adjacentTiles);

  // Check for any snakes including you in adjacent tiles
  function checkForSnakes(snake) {
    if (snake.body.find(element => element.x == adjacentTiles.left.x && element.y == adjacentTiles.left.y)) {        // Body is left of head, don't move left
      isMoveSafe.left = false;
    }
    if (snake.body.find(element => element.x == adjacentTiles.right.x && element.y == adjacentTiles.right.y)) { // Body is right of head, don't move right
      isMoveSafe.right = false;
    }
    if (snake.body.find(element => element.x == adjacentTiles.down.x && element.y == adjacentTiles.down.y)) { // Body is below head, don't move down
      isMoveSafe.down = false;
    } 
    if (snake.body.find(element => element.x == adjacentTiles.up.x && element.y == adjacentTiles.up.y)) { // Body is above head, don't move up
      isMoveSafe.up = false;
    }
  }
  
  snakes.forEach(checkForSnakes);

  console.log(isMoveSafe);
  // Prevent Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  if (myHead.x == 0){  // Head is at the left edge
    isMoveSafe.left = false;
  }

  if (myHead.x == (boardWidth - 1)) {  // Head is at the right edge
    isMoveSafe.right = false;
  }

  if (myHead.y == 0){  // Head is at the bottom edge
    isMoveSafe.down = false;
  }

  if (myHead.y == (boardHeight - 1)){  // Head is at the top edge
    isMoveSafe.up = false;
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  // myBody = gameState.you.body;

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // opponents = gameState.board.snakes;

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  // console.log(gameState);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});


// Find Food
// Get array of directions needed to move in to get to food (difference between x and y coordinates should only ever one or two)
// Choose a direction from array that is safe