// highscore is undefined... but original works okay...
var canvas;
var canvasContext;
var isStarted; 
var isPaused;   
var isGameOver; 
var isReplay; 
var gameTime; 
var canUseInnerText;
var time;
var game;

var world;
var WORLD_ID = 0;
var WORLD_COLOUR = "#E6E6E6";
var WORLD_HEIGHT;
var WORLD_WIDTH;
var GRID_COLOUR = "#FFFFFF";
var GRID_LINE_WIDTH = 0.5;
var BLOCK_SIZE = 16;

var PLAYER_ID = 4;
var PLAYER_COLOUR = "#1B1BB3";
var playerBody;
var direction;
var score;
var highScore;

var FOOD_ID = 5;
var FOOD_COLOUR = "#00FF00";
var FOOD_ROW;
var FOOD_COL;
var FOOD_POINTS = 10;

var rotterPositions;
var ROTTER_ID = 2;
var DEAD_ROTTER_ID = 3;
var DEAD_ROTTER_COLOUR = "#000000";
var ROTTER_POINTS = 25;
var rotterColours;
var rotterCount;
var rotterColourIndex;
var currentRotterIndex;
var rotterLifeTime;
var rotUnit;
var foodEatenFX;
var deathFX;
var rotterEatenFX;

 function checkIfSupported() 
 {
     canvas = document.getElementById('gameCanvas');
     if (canvas.getContext) 
     {
         canvasContext = canvas.getContext('2d');
         Init();
     }
     else 
     {
         alert('No HTML5 Canvas support!');
     }
 }
 
 function Init()
 {
    isPaused = false;
    isGameOver = false;
    isStarted = false;
    score = ReadHighScore();
    time = 10000;
    gameTime = (time / 60);
    CreateWorld();
    CreatePlayer();
    CreateRotterPositions();
    rotUnit = 10;
    rotterCount = rotterPositions.length - 1;
    rotterColours = new Array();
    rotterColours.push("#FFFF00", "#FFFF00", "#FFBF00", "#FFBF00", "#FF8000", "#B45F04", "#B45F04", "#61210B", "#610B0B", "#000000");
    currentRotterIndex = 0;
    world[rotterPositions[currentRotterIndex].row][rotterPositions[currentRotterIndex].col] = ROTTER_ID;
    PlaceFood();
    rotterLifeTime = 1000;
    gameCanvas.addEventListener('click', Start, false);
    document.addEventListener('keydown', KeyDown, false);
    canUseInnerText = document.all;
    foodEatenFX = new Audio("sounds/foodEaten.ogg");
    deathFX = new Audio("sounds/death.ogg");
    rotterEatenFX = new Audio("sounds/rotterEaten.ogg");
    
    if (!isReplay)
    {
        DrawStartMessage();
    }
    else
    {
        Start();
    }
    isReplay = false;
    
    if (canUseInnerText)
    {
        document.getElementById('score').innerText = "0";
    }
    else
    {
        document.getElementById('score').textContent = "0";
    }

    score = 0;
    ReadHighScore();
 }
 
function Start()
{
    gameCanvas.removeEventListener('click', Start, false);
    game = setTimeout(Update, gameTime);
    isStarted = true;
}

function Update()
{
    if (!isGameOver)
    {
        UpdateRotter();
        KeepPlayerMoving();
        Draw();
        game = setTimeout(Update, gameTime);
    }
    else
    {
        GameOver();
    }
}

function UpdateRotter()
{
    if (rotterLifeTime > 0)
    {
        rotterLifeTime -= rotUnit;
        
        if (rotterLifeTime <= 1000 && rotterLifeTime > 900)
        {
            rotterColourIndex = 0;
        }
        else if (rotterLifeTime <= 900  && rotterLifeTime > 800)
        {
            rotterColourIndex = 1;
        }
        else if (rotterLifeTime <= 800 && rotterLifeTime > 700)
        {
            rotterColourIndex = 2;
        }
        else if (rotterLifeTime <= 700 && rotterLifeTime > 600)
        {
            rotterColourIndex = 3;
        }
        else if (rotterLifeTime <= 600 && rotterLifeTime > 500)
        {
            rotterColourIndex = 4;
        }
        else if (rotterLifeTime <= 500 && rotterLifeTime > 400)
        {
            rotterColourIndex = 5;
        }
        else if (rotterLifeTime <= 400 && rotterLifeTime > 300)
        {
            rotterColourIndex = 6;
        }
        else if (rotterLifeTime <= 300 && rotterLifeTime > 200)
        {
            rotterColourIndex = 7;
        }
        else if (rotterLifeTime <= 200 && rotterLifeTime > 100)
        {
            rotterColourIndex = 8;
        }
        else if (rotterLifeTime <= 100 && rotterLifeTime > 0)
        {
            rotterColourIndex = 9;
        }
    }
    else
    {
        if (rotterCount > 0)
        {
            PickRandomRotter(false);
        }
        else
        {
            document.write('rottercount: ' + rotterCount);
        }
    }
    
}

