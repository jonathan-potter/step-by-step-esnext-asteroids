import Canvas from 'utility/Canvas.js'
import Vec2 from 'classes/Vec2.js'

const { cos, PI: pi, random, sin } = Math

const MAX_SPEED = 5

export default class MovingObject {
    constructor ({ position, velocity, radius = 20, color = 'white' }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
    }

    move () {
        this.position = this.position.add(this.velocity)
    }

    draw () {
        Canvas.drawCircle({
            x: this.position.x,
            y: this.position.y,
            radius: this.radius,
            color: this.color,
        })
    }

    outOfBounds () {
        return Boolean(this.outOfBoundsDirection())
    }

    outOfBoundsDirection () {
        if (this.position.y <   0 - this.radius) { return 'N' }
        if (this.position.x > 500 + this.radius) { return 'E' }
        if (this.position.y > 500 + this.radius) { return 'S' }
        if (this.position.x <   0 - this.radius) { return 'W' }
    }

    wrap () {
        const direction = this.outOfBoundsDirection()
        if (!direction) { return }

        if (direction === 'N') { return this.position.y += 500 + this.radius * 2 }
        if (direction === 'E') { return this.position.x -= 500 + this.radius * 2 }
        if (direction === 'S') { return this.position.y -= 500 + this.radius * 2 }
        if (direction === 'W') { return this.position.x += 500 + this.radius * 2 }
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
