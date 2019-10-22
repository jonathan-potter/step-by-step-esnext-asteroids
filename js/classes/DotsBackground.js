import Canvas from 'utility/Canvas.js'
import Vec2 from 'classes/Vec2.js'

const { PI: pi } = Math

const CENTER = new Vec2({ x: 250, y: 250 })
const IMAGE_WIDTH = 1000
const IMAGE_HEIGHT = 1000
const IMAGE_URLS = [
    'assets/1-5px-dots-5k.png',
    'assets/2px-dots-5k.png',
    'assets/3px-dots-5k.png',
]

export default class DotsBackground {
    constructor () {
        this.images = IMAGE_URLS.map(imageUrl => {
            const image = new Image()
            image.src = imageUrl

            return image
        })
    }

    draw (time) {
        this.images.forEach((image, index) => {
            var offset = Vec2.fromArgumentAndMagnitude({
                argument: time / 20000,
                magnitude: 200,
            }).rotate(index * 2 * pi / 3)

            Canvas.drawImage({
                image,
                center: CENTER.add(offset),
                rotation: -time / 1e5,
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
            })
        })
    }
}
