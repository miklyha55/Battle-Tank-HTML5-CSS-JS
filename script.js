// Code goes here
function Model() {
  var arrEnemys = [];
  var body = {width: 400, height:400};
  return {
    getArrEnemys: function() {
      return arrEnemys;
    },
    
    clearArrEnemys: function() {
      arrEnemys = [];
    },
    
    pushEnemyArr: function(enemy) {
      arrEnemys.push(enemy);
    },
    
    getBody: function() {
      return body;
    }
  }
}

var model = new Model();

function Bullet(vector, x, y, tank = null, enemy = null) {
  var obj = Object.create(model);
  var vectorBullet = {x: vector.x + vector.width/2, y: vector.y + vector.height/2};
  var speed = 4;
  var timerBulletLoop;
  
  var isFocus = 1;
  var FPS = 60;
  var isLiveBullet= false;
  
  var bullet = document.createElement('div');
  bullet.setAttribute("class", "bullet");
  
  document.getElementById("body").appendChild(bullet);
   
  obj.bulletMove = function() {
    bullet.style.transform = "translate3d("+ vectorBullet.x +"px ,"+ vectorBullet.y +"px ,"+ 0 +")";
  } 
  
  obj.vectorBullet = function() {
    return vectorBullet;
  } 
  
  obj.setVectorBullet = function(x, y) {
    vectorBullet.x = x;
    vectorBullet.y = y;
  } 
  
  obj.die = function() {
    isLiveBullet = true;
  }
  
  obj.loop = function() {
        var timerBulletLoop = setTimeout(obj.loop, 1000 / (isFocus * FPS));
        vectorBullet.x = vectorBullet.x += speed * x;
        vectorBullet.y = vectorBullet.y += speed * y;
        
        if(obj) obj.bulletMove();

      if(obj.getBody().height + 50 < vectorBullet.y || obj.getBody().width + 50 < vectorBullet.x ||
        -50 > vectorBullet.y || -50 > vectorBullet.x || isLiveBullet) {
        bullet.remove();
        clearTimeout(timerBulletLoop);
        if(tank && tank.getBullet() == obj) tank.setCurrentBullet();
        if(enemy && enemy.getBulletEnemy() == obj) enemy.setCurrentBulletEnemy();
        obj = null;
      }
  }
  if(obj) obj.loop();

  return obj;
}

