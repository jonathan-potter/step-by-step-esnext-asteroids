import Asteroid from 'classes/Asteroid.js'
import Bullet from 'classes/Bullet.js'
import Canvas from 'utility/Canvas.js'
import Debris from 'classes/Debris.js'
import key from 'keymaster'
import Ship from 'classes/Ship.js'

const { requestAnimationFrame } = window

const MIN_ASTEROIDS = 5
const STARTING_LIVES = 2
const DEATH_TIMER = 1000

export default class Game {
    constructor () {
        this.subscriptions = []
        this.tick = this.tick.bind(this)
        this.bindHandlers()
    }

    reset () {
        this.asteroids = []
        this.bullets = []
        this.debris = []
        this.extraLives = STARTING_LIVES
        this.points = 0
        this.ship = new Ship()
    }

    start () {
        this.running = true
        this.reset()
        this.tick()
    }

    gameOver () {
        setTimeout(() => this.running = false, DEATH_TIMER)
    }

    move () {
        this.asteroids.forEach(asteroid => asteroid.move())
        this.bullets.forEach(bullet => bullet.move())
        this.debris.forEach(debris => debris.move())
        this.ship && this.ship.move()
    }

    draw () {
        this.asteroids.forEach(asteroid => asteroid.draw())
        this.bullets.forEach(bullet => bullet.draw())
        this.debris.forEach(debris => debris.draw())
        this.ship && this.ship.draw()
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
            if (this.ship && !this.ship.invulnerable && asteroid.isCollidedWith(this.ship)) {
                this.ship.hit = true
                asteroid.hit = true
            }

            const collidedBullet = this.bullets.find(bullet => !bullet.hit && asteroid.isCollidedWith(bullet))

            if (collidedBullet) {
                collidedBullet.hit = true
                asteroid.hit = true
                this.points += 1
            }
        })
    }

    handleCollisions () {
        const movingObjects = [
            ...this.asteroids,
            ...this.bullets,
            this.ship,
        ].filter(Boolean).map(movingObject => movingObject.handleCollision()).flat()

        this.asteroids = movingObjects.filter(movingObject => movingObject instanceof Asteroid)
        this.bullets = movingObjects.filter(movingObject => movingObject instanceof Bullet)
        this.debris = movingObjects.filter(movingObject => movingObject instanceof Debris).concat(this.debris)
        this.ship = movingObjects.find(movingObject => movingObject instanceof Ship)

        if (this.ship) { return }

        if (this.extraLives > 0) {
            this.extraLives -= 1
            this.ship = new Ship()
        } else {
            this.gameOver()
        }
    }

    cullDebris () {
        this.debris = this.debris.filter(debris => debris.alive())
    }

    subscribe (callback) {
        this.subscriptions.push(callback)
    }

    executeSubscriptions () {
        this.subscriptions.forEach(callback => callback ())
    }

    tick () {
        this.executeSubscriptions()

        if (!this.running) { return }

        Canvas.clear()

        this.cullDebris()
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
            this.ship && this.bullets.push(this.ship.shoot())
        })
    }
}