function Pause()
{
    isPaused = true;
    clearTimeout(game);
    DrawPausedMessage();
}

// handles when the player resumes a paused game
function Resume()   
{
    isPaused = false;
    game = setTimeout(Update, gameTime);
}

function UpdateScore(points)
{
    score += points;

    if (score % 100 === 0)
    {
        if (time > 1000)
        {
            time -= 100;
            rotUnit += 2;
        }
    }
    
    if (canUseInnerText)
    {
        document.getElementById('score').innerText = score;
    }
    else
    {
        document.getElementById('score').textContent = score;
    }
}

function ReadHighScore()
{
    if (window.localStorage)
    {
        highScore = localStorage.getItem("nyomScore");
        
        if (highScore == null)
        {
            highScore = 0;
        }
    }
    else
    {
        highScore = 0;
    }
    
    // display highscore on page...
    if (canUseInnerText)
    {
        document.getElementById('highScore').innerText = highScore;
    }
    else
    {
        document.getElementById('highScore').textContent = highScore;
    }
}

function WriteHighScore()
{   
    if (window.localStorage)
    {
        if (score > highScore)
        {
            // new highscore!
            localStorage.setItem("nyomScore", score);
            
            if (canUseInnerText)
            {
                document.getElementById('highScore').innerText = highScore;
            }
            else
            {
                document.getElementById('highScore').textContent = highScore;
            }
        }
    } 
}

function KeyDown(event)
{    
    switch (event.keyCode)
    {
        case 32:
            // SPACE
            if (isStarted)
            {
                if (!isPaused)
                {
                    Pause();
                }
                else
                {
                    Resume();
                }
            }
            break;
        case 37:
            // LEFT
            if (direction != 'LEFT')
            {
                direction = 'LEFT';
                MovePlayer(playerBody.head.data.row - 1, playerBody.head.data.col);
            }
            break;
        case 38:
            if (direction != 'UP')
            {
                direction = 'UP';
                MovePlayer(playerBody.head.data.row, playerBody.head.data.col - 1);
            }
            // UP
            break;
        case 39:
            if (direction != 'RIGHT')
            {
                direction = 'RIGHT';
                MovePlayer(playerBody.head.data.row + 1, playerBody.head.data.col);
            }
            // RIGHT
            break;
        case 40:
            if (direction != 'DOWN')
            {
                direction = 'DOWN';
                MovePlayer(playerBody.head.data.row, playerBody.head.data.col + 1);
            }
            // DOWN
            break;
    }
}

function KeepPlayerMoving()
{
    switch (direction)
    {
        case 'UP':
            MovePlayer(playerBody.head.data.row, playerBody.head.data.col - 1);
            break;
        case 'DOWN':
            MovePlayer(playerBody.head.data.row, playerBody.head.data.col + 1);
            break;
        case 'LEFT':
            MovePlayer(playerBody.head.data.row - 1, playerBody.head.data.col);
            break;
        case 'RIGHT':
            MovePlayer(playerBody.head.data.row + 1, playerBody.head.data.col);
            break;
    }
}

function MovePlayer(newRow, newCol)
{

     // future position is a wall
     if (newRow < 0 || newRow >= WORLD_HEIGHT || newCol < 0 || newCol >= WORLD_WIDTH)
     {
         isGameOver = true;
     }
     else if (world[newRow][newCol] == PLAYER_ID)
     {
         isGameOver = true;
     }
     else if (world[newRow][newCol] == DEAD_ROTTER_ID)
     {
        isGameOver = true;
     }
     else if (world[newRow][newCol] == ROTTER_ID)
     {
        PickRandomRotter(true);
     }
     else if (world[newRow][newCol] == FOOD_ID)
     {
        FoodEaten();
     }

     if (!isGameOver)
     {
         var block = new BodyBlock();
         block.row = newRow;
         block.col = newCol;
         // clear the old tail spot
         world[playerBody.tail.data.row][playerBody.tail.data.col] = WORLD_ID;
         playerBody.Remove(playerBody.tail.data);
         playerBody.Push(block);

         var current = playerBody.head;

         while (current != null)
         {
             world[current.data.row][current.data.col] = PLAYER_ID;
             current = current.next;
         }
     }
 }

