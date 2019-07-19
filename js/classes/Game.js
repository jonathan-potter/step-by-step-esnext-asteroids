import MovingObject from '/js/classes/MovingObject.js'
import Canvas from '/js/utility/Canvas.js'

const { requestAnimationFrame } = window

export default class Game {
    constructor () {
        this.asteroids = [
            MovingObject.createRandom(),
            MovingObject.createRandom(),
            MovingObject.createRandom(),
            MovingObject.createRandom(),
            MovingObject.createRandom(),
            MovingObject.createRandom(),
            MovingObject.createRandom(),
        ]
    }

    move () {
        this.asteroids.forEach(asteroid => asteroid.move())
    }

    draw () {
        this.asteroids.forEach(asteroid => asteroid.draw())
    }

    tick = () => {
        Canvas.clear()

        this.move()
        this.draw()

        requestAnimationFrame(this.tick)
    }
}
