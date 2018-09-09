import "./index.css";

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

// 控制前进
function birdMove(proportion) {
    movedLength += totalLength * proportion;
    curPosition = path.getPointAtLength(movedLength);

    let vector2 = new vector(curPosition.x - prePosition.x, curPosition.y - prePosition.y);
     
    bird.style.left = curPosition.x + 'px';
    bird.style.top = curPosition.y + 'px';

    //  如果小于0，顺时针旋转(朝上)
    if(curPosition.y - prePosition.y < 0)
        bird.style.webkitTransform = 'rotate('+ birdVector.calcuAngle(vector2) +'deg)';
    //  如果大于0，逆时针旋转(朝下)
    else
        bird.style.webkitTransform = 'rotate('+ -1 * birdVector.calcuAngle(vector2) +'deg)';
    
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

    event.target.addEventListener('touchmove', touchMove, false);
    event.target.addEventListener('touchcancel', touchCancel, false);
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
            imageX = image.style.transform.match(patt)[1],
            trans;

        if((moveY < 0 && parseInt(imageX) === 0) || (moveY > 0 && !(parseInt(imageX) > -moveWidth)))
            return false;

        birdMove(moveY / moveWidth);

        preY = currentY;

        if(imageX - moveY > 0)
            trans = 0;

        else if(!(moveY - imageX < moveWidth))
            trans = -moveWidth;

        else
            trans = parseInt(imageX - moveY);

        image.style.transform = "translate(" + trans + "px, 0)";
        image.style.webkitTransform = "translate(" + trans + "px, 0)";
    })

    event.preventDefault();
}

function touchCancel(event){
    if(event.touches[1]){
        window.event.preventDefault();
        return false;
    }

    let finger = event.touches[0];

    preY = currentY = finger.pageY;
}

//正则匹配，获取偏移
const patt = new RegExp(/translate\((-?\d+)(?:px)/,"i");
//固定水平向量
const birdVector = new vector(-1, 0);

//获取路径长度，以及初始路径坐标
let totalLength, initPosition;

//获取路径点坐标，标记已移动距离
let prePosition, curPosition;
let movedLength = 0;

let path, bird, image, moveWidth;
//手指触点位置
let preY, currentY;

window.onload = () => {
    path = document.getElementById('motionPath');
    bird = document.getElementById('crayImg');
    image = document.getElementsByTagName('img')[0];

    image.style.transform = "translate(0, 0)";
    moveWidth = image.width - window.innerWidth;

    totalLength = path.getTotalLength(); 
    initPosition = path.getPointAtLength(0);
    curPosition = prePosition = new vector(initPosition.x, initPosition.y);

    // 定位bird 
    bird.style.left = curPosition.x + 'px';
    bird.style.top = curPosition.y + 'px';

    document.addEventListener('touchstart', touchStart, false);
}
