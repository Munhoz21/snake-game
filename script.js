const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d') //metodo do canvas

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")


const audio = new Audio ('./assets/vine-boom.mp3')
const audio2 = new Audio ('./assets/bob-sound.mp3')
audio2.loop = false

const size = 30;

const initialPosition =[
    { x: 270, y: 240},
    { x: 300, y: 240},
    { x: 330, y: 240},
    
]

let  snake = [
    { x: 270, y: 240},
    { x: 300, y: 240},
    { x: 330, y: 240}
]

const incrementScore = () =>{
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) =>{
    return Math.round(Math.random() * (max- min) + min) 
}

const randomPosition = () =>{
    const number = randomNumber(0,canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () =>{
    const red = randomNumber (0,255);
    const green = randomNumber(0,255)
    const blue = randomNumber (0,255)

    return `rgb(${red}, ${green}, ${blue})`
}


const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}


let direction, loopId

const drawFood = () =>{

    const {x, y, color} = food

    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "green"

    snake.forEach((position, index)=>{

        if(index == snake.length - 1){
            ctx.fillStyle = "#384d27"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () =>{

    if(!direction) return

    const head = snake[snake.length -1] // var para definir a cabeça da snake


    if(direction == "right"){
            snake.push({x: head.x + size, y: head.y}) //se a direção for direita, o eixo y permance igual, porem o x sera acrescentado um quadrado
    } if(direction == "left"){
        snake.push({x: head.x - size, y:head.y }) // se for esquerda = y igual, x diminui
    } if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    } if(direction == "up"){
        snake.push({x: head.x , y:head.y - size })
    }

    snake.shift()
}

const drawnGrid = () =>{
    ctx. lineWidth = 1
    ctx.strokeStyle = "#191919"


    for(let i= 30; i < canvas.width; i += 30){

        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()

    }


}

drawnGrid();


const checkEat = () =>{
    const head = snake[snake.length -1]

    if (head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)

        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position)=> position.x ==x && position.y == y)){
            x = randomPosition()
            y = randomPosition();
        }

        food.x =x
        food.y = y
    }
}

const checkColision = () =>{
    const head = snake[snake.length -1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 ||  head.y > canvasLimit
    const selCollision = snake.find((position, index) =>{
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selCollision){
        gameOver()
    
    }
}

const gameOver = () =>{
    direction = undefined

    menu.style.display = "flex"
    canvas.style.filter = "blur(2px)"
    finalScore.innerText = score.innerText
    audio2.play()
}


const gameLoop = () =>{

    clearInterval(loopId)


    ctx.clearRect(0,0,600,600)

    drawFood();
    drawnGrid();
    moveSnake();
    drawSnake();
    checkEat()
    checkColision()



   loopId =  setTimeout(() => {
        gameLoop()
    }, 200);
}

gameLoop();

document.addEventListener('keydown', ({key})=>{
    if(key == "ArrowRight" && direction != "left"){
        direction = 'right'
    }

    if(key == "ArrowLeft" && direction != "right"){
        direction = 'left'
    } 

    if(key == "ArrowUp" && direction != "down"){
        direction = 'up'
    }

    if(key == "ArrowDown" && direction != "up"){
        direction = 'down'
    }
})


buttonPlay.addEventListener('click', ()=>{
        score.innerText = "00"
        menu.style.display = "none"
        canvas.style.filter = "none"

        snake = initialPosition;

})