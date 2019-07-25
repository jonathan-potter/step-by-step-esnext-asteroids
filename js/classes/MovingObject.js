import Canvas from 'utility/Canvas.js'
import first from 'lodash/first'
import { getIntersectionRatioOnSegment1 } from 'utility/Math.js'
import last from 'lodash/last'

export default class MovingObject {
    constructor ({ position, velocity, radius = 20, color = 'white' } = {}) {
        this.color = color
        this.omega = 0
        this.position = position
        this.radius = radius
        this.velocity = velocity
    }

    transformPoints (points) {
        return points
            .map(point => point.rotate(this.direction))
            .map(point => point.add(this.position))
    }

    getSegments () {
        const points = this.transformPoints(this.points)

        const segments = [
            [
                first(points),
                last(points),
            ],
        ]

        for (let i = 1; i < points.length; i++) {
            segments.push([
                points[i - 0],
                points[i - 1],
            ])
        }

        return segments
    }

    move () {
        this.direction += this.omega
        this.position = this.position.add(this.velocity)
    }

    draw () {
        Canvas.drawPoints({
            color: this.color,
            points: this.transformPoints(this.points),
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

    isCollidedWith (otherObject) {
        let ourSegments = this.getSegments()
        let theirSegments = otherObject.getSegments()

        return ourSegments.find(ourSegment => theirSegments.find(theirSegment => {
            return getIntersectionRatioOnSegment1(
                ourSegment[0].x,
                ourSegment[0].y,
                ourSegment[1].x,
                ourSegment[1].y,
                theirSegment[0].x,
                theirSegment[0].y,
                theirSegment[1].x,
                theirSegment[1].y,
            )
        }))
    }

    handleCollision () {
        if (!this.hit) { return this }

        return
    }
}
