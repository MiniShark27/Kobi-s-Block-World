//jshint maxerr:1, strict:false

//declare variables
//{
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let cellSize = 20;

let currentLevel = [];
let levelNum = 0;

//width,height in cells
let dimensions = null;
let canvasWidth = null;
let canvasHeight = null;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let paused = false;
let player = null;
const slowDown = [0.02,0.85];

const maxJumps = 1;
const wallJump = true;
let jumpCount = maxJumps;

const horzSpeed = 0.06;
const vertSpeed = 0.3;
const maxHorzSpeed = 0.2;
const maxVertSpeed = 0.4;

const dev = false;
let devCoords = null;

let grounded = true;
let playerAlive = true;

const div1 = document.getElementById("div1");
const div2 = document.getElementById("div2");

//Get Keystrokes{
document.addEventListener("keydown", function(event) {
  if(event.which==80){//P
    paused = !paused;
  }
  if((event.which==38)&&jumpCount>0){//up and spacebar
    jumpCount--;
    jump();
  }
  if(event.which==32){
    update();
  }
  if(event.which==65){
    console.log(player);
    update();
    console.log(player);
  }
});
var map = [];
onkeydown = onkeyup = function(e){
    map[e.keyCode] = e.type == 'keydown';
}
function movement(){
  if(map[37])left();//left
  if(map[39])right();//right
}
//}
  
//}

function draw(obj){
  ctx.beginPath()
  ctx.fillStyle = obj.color;
  ctx.fillRect(Math.floor(obj.x*10)/10*cellSize,Math.floor(obj.y*10)/10*cellSize,cellSize,cellSize);
  ctx.stroke();
}
function clear(obj){
  ctx.beginPath()
  ctx.clearRect(Math.floor(obj.x*10)/10*cellSize,Math.floor(obj.y*10)/10*cellSize,cellSize,cellSize);
  ctx.stroke();
}

function jump(){
  console.log("jump")
  player.Yspeed = vertSpeed;
}
function left(){
  if(player.Xspeed>-maxHorzSpeed)player.Xspeed -= horzSpeed;
}
function right(){
  if(player.Xspeed<maxHorzSpeed)player.Xspeed += horzSpeed;
}

