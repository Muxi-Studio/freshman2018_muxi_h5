'use strict';
//引入、打包文件
import './move.css';
import frontendLight from "../static/frontendLight.png";
import androidLight from "../static/androidLight.png";
import backendLight from "../static/backendLight.png";
import designLight from "../static/designLight.png";
import productLight from "../static/productLight.png";

//正则匹配，获取偏移
const movePatt = new RegExp(/translateX\((-?(?:\d+(?:\.\d+)?))(?:px)\)/, "i");
//组介绍信息
const groupIntroduce = new Map([
    ['productLight' , {name: "产品组", introduceContent: "做产品这部大戏里的导演+编剧，把控产品方向，跟进产品开发和后续迭代，凭借对互联网领域的敏锐感，用灵感和理性为用户需求创造产品<br/><br/>技能：xmind，Axure，墨刀"}],
    ['designLight'  , {name: "设计组", introduceContent: "Adobe公司的忠实用户，用专业的技术支持和天马行空的想象力将互联网产品变成一场视觉盛宴。<br/><br/>技能：PS，AI，AE"}],
    ['backendLight' , {name: "后端组", introduceContent: "面对海量的数据冷静分析处理的逻辑界领袖，致力于解决服务器运维中的各种难题。<br/><br/>技能：Python，Go"}],
    ['androidLight' , {name: "安卓组", introduceContent: "基于android系统的搞事情小分队，开发App，做自己的App Store。<br/><br/>技能：Java，Kotlin"}],    
    ['frontendLight', {name: "前端组", introduceContent: "浏览器里神奇的画笔，用代码实现良好的网页和丰富的交互方式。<br/><br/>技能：HTML，CSS，JavaScript"}],    
]);
//logo信息
const logoInfo = new Map([
    ['productLogo' , {moveDistance: -0.024, imgPath: productLight}],
    ['designLogo'  , {moveDistance: -0.588, imgPath: designLight}],
    ['backendLogo' , {moveDistance: -1.750, imgPath: backendLight}],
    ['androidLogo' , {moveDistance: -1.153, imgPath: androidLight}],
    ['frontendLogo', {moveDistance: -2.434, imgPath: frontendLight}],
]);
//每次点击移动提示光标的移动距离
const movePerStep = 0.28;

//存储背景图片以及最大移动距离
let moveImage, moveWidth;
//存储dom节点
let groupIntroNotice, groupIntroContent, groupName, cancelNotice, productWindow, backendDoor, backendWindow, androidWindow, designDoor, designCat, designCatNest, frontendWindow1, frontendWindow2, windowSlide, footerTip, signupBtn;

//手指触点位置
let preY, currentY;

window.onload = () => {
    //设备识别
    if(!quit()){
        return;
    }

    //获取dom，方便频繁操作
    const continueBtn = document.getElementById('continueBtn'),
          image = document.getElementById('backgroundImg'),
          loadingImg = document.getElementById('loadingImg'),
          audioBtn = document.getElementById('audioBtn'),
          audioPlay = document.getElementById('audioPlay'),
          lights = document.getElementsByClassName('light'),
          intro = document.getElementById('teamIntroduce'),
          leadTowardsRight = document.getElementById('leadTowardsRight'),
          groupLogos = document.getElementsByClassName('groupLogo'),
          groupLogoDiv = document.getElementById('groupLogo'),
          maskBeforeImgOnload = document.getElementsByClassName('maskBeforeImgOnload');
    signupBtn = document.getElementById('signupBtn');
    footerTip = document.getElementById('footerTip');
    groupIntroNotice = document.getElementById('groupIntroNotice');
    groupIntroContent = document.getElementById('groupIntroContent');
    groupName = document.getElementById('groupName');
    cancelNotice = document.getElementById('cancelNotice');
    moveImage = document.getElementById('contain');
    productWindow = document.getElementById("productWindow");
    backendDoor = document.getElementById("backendDoor");
    backendWindow = document.getElementById("backendWindow");
    androidWindow = document.getElementById("androidWindow");
    designDoor = document.getElementById("designDoor");
    designCat = document.getElementById("designCat");
    designCatNest = document.getElementById("designCatNest");
    frontendWindow1 = document.getElementById("frontendWindow1");
    frontendWindow2 = document.getElementById("frontendWindow2");
    windowSlide = document.getElementById("windowSlide");


    getComputedStyle(loadingImg).background;

    //点击按钮，更换场景，监听dom
    continueBtn.onclick = () => {
        loadingImg.classList.add('perspect');
        intro.classList.remove('teamIntroducePresent');
        intro.classList.add('objectClear');
        continueBtn.classList.remove('continueBtnShake');
        continueBtn.classList.add('objectClear');

        for(const domObject of maskBeforeImgOnload){
            domObject.style.display = "block";
        }

        setTimeout(() => {
            loadingImg.classList.add('none');
            image.classList.remove('none');
            moveImage.style.transform = "translateX(0)";
            leadTowardsRight.style.zIndex = 1;
            groupLogoDiv.style.zIndex = 1;
            footerTip.style.zIndex = 1;
            moveWidth = image.width - window.innerWidth;

            //监听圆环点击事件
            for(let light of lights){
                clickLight(light);
            }

            designCatNest.onclick = () => {
                designCatNest.classList.add('catTransform');
            }
            
            //监听各种移动事件
            for(let logo of groupLogos){
                logo.onclick = () => {
                    logo.src = logoInfo.get(logo.id).imgPath;
                    if(logo.id === "frontendLogo"){
                        backgroundImageMove(moveWidth);
                    }
                    else{
                        moveImage.style.transform = "translateX(" + logoInfo.get(logo.id).moveDistance * window.innerHeight + "px)";
                        footerTip.style.zIndex = 1;
                        signupBtn.style.zIndex = -1;
                        leadTowardsRight.style.zIndex = 1;
                    }
                }
            }
            leadTowardsRight.onclick = () => {
                backgroundImageMove(movePerStep * window.innerHeight);
            }
            document.addEventListener('touchstart', touchStart, {passive: false});
        }, 2500);
    }

    //播放音乐
    audioBtn.onclick = () => { 
        if(audioPlay.paused){
            audioPlay.play();
            audioBtn.classList.add('audioRotate');
        }
        else{
            audioPlay.pause();
            audioPlay.currentTime = 0;
            audioBtn.classList.remove('audioRotate');
        }
    }
}

