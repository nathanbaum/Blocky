var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var MOVE_SPEED = 7;
var GRAVITY_MOD = 0.4;
var FRICTION_MOD = 0.7;
var AIR_RESISTANCE = 0.75;
var CHARACTER_WIDTH = 50;
var CHARACTER_HEIGHT = 50;
var DEATH_MESSAGE = "GAME OVER";

var play = true;

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
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  };

  this.jump = function(){
    if (this.pos[1] + this.height >= canvas.height) {
            //  pos[0] += MOVE_SPEED;
      this.vel[1] = -1 * MOVE_SPEED; // * JUMP_MOD
      this.vel[1] -= MOVE_SPEED;
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
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    //movement from gravity
    if (this.pos[1] + this.height < canvas.height) {
      this.vel[1] += GRAVITY_MOD;
      this.vel[0] *= AIR_RESISTANCE;
    } else {
      this.vel[1] = 0;
      this.pos[1] = canvas.height - this.height;
      this.vel[0] *= FRICTION_MOD;
    }
  };
}

function Enemy(width, height, pos) {
  this.width = width;
  this.height = height;
  this.pos = pos;
  this.vel = [0, 0];
}

function Platform() {
  this.width = width;
  this.height = height;
  this.pos = pos;
  this.vel = [0, 0];
}

function update(e) {
  //  movement from velocity
  char.update();

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
  char.render();
}

function main () {
  if(play){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    render();
  }
  else{
    ctx.font = "100px Arial";
    ctx.fillStyle = "#CC0000";
    ctx.fillText(DEATH_MESSAGE, (canvas.width / 2) - (ctx.measureText(DEATH_MESSAGE).width / 2), canvas.height / 2);
  }
}

var char = new Character(CHARACTER_WIDTH, CHARACTER_HEIGHT, [25 + CHARACTER_WIDTH, 0]);
setInterval(main, 30);
