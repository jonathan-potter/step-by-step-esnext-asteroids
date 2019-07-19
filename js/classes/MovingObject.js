import Canvas from '/js/utility/Canvas.js'

const { cos, PI: pi, random, sin } = Math

const MAX_SPEED = 5

export default class MovingObject {
    constructor ({ position, velocity, radius = 20 }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
    }

    move () {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    draw () {
        Canvas.drawCircle({
            x: this.position.x,
            y: this.position.y,
            radius: this.radius,
        })
    }

    outOfBounds () {
        return (
            this.position.x < 0 - this.radius ||
            this.position.y < 0 - this.radius ||
            this.position.x > 500 + this.radius ||
            this.position.y > 500 + this.radius
        )
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
            velocity,
        })
    }

    static createRandomOnBoundary () {
        const movingObject = MovingObject.createRandom()

        const axis = random() < 0.5 ?
            'x' :
            'y'

        const location = random() < 0.5 ?
            0 - movingObject.radius :
            500 + movingObject.radius

        movingObject.position[axis] = location

        return movingObject
    }
}
