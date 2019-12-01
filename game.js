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
  rocket: [[100,100], [90,125], [110, 125]],
  rocketColor: "black"
}


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
function drawRocket(){
  CTX.beginPath();
  CTX.moveTo(WorldState.rocket[0][0], WorldState.rocket[0][1]);
  CTX.lineTo(WorldState.rocket[1][0], WorldState.rocket[1][1]);
  CTX.lineTo(WorldState.rocket[2][0], WorldState.rocket[2][1]);
  CTX.fillStyle = WorldState.rocketColor;
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
  let newEarth1 = calcPosition(SUN, EARTH_1, ws, 1);
  drawCircle(newEarth1.x,newEarth1.y,newEarth1.rad,newEarth1.color,true);
  let newEarth2 = calcPosition(SUN, EARTH_2, ws, 2);
  drawCircle(newEarth2.x,newEarth2.y,newEarth2.rad,newEarth2.color,true);
  let newEarth3 = calcPosition(SUN, EARTH_3, ws, 3);
  drawCircle(newEarth3.x,newEarth3.y,newEarth3.rad,newEarth3.color,true);
  let newMoon = calcPosition(newEarth1, MOON, ws, 4);
  drawCircle(newMoon.x, newMoon.y, newMoon.rad, newMoon.color, true);
  drawRocket();
  checkCollision(ws,[newEarth1, newEarth2,newEarth3, newMoon]);

}


// WorldState -> WorldState
// Change Earth position
function tick(ws) {
  ws.time += 1;
  return ws;
}

function restart(result) { 
  if (result ==='won') {
    let submitForm = confirm('You won! Do you want to restart?');
    if (submitForm) location.reload(true);
    else location.replace('https://en.wiktionary.org/wiki/win');
  }
  else if (result === 'looser') {
    let submitForm = confirm('You loose! Do you want to restart?');
    if (submitForm) location.reload();
    else location.replace('https://en.wiktionary.org/wiki/fiasco');
  }

}




function getDistance(x1,y1,x2,y2) {
  const distX = x2 - x1;
  const distY = y2 - y1;
  return Math.floor(Math.sqrt(distX ** 2 + distY ** 2));
}

function checkCollision(ws,bodies) {

  let triangleVectors = [
    v1 = {x1: ws.rocket[2][0], x2: ws.rocket[0][0], y1: ws.rocket[2][1], y2: ws.rocket[0][1]},
    v2 = {x1: ws.rocket[0][0], x2: ws.rocket[1][0], y1: ws.rocket[0][1], y2: ws.rocket[1][1]},
    v3 = {x1: ws.rocket[1][0], x2: ws.rocket[2][0], y1: ws.rocket[1][1], y2: ws.rocket[2][1]},
  ]

  let collided = false;
  WorldState.rocketColor = "black";

  triangleVectors.forEach(vector => {
  bodies.forEach((body,index) => {
  const lineLength = getDistance(vector.x1,vector.y1,vector.x2,vector.y2);
  const dot = (((body.x - vector.x1) * (vector.x1 - vector.x2)) + 
  ((body.y - vector.y1) * (vector.y1 - vector.y2))) / lineLength ** 2;

  const closestX = vector.x1 + (dot * (vector.x1 - vector.x2));
  const closestY = vector.y1 + (dot * (vector.y1 - vector.y2));

  const distance = getDistance(closestX,closestY,body.x,body.y);
  const onVector = onSide(vector.x2,vector.y2,vector.x1,vector.y1,closestX,closestY);

  if (distance <= body.rad && onVector && !collided) { 
    drawCircle(closestX,closestY,2,"yellow",true);
    collided = true;
    WorldState.rocketColor = "red";

    if (index === 3) {
      restart('won');
    }
    else {
      restart('looser');
    }
  }

})
});
}

// checks is projection coordinates belongs to side of triangle
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