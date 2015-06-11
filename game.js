var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var MOVE_SPEED = 7;
var JUMP_SPEED = 18;
var GRAVITY_MOD = 0.5;
var FRICTION_MOD = 0.7;
var AIR_RESISTANCE = 0.7;
var DEATH_MESSAGE = "GAME OVER";
var NUM_PLATFORMS = 6;
var SCROLL_SPEED = 3;

var PLAYER_WIDTH = 50;
var PLAYER_HEIGHT = 50;
var PLAYER_COLOR = '#000000';

var PLATFORM_WIDTH = 6*PLAYER_WIDTH;
var PLATFORM_HEIGHT = PLAYER_HEIGHT/2;
var PLATFORM_OFFSET = [500, 200];
var PLATFORM_COLOR = '#000000';

var GOAL_WIDTH = 200;
var GOAL_HEIGHT = 50;
var GOAL_COLOR = '#FFCC00';

var ENEMY_COLOR = '#CC0000';


var play = true;
var gravityInEffect = true;
var goalPoint;

var keysDown = {};

document.addEventListener('keydown', function (e) {
  keysDown[e.keyCode] = true;
}, false);

document.addEventListener('keyup', function (e) {
  delete keysDown[e.keyCode];
}, false);

function Character(width, height, pos) {
  /*
  // Player object:
  // Has instance data, moves, renders, and updates
  // its position and velocity from gravity and movement.
  */
  this.width = width;
  this.height = height;
  this.pos = pos;
  this.vel = [0, 0];

  this.render = function(){ //draws the player
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  };

  this.jump = function(){
    if(map.checkPlatforms()){
      this.pos[1] -= 10;
      this.vel[1] = -1 * JUMP_SPEED;
    }
  };

  this.move = function(right){ //moves the player right or left
    if(right){
      this.vel[0] += MOVE_SPEED;
    }
    else{
      this.vel[0] -= MOVE_SPEED;
    }
  };

  this.update = function(){
    //movement from velocity
    if(this.pos[0] + this.width <= canvas.width){
      this.pos[0] += this.vel[0];
    }
    else{
      this.pos[0] = canvas.width - this.width;
    }
    this.pos[1] += this.vel[1];

    //movement from gravity
    this.vel[1] += GRAVITY_MOD;
    this.vel[0] *= AIR_RESISTANCE;
    this.vel[0] *= FRICTION_MOD;

    if(this.pos[0] <= 0 || this.pos[1] + this.height >= canvas.height){ //checks if player is off the screen
      play = false;
    }
  };
}

function Enemy(width, height, pos) {
  this.width = width;
  this.height = height;
  this.pos = pos;
  this.movement = Math.random() * 10;

  this.update = function(){
    this.pos[0] -= SCROLL_SPEED;
    this.pos[0] += this.movement;

    if(char.pos[0] + char.width > this.pos[0] && char.pos[0] < this.pos[0] + this.width && char.pos[1] + char.height > this.pos[1] && char.pos[1] < this.pos[1] + this.height){ //if touching player
      play = false;
    }
  }

  this.render = function(){
    ctx.fillStyle = ENEMY_COLOR;
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  }
}

function Goal(width, height, pos) {
  this.width = width;
  this.height = height;
  this.pos = pos;

  this.update = function(){
    this.pos[0] -= SCROLL_SPEED;

    if(char.pos[0] + char.width > this.pos[0] && char.pos[0] < this.pos[0] + this.width && char.pos[1] + char.height > this.pos[1] && char.pos[1] < this.pos[1] + this.height){ //if touching player
      DEATH_MESSAGE = 'YOU WIN!'
      play = false;
    }
  }

  this.render = function(){
    ctx.fillStyle = GOAL_COLOR;
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  }
}

