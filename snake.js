
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var score = document.querySelector('.score');

  // the canvas width & height, snake x & y, and the apple x & y, all need to be a multiples of the grid size in order for collision detection to work
  // (e.g. 16 * 25 = 400)
var grid = 16;
var count = 0;

  //score counter
var points = 0;
  //snake position start
var snake = {
  x: 160,
  y: 160,

  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // keep track of all grids the snake body occupies
  cells: [],

  // length of the snake. grows when eating an apple
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

var apple2 = {
  x: 360,
  y: 360
};

var cr = 'rgb('+
    Math.floor(Math.random()*256)+','+
    Math.floor(Math.random()*256)+','+
    Math.floor(Math.random()*256)+')';

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


// game loop
function loop() {
  requestAnimationFrame(loop);
  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 30) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  //increase velocity after collecting 6 12 and 18 foods
  if(points >= 5){
    count = 15;
  }
  if(points >= 10){
    count = 20;
  }
  if(points >= 15){
    count = 25;
  }
  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // draw snake one cell at a time
  context.fillStyle = cr;
  snake.cells.forEach(function(cell, index) {

    // drawing 1 px or less smaller than the grid creates a grid effect in the snake body so you can see how long it is
    
    context.fillRect(cell.x, cell.y, grid-0.5, grid-0.5);
    

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        // randomize color
        cr = 'rgb('+
        Math.floor(Math.random()*256)+','+
        Math.floor(Math.random()*256)+','+
        Math.floor(Math.random()*256)+')';
      // canvas is 800x800 which is 25x25 grids
        apple.x = getRandomInt(0, 50) * grid;
        apple.y = getRandomInt(0, 50) * grid;

        points++;
        score.innerText = points;
    }

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {

      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        points = 0;
        score.innerText = points;
        apple.x = getRandomInt(0, 50) * grid;
        apple.y = getRandomInt(0, 50) * grid;
      }


    }
  });
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key or A
  if ((e.which === 65 || e.which === 37) && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key or W
  else if ((e.which === 87 || e.which === 38) && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key or D
  else if ((e.which === 68 || e.which === 39) && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key or S
  else if ((e.which === 83 || e.which === 40) && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
  else if(e.which === 81) {
    count += 20;
  }
  else if(e.which === 69) {
    count = 10;
  }
});


// start the game

