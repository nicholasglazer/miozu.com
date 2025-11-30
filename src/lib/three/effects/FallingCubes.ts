/**
 * Falling Cubes Effect - Matrix-style cubes falling in the background
 * Uses instanced rendering for performance
 */

import type * as THREE from 'three';
import type { SceneManager } from '../SceneManager';

interface CubeInstance {
  position: THREE.Vector3;
  velocity: number;
  rotationSpeed: THREE.Vector3;
  scale: number;
}

export class FallingCubesEffect {
  private manager: SceneManager;
  private cubes: CubeInstance[] = [];
  private instancedMesh!: THREE.InstancedMesh;
  private dummy!: THREE.Object3D;
  private time = 0;
  private THREE!: typeof THREE;

  constructor(manager: SceneManager) {
    this.manager = manager;
    this.THREE = manager.getTHREE();
  }

  async init(): Promise<void> {
    const { BoxGeometry, MeshBasicMaterial, InstancedMesh, Object3D, Color, Vector3 } = this.THREE;

    const scene = this.manager.getScene();
    const camera = this.manager.getCamera();

    // Position camera to see the cubes
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    const cubeCount = 150;

    // Simple geometry and bright material
    const geometry = new BoxGeometry(0.3, 0.3, 0.3);
    const material = new MeshBasicMaterial({
      color: new Color(0x4a9eff),
      transparent: true,
      opacity: 0.8
    });

    // Create instanced mesh
    this.instancedMesh = new InstancedMesh(geometry, material, cubeCount);
    this.instancedMesh.instanceMatrix.setUsage(35048); // DynamicDrawUsage
    scene.add(this.instancedMesh);

    // Dummy for matrix calculations
    this.dummy = new Object3D();

    // Initialize cubes spread across the view
    for (let i = 0; i < cubeCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = Math.random() * 20 - 5; // Start spread across screen
      const z = (Math.random() - 0.5) * 10;

      this.cubes.push({
        position: new Vector3(x, y, z),
        velocity: Math.random() * 2 + 0.5,
        rotationSpeed: new Vector3(
          Math.random() * 2,
          Math.random() * 2,
          Math.random() * 2
        ),
        scale: Math.random() * 0.5 + 0.3
      });
    }

    // Transparent background
    scene.background = null;
  }

  update(delta: number): void {
    this.time += delta;

    for (let i = 0; i < this.cubes.length; i++) {
      const cube = this.cubes[i];

      // Move down
      cube.position.y -= cube.velocity * delta;

      // Reset when off screen
      if (cube.position.y < -12) {
        cube.position.y = 12;
        cube.position.x = (Math.random() - 0.5) * 20;
      }

      // Update transform
      this.dummy.position.copy(cube.position);
      this.dummy.rotation.x = this.time * cube.rotationSpeed.x;
      this.dummy.rotation.y = this.time * cube.rotationSpeed.y;
      this.dummy.rotation.z = this.time * cube.rotationSpeed.z;
      this.dummy.scale.setScalar(cube.scale);

      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  destroy(): void {
    // Cleanup handled by SceneManager
  }
}
