var CANVAS = document.getElementById("canvas");
var CTX = CANVAS.getContext("2d");

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 800;

// Constants
var WORLD_WIDTH = 800 / 2;
var WORLD_HEIGHT = 800 / 2;
var EARTH_RADIUS = 10;
var EARTH_COLOR = "blue";
var SUN_RADIUS = 20;
var SUN_X_POS = WORLD_WIDTH / 2 - SUN_RADIUS;
var SUN_Y_POS = WORLD_HEIGHT / 2 - SUN_RADIUS;
var SUN_COLOR = "orange";
var SUN_ORBIT_RAIDUS_1 = 60;
var SUN_ORBIT_RAIDUS_2 = 100;
var SUN_ORBIT_RAIDUS_3 = 150;
var SUN_ORBIT_COLOR = "#c1c1c1";
var EARTH_1 = {x: SUN_X_POS, y: SUN_X_POS, radius: SUN_ORBIT_RAIDUS_1, rad: EARTH_RADIUS, color: "blue" }
var EARTH_2 = {x: SUN_X_POS, y: SUN_X_POS, radius: SUN_ORBIT_RAIDUS_2, rad: EARTH_RADIUS, color: "purple" }
var EARTH_3 = {x: SUN_X_POS, y: SUN_X_POS, radius: SUN_ORBIT_RAIDUS_3, rad: EARTH_RADIUS, color: "black" }
var MOON = {x: EARTH_1.x + SUN_ORBIT_RAIDUS_1, y:EARTH_1.y + SUN_ORBIT_RAIDUS_1, radius: EARTH_RADIUS * 5 , rad: EARTH_RADIUS / 3, color: "black" }


// Preset World
CANVAS.width = CANVAS_WIDTH;
CANVAS.height = CANVAS_HEIGHT;
CANVAS.style.width = WORLD_WIDTH + 'px';
CANVAS.style.height = WORLD_HEIGHT + 'px';
CANVAS.style.border = "1px solid black";
CANVAS.getContext('2d').scale(2,2);


// Contex, Number, Number, Number -> Image
// draws circle given x, y pos and raidus r
function drawCircle(x, y, r, color, fill) {
  CTX.beginPath();
  CTX.arc(x, y, r, 0, 2 * Math.PI);
  CTX.fillStyle = color;
  if (fill == true) {
    CTX.fill();
  } else {
    CTX.stroke();
  }
}

function clearWorld() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

// WorldState -> Vec
// interpreation position of Earth on the Sun Orbit


// WorldState -> Image
// draws Earth on Sun orbit according to WorldState
function draw(ws) {
  clearWorld();
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_RADIUS, SUN_COLOR, true);
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_ORBIT_RAIDUS_1, SUN_ORBIT_COLOR, false);
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_ORBIT_RAIDUS_2, SUN_ORBIT_COLOR, false);
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_ORBIT_RAIDUS_3, SUN_ORBIT_COLOR, false);
  drawMovingBody(EARTH_1,ws);
  drawMovingBody(EARTH_2,ws/2);
  drawMovingBody(EARTH_3,ws/3);
  drawMovingBody(MOON,ws);
}


// make planets spin
function drawMovingBody(obj,ws) { 
 drawCircle(obj.x - obj.radius * Math.cos(ws * Math.PI / 180), obj.y + obj.radius * Math.sin (ws * Math.PI / 180), obj.rad, obj.color, true)
}




/*

  class Body {
    constructor (x,y,r,t) {
      this.x = r * cos(t);
      this.y = y * sin (t);
    }


    //update Body according to WorldState
    function update(t) {
      this.x = r * cos(t)
      this.y = r * sin(t)
    }
  }


  let earth = new Body(1,2,3,0);
  // update x,y value -> draw updated bodies
  earth.update(ws)


  // for Sputnik
  drawcircle(earth.x + moon.x)

*/


// WorldState -> WorldState
// Change Earth position
function tick(ws) {
  return ws + 1 ;
}

function bigBang(ws, onDraw, onTick) {
  requestAnimationFrame(function(time) {
    onDraw(ws);
    var newWS = onTick(ws);
    bigBang(newWS, onDraw, onTick)
  });
}

bigBang(0, draw, tick);