function collision(direction){
  //1:up   -1:down
  //2:left 4:right
  //0:no movement
  loc1=null;
  loc2=null;
  yVal = Math.floor(player.y-player.Yspeed);
  xVal = Math.floor(player.x+player.Xspeed);
  this.direction = direction;
  this.output = false;
  switch(direction){
    case(-1):
    case(0):
      loc1 = currentLevel[yVal+1][xVal];
      if(player.x-player.Xspeed!=xVal){
      loc2 = currentLevel[yVal+1][xVal+1];
      }
      break;
    case(1):
      loc1 = currentLevel[yVal][xVal];
      if(player.x-player.Xspeed!=xVal){
      loc2 = currentLevel[yVal][xVal+1];
      }
      break;
    case(2):
      loc1 = currentLevel[yVal][xVal];
      if(player.y-player.Yspeed!=yVal){
        loc2 = currentLevel[yVal+1][xVal];
      }
      break;
    case(4):
      loc1 = currentLevel[yVal][xVal+1];
      if(player.y-player.Yspeed!=yVal){
        loc2 = currentLevel[yVal+1][xVal+1];
      }
      break;
    case(3):
      this.output= false
  }
  if(loc1 !== null){
    if(loc1.type === "obsticle"){
      if(loc1.deadly)playerAlive = false;
      loc1 = true;
    }
    if(loc1.type === "door"){
      nextLV();
    }
  }else{
    loc1=false
  }
  if(loc2 !== null){
    if(loc2.type === "obsticle"){
      if(loc2.deadly)playerAlive = false;
      loc2 = true;
    }
    if(loc2.type === "door"){
      nextLV();
    }
  }else{
    loc2=false
  }
  this.output= (loc1===true||loc2===true)
}
function phisics(){
  Ycollisions = new collision(Math.sign(player.Yspeed))
  yHit = Ycollisions.output;

  if(yHit){
    player.yspeed = 0;
  }
  Xcollisions = new collision(Math.sign(player.Xspeed)+3)
  xHit = Xcollisions.output;
  if(xHit){
    if(Ycollisions.direction>0){
      if(wallJump)jumpCount++;
    }
    player.Xspeed = 0;
    if(Xcollisions.direction<3){
      player.x = Math.floor(player.x)
    }else{
      player.x = Math.ceil(player.x)
    }
  }
  Ycollisions = new collision(Math.sign(player.Yspeed))
  yHit = Ycollisions.output;
  if(yHit){
    if(Ycollisions.direction>0){
      player.y = Math.floor(player.y)
    }else{
      jumpCount = maxJumps;
      grounded = true;
      player.y = Math.ceil(player.y)
    }
    player.Yspeed=0
  }
  Xcollisions = new collision(Math.sign(player.Xspeed)+3)
  xHit = Xcollisions.output;
  Ycollisions = new collision(Math.sign(player.Yspeed))
  yHit = Ycollisions.output;
  if(!yHit){
      grounded = false;
      player.y-=player.Yspeed;
      player.Yspeed-=slowDown[0];
      if(-player.Yspeed>maxVertSpeed){
        player.Yspeed=-maxVertSpeed;
      }
    }
  if(!xHit){
    player.x+=player.Xspeed;
  }
  if(grounded&&player.Xspeed !== 0){
    console.log("now")
    player.Xspeed*=slowDown[1];
  }
  if(Math.abs(player.Xspeed)<.01)player.Xspeed = 0;
}
function update(){
  movement();
  clear(player);
  phisics();
  devModeRun();
  draw(player);
  if(!playerAlive) lose();
}

function lose(){
  setup();
  playerAlive = true;
}
function nextLV(){
  getLevel();
  setup();
}
function getLevel(){
  //j is x and i is y
  currentLevel = [];
  levelNum%=levels.length
  levelNum++;
  levelData = levels[levelNum-1];
  for(i=0;i<levelData[0].length;i++){
    currentLevel.push([]);
    for(j=0;j<levelData[0][0].length;j++){
      if(levelData[0][i][j] === 0)currentLevel[i].push(null);
      if(levelData[0][i][j] === 1)currentLevel[i].push(new Player(j,i));
      if(levelData[0][i][j] === 2)currentLevel[i].push(new Wall(j,i));
      if(levelData[0][i][j] === 3)currentLevel[i].push(new Lava(j,i));
      if(levelData[0][i][j] === 4)currentLevel[i].push(new Door(j,i));
    }
  }
}
function setup(){
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  cellSize = levelData[1]
  dimensions = [currentLevel[0].length,currentLevel.length];
  canvasWidth = dimensions[0]*cellSize;
  canvasHeight = dimensions[1]*cellSize;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  for(i=0;i<currentLevel.length;i++){
    for(j=0;j<currentLevel[0].length;j++){
      if(currentLevel[i][j] !== null){
        draw(currentLevel[i][j]);
        if(currentLevel[i][j].type === "player"){
          player = currentLevel[i][j];
          clear(player);
          player.x = j;
          player.y = i;
          player.xSpeed = 0;
          player.ySpeed = 0;
        }
      }
    }
  }
}

window.onload = function(){
  getLevel();
  setup();
  window.setInterval(function(){
    if(!paused){
      update();
    }
  }, 20);
};

function devModeGetCoords(e){
  if(dev){
    devCoords=[Math.floor((e.clientX-canvas.offsetLeft)/cellSize),Math.floor((e.clientY-canvas.offsetTop)/cellSize)];
  }
}
function devModeRun(){
  if(dev&&devCoords !== null){
    player.x=devCoords[0];
    player.y=devCoords[1];
    player.Xspeed = 0;
    player.Yspeed = 0;
    paused = false;
    devCoords = null;
  }
}

