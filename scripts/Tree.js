import * as THREE from "three";

const buildTree = (scene, grammar, symbols, func) => {
  let width = 3;
  let length = 12;
  let stack = [];
  let lastBranch;
  let n = 1;
  const origin = {
    position: { x: 0, y: 0, z: 0 },
    direction: 0,
    bend: 0,
    n: n,
  };
  let current = origin;

  for (const symbol of grammar) {
    switch (symbol) {
      case "[":
        stack.push({
          position: current.position,
          direction: current.direction,
          bend: current.bend,
          n: n,
        });
        break;
      case "]":
        current = stack.pop();
        n = current.n;
        break;
      default:
        const settings = symbols[symbol];
        if (settings) {
          if (settings.type === "BRANCH") {
            n++;
            lastBranch = newBranch(
              scene,
              current.position,
              getSize(length, current.n, func),
              getSize(width, current.n, func),
              settings.material,
              current.direction + settings.direction,
              current.bend + settings.bend
            );
            current = {
              position: lastBranch.endPoint,
              direction: lastBranch.direction,
              bend: lastBranch.bend,
              n: n,
            };
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
  // const axishelper = new THREE.AxesHelper(20);
  // branch.add(axishelper);

  branch.translateX(start.x);
  branch.translateY(start.y);
  branch.translateZ(start.z);

  branch.rotation.order = "YXZ";

  branch.rotation.y += THREE.Math.degToRad(direction);
  branch.rotation.x += THREE.Math.degToRad(bend);

  // branch.rotateY(THREE.Math.degToRad(direction));
  // // branch.rotateX(THREE.Math.degToRad(bend));
  // branch.rotateOnAxis(
  //   new THREE.Vector3(1, 0, 0).cross(branch.rotation).normalize(),
  //   THREE.Math.degToRad(bend)
  // );

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

const getSize = (value, n, type) => {
  switch (type) {
    case "none":
      return value;
    case "linear":
      return (1 / n) * value;
    case "log":
      return value * (1 / n) ** (1 / 2);
  }
};
export default buildTree;
