import {drawDot, drawLine, drawFace, outlineFace, drawId, canvas, ctx} from './draw.js';
import {mapData} from './mapData.js';
import {} from './camera.js';
import {proj} from './matrix.js';

const window_height = window.innerHeight;
const window_width = window.innerWidth;
const a = window.innerHeight/window.innerWidth;

const FPS = 60;
var Angle = 0

//Main render loop
class vertRender {
    constructor(x, y, z , id) {
        this.matrix = [[x, y, z]]
        this.id = id;
    }
    
    draw() {
        let x = proj(this.matrix, Angle)[0][0]
        let y = proj(this.matrix, Angle)[0][1]
        drawDot(5,x* window_width / 2 ,y * window_height / 2)
        drawId(this.id, x* window_width / 2 ,y * window_height / 2)
    }
}

class triRender {
    constructor(vert1, vert2, vert3) {
        this.vert1 = transformVertex(mapData.file1[0].vert[vert1])
        this.vert2 = transformVertex(mapData.file1[0].vert[vert2])
        this.vert3 = transformVertex(mapData.file1[0].vert[vert3])
        
    }
    
    draw() {
        let x1 = proj(this.vert1, Angle)[0][0]
        let y1 = proj(this.vert1, Angle)[0][1]

        let x2 = proj(this.vert2, Angle)[0][0]
        let y2 = proj(this.vert2, Angle)[0][1]

        let x3 = proj(this.vert3, Angle)[0][0]
        let y3 = proj(this.vert3, Angle)[0][1]
        drawFace(
            x1* window_width / 2 ,y1 * window_height / 2,
            x2* window_width / 2 ,y2 * window_height / 2,
            x3* window_width / 2 ,y3 * window_height / 2
        )
        outlineFace(
            x1* window_width / 2 ,y1 * window_height / 2,
            x2* window_width / 2 ,y2 * window_height / 2,
            x3* window_width / 2 ,y3 * window_height / 2
        )
    }
}

function transformVertex(vertex) {
    return [[vertex.x,vertex.y,vertex.z]]
}

function loadVert() {
    let vertList = []
    for (let i = 0; i < (mapData.file1[0].vert).length; i++) {
        vertList.push(new vertRender(mapData.file1[0].vert[i].x, mapData.file1[0].vert[i].y, mapData.file1[0].vert[i].z, mapData.file1[0].vert[i].id))
    }
    return vertList
}

function loadTri() {
    let triList = []
    for (let i = 0; i < (mapData.file1[1].face).length; i++) {
        triList.push(new triRender(mapData.file1[1].face[i].vert1,mapData.file1[1].face[i].vert2,mapData.file1[1].face[i].vert3))
    }
    return triList
}

var vertList = loadVert()
var triList = loadTri()

function Update() {
    for (let i = 0; i < vertList.length; i++) {
        vertList[i].draw()
    }
    for (let i = 0; i < triList.length; i++) {
        triList[i].draw()
    }
}

/*
class loadMap {
    constructor(type, directory, file) {
        this.type = type;
        this.length = directory.length;
        this.file = directory;
        this.in = file
    
    }

    vert() {
        for (let i = 0; i < this.length; i++) {
            drawDot(0.5,this.file[i].x,this.file[i].y)
        }
    }

    face() {
        for (let i = 0; i < this.length; i++) {
            drawFace(
                transformVertex(this.in.file1[0].vert[this.file[i].vert1]),
                transformVertex(this.in.file1[0].vert[this.file[i].vert2]),
                transformVertex(this.in.file1[0].vert[this.file[i].vert3])
                )
              
        }
    }

    outlineFace() {
        for (let i = 0; i < this.length; i++) {
            outlineFace(
                this.in.file1[0].vert[this.file[i].vert1].x,this.in.file1[0].vert[this.file[i].vert1].y,
                this.in.file1[0].vert[this.file[i].vert2].x,this.in.file1[0].vert[this.file[i].vert2].y,
                this.in.file1[0].vert[this.file[i].vert3].x,this.in.file1[0].vert[this.file[i].vert3].y
                )
        }
    }


    load(outline) {
        if (this.type === "vert") {
            this.vert();
        } else 

        if (this.type === "face") {
            this.face();
            if (outline) {
                this.outlineFace();
            }
        };
    }
}

function transformVertex(vertex) {
    return proj([[vertex.x,vertex.y,vertex.z,1]])
}*/


var recur = 120
function mainLoop(recur) {
    ctx.clearRect(0, 0, window_width, window_height);
    canvas.style.background = 'white';
    Update()
    /*const faces = new loadMap("face", mapData.file1[1].face, mapData)
    faces.load(true)

    const verticies = new loadMap("vert", mapData.file1[0].vert, mapData)
    faces.load(false)*/
    Angle += Math.PI/ 180
    if (recur > 0) {
    requestAnimationFrame(mainLoop)

}
}

mainLoop(recur)