import Game from 'js/index.js'
import createTemplate from 'utility/createTemplate'
import shipSVG from 'assets/ship.svg'
import times from 'lodash/times'

let lives, points, running
const livesContainer = document.getElementById('lives-container')
const pointsContainer = document.getElementById('points-container')
const resetOverlay = document.getElementById('reset-overlay')
const resetButton = document.getElementById('reset-button')

const shipTemplate = createTemplate({ id: 'ship-svg', content: shipSVG })

const game = new Game({
    asteroids: [
        {
            position: { x: 200, y: 200 },
            rotation: 0,
            points: [
                { x: -10, y: -10 },
                { x: 10, y: -10 },
                { x: 10, y: 10 },
                { x: -10, y: 10 },
            ],
        },
    ],
    lives: 2,
    shapes: [
        {
            points: [
                { x: -10, y: -10 },
                { x: 10, y: -10 },
                { x: 10, y: 10 },
                { x: -10, y: 10 },
            ],
        },
        {
            points: [
                { x: -10, y: -10 },
                { x: 0, y: -3 },
                { x: 10, y: -10 },
                { x: 3, y: 0 },
                { x: 10, y: 10 },
                { x: 0, y: 3 },
                { x: -10, y: 10 },
                { x: -3, y: 0 },
            ],
        },
    ],
})

game.subscribe(() => {
    if (game.extraLives === lives) { return }
    lives = game.extraLives

    livesContainer.innerHTML = ''
    times(game.startingLives, index => {
        const element = shipTemplate.content.cloneNode(true).firstElementChild

        if (lives > index) {
            element.classList.add('unused')
        }

        livesContainer.appendChild(element)
    })
})

game.subscribe(() => {
    if (game.points === points) { return }
    points = game.points

    pointsContainer.innerHTML = points
})

game.subscribe(() => {
    if (game.running === running) { return }
    running = game.running

    if (game.running) {
        resetOverlay.classList.remove('game-over')
    } else {
        resetOverlay.classList.add('game-over')
    }
})

resetButton.addEventListener('click', () => {
    game.reset()
    game.start()
})

game.start()
