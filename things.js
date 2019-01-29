
class Obsticle{
  constructor(x,y,deadly,color){
    this.x=x;
    this.y=y;
    this.deadly = deadly;
    this.color = color;
    this.type = "obsticle";
  }
}
class Wall extends Obsticle{
  constructor(x,y){
    super(x,y,false,"lightblue");
  }
}
class Lava extends Obsticle{
  constructor(x,y){
    super(x,y,true,"red");
  }
}

class Player{
  constructor(x,y){
    this.x=x;
    this.Xspeed = 0;
    this.y=y;
    this.Yspeed = 0;
    this.color = "green"
    this.type = "player";
  }
}

class Door{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.color="brown";
    this.type="door"
  }
}

class Checkpoint{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.color="lime";
    this.type="checkPoint"
  }
  getCoords(){
    return [this.x,this.y];
  }
  setCoords(mat){
    this.x = mat[0];
    this.y = mat[1];
  }
}

class keyDoor{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.color="gray";
    this.type="keyDoor"
  }
}

class key{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.color="yellow";
    this.type="key"
  }
}

class fakeWall{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.color="lightblue";
    this.type="fakeWall"
  }
}