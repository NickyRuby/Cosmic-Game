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
var SUN = {x:SUN_X_POS, y: SUN_Y_POS, radius: 0, SUN_RADIUS, rad:SUN_RADIUS ,color: "yellow"}
var EARTH_1 = {x: SUN.x, y: SUN.y, radius: SUN_ORBIT_RAIDUS_1, rad: EARTH_RADIUS, color: "blue" }
var EARTH_2 = {x: SUN.x, y: SUN.y, radius: SUN_ORBIT_RAIDUS_2, rad: EARTH_RADIUS, color: "purple" }
var EARTH_3 = {x: SUN.x, y: SUN.y, radius: SUN_ORBIT_RAIDUS_3, rad: EARTH_RADIUS, color: "red" }
var MOON = {x: SUN.x, y:SUN.y, radius: EARTH_RADIUS * 2 , rad: EARTH_RADIUS / 3, color: "black" }

//
var WorldState = {
  time: 0, 
  rocket: [[100,100], [90,125], [110, 125]]
}
//n = [25,20];



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

// drawing Rocket on canvas
function drawRocket(color){
  CTX.beginPath();
  CTX.moveTo(WorldState.rocket[0][0], WorldState.rocket[0][1]);
  CTX.lineTo(WorldState.rocket[1][0], WorldState.rocket[1][1]);
  CTX.lineTo(WorldState.rocket[2][0], WorldState.rocket[2][1]);
  CTX.fillStyle = "black";
  if (color) CTX.fillStyle = color;
  CTX.fill(); 
}

function drawVector(x1, y1, x2, y2, color) { 
  CTX.beginPath();
  CTX.moveTo(x1, y1);
  CTX.lineTo(x2, y2);
  CTX.stroke();
  CTX.strokeStyle = color;
}


// f(baricenter,sputnik, WorldState, acceleration);
function calcPosition(bar,obj,ws,acc) {
  const newObj = Object.assign({},obj);
  newObj.x = bar.x + obj.radius * Math.cos ((acc * ws.time) * Math.PI / 180);
  newObj.y = bar.y + obj.radius * Math.sin ((acc * ws.time) * Math.PI / 180);
  return newObj; 
}


function clearWorld() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
}


// WorldState -> Image
// draws Earth on Sun orbit according to WorldState
function draw(ws) {
  clearWorld();
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_RADIUS, SUN_COLOR, true);
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_ORBIT_RAIDUS_1, SUN_ORBIT_COLOR, "blue");
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_ORBIT_RAIDUS_2, SUN_ORBIT_COLOR, "blue");
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_ORBIT_RAIDUS_3, SUN_ORBIT_COLOR, "blue"); 
  let newEarth1 = calcPosition(SUN, EARTH_1, ws, 0.015);
  drawCircle(newEarth1.x,newEarth1.y,newEarth1.rad,newEarth1.color,true);
  let newEarth2 = calcPosition(SUN, EARTH_2, ws, 0.025);
  drawCircle(newEarth2.x,newEarth2.y,newEarth2.rad,newEarth2.color,true);
  let newEarth3 = calcPosition(SUN, EARTH_3, ws, 0.035);
  drawCircle(newEarth3.x,newEarth3.y,newEarth3.rad,newEarth3.color,true);
  let newMoon = calcPosition(newEarth1, MOON, ws, 0.045);
  drawCircle(newMoon.x, newMoon.y, newMoon.rad, newMoon.color, true);
  checkCollision(ws,[newEarth1, newEarth2,newEarth3]);

}


// WorldState -> WorldState
// Change Earth position
function tick(ws) {
  ws.time += 1;
  return ws;
}


function getDistance(x1,y1,x2,y2) {
  const distX = x2 - x1;
  const distY = y2 - y1;
  return Math.floor(Math.sqrt(distX ** 2 + distY ** 2));
}


function checkCollision(ws,bodies) {
  bodies.forEach((body) => {
   // making calculations
  const lineLength = getDistance(ws.rocket[0][0],ws.rocket[0][1],ws.rocket[2][0],ws.rocket[2][1]);
  const dot = (((body.x - ws.rocket[2][0]) * (ws.rocket[2][0] - ws.rocket[0][0])) + 
  ((body.y - ws.rocket[2][1]) * (ws.rocket[2][1] - ws.rocket[0][1]))) / lineLength ** 2;

  const closestX = ws.rocket[2][0] + (dot * (ws.rocket[2][0] - ws.rocket[0][0]));
  const closestY = ws.rocket[2][1] + (dot * (ws.rocket[2][1] - ws.rocket[0][1]));

  const onVector = onSide(ws.rocket[0][0],ws.rocket[0][1],ws.rocket[2][0],ws.rocket[2][1],closestX,closestY);

  // cheking by drawing vectors
  drawVector(ws.rocket[2][0],ws.rocket[2][1], body.x, body.y);
  drawVector(body.x, body.y , closestX , closestY , "red");
  drawVector(ws.rocket[2][0],ws.rocket[2][1],closestX,closestY)

  const distance = getDistance(closestX,closestY,body.x,body.y);
  

  setTimeout(console.log(distance),5000);
  if (distance < body.rad && onSide) {
    drawRocket("red")
    drawCircle(closestX,closestY,2,"yellow",true);
  }
  else {
    drawRocket()  
  }
  


});
}

// checks is projection coordinates belongs to side
function onSide (x1,y1,x2,y2, projX, projY) {
  const first = getDistance(x1,y1,projX,projY);
  const second = getDistance(x2,y2,projX,projY);
  const proj = getDistance(x1,y1,x2,y2);
  const buffer = 0.1;
  if ((first + second >= proj - buffer && first + second <= proj + buffer)) return true;
  return false;
} 



// runs simulation from given WorldState
// WorldState, KeyStore -> WorldState
// computes new WorldState according keypress
function myOnKey(ws, ks) {
  if (ks.ArrowUp ) {
    for (let each of ws.rocket) each[1] -= 5;
  }
  else if (ks.ArrowDown) {
    for (let each of ws.rocket) each[1] += 5;
  }
  else if (ks.ArrowLeft) {
    for (let each of ws.rocket) each[0] -= 5;
  }
  else if (ks.ArrowRight) {
    for (let each of ws.rocket) each[0] += 5;
  }
  return ws;
}

// runs simulation from given WorldState
function bigBang(ws, onDraw, onTick, onKey) {
  const TRACKED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  
  const ks = (function(keys) {
    const keyStore = Object.create(null); // keyStore = {ArrowUp: true}

    function track(event) {
      if (keys.includes(event.key)) {
        keyStore[event.key] = event.type == 'keydown'; // keyStore = { ArrowUp: true} == keyStore[ArrowUp] = true/false;  
        event.preventDefault();
      }
    }

    window.addEventListener('keyup', track);
    window.addEventListener('keydown', track);

    return keyStore;
  })(TRACKED_KEYS);

  const run = function(ws, onDraw, onTick, onKey = null) {
    requestAnimationFrame(function() {
      onDraw(ws);
      const newState = onKey ? onTick(onKey(ws, ks)) : onTick(ws, ks);
      run(newState, onDraw, onTick, onKey)  
    });
  }

  run(ws, onDraw, onTick, onKey);
}



bigBang(WorldState, draw, tick, myOnKey);


