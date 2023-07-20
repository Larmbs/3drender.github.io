//Declare Vars//
//Declare Vars//
//Declare Vars//
//Declare Vars//
//Declare Vars//

//Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;
canvas.style.background = '#aee5e6';

//Mouse cursor
//document.body.style.cursor = "none";
var rect = canvas.getBoundingClientRect();
canvas.addEventListener("mousemove", handleMouseMove);
var mouse_x;
var mouse_y;

//Click detector
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);

const cloudPack = new Image();
cloudPack.src = 'https://i.ibb.co/vVMpdqP/8614580.png';

var imageUrls = ['https://i.ibb.co/JxtwGgb/px-Art-1.png',

'https://i.ibb.co/SRV0M3d/px-Art-2.png',

'https://i.ibb.co/qJhk5Vf/px-Art-3.png',

'https://i.ibb.co/PtgH00W/px-Art-4.png',

'https://i.ibb.co/zRb8czd/px-Art-5.png',

'https://i.ibb.co/Y2CtJ3c/px-Art-6.png', 

'https://i.ibb.co/djd4QJt/px-Art-1-copy-2.png',

'https://i.ibb.co/3RcZRk1/px-Art-1-copy.png', 



'https://i.ibb.co/S68kpNC/F-86.png']


//Key press vars
var trottledown = false, trottleup = false, trottleInterval;

var zoomout = false, zoomin = false, zoomLevel = 0.09, zoomInterval, zoomScale = 0.01;

var screenScroll = [0, 0];

var particles = [];

var firing = false, shotCountMax = 100, shotCount = 0, coolDown = 200, ready = 200;

var bullets = [];

let f86;


//Classes//
//Classes//
//Classes//
//Classes//
//Classes//

//Plane Sprite Class 
class Player {
  //Declare this.vars
  constructor(name, Vx, Vy, liftForce, turnRate, maxThrust, thrust, thrustRate, angle, dragForce, img, flipped, x ,y) {
    this.name = name;
    this.Vx = Vx;
    this.Vy = Vy;
    this.liftForce = liftForce;
    this.turnRate = turnRate;
    this.maxThrust = maxThrust;
    this.thrust = thrust;
    this.thrustRate = thrustRate;
    this.angle = angle;
    this.dragForce = dragForce;
    this.img = img;
    this.Wx = window.innerWidth / 2;
    this.Wy = window.innerHeight / 2;
    this.gravity = 30;
    this.flipped = flipped;
    this.x = x;
    this.y = y;
    this.v = 0;
    this.airSpeedAngle = 0;
    this.count = 0;
  }
  //Run calc on forces
  updateForces() {
    var v = Math.sqrt((this.Vx ** 2) + (this.Vy ** 2));
    var attack = this.angle - this.airSpeedAngle;
    this.airSpeedAngle = this.angle;
    var bodyDragCoefficient = 0.05;
    var D = (this.dragForce * Math.sin(attack) + bodyDragCoefficient) * Math.pow(v, 2) / 10;
    var tX = this.thrust * Math.cos(this.angle) * 2.5;
    var tY = this.thrust * Math.sin(this.angle) * 2.5;
    //lX = 0 * v * this.liftForce * Math.cos(this.angle - Math.PI / 2) * Math.abs(Math.cos(this.angle - Math.PI / 2)) / 100;
    var lY = Math.abs(v * this.liftForce * Math.pow(Math.sin(this.angle + Math.PI / 2), 2)) / 200;
    this.Vx = Math.floor((Math.cos(this.angle) * (v - D) + tX + 0) * 10000) / 10000;
    this.Vy = Math.floor((Math.sin(this.angle) * (v - D) + tY + lY - this.gravity) * 100) / 100;
    this.x += this.Vx;
    this.y += this.Vy;
    this.v = v;

    if (this.y <= 10 && this.Vy < 0) {
      this.y = 25;
      this.Vy = 0;
      this.Vx /= 2
    };

    
    //particles

    //Smoke trail
    particles.push(new Trail(this.x + Math.cos(this.angle) * -230, this.y + Math.sin(this.angle) * -230 - Math.cos(this.angle) * 10, 'rgba(255, 255, 255, 0.5', Math.floor(Math.abs(this.v / 10)) , 60 , 0, 0, Math.atan2(this.Vy, this.Vx) + Math.PI, 30 + Math.abs(Math.sin(this.angle) * 30)));
    
    //particles.push(new Trail(this.x + Math.cos(-this.angle) * -90 - Math.sin(-this.angle) * -10, this.y + Math.sin(-this.angle) * -90 - Math.cos(-this.angle) * 10, 'rgba(252, 98, 3, 0.7', Math.floor(Math.abs(this.v / 32)) , 30, 0, 0, -this.angle + Math.PI));#511a19

    if (firing && shotCount <= shotCountMax && coolDown == ready) {
      if (this.count >= 3) {
        
        bullets.push(new Bullet(this.angle, 7.5, this.x + Math.cos(this.angle) * (Math.floor(Math.random() * (101)) + 100), this.y + Math.sin(this.angle) * (Math.floor(Math.random() * (101)) + 100), this.Vx + Math.cos(this.angle) * 200  + Math.floor(Math.random() * 4) - 2, this.Vy + Math.sin(this.angle) * 200  + Math.floor(Math.random() * 4) - 2, "red"));
        shotCount += 1;
        this.count = 0;
      }
      this.count += 1

    if (shotCount > shotCountMax) {
      coolDown = 0
      shotCount = 0;
      
    }
    } else if (coolDown < ready) {
      coolDown += 1
     } 
  }
  
