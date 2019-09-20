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

// MOVING OBJECTS — x,y:center of orbit; raduis: radius of orbit; rad: planet's radius;
var EARTH_1 = {x: SUN_X_POS, y: SUN_X_POS, radius: SUN_ORBIT_RAIDUS_1, rad: EARTH_RADIUS, color: "blue" }
var EARTH_2 = {x: SUN_X_POS, y: SUN_X_POS, radius: SUN_ORBIT_RAIDUS_2, rad: EARTH_RADIUS, color: "purple" }
var EARTH_3 = {x: SUN_X_POS, y: SUN_X_POS, radius: SUN_ORBIT_RAIDUS_3, rad: EARTH_RADIUS, color: "black" }
var MOON = {x: EARTH_1.x + SUN_ORBIT_RAIDUS_1, y:EARTH_1.y + SUN_ORBIT_RAIDUS_1, radius: EARTH_RADIUS * 3 , rad: EARTH_RADIUS / 2, color: "black" }

let objects = [EARTH_1, EARTH_2, EARTH_3, MOON];


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

function calcPosition(x,y,r,t,color,fill) {
  return {
      color: color,
      fill: fill,
      x: x - r * Math.sin(t * Math.PI / 180),
      y: y + r * Math.cos(t * Math.PI / 180)
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
  drawCircle()
}


// WorldState -> WorldState
// Change Earth position
function tick(ws) {
  return ws + 1;
}

function bigBang(ws, onDraw, onTick) {
  requestAnimationFrame(function(time) {
    onDraw(ws);
    var newWS = onTick(ws);
    bigBang(newWS, onDraw, onTick)
  });
}

function forTest(){
  console.log("hello.world");
}

bigBang(0, draw, tick);


/*
и на всякий случай еще раз напомню с помощью каких пар-ов рассчитывается 
положение спутника (планета это тоже спутник. только спутник солнца)

1) координат барицентра
2) расстояния до желаемой орбиты
3) времени
*/
