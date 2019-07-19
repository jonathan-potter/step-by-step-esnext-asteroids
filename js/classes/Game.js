import MovingObject from '/js/classes/MovingObject.js'
import Canvas from '/js/utility/Canvas.js'

const { requestAnimationFrame } = window

const MIN_ASTEROIDS = 100

export default class Game {
    constructor () {
        this.asteroids = []
    }

    move () {
        this.asteroids.forEach(asteroid => asteroid.move())
    }

    draw () {
        this.asteroids.forEach(asteroid => asteroid.draw())
    }

    removeOutOfBounds () {
        this.asteroids.forEach(asteroid => {
            console.log(asteroid.outOfBounds())
        })
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.outOfBounds())
    }

    repopulateAsteroids () {
        while (this.asteroids.length < MIN_ASTEROIDS) {
            this.asteroids.push(MovingObject.createRandom())
        }
    }

    tick = () => {
        Canvas.clear()

        this.repopulateAsteroids()
        this.move()
        this.removeOutOfBounds()
        this.draw()

        requestAnimationFrame(this.tick)
    }
}
