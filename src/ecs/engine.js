export class EntityManager {
    constructor() {
        this.entities = [];
    }

    addStudent(x, y) {
        this.entities.push({
            type: 'student',
            x: x,
            y: y,
            targetX: x,
            targetY: y,
            speed: 0.05
        });
    }

    update() {
        // Simple wandering logic for V1
        this.entities.forEach(entity => {
            if (Math.abs(entity.x - entity.targetX) < 0.1 && Math.abs(entity.y - entity.targetY) < 0.1) {
                // Pick a new random adjacent target (wandering)
                entity.targetX += (Math.floor(Math.random() * 3) - 1);
                entity.targetY += (Math.floor(Math.random() * 3) - 1);
            } else {
                // Move towards target
                entity.x += (entity.targetX > entity.x ? entity.speed : -entity.speed);
                entity.y += (entity.targetY > entity.y ? entity.speed : -entity.speed);
            }
        });
    }
}
