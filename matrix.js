const window_height = window.innerHeight;
const window_width = window.innerWidth;

const fov = 100
const f = 1.0 / Math.tan(fov/2)
const a = window_height/window_width

const nearPlane = 10;
const farPlane = 500;

const q = farPlane/(farPlane-nearPlane)

const cameraAngleX = 45;

const projMatrix = [[a*f,0,0,0],[0,f,0,0],[0,0,q,1],[0,0,-nearPlane * q,0]]
const A = Math.PI/6
const rotateMatrixX = [[1,0,0],[0,Math.cos(A),-Math.sin(A)],[0,Math.sin(A),Math.cos(A)]]
const roatateMatrixY = [[Math.cos(A), 0, Math.sin(A)],[0,1,0],[-Math.sin(A), 0, Math.cos(A)]]
const roatateMatrixZ = [[Math.cos(A), -Math.sin(A), 0],[Math.sin(A),Math.cos(A),0],[0, 0, 1]]

function multiply(matrix1, matrix2) {
    if (matrix1[0].length !== matrix2.length) {
      throw new Error('Matrix dimensions are not compatible for multiplication.');
    }
  
    const result = new Array(matrix1.length);
    for (let i = 0; i < matrix1.length; i++) {
      result[i] = new Array(matrix2[0].length).fill(0);
    }
  
    for (let i = 0; i < matrix1.length; i++) {
      for (let j = 0; j < matrix2[0].length; j++) {
        for (let k = 0; k < matrix1[0].length; k++) {
          result[i][j] += matrix1[i][k] * matrix2[k][j];
        }
      }
    }
  return result;
}

function rotateX(matrix, rotX) {
  let res = multiply([matrix[0].slice(0,-1)], [[1,0,0],[0,Math.cos(rotX),-Math.sin(rotX)],[0,Math.sin(rotX),Math.cos(rotX)]])
  res[0].push(1)
  return res
}

function rotateY(matrix, rotY) {
  let res = multiply([matrix[0].slice(0,-1)], [[Math.cos(rotY), 0, Math.sin(rotY)],[0,1,0],[-Math.sin(rotY), 0, Math.cos(rotY)]])
  res[0].push(1)
  return res
}

function rotateZ(matrix, rotZ) {
  let res = multiply([matrix[0].slice(0,-1)], [[Math.cos(rotZ), -Math.sin(rotZ), 0],[Math.sin(rotZ),Math.cos(rotZ),0],[0, 0, 1]])
  res[0].push(1)
  return res
}


export function proj(matrix, rotX, rotY, rotZ) {
  matrix = rotateX(matrix, rotX)
  matrix = rotateY(matrix, rotY)
  matrix = rotateZ(matrix, rotZ)

  matrix[0][2] += 900
  let z = matrix[0][2]
  matrix = multiply(matrix, projMatrix);
  matrix[0][0] /= z;
  matrix[0][1] /= z;
  
  return matrix
}



export function rotate(matrix) {
  return multiply(matrix, rotateMatrixX)
}