function Tank(x, y, width, height) {
  var obj = Object.create(model);
  var vector = {x: x, y: y, width: width, height: height};
  var bullet_length = 0;
  var elm = document.createElement('div');
  var speedX = 0;
  var speedY = 0;
  var speed = 1.5;
  var bulletX = 0;
  var bulletY = -1;
  var isPressX = false;
  var isPressY = false;
  var bullet;
  var tankLoopTimer;
  var isCurrentBullet = true;
  
  var isFocus = 1;
  var FPS = 60;
  
  elm.setAttribute("id", "tank");
  elm.style.transform = "translate3d("+ vector.x +"px ,"+ vector.y +"px ,"+ 0 +")";
  elm.style.width = vector.width +  "px";
  elm.style.height = vector.height +  "px";

  document.getElementById("body").appendChild(elm);

  obj.move = function() {
    elm.style.transform = "translate3d("+ vector.x +"px ,"+ vector.y +"px ,"+ 0 +")";
  }
  
  obj.getBullet = function() {
    return bullet;
  }
  
  obj.setCurrentBullet = function() {
    isCurrentBullet = true;
  }
  
  obj.shoot = function() {
    if(isCurrentBullet)  { 
      elm.style.background = "red";
      bullet = new Bullet(vector, bulletX, bulletY, obj);
    
    
      setTimeout(function(){
        elm.style.background = "orange";
      }, 100);
    }
    isCurrentBullet = false;
  }
  
  obj.getVector = function() {
    return vector;
  }
  
  obj.setVector = function(x,y) {
    vector.x = x;
    vector.y = y;
  }
  
  obj.die = function(complete = false) {
    clearTimeout(tankLoopTimer);
    document.removeEventListener("keypress", EventsPress);
    document.removeEventListener("keyup", EventsUp);
    
    for (var j = 0; j <  obj.getArrEnemys().length; j++) {
      obj.getArrEnemys()[j].die();
      j--;
    }
    
    var gameOver = document.createElement("h3");
    var reset = document.createElement("button");
    if(!complete) gameOver.innerHTML = "GAME OVER"; else gameOver.innerHTML = "COMPLETE";
    reset.innerHTML = "RESET";
    document.getElementById("body").appendChild(gameOver);
    document.getElementById("body").appendChild(reset);
    
    reset.addEventListener("click", ResetGame);
    
    function ResetGame(event) {
      
      gameOver.remove();
      reset.remove();
      reset.removeEventListener("click", ResetGame);
      
      StartGame();
    }
    
    obj = null;
    elm.remove();
  }
  
  document.addEventListener("keyup", EventsUp);
  
  function EventsUp(event) {
    
    if (event.keyCode == "39") {
      isPressX = false;
      speedX = 0;
    }
    if (event.keyCode == "37") {
      isPressX = false;
      speedX = 0;
    }
    if (event.keyCode == "38") {
      isPressY = false;
      speedY = 0;
    }
    if (event.keyCode == "40") {
      isPressY = false;
      speedY = 0;
    }
    
  }
  
  document.addEventListener("keydown", EventsPress);
  
  function EventsPress(event) {
    if (event.keyCode == "39") {
      isPressX = true;
      speedX = 1;
      speedY = 0;
      bulletX = 1;
      bulletY = 0;
    }
    if (event.keyCode == "37") {
      isPressX = true;
      speedX = -1;
      speedY = 0;
      bulletX = -1;
      bulletY = 0;
    }
    if (event.keyCode == "38") {
      isPressY = true;
      speedY = -1;
      speedX = 0;
      bulletY = -1;
      bulletX = 0;
      
    }
    if (event.keyCode == "40") {
      isPressY = true;
      speedY = 1;
      speedX = 0;
      bulletY = 1;
      bulletX = 0;
    }
    
    if (event.code == "Space") {
      if(obj) obj.shoot();
    }
  }
  
   obj.loop = function() {
      tankLoopTimer = setTimeout(obj.loop, 1000 / (isFocus * FPS));
      if(isPressX) {
        if(obj.getBody().width < vector.x + vector.width) {
          if(speedX == 1)speedX=0;
        }
        
        if(0 > vector.x) {
          if(speedX == -1)speedX=0;
        }
        
        vector.x += speed * speedX;
      }
      if(isPressY) {
        if(obj.getBody().height < vector.y + vector.height) {
          if(speedY == 1)speedY=0;
        }
        
         if(0 > vector.y) {
          if(speedY == -1)speedY=0;
        }
        
         vector.y += speed * speedY;
      }
      
      if(obj) obj.move();
      
  };
  if(obj) obj.loop();
  
  return obj;
}

StartGame();

