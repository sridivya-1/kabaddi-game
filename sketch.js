// add your code here
var database
var player1,player2;
var position,position2, p1Animation,p2Animation;
var gameState;
var player1Score, player2Score;

function preload(){
    p1Animation = loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png");
    p2Animation = loadAnimation("assests/player2a.png","assests/player2b.png","assests/player2a.png");

}

function setup(){
    database = firebase.database();
    createCanvas(600,600)

player1 = createSprite(300,250,10,10);
player1.shapeColor = "red";
player1.addAnimation("walking",p1Animation);
p1Animation.frameDelay = 200;
player1.scale = 0.5;
player1.setCollider("circle",0,0,60);
player1.debug = true;

var player1Position = database.ref("player1/position");
player1Position.on("value",readPosition,showError);

player2 = createSprite(300,250,10,10)
player2.shapeColor = "yellow";
player2.addAnimation("walking2",p2Animation);
p2Animation.frameDelay = 200;
player2.scale = -0.5;
player2.setCollider("circle",0,0,60);
player2.debug = true;

var player2Position = database.ref("player2/position");
player2Position.on("value",readPosition2,showError);

gameState = database.ref("gameState");
gameState.on("value",readGS,showError);

player1Score = database.ref("player1Score");
player1Score.on("value",readScore1,showError);

player2Score = database.ref("player2Score");
player2Score.on("value",readScore2,showError);
}

function draw(){
    background("white");

    if(gameState === 0){
        fill ("black");
        text("press space to start the toss",100,200);
    
        if(keyDown("space")){
            rand = Math.round(random(1,2));
            if(rand === 1){
                database.ref("/").update({
                    gameState :1
                })
                alert("RED RIDE")
            }
            if(rand === 2){
                database.ref("/").update({
                    gameState :2
                })
                alert("YELLOW RIDE")
            }
            database.ref("player1/position").update({
                "x" : 150,
                "y" : 300
            })
            database.ref("player2/position").update({
                "x" : 450,
                "y" : 300
            })

        }
    }

    if(gameState === 1){
        if(keyDown(LEFT_ARROW)){
            writePosition(-5,0)
        }
        else if(keyDown(RIGHT_ARROW)){
            writePosition(5,0)
        }
        else if(keyDown(UP_ARROW)){
            writePosition(0,-5)
        }
        else if(keyDown(DOWN_ARROW)){
            writePosition(0,+5)
        }
        else if(keyDown("W")){
            writePosition2(0,-5)
        }
        else if(keyDown("D")){
            writePosition2(0,+5)
        }

        if(player1.x > 500){
            database.ref("/").update({
                "gameState" : 0,
                "player1Score" : player1Score - 5,
                
                "player2Score" : player2Score +5
               
            })
            alert("RED WIN")
        }

        if(player1.isTouching(player2)){
            database.ref('/').update({
                "gameState" : 0,
                "player1Score" : player1Score+5,
               
                "player2Score" : player2Score - 5
                
            })

            alert("RED LOST")
        }

    }

    if(gameState === 2){
        if(keyDown("a")){
            writePosition2(-5,0)
        }
        else if(keyDown("s")){
            writePosition2(5,0)
        }
        else if(keyDown("w")){
            writePosition2(0,-5)
        }
        else if(keyDown("d")){
            writePosition2(0,+5)
        }
        else if(keyDown(UP_ARROW)){
            writePosition(0,-5)
        }
        else if(keyDown(DOWN_ARROW)){
            writePosition(0,+5)
        }

        if(player2.x < 150){
            database.ref("/").update({
                "gameState" : 0,
                "player1Score" : player1Score + 5,
               
                "player2Score" : player2Score -5
            })
            alert("YELLOW WIN")
        }

         if(player1.isTouching(player2)){
            database.ref('/').update({
                "gameState" : 0,
                "player1Score" : player1Score - 5,
               
                "player2Score" : player2Score + 5
               
            })

            alert("YELLOW LOST")
        }

    }

    textSize(15);
    text("RED"+player1Score,350,15);
    text("YELLOW"+player2Score,150,15)
drawline();
drawline2();
drawline1();
//console.log(gameState)
drawSprites();    
}

function writePosition(x,y){
    database.ref("player1/position").set({
        'x':position.x + x,
        'y':position.y + y
    })
}

function writePosition2(x,y){
    database.ref("player2/position").set({
        'x':position2.x + x,
        'y':position2.y + y
    })
}

function readPosition(data){
    position = data.val();
    player1.x = position.x;
    player1.y = position.y;
}

function readPosition2(data){
    position2 = data.val();
    player2.x = position2.x;
    player2.y = position2.y;
}

function readGS(data){
   gameState = data.val();
}

function readScore1(data1){
    player1Score = data1.val();
 }

 function readScore2(data2){
    player2Score = data2.val();
 }
 
function showError(){
    console.log("error in the database")
}

function drawline(){
    for(var i = 0; i <600;i = i+20){
        line (300,i,300,i+10)
    }
}

function drawline1(){
    for(var i = 0; i <600;i = i+20){
        stroke ("yellow")
        strokeWeight(4)
        line (100,i,100,i+10)
    }
}

function drawline2(){
    for(var i = 0; i <600;i = i+20){
        stroke ("red");
        strokeWeight (4);
        line (500,i,500,i+10)
    }
}