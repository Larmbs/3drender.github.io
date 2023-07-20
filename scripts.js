import {drawDot, drawFace, outlineFace, drawId, canvas, ctx} from './draw.js';
import {mapData} from './mapData.js';
import {proj} from './matrix.js';

const window_height = window.innerHeight;
const window_width = window.innerWidth;
const a = window.innerHeight/window.innerWidth;

const cameraAngleX = 45;

//Class objects
class vertRender {
    constructor(x, y, z , id) {
        this.matrix = [[x, y, z + 0, 1]]
        this.id = id;
    }
    
    draw(aX, aY, aZ) {
        let x = proj(this.matrix, aX, aY, aZ)[0][0]
        let y = proj(this.matrix, aX, aY, aZ)[0][1]
        drawDot(5,x* window_width / 2 ,y * window_height / 2)
        drawId(this.id, x* window_width / 2 ,y * window_height / 2)
    }
}

class triRender {
    constructor(vert1, vert2, vert3, color) {
      
        this.vert1 = transformVertex(mapData.file1[0].vert[vert1])
        this.vert2 = transformVertex(mapData.file1[0].vert[vert2])
        this.vert3 = transformVertex(mapData.file1[0].vert[vert3])
        this.vert1[0][2] += 0
        this.vert2[0][2] += 0
        this.vert3[0][2] += 0
        this.color = color
        
    }
    
    draw(outline, shade, aX, aY, aZ) {
        let x1 = proj(this.vert1, aX, aY, aZ)[0][0]
        let y1 = proj(this.vert1, aX, aY, aZ)[0][1]

        let x2 = proj(this.vert2, aX, aY, aZ)[0][0]
        let y2 = proj(this.vert2, aX, aY, aZ)[0][1]

        let x3 = proj(this.vert3, aX, aY, aZ)[0][0]
        let y3 = proj(this.vert3, aX, aY, aZ)[0][1]
        
        let Ax = x2 - x1
        let Ay = y2 - y1
        let Az = this.vert2[0][2] - this.vert1[0][2]

        let Bx =  x3 - x1
        let By = y3 - y1
        let Bz = this.vert3[0][2] - this.vert1[0][2]
    
        let nX = Ay * Bz - Az * By
        let nY = Az * Bx - Ax * Bz
        let nZ = Ax * By - Ay * Bx
        console.log(nZ)

        if (nZ > 0) {
            if (shade) {
                drawFace(
                    x1* window_width / 2 ,y1 * window_height / 2,
                    x2* window_width / 2 ,y2 * window_height / 2,
                    x3* window_width / 2 ,y3 * window_height / 2,
                    this.color
                )
            }

            if (outline) {
                outlineFace(
                    x1* window_width / 2 ,y1 * window_height / 2,
                    x2* window_width / 2 ,y2 * window_height / 2,
                    x3* window_width / 2 ,y3 * window_height / 2
                )
            }
        }
    }
}


class cube {
    constructor(verticies, triangles, outline, vertex, shade, aX, aY, aZ) {
        this.verticies = verticies;
        this.triangles = triangles;
        this.outline = outline;
        this.vertex = vertex;
        this.shade = shade;
        this.aX = aX;
        this.aY = aY;
        this.aZ = aZ;
    }

    draw() {
        Update(this.verticies, this.triangles, this.outline, this.vertex, this.shade, this.aX * (Math.PI/180), this.aY * (Math.PI/180), this.aZ * (Math.PI/180))
    }
}


//Functions
function transformVertex(vertex) {
    return [[vertex.x,vertex.y,vertex.z,1]]
}

function Update(vert, tri, shade, vertex, outline, aX, aY, aZ) {
    if (vertex) {
        for (let i = 0; i < vert.length; i++) {
            vert[i].draw(aX, aY, aZ)
        }
    }   
    for (let i = 0; i < tri.length; i++) {
        tri[i].draw(outline, shade, aX, aY, aZ)
    }
}


//Loading functions
function loadVert() {
    let vertList = []
    for (let i = 0; i < (mapData.file1[0].vert).length; i++) {
        vertList.push(new vertRender(mapData.file1[0].vert[i].x, mapData.file1[0].vert[i].y, mapData.file1[0].vert[i].z, mapData.file1[0].vert[i].id));
    }
    return vertList
}

function loadTri() {
    let triList = []
    for (let i = 0; i < (mapData.file1[1].face).length; i++) {
        let r = Math.floor(Math.random() * 255)
        let g = Math.floor(Math.random() * 255)
        let b = Math.floor(Math.random() * 255)
        triList.push(new triRender(mapData.file1[1].face[i].vert1,mapData.file1[1].face[i].vert2,mapData.file1[1].face[i].vert3, `rgba(${r}, ${g}, ${b}, 0.7)`))
    }
    return triList
}


//Createing objects
var vertList = loadVert()
var triList = loadTri()
const cube1 = new cube(vertList, triList, true, false, true, 0, 0, 0)

//MainLoop
let msPrev = window.performance.now()
const fps = 60
const msPerFrame = 1000 / fps
let frames = 0

let recur = 10000
function mainLoop() {
    ctx.clearRect(0, 0, window_width, window_height);
    
    cube1.aX += 1
    cube1.aY += 1
    cube1.aZ += 1
    
    cube1.draw()

    recur -= 1
    if (recur > 0) {
    requestAnimationFrame(mainLoop)

    const msNow = window.performance.now()
    const msPassed = msNow - msPrev

    if (msPassed < msPerFrame) return

    const excessTime = msPassed % msPerFrame
    msPrev = msNow - excessTime

    frames++

}
}

mainLoop()