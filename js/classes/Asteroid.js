import Canvas from 'utility/Canvas.js'
import MovingObject from 'classes/MovingObject.js'
import times from 'lodash/times'
import Vec2 from 'classes/Vec2.js'

const { max, PI: pi, random } = Math

const ASTEROID_RADIUS = 20
const MAX_SPEED = 1

export default class Asteroid extends MovingObject {
    constructor ({ generation = 1, points, scale = 1, radius = ASTEROID_RADIUS }) {
        super(...arguments)

        this.direction = 0
        this.generation = generation
        this.omega = 0.03 * (random() - 0.5) // angular velocity
        this.radius = radius // takes local default over MovingObject default
        this.scale = scale

        if (points) {
            this.points = points.map(point => point.scale(scale))
        } else {
            this.points = Vec2.randomPointsInAnnulus({
                outerRadius: radius,
                innerRadius: radius / 2,
            })
        }
    }

    handleCollision () {
        if (!this.hit) { return this }

        // asteroid falls apart
        const debris = this.breakApart()

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
                scale: this.scale / 2,
                generation: this.generation + 1,
            })
        }))
    }

    moveToRandomBoundary () {
        const stageDimensions = Canvas.getDimensions()

        const axis = random() < 0.5 ? 'x' : 'y'

        this.position[axis] = random() < 0.5 ?
            0 - this.radius :
            stageDimensions[axis] + this.radius

        return this
    }

    static createRandomFromPoints ({ points }) {
        const asteroid = Asteroid.createRandom()

        asteroid.points = points.map(point => new Vec2(point))
        const currentRadius = max.apply(null, asteroid.points.map(point => point.magnitude()))
        asteroid.points = asteroid.points.map(point => point.scale(asteroid.radius / currentRadius))
        asteroid.moveToRandomBoundary()

        return asteroid
    }

    static createFromPoints ({ position, points, rotation }) {
        const asteroid = Asteroid.createRandom()

        asteroid.direction = rotation
        asteroid.points = points.map(point => new Vec2(point))
        asteroid.position = new Vec2(position)
        asteroid.radius = max.apply(null, asteroid.points.map(point => point.magnitude()))

        return asteroid
    }

    static createRandom () {
        const position = new Vec2({
            y: Canvas.getWidth() * random(),
            x: Canvas.getHeight() * random(),
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

        asteroid.moveToRandomBoundary()

        return asteroid
    }
}