  //Update pos of plane and draw
  update() {
  var a = ((this.angle + Math.PI / 8) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  var r = Math.floor(( 4 * a ) / Math.PI);
  
  ctx.save();
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  ctx.rotate(-this.angle + (Math.PI / 2));
  ctx.scale(-1 * zoomLevel / 2,1 * zoomLevel / 2);
  ctx.drawImage(resources[r], -resources[r].width / 2, -resources[r].height / 2, resources[r].width, resources[r].height);
  ctx.restore();

  
    
}
};

// Ground object class
class Ground {
  //Declare this.vars
  constructor(x, y, color, width, height, parallaxFactor, collider) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.m = parallaxFactor;
    this.collider = collider;
  }
  render() {
    if (Math.sqrt((this.x - f86.x) ** 2 + (this.y - f86.y) ** 2) <= 800 / zoomLevel + 13000 || this.m == 0) {
    ctx.fillStyle = this.color;
    // Draw the filled rectangle
    ctx.save();
    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.scale(zoomLevel,zoomLevel);
    ctx.fillRect(this.x  - screenScroll[0] * this.m, this.y + screenScroll[1], this.width, this.height);
    ctx.restore();}
  }
}

//Bullets class
class Bullet {
  constructor(direction, size, x, y, vx, vy, color, flak, time) {
    this.direction = direction;
    this.size = size;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.time = 0;
    this.color = color;
    this.flak = flak;
    this.maxTime = time;
  }
  update() {
    this.vx = this.vx;
    this.vy = this.vy - (1 * 1);
    this.x += this.vx;
    this.y += this.vy;
    this.time += 1;
    
    if (this.y > 10) {
      ctx.save();
      ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
      ctx.scale(zoomLevel,zoomLevel);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x - screenScroll[0], -this.y + screenScroll[1], this.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
      particles.push(new Trail(this.x, this.y, 'red', 1 , 30, 0, 0, Math.atan2(this.vy  , this.vx) + Math.PI, 20));

    } else if (this.size != null) {
      this.deleteNull()
      
      
    }

    if (this.maxTime <= this.time && this.flak) {
      this.deleteNull()

    }

  }
  deleteNull() {
    bullets.shift(0, 1);
    this.direction = null;
    this.size = null;
    this.x = null;
    this.y = null;
    this.vx = null;
    this.vy = null;
    this.time = null;
    this.color = null;
    this.maxTime = null;
    this.flak = null;
  }
}

