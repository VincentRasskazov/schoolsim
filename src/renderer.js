import { CONFIG } from './config.js';

export class Renderer {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
    }

    draw(world, camera, ecs) {
        // 1. Clear background
        this.ctx.fillStyle = CONFIG.COLORS.BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate visible bounds (Culling for infinite scale)
        const startCol = Math.floor(camera.x / CONFIG.TILE_SIZE);
        const endCol = startCol + Math.ceil(this.canvas.width / CONFIG.TILE_SIZE);
        const startRow = Math.floor(camera.y / CONFIG.TILE_SIZE);
        const endRow = startRow + Math.ceil(this.canvas.height / CONFIG.TILE_SIZE);

        // 2. Draw Grid & Tiles
        for (let x = startCol; x <= endCol; x++) {
            for (let y = startRow; y <= endRow; y++) {
                const screenX = Math.floor(x * CONFIG.TILE_SIZE - camera.x);
                const screenY = Math.floor(y * CONFIG.TILE_SIZE - camera.y);

                const tile = world.getTile(x, y);
                
                // Draw tile if exists
                if (tile) {
                    this.ctx.fillStyle = CONFIG.COLORS[tile.toUpperCase()];
                    this.ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                    
                    if (tile === 'desk') {
                         this.ctx.fillStyle = '#6b4423'; // Darker brown for desk detail
                         this.ctx.fillRect(screenX + 8, screenY + 8, 16, 16);
                    }
                }

                // Draw grid lines
                this.ctx.strokeStyle = CONFIG.COLORS.GRID;
                this.ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
            }
        }

        // 3. Draw Entities (Students)
        ecs.entities.forEach(entity => {
            const screenX = entity.x * CONFIG.TILE_SIZE - camera.x + (CONFIG.TILE_SIZE / 2);
            const screenY = entity.y * CONFIG.TILE_SIZE - camera.y + (CONFIG.TILE_SIZE / 2);
            
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = CONFIG.COLORS.STUDENT;
            this.ctx.fill();
            this.ctx.closePath();
        });
    }
}
