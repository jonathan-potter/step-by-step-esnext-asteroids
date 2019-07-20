import Canvas from '/js/utility/Canvas.js'
import MovingObject from '/js/classes/MovingObject.js'
import Ship from '/js/classes/Ship.js'

const { requestAnimationFrame } = window

const MIN_ASTEROIDS = 100

export default class Game {
    constructor () {
        this.asteroids = []
        this.ship = new Ship({
            position: { x: 250, y: 250 },
            velocity: { x: 0,   y: 0   },
        })
    }

    move () {
        this.asteroids.forEach(asteroid => asteroid.move())
        this.ship.move()
    }

    draw () {
        this.asteroids.forEach(asteroid => asteroid.draw())
        this.ship.draw()
    }

    removeOutOfBounds () {
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.outOfBounds())
    }

    repopulateAsteroids () {
        while (this.asteroids.length < MIN_ASTEROIDS) {
            this.asteroids.push(MovingObject.createRandomOnBoundary())
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