function Enemy(tank,x, y, width, height, speed) {
  var obj = Object.create(tank);
  var vector = {x: x, y: y, width: width, height: height};
  var elm = document.createElement('div');
  elm.style.width = vector.width +  "px";
  elm.style.height = vector.height +  "px";
  var speedX = 0;
  var speedY = 0;
  var bullet;
  
  var timerWay;
  var timerBullet;
  var timerLoop;
  var isCurrentBullet = true;
  
  obj.setCurrentBulletEnemy = function() {
    isCurrentBullet = true;
  }
  
  obj.getElm = function() {
    return elm;
  }
  
  obj.getBulletEnemy = function() {
    return bullet;
  }
  
  obj.getVector = function() {
    return vector;
  }
  
  obj.move = function() {
    elm.style.transform = "translate3d("+ vector.x +"px ,"+ vector.y +"px ,"+ 0 +")";
  }
  
  obj.shoot = function() {
    if(isCurrentBullet || obj.getBody().width <= vector.x + vector.width && speedX == 1
    || 0 >= vector.x && speedX == -1 || obj.getBody().height <= vector.y + vector.height
    && speedY == 1 || 0 >= vector.y && speedY == -1) {
     bullet = new Bullet(vector, speedX, speedY, null, obj);
     isCurrentBullet = false;
    }
  }
  
  obj.die = function() {
    for (var j = 0; j <  obj.getArrEnemys().length; j++) {
      if(obj.getArrEnemys()[j] == obj) obj.getArrEnemys().splice(j, 1);
    }
    elm.remove();
    clearTimeout(timerWay);
    clearTimeout(timerBullet);
    clearTimeout(timerLoop);
    obj = null;
  }
 
  obj.wayTimer = function() {
      timerWay = setTimeout(function() {
        var arrWay = [{x: -1, y: 0},{x: 1, y: 0},{x: 0, y: -1},{x: 0, y: 1}];
        var random = Math.round(Math.random() * 3);
        var way = arrWay[random];
        
        speedX = way.x;
        speedY = way.y;
  
        obj.wayTimer();
        obj.shootTimer();
      }, 300 + Math.round(Math.random() * 3000));
  }
  
  if(obj) obj.wayTimer();
  
  obj.shootTimer = function() {
      timerBullet = setTimeout(function() {
        if(obj) obj.shoot();
      }, Math.round(Math.random() * 200));
  }
  
  var isFocus = 1;
  var FPS = 60;
  
  elm.setAttribute("id", "enemy");
  elm.style.transform = "translate3d("+ vector.x +"px ,"+ vector.y +"px ,"+ 0 +")";
  
  document.getElementById("body").appendChild(elm);

 obj.loop = function() {
   
        timerLoop = setTimeout(obj.loop, 1000 / (isFocus * FPS));
      
        if(obj.getBody().width < vector.x + vector.width) {
          speedX *= -1;
          vector.x -= 1;
        }
        
        if(0 > vector.x) {
          speedX *= -1;
          vector.x += 1;
        }
        
        if(obj.getBody().height < vector.y + vector.height) {
          speedY *= -1;
          vector.y -= 1;
        }
        
        if(0 > vector.y) {
          speedY *= -1;
          vector.y += 1;
        }
        
        vector.x += speed * speedX;
        vector.y += speed * speedY;
        
        for (var i = 0; i < obj.getArrEnemys().length; i++) {
            if(obj.getArrEnemys()[i] != obj) {
              if (vector.y <= obj.getArrEnemys()[i].getVector().y + obj.getArrEnemys()[i].getVector().height &&
                 vector.height + vector.y >= obj.getArrEnemys()[i].getVector().y && vector.x <= obj.getArrEnemys()[i].getVector().x + obj.getArrEnemys()[i].getVector().width &&
                 vector.x + vector.width >= obj.getArrEnemys()[i].getVector().x) {
                   
                  if(speedX == 0) speedY *= -1; 
                  if(speedY == 0) speedX *= -1; 
                  
                  if(speedX == 0 && speedY < 0) vector.y -= 1; 
                  if(speedX == 0 && speedY > 0) vector.y += 1; 
                  
                  if(speedY == 0 && speedX < 0) vector.x -= 1;
                  if(speedY == 0 && speedX > 0) vector.x += 1;
                
              }
            }
            
            if(bullet) {
              if (bullet.vectorBullet().y < tank.getVector().y + tank.getVector().height &&
                  5 + bullet.vectorBullet().y > tank.getVector().y 
                  && bullet.vectorBullet().x < tank.getVector().x + tank.getVector().width &&
                  bullet.vectorBullet().x + 5 > tank.getVector().x) {
            
                    bullet.setVectorBullet(-1000, -1000);
                    bullet.die();

                    tank.setVector(-100, -100);
                    tank.die();
                    break;
                  }
           }
           
           if (vector.y < tank.getVector().y + tank.getVector().height &&
               vector.height + vector.y > tank.getVector().y
               && vector.x < tank.getVector().x + tank.getVector().width &&
               vector.x + vector.width > tank.getVector().x) {

                 tank.setVector(-100, -100);
                 tank.die();
                     
                 break;
           }
            
            if(obj.getBullet()) {
              if (vector.y < obj.getBullet().vectorBullet().y + 5 &&
                 vector.height + vector.y > obj.getBullet().vectorBullet().y 
                 && vector.x < obj.getBullet().vectorBullet().x + 5 &&
                 vector.x + vector.width > obj.getBullet().vectorBullet().x) {
                   
                     obj.getBullet().setVectorBullet(-1000, -1000);
                     obj.getBullet().die();

                     if(obj.getArrEnemys().length == 1) {
                         tank.setVector(-100, -100);
                         tank.die(true);
                     }
                     
                     if(obj) obj.die();
                     break;
               }
            }
      obj.move();
    }
  }
  if(obj) obj.loop();
  obj.pushEnemyArr(obj);
  return obj;
}

function StartGame() {
  
  var tank = new Tank(180, 270, 20, 20);
  
  var enemy1 = new Enemy(tank, 40, 60, 20, 20, 0.5);
  var enemy2 = new Enemy(tank, 140, 60, 20, 20, 0.5);
  var enemy3 = new Enemy(tank, 240, 60, 20, 20, 0.5);
  var enemy4 = new Enemy(tank, 340, 60, 20, 20, 0.5);
  var enemy5 = new Enemy(tank, 90, 90, 15, 15, 1);
  var enemy6 = new Enemy(tank, 190, 90, 15, 15, 1);
  var enemy7 = new Enemy(tank, 290, 90, 15, 15, 1);
  var enemy8 = new Enemy(tank, 140, 120, 10, 10, 1.5);
  var enemy9 = new Enemy(tank, 240, 120, 10, 10, 1.5);
  var enemy10 = new Enemy(tank,195, 150, 5, 5, 2);
  
}
