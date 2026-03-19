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


// ... imports stay the same ...

function updateUI() {
    // Format to look like real currency
    document.getElementById('budget-display').innerText = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(gameState.budget);
    
    document.getElementById('population-display').innerText = ecs.entities.length;
}

// Inside your input.js handler, call updateUI() after spending money.
// ... rest of main loop stays the same ...
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
