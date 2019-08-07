import Debris from 'classes/Debris.js'
import MovingObject from 'classes/MovingObject.js'
import times from 'lodash/times'
import Vec2 from 'classes/Vec2.js'

const { PI: pi, random } = Math

const ASTEROID_RADIUS = 20
const MAX_SPEED = 1

export default class Asteroid extends MovingObject {
    constructor ({ generation = 1, radius = ASTEROID_RADIUS }) {
        super(...arguments)

        this.direction = 0
        this.generation = generation
        this.omega = 0.03 * (random() - 0.5) // angular velocity
        this.points = Vec2.randomPointsInAnnulus({
            outerRadius: radius,
            innerRadius: radius / 2,
        })
    }

    handleCollision () {
        if (!this.hit) { return this }

        // asteroid falls apart
        const debris = this.getSegments().map(segment => {
            const first = this.position.subtract(segment[0])
            const last = this.position.subtract(segment[1])

            const velocity = first.add(last).scale(0.1)

            return new Debris({
                segment,
                velocity,
            })
        })

        if (this.generation >= 3) { return debris }

        // three smaller asteroids
        return debris.concat(times(3, () => {
            const direction = 2 * pi * random()

            return new Asteroid({
                ...this,
                velocity: Vec2.fromArgumentAndMagnitude({
                    argument: direction,
                    magnitude: MAX_SPEED,
                }),
                radius: this.radius / 2,
                generation: this.generation + 1,
            })
        }))
    }

    static createRandom () {
        const position = new Vec2({
            y: 500 * random(),
            x: 500 * random(),
        })

        const direction = 2 * pi * random()
        const speed = MAX_SPEED * random()
        const velocity = Vec2.fromArgumentAndMagnitude({
            argument: direction,
            magnitude: speed,
        })

        return new Asteroid({
            position,
            velocity,
        })
    }

    static createRandomOnBoundary () {
        const asteroid = Asteroid.createRandom()

        const axis = random() < 0.5 ?
            'x' :
            'y'

        const location = random() < 0.5 ?
            0 - asteroid.radius :
            500 + asteroid.radius

        asteroid.position[axis] = location

        return asteroid
    }
}
