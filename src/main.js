import { WorldGrid } from './world/grid.js';
import { Camera } from './camera.js';
import { EntityManager } from './ecs/engine.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false optimizes rendering

// Game State
const gameState = {
    budget: 10000000
};

// Initialize Engine Systems
const world = new WorldGrid();
const camera = new Camera();
const ecs = new EntityManager();
const renderer = new Renderer(canvas, ctx);

// Handle Resizing
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Initialize Input
const input = new InputHandler(canvas, camera, world, ecs, gameState);

// Main Game Loop
function gameLoop() {
    ecs.update();
    renderer.draw(world, camera, ecs);
    requestAnimationFrame(gameLoop);
}

// Boot
console.log("SchoolSim V1 Engine Started.");
requestAnimationFrame(gameLoop);
