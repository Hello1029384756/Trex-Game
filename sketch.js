var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var reset, gameOver;

var score;

var PLAY, END, gameState;

var die,jump,checkpoint

localStorage["Highest Score"]= 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  resetImage = loadImage("restart.png");
  
  gameOverImage = loadImage("gameOver.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  trex.addImage("trexcollide", trex_collided);
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  reset = createSprite(300,100,10,10);
  reset.addImage("restart", resetImage);
  reset.visible = false;
  reset.scale = 0.5;
  
  GameOver = createSprite(300,50,10,10);
  GameOver.addImage("GameWords", gameOverImage);
  GameOver.visible = false;
  GameOver.scale = 0.5;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  PLAY = 1;
  END = 0;
  gameState = PLAY;
  
}

function draw() {
  background(180);
  
  text("Score: "+ score, 500,50);
  
  text("Highest Score: " + localStorage["Highest Score"], 50,50);
  
  if(gameState === PLAY) {
  score = score + Math.round(getFrameRate()/60);
  
  if(score % 100 === 0 && score > 0) {
    checkpoint.play();
  }
    
  if(keyDown("space") && trex.y >= 158) {
    trex.velocityY = -11;
    jump.play();
  }  
    
  trex.velocityY = trex.velocityY + 0.6
  
  ground.velocityX = -6;
    
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  
   if(trex.isTouching(obstaclesGroup)) {
     gameState = END;
     die.play();
   }
    
  spawnClouds();
  spawnObstacles();
  
  } else if(gameState === END) {
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.velocityY = 0;
    ground.velocityX = 0;
    trex.changeAnimation("trexcollide");
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    GameOver.visible = true;
    reset.visible = true;
    
    if(mousePressedOver(reset)) {
    Restart();
  }
    
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function Restart () {
   gameState = PLAY;
   cloudsGroup.destroyEach();
   obstaclesGroup.destroyEach();
   trex.changeAnimation("running");
   GameOver.visible = false;
   reset.visible = false;
   if(localStorage["Highest Score"] < score) {
     localStorage["Highest Score"] = score;
   }
  
   score = 0;  
  
}
