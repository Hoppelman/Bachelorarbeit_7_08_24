var fireplace_video = document.getElementById("fireplace");
var startButton = document.getElementById("startButton")
var startForm = document.getElementById("startForm")
var submitButton = document.getElementById("submitButton")
var startDiv = document.getElementById("start")



function startScreen() {
    hideAll()
    playFireplace()
    fireplace_video.play()
    let divs = document.getElementsByTagName('div');
    for(var i = 0; i < divs.length; i++) {
        if(divs[i].classList.contains("startScreen")) {
            divs[i].style.display = "block";
        }
    }
}

fireplace_video.addEventListener("ended", loopVideo);

function loopVideo() {
    fireplace_video.currentTime = 0; 
    fireplace_video.play();
}

startButton.addEventListener("click", function() {
    addAudio(atmo8_audio, 0.9);
    changeVolume(crickets_audio, 0.6, 5000)
    changeVolume(fireplace_audio, 0.8, 5000)
    fireplace_video.classList.remove("move-right")
    fireplace_video.classList.add("move-up")
    var opacity = 1; 
    var timer = setInterval(function () {
        startButton.style.opacity = opacity;
        opacity = opacity - opacity * 0.15;

        if (opacity < 0.1){
            clearInterval(timer);
            startButton.style.display = 'none';
            setTimeout(function(){
                formFadeIn()
            }, 800);
        }
    }, 30);
});

function formFadeIn() {
    var opacity = 0; 
    submitButton.style.opacity = 0;
    startForm.style.opacity = 0;
    startForm.style.display = 'block';
    submitButton.style.display = 'block';
    document.getElementById("options").style.display = "block";

    var timer = setInterval(function () { 
        opacity = opacity + 0.02;
        startForm.style.opacity = opacity;
        submitButton.style.opacity = opacity;

        if (opacity > 0.9){
            clearInterval(timer);
        }
    }, 30);
}

submitButton.addEventListener("click", function() {
    gameFormInit()
})

function gameFormInit() {
    var opacity = 1; 
    var timer = setInterval(function () {
        startForm.style.opacity = opacity;
        submitButton.style.opacity = opacity;
        opacity = opacity - opacity * 0.15;

        if (opacity < 0.1){
            clearInterval(timer);
            startForm.style.display = 'none';
            submitButton.style.display = 'none';
            setTimeout(function(){
                console.log("move")
                fireplace_video.classList.remove("move-up")
                fireplace_video.classList.add("move-down")
                setTimeout(function() {
                    startGame()
                    videoFadeOut()
                }, 4000);
            }, 800);
        }
    }, 30);
}

function videoFadeOut() {
    fireplace_video.style.display = "none";
    fireplace_video.pause()
    fireplace_video.removeEventListener("ended", loopVideo)
}
