import 'classes/Debris.js' // resolves circular dependency with MovingObject
import Game from 'classes/Game.js'

const game = new Game()

game.start()
