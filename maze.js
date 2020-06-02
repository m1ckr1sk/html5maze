class Box {
    constructor(boxNumber) {
        this.number = boxNumber;
        this.left = false;
        this.right = false;
        this.top = false;
        this.bottom = false;
    }

    set leftBlocked(leftBlockedValue) {
        this.left = leftBlockedValue;
    }
    set rightBlocked(rightBlockedValue) {
        this.right = rightBlockedValue;
    }
    set topBlocked(topBlockedValue) {
        this.top = topBlockedValue;
    }
    set bottomBlocked(bottomBlockedValue) {
        this.bottom = bottomBlockedValue;
    }

    get isFullyBlocked() {
        return this.left && this.right && this.top && this.bottom
    }
};


/*=============================================================================*/
/* Variables
/*=============================================================================*/
var canvas = document.getElementById("MazeCanvas");
var ctx = canvas.getContext('2d');
var offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
var offCtx = offscreenCanvas.getContext('2d');

var discoFloorCanvas = document.createElement('canvas');
discoFloorCanvas.width = canvas.width;
discoFloorCanvas.height = canvas.height;
var discoCtx = discoFloorCanvas.getContext('2d');

var grid_size = 20;
var size = 20;
var start_x = 10;
var start_y = 45;
var density = 0.4;
var density_in_use = 1.0 - density;

var currentAgentBoxes = [];
var currentAgentColours = [];
for (var i = 0; i <= grid_size; i++) {
    currentAgentBoxes.push(i);
    currentAgentColours.push(getRandomColor())
}

var moveTime = 100;
var move_then = Date.now();

var fps = 10;
var fpsInterval = 1000 / fps;
var then = Date.now();
var startTime = then;
var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;


createMaze();
renderMaze();
renderDiscoFloor()
renderAgent();

/*=============================================================================*/
/* Utility Functions
/*=============================================================================*/
function draw_line(startx, starty, endx, endy) {
    offCtx.fillStyle = '#000000'
    offCtx.moveTo(startx, starty);
    offCtx.lineTo(endx, endy);
    offCtx.stroke();
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

/*=============================================================================*/
/* Create Maze
/*=============================================================================*/
function createMaze() {

    boxes = [];
    var x;
    current_x = start_x;
    current_y = start_y;
    for (y = 0; y < grid_size; y++) {
        for (x = 0; x < grid_size; x++) {
            current_box = (x + (grid_size * y))
            boxes.push(new Box(current_box))

            console.log('Assessing box ' + current_box)

            if(current_box < grid_size){
                boxes[current_box].topBlocked = true;
            }

            if(current_box >= grid_size * (grid_size - 1)){
                boxes[current_box].bottomBlocked = true;
            }

            if((current_box % grid_size) == 0){
                boxes[current_box].leftBlocked = true;
            }

            if(((current_box + 1) % grid_size) == 0){
                boxes[current_box].rightBlocked = true;
            }

            if (Math.random() > density_in_use) {
                top_box = current_box;
                bottom_box = (x + (grid_size * (y - 1)));
                console.log('Blocking top box:' + top_box);
                if (bottom_box > -1) {
                    console.log('Blocking bottom box:' + bottom_box);
                    boxes[bottom_box].bottomBlocked = true;
                }
                boxes[top_box].topBlocked = true;
            }

            if (Math.random() > density_in_use) {
                left_box = current_box;

                console.log('Blocking left box ' + left_box);

                boxes[left_box].leftBlocked = true;

                if (x > 0) {
                    right_box = current_box - 1;
                    boxes[right_box].rightBlocked = true;
                    console.log('Blocking right box ' + right_box);
                }
            }
            current_x = current_x + size;
        }
        current_y = current_y + size;
        current_x = start_x;
    }

    return boxes;
};


function renderMaze() {

    current_x = start_x;
    current_y = start_y;

    ctx.beginPath();

    for (y = 0; y < grid_size; y++) {
        for (x = 0; x < grid_size; x++) {
            current_box = x + (y * grid_size);
            if (!boxes[current_box].isFullyBlocked) {

                if (boxes[current_box].left) {
                    draw_line(current_x, current_y, current_x, current_y + size);
                }
                if (boxes[current_box].right) {
                    draw_line(current_x + size, current_y, current_x + size, current_y + size);
                }
                if (boxes[current_box].top) {
                    draw_line(current_x, current_y, current_x + size, current_y);
                }
                if (boxes[current_box].bottom) {
                    draw_line(current_x, current_y + size, current_x + size, current_y + size);
                }
            }

            current_x = current_x + size;
        }
        current_x = start_x;
        current_y = current_y + size;
    }
    ctx.closePath();
};

function renderDiscoFloor() {

    current_x = start_x;
    current_y = start_y;

    for (y = 0; y < grid_size; y++) {
        for (x = 0; x < grid_size; x++) {
            current_box = x + (y * grid_size);
            if (boxes[current_box].isFullyBlocked) {
                offCtx.fillStyle = '#000000'
                offCtx.fillRect(current_x, current_y, size, size);
            }
            else {
                discoCtx.fillStyle = getRandomColor();
                discoCtx.fillRect(current_x, current_y, size, size);
            }
            current_x = current_x + size;
        }
        current_x = start_x;
        current_y = current_y + size;
    }
};

function renderAgent() {
    // request another frame
    requestAnimationFrame(renderAgent);
 

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    elapsed_move = now - move_then;

    then = now - (elapsed % fpsInterval);
    move_then = now - (elapsed_move % moveTime);

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        ctx.drawImage(offscreenCanvas, 0, 0);
        ctx.globalAlpha = 0.3;
        ctx.drawImage(discoFloorCanvas, 0, 0);

        for(agentIndex = 0; agentIndex < currentAgentBoxes.length;agentIndex++){
            agent_x = start_x + ((currentAgentBoxes[agentIndex] % grid_size) * size);
            agent_y = start_y + (Math.floor(currentAgentBoxes[agentIndex] / grid_size) * size);
            ctx.fillStyle = currentAgentColours[agentIndex];
            ctx.globalAlpha = ((agent_y - start_y) / ((start_y + (grid_size * size)) - start_y));
            ctx.fillRect(agent_x, agent_y, size, size);
        }
    }

    if(elapsed_move > moveTime){
        for(agentIndex = 0; agentIndex < currentAgentBoxes.length;agentIndex++){

            if(!boxes[currentAgentBoxes[agentIndex]].bottom){
                currentAgentBoxes[agentIndex] = currentAgentBoxes[agentIndex] + grid_size;
            }
            else{
                if(Math.floor(Math.random() > 0.5)){
                    // left then right
                    if(!boxes[currentAgentBoxes[agentIndex]].left){
                        currentAgentBoxes[agentIndex] = currentAgentBoxes[agentIndex] - 1;
                    }
                    else if(!boxes[currentAgentBoxes[agentIndex]].right){
                        currentAgentBoxes[agentIndex] = currentAgentBoxes[agentIndex] + 1;
                    }
                }
                else{
                    //right then left
                    if(!boxes[currentAgentBoxes[agentIndex]].right){
                        currentAgentBoxes[agentIndex] = currentAgentBoxes[agentIndex] + 1;
                    }
                    else if(!boxes[currentAgentBoxes[agentIndex]].left){
                        currentAgentBoxes[agentIndex] = currentAgentBoxes[agentIndex] - 1;
                    }
                }
            }
        }
    }
};


