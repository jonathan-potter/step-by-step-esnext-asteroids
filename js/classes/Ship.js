import Canvas from 'utility/Canvas.js'
import key from 'keymaster'
import MovingObject from 'classes/MovingObject.js'
import Vec2 from 'classes/Vec2.js'

const { cos, PI: pi, sin } = Math

const INITIAL_DIRECTION = -pi / 2 // up
const SHIP_COLOR = '#f88'
const ACCELERATION_CONSTANT = 0.1
const BULLET_SPEED = 8
const BULLET_RADIUS = 4
const BULLET_COLOR = '#f44'

export default class Ship extends MovingObject {
    constructor () {
        super(...arguments)

        this.direction = INITIAL_DIRECTION
        this.color = SHIP_COLOR
    }

    draw () {
        Canvas.drawCircle({
            x: this.position.x,
            y: this.position.y,
            radius: this.radius,
            color: this.color,
        })

        Canvas.drawCircle({
            x: this.frontPosition.x,
            y: this.frontPosition.y,
            radius: 3,
            color: this.color,
        })
    }

    move () {
        if (key.isPressed('left')) { this.direction -= 0.1 }
        if (key.isPressed('right')) { this.direction += 0.1 }

        this.velocity = this.velocity.add(this.acceleration)
        this.position = this.position.add(this.velocity)

        this.wrap()
    }

    shoot () {
        return new MovingObject({
            position: this.frontPosition,
            velocity: {
                x: BULLET_SPEED * cos(this.direction),
                y: BULLET_SPEED * sin(this.direction),
            },
            radius: BULLET_RADIUS,
            color: BULLET_COLOR,
        })
    }

    get frontPosition () {
        var x = this.radius * cos(this.direction)
        var y = this.radius * sin(this.direction)

        return this.position.add(new Vec2({ x, y }))
    }

    get acceleration () {
        if (!key.isPressed('up')) { return { x: 0, y: 0 } }

        return {
            x: ACCELERATION_CONSTANT * cos(this.direction),
            y: ACCELERATION_CONSTANT * sin(this.direction),
        }
    }
}
