import * as THREE from "three";
import App from "./scripts/App";

let app;

const barkMaterial = new THREE.MeshStandardMaterial({ color: 0x332211 });
const grassTexture = new THREE.TextureLoader().load("img/grass-round.png");

window.onload = init;

function init() {
  const c = document.querySelector("canvas");
  app = new App(c, { grid: false, ambient: true, setup });
}

function setup({ scene }) {
  const sun = new THREE.PointLight(0xededed);
  sun.position.set(50, 100, 50);
  scene.add(sun);

  let points = newBranch(scene, { x: 0, y: 0, z: 0 }, 12, 1, 40, 0, 0);
  newBranch(scene, points.ending, 5, 1, 40, 0, 0);
  newBranch(scene, points.ending, 5, 1, 0, 0, 40);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshBasicMaterial({ map: grassTexture, transparent: true })
  );
  ground.rotateX(-Math.PI / 2);
  scene.add(ground);
}

function newBranch(
  scene,
  start = { x: 0, y: 0, z: 0 },
  length = 12,
  width = 1,
  angleX = 0,
  angleY = 0,
  angleZ = 0
) {
  const branchModel = new THREE.CylinderGeometry(width, width, length, 100);
  const branch = new THREE.Mesh(branchModel, barkMaterial);

  branch.translateX(start.x);
  branch.translateY(start.y);
  branch.translateZ(start.z);

  branch.rotateX(radians(angleX));
  branch.rotateY(radians(angleY));
  branch.rotateZ(radians(angleZ));

  translateToAnchor(scene, branch, length);
  const ending = getPointFromElement(branch);
  console.log(ending);

  translateToAnchor(scene, branch, -length / 2);
  const anchor = getPointFromElement(branch);

  return { anchor: anchor, ending: ending };
}

function translateToAnchor(scene, element, length) {
  element.translateY(length);
  scene.add(element);
  scene.updateMatrixWorld(true);
}

function getPointFromElement(element) {
  var end = new THREE.Vector3();
  end.setFromMatrixPosition(element.matrixWorld);
  return end;
}

function radians(degrees) {
  return (degrees * Math.PI) / 180;
}
