import Bullet from 'classes/Bullet.js'
import Canvas from 'utility/Canvas.js'
import key from 'keymaster'
import MovingObject from 'classes/MovingObject.js'
import Vec2 from 'classes/Vec2.js'

const { abs, PI: pi, sin } = Math

const INITIAL_DIRECTION = -pi / 2 // up
const SHIP_COLOR = 'white'
const SHIP_RADIUS = 10
const ACCELERATION_CONSTANT = 0.1
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
        this.direction = INITIAL_DIRECTION
        this.points = POINTS
    }

    draw () {
        this.drawThrust()
        Canvas.drawPoints({
            ...this,
            points: this.transformPoints(this.points),
        })
    }

    drawThrust () {
        if (!key.isPressed('up')) { return }

        const thrustPoints = [...THRUST_POINTS]

        thrustPoints[2] = thrustPoints[0]
            .add(thrustPoints[0].scale(2 * abs(sin(performance.now() / 45))))

        Canvas.drawPoints({
            ...this,
            points: this.transformPoints(thrustPoints),
            color: INNER_THRUST_COLOR,
        })

        thrustPoints[2] = thrustPoints[0]
            .add(thrustPoints[2].scale(1.5 * abs(sin(performance.now() / 75))))

        Canvas.drawPoints({
            ...this,
            points: this.transformPoints(thrustPoints),
            color: OUTER_THRUST_COLOR,
        })
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
        if (!key.isPressed('up')) { return { x: 0, y: 0 } }

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