function BodyBlock(data)
{
    this.row = -1;
    this.col = -1;
}

function Clicked(e)
{
    var posn = GetCursorPos(e);
}

function CursorPositison(x,y)    
{
    this.x = x;
    this.y = y;
}

function GetCursorPos(e)
{
    var x;
    var y;
    
    if (e.pageX || e.pageY)
    {
        x = e.pageX;
        y = e.pageY;
    }
    else
    {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
  
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
  
    var cursorPos = new CursorPosition(x, y);
  
    return cursorPos;
}

function CreateWorld()
{
    WORLD_HEIGHT = 33;
    WORLD_WIDTH = 33;
    // create world
    world = new Array(WORLD_HEIGHT);

    for (var h = 0; h < WORLD_HEIGHT; h++)
    {
        world[h] = new Array(WORLD_WIDTH);

        for (var w = 0; w < WORLD_WIDTH; w++)
        {
            // world[w][h] where [0][1]...[0][49] is undefined
            world[h][w] = WORLD_ID;
         }
    }
}

function CreatePlayer()
{
    // this will change based on difficulty selected.
    playerBody = new LinkedList();
  
    var block1 = new BodyBlock();
    block1.row = 8;
    block1.col = 5;
    playerBody.Add(block1);
    var block2 = new BodyBlock();
    block2.row = 7;
    block2.col = 5;
    playerBody.Add(block2);
    var block3 = new BodyBlock();
    block3.row = 6;
    block3.col = 5;
    playerBody.Add(block3);
    var block4 = new BodyBlock();
    block4.row = 5;
    block4.col = 5;
    playerBody.Add(block4);
    direction = "RIGHT";
    var current = playerBody.head;
    while (current != null)
    {
        world[current.data.row][current.data.col] = PLAYER_ID;
        current = current.next;
    }
}

function GrowPlayer()
{
    // make one block longer
     var newBlock = new BodyBlock();
     newBlock.row = playerBody.head.data.row;
     newBlock.col = playerBody.head.data.col;
     playerBody.Push(newBlock);
 }


function PickRandomRotter(eaten)
{ 
    if (!eaten)
    {
        rotterCount--;
         // this rotter is D-E-A-D.
        world[rotterPositions[currentRotterIndex].row][rotterPositions[currentRotterIndex].col] = DEAD_ROTTER_ID;
    }
    else
    {
         // rotter was eaten
        rotterEatenFX.play();
        world[rotterPositions[currentRotterIndex].row][rotterPositions[currentRotterIndex].col] = WORLD_ID;
        UpdateScore(ROTTER_POINTS);
        GrowPlayer();
    }
    
    do
    {
        currentRotterIndex = GenerateRandomNumber(0, rotterPositions.length - 1);
    } while (GetCellContent(currentRotterIndex) > 0);
    // new rotter
    rotterLifeTime = 1000;
    // set colour here to stop that flash of brown / black when a new rotter's draw on screen.
    rotterColourIndex = 0;

    // new rotter!
    world[rotterPositions[currentRotterIndex].row][rotterPositions[currentRotterIndex].col] = ROTTER_ID;
}

function GetCellContent(index)
{
    return world[rotterPositions[index].row][rotterPositions[index].col];
}

function CreateRotterPositions()
{
    var i = 0;
    rotterPositions = new Array();
    
     for (i = 0; i < WORLD_WIDTH; i++)
     {
         rotterPositions.push({row:i, col:9});
     }
     
     for (i = 0; i < WORLD_WIDTH; i++)
     {
         rotterPositions.push({row:i, col:20});
     }
     
     for (i = 0; i < WORLD_HEIGHT; i++)
     {
         rotterPositions.push({row:9, col:i});
     }
     
     for (i = 0; i < WORLD_HEIGHT; i++)
     {
         rotterPositions.push({row:20, col:i});
     }
}

function GenerateRandomNumber(min, max)
{
    var range = max - min + 1;
    return Math.floor(Math.random() * range + min);
}

function FoodEaten()
{
    foodEatenFX.play();
    world[FOOD_ROW][FOOD_COL] = WORLD_ID;
    UpdateScore(FOOD_POINTS);
    GrowPlayer();
    PlaceFood();
}

function PlaceFood()
{
    do {
        FOOD_ROW = GenerateRandomNumber(0, WORLD_HEIGHT - 1);
        FOOD_COL = GenerateRandomNumber(0, WORLD_WIDTH - 1);
    } while (world[FOOD_ROW][FOOD_COL] > 0);
    
    world[FOOD_ROW][FOOD_COL] = FOOD_ID;
}

function GameOver()
{
    clearTimeout(game);
    isGameOver = true;
    deathFX.play();
    canvas.removeEventListener('click', Clicked, false);
    canvas.addEventListener('click', Replay, false);
    WriteHighScore();
    DrawGameOverMessage();
}

function Replay()
{
    isReplay = true;
    Init();
    canvas.removeEventListener('click', Replay, false);
}

function ClearCanvas()
{
    // clear the canvas
    canvasContext.fillStyle = "000";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);    
}
 
