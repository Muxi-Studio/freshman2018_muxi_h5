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
    
    prePosition = curPosition;
}

function touchStart(event){
    let finger = event.touches[0];

    //保证只执行一次
    if(!preY)
        currentY = preY = finger.pageY;
}

function touchMove(event){
    let finger = event.touches[0];

    currentY = finger.pageY;

    let moveY = currentY - preY,
        imageX = image.style.transform.match(patt)[1];
        
    console.log(currentY, preY)
    image.style.transform = "translate(" + parseInt(imageX - moveY) + "px, 0)";
    image.style.webkitTransform = "translate(" + parseInt(imageX - moveY) + "px, 0)";

    birdMove(moveY / moveWidth);

    preY = currentY;
}

// 配置位移矢量 一共走100步
const STEP = 100;
let curStep = 0;

const path = document.getElementById('motionPath');
const bird = document.getElementById('crayImg');
const image = document.getElementsByTagName('img')[0];
image.style.transform = "translate(0, 0)";

// 最重要的两个属性  获取长度，以及每个点的坐标
const totalLength = path.getTotalLength();
const initPosition = path.getPointAtLength(0);

//正则匹配，获取偏移
const patt = new RegExp(/translate\(-?(\d+)(?:px)/,"i");

//背景图片长度，鸟坐标位置记录，当前移动的路径长度
const moveWidth = image.width - window.innerWidth;
let prePosition = initPosition;
let curPosition = initPosition;
let movedLength = 0;

// 定位bird 
bird.style.left = initPosition.x + 'px';
bird.style.top = initPosition.y + 'px';
const birdVector = new vector(-1, 0);

//手指触点位置
let preY, currentY;

document.addEventListener('touchstart', touchStart);
document.addEventListener('touchmove', touchMove);