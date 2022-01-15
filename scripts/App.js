import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Initial settings for the app
 * @typedef {Object} AppSettings
 * @property {boolean|number} [ambient]
 * @property {boolean} [grid]
 * @property {(app: App) => void} [setup]
 * @property {(app: App) => void} [update]
 */

class App {
  /**
   * Aspect ratio of the screen
   * @type {number}
   * @public
   */
  ascpectRatio
  /**
   * Main camera being projected to the canvas
   * @type {THREE.PerspectiveCamera}
   * @public
   */
  camera
  /**
   * Canvas element used for rendering the app
   * @type {HTMLCanvasElement}
   * @public
   */
  canvas
  /**
   * Mouse controls
   * @type {OrbitControls}
   * @private
   */
  #controls
  /**
   * Height of the screen
   * @type {number}
   * @public
   */
  height
  /**
   * Renderer used for the screen
   * @type {THREE.WebGLRenderer}
   * @public
   */
  renderer
  /**
   * Main scene holding contents of the screen
   * @type {THREE.Scene}
   * @public
   */
  scene
  /**
   * Function called before starting rendering
   * @type {(app: App) => void}
   * @public
   */
  #update
  /**
   * Width of the screen
   * @type {number}
   */
  width

  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {AppSettings} [settings]
   */
  constructor(canvas, settings) {
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.#setUpScreen()
    this.#setUpRenderer()
    this.#setUpBase(settings)
    settings.setup?.(this)
    this.#animate()
  }

  #setUpScreen() {
    const parent = this.canvas.parentElement
    this.height = parent.offsetHeight
    this.width = parent.offsetWidth
    this.canvas.style.height = `${this.height}px`
    this.canvas.style.width = `${this.width}px`
    this.ascpectRatio = this.width / this.height
    this.camera = new THREE.PerspectiveCamera(75, this.ascpectRatio, 0.1, 1000)
    this.camera.position.setZ(30)
    this.camera.position.setY(10)
    this.#controls = new OrbitControls(this.camera, this.canvas)
    this.#controls.minDistance = 30
    this.#controls.maxDistance = 200
    this.#controls.maxPolarAngle = Math.PI / 2.5
  }

  #setUpRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xededed, 1)
  }

  /**
   *
   * @param {AppSettings} settings
   */
  #setUpBase(settings) {
    if (settings?.grid) {
      const gridHelper = new THREE.GridHelper(200, 50)
      this.scene.add(gridHelper)
    }

    switch (typeof settings.ambient) {
      case 'boolean':
        if (settings.ambient) {
          const ambientLight = new THREE.AmbientLight(0xededed)
          this.scene.add(ambientLight)
        }
        break
      case 'number':
        const ambientLight = new THREE.AmbientLight(settings.ambient)
        this.scene.add(ambientLight)
        break
      default:
        break
    }

    this.#update = settings.update
  }

  #animate() {
    requestAnimationFrame(() => this.#animate())
    this.#update?.()
    this.renderer.render(this.scene, this.camera)
  }
}

export default App
