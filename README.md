# Step by Step ESNext Asteroids

## Goals
- teach a super basic game architecture
- introduce webpack
- introduce dev assistance tools (eslint, editorconfig, html-boilerplate)
- have fun :)

## Prep your project files:
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
- add your `<script>` tag at the bottom of the `<body>` tag (`type="module"` will be necessary)
    ```html
    <script type="module" src="js/index.js"></script>
    ```
- populate the `<title>` with a name
#### terminal
- initialize your package.json: `npm init -y`
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
#### index.html
- add this `canvas` element to the body of your html
  ```html
  <canvas id="canvas-stage" width="500" height="500"></canvas>
  ```
#### app.css
- add css so that the `canvas` is 500x500 pixels, has a `2px` border, and is centered on the screen
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
#### terminal
- `mkdir -p js/utility`
- `touch js/utility/Canvas.js`
#### Canvas.js
- the following javascript is a very simple utility for drawing a circle on the canvas
- add it to the new `Canvas.js` file:
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
#### index.js
- change your `js/index.js` file to import the `Canvas` utility and draw a circle in the middle of your canvas
    ```js
    import Canvas from '/js/utility/Canvas.js'

    Canvas.drawCircle({ x: 250, y: 250, radius: 20})
    ```
#### finish up
- refresh your browser
- you should see your square canvas in the center of the browser with a white border
- you should see a circle in the middle of the stage
- commit your work


## Get your circle moving: (less handholdy)
#### terminal
- `mkdir js/classes`
- `touch js/classes/MovingObject.js`
#### MovingOjbect.js
- declare a new class `MovingObject` with three functions: `constructor`, `move`, and `draw`
    ```js
    export default class MovingObject {
        constructor() {}

        move() {}

        draw() {}
    }
    ```
- inside the `constructor` add a `position` and `velocity` to the new `movingObject`
    - the `position` and `velocity` should be objects with `x` and `y` properties (I will refer to this type of object as a vector from now on)
    - put the position in the center of the screen
    - the velocity will be `pixels / frame` so keep the numbers small but non-zero (1 is fine)
- the `move` should modify the `position` by adding the `velocity` to the `position`
- the draw command should use `Canvas.drawCircle` from the previous section
#### index.js
- rewrite `index.js` to create a `MovingObject` and use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to get things going:
    ```js
    import MovingObject from '/js/classes/MovingObject.js'

    const { requestAnimationFrame } = window

    const movingObject = new MovingObject()

    function tick() {
        movingObject.move()
        movingObject.draw()
        requestAnimationFrame(tick)
    }

    tick()
    ```
#### Make a circle move instead of a line
- return to your `Canvas` file and add a `clear` function
- the clear function is going to look something like this `context.clearRect(0, 0, 1e9, 1e9)`
- add `Canvas.clear()` to the beginning of your `tick` function in `index.js`
#### finish up
- refresh the browser
- you should see a circle moving across the canvas
- commit your work


## Make several circles fly around
#### MovingObject.js
- modify the `constructor` of `MovingObject` to take the `position` and `velocity` as arguments
- create a `static` function attached to `MovingObject` called `createRandom` this function should generate a random `position` and `velocity` and return a new `MovingObject` with those applied.
#### Game.js
- add a new `Game` class at `js/classes/Game.js`
- give the game class `constructor`, `move`, `draw`, `tick`, and `start` methods
- the constructor should add an `asteroids` array to `this` which is populated with a bunch of `MovingObject`s
- the `move` method should call `move` on every `asteroid`
- the `draw` method should call `draw` on every `asteroid`
- the `tick` method should call `Canvas.clear`, `move`, and `draw` from `Game` and use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to keep itself going
#### index.js
- remove everything in `index.js`
- create a new `Game` and call `tick` on it to get things started
#### finish up
- refresh your browser
- several of asteroids should be flying around
- they should start at different directions
- they should be flying in different directions
- they should be flying at different speeds
- commit your work