function Platform(width, height, pos) {
  this.width = width;
  this.height = height;
  this.pos = pos;
  this.enemy = new Enemy(PLAYER_WIDTH, PLAYER_HEIGHT, [this.pos[0], this.pos[1] - PLAYER_HEIGHT]); //creates a new enemy to crawl around on the platform

  this.onPlatform = function(){
    return (char.pos[0] + char.width > this.pos[0] &&
            char.pos[0] < this.pos[0] + this.width &&
            char.pos[1] + char.height > this.pos[1] &&
            char.pos[1] < this.pos[1]);
  }

  this.update = function(){
    this.enemy.update();

    if(this.enemy.pos[0] <= this.pos[0] || this.enemy.pos[0] + this.enemy.width >= this.pos[0] + this.width){ //checks when enemy has reached the end of the platform
      this.enemy.movement *= -1; //reverses the enemy's movement
    }

    if(this.onPlatform()){
      var overlap = new Array(2);

      if(char.vel[0] > 0){
        overlap[0] = (char.pos[0] + char.width) - this.pos[0];
      }
      else{
        overlap[0] = char.pos[0] - (this.pos[0] + this.width);
      }

      if(char.vel[1] > 0){
        overlap[1] = (char.pos[1] + char.height) - this.pos[1];
      }
      else{
        overlap[1] = char.pos[1] - (this.pos[1] + this.height);
      }

      if(overlap[0] > overlap[1]){
        char.vel[1] = 0;
        //char.pos[1] -= overlap[1] * .99;
      }
      else if(overlap[1] > overlap[0]){
        char.vel[0] = 0;
        //char.pos[0] -= overlap[0] * .99;
      }
      else{
        char.vel[1] = 0;
        //char.pos[1] -= overlap[1] * .99;

        char.vel[0] = 0;
        //char.pos[0] -= overlap[0] * .99;
      }
    }

    this.pos[0] -= SCROLL_SPEED;
  }

  this.render = function(){
    this.enemy.render();

    ctx.fillStyle = PLATFORM_COLOR;
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  }
}

function Map(platforms) {
  this.map = new Array(platforms);

  this.generateMap = function(){
    point = [-100, canvas.height/2];
    for(i = 0; i<this.map.length; i++){
      point[0] += PLATFORM_OFFSET[0];
      up = Math.random() > 0.5;
      if(up){
        if(point[1] - PLATFORM_OFFSET[1] - PLAYER_HEIGHT * 2 > 0){
          point[1] -= PLATFORM_OFFSET[1];
          map[i] = new Platform(PLATFORM_WIDTH, PLATFORM_HEIGHT, [point[0], point[1]]);
        }
        else{
          point[1] += PLATFORM_OFFSET[1];
          map[i] = new Platform(PLATFORM_WIDTH, PLATFORM_HEIGHT, [point[0], point[1]]);
        }
      }
      else{
        if(point[1] + PLATFORM_OFFSET[1] + PLATFORM_HEIGHT < canvas.height){
          point[1] += PLATFORM_OFFSET[1];
          map[i] = new Platform(PLATFORM_WIDTH, PLATFORM_HEIGHT, [point[0], point[1]]);
        }
        else{
          point[1] -= PLATFORM_OFFSET[1];
          map[i] = new Platform(PLATFORM_WIDTH, PLATFORM_HEIGHT, [point[0], point[1]]);
        }
      }
    }
    goalPoint = [point[0] += PLATFORM_OFFSET[0], canvas.height/2];
  }

  this.checkPlatforms = function(){
    for(i = 0; i < this.map.length; i++){
      if(map[i].onPlatform()){
        return true;
      }
    }
    return false;
  }

  this.render = function(){
    for(i = 0; i<this.map.length; i++){
      map[i].render();
    }
  }

  this.update = function(){
    for(i = 0; i<this.map.length; i++){
      map[i].update();
    }
  }
}

function update(e) {
  //  movement from velocity
  char.update();
  map.update();
  goal.update();

  //  player movement
  if (38 in keysDown) { // Player holding up
    char.jump();
  }
  if (37 in keysDown) { // Player holding left
    char.move(false);
  }
  if (39 in keysDown) { // Player holding right
    char.move(true);
  }
  /*if (40 in keysDown) {
    play = false;
  }*/
}

function render () {
  map.render();
  char.render();
  goal.render();
}

function main () {
  if(play){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    render();
  }
  else{
    ctx.font = "100px Arial";
    ctx.shadowBlur=20;
    ctx.shadowColor="black";
    if(DEATH_MESSAGE == 'GAME OVER'){
      ctx.fillStyle = ENEMY_COLOR;
    }
    else{
      ctx.fillStyle = GOAL_COLOR;
    }
    ctx.fillText(DEATH_MESSAGE, (canvas.width / 2) - (ctx.measureText(DEATH_MESSAGE).width / 2), canvas.height / 2);
  }
}

var map = new Map(NUM_PLATFORMS);
map.generateMap();
var char = new Character(PLAYER_WIDTH, PLAYER_HEIGHT, [25 + PLAYER_WIDTH, 0]);
var goal = new Goal(GOAL_WIDTH, GOAL_HEIGHT, goalPoint);
setInterval(main, 30);
