import Canvas from 'utility/Canvas.js'
import clamp from 'lodash/clamp'
import MovingObject from 'classes/MovingObject.js'

const { random } = Math

const LIFETIME = 500 // ms

export default class Debris extends MovingObject {
    constructor ({ segment }) {
        super(...arguments)

        this.omega = 0.2 * random()
        this.position = segment[0].add(segment[1]).scale(0.5)
        this.points = segment.map(point => point.subtract(this.position))
        this.creation = Date.now()
    }

    get age () {
        return Date.now() - this.creation
    }

    alive () {
        return this.age < LIFETIME
    }

    draw () {
        const { age, color, points } = this

        const lifeTimeLeft = clamp(1 - age / LIFETIME, 0, 1)
        Canvas.drawPoints({
            alpha: lifeTimeLeft,
            color: color,
            points: this.transformPoints(points),
        })
    }
}
