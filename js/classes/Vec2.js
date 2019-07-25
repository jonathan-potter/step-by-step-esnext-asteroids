const { cos, hypot, PI: pi, random, sin } = Math

export default class Vec2 {
    constructor ({ x = 0, y = 0 } = {}) {
        this.x = x
        this.y = y
    }

    add (vector) {
        return new Vec2({
            x: this.x + vector.x,
            y: this.y + vector.y,
        })
    }

    rotate (angle) {
        return new Vec2({
            x: this.x * cos(angle) - this.y * sin(angle),
            y: this.x * sin(angle) + this.y * cos(angle),
        })
    }

    scale (scalar) {
        return new Vec2({
            x: scalar * this.x,
            y: scalar * this.y,
        })
    }

    subtract (vector) {
        return new Vec2({
            x: this.x - vector.x,
            y: this.y - vector.y,
        })
    }

    static distance (vector1, vector2) {
        const difference = vector1.subtract(vector2)

        return hypot(difference.x, difference.y)
    }

    static fromArgumentAndMagnitude ({ argument, magnitude }) {
        return new Vec2({
            x: magnitude * cos(argument),
            y: magnitude * sin(argument),
        })
    }

    static pointsOnACircle ({ radius, numPoints }) {
        const points = []

        let angle = 0
        while (angle < 2 * pi) {
            points.push(Vec2.fromArgumentAndMagnitude({
                magnitude: radius,
                argument: angle,
            }))

            angle += 2 * pi / numPoints
        }

        return points
    }

    static randomPointsInAnnulus ({ outerRadius, innerRadius }) {
        const points = []

        let angle = 0
        while (angle < 2 * pi) {
            points.push(Vec2.fromArgumentAndMagnitude({
                magnitude: innerRadius + (outerRadius - innerRadius) * random(),
                argument: angle,
            }))

            angle += random()
        }

        return points
    }
}

export const NULL_VECTOR = new Vec2()
