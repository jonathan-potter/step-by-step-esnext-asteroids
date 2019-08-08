import 'classes/Debris.js' // resolves circular dependency with MovingObject
import Game from 'classes/Game.js'
import times from 'lodash/times'

let lives, points, running
const livesContainer = document.getElementById('lives-container')
const pointsContainer = document.getElementById('points-container')
const resetOverlay = document.getElementById('reset-overlay')
const resetButton = document.getElementById('reset-button')

const game = new Game()

window.game = game

game.subscribe(() => {
    if (game.extraLives === lives) { return }
    lives = game.extraLives

    livesContainer.innerHTML = ''
    times(lives, () => {
        livesContainer.appendChild(document.createElement('div'))
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

resetButton.addEventListener('click', () => game.start())

game.start()
