const fovAngle = 90
const fov = 1.0 / Math.tan(fovAngle/2)

const window_height = window.innerHeight;
const window_width = window.innerWidth;

const vectRation = window.innerHeight/window.innerWidth;

const nearPlane = 0.1;
const farPlane = 100;

//[x,y,z]
var cameraCor = [0,0,0]
export {};