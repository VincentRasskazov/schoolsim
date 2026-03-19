import { CONFIG } from './config.js';

export class Renderer {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
    }

    draw(world, camera, ecs) {
        // 1. Clear Screen
        this.ctx.fillStyle = CONFIG.COLORS.BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. High-Performance Grid Rendering
        const offsetX = -(camera.x % CONFIG.TILE_SIZE);
        const offsetY = -(camera.y % CONFIG.TILE_SIZE);
        
        this.ctx.beginPath();
        for (let x = offsetX; x < this.canvas.width; x += CONFIG.TILE_SIZE) {
            this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height);
        }
        for (let y = offsetY; y < this.canvas.height; y += CONFIG.TILE_SIZE) {
            this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.strokeStyle = CONFIG.COLORS.GRID;
        this.ctx.lineWidth = 1;
        this.ctx.stroke(); // ONE draw call for the entire grid!

        // 3. Draw Placed Tiles (Culling applied)
        const startX = Math.floor(camera.x / CONFIG.TILE_SIZE);
        const startY = Math.floor(camera.y / CONFIG.TILE_SIZE);
        const endX = startX + Math.ceil(this.canvas.width / CONFIG.TILE_SIZE);
        const endY = startY + Math.ceil(this.canvas.height / CONFIG.TILE_SIZE);

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const tile = world.getTile(x, y);
                if (!tile) continue;

                const screenX = x * CONFIG.TILE_SIZE - camera.x;
                const screenY = y * CONFIG.TILE_SIZE - camera.y;

                this.ctx.fillStyle = CONFIG.COLORS[tile.toUpperCase()];
                
                if (tile === 'wall') {
                    // Give walls a slight 3D shadow effect
                    this.ctx.fillRect(screenX, screenY - 8, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE + 8);
                    this.ctx.fillStyle = 'rgba(255,255,255,0.1)'; // Top highlight
                    this.ctx.fillRect(screenX, screenY - 8, CONFIG.TILE_SIZE, 4);
                } else if (tile === 'desk') {
                    this.ctx.fillRect(screenX + 8, screenY + 8, CONFIG.TILE_SIZE - 16, CONFIG.TILE_SIZE - 16);
                } else {
                    this.ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
                }
            }
        }

        // 4. Draw Students with smooth shadows
        ecs.entities.forEach(entity => {
            const screenX = entity.x * CONFIG.TILE_SIZE - camera.x + (CONFIG.TILE_SIZE / 2);
            const screenY = entity.y * CONFIG.TILE_SIZE - camera.y + (CONFIG.TILE_SIZE / 2);
            
            // Shadow
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY + 4, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
            this.ctx.fill();

            // Body
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = CONFIG.COLORS.STUDENT;
            this.ctx.fill();
            this.ctx.strokeStyle = '#2563eb';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
}
