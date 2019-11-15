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
function drawRocket(){
  CTX.beginPath();
  CTX.moveTo(WorldState.rocket[0][0], WorldState.rocket[0][1]);
  CTX.lineTo(WorldState.rocket[1][0], WorldState.rocket[1][1]);
  CTX.lineTo(WorldState.rocket[2][0], WorldState.rocket[2][1]);
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
  checkCollision(ws,[newEarth1, newEarth2, newEarth3]);

}


// WorldState -> WorldState
// Change Earth position
function tick(ws) {
  ws.time += 1;
  return ws;
}

// TODO: Find mistakes in calculations
function calculateProj(vector1, vector2) {
  const lengthV2 = Math.sqrt((vector2[0] ** 2 + vector2[1]) ** 2);
  const proj = Math.abs((vector1[0] * vector2[0] + vector1[1] * vector2[1]) / lengthV2);
  console.log('THIS IS PROJECTION: ' + proj);
  const coordinates = [proj * vector2[0] , proj * vector2[1]];
  console.log('THIS IS COORDINATES OF PROJECTION: ' + coordinates[0] + "," + coordinates[1]);
  return coordinates;
}

// checking collision 
function checkCollision(ws,bodies) {
  bodies.forEach((body,index) => {

  //chekin on start
  console.log(body);
  console.log(ws.rocket[2][0] + "," + ws.rocket[2][1] + "," + ws.rocket[0][0] + "," + ws.rocket[0][1]);
  console.log((ws.rocket[2][0]-ws.rocket[0][0]) + ', ' + (ws.rocket[2][1]-ws.rocket[0][1]));

   // making calculations
  const triangleVector1 = [(ws.rocket[2][0] - 10) , (ws.rocket[2][1] - 25)]; // dots: A,B => C = (Bx-Ax,By-Ay)
  const planetVector = [body.x - ws.rocket[2][0], body.y - ws.rocket[2][1]]; // 
  const projCoordinates = calculateProj(planetVector,triangleVector1);
  const distance = Math.floor(Math.sqrt((body.x - projCoordinates[0]) ** 2 + (body.y - projCoordinates[1]) ** 2) - body.rad);

  // cheking by drawing vectors
  drawVector(ws.rocket[2][0],ws.rocket[2][1], body.x, body.y);
  drawVector(projCoordinates[0], projCoordinates[1], body.x, body.y);
  drawVector(ws.rocket[2][0],ws.rocket[2][1], ws.rocket[0][0],ws.rocket[0][1],"black");
  drawVector(body.x, body.y, projCoordinates[0], projCoordinates[1],"red");
  
  // debuggin results in console
  console.log(triangleVector1[0] + "@" + triangleVector1[1] + ' : triangle');
  console.log(planetVector[0] + ", " +  planetVector[1] + ' : projVector');
  console.log(projCoordinates[0] + ", " + projCoordinates[1]  + ' : projCoordinates');
  console.log(distance  + ' : distance');
  console.log(`--------------------------${index}------------------------`);

  if (distance === 0) alert('whoo-hoo');
});
  setTimeout(() => {debugger}, 5000);
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


