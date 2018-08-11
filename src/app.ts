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

class Game {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.OrthographicCamera;

  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.OrthographicCamera(-1, 1, -1, 1, 0.1, 2000);
  }

  run() {
    document.body.appendChild(this.renderer.domElement);

    this.renderer.setClearColor(new THREE.Color('cornflowerblue'));

    this.camera.position.z = -10;

    this.camera.rotateX(Math.PI);

    const testingCube = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshBasicMaterial({color: new THREE.Color('red')}));

    this.scene.add(testingCube);

    this.onResize();

    window.addEventListener('resize', this.onResize.bind(this));

    setTimeout(() => {
      this.update();
    }, 0);
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
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  game.run();
});