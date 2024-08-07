var unmuteButton = document.getElementById("unmuteButton")

//Hilfsfunktion um alle Div-Elemente auszublenden die den "Game"-Klassennamen haben. Blendet alles aus, außer die Spielerliste und Hilfsansichten
function hideAll() {
    let divs = document.getElementsByTagName('div');
    for(var i = 0; i < divs.length; i++) {
        if(divs[i].classList.contains("game")) {
            divs[i].style.display = "none";
        }
    }
}

function showUnmuteButton() {
    unmuteButton.style.display = "block"
}

unmuteButton.addEventListener("click", function() {
    unmuteButton.style.display = "none";
    startState()
})

//<--------- Game-Intro ---------->

function showQRCode() {
    hideAll();
    QRCode = document.getElementById("QRCode")
    var opacity = 0; 
    QRCode.style.opacity = 0;
    QRCode.style.display = 'block';

    var timer = setInterval(function () { 
        opacity = opacity + 0.02;
        QRCode.style.opacity = opacity;
        if (opacity > 0.9){
            clearInterval(timer);
            //TMP ENTFERNEN
        }
    }, 30);
}

function hideQRCode() {
    hideAll()
    //document.getElementById("book").style.display = "block"
    QRCode = document.getElementById("QRCode")
    var opacity = 1; 
    QRCode.style.opacity = 1;
    QRCode.style.display = 'block';

    var timer = setInterval(function () { 
        opacity = opacity - 0.02;
        QRCode.style.opacity = opacity;
        if (opacity < 0.1){
            clearInterval(timer);
            QRCode.style.display = 'none';
            showGameIntro()
        }
    }, 30);
}

function hidePhone() {
    hideAll()
    document.getElementById("hide-phone").style.display = "block";
}

function lookRoles() {
    hideAll()
    document.getElementById("look-roles").style.display = "block";
}

function showGameIntro(image) {
    hideAll()
    removeAllAudio()
    if(!image) {
        image = "/images/MainScreen/captain-gulliver.jpg"
    }
    document.getElementById("GPTImage").src = image;
    addAudio(dream_audio, 0.2)
    setTimeout(() => {
        initBook();
        setTimeout(()=> {
            turnPage()
            setTimeout((() => {
                playAudio(gameIntro_audio, 0.8) //NARRATOR INTO UNCOMMENT LATER
                console.log("Duration: " + gameIntro_audio.duration)
                setTimeout(() => {
                    turnPage()
                    startChar()
                }, gameIntro_audio.duration * 1000 + 1000) //it has to be * 1000 THIS IS TMP
            }), 2000)
        }, 5000)
    }, 10000)
}


//Buch wird einfach wieder eingeblendet, sobald die Seite neu geladen wurde
function showBook() {
    hideAll()
    document.body.classList.add("body-center")
    book = document.getElementById("book")
    document.getElementById("book-wrapper").style.display = 'block';
    book.style.display = 'block';
}

function hideBook() {
    book = document.getElementById("book")
    book.style.display = 'none';
}


function showIntro(intro, image) {
    createIntroPage(intro, image)
    console.log(intro)
}

function goToSleep(image) {
    createSleepPage(image)
    setTimeout(() => {
        playAudio(goToSleep_audio, 0.8)
    }, 3500)

}

function nightScreen(image) {
    changeState("Night")
    createNightPage(image)
    changeBookStyle("night")
    playNight()
}

function werewolfScreen(image) {
    createWerewolfPage(image)
    changeBookStyle("werewolf")
    setTimeout(() => {
        playAudio(werewolfWake_audio, 0.8)
    }, 3500)
    playWerewolf()
}

function seerScreen(image) {
    console.log(image)
    createSeerPage(image)
    changeBookStyle("seer")
    setTimeout(() => {
        playAudio(seerWake_audio, 0.8)
    }, 3500)
    playSeer()
}

function witchScreen(image) {
    createWitchPage(image)
    changeBookStyle("witch")
    setTimeout(() => {
        playAudio(witchWake_audio, 0.8)
    }, 3500)
    playWitch()
}

//<--------- Morning ---------->

function wakeUp(image) {
    createWakePage(image)
    playAudio(wakeUp_audio, 0.8)
    playMorning()
    changeBookStyle("day")
}

function morningScreen(date, text) {
    createEntryPage(date, text)
    setTimeout(() => {
    
    }, 5000)
}

//<--------- Day ---------->

function dayScreen(image) {
    createDayPage(image)
    setTimeout(() => {
        setTimeout(() => {
            playAudio(endDebate_audio, 0.8)
        }, 400000);
        playAudio(debate_audio, 0.8)
        setTimeout(() => {
            playDay()
        })
    }, 3500)
}

//<--------- Execution ---------->

function executionScreen(date, text) {
    createEntryPage(date, text)
}

//<--------- Ending ---------->

function endScreen(winner, text) {
    if(winner === "Werewolf") {
        changeBookStyle("werewolfEnd")
        playWerewolf()
    } else if(winner === "Village") {
        changeBookStyle("day")
        playMorning()
        playAudio(dream_audio, 0.2)
    } else {
        changeBookStyle("allDeadEnd")
        playNight()
        playAudio(atmo8_audio, 0.4)
    }
    createEndPage(winner, text)
}

function showOutro() {
    console.log("Outro")
    closeBook()
}

