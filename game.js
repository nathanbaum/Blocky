var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var MOVE_SPEED = 10
var GRAVITY_MOD = 0.3
var FRICTION_MOD = 0.9
var CHARACTER_WIDTH = 50
var CHARACTER_HEIGHT = 50
//var JUMP_MOD = 2

var keysDown = {}

document.addEventListener('keydown', function (e) {
  keysDown[e.keyCode] = true
}, false)

document.addEventListener('keyup', function (e) {
  delete keysDown[e.keyCode]
}, false)

function Character (width, height, pos) {
  this.width = width
  this.height = height
  this.pos = pos
  this.vel = [0, 0]

  this.jump = function(){
    if (this.pos[1] + this.height >= canvas.height) {
            //  pos[0] += MOVE_SPEED;
      this.vel[1] = -1 * MOVE_SPEED// * JUMP_MOD
      this.pos[1] -= MOVE_SPEED
    }
  }
}

function Enemy () {

}

function Platform () {
  
}

function update (e) {
  //  movement from velocity
  pos[0] += vel[0]
  pos[1] += vel[1]

  //  player movement
  if (38 in keysDown) { // Player holding up
    char.jump()
  }
  if (40 in keysDown) { // Player holding down
    if (this.pos[1] + this.height < canvas.height) {
            //  pos[0] -= MOVE_SPEED;
        this.pos[1] += MOVE_SPEED
    }

  }
  if (37 in keysDown) { // Player holding left
    //if (width > MIN_WIDTH) {
            //  width -= MOVE_SPEED;
    this.pos[0] -= MOVE_SPEED
    //}

  }
  if (39 in keysDown) { // Player holding right
    //if (width > MIN_WIDTH) {
            //  width+=MOVE_SPEED;
    this.pos[0] += MOVE_SPEED
    //}

  }

  //	gravity
  if (pos[1] + height < canvas.height) {
    vel[1] += GRAVITY_MOD
  } else {
    vel[1] = 0
    vel[0] *= FRICTION_MOD
  }
}

function render () {
  ctx.fillStyle = '#000000'
  ctx.fillRect(pos[0] - width, pos[1], width, height)
}

function main () {
  ctx.clearRect(0, 0, 500/*ctx.width*/, 500/*ctx.height*/)
  update()
  render()
}

var char = new Character(CHARACTER_WIDTH, CHARACTER_HEIGHT, [25 + CHARACTER_WIDTH, 0])
setInterval(main, 30)
