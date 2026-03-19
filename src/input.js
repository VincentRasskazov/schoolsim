import { CONFIG } from './config.js';

export class InputHandler {
    constructor(canvas, camera, world, ecs, state) {
        this.activeTool = 'pan';
        this.isDragging = false;
        this.lastMouse = { x: 0, y: 0 };
        
        // Setup Toolbar listeners
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.activeTool = e.target.dataset.tool;
            });
        });

        // Setup Canvas listeners
        canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouse = { x: e.clientX, y: e.clientY };
            this.handleAction(e.clientX, e.clientY, camera, world, ecs, state);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            if (this.activeTool === 'pan') {
                const dx = e.clientX - this.lastMouse.x;
                const dy = e.clientY - this.lastMouse.y;
                camera.move(dx, dy);
                this.lastMouse = { x: e.clientX, y: e.clientY };
            } else {
                this.handleAction(e.clientX, e.clientY, camera, world, ecs, state);
            }
        });

        window.addEventListener('mouseup', () => this.isDragging = false);
    }

    handleAction(mouseX, mouseY, camera, world, ecs, state) {
        if (this.activeTool === 'pan') return;

        // Convert screen coordinates to world grid coordinates
        const gridX = Math.floor((mouseX + camera.x) / CONFIG.TILE_SIZE);
        const gridY = Math.floor((mouseY + camera.y) / CONFIG.TILE_SIZE);

        const cost = CONFIG.COSTS[this.activeTool];

        if (this.activeTool === 'student') {
            if (state.budget >= cost && world.getTile(gridX, gridY) === 'floor') {
                ecs.addStudent(gridX, gridY);
                state.budget -= cost;
                // Add a small delay so we don't spawn 60 students a second while dragging
                this.isDragging = false; 
            }
        } else {
            // Building tiles
            if (state.budget >= cost && world.getTile(gridX, gridY) !== this.activeTool) {
                world.setTile(gridX, gridY, this.activeTool);
                state.budget -= cost;
            }
        }
        
        document.getElementById('budget-display').innerText = `$${state.budget.toLocaleString()}`;
    }
}