//监听圆环点击事件
function clickLight(light){
    //标记、节流
    let flag = false,
        clearTimeFlag = {flag: undefined};
    light.onclick = () => {
        document.addEventListener('click',(e) => {
            if(flag){
                return;
            }

            if(e.target === light){
                dealLight(light, clearTimeFlag);
                //动画未执行完毕，再次点击会直接执行else内的相反动画，进行标记节流
                flag = true;
                setTimeout(() => {
                    flag = false;
                }, 1000);
            }
            else if(e.target === cancelNotice){
                if(light.classList.contains('none')){
                    recoverLight(light, clearTimeFlag.flag);
                    //动画执行完毕，light才会清除none，进行标记节流
                    flag = true;
                    setTimeout(() => {
                        flag = false;
                    }, 1000);
                }
            }
        })
    }
}

//处理圆环点击事件，执行相关动画
function dealLight(light, clearTimeFlag){
    let groupInfo = groupIntroduce.get(light.id);

    light.classList.add('none');
    switch(light.id){
        case 'productLight': {
            productWindow.classList.add("openWindow");
            windowSlide.play();
            break;
        };
        case 'backendLight': {
            backendDoor.classList.add("openDoor");
            backendWindow.classList.add("openWindow");
            windowSlide.play();
            break;
        };
        case 'androidLight': {
            androidWindow.classList.add("openWindow");
            windowSlide.play();
            break;
        };
        case 'designLight': {
            designDoor.classList.add("openDoor");
            designCat.classList.add("openWindow");
            windowSlide.play();
            break;
        };
        case 'frontendLight': {
            frontendWindow1.classList.add("openWindow");
            frontendWindow2.classList.add("openWindow");
            windowSlide.play();
            break;
        };
    }

    setTimeout(() => {
        dealIntroduceAnimate(groupInfo.name, groupInfo.introduceContent, clearTimeFlag);
    }, 1200);
}

//恢复圆环，执行相关动画
function recoverLight(light, timeFlag){
    groupIntroNotice.style.zIndex = -1;
    clearTimeout(timeFlag);

    switch(light.id){
        case 'productLight': {
            productWindow.classList.add("closeWindow");
            windowSlide.play();
            setTimeout(() => {
                productWindow.classList.remove("openWindow");
                productWindow.classList.remove("closeWindow");
            }, 1000);
            break;
        };
        case 'backendLight': {
            backendDoor.classList.add("closeDoor");
            backendWindow.classList.add("closeWindow");
            windowSlide.play();
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
            windowSlide.play();
            setTimeout(() => {
                androidWindow.classList.remove("openWindow");
                androidWindow.classList.remove("closeWindow");
            }, 1000);
            break;
        };
        case 'designLight': {
            designDoor.classList.add("closeDoor");
            designCat.classList.add("closeWindow");
            windowSlide.play();
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
            windowSlide.play();
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

/*处理组别介绍的相关动画
 *@method dealIntroduceAnimate
 *@for window
 *@param{string} name：组别名称，introduceContent：组别介绍，clearTimeFlag：标记对象，当recoverLight函数被调用时，清除计时器
 *@return{null} 
*/
function dealIntroduceAnimate(name, introduceContent, clearTimeFlag){
    groupIntroNotice.style.zIndex = 2;
    let i = 0;

    groupName.innerHTML = name;
    write();

    function write(){
        let string = introduceContent.substr(0,i); 
        if(i > introduceContent.length){
            return;
        }
        else if(i === introduceContent.length){
            groupIntroContent.innerHTML = string;
        }
        else{
            groupIntroContent.innerHTML = string + "_";
        }
        i++;
        clearTimeFlag.flag = setTimeout(write, 100);
    }
}

/*处理背景图片的移动
 *@method backgroundImageMove
 *@for window
 *@param{int} distance 正->向右，负->向左
 *@return{null}
*/
function backgroundImageMove(distance){
    let moveImageX = parseFloat(moveImage.style.transform.match(movePatt)[1]),
        trans;
    if((distance < 0 && (moveImageX >= 0)) || (distance > 0 && (-moveImageX >= moveWidth)))
        return;

    if(moveImageX - distance > 0){
        trans = 0;
    }

    else if(!(distance - moveImageX < moveWidth)){
        trans = -moveWidth;
        footerTip.style.zIndex = 0;
        signupBtn.style.zIndex = 1;
        leadTowardsRight.style.zIndex = -1;
    }

    else{
        footerTip.style.zIndex = 1;
        signupBtn.style.zIndex = -1;
        leadTowardsRight.style.zIndex = 1;
        trans = moveImageX - distance;
    }

    moveImage.style.transform = "translateX(" + trans + "px)";
}

//进行设备识别处理
function quit(){
    const body = document.getElementsByTagName("body")[0];
    body.style.display = "block";
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

//处理触摸事件，进行移动
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

    window.requestAnimationFrame(() => {
        currentY = finger.pageY;
        backgroundImageMove(preY - currentY);
        preY = currentY;
    })

    event.preventDefault();
}

function touchEnd(event){
    preY = currentY;
}