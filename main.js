import * as THREE from 'three'
import App from './scripts/App'

let app

const barkMaterial = new THREE.MeshStandardMaterial({ color: 0x332211 })
const grassTexture = new THREE.TextureLoader().load('img/grass-round.png')

window.onload = init

function init() {
  const c = document.querySelector('canvas')
  app = new App(c, { grid: false, ambient: true, setup })
}

function setup({ scene }) {
  const sun = new THREE.PointLight(0xededed)
  sun.position.set(50, 100, 50)
  scene.add(sun)

  let tree = newBranch(scene)

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
