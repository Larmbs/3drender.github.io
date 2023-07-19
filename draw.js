function drawDot(distance,x,y) {
    let size = distance
    ctx.save();

    ctx.translate(window_width / 2, window_height / 2);
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
}


function drawLine(x1,y1,x2,y2,distance) {
    let size = distance

    ctx.save();

    ctx.translate(window_width / 2, window_height / 2);

    ctx.beginPath();
    ctx.moveTo(x1,y1);

    ctx.lineTo(x2,y2);

    ctx.strokeStyle = "black";
    ctx.lineWidth = size;

    ctx.stroke();

    ctx.restore();
};

export {drawDot, drawLine};