//Trail
class Trail {
  constructor(x, y, color, time, size, vx, vy, angle, width) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.time = time;
    this.size = size;
    this.rate = size / time;
    this.vx = vx;
    this.vy = vy;
    this.angle = angle;
    this.width = width;
  }

  updateBasic() {
    
    if (this.size >= this.rate) {
      this.time -= 1;
      this.size -= this.rate
      
      ctx.save();
      ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
      ctx.scale(zoomLevel,zoomLevel);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x - screenScroll[0], -this.y + screenScroll[1], this.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
    if (this.time = 0) {
      this.x = null;
      this.y = null;
      this.color = null;
      this.time = null;
      this.size = null;
      this.rate = null;
      this.vx = null;
      this.vy = null;
      this.angle = null;
      this.width = null;
      particles.shift();
    }}
  
  
    updateTri() {
      if (Math.sqrt((this.x - f86.x) ** 2 + (this.y - f86.y) ** 2) <= 800 / zoomLevel) {
      if (this.size >= this.rate) {
        
        let VX1 = 1 * Math.cos(-this.angle) * this.size * 6;
        let VY1 = 1 * Math.sin(-this.angle) * this.size * 6;

        let VX2 = -1 * Math.sin(this.angle) * this.width * 0.5;
        let VY2 = -1 * Math.cos(this.angle) * this.width * 0.5;

        let VX3 = Math.sin(this.angle) * this.width * 0.5;
        let VY3 = Math.cos(this.angle) * this.width * 0.5;

        this.time -= 1;
        this.size -= this.rate

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
        ctx.scale(zoomLevel,zoomLevel);
        ctx.beginPath();
        ctx.moveTo(this.x + VX1 - screenScroll[0], -this.y + VY1 + screenScroll[1]);
        ctx.lineTo(this.x + VX2 - screenScroll[0], -this.y + VY2 + screenScroll[1]);
        ctx.lineTo(this.x + VX3 - screenScroll[0], -this.y + VY3 + screenScroll[1]);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
        
      if (this.time = 0) {
        delete this;
        particles.shift();
      }
    }}
}

class enemyTurret {
  constructor(x, y, turretAngle, size, bulletPower, accuracy) {
    this.x = x;
    this.y = y;
    this.turretAngle = turretAngle;
    this.size = size;
    this.bulletPower = bulletPower;
    this.accuracy = accuracy;
    this.c = 0;
  }

  drawBase() {
    ctx.fillStyle = "grey";

    ctx.save();
    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.scale(zoomLevel,zoomLevel);
    ctx.fillRect(this.x  - screenScroll[0], this.y + screenScroll[1], 1000, -500);
    ctx.restore();
  }

  drawTurret() {
    ctx.save();
    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.scale(zoomLevel,zoomLevel);
    ctx.fillStyle = "#9c9a9a";


    ctx.beginPath();
    ctx.moveTo(this.x - screenScroll[0] + 500, this.y + screenScroll[1] - 500);
    ctx.lineTo(this.x + 500 - screenScroll[0] + (Math.cos(this.turretAngle) * 1000), this.y - 500 + screenScroll[1] + (Math.sin(this.turretAngle) * -1000));
    
    ctx.lineWidth = 30;
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    
    ctx.beginPath();
    ctx.arc(this.x - screenScroll[0] + 500, this.y + screenScroll[1] - 500, 350, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }

  updateAim() {
    
    var dx = f86.x - this.x;
    var dy = f86.y - this.y;

    var d = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2)) / 500;

    var theta = Math.atan2(dy + f86.Vy * d, dx + f86.Vx * d + 10);

    this.turretAngle = theta;
  }

  updateAim1() {
    var dx = -5000 - this.x;
    var dy = -5000 + this.y;
    var v = 2000;
    var theta = Math.atan2(dy, dx);
  
    for (let i = 0; i < 200; i++) {
      var time = dx / (v * Math.cos(theta));
  
      var targetX = this.x + v * Math.cos(theta) * time;
      var targetY = this.y + v * Math.sin(theta) * time;
  
      var adjustedTheta = Math.atan2(targetY - this.y, targetX - this.x);
  
      theta = Math.atan2((targetY - this.y), (targetX - this.x)) + Math.atan(time / v);
    }
  
    this.turretAngle = theta;
  }

  update() {
    if (Math.sqrt((this.x - f86.x) ** 2 + (this.y + f86.y) ** 2) <= 8000 / zoomLevel) {
      this.updateAim()
      this.drawTurret()
      this.drawBase()
      this.c += 1;
      if (this.c > 15) {
        bullets.push(new Bullet(this.turretAngle, 7.5, this.x + 500 + (Math.cos(this.turretAngle) * 2500) ,  this.y + 500 + (Math.sin(this.turretAngle) * 2500), Math.cos(this.turretAngle) * 200, Math.sin(this.turretAngle) * 200, "red", true, 200));
        this.c = 0;
    }

    }
    

  }

}

class missle {
  constructor(x, y, vx, vy, angle, turnSpeed, thrust, targetRadius, targetDistance, team) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.angle = angle;

