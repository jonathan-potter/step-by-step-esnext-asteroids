import Canvas from '/js/utility/Canvas.js'

const { cos, PI: pi, random, sin } = Math

const MAX_SPEED = 5

export default class MovingObject {
    constructor ({ position, velocity }) {
        this.position = position
        this.velocity = velocity
    }

    move () {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    draw () {
        Canvas.drawCircle({
            x: this.position.x,
            y: this.position.y,
            radius: 20,
        })
    }

    static createRandom () {
        const position = {
            y: 500 * random(),
            x: 500 * random(),
        }

        const direction = 2 * pi * random()
        const speed = MAX_SPEED * random()
        const velocity = {
            x: speed * cos(direction),
            y: speed * sin(direction),
        }

        return new MovingObject({
            position,
            velocity
        })
    }
}
