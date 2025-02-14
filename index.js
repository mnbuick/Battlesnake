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

import e from 'express';
import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "",       // TODO: Your Battlesnake Username
    color: "#888888", // TODO: Choose color
    head: "default",  // TODO: Choose head
    tail: "default",  // TODO: Choose tail
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

  // Constants
  const myHead = gameState.you.body[0];
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  
  // You
  let myBody = gameState.you.body;

  // Prevent your Battlesnake from moving out of bounds
   if(myHead.x == 0){
    isMoveSafe.left = false;
   }
   if (myHead.x == boardWidth-1) {
    isMoveSafe.right = false;
  }
  if (myHead.y == 0) {
    isMoveSafe.down = false;
  }
  if (myHead.y == boardHeight-1) {
    isMoveSafe.up = false;
  }

  // Prevent Battlesnake from colliding with itself or other Battlesnakes
  let opponents = gameState.board.snakes;
  for(let i = 0; i < opponents.length; i++){
    let snake = opponents[i].body;
    for(let j = 0; j < snake.length; j++){
      let bodyPart = snake[j];
      if(myHead.x + 1 == bodyPart.x && myHead.y == bodyPart.y){
        isMoveSafe.right = false;
      } else if(myHead.x - 1 == bodyPart.x && myHead.y == bodyPart.y){
        isMoveSafe.left = false;
      } else if(myHead.y + 1 == bodyPart.y && myHead.x == bodyPart.x){
        isMoveSafe.up = false;
      } else if(myHead.y - 1 == bodyPart.y && myHead.x == bodyPart.x){
        isMoveSafe.down = false;
      }
    }
  }

  
  // Avoid head on collisions with other snakes
  for(let i = 0; i < opponents.length; i++){
    let snake = opponents[i].body;
    let snakeHead = snake[0];
    if(snake.length >= myBody.length){
      if((myHead.x - 1 == snakeHead.x && myHead.y+ 1 == snakeHead.y ) || (myHead.x+ 1 == snakeHead.x  && myHead.y+ 1 == snakeHead.y ) || (myHead.x == snakeHead.x  && myHead.y + 2 == snakeHead.y)){
        isMoveSafe.up = false;
        console.log("test1");
      }
      if((myHead.x - 1 == snakeHead.x  && myHead.y- 1 == snakeHead.y ) || (myHead.x+ 1 == snakeHead.x  && myHead.y- 1 == snakeHead.y ) || (myHead.x == snakeHead.x  && myHead.y - 2 == snakeHead.y)){
        isMoveSafe.down = false;
        console.log("test2");
      }
      if((myHead.x + 1 == snakeHead.x && myHead.y + 1 == snakeHead.y) || (myHead.x + 1 == snakeHead.x && myHead.y - 1 == snakeHead.y) || (myHead.x+ 2 == snakeHead.x   && myHead.y == snakeHead.y)){
        isMoveSafe.right = false;
        console.log("test3");
      }
      if((myHead.x - 1 == snakeHead.x && myHead.y+ 1 == snakeHead.y ) || (myHead.x - 1 == snakeHead.x && myHead.y - 1 == snakeHead.y) || (myHead.x- 2  == snakeHead.x  && myHead.y == snakeHead.y)){
        isMoveSafe.left = false;
        console.log("test4");
      }
    }
  }
  

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

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
