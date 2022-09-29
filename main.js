//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas)

let backgroundImage,spaceImage,bulletImage,enemyImag,gameoverImage;
let gameOver=false // true이면 게임이 끝남
let score=0

// 우주선 좌표
let spaceX = canvas.width/2-32
let spaceY = canvas.height-58

let bulletList = [] // 총알들을 저장하는 리스트
// 총알 
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init=function(){
        this.x=spaceX+19;
        this.y=spaceY;
        this.alive=true // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 3;
    };

    this.checkHit = function(){
// 총알.y <= 적군.y And
// 총알.x >= 적국.x and 총알.x <= 적군.x +적군의 넓이
        for(let i=0; i < enemyList.length;i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 58){
                score++; //총알이 죽기됨 적군의 우주선이 없어짐, 점수 획득
                this.alive = false //죽은 총알
                enemyList.splice(i,1)
            }
        }
    }
}

function generateRandomValue(min,max){
    let ranadomNum = Math.floor(Math.random() * (max - min + 1)) + min
    return ranadomNum
}

let enemyList = []
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0
        this.x = generateRandomValue(0,canvas.width - 58)
        enemyList.push(this);
    }
    this.update = function(){
        this.y += 1; // 적군 속도 조절

        if(this.y >= canvas.height - 58){
            gameOver = true;
        }
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src ="별-폭발.gif";

    spaceImage = new Image();
    spaceImage.src ="icons8-space-shuttle-58.png";

    bulletImage = new Image();
    bulletImage.src ="icons8-bullet-24.png";

    enemyImag = new Image();
    enemyImag.src ="icons8-42-space-capsule-58.png";

    gameoverImage = new Image();
    gameoverImage.src ="icons8-game-over-64.png";
}

let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode]

        if(event.keyCode == 32){
            createBullet() // 총알 생성
        }
    });
}

function createBullet(){
    console.log("총알");
    let b = new Bullet() // 총알 하나 생성
    b.init();
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },1000)
}

function update(){
    if (39 in keysDown){
        spaceX += 2; // 우주선의 속도
    } // 오른쪽

    if(37 in keysDown){
        spaceX -= 2;
    } // 왼쪽

    if(spaceX <=0){
        spaceX=0
    }
    if(spaceX >= canvas.width - 58)
    {
        spaceX=canvas.width - 58
    }
    // 우주선의 좌표값이 무한대로 없데이가 되는게 아닌 경기장 안에서만 있게하려면
    
    // 총알의 y좌표 업데이트하는 함수 호출
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    
    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceImage, spaceX, spaceY);
    ctx.fillText('score:'+ score, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial"
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive) {
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
        }
    }
    
    for(let i=0;i<enemyList.length;i++){
        ctx.drawImage(enemyImag,enemyList[i].x,enemyList[i].y);
    }
}

function main(){
    if(!gameOver){
        update(); // 좌표값을 없데이트하고
        render(); //그려주고
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImage,10,100,380,380);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
