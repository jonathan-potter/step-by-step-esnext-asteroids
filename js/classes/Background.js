import DotsBackground from 'classes/DotsBackground.js'
import WebGLBackground from 'classes/WebGLBackground.js'

export default class Background {
    constructor (game) {
        this.backgrounds = [
            new DotsBackground(),
            new WebGLBackground(game),
        ]
    }

    draw (time) {
        this.backgrounds.forEach(background => background.draw(time))
    }
}
