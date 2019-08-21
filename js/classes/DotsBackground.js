import Canvas from 'utility/Canvas.js'

const { cos, sin } = Math

const IMAGE_URLS = [
    'assets/1-5px-dots-5k.png',
    'assets/2px-dots-5k.png',
    'assets/3px-dots-5k.png',
]

const image = new Image()
image.src = 'assets/3px-dots-5k.png'

export default class Background {
    constructor () {
        this.images = IMAGE_URLS.map(imageUrl => {
            const image = new Image()
            image.src = imageUrl

            return image
        })
    }

    draw (time) {
        this.images.forEach((image, index) => {
            Canvas.drawImage({
                image,
                cx: 250 + 200 * cos(time / 8000 + index),
                cy: 250 + 50 * sin(time / 7000 + index),
                rotation: time / 10000 / (index + 1),
                width: 1000,
                height: 1000,
            })
        })
    }
}
