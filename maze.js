class Box {
    constructor(boxNumber) {
        this.number = boxNumber;
        this.left = false;
        this.right = false;
        this.top = false;
        this.bottom = false;
    }

    set leftBlocked(leftBlockedValue)
    {
        this.left = leftBlockedValue;
    }
    set rightBlocked(rightBlockedValue)
    {
        this.right = rightBlockedValue;
    }
    set topBlocked(topBlockedValue)
    {
        this.top = topBlockedValue;
    }
    set bottomBlocked(bottomBlockedValue)
    {
        this.bottom = bottomBlockedValue;
    }

    get isFullyBlocked(){
        return this.left && this.right && this.top && this.bottom
    }
};
function draw_line(startx, starty, endx, endy) {
    // Staring point (10,45)
    ctx.moveTo(startx, starty);
    // End point (180,47)
    ctx.lineTo(endx, endy);
    // Make the line visible
    ctx.stroke();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var canvas = document.getElementById('DemoCanvas');
//Always check for properties and methods, to make sure your code doesn't break in other browsers.
if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    // Reset the current path
    ctx.beginPath();
    grid_size = 50;
    var size = 10;
    start_x = 10;
    start_y = 45;
    density = 0.4;
    density_in_use = 1.0 - density;
    boxes = [];
    var x;
    current_x = start_x;
    current_y = start_y;
    for (y = 0; y < grid_size; y++) {
        for (x = 0; x < grid_size; x++) {
            current_box = (x + (grid_size * y))
            boxes.push(new Box(current_box))

            console.log('Assessing box ' + current_box)
            if (Math.random() > density_in_use) {
                top_box =  current_box;
                bottom_box =  (x + (grid_size * (y-1)));
                console.log('Blocking top box:' + top_box);
                if(bottom_box > -1)
                {
                    console.log('Blocking bottom box:' + bottom_box);
                    boxes[bottom_box].bottomBlocked = true;
                }
                boxes[top_box].topBlocked = true;                     
                draw_line(current_x, current_y, current_x + size, current_y);
            }

            if (Math.random() > density_in_use) {
                left_box = current_box;
                
                console.log('Blocking left box ' + left_box);
                draw_line(current_x, current_y, current_x, current_y + size);
                boxes[left_box].leftBlocked = true;
                
                if(x > 0){
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
}
ctx.closePath();
current_x = start_x;
current_y = start_y;

for (y = 0; y < grid_size; y++) {
    for (x = 0; x < grid_size; x++) {
        current_box = x + ( y * grid_size);
        if(boxes[current_box].isFullyBlocked){
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = '#000000'
            console.log('Box is filled ' + current_box)
        }
        else{
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = getRandomColor();
        }
        
        ctx.fillRect(current_x, current_y, size, size);
        current_x = current_x + size;
    }
    current_x = start_x;
    current_y = current_y + size;
}
ctx.globalAlpha = 1.0;