import Asteroid from 'classes/Asteroid.js'
import Bullet from 'classes/Bullet.js'
import Background from 'classes/Background.js'
import Canvas from 'utility/Canvas.js'
import Debris from 'classes/Debris.js'
import key from 'keymaster'
import sample from 'lodash/sample'
import Ship from 'classes/Ship.js'

const { requestAnimationFrame } = window

const GAME_OVER_DELAY = 1000
const MIN_ASTEROIDS = 25
const STARTING_LIVES = 2

export default class Game {
    constructor ({ asteroids = [], canvasId, lives = STARTING_LIVES, shapes } = {}) {
        Canvas.initialize({ canvasId })

        this.bindHandlers()
        this.extraLives = lives
        this.shapes = shapes
        this.startingLives = lives
        this.subscriptions = []
        this.tick = this.tick.bind(this)

        this.reset()

        this.asteroids = asteroids.map(asteroid => (
            Asteroid.createFromPoints(asteroid)
        ))
    }

    reset () {
        this.asteroids = []
        this.bullets = []
        this.debris = []
        this.extraLives = this.startingLives
        this.points = 0
        this.ship = new Ship()
        this.background = new Background(this)
    }

    start () {
        this.running = true
        this.tick()
    }

    gameOver () {
        setTimeout(() => this.running = false, GAME_OVER_DELAY)
    }

    move () {
        this.asteroids.forEach(asteroid => asteroid.move())
        this.bullets.forEach(bullet => bullet.move())
        this.debris.forEach(debris => debris.move())
        this.ship && this.ship.move()
    }

    draw (time = 0) {
        this.background.draw(time)
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
            if (this.shapes) {
                this.asteroids.push(Asteroid.createRandomFromPoints(sample(this.shapes)))
            } else {
                this.asteroids.push(Asteroid.createRandomOnBoundary())
            }
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
        this.subscriptions.forEach(callback => callback())
    }

    tick (time) {
        this.executeSubscriptions()

        if (!this.running) { return }

        Canvas.clear()

        this.cullDebris()
        this.repopulateAsteroids()
        this.move()
        this.checkCollisions()
        this.handleCollisions()
        this.removeOutOfBounds()
        this.draw(time)

        requestAnimationFrame(this.tick)
    }

    bindHandlers () {
        key('space', () => {
            this.ship && this.bullets.push(this.ship.shoot())
        })
    }
}
