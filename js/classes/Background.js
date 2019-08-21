import times from 'lodash/times'
import Vec2 from 'classes/Vec2.js'
import * as THREE from 'three'
import MovingDots from 'glsl/MovingDots.glsl'
import Grid from 'glsl/Grid.glsl'

const { PI: pi, random } = Math

const DOT_COUNT = 500

const starLocations = times(DOT_COUNT, () => new Vec2({
    x: random(),
    y: random(),
}).scale(500)).map(vector => new THREE.Vector2(vector.x, vector.y))

const starVelocities = times(DOT_COUNT, () => {
    const direction = 2 * pi * random()
    const speed = random()

    return Vec2.fromArgumentAndMagnitude({
        argument: direction,
        magnitude: speed,
    }).scale(50)
}).map(vector => new THREE.Vector2(vector.x, vector.y))

/* eslint-disable indent */
const uniforms = {
                time: { value: 0 },
          resolution: { value: new THREE.Vector3(500, 500) },
            DOT_SIZE: { value: 4 },
    //   LAYER_COUNTS: { value: [350, 100, 50] },
       DOT_LOCATIONS: { value: starLocations },
      DOT_VELOCITIES: { value: starVelocities },
      ASTEROID_COUNT: { value: 0 },
  ASTEROID_LOCATIONS: { value: starLocations }, // placeholder stuff
        BULLET_COUNT: { value: 0 },
    BULLET_LOCATIONS: { value: starLocations }, // placeholder stuff
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
        const { asteroids, bullets, ship } = game

        time *= 0.001 // seconds

        uniforms.time.value = time
        uniforms.BULLET_COUNT.value = bullets.length
        uniforms.BULLET_LOCATIONS.value = [
            ...bullets.map(({ position }) => new THREE.Vector2(position.x, 500 - position.y)),
            ...starLocations,
        ]
        uniforms.ASTEROID_COUNT.value = asteroids.length
        uniforms.ASTEROID_LOCATIONS.value = [
            ...asteroids.map(({ position }) => new THREE.Vector2(position.x, 500 - position.y)),
            ...starLocations,
        ]
        if (ship) {
            uniforms.SHIP_LOCATION.value = new THREE.Vector2(ship.position.x, 500 - ship.position.y)
        }

        renderer.render(scene, camera)
    }
}
