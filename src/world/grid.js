export class WorldGrid {
    constructor() {
        this.tiles = new Map(); // Key: "x,y", Value: tileType
    }

    setTile(x, y, type) {
        this.tiles.set(`${x},${y}`, type);
    }

    getTile(x, y) {
        return this.tiles.get(`${x},${y}`) || null;
    }
}
