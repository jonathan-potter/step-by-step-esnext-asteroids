import Canvas from 'utility/Canvas.js'
import key from 'keymaster'
import MovingObject from 'classes/MovingObject.js'

const { cos, PI: pi, sin } = Math

const INITIAL_DIRECTION = -pi / 2 // up
const SHIP_COLOR = '#f88'
const ACCELERATION_CONSTANT = 0.1

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

        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.wrap()
    }

    get frontPosition () {
        var dx = this.radius * cos(this.direction)
        var dy = this.radius * sin(this.direction)

        return {
            x: this.position.x + dx,
            y: this.position.y + dy,
        }
    }

    get acceleration () {
        if (!key.isPressed('up')) { return { x: 0, y: 0 } }

        return {
            x: ACCELERATION_CONSTANT * cos(this.direction),
            y: ACCELERATION_CONSTANT * sin(this.direction),
        }
    }
}
