import MovingObject from '/js/classes/MovingObject.js'
import Canvas from '/js/utility/Canvas.js'

const movingObject = new MovingObject()

function tick() {
    Canvas.clear()
    movingObject.move()
    movingObject.draw()
    requestAnimationFrame(tick)
}

tick()
