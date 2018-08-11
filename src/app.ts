/**
 * Ludum Dare 42 Game - Game Title Pending
 *
 * Ideas: (Copied from sketches in OneNote)
 * - Closing Circle
 * - RPG Inventory Management
 *   - Use BSP to create a random level then insert the items from the level in
 * random positions.
 *   - Give a preview of the next 2 blocks added
 */

import * as THREE from 'three';

abstract class GameObject extends THREE.Object3D {
  abstract tick(): void;
}

enum TileSize {
  OneByOne,
  TwoByTwo,
  OneByTwo,
  TwoByOne
}

enum TileColor {
  White = 'white',
  Green = 'green',
  Blue = 'blue',
  Purple = 'purple',
  Orange = 'orange'
}

function now(): number {
  return window.performance.now();
}

class GameTile extends THREE.Mesh {
  constructor(
      private owner: GameCanvas, readonly size: TileSize,
      readonly color: TileColor, private solid: boolean) {
    super();

    // TODO(vbitz): Implement tile sizes.
    this.geometry = new THREE.CubeGeometry(
        this.owner.tileSize * 0.8, this.owner.tileSize * 0.8,
        this.owner.tileSize * 0.8);

    this.material = new THREE.MeshBasicMaterial({color: this.color});
  }
}

interface TilePosition {
  x: number;
  y: number;
}

class GameCanvas extends GameObject {
  private field: Array<Array<GameTile|null>>;

  private nextSpawnTime = 0;

  constructor(
      readonly fieldWidth: number, readonly fieldHeight: number,
      readonly tileSize: number) {
    super();

    // Play field
    const playField = new THREE.Mesh(
        new THREE.PlaneGeometry(
            this.fieldWidth * this.tileSize, this.fieldHeight * this.tileSize),
        new THREE.MeshBasicMaterial({color: new THREE.Color(0.1, 0.1, 0.1)}));

    playField.position.z = (tileSize / 2);

    this.add(playField);

    this.field = [];
    for (let x = 0; x < fieldWidth; x++) {
      this.field.push([]);
      for (let y = 0; y < fieldHeight; y++) {
        this.field[x].push(null);
      }
    }
  }

  tick() {
    if (now() > this.nextSpawnTime) {
      const freePos = this.getFreePosition(TileSize.OneByOne);

      if (freePos !== null) {
        const newTile =
            new GameTile(this, TileSize.OneByOne, TileColor.White, true);

        this.setTile(freePos, newTile);
      }

      this.nextSpawnTime = now() + 2500;
    }
  }

  private getTilePosition(pos: TilePosition): THREE.Vector3 {
    return new THREE.Vector3(
        (pos.x * this.tileSize + (this.tileSize / 2)) -
            (this.fieldWidth * this.tileSize) / 2,
        (pos.y * this.tileSize + (this.tileSize / 2)) -
            (this.fieldHeight * this.tileSize) / 2,
        0);
  }

  private getTile(pos: TilePosition): GameTile|null {
    return this.field[pos.x][pos.y];
  }

  private setTile(pos: TilePosition, tile: GameTile) {
    if (tile.size !== TileSize.OneByOne) {
      throw new Error('Not Implemented');
    }

    this.field[pos.x][pos.y] = tile;

    tile.position.set(0, 0, 0).add(this.getTilePosition(pos));

    this.add(tile);
  }

  private getFreePosition(size: TileSize): TilePosition|null {
    if (size !== TileSize.OneByOne) {
      throw new Error('Not Implemented');
    }

    for (let x = 0; x < this.fieldWidth; x++) {
      for (let y = 0; y < this.fieldHeight; y++) {
        if (this.getTile({x, y}) === null) {
          return {x, y};
        }
      }
    }

    return null;
  }
}

class Game {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.OrthographicCamera;

  private gameCanvas = new GameCanvas(8, 8, 64);

  private tickTimer = 0;

  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.OrthographicCamera(-1, 1, -1, 1, 0.1, 2000);
  }

  run() {
    document.body.appendChild(this.renderer.domElement);

    this.renderer.setClearColor(new THREE.Color(0.95, 0.95, 0.95));

    this.camera.position.z = -10;

    this.camera.rotateX(Math.PI);

    this.scene.add(this.gameCanvas);

    this.onResize();

    window.addEventListener('resize', this.onResize.bind(this));

    setTimeout(() => {
      this.update();
    }, 0);

    this.tickTimer = setInterval(this.tick.bind(this), 1000 / 60);
  }

  private onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);

    this.camera.left = width / -2;
    this.camera.right = width / 2;
    this.camera.top = height / -2;
    this.camera.bottom = height / 2;

    this.camera.updateProjectionMatrix();
  }

  private update() {
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.update.bind(this));
  }

  private tick() {
    for (const child of this.scene.children) {
      if (child instanceof GameObject) {
        child.tick();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  game.run();
});