import {drawDot, drawLine} from './draw';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;
canvas.style.background = '#aee5e6';

drawLine(1,200,500,700,7)
