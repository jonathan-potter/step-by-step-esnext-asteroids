import Canvas from 'utility/Canvas.js'
import times from 'lodash/times'
import Vec2 from 'classes/Vec2.js'

const { random } = Math

const STAR_COUNT = 500
const LAYERS = 3
const ROTATION_RATE = 10000 // milliseconds

const starLocations = times(STAR_COUNT, () => {
    return new Vec2({
        x: random(),
        y: random(),
    }).scale(500)
})

export default class Background {
    draw () {
        const time = Date.now() / ROTATION_RATE

        for (let layer = 0; layer < LAYERS; layer++) {
            const starsInLayer = STAR_COUNT / (layer*5 + 1)

            for (let i = 0; i < starsInLayer; i++) {
                const starLocation = starLocations[i].add(Vec2.fromArgumentAndMagnitude({
                    argument: layer + time * (layer + 1) % ROTATION_RATE,
                    magnitude: 20 * (layer + 1),
                }))

                Canvas.drawCircle({
                    ...starLocation,
                    radius: (layer + 1) / 1,
                    fill: true,
                    alpha: 0.1,
                })
            }
        }
    }
}
