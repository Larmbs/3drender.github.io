const window_height = window.innerHeight;
const window_width = window.innerWidth;

const fov = 100
const f = 1.0 / Math.tan(fov/2)
const a = window_height/window_width

const nearPlane = 10;
const farPlane = 500;

const q = farPlane/(farPlane-nearPlane)


const projMatrix = [[a*f,0,0,0],[0,f,0,0],[0,0,q,1],[0,0,-nearPlane * q,0]]
const A = Math.PI/6
const rotateMatrixX = [[1,0,0],[0,Math.cos(A),-Math.sin(A)],[0,Math.sin(A),Math.cos(A)]]


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

export function proj(matrix, Angle) {
  let resMatrix = multiply(matrix, [[1,0,0],[0,Math.cos(Angle),-Math.sin(Angle)],[0,Math.sin(Angle),Math.cos(Angle)]])

  resMatrix[0][2] += 800
  let z = resMatrix[0][2]
  resMatrix[0].push(1)
  resMatrix = multiply(resMatrix, projMatrix);
  resMatrix[0][0] /= z;
  resMatrix[0][1] /= z;
  
  return resMatrix
}

export function rotate(matrix) {
  return multiply(matrix, rotateMatrixX)
}