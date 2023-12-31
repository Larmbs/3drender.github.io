const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = 'black';

function drawDot(distance,x,y) {
    let size = distance
    ctx.save();
    ctx.translate(window_width / 2, window_height / 2);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
}


function drawLine(x1,y1,x2,y2,distance) {
    let size = 1
    ctx.save();
    ctx.translate(window_width / 2, window_height / 2);
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = size;
    ctx.stroke();
    ctx.restore();
};


function drawFace(x1,y1,x2,y2,x3,y3,color) {
    ctx.save();
    ctx.translate(window_width / 2, window_height / 2);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}


function outlineFace(x1,y1,x2,y2,x3,y3) {
    ctx.save();
    ctx.translate(window_width / 2, window_height / 2);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}


function drawId(id, x, y){
    ctx.save();
    ctx.translate(window_width / 2, window_height / 2);
    ctx.font = '200px'
    ctx.fillStyle = 'white'
    ctx.fillText(`${id}`,x + 20,y)
    ctx.restore()
}

export {drawDot, drawLine, drawFace, outlineFace, drawId, canvas, ctx};