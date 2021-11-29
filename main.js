import * as THREE from 'three'
import App from './scripts/App'
import buildTree from './scripts/Tree'

let app
let materials = null

const grassTexture = new THREE.TextureLoader().load('img/grass-round.png')

window.onload = init

function init() {
  const c = document.querySelector('canvas')
  app = new App(c, { grid: false, ambient: true, setup })
  initUi()
}

function setup({ scene }) {
  const sun = new THREE.PointLight(0xededed)
  sun.position.set(50, 100, 50)
  scene.add(sun)

  buildTree(scene, 'X[AxBxCx]')

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshBasicMaterial({ map: grassTexture, transparent: true })
  )
  ground.rotateX(-Math.PI / 2)
  scene.add(ground)
}

function newBranch(scene, x = 0, y = 0, z = 0, length = 12, width = 1) {
  const branchModel = new THREE.CylinderGeometry(width, width, length, 100)
  const branch = new THREE.Mesh(branchModel, barkMaterial)
  branch.translateX(x)
  branch.translateY(y + length / 2)
  branch.translateZ(z)
  scene.add(branch)
  return branch
}

// function angle(rad) {
//   return (rad * Math.PI) / 180
// }

function initUi() {
  document.getElementById('btn-options').addEventListener('click', () => {
    document.querySelector('.config').classList.toggle('config-visible')
  })

  document.getElementById('btn-start').addEventListener('click', () => {
    createMaterials()
  })

  document
    .getElementById('btn-add-row')
    .addEventListener('click', () => addCustomNode())
  addCustomNode({ name: 'X', color: '#332211', direction: 30, bend: 0 })
  addCustomNode({ name: 'D', color: '#332211', direction: 70, bend: 30 })
}

function addCustomNode({
  name = 'L',
  color = '#6c6774',
  direction = rand(0, 12) * 30,
  bend = rand(0, 9) * 10
} = {}) {
  const row = document.querySelector('#custom-node-row').content.cloneNode(true)

  row.querySelector('.node-name').value = name
  row.querySelector('.node-color').value = color
  row.querySelector('.node-x').value = bend
  row.querySelector('.node-y').value = direction

  row.querySelector('button').addEventListener('click', ({ target }) => {
    if (target.parentElement.parentElement.children.length < 3) return
    target.parentElement.remove()
  })

  document.querySelector('.config-nodes-custom').appendChild(row)
}

function createMaterials() {
  materials = {}
  document.querySelectorAll('.custom-node').forEach(node => {
    const name = node.querySelector('.node-name').value
    const colorHex = node.querySelector('.node-color').value
    const color = parseInt(colorHex.substring(1), 16)
    materials[name] = new THREE.MeshStandardMaterial({ color })
  })
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
