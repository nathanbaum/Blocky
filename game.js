var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var MOVE_SPEED = 10
var GRAVITY_MOD = 0.1
var FRICTION_MOD = 0.9
var JUMP_MOD = 2

var width = 50
var height = 50
var pos = [25 + width, 0]
var vel = [0, 0]

var keysDown = {}

document.addEventListener('keydown', function (e) {
  keysDown[e.keyCode] = true
}, false)

document.addEventListener('keyup', function (e) {
  delete keysDown[e.keyCode]
}, false)

function update (e) {
  //  movement from velocity
  pos[0] += vel[0]
  pos[1] += vel[1]

  //  player movement
  if (38 in keysDown) { // Player holding up
    if (pos[1] + height >= canvas.height) {
            //  pos[0] += MOVE_SPEED;
      vel[1] = -1 * MOVE_SPEED// * JUMP_MOD
      pos[1] -= MOVE_SPEED
    }

  }
  if (40 in keysDown) { // Player holding down
    if (pos[1] + height < canvas.height) {
            //  pos[0] -= MOVE_SPEED;
      pos[1] += MOVE_SPEED
    }

  }
  if (37 in keysDown) { // Player holding left
    //if (width > MIN_WIDTH) {
            //  width -= MOVE_SPEED;
      pos[0] -= MOVE_SPEED
    //}

  }
  if (39 in keysDown) { // Player holding right
    //if (width > MIN_WIDTH) {
            //  width+=MOVE_SPEED;
      pos[0] += MOVE_SPEED
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

function tick () {
  ctx.clearRect(0, 0, 500/*ctx.width*/, 500/*ctx.height*/)
  update()
  render()
}

setInterval(tick, 30)
