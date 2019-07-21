import Canvas from 'utility/Canvas.js'
import key from 'keymaster'
import MovingObject from 'classes/MovingObject.js'
import Ship from 'classes/Ship.js'
import Vec2 from 'classes/Vec2.js'

const { requestAnimationFrame } = window

const MIN_ASTEROIDS = 100

export default class Game {
    constructor () {
        this.asteroids = []
        this.bullets = []
        this.ship = new Ship({
            position: new Vec2({ x: 250, y: 250 }),
            velocity: new Vec2({ x: 0,   y: 0   }),
        })
        this.tick = this.tick.bind(this)
        this.bindHandlers()
    }

    move () {
        this.asteroids.forEach(asteroid => asteroid.move())
        this.bullets.forEach(bullet => bullet.move())
        this.ship.move()
    }

    draw () {
        this.asteroids.forEach(asteroid => asteroid.draw())
        this.bullets.forEach(bullet => bullet.draw())
        this.ship.draw()
    }

    removeOutOfBounds () {
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.outOfBounds())
        this.bullets = this.bullets.filter(bullet => !bullet.outOfBounds())
    }

    repopulateAsteroids () {
        while (this.asteroids.length < MIN_ASTEROIDS) {
            this.asteroids.push(MovingObject.createRandomOnBoundary())
        }
    }

    checkCollisions () {
        this.bullets.forEach(bullet => {
            this.asteroids.forEach(asteroid => {
                if (!bullet.isCollidedWith(asteroid)) { return }

                bullet.hit = true
                asteroid.hit = true
            })
        })
    }

    handleCollisions () {
        this.asteroids = this.asteroids.filter(asteroid => !asteroid.hit)
        this.bullets = this.bullets.filter(bullet => !bullet.hit)
    }

    tick () {
        Canvas.clear()

        this.repopulateAsteroids()
        this.move()
        this.checkCollisions()
        this.handleCollisions()
        this.removeOutOfBounds()
        this.draw()

        requestAnimationFrame(this.tick)
    }

    bindHandlers () {
        key('space', () => {
            this.bullets.push(this.ship.shoot())
        })
    }
}
