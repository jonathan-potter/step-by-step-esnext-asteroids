import Canvas from '/js/utility/Canvas.js'

export default class MovingObject {
    constructor() {
        this.position = { x: 250, y: 250 }
        this.velocity = { x: 0.5, y: 0.5 }
    }

    move() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    draw() {
        Canvas.drawCircle({
            x: this.position.x,
            y: this.position.y,
            radius: 20
        })
    }
}
