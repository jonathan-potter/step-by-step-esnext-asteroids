import Canvas from 'utility/Canvas.js'

const { cos, PI: pi, random, sin } = Math

const MAX_DEPTH = 32

export default class DotsBackground {
    constructor () {
        this.stars = []
    }

    cull () {
        const { width, height } = Canvas.getDimensions()

        this.stars = this.stars.filter(star => (
            star.x > - width / 2 &&
            star.x <   width / 2 &&
            star.y > - height / 2 &&
            star.y <   height / 2
        ))
    }

    draw () {
        const { width, height } = Canvas.getDimensions()

        const { stars } = this
        for (i = 0; i < 1; i++) {
            const magnitude = random()
            const angle = random() * 2 * pi

            stars.push({
                x: width * magnitude * cos(angle),
                y: height * magnitude * sin(angle),
                z: 32 * random(),
            })
        }

        const halfWidth = width / 2
        const halfHeight = height / 2

        for (var i = 0; i < stars.length; i++) {
            stars[i].z -= 0.2

            if (stars[i].z <= 0) {
                stars[i].x = randomRange(-25, 25)
                stars[i].y = randomRange(-25, 25)
                stars[i].z = MAX_DEPTH
            }

            var k = 128.0 / stars[i].z
            var px = stars[i].x * k + halfWidth
            var py = stars[i].y * k + halfHeight

            if (px >= 0 && px <= width && py >= 0 && py <= height) {
                var size = (1 - stars[i].z / 32.0) * 5
                var shade = parseInt((1 - stars[i].z / 32.0) * 255)
                Canvas.fillStyle = 'rgb(' + shade + ',' + shade + ',' + shade + ')'
                Canvas.fillRect(px, py, size, size)
            }
        }

        this.cull()
    }
}

function randomRange (minVal, maxVal) {
    return Math.floor(random() * (maxVal - minVal - 1)) + minVal
}
