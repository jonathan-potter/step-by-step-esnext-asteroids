import times from 'lodash/times'
import Vec2 from 'classes/Vec2.js'
import * as THREE from 'three'
import MovingDots from 'glsl/MovingDots.glsl'
import Grid from 'glsl/Grid.glsl'

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
    }).scale(50)
})

/* eslint-disable indent */
const uniforms = {
                time: { value: 0 },
          resolution: { value: new THREE.Vector3(500, 500) },
            DOT_SIZE: { value: 4 },
    //   LAYER_COUNTS: { value: [350, 100, 50] },
       DOT_LOCATIONS: { value: starLocations.map(vector => new THREE.Vector2(vector.x, vector.y)) },
      DOT_VELOCITIES: { value: starVelocities.map(vector => new THREE.Vector2(vector.x, vector.y)) },
        BULLET_COUNT: { value: 0 },
    BULLET_LOCATIONS: { value: starLocations.map(vector => new THREE.Vector2(vector.x, vector.y)) },
       SHIP_LOCATION: { value: new THREE.Vector2(250, 250) },
}
/* eslint-enable indent */

export default class Background {
    constructor (game) {
        this.game = game

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
        const material = new THREE.ShaderMaterial({
            fragmentShader: MovingDots,
            uniforms,
            transparent: true,
        })
        const gridMaterial = new THREE.ShaderMaterial({
            fragmentShader: Grid,
            uniforms,
            transparent: true,
        })
        this.scene = new THREE.Scene()
        this.scene.add(new THREE.Mesh(plane, material))
        this.scene.add(new THREE.Mesh(plane, gridMaterial))
    }

    draw (time) {
        const { camera, game, renderer, scene } = this
        const { bullets, ship } = game

        time *= 0.001 // seconds

        uniforms.time.value = time
        uniforms.BULLET_COUNT.value = bullets.length
        uniforms.BULLET_LOCATIONS.value = [
            ...bullets.map(({ position }) => new THREE.Vector2(position.x, 500 - position.y)),
            ...starLocations.map(vector => new THREE.Vector2(vector.x, vector.y)),
        ]
        if (ship) {
            uniforms.SHIP_LOCATION.value = new THREE.Vector2(ship.position.x, 500 - ship.position.y)
        }

        renderer.render(scene, camera)
    }
}
