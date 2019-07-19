# Step by Step ESNext Asteroids

##Goals
- teach super basic game loop
- introduce webpack
- introduce dev assistance tools (eslint, editorconfig, html-boilerplate)
- have fun :)


## Prep your files:
#### terminal
- `mkdir asteroids`
- `cd asteroids`
- `touch index.html`
- `mkdir css js`
- `touch js/index.js`
- `touch css/app.css`
#### index.js
- add a `console.log`
#### app.css
- add the following to your css file
    ```css
    /* css reset */
    html, body, canvas {
        padding: 0;
        border: 0;
        margin: 0;
    }

    html, body {
        width: 100%;
        height: 100%;
        background-color: black;
    }
    ```
#### index.html
- prepopulate your html file using something like `HTML5-boilerplate` (or just do it yourself)
- add your `<link>` tag at the bottom of the `<head>` tag
    ```html
    <link rel="stylesheet" href="css/app.css">
    ```
- add your `<script>` tag at the bottom of the `<body>` tag
    ```html
    <script type="module" src="js/index.js"></script>
    ```
#### terminal
- `npm init -y`
#### package.json
- set the scripts section of your new `package.json` to:
    ```json
    "scripts": {
        "start": "python -m SimpleHTTPServer 2222"
    },
    ```
#### terminal
- use the new `start` script in the terminal: `yarn start`
#### finish up
- open your browser and go to [localhost:2222](http://localhost:2222/)
- you should see your background color accross the whole page
- you should see your console log in the console
- run `git init` and commit your initial commit

## Draw a circle:
- add this `canvas` element to your html
  ```html
  <canvas id="canvas-stage" width="500" height="500"></canvas>
  ```
- add css so that the canvas is 500x500 pixels and has a `2px solid white border` and center it on the screen
    ```css
    body {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    canvas {
        width: 500px;
        height: 500px;
        border: 2px solid white;
    }
    ```
- add a `js/utility` directory
- create a file called `Canvas.js` in `js/utility` with the following contents:
    ```js
    const canvas = document.getElementById('canvas-stage')
    const context = canvas.getContext('2d')

    const { PI } = Math

    export default {
        drawCircle({ x, y, radius, color = 'white', lineWidth = 2 }) {
            context.beginPath()

            context.lineWidth = lineWidth
            context.strokeStyle = color
            context.arc(x, y, radius, 0, 2 * PI)

            context.closePath()
            context.stroke()
        },
    }
    ```
- change your `js/index.js` file to import the `Canvas` utility and draw a circle in the middle of your canvas
    ```js
    import Canvas from '/js/utility/Canvas.js'

    Canvas.drawCircle({ x: 250, y: 250, radius: 20})
    ```
#### finish up
- refresh your browser
- you should see a circle in the middle of the stage
- commit your work

## Get your circle moving: (less handholdy)
#### MovingOjbect.js
- `mkdir js/classes`
- `touch MovingObject.js`
- add a new file `js/classes/MovingObject.js`
- declare a new class `MovingObject.js` with three functions: `constructor`, `move`, and `draw`
- inside the `constructor` add a `position` and `velocity` to the new `movingObject`
    - the `position` and `velocity` should be objects with `x` and `y` propreties
- the `move` should modify the position by adding the velocity to the position
- the draw command should use `Canvas.drawCircle` from the previous section
#### index.js
- rewrite `index.js` to create a `MovingObject` you can use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to get things going:
    ```js
    import MovingObject from '/js/classes/MovingObject.js'

    const movingObject = new MovingObject()

    function tick() {
        movingObject.move()
        movingObject.draw()
        requestAnimationFrame(tick)
    }

    tick();
    ```
#### Make a circle move instead of a line
- return to your `Canvas` file and add a `clear` function
- the clear function is going to look something like this `context.clearRect(0, 0, 1e9, 1e9)
- add `Canvas.clear()` to the beginning of your `tick` function in `index.js`
#### finish up
- refresh the browser
- you should see a circle moving across the canvas
- commit your work

## Make LOTS of Circlers Fly Around
#### MovingObject.js
`MovingObject` needs to be modified so that all of the movingObjects aren't all sitting right on top of each other
- modify the `constructor` of `MovingObject` to take the `position` and `velocity` as arguments
- create a `static` function attached to `MovingObject` called `createRandom` this function should generate a random `position` and `velocity` and return a new `MovingObject` with those applied.
#### Game.js
- add a new `Game` class at `js/classes/Game.js`
- give the game class `constructor`, `move`, `draw`, `tick`, and `start` methods
- the constructor should add an `asteroids` array to `this` which is populated with a bunch of `MovingObject`s
- the `move` method should call `move` on every `asteroid`
- the `draw` method should call `draw` on every `asteroid`
- the `tick` method should call `Canvas.clear`, `move`, and `draw` from `Game` and use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to keep itself going
#### finish up
- refresh your browser
- lots of asteroids should be flying around
- commit your work

## Maintain a minimum number of asteroids flying around
#### MovingObject.js
- add an `outOfBounds` method to `MovingObject` which will return `true` if the movingObject is out of bounds
#### Game.js
- add two methods `removeOutOfBounds` and `repopulateAsteroids` to `Game`
- `removeOutOfBounds` should filter `outOfBounds` asteroids out of the asteroids list
- the `repopulateAsteroids` will fill up the asteroids list with new asteroids
- call the functions in `tick`
#### finish up
- refresh your browser
- you should see new asteroids popping onto the stage whenever others have left
- commit your work

## Make the asteroids enter from the side
#### MovingObject.js
- create a new `static` factory function to create new asteroids on the edge of the boundary
#### Game.js
- replace `MovingObject.createRandom()` with your new factory function
#### finish up
- refresh your browser
- you should see the asteroids entering from the edge of the stage
- commit your work

## Add a ship!!!
#### Ship.js
- create a new file `js/classes/ship.js`
- create a new class `Ship` which extends `MovingObject`
- add a `constructor` which adds a `direction` (radians) to the ship and sets the `color` to something different than the asteroids
- copy the `draw` method from `MovingObject` into `Ship`. Add one more `drawCircle` call to place a tiny circle at the front of your ship (you can do something fancier later)
- modify the `constructor` to pass the argument object to `super`
#### Game.js
- instantiate a new `Ship` in the `constructor` and add it to the game instance
- make sure the ship is centered and isn't moving
- add calls to `move` and `draw` the ship in the `move` and `draw` methods of `Game`
### MovingObject.js
- modify `draw` so that it passes `color` to `drawCircle`
#### finish up
- refresh your browser
- you should see your ship sitting in the middle of the stage
- commit your work

## Small interlude
- [ADD WEBPACK!!!](https://webpack.js.org/guides/getting-started/)
- [ADD ESLINT](https://eslint.org/)

## Make the ship fly!!!
#### terminal
- `yarn add keymaster`
#### Ship.js
- import `keymaster` into `Ship.js`
    ```js
    import key from 'keymaster'
    ```
- copy `move` from `MovingObject` so that it checks whether you are pressing `left` or `right` (or whichever buttons you like)
- if `left` or `right` are pressed during the `move` add or subtract a bit from the direction of the ship
- add an `getAcceleration` method which will return a `Vec2` pointed in the direction your ship is aiming if `up` is pressed. otherwise return a null vector (`{ x: 0, y: 0 }` but in a `Vec2`)
- modify `move` so that the acceleration returned by `getAcceleration` is added to `velocity`
#### finish up
- refresh your browser
- you should be able to turn your ship using `left` and `right` and accelerate by pressing `up`
- commit your work

## Make the ship wrap around the screen
#### MovingObject.js
- rewrite `outOfBounds` as `outOfBoundsDirection` so that it returns which direction you are out of bounds. this could be something like `N`, `E`, `S`, `W` or `+x`, `-x`, `+y`, `-y` or even an object with axis and direction
- add a `wrap` method which will move the ship to the oposite side of the stage if the `movingObject` is out of bounds
- call the `wrap` method at the end of the `move` method
#### finish up
- refresh your browser
- you should be able to fly your ship over the edge of the stage in any direction and have it appear on the other side
- commit your work

## Add Bullets!
#### Ship.js
- add a new method called `shoot` to `Ship` which returns a `MovingObject` starting at the front of your ship and moving away from it in the direction the ship is pointing. you may choose how fast...
#### Game.js
- add a new array called `bullets` to `this` in the `Game` constructor
- add a new method called `bindHandlers` which will bind the `space` key to a function which calls the ship's `shoot` method
- place the returned `MovingObject` from the `shoot` method into the `bullets` array
- make sure you do something with `bullets` in your `move`, `draw`, and `removeOutOfBounds` methods
#### finish up
- refresh your browser
- you should be able to press `space` and see bullets flying out of your ship (make sure they have cool color and aren't huge)
- commit your work

## Add Bullet/Asteroid collisions!
#### MovingObject.js
- add a new method called `isCollidedWith(otherMovingObject)` which will return `true` if the distance between the `position`s is less than the sum of their radii
#### Game.js
- add a new method called `checkCollisions` which will compare all the `bullets` with all of the `asteroids` and check whether or not they have collided, flag them if they have
- add a new method called `handleCollisions` which will filter the `bullets` and `asteroids` lists and remove the collided ones
- add `checkCollisions` and `handleCollisions` to `tick`
#### finish up
- refresh your browser
- you should be able to shoot asteroids, when the a bullet hits an asteroid, both should disappear
- commit your work

## Add Ship/Asteroid collisions (and the end of the game)!
#### Game.js
- in the `start` method, flag `this` as `running` (`this.running = true`)
- in your `tick` method, return early if the `running` flag is not `truthy`
- add a `stop` method which will turn off the `running` flag
- in `checkCollisions`, check whether or not any `asteroids` have collided with your ship, flag the ship if it was hit
- in `handleCollisions`, call `stop` if the ship was hit
#### finish up
- refresh your browser
- the game should stop when you run into an asteroid (you can make this fancier later)
- commit your work

## Make the Asteroids break up
#### MovingObject.js
- add a new method `handleCollision` which returns itself if it has not been hit, `undefined` if it has
#### Asteroid.js
- add a new class `Asteroid` which inherits from `MovingObject`
- in the `constructor` make sure you pass the arguments to `super` then add `this.generation = 1`
- add a new method `handleCollision` which will return 3 smaller `asteroids` flying away from the parent with their `generation` number incremented
- don't return anything from `handleCollision` if the `asteroid`'s `generation` is 3
#### Game.js
- modify `handleCollision` so that it will now iterate over all of the `asteroids` and `bullets` and call `handleCollision` on them. `flatten` and `compact` the returned objects back into `asteroids` and `bullets`
#### finish up
- refresh your browser
- asteroids should now break up into smaller asteroids when hit. third generation asteroids should just disappear
- commit your work

## Additional Ideas
#### Easy
- add points
- add a reset button for after the player dies

#### Medium
- give the player lives
- add sounds

#### Advanced
- add different types of obstacles
- add gravity wells
- change things to not use circles
- switch out the rendering side for something fancy like [three.js](https://threejs.org/)
