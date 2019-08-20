import times from 'lodash/times'
import Vec2 from 'classes/Vec2.js'
import * as THREE from 'three'
import fragmentShader from 'glsl/background.glsl'

const { PI: pi, random } = Math

const STAR_COUNT = 500
const LAYERS = 3
const ROTATION_RATE = 10000 // milliseconds

const starLocations = times(STAR_COUNT, () => new Vec2({
    x: random(),
    y: random(),
}).scale(500))

const starVelocities = times(STAR_COUNT, () => {
    const direction = 2 * pi * random()
    const speed = random()

    return Vec2.fromArgumentAndMagnitude({
        argument: direction,
        magnitude: speed,
    }).scale(3)
})

/* eslint-disable indent */
const uniforms = {
              time: { value: 0 },
        resolution: { value: new THREE.Vector3(500, 500) },
          DOT_SIZE: { value: 4 },
    //   LAYER_COUNTS: { value: [350, 100, 50] },
     DOT_LOCATIONS: { value: starLocations.map(vector => new THREE.Vector2(vector.x, vector.y)) },
    DOT_VELOCITIES: { value: starVelocities.map(vector => new THREE.Vector2(vector.x, vector.y)) },
}
/* eslint-enable indent */

export default class Background {
    constructor () {
        const canvas = this.canvas = document.querySelector('#canvas-background')
        this.renderer = new THREE.WebGLRenderer({ canvas })
        this.renderer.autoClearColor = false

        /* eslint-disable indent */
        this.camera = new THREE.OrthographicCamera(
            -1, // left
             1, // right
             1, // top
            -1, // bottom
            -1, // near,
             1, // far
        )
        /* eslint-enable indent */

        const plane = new THREE.PlaneBufferGeometry(2, 2)
        const material = new THREE.ShaderMaterial({ fragmentShader, uniforms })
        this.scene = new THREE.Scene()
        this.scene.add(new THREE.Mesh(plane, material))
    }

    draw (time) {
        const { camera, renderer, scene } = this

        time *= 0.001 // seconds

        uniforms.time.value = time

        renderer.render(scene, camera)
    }
}
