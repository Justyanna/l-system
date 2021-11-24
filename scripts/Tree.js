import * as THREE from "three";

class Tree {
  /**
   * @param {THREE.Scene} scene
   * @param {number} levels
   * @param {number} angle
   *
   */
  constructor(scene, levels, angle) {
    this.scene = scene;
    this.levels = levels;
    this.angle = angle;
  }

  generateTree() {
    //TODO add recursive tree generation
  }

  #newBranch(
    start = { x: 0, y: 0, z: 0 },
    length = 12,
    width = 1,
    angleX = 0,
    angleY = 0,
    angleZ = 0
  ) {
    const barkMaterial = new THREE.MeshStandardMaterial({ color: 0x332211 });
    const branchModel = new THREE.CylinderGeometry(width, width, length, 100);
    const branch = new THREE.Mesh(branchModel, barkMaterial);

    branch.translateX(start.x);
    branch.translateY(start.y);
    branch.translateZ(start.z);

    branch.rotateX(this.#radians(angleX));
    branch.rotateY(this.#radians(angleY));
    branch.rotateZ(this.#radians(angleZ));

    this.#translateToAnchor(branch, length);
    const ending = this.#getPointFromElement(branch);
    this.#translateToAnchor(branch, -length / 2);
    const anchor = this.#getPointFromElement(branch);

    return {
      anchor: anchor,
      ending: ending,
      angle: { ax: angleX, ay: angleY, az: angleZ },
    };
  }

  #translateToAnchor(element, length) {
    element.translateY(length);
    this.scene.add(element);
    this.scene.updateMatrixWorld(true);
  }

  #getPointFromElement(element) {
    var end = new THREE.Vector3();
    end.setFromMatrixPosition(element.matrixWorld);
    return end;
  }

  #radians(degrees) {
    return (degrees * Math.PI) / 180;
  }
}

export default Tree;