function DrawStartMessage()
{
    ClearCanvas();
    canvasContext.fillStyle = "#FFF";
    canvasContext.font = 'bold 20px Courier';
    canvasContext.fillText("READY?", 215, ~~(canvas.height / 2) - 80);
    canvasContext.fillText("CLICK HERE TO START!", 130, ~~(canvas.height / 2) - 10);    
}

function DrawPausedMessage()
{
    ClearCanvas();
    canvasContext.fillStyle = "FFF";
    canvasContext.font = 'bold 20px Courier';
    canvasContext.fillText("PAUSED", 215, ~~(canvas.height/ 2) - 80);
    canvasContext.fillText("PRESS SPACE TO RESUME!", 130, ~~(canvas.height / 2) - 10);
}

function DrawGameOverMessage()
{
    ClearCanvas();
    canvasContext.fillStyle = "FFF";
    canvasContext.font = 'bold 20px Courier';
    canvasContext.fillText("GAME OVER :-(", 200, ~~(canvas.height / 2) - 50);
    var text = "";
    if (score > highScore)
    {
        canvasContext.fillStyle = "F00";
        text = "NEW HIGH SCORE: " + score;
        canvasContext.fillText(text, 165, ~~(canvas.height / 2) - 10);
    }
    else
    {
        canvasContext.fillStyle = "FFF";
        text = "SCORE: " + score;
        canvasContext.fillText(text, 215, ~~(canvas.height / 2) - 10);
    }

    canvasContext.fillStyle = "FFF";
    canvasContext.fillText("CLICK HERE TO PLAY AGAIN!", 125, ~~(canvas.height / 2) + 30);
}

function Draw()
{
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!isGameOver)
    {
        for (var r = 0; r < WORLD_HEIGHT; r++)
        {
             for (var c = 0; c < WORLD_WIDTH; c++)
             {
                 var colour = "";
                 
                 switch(world[r][c])
                 {
                     case WORLD_ID:
                         colour = WORLD_COLOUR;
                         break;
                     case PLAYER_ID:
                         colour = PLAYER_COLOUR;
                         break;
                     case FOOD_ID:
                         colour = FOOD_COLOUR;
                         break;
                    case DEAD_ROTTER_ID:
                        colour = DEAD_ROTTER_COLOUR;
                        break;
                     case ROTTER_ID:
                        colour = rotterColours[rotterColourIndex];
                         break;
                     default:
                         colour = "rgb(255, 0, 0)"; // seeing a red square? something's not working properly!
                         break;
                 }
                 canvasContext.fillStyle = colour;
                 canvasContext.fillRect(r * BLOCK_SIZE, c * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
             }
         }

         // draw grid overlay
         canvasContext.fillStyle = GRID_COLOUR;
         for (var i = 0; i < WORLD_HEIGHT; i++)
         {
             canvasContext.fillRect(i * BLOCK_SIZE, 0, GRID_LINE_WIDTH, canvas.height);
             canvasContext.fillRect(0, i * BLOCK_SIZE, canvas.width, GRID_LINE_WIDTH);
         }
    }
 }