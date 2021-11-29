import * as THREE from "three";

const buildTree = (scene, grammar) => {
  let width = 1;
  let length = 10;
  let x1 = 20;
  let y1 = 80;
  let x2 = 80;
  let y2 = 20;

  let stack = [];
  let lastBranch;
  stack.push({ position: { x: 0, y: 0, z: 0 }, direction: 180, bend: 45 });

  for (const symbol of grammar) {
    console.log(stack[stack.length - 1]);
    switch (symbol) {
      case "X":
        lastBranch = newBranch(
          scene,
          stack[stack.length - 1].position,
          length,
          width,
          stack[stack.length - 1].direction + 0,
          stack[stack.length - 1].bend + 0
        );
        break;
      case "A":
        lastBranch = newBranch(
          scene,
          stack[stack.length - 1].position,
          length,
          width,
          stack[stack.length - 1].direction + y1,
          stack[stack.length - 1].bend + x1
        );
        break;
      case "B":
        lastBranch = newBranch(
          scene,
          stack[stack.length - 1].position,
          length,
          width,
          stack[stack.length - 1].direction + y2,
          stack[stack.length - 1].bend + x2
        );
        break;
      case "x":
        scene.add(newSphere(lastBranch.endPoint));
        break;
      case "[":
        stack.push({
          position: lastBranch.endPoint,
          direction: lastBranch.direction,
          bend: lastBranch.bend,
        });
        break;
      case "]":
        stack.pop();
    }
  }
};

const newBranch = (
  scene,
  start = { x: 0, y: 0, z: 0 },
  length = 12,
  width = 1,
  direction = 0,
  bend = 0
) => {
  const barkMaterial = new THREE.MeshStandardMaterial({ color: 0x332211 });
  const branchModel = new THREE.CylinderGeometry(width, width, length, 100);
  const branch = new THREE.Mesh(branchModel, barkMaterial);

  branch.translateX(start.x);
  branch.translateY(start.y);
  branch.translateZ(start.z);

  branch.rotateY(radians(direction));
  branch.rotateX(radians(bend));

  translateToAnchor(scene, branch, length);
  const ending = getPointFromElement(branch);
  translateToAnchor(scene, branch, -length / 2);
  const anchor = getPointFromElement(branch);

  return {
    anchor: anchor,
    endPoint: ending,
    direction: direction,
    bend: bend,
  };
};

const newSphere = (origin = { x: 0, y: 0, z: 0 }) => {
  const geometry = new THREE.SphereGeometry(2.0, 32, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0x224d10 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.translateX(origin.x);
  sphere.translateY(origin.y);
  sphere.translateZ(origin.z);
  return sphere;
};

const translateToAnchor = (scene, element, length) => {
  element.translateY(length);
  scene.add(element);
  scene.updateMatrixWorld(true);
};

const getPointFromElement = (element) => {
  var end = new THREE.Vector3();
  end.setFromMatrixPosition(element.matrixWorld);
  return end;
};

const radians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

export default buildTree;