    this.turnSpeed = turnSpeed;
    this.thrust = thrust;
    this.targetRadius = targetRadius;
    this.targetDistance = targetDistance;

    this.size = size;
    this.team = team;
  }

  updateAngle() {


  }

  update() {


  }


}

//Functions//
//Functions//
//Functions//
//Functions//
//Functions//

// Key Down Listner
document.addEventListener("keydown", function (event) {
  if (event.repeat) return;
 
  if (event.key === "s" && f86.thrust > 0) {
    trottledown = true;
    trottleInterval = setInterval(trottleDown, 16);
  } else if (event.key === "w" && f86.thrust < 100) {
    trottleup = true;
    trottleInterval = setInterval(trottleUp, 16);
  } else if (event.key === "z") {
    zoomout = true;
    zoomInterval = setInterval(zoomOut, 16);
  } else if (event.key === "x") {
    zoomin = true;
    zoomInterval = setInterval(zoomIn, 16);
  };
});

// Key Up Listener
document.addEventListener("keyup", function (event) {
  
   if (event.key === "w") {
    trottleup = false;
  } else if (event.key === "s") {
    trottledown = false;
  } else if (event.key === "z") {
    zoomout = false;
  } else if (event.key === "x") {
    zoomin = false;
  };


  if (!trottleup && !trottledown) {
    clearInterval(trottleInterval);
  }
  if (!zoomout && !zoomin) {
    clearInterval(zoomInterval);
  }});


  //functions for key presses 
  
  function trottleUp() {
    if (f86.thrust < 100) {f86.thrust += 1;}}
  function trottleDown() {
    if (f86.thrust > 0) {f86.thrust -= 1;}}

  function zoomIn() {zoomLevel += zoomScale;}
  function zoomOut() {
    zoomLevel -= zoomScale;
    if (zoomLevel < zoomScale) {zoomLevel = zoomScale;}}


  function handleMouseMove(event) {
    mouse_x = event.clientX - rect.left;
    mouse_y = event.clientY - rect.top;
    //f86.angle = Math.atan2(-mouse_y + window.innerHeight / 2, mouse_x - window.innerWidth / 2)
    }

  function handleMouseDown() {firing = true;}
  function handleMouseUp() {firing = false;}

  function adjustAngle(angleRad) {
    while (angleRad < 0 || angleRad >= 2 * Math.PI) {
      if (angleRad < 0) {
        angleRad += 2 * Math.PI;
      } else if (angleRad >= 2 * Math.PI) {
        angleRad -= 2 * Math.PI;
      }
    }
    return angleRad;
  }


  function findAngle() {

    var nAngle = Math.atan2(-mouse_y + window.innerHeight / 2, mouse_x - window.innerWidth / 2)
    if (nAngle === NaN) {nAngle == 0};
    var dif = nAngle - f86.angle
  
    var result;
    if (dif != 0) {
      var min = Math.min(Math.abs(dif), Math.abs(dif + (Math.PI * 2)), Math.abs(dif - (Math.PI * 2)));

      if (Math.abs(dif) === min) {
        result = dif;
      } else if (Math.abs(dif - Math.PI * 2) === min) {
        result = dif - Math.PI * 2;
      } else {
        result = dif + Math.PI * 2;
      }   
  
          if (Math.abs(result) > f86.turnRate) {
  
            if (result < 0) {f86.angle -= f86.turnRate;}
  
            else {f86.angle += f86.turnRate;}} 
  
          else{f86.angle === nAngle;}
  
    }
    f86.angle = adjustAngle(f86.angle);
    

  }

  /*function drawCursor(){
    ctx.save()
    ctx.scale(0.5, 0.5)
    ctx.fillStyle = "rgba(60, 255, 0, 1)";
    ctx.strokeStyle = "rgba(60, 255, 0, 1)";
    ctx.lineWidth = 10;
    
    ctx.beginPath();
    ctx.arc(mouse_x , mouse_y + window_height / 2, 160, 0, Math.PI * 2 );
    ctx.stroke();

  
    // Transform "Rectangle"
   
    // Draw "Rectangle"
    ctx.beginPath();
    ctx.rect(-48, 0, 352, 32);
    ctx.fill();
    

   
    
    // Draw "Rectangle 1"
    ctx.beginPath();
    ctx.rect(0, -80, 32, 352);
    ctx.fill();
    
    ctx.restore()
  }*/
  
