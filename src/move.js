'use strict';
import './move.css';

//正则匹配，获取偏移
const movePatt = new RegExp(/translateX\((-?(?:\d+(?:\.\d+)?))(?:px)\)/, "i");
const groupIntroduce = new Map([
    ['productLight' , "做产品这部大戏里的导演+编剧，把控产品方向，跟进产品开发和后续迭代，凭借对互联网领域的敏锐感，用灵感和理性为用户需求创造产品<br/><br/>技能：xmind，Axure，墨刀"],
    ['designLight'  ,  "Adobe公司的忠实用户，用专业的技术支持和天马行空的想象力将互联网产品变成一场视觉盛宴。<br/><br/>技能：PS，AI，AE"],
    ['backendLight' , "面对海量的数据冷静分析处理的逻辑界领袖，致力于解决服务器运维中的各种难题。<br/><br/>技能：Python，Go"],
    ['androidLight' , "基于android系统的搞事情小分队，开发App，做自己的App Store。<br/><br/>技能：Java，Kotlin"],    
    ['frontendLight', "浏览器里神奇的画笔，用代码实现良好的网页和丰富的交互方式。<br/><br/>技能：HTML，CSS，JavaScript"],    
]);
const logoMove = new Map([
    ['productLogo' , 0],
    ['designLogo'  , -0.981],
    ['backendLogo' , -3],
    ['androidLogo' , -1.992],
    ['frontendLogo', -4.115],
]);

let moveImage, moveWidth;
let productWindow, backendDoor, backendWindow, androidWindow, designDoor, designCat, frontendWindow1, frontendWindow2;

//手指触点位置
let preY, currentY;

window.onload = () => {
    if(!quit()){
        return;
    }

    const continueBtn = document.getElementById('continueBtn'),
          image = document.getElementById('backgroundImg'),
          loadingImg = document.getElementById('loadingImg'),
          audioBtn = document.getElementById('audioBtn'),
          audioPlay = document.getElementById('audioPlay'),
          lights = document.getElementsByClassName('light'),
          groupIntro = document.getElementById('groupIntro'),
          intro = document.getElementsByClassName('introduce')[0],
          leadTowardsRight = document.getElementById('leadTowardsRight'),
          groupLogo = document.getElementsByClassName('groupLogo');
    moveImage = document.getElementById('contain');
    productWindow = document.getElementById("productWindow");
    backendDoor = document.getElementById("backendDoor");
    backendWindow = document.getElementById("backendWindow");
    androidWindow = document.getElementById("androidWindow");
    designDoor = document.getElementById("designDoor");
    designCat = document.getElementById("designCat");
    frontendWindow1 = document.getElementById("frontendWindow1");
    frontendWindow2 = document.getElementById("frontendWindow2");

    for(let light of lights){
        //标记异步，及时清除，防止累积
        let obj = {flag: 0};
        light.onclick = () => {
            document.addEventListener('click',(e) => {
                if(obj.flag){
                    clearTimeout(obj.flag);
                }

                if(e.target === light){
                    // if(src[index1 - 1] === '2')
                    //     return;
                    // src = src.slice(0, index1) + '2' + src.slice(index1);
                    // light.previousElementSibling.src = src;
                    dealLight(light, groupIntro, obj);
                }
                else{
                    // if(src[index1 - 1] === '2')
                    //     src = src.slice(0, index1 - 1) + src.slice(index1);
                    
                    // light.previousElementSibling.src = src;
                    recoverLight(light);
                    // groupIntro.style.zIndex = 1;
                }
            })
        }
    }

    continueBtn.onclick = () => {
        loadingImg.classList.add('perspect');
        intro.classList.add('introClear');
        continueBtn.style.display = "none";

        setTimeout(() => {
            loadingImg.classList.add('none');
            image.classList.remove('none');
            moveImage.style.transform = "translateX(0)";
            moveImage.style.webkitTransform = "translateX(0)";
            leadTowardsRight.style.zIndex = 1;

            for(let logo of groupLogo){
                logo.style.zIndex = 1;
                logo.onclick = () => {
                    moveImage.style.transform = "translateX(" + logoMove.get(logo.id) * window.innerWidth  + "px)";
                }
            }
            
            moveWidth = image.width - window.innerWidth;
            document.addEventListener('touchstart', touchStart, {passive: false});
        }, 3000);
    }

    audioBtn.onclick = () => { 
        if(audioPlay.paused){
            audioPlay.play();
            audioBtn.classList.add('audioRotate');
        }
        else{
            audioPlay.pause();
            audioBtn.classList.remove('audioRotate');
        }
    }
}

