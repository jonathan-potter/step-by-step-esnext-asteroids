import MovingObject from 'classes/MovingObject.js'
import Vec2 from 'classes/Vec2.js'

const BULLET_SPEED = 8
const BULLET_RADIUS = 4
const BULLET_COLOR = '#f44'
const BULLET_POINTS = Vec2.pointsOnACircle({
    radius: BULLET_RADIUS,
    numPoints: 8,
})

export default class Bullet extends MovingObject {
    constructor ({ direction }) {
        super(...arguments)

        this.color = BULLET_COLOR
        this.direction = direction
        this.points = BULLET_POINTS
        this.radius = BULLET_RADIUS
        this.velocity = Vec2.fromArgumentAndMagnitude({
            argument: direction,
            magnitude: BULLET_SPEED,
        })
    }
}