## [Interlude] Add in a linter
#### terminal
- install [eslint](https://eslint.org/) into your `node_modules` as a dev dependency: `yarn add -D eslint babel-eslint eslint-plugin-babel`
#### .eslintrc.js
- copy this [.eslintrc.js](https://github.com/jonathan-potter/es6-asteroids/blob/master/.eslintrc.js) file into your root directory
#### text editor
- install the `eslint` plugin into your text editor
#### package.js
- add `"lint": "eslint js/"` to your `package.json` `scripts` section
#### note
- feel free to change any of the rules in the `.eslintrc.js` at any time to fit your desired style (DO NOT DO THIS IN A TEAM SETTING WITHOUT TALKING TO YOUR TEAM)
#### finish up
- you should see typos or rules violations highlighted in your text editor
- if you don't see any highlighted sections, add some typos to make sure this is working
- run `yarn lint --fix` to make all of your code nice and consistent
- commit your work


## Maintain a minimum number of asteroids flying around
#### MovingObject.js
- add an `outOfBounds` method to `MovingObject` which will return `true` if the movingObject is out of bounds (keep the radius in mind)
#### Game.js
- add a constant `MIN_ASTEROIDS` to the top of the file (after imports) give it a big number
- add two methods `removeOutOfBounds` and `repopulateAsteroids`
- `removeOutOfBounds` should filter `outOfBounds` asteroids out of the asteroids list
- the `repopulateAsteroids` will fill up the asteroids list with new asteroids
- call the functions in `tick`
- change the constructor so it only initializes the `asteroids` as an empty array
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
- you should not see any pop into existence in the middle of the stage
- commit your work


## [Interlude] Fix the favicon error
#### browser
- download this [favicon.ico](https://github.com/jonathan-potter/step-by-step-esnext-asteroids/blob/master/favicon.ico)
#### text editor
- add it to your root directory
#### finish up
- refresh your browser
- you should see your new favicon in the browser tab
- the favicon error in your console should be gone
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
#### finish up
- refresh your browser
- you should see your ship sitting in the middle of the stage
- commit your work


## [Interlude] Add [Webpack](https://webpack.js.org/guides/getting-started/)
#### terminal
- `yarn add -D webpack webpack-cli webpack-dev-server`
#### browser
- download the following file: [webpack.config.js](https://github.com/jonathan-potter/step-by-step-esnext-asteroids/blob/master/webpack.config.js) and place it in the project root directory
#### package.json
- change the `start` script to `webpack-dev-server`
#### index.html
- change the `src` for the `script` tag to `"build/bundle.js"`
#### /js/*
- remove `"/js/"` from the beginning from all of the `import` statements in your javascript files


## Make the ship fly!!!
#### terminal
- `yarn add keymaster`
#### Ship.js
- import [keymaster](https://www.npmjs.com/package/keymaster) into `Ship.js`
    ```js
    import key from 'keymaster'
    ```
- copy `move` from `MovingObject`
- modify `move` so that it checks whether you are pressing `left` or `right` [(take a look at keymaster docs)](https://www.npmjs.com/package/keymaster)
- if `left` or `right` are pressed during the `move` add or subtract a bit from the direction of the ship
- add an `getAcceleration` method which will return a `vector` pointed in the direction your ship is aiming if `up` is pressed. otherwise return a null vector (`{ x: 0, y: 0 }`)
- modify `move` so that the acceleration returned by `getAcceleration` is added to `velocity`
#### finish up
- refresh your browser
- you should be able to turn your ship using `left` and `right` and accelerate by pressing `up`
- commit your work


## Make the ship wrap around the screen
#### MovingObject.js
- add a new function`outOfBoundsDirection` that returns which direction you are out of bounds. this could be something like `N`, `E`, `S`, `W` or `+x`, `-x`, `+y`, `-y`
- rewrite `outOfBounds` so that it is just a boolean alias of `outOfBoundsDirection`
- add a `wrap` method which will move the ship to the opposite side of the stage if the `movingObject` is out of bounds
#### Ship.js
- call the `wrap` method at the end of the `move` method
#### finish up
- refresh your browser
- you should be able to fly your ship over the edge of the stage in any direction and have it appear on the other side
- commit your work


## [refactor] Create Vec2 class
#### terminal
- `touch js/classes/Vec2.js`
#### Vec2.js
- add the following code to your new `Vec2.js` file
    ```js
    export default class Vec2 {
        constructor ({ x = 0, y = 0 }) {
            this.x = x
            this.y = y
        }

        add (vector) {
            return new Vec2({
                x: this.x + vector.x,
                y: this.y + vector.y,
            })
        }
    }
    ```
#### MovingObject.js and wherever you set the position and velocity of the ship
- change the `position` and `velocity` used to create new `MovingObject`s and the ship
#### MovingObject.js and Ship.js
- modify `move` so that the vector additions now use `Vec2#add`
#### finish up
- refresh your browser
- everything should still work the same way in the browser
- we now get to use `Vec2`s!
- commit your work

## Add Bullets!
#### Ship.js
- add a new method called `shoot` to `Ship` which returns a `MovingObject` starting at the front of your ship and moving away from it in the direction the ship is pointing. you may choose how fast...
#### Game.js
- add a new array called `bullets` to `this` in the `Game` constructor
- add a new method called `bindHandlers` which will bind the `space` key to a function which calls the ship's `shoot` method
- place the returned `MovingObject` from the `shoot` method into the `bullets` array
- make sure you do something with `bullets` in your `move`, `draw`, and `removeOutOfBounds` methods
#### note
- you may need to modify some other stuff if you want to change the color of the bullets
#### finish up
- refresh your browser
- you should be able to press `space` and see bullets flying out of your ship (make sure they have cool color and aren't huge)
- commit your work


## Add Bullet/Asteroid collisions!
#### Vec2.js
- add a static function `distance` which will return the distance between two given vectors (which can be thought of a coordinates here)
- you may find it easiest to do this by adding other new method(s) to `Vec2`
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
- add a `start` method, flag `this` as `running` (`this.running = true`)
- in your `tick` method, return early if the `running` flag is not `truthy`
- add a `stop` method which will turn off the `running` flag
- in `checkCollisions`, check whether or not any `asteroids` have collided with your ship, flag the ship if it was hit
- in `handleCollisions`, call `stop` if the ship was hit
#### note
- this may be a good time to revisit your bullet speed, asteroid max speed, number of asteroids, etc...
#### finish up
- refresh your browser
- the game should stop when you run into an asteroid (you can make this fancier later)
- commit your work


## Make the Asteroids break up
#### MovingObject.js
- add a new method `handleCollision` which returns itself if it has not been hit, `undefined` if it has
#### Asteroid.js
- add a new class `Asteroid` which inherits from `MovingObject`
- in the `constructor` make sure you pass the arguments to `super`
- pass a `generation` integer (default to 1) to the the `constructor` and add it to `this`
- override `handleCollision` from `MovingObject`. The `Asteroid` version should return 3 smaller `asteroids` flying away from the parent with their `generation` number incremented
- don't return anything from `handleCollision` if the `asteroid`'s `generation` is 3
- move the static functions from `MovingObject` into `Asteroid` and fix them up so they return `Asteroid`s
#### terminal
- `yarn add lodash`
#### Game.js
- change `MovingObject.createRandom...` to the new `Asteroid` version
- modify `handleCollision` so that it will now iterate over all of the `asteroids` and `bullets` and call `handleCollision` on them.
- use `flatten` and `compact` from `lodash` to clean up the returned arrays
#### finish up
- refresh your browser
- asteroids should now break up into smaller asteroids when hit. third generation asteroids should just disappear
- commit your work


## Deploy it so you can show off!
#### Github
- create a repository if you have not already
- push your code
#### package.json
- add a `build` script which calls `"webpack"` to the `scripts` section
#### terminal
- run the following:
    ```sh
    git checkout -b gh-pages
    yarn build
    git add .
    git commit -m "deployment"
    git push
    ```


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
