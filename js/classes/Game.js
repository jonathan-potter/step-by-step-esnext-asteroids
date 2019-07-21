import Asteroid from 'classes/Asteroid.js'
import Canvas from 'utility/Canvas.js'
import flatten from 'lodash/flatten'
import key from 'keymaster'
import Ship from 'classes/Ship.js'
import Vec2 from 'classes/Vec2.js'

const { requestAnimationFrame } = window

const MIN_ASTEROIDS = 5

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

    start () {
        this.running = true
        this.tick()
    }

    stop () {
        this.running = false
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
            this.asteroids.push(Asteroid.createRandomOnBoundary())
        }
    }

    checkCollisions () {
        this.asteroids.forEach(asteroid => {
            if (asteroid.isCollidedWith(this.ship)) {
                this.ship.hit = true
            }

            const collidedBullet = this.bullets.find(bullet => asteroid.isCollidedWith(bullet))

            if (collidedBullet) {
                collidedBullet.hit = true
                asteroid.hit = true
            }
        })
    }

    handleCollisions () {
        this.asteroids = flatten(this.asteroids.map(asteroid => asteroid.handleCollision()).filter(Boolean))
        this.bullets = flatten(this.bullets.map(bullet => bullet.handleCollision()).filter(Boolean))

        if (this.ship.hit) { this.stop() }
    }

    tick () {
        if (!this.running) { return }

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
