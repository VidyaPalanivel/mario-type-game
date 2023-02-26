const platformImageSrc = './assets/platform.jpg'
const backgroundImageSrc = './assets/background.jpg'
const bridgeImageSrc = './assets/bridge.jpg'
const sprite = './assets/sprite.png'
const spriteLeft = './assets/sprite-left.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
const gravity = 1.5
const temporaryEnd = 2380

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 150
        this.height = 150
        this.speed = 10
        this.image = createImage(sprite)
        this.sprites = {
            run: {
                right: createImage(sprite),
                left: createImage(spriteLeft)
            }
        }
        this.defaultSprite = this.sprites.run.right
    }
    draw() {
        c.drawImage(this.defaultSprite, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity

    }

}
class Platform {
    constructor({
        x,
        y,
        image
    }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height

    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

}
class GenericObject {
    constructor({
        x,
        y,
        image
    }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height

    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

}
//Specific image created from src url
function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformImage = createImage(platformImageSrc)
let bridge = createImage(bridgeImageSrc)
let background = createImage(backgroundImageSrc)

let player = new Player()
let platforms = []
let genericObjects = []
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }

}

let scrollOffset
function init() {

    scrollOffset = 0
    platformImage = createImage(platformImageSrc)

    player = new Player()
    platforms = [
        new Platform({
            x: platformImage.width * 4 + 970,
            y: 290,
            image: bridge
        }),
        new Platform({
            x: platformImage.width + 165,
            y: 290,
            image: bridge
        }),
        ,
        new Platform({
            x: 0,
            y: 490,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 2 + 100,
            y: 490,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 2 + 100,
            y: 490,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 3 + 300,
            y: 490,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 4 + 500 - 2,
            y: 490,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 5 + 900 - 2,
            y: 490,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width * 5 + 1600 - 2,
            y: 490,
            image: platformImage
        })
    ]

    genericObjects = [new GenericObject({
            x: 0,
            y: 0,
            image: background
        }),
        new GenericObject({
            x: background.width,
            y: 0,
            image: background
        }),
        new GenericObject({
            x: background.width,
            y: 0,
            image: background
        }),
        new GenericObject({
            x: background.width,
            y: 0,
            image: background
        })
    ]
}

function animate() {
    requestAnimationFrame(animate)
    //c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach((genericObject) => {
        genericObject.draw()
    })

    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400)
        player.velocity.x = player.speed
    else if (keys.left.pressed && player.position.x > 100 || keys.left.pressed && scrollOffset == 0 && player.position.x > 0)
        player.velocity.x = -player.speed
    else {
        player.velocity.x = 0
        if (keys.right.pressed && scrollOffset < platformImage.width * 5 + 900 - 116) {
            scrollOffset += player.speed
            
                platforms.forEach((platform) => {
                    platform.position.x -= player.speed
                })

            if(scrollOffset < temporaryEnd)
            {
                genericObjects.forEach((genericObject) => {
                    genericObject.position.x -= player.speed * 0.65
                })
            }
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            genericObjects.forEach((genericObject) => {
                genericObject.position.x += player.speed * 0.65
            })
        }

    }


    //platform collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width)
            player.velocity.y = 0
    })

    //Winning scenario
    if (scrollOffset > platformImage.width * 5 + 900 - 116)
        console.log('won')

    //Game End
    if (player.position.y > canvas.height) {
        init()
    }
}
init()
animate()

//Included for player movements
addEventListener('keydown', ({
    keyCode
}) => {
    switch (keyCode) {
        case 65:
        case 37:
            keys.left.pressed = true
            player.defaultSprite = player.sprites.run.left
            console.log(scrollOffset)
            break

        case 83:
        case 40:
            console.log('down')
            break

        case 68:
        case 39:
            keys.right.pressed = true
            player.defaultSprite = player.sprites.run.right
            break

        case 87:
        case 38:
            player.velocity.y -= 30
            break
    }
})

addEventListener('keyup', ({
    keyCode
}) => {
    switch (keyCode) {
        case 65:
        case 37:
            keys.left.pressed = false
            break

        case 83:
        case 40:
            console.log('down')
            break

        case 68:
        case 39:
            keys.right.pressed = false
            break

        case 87:
        case 38:
            break
    }
})