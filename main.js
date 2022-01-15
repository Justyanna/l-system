import * as THREE from "three";
import App from "./scripts/App";
import buildTree from "./scripts/Tree";

const global = {
  app: null,
  grammar: null,
  materials: null,
  rules: null,
  scene: null,
  symbols: null,
};

const grassTexture = new THREE.TextureLoader().load("img/grass-round.png");

window.onload = init;

function init() {
  const c = document.querySelector("canvas");
  global.app = new App(c, { grid: false, ambient: true, setup });
  initUi();
}

function setup({ scene }) {
  global.scene = scene;
  clearScene();
}

function initUi() {
  document.getElementById("btn-options").addEventListener("click", () => {
    document.querySelector(".config").classList.toggle("config-visible");
  });

  document.getElementById("btn-start").addEventListener("click", () => {
    global.grammar = document.querySelector(".grammar-input").value;
    createRules();
    createMaterials();
    createSymbols();
    clearScene();
    addTree();
  });

  document.getElementById("btn-step").addEventListener("click", () => {
    updateGrammar();
    clearScene();
    addTree();
  });

  document.getElementById("btn-clear").addEventListener("click", () => {
    clearScene();
  });

  document
    .getElementById("btn-add-row")
    .addEventListener("click", () => addCustomNode());

  addCustomNode({ name: "X", color: "#332211", direction: 30, bend: 0 });
  addCustomNode({ name: "D", color: "#332211", direction: 180, bend: 45 });
  addCustomNode({ name: "O", color: "#2a5c0f", direction: 70, bend: 60 });

  document
    .getElementById("btn-add-rule")
    .addEventListener("click", () => addRule());

  addRule("X", "X[DOXO]");
  addRule("D", "D[X[XO]]");
}

function addCustomNode({
  name = "L",
  color = "#6c6774",
  direction = rand(0, 12) * 30,
  bend = rand(0, 9) * 10,
} = {}) {
  const row = document
    .querySelector("#custom-node-row")
    .content.cloneNode(true);

  row.querySelector(".node-name").value = name;
  row.querySelector(".node-color").value = color;
  row.querySelector(".node-x").value = bend;
  row.querySelector(".node-y").value = direction;

  row.querySelector("button").addEventListener("click", ({ target }) => {
    if (target.parentElement.parentElement.children.length < 3) return;
    target.parentElement.remove();
  });

  document.querySelector(".config-nodes-custom").appendChild(row);
}

function addRule(symbol = "", substitute = "") {
  const rule = document.querySelector("#rule-template").content.cloneNode(true);

  rule.querySelector(".rule-symbol").value = symbol;
  rule.querySelector(".rule-substitute").value = substitute;

  rule.querySelector("button").addEventListener("click", ({ target }) => {
    if (target.parentElement.parentElement.children.length < 2) return;
    target.parentElement.remove();
  });

  document.querySelector(".config-rules").appendChild(rule);
}

function createMaterials() {
  global.materials = {};
  document.querySelectorAll(".custom-node").forEach((node) => {
    const name = node.querySelector(".node-name").value;
    const colorHex = node.querySelector(".node-color").value;
    const color = parseInt(colorHex.substring(1), 16);
    global.materials[name] = new THREE.MeshStandardMaterial({ color });
  });
}

function createSymbols() {
  global.symbols = {};
  document.querySelectorAll(".custom-node").forEach((node) => {
    const name = node.querySelector(".node-name").value;
    const direction = parseInt(node.querySelector(".node-y").value);
    const bend = parseInt(node.querySelector(".node-x").value);
    global.symbols[name] = { direction, bend };
  });
}

function createRules() {
  global.rules = {};
  document.querySelectorAll(".rule").forEach((node) => {
    const rule = node.querySelector(".rule-symbol").value;
    const substitute = node.querySelector(".rule-substitute").value;
    global.rules[rule] = substitute;
  });
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function addTree() {
  buildTree(global.scene, global.grammar, global.symbols, global.materials);
}

function clearScene() {
  global.scene.clear();

  const ambient = new THREE.AmbientLight(0xededed);
  global.scene.add(ambient);

  const sun = new THREE.PointLight(0xededed);
  sun.position.set(50, 100, 50);
  global.scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshBasicMaterial({ map: grassTexture, transparent: true })
  );
  ground.rotateX(-Math.PI / 2);
  global.scene.add(ground);
}

function updateGrammar() {
  global.grammar = global.grammar
    .split("")
    .map((symbol) => (global.rules[symbol] ? global.rules[symbol] : symbol))
    .join("");
}
