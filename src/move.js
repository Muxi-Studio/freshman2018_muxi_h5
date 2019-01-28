'use strict';
import "../static/androidHouse2.png";
import "../static/backendHouse2.png";
import "../static/designHouse2.png";
import "../static/productHouse2.png";
import "../static/frontendHouse2.png";
import './move.css';

//正则匹配，获取偏移
const patt = new RegExp(/translate\((-?\d+)(?:px)/,"i");

let moveImage, moveWidth;

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
          contain = document.getElementById('contain'),
          lights = document.getElementsByClassName('light'),
          groupIntro = document.getElementById('groupIntro'); 
    for(let light of lights){
        //标记异步，及时清除，防止累积
        let obj = {flag: 0};
        light.onclick = () => {
            document.addEventListener('click',(e) => {
                let src = light.previousElementSibling.src,
                    index1 = src.lastIndexOf('.'),
                    index2 = src.lastIndexOf('/');
                
                if(obj.flag){
                    clearTimeout(obj.flag);
                }

                if(e.target === light){
                    if(src[index1 - 1] === '2')
                        return;
                    src = src.slice(0, index1) + '2' + src.slice(index1);
                    light.previousElementSibling.src = src;
                    dealLight(light, groupIntro, obj);
                }
                else{
                    if(src[index1 - 1] === '2')
                        src = src.slice(0, index1 - 1) + src.slice(index1);
                    
                    light.previousElementSibling.src = src;
                    recoverLight(light);
                    groupIntro.style.zIndex = 1;
                }
            })
        }
    }
    const intro = document.getElementsByClassName('introduce')[0];
    moveImage = document.getElementById('contain');

    continueBtn.onclick = () => {
        loadingImg.classList.add('perspect');
        intro.classList.add('introClear');
        continueBtn.style.display = "none";

        setTimeout(() => {
            loadingImg.classList.add('none');
            image.classList.remove('none');
            moveImage.style.transform = "translate(0, 0)";
            moveImage.style.webkitTransform = "translate(0, 0)";

            image.onload = () => {
                moveWidth = image.width - window.innerWidth;
        
                document.addEventListener('touchstart', touchStart, {passive: false});
            }
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

function dealLight(light, groupIntro, flag){
    let className = light.classList,
        preClass = light.previousElementSibling.classList,
        words;

    if(className.contains('productLight')){
        // className.add('changeLight');
        
        words = "做产品这部大戏里的导演+编剧，把控产品方向，跟进产品开发和后续迭代，凭借对互联网领域的敏锐感，用灵感和理性为用户需求创造产品<br/><br/>技能：xmind，Axure，墨刀";

        setTimeout(() => {
            className.add('none');
            // preClass.add('changeProduct');
            contain.style.zIndex = 1;
            dealAnimate(words, groupIntro, flag);
        }, 1000);
    }
    else{
        className.add('none');
        if(className.contains('designLight')){
            // preClass.add('changeDesign');
            words = "Adobe公司的忠实用户，用专业的技术支持和天马行空的想象力将互联网产品变成一场视觉盛宴。<br/><br/>技能：PS，AI，AE";
        }
        else if(className.contains('backendLight')){
            // preClass.add('changeBackend');
            words = "面对海量的数据冷静分析处理的逻辑界领袖，致力于解决服务器运维中的各种难题。<br/><br/>技能：Python，Go";
        }
        else if(className.contains('androidLight')){
            // preClass.add('changeAndroid');
            words = "基于android系统的搞事情小分队，开发App，做自己的App Store。<br/><br/>技能：Java，Kotlin";
        }
        else{
            // preClass.add('changeFrontend');
            words = "浏览器里神奇的画笔，用代码实现良好的网页和丰富的交互方式。<br/><br/>技能：HTML，CSS，JavaScript";
        }

        setTimeout(() => {
            contain.style.zIndex = 1;
            dealAnimate(words, groupIntro, flag);
        }, 1500);
    }
}

function recoverLight(light){
    let className = light.classList,
        preClass = light.previousElementSibling.classList;

    className.remove('none');
    if(className.contains('productLight')){
        className.remove('changeLight');
        // preClass.remove('changeProduct')
    }
    else if(className.contains('designLight')){
        // preClass.remove('changeDesign');
    }
    else if(className.contains('backendLight')){
        // preClass.remove('changeBackend');
    }
    else if(className.contains('androidLight')){
        // preClass.remove('changeAndroid');
    }
    else{
        // preClass.remove('changeFrontend');
    }
}

function dealAnimate(words, groupIntro, flag){
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