function dealLight(light, groupIntro, flag){
    let preClass = light.previousElementSibling.classList,
        words = groupIntroduce.get(light.id);

    light.classList.add('none');
    switch(light.id){
        case 'productLight': {
            productWindow.classList.add("openWindow");
            break;
        };
        case 'backendLight': {
            backendDoor.classList.add("openDoor");
            backendWindow.classList.add("openWindow");
            break;
        };
        case 'androidLight': {
            androidWindow.classList.add("openWindow");
            break;
        };
        case 'designLight': {
            designDoor.classList.add("openDoor");
            designCat.classList.add("openWindow");
            break;
        };
        case 'frontendLight': {
            frontendWindow1.classList.add("openWindow");
            frontendWindow2.classList.add("openWindow");
            break;
        };
    }

    // setTimeout(() => {
    //     moveImage.style.zIndex = 1;
    //     dealIntroduceAnimate(words, groupIntro, flag);
    // }, 500);
}

function recoverLight(light){
    let preClass = light.previousElementSibling.classList;

    switch(light.id){
        case 'productLight': {
            productWindow.classList.add("closeWindow");
            setTimeout(() => {
                productWindow.classList.remove("openWindow");
                productWindow.classList.remove("closeWindow");
            }, 1000);
            break;
        };
        case 'backendLight': {
            backendDoor.classList.add("closeDoor");
            backendWindow.classList.add("closeWindow");
            setTimeout(() => {
                backendDoor.classList.remove("openDoor");
                backendDoor.classList.remove("closeDoor");
                backendWindow.classList.remove("openWindow");
                backendWindow.classList.remove("closeWindow");
            }, 1000);
            break;
        };
        case 'androidLight': {
            androidWindow.classList.add("closeWindow");
            setTimeout(() => {
                androidWindow.classList.remove("openWindow");
                androidWindow.classList.remove("closeWindow");
            }, 1000);
            break;
        };
        case 'designLight': {
            designDoor.classList.add("closeDoor");
            designCat.classList.add("closeWindow");
            setTimeout(() => {
                designDoor.classList.remove("openDoor");
                designDoor.classList.remove("closeDoor");
                designCat.classList.remove("openWindow");
                designCat.classList.remove("closeWindow");
            }, 1000);
            break;
        };
        case 'frontendLight': {
            frontendWindow1.classList.add("closeWindow");
            frontendWindow2.classList.add("closeWindow");
            setTimeout(() => {
                frontendWindow1.classList.remove("openWindow");
                frontendWindow1.classList.remove("closeWindow");
                frontendWindow2.classList.remove("openWindow");
                frontendWindow2.classList.remove("closeWindow");
            }, 1000);
            break;
        };
    }
    setTimeout(() => {
        light.classList.remove('none');
    }, 1000);
}

function dealIntroduceAnimate(words, groupIntro, flag){
    groupIntro.style.zIndex = 10;
    let node = groupIntro.childNodes[0],
        i = 0;

    function write(){
        let string = words.substr(0,i); 
        if(i > words.length){
            return;
        }
        else if(i === words.length){
            node.innerHTML = string;
        }
        else{
            node.innerHTML = string + "_";
        }
        i++;
        flag.flag = setTimeout(write, 150);
    }
    write();
}

function quit(){
    let equipmentRe = /(Android|webOS|iPhone(X)?|iPod|BlackBerry)/i;
    if(!equipmentRe.test(navigator.userAgent)){
        document.write("请用手机浏览器打开，以获取最优体验！");
        return false;
    }
    if(document.documentElement.clientWidth > document.documentElement.clientHeight){
        document.write("请用竖屏观看，以获取最优体验！");
        return false;
    }
    return true;
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
        let moveY = preY - currentY,
            moveImageX = moveImage.style.transform.match(movePatt)[1],
            trans;
        if((moveY < 0 && parseInt(moveImageX) === 0) || (moveY > 0 && (-parseFloat(moveImageX) >= moveWidth)))
            return false;
        preY = currentY;

        if(moveImageX - moveY > 0)
            trans = 0;

        else if(!(moveY - moveImageX < moveWidth))
            trans = -moveWidth;

        else
            trans = parseFloat(moveImageX - moveY);

        moveImage.style.transform = "translateX(" + trans + "px)";
        moveImage.style.webkitTransform = "translateX(" + trans + "px)";
    })

    event.preventDefault();
}

function touchEnd(event){
    preY = currentY;
}