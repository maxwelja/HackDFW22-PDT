/*
**
*   Premium De-Tedium!
*   Hack DFW 2022 Submission
*   Author: Jacob Maxwell
*   Last Edit: 9/25/2022
*
*   Interactive educational tool intended to simplify
*   exposure to new material
**
*/

//global variables for rendering and physics
const carImg = new Image();
carImg.src = "car.png";
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const CENTER_X = SCREEN_WIDTH/2;
const CENTER_Y = SCREEN_WIDTH/2;
const COLLISION_FACTOR = 0.8;
const BOUNDARY_OFFSET = 25; //debugging value for collision detection
PLAYER_SPEED = 4;   //effectively adjusts the game speed
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

//flags for collision detection and scoring
let colFlag = false;
let point = 0;
let score = 0;
let allEntities = [];

//player class object represents the player controlled entity
class player{
    constructor(x,y,width,height,color){
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.color = color;
        this.edges = [this.x-this.width*COLLISION_FACTOR, this.y-this.height*COLLISION_FACTOR,
                        this.x+this.width*COLLISION_FACTOR, this.y+this.height*COLLISION_FACTOR]
    }
    draw(){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.translate(-this.x,-this.y);
        context.drawImage(carImg, this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);  
        context.restore();  
    }
    update(){
        
    }
    reset(){
        this.x = CENTER_X;
        this.y = CENTER_Y;
    }
}

//entity class object to ease building the 2D scene
class entity{
    constructor(x,y,width,height,color,eventID){
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.width = width;
        this.height = height;
        this.color = color;
        this.eventID = eventID;
        this.edges = [this.x-this.width*COLLISION_FACTOR, this.y-this.height*COLLISION_FACTOR,
                        this.x+this.width*COLLISION_FACTOR, this.y+this.height*COLLISION_FACTOR]
    }
    draw(){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.translate(-this.x,-this.y);
        context.fillStyle = this.color;
        context.fillRect(this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);
        context.restore();  
    }
    update(){
        
    }
}

//player control
var keys = [];
window.addEventListener("keydown",function(e){
    keys[e.keyCode] = true;
})
window.addEventListener("keyup",function(e){
    keys[e.keyCode] = false;
})
//helper function for rotation
function DegToRad(num) {
    return (num * (Math.PI/180));
}

//initialize starting values and create objects
function init(){
    player = new player(CENTER_X,CENTER_Y,75,50,"red");   
    block1 = new entity(700,100,100,100,"darkred",1);
    block2 = new entity(700,200,100,100,"darkred",2);
    block3 = new entity(600,100,100,100,"darkred",3);
    block4 = new entity(100,550,10,25,"goldenrod",4);
    block5 = new entity(500,100,25,10,"goldenrod",5);
    block6 = new entity(50,50,25,10,"goldenrod",6);
    block7 = new entity(175,200,50,50,"darkgreen",7);
    block8 = new entity(75,450,50,50,"darkgreen",8);
    block9 = new entity(400,500,50,50,"darkgreen",9);
    block10 = new entity(350, 100, 50, 50,"darkgreen",10);
    block11 = new entity(SCREEN_WIDTH-50,SCREEN_HEIGHT-50,10,25,"goldenrod",11);
    colFlag = false;
    
    allEntities = [ block1, block2, block3,block4, block5, block6,
                    block7, block8, block9, block10, block11, player ];
}

//the entire game happens here
function gameLoop(){
    update();
    render();
}

//update handles entity animation and collision
function update(){
    //Move up on [W, up, 8]
    if (keys[87] == true || keys[38] == true || keys[104] == true){ 
        if (BOUNDARY_OFFSET + player.width/2 < player.x && player.x < SCREEN_WIDTH - BOUNDARY_OFFSET - player.width/2){
            let dx = PLAYER_SPEED * Math.cos(player.angle);
            player.x += dx;
            player.edges[0] += dx;
            player.edges[2] += dx;
        } else {
            player.reset();
        }
        if (BOUNDARY_OFFSET + player.height/2 < player.y && player.y < SCREEN_HEIGHT - BOUNDARY_OFFSET - player.height/2){
            let dy = PLAYER_SPEED * Math.sin(player.angle);
            player.y += dy;
            player.edges[1] += dy;
            player.edges[3] += dy;
        } else {
            player.reset();
        }
    }
    //move left on [A, left, 4]
    if (keys[65] == true || keys[37] == true || keys[100] == true){
        player.angle -= 0.1;
    }
    //move right on [D, right, 6]
    if (keys[68] == true || keys[39] == true || keys[102] == true){
        player.angle += 0.1;
    }
    //move down on [S, down, 2]
    if (keys[83] == true || keys[40] == true || keys[101] == true){
        if (player.width/2 < player.x && player.x < SCREEN_WIDTH - player.width/2){
            let dx = -PLAYER_SPEED * Math.cos(player.angle);
            player.x += dx;
            player.edges[0] += dx;
            player.edges[2] += dx;
        } else {
            player.reset();
        }
        if (player.height/2 < player.y && player.y < SCREEN_HEIGHT - player.height/2){
            let dy = -PLAYER_SPEED * Math.sin(player.angle);
            player.y += dy;
            player.edges[1] += dy;
            player.edges[3] += dy;
        } else {
            player.reset();
        }
    }
    
    //surprise on 'Backspace'
    if (keys[8] == true){
        for (let i = 0; i < allEntities.length; i++){
            allEntities[i].angle += 0.1;
        }
    }

    //coin animation
    for (let i = 0; i < allEntities.length; i++){
        if (allEntities[i].color == "goldenrod"){
            allEntities[i].angle += 0.1;
        }
    }

}

//entity collision detector: incomplete
/*function collider(e){
    //tricky entity collision: suspect it's an issue with canvas shuffling
    //in order: test car into -> right or top or left or bottom
    if (player.edges[0] < e.edges[2] && e.edges[3] > player.edges[1] && player.edges[1] < e.edges[3]){ colFlag = true; }
    if (player.edges[1] < e.edges[3] && e.edges[2] > player.edges[0] && player.edges[2] > e.edges[0]){ colFlag = true; }
    if (player.edges[2] > e.edges[0] && e.edges[3] > player.edges[1] && player.edges[3] > e.edges[1]){ colFlag = true; }
    if (player.edges[3] < e.edges[1] && e.edges[0] < player.edges[2] && player.edges[0] < e.edges[2]){ colFlag = true; }
    if (colFlag == true){
        point = performEvent(e.eventID);
    }
}
*/

//function for intended popup prompts
function performEvent(eID){
    console.log(eID);
    let answer = "";
    while (answer == null){
        //example: Maserati increases premium and decreases player score
        prompt("Given the option, would you prefer a flashy Maserati or an eco-friendly Tesla?");
    }
}

//the artist: draw objects on the screen
function render(){
    //clear screen
    context.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
    
    console.log("colFlag point score collide pEdges");
    console.log(colFlag, point, score, player.x, player.y, player.edges);

    //draw all entities; player last
   for (let i = 0; i < allEntities.length; i++){
        allEntities[i].draw();
        allEntities[i].update();
        //update score after event occurs
        if (allEntities[i] != player){
            //collider incomplete
            //collider(allEntities[i]);
            
            if (point != 0){
            score += point;
            point = 0;
            }
        }
   }
}

//set frame interval and start
window.setInterval(gameLoop,1000/60);
init();