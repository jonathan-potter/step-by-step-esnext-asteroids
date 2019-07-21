import MovingObject from 'classes/MovingObject.js'
import times from 'lodash/times'
import Vec2 from 'classes/Vec2.js'

const { cos, PI: pi, random, sin } = Math

const MAX_SPEED = 1

export default class Asteroid extends MovingObject {
    constructor ({ generation = 1 }) {
        super(...arguments)

        this.generation = generation
    }

    handleCollision () {
        if (!this.hit) { return this }

        if (this.generation >= 3) { return }

        return times(3, () => {
            const direction = 2 * pi * random()

            return new Asteroid({
                ...this,
                velocity: new Vec2({
                    x: MAX_SPEED * cos(direction),
                    y: MAX_SPEED * sin(direction),
                }),
                radius: this.radius / 2,
                generation: this.generation + 1,
            })
        })
    }

    static createRandom () {
        const position = new Vec2({
            y: 500 * random(),
            x: 500 * random(),
        })

        const direction = 2 * pi * random()
        const speed = MAX_SPEED * random()
        const velocity = new Vec2({
            x: speed * cos(direction),
            y: speed * sin(direction),
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
