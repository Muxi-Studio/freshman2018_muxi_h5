import './load.css';

// let arr = ["bird.jpg", "background.png", "tunnel.jpeg", "house.jpeg", "computer.jpg", "androidHouse.png", "backendHouse.png", "designHouse.png", "loading.png", "light.jpeg"];
let arr = ["bird.jpg", "tunnel.jpeg", "androidHouse.png", "backendHouse.png", "designHouse.png"]; 
let num = 0;

window.onload = () => {
    for(let i = 0;i < arr.length;i++){
        let img = new Image();
        img.src = "../img/" + arr[i];
        img.onload = function(){
            num++;
            let sch = (num / arr.length * 100).toFixed(0);
            setTimeout(() => {
                let cover = document.getElementsByClassName("cover")[0];
                let schedule = document.getElementsByClassName("schedule")[0];
                schedule.innerHTML = sch + " %";
                cover.style.width = sch + "%";
                if(sch == 100){
                    setTimeout(function(){
                        window.location.href = "../move.html";
                    }, 300);
                }
            }, num * 30)
        }
    }
}

