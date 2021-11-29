import * as THREE from "three";
import App from "./scripts/App";
import buildTree from "./scripts/Tree";

let app;

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

  buildTree(scene, "X[AxBxCx]");

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshBasicMaterial({ map: grassTexture, transparent: true })
  );
  ground.rotateX(-Math.PI / 2);
  scene.add(ground);
}
