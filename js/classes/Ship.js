import Canvas from '/js/utility/Canvas.js'
import MovingObject from '/js/classes/MovingObject.js'

const { cos, PI: pi, sin } = Math

const INITIAL_DIRECTION = -pi / 2 // up
const SHIP_COLOR = '#f88'

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

    get frontPosition () {
        var dx = this.radius * cos(this.direction)
        var dy = this.radius * sin(this.direction)

        return {
            x: this.position.x + dx,
            y: this.position.y + dy,
        }
    }
}
