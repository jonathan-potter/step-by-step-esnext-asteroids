import times from 'lodash/times'
import * as THREE from 'three'
import Grid from 'glsl/Grid.glsl'

const MAX_THING_COUNT = 50
const PLACEHOLDER_VECTORS = times(MAX_THING_COUNT, () => new THREE.Vector2())

/* eslint-disable indent */
const uniforms = {
          resolution: { value: new THREE.Vector3(500, 500) },
      ASTEROID_COUNT: { value: 0 },
  ASTEROID_LOCATIONS: { value: PLACEHOLDER_VECTORS }, // placeholder stuff
        BULLET_COUNT: { value: 0 },
    BULLET_LOCATIONS: { value: PLACEHOLDER_VECTORS }, // placeholder stuff
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
        const gridMaterial = new THREE.ShaderMaterial({
            fragmentShader: Grid,
            uniforms,
            transparent: true,
        })
        this.scene = new THREE.Scene()
        this.scene.add(new THREE.Mesh(plane, gridMaterial))
    }

    draw () {
        const { camera, game, renderer, scene } = this
        const { asteroids, bullets, ship } = game

        uniforms.BULLET_COUNT.value = bullets.length
        uniforms.BULLET_LOCATIONS.value = [
            ...bullets.map(({ position }) => new THREE.Vector2(position.x, 500 - position.y)),
            ...PLACEHOLDER_VECTORS,
        ]
        uniforms.ASTEROID_COUNT.value = asteroids.length
        uniforms.ASTEROID_LOCATIONS.value = [
            ...asteroids.map(({ position }) => new THREE.Vector2(position.x, 500 - position.y)),
            ...PLACEHOLDER_VECTORS,
        ]
        if (ship) {
            uniforms.SHIP_LOCATION.value = new THREE.Vector2(ship.position.x, 500 - ship.position.y)
        }

        renderer.render(scene, camera)
    }
}
