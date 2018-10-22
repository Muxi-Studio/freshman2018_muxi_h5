/*
背景子元素position: absolute;相对于背景定位，所以只需translate背景即可
用vh，vw定义子元素大小，忽略不同屏幕的影响
*/
// import backgroundImage from "../static/background.png";
// import './move.css';

//自定义向量构造函数
class vector{
    constructor(x ,y){
        this.x = x;
        this.y = y;
        this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    calcuAngle(vector2){
        return  Math.acos((this.x * vector2.x + this.y * vector2.y) / (this.length * vector2.length)) / Math.PI * 180;
    }
}

//正则匹配，获取偏移
const patt = new RegExp(/translate\((-?\d+)(?:px)/,"i");

//固定水平向量
const birdVector = new vector(-1, 0);

//房屋、鸟大小
const houseWidth = window.innerWidth * 0.1;
const birdWidth = 50;

//获取路径长度，以及初始路径坐标
let totalLength, initPosition;

//获取路径点坐标、房屋坐标，标记已移动距离
let prePosition, curPosition;
let houseLeft;
let movedLength = 0;

let path, bird, moveImage, moveWidth, houses;
//手指触点位置
let preY, currentY;

window.onload = () => {
    let span = document.getElementsByTagName('span')[0];
    span.onclick = () => {
        let image = document.getElementsByTagName('img')[0];
        path = document.getElementById('motionPath');
        bird = document.getElementById('crayImg');
        moveImage = document.getElementsByClassName('contain')[0];
        houses = Array.from(document.getElementsByClassName('House'));

        totalLength = path.getTotalLength(); 
        initPosition = path.getPointAtLength(0);
        curPosition = prePosition = new vector(initPosition.x, initPosition.y);

        image.classList.remove('center');
        // img.src = backgroundImage;
        image.src = "./static/background.png";
        image.style.zIndex = -1;
        moveImage.style.transform = "translate(0, 0)";
        moveImage.style.webkitTransform = "translate(0, 0)";
        span.style.display = "none";
        bird.style.zIndex = 1;
        bird.style.left = curPosition.x + 'px';
        bird.style.top = curPosition.y + 'px';
        if(birdVector.x === -1)
            bird.style.transform = "scaleX(-1)";

        image.onload = ()=>{
            moveWidth = image.width - window.innerWidth;
            houseLeft = getHouseLeft();

            document.addEventListener('touchstart', touchStart, {passive: true});
        }
    }
}

// 控制前进
function birdMove(proportion) {
    movedLength += totalLength * proportion;
    curPosition = path.getPointAtLength(movedLength);

    let vector2 = new vector(curPosition.x - prePosition.x, curPosition.y - prePosition.y);
     
    bird.style.left = curPosition.x + 'px';
    bird.style.top = curPosition.y + 'px';

    if(proportion > 0){
        //  如果小于0，顺时针旋转(朝上)
        if(curPosition.y - prePosition.y < 0)
            bird.style.webkitTransform = 'rotate('+ -birdVector.x * birdVector.calcuAngle(vector2) + 'deg) scaleY('+ birdVector.x +')';
        //  如果大于0，逆时针旋转(朝下)
        else
            bird.style.webkitTransform = 'rotate('+ birdVector.x * birdVector.calcuAngle(vector2) + 'deg) scaleY('+ birdVector.x +')';
    }
    else{
        //  如果小于0，顺时针旋转(朝上)
        if(curPosition.y - prePosition.y < 0)
            bird.style.webkitTransform = 'rotate('+ -birdVector.x * birdVector.calcuAngle(vector2) + 'deg) scaleY('+ -birdVector.x +')';
        //  如果大于0，逆时针旋转(朝下)
        else
            bird.style.webkitTransform = 'rotate('+ birdVector.x * birdVector.calcuAngle(vector2) + 'deg) scaleY('+ -birdVector.x +')';
    }
    
    prePosition = new vector(curPosition.x, curPosition.y);
}

function touchStart(event){
    /* 禁止浏览器缩放 */
    if(event.touches[1]){
        window.event.preventDefault();
        return false;
    }

    let finger = event.touches[0];

    currentY = preY = finger.pageY;

    event.target.addEventListener('touchmove', touchMove, {passive: true});
    event.target.addEventListener('touchend', touchEnd, {passive: true});
}

function touchMove(event){
    if(event.touches[1]){
        window.event.preventDefault();
        return false;
    }

    let finger = event.touches[0];

    window.requestAnimationFrame(()=>{
        currentY = finger.pageY;

        let moveY = currentY - preY,
            moveImageX = moveImage.style.transform.match(patt)[1],
            birdOffset = bird.offsetLeft + moveImageX,
            trans;
        if((moveY < 0 && parseInt(moveImageX) === 0) || (moveY > 0 && (-parseInt(moveImageX) >= moveWidth)))
            return false;
            
        birdMove(moveY / moveWidth);

        preY = currentY;

        if(moveImageX - moveY > 0)
            trans = 0;

        else if(!(moveY - moveImageX < moveWidth))
            trans = -moveWidth;

        else
            trans = parseInt(moveImageX - moveY);

        moveImage.style.transform = "translate(" + trans + "px, 0)";
        moveImage.style.webkitTransform = "translate(" + trans + "px, 0)";
        
        houseLeft.map((house, index) => {
            let src = houses[index].src,
                i = src.lastIndexOf('.');
            /* transform对offsetLeft无影响 */
            if((-trans + bird.offsetLeft >= house) && (-trans + bird.offsetLeft <= house + houseWidth)){
                if(src[i - 1] === '2')
                    return;
                src = src.slice(0, i) + '2' + src.slice(i); 
                houses[index].src = src;
            }
            else{
                if(src[i - 1] !== '2')
                    return;
                src = src.slice(0, i - 1) + src.slice(i);
                houses[index].src = src;
            }
        })
    })
}

function touchEnd(event){
    if(event.touches[1]){
        window.event.preventDefault();
        return false;
    }

    preY = currentY;
    console.log('bird: '+bird.offsetLeft)
    console.log('house1: '+houses[1].offsetLeft)
}

function getHouseLeft(){
    let arr = [],
        len = houses.length;
    
    for(let i = 0;i < len;i++){
        arr.push(parseFloat(getComputedStyle(houses[i]).left))
    }

    return arr;
}