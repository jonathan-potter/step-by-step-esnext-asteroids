const { hypot } = Math

export default class Vec2 {
    constructor ({ x = 0, y = 0 }) {
        this.x = x
        this.y = y
    }

    add (vector) {
        return new Vec2({
            x: this.x + vector.x,
            y: this.y + vector.y,
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
}
