import backgroundImage from "../static/background.png";
import './move.css';

//正则匹配，获取偏移
const patt = new RegExp(/translate\((-?\d+)(?:px)/,"i");

let moveImage, moveWidth;

//手指触点位置
let preY, currentY;

window.onload = () => {
    const btn = document.getElementsByClassName('continueBtn')[0];
    const image = document.getElementById('backgroundImg');
    const contain = document.getElementById('contain');
    const lights = document.getElementsByClassName('light');
    const groupIntro = document.getElementsByClassName('groupIntro'); 
    for(let light of lights){
        light.onclick = () => {
            document.addEventListener('click',(e) => {
                console.log(e.target)
                console.log(light)
                let src = light.previousElementSibling.src,
                    index1 = src.lastIndexOf('.'),
                    index2 = src.lastIndexOf('/');

                if(e.target === light){
                    if(src[index1 - 1] === '2')
                        return;
                    src = src.slice(0, index1) + '2' + src.slice(index1);
                    light.previousElementSibling.src = src;
                    contain.style.zIndex = 10;
                    light.classList.add('lightBig');
                    groupIntro[0].style.zIndex = 10;
                    setTimeout(() => {
                        contain.style.zIndex = 1;
                    }, 2000);
                }
                else{
                    if(src[index1 - 1] === '2')
                        src = src.slice(0, index1 - 1) + src.slice(index1);
                    
                    light.previousElementSibling.src = src;
                    light.classList.remove('lightBig');
                    groupIntro[0].style.zIndex = 1;
                }
            })
        }
    }
    const intro = document.getElementsByClassName('introduce')[0];
    moveImage = document.getElementById('contain');

    btn.onclick = () => {
        image.classList.add('perspect');
        intro.classList.add('introClear');
        btn.style.display = "none";

        setTimeout(() => {
            image.classList.remove('center', 'perspect');
            
            image.src = backgroundImage;
            // image.src = "./static/background.png";
            image.style.zIndex = -1;
            moveImage.style.transform = "translate(0, 0)";
            moveImage.style.webkitTransform = "translate(0, 0)";

            image.onload = () => {
                moveWidth = image.width - window.innerWidth;
        
                document.addEventListener('touchstart', touchStart, {passive: false});
            }
        }, 3000);
    }
}

function touchStart(event){
    /* 禁止浏览器缩放 */
    if(event.touches[1]){
        window.event.preventDefault();
        return false;
    }

    let finger = event.touches[0];

    currentY = preY = finger.pageY;

    event.target.addEventListener('touchmove', touchMove, {passive: false});
    event.target.addEventListener('touchend', touchEnd, {passive: false});
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
            trans;
        if((moveY < 0 && parseInt(moveImageX) === 0) || (moveY > 0 && (-parseInt(moveImageX) >= moveWidth)))
            return false;
        preY = currentY;

        if(moveImageX - moveY > 0)
            trans = 0;

        else if(!(moveY - moveImageX < moveWidth))
            trans = -moveWidth;

        else
            trans = parseInt(moveImageX - moveY);

        moveImage.style.transform = "translate(" + trans + "px, 0)";
        moveImage.style.webkitTransform = "translate(" + trans + "px, 0)";
    })

    event.preventDefault();
}

function touchEnd(event){
    preY = currentY;
}