//MainLoop//
//MainLoop//
//MainLoop//
//MainLoop//
//MainLoop//
//MainLoop//

ground = new Ground(-500000, 0, "#315e33", 1000000, 50000, 0, true);

var grounds = [ground];
var buildCount = 0
for (let i = 0; buildCount > i; i++) {
  let height = Math.floor((Math.random() * 10000)) + 1000
  grounds.push(new Ground(buildCount * -3000 / 2 + i * 3000, -height, "rgba(113, 122, 163, 1)", 1500, height, 1, false))

};

//var grounds = [tower18, tower17, tower16, tower15, tower14, tower13, tower12, tower11, tower10, tower9, tower8, tower7, tower6, tower5, tower4, tower3, tower2, tower1, ground];
//var grounds = [tower14, tower13, tower12, tower11, tower10, tower9, tower8, tower7, tower6, tower5, tower4, tower3, tower2, tower1];

var resources = [];

function loadResources(resourceUrls) {
  return new Promise(function(resolve, reject) {
    var loadedResources = 0;
    var totalResources = resourceUrls.length;
    

    function onLoad() {
      loadedResources++;
      if (loadedResources === totalResources) {
        resolve(resources);
      }
    }
    function onError() {
      reject(new Error("Failed to load resources."));
    }
    resourceUrls.forEach(function(url) {
      var extension = url.split(".").pop().toLowerCase();
      var resource;
      if (extension === "json") {
        resource = new XMLHttpRequest();
        resource.overrideMimeType("application/json");
        resource.responseType = "json";
      } else if (["png", "jpg", "jpeg", "gif", "svg"].indexOf(extension) !== -1) {
        resource = new Image();
      } else {
        // Unsupported resource type
        return;
      }
      resource.onload = onLoad;
      resource.onerror = onError;
      resource.src = url;
      resources.push(resource);
    });
  });
}

turret1 = new enemyTurret(0, 0, 0, 50, 50, 50)
turret2 = new enemyTurret(50000, 0, 0, 50, 50, 50)
turret3 = new enemyTurret(-50000, 0, 0, 50, 50, 50)



loadResources(imageUrls)
  .then(function(resources) {
    
    
    f86 = new Player("f86", 0, 0, 20, Math.PI / 90, 100, 0, 1, 0, 0.003125, resources[1], true, 0 ,10000);
    mainLoop();
  })
  .catch(function(error) {
    console.error("Failed to load resources:", error);
  });
function mainLoop() {
  // Your game logic here
}


function mainLoop() {

    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  
   
    f86.updateForces();
    screenScroll = [f86.x, f86.y];
    
    for (i = 0; i < grounds.length; i++) {
      grounds[i].render();
    }

    for (i = 0; i < bullets.length; i++) {
      bullets[i].update();
    }

    turret1.update()
    turret2.update()
    turret3.update()

    findAngle()
    f86.update();
    for (i = 0; i < particles.length; i++) {
      particles[i].updateTri(0);
    }
   

    //drawCursor()

    
    ctx.font = '20px B612 Mono';
    ctx.fillStyle = 'rgba(46, 46, 46, 0.5)';
    ctx.fillRect(-1, -1, 150, 280)
    ctx.fillStyle = 'rgba(60, 255, 0, 1)';
    ctx.strokeStyle = 'rgba(60, 255, 0, 1)';
    ctx.strokeRect(-1, -1, 150, 280);
    ctx.fillText(`XCor:${Math.floor(f86.x / 10)}`, 5, 25);
    ctx.fillText(`YCor:${Math.floor(f86.y / 10)}`, 5, 55);
    ctx.fillText(`Speed:${Math.floor(f86.v * 2)}`, 5, 85);
    ctx.fillText(`VX:${Math.abs(Math.floor(f86.Vx * 2))}`, 5, 115);
    ctx.fillText(`VY:${Math.abs(Math.floor(f86.Vy * 2))}`, 5, 145);
    ctx.fillText(`Ammo:${coolDown == ready ? shotCountMax - shotCount: "--"}`, 5, 175);
    ctx.fillText(`Power:${f86.thrust}`, 5, 205);
    ctx.fillText(`Ammo:${coolDown < ready ? coolDown: "--"}`, 5, 235);
    
    requestAnimationFrame(mainLoop);
}





  
