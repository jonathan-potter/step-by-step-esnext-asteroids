import Bullet from 'classes/Bullet.js'
import Canvas from 'utility/Canvas.js'
import key from 'keymaster'
import MovingObject from 'classes/MovingObject.js'
import Vec2, { NULL_VECTOR } from 'classes/Vec2.js'

const { abs, PI: pi, sin } = Math

const INITIAL_DIRECTION = -pi / 2 // up
const SHIP_COLOR = 'white'
const SHIP_RADIUS = 10
const ACCELERATION_CONSTANT = 0.1
const INVULNERABILITY_TIME = 2000
const POINTS = [
    Vec2.fromArgumentAndMagnitude({ argument:  0 / 10 * pi, magnitude: SHIP_RADIUS }),
    Vec2.fromArgumentAndMagnitude({ argument:  8 / 10 * pi, magnitude: SHIP_RADIUS }),
    Vec2.fromArgumentAndMagnitude({ argument: 10 / 10 * pi, magnitude: SHIP_RADIUS / 2 }),
    Vec2.fromArgumentAndMagnitude({ argument: 12 / 10 * pi, magnitude: SHIP_RADIUS }),
]

const INNER_THRUST_COLOR = '#fa0'
const OUTER_THRUST_COLOR = '#f00'
const THRUST_POINTS = [
    Vec2.fromArgumentAndMagnitude({ argument: 10 / 10 * pi, magnitude: SHIP_RADIUS / 2 }),
    Vec2.fromArgumentAndMagnitude({ argument:  8 / 10 * pi, magnitude: SHIP_RADIUS }),
    Vec2.fromArgumentAndMagnitude({ argument: 10 / 10 * pi, magnitude: SHIP_RADIUS * 2 }),
    Vec2.fromArgumentAndMagnitude({ argument: 12 / 10 * pi, magnitude: SHIP_RADIUS }),
]

export default class Ship extends MovingObject {
    constructor () {
        super(...arguments)

        this.color = SHIP_COLOR
        this.creation = Date.now()
        this.direction = INITIAL_DIRECTION
        this.points = POINTS
        this.position = new Vec2({
            x: Canvas.getWidth() / 2,
            y: Canvas.getHeight() / 2,
        })
        this.velocity = NULL_VECTOR
    }

    get alpha () {
        return this.invulnerable ? (1 + sin(this.age / 80)) / 2 : 1
    }

    draw () {
        this.drawThrust()
        Canvas.drawPoints({
            alpha: this.alpha,
            color: this.color,
            points: this.transformPoints(this.points),
        })
    }

    drawThrust () {
        if (!key.isPressed('up')) { return }

        const thrustPoints = [...THRUST_POINTS]

        thrustPoints[2] = thrustPoints[0]
            .add(thrustPoints[0].scale(2 * abs(sin(Date.now() / 45))))

        Canvas.drawPoints({
            alpha: this.alpha,
            color: INNER_THRUST_COLOR,
            points: this.transformPoints(thrustPoints),
        })

        thrustPoints[2] = thrustPoints[0]
            .add(thrustPoints[2].scale(1.5 * abs(sin(Date.now() / 75))))

        Canvas.drawPoints({
            alpha: this.alpha,
            color: OUTER_THRUST_COLOR,
            points: this.transformPoints(thrustPoints),
        })
    }

    get age () {
        return Date.now() - this.creation
    }

    get invulnerable () {
        return this.age < INVULNERABILITY_TIME
    }

    move () {
        this.direction += this.omega
        this.velocity = this.velocity.add(this.acceleration)
        this.position = this.position.add(this.velocity)

        this.wrap()
    }

    shoot () {
        return new Bullet({
            position: this.frontPosition,
            direction: this.direction,
        })
    }

    get frontPosition () {
        const offset = this.points[0].rotate(this.direction)

        return this.position.add(offset)
    }

    get acceleration () {
        if (!key.isPressed('up')) { return NULL_VECTOR }

        return Vec2.fromArgumentAndMagnitude({
            argument: this.direction,
            magnitude: ACCELERATION_CONSTANT,
        })
    }

    get omega () {
        let omega = 0

        if (key.isPressed('left')) { omega -= 0.1 }
        if (key.isPressed('right')) { omega += 0.1 }

        return omega
    }

    set omega (omega) {
        // only here so that we can use the getter
    }
}
