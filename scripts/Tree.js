import * as THREE from "three";

const buildTree = (scene, symbols) => {
  let width = 1;
  let length = 10;
  let stack = [];
  let lastBranch;
  stack.push({ position: { x: 0, y: 0, z: 0 }, direction: 0, bend: 0 });

  for (const symbol of Object.keys(symbols)) {
    switch (symbol) {
      case "[":
        stack.push({
          position: lastBranch.endPoint,
          direction: lastBranch.direction,
          bend: lastBranch.bend,
        });
        break;
      case "]":
        stack.pop();
        break;
      default:
        const settings = symbols[symbol];
        if (settings) {
          if (settings.type === "BRANCH") {
            lastBranch = newBranch(
              scene,
              stack[stack.length - 1].position,
              length * (1 / stack.length) ** (1 / 2),
              width * (1 / stack.length) ** (1 / 2),
              settings.material,
              stack[stack.length - 1].direction + settings.direction,
              stack[stack.length - 1].bend + settings.bend
            );
          } else if (settings.type === "LEAVES") {
            scene.add(newSphere(lastBranch.endPoint, settings.material));
          }
        }
        break;
    }
  }
};

const newBranch = (
  scene,
  start = { x: 0, y: 0, z: 0 },
  length = 12,
  width = 1,
  material,
  direction = 0,
  bend = 0
) => {
  const branchModel = new THREE.CylinderGeometry(width, width, length, 100);
  const branch = new THREE.Mesh(branchModel, material);

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

// const newSphere = (origin = { x: 0, y: 0, z: 0 }, material) => {
//   const geometry = new THREE.SphereGeometry(3.5, 32, 16)
//   const sphere = new THREE.Mesh(geometry, material)
//   sphere.translateX(origin.x)
//   sphere.translateY(origin.y)
//   sphere.translateZ(origin.z)
//   return sphere
// }

const newSphere = (origin = { x: 0, y: 0, z: 0 }, material) => {
  const size = 2.5;
  const geometry = new THREE.SphereBufferGeometry(size, 32, 16);

  const vert = geometry.attributes.position;
  const norm = geometry.attributes.normal;
  const uv = geometry.attributes.uv;

  const count = vert.count;
  const vert_clone = JSON.parse(JSON.stringify(vert.array));
  const norm_clone = JSON.parse(JSON.stringify(norm.array));

  const strength = 1.5;
  let tmp = {};

  for (let i = 0; i < count; i++) {
    if (uv.getX(i) === 1) {
      vert.setX(i, tmp.x);
      vert.setY(i, tmp.y);
      vert.setZ(i, tmp.z);
      continue;
    }
    // -- indices
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;

    const newX =
      vert_clone[ix] + norm_clone[ix] * Math.random() * size * strength;
    const newY =
      vert_clone[iy] + norm_clone[iy] * Math.random() * size * strength;
    const newZ =
      vert_clone[iz] + norm_clone[iz] * Math.random() * size * strength;

    vert.setX(i, newX);
    vert.setY(i, newY);
    vert.setZ(i, newZ);

    if (uv.getX(i) === 0) {
      tmp = { x: newX, y: newY, z: newZ };
    }

    geometry.computeVertexNormals();
    vert.needsUpdate = true;
  }

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
