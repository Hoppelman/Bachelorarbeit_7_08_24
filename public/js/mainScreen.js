let socket = io('/main', { autoConnect: false });
let listen = false;
let timeTillIntervention = 20000;
var localInfo = {phase: "Start"}

//startGame()

console.log("Js is loaded")
socket.connect();

function startGame() {
    showQRCode();
    changeState("Start")
}

//<--------- Spiel-Intro ---------->

socket.on('hide-phone', () => {
    hidePhone();
})

socket.on('look-roles', () => {
    lookRoles();
})

socket.on('game-intro', (mainInfo) => {
    console.log(mainInfo)
    console.log(mainInfo.phase)
    localInfo = mainInfo
    changeState("GameIntro")
    showGameIntro(mainInfo.GPTImage)
})

function startChar() {
    socket.emit('start-character-selection');
    changeState("Char")  
    setTimeout(() => {
        playAudio(char_audio, 0.8)
    }, 4500)
}

//Client bekommt die Anweisung das Intro zu zeigen
socket.on('show-intro', (intro, image) => {
    changeState("Intro")
    showIntro(intro, image);
    turnPageDelay();
})

//Das Dorf schläft ein
socket.on('go-to-sleep', (mainInfo) => {
    //Der lokale Informationsstand wird geupdated
    localInfo = mainInfo
    //changeStyle("night")
    goToSleep(mainInfo.sleepImage);
    turnPageDelay();
});

socket.on('night-screen', () => {
    nightScreen(localInfo.sleepImage)
    setTimeout(() => {
        changeState("Night")
    }, 3000)
    turnPageDelay()
})

//<<------ Werewolfs ------->

socket.on('werewolf', () => {
    werewolfScreen(localInfo.werewolfImage)
    changeState("Werewolf")
    turnPageDelay()
})

//<<------ Seer ------->

socket.on('seer', () => {
    seerScreen(localInfo.seerImage)
    changeState("Seer")
    turnPageDelay()
})

//<<------ Witch ------->

socket.on('witch', () => {
    witchScreen(localInfo.witchImage)
    changeState("Witch")
    turnPageDelay()
})

//<----- Wake Up --------->

socket.on('wake-up', (mainInfo) => {
    localInfo = mainInfo
    wakeUp(mainInfo.wakeUpImage);
    turnPageDelay();
})

//<<------ Morning ------->

socket.on('morning-entry', (mainInfo) => {
    localInfo = mainInfo
    if(localInfo.foundDead) {
        playFoundDead()
    }
    morningScreen(new Date(localInfo.date), localInfo.text);
    changeState("Morning")
    turnPageDelay()
})

//<<------ Day ------->

socket.on('day', () => {
    dayScreen(localInfo.citizenImage)
    changeState("Day")
    turnPageDelay()
})

//<<------ Execution ------->

socket.on('execution', (mainInfo) => {
    localInfo = mainInfo
    if(localInfo.foundDead) {
        playFoundDead()
    }
    executionScreen(new Date(localInfo.date), localInfo.text)
    changeState("Execution")
    turnPageDelay()
})

//<--------- Diskussion ---------->

let silentTimer
let currentText = "";

function silentIntervention() {
    console.log("20 Sekunden Stille!")
    listen = false;
    clearTimeout(silentTimer);
    socket.emit("silent-intervention",
        currentText
    )
}

function timerReset() {
    if(silentTimer) {
        clearTimeout(silentTimer)
    }
    console.log("Timer  Reset!")
    silentTimer = setTimeout(silentIntervention, timeTillIntervention);
}

window.SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
console.log(recognition);
recognition.interimResults = true;

recognition.addEventListener("result", (e) => {
    timerReset()
    let text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
           
    
    
    if (e.results[0].isFinal) {
        console.log(text);
        currentText = currentText + text + "\n" ;
    } else {
        console.log(text);
    }
});

recognition.addEventListener("end", () => {
    if(listen) {
        recognition.start();
    } else {
        clearTimeout(silentTimer)
    }
});

//Die Diskussion soll per SpeechToText verfolgt werden
socket.on('listen', () => {
    currentText = ""
    startListenforIntervention()
});

function startListenforIntervention () {
    console.log("Listening...");
    listen = true;
    timerReset()
    recognition.start();
}

//Die Diskussion soll nicht weiter verfolgt werden
socket.on('stop-listening', () => {
    console.log("Stop listening...");
    listen = false;
});

//Die Diskussion soll nicht weiter verfolgt werden
socket.on('silent-intervention', (text) => {
    console.log(text);
    //Interventionszeit wird vergrößert 
    timeTillIntervention = timeTillIntervention + 40000;
    recognition.stop();

    setTimeout(() => {
        console.log(localInfo.phase === "Day")
        if(localInfo.phase === "Day") {
            startListenforIntervention()
        }
    }, 20000)
});



//<<------ Game & Visuals ------->

function changeState(phase) {
    console.log(localInfo)
    console.log(localInfo.phase)
    switch(localInfo.phase) {
        case "Werewolf":
            playAudio(werewolfSleep_audio, 0.8)
            console.log("Play werwolf")
            break
        case "Seer":
            playAudio(seerSleep_audio, 0.8)
            console.log("Play werwolf")
            break
        case "Witch":
            playAudio(witchSleep_audio, 0.8)
            break
    }
    localInfo.phase = phase
    console.log("Change state: " + phase)
    console.log("localInfo: " + localInfo.phase)
    socket.emit('update-state', phase)
}

socket.on('update', (mainInfo) => {
    console.log(mainInfo.phase)
    console.log(mainInfo.text)
    localInfo = mainInfo
    showUnmuteButton()
})

socket.on('game-end', (winner, mainInfo) => {
    localInfo = mainInfo
    if(winner === "werewolf") {
        changeState("Werewolf")
        console.log("Werwölfe gewonnen")
    } else if (winner === "Village") {
        changeState("Day")
        console.log("Dorf gewonnen")
    } else {
        changeState("Night")
        console.log("Niemand hat gewonnen")
    }
    endScreen(winner, localInfo.text)
    
    turnPageDelay()
})

socket.on('game-outro', () => {
    showOutro()
    changeState("none")
})



function startState() {
    console.log(localInfo.phase)
    //localInfo.phase = "Day"//TMP
    let date = new Date(localInfo.date)
    console.log(date.getDate())
    switch(localInfo.phase) {
        case "Start":
            showQRCode()
            break;
        case "GameIntro":
            showGameIntro()
            break;
        case "HidePhone":
            hidePhone()
            break;
        case "LookRoles":
            lookRoles()
            break;
        case "Intro":
            showBook()
            showIntro(localInfo.text, localInfo.introImage)
            turnToEnd()
            break;
        case "Char":
            showBook()
            turnPages(2)
            break;
        case "Sleep":
            showBook()
            goToSleep(localInfo.sleepImage)
            turnToEnd()
            break;
        case "Night":
            showBook()
            nightScreen(localInfo.sleepImage)
            turnToEnd()
            break;
        case "Werewolf":
            showBook()
            werewolfScreen(localInfo.werewolfImage)
            turnToEnd()
            break;
        case "Seer":
            showBook()
            seerScreen(localInfo.seerImage)
            turnToEnd()
            break;
        case "Witch":
            showBook()
            witchScreen(localInfo.witchImage)
            turnToEnd()
            break;
        case "Morning":
            showBook()
            morningScreen(date, localInfo.text)
            turnToEnd()
            break;
        case "Day":
            showBook()
            dayScreen(localInfo.citizenImage)
            turnToEnd()
            startListenforIntervention()
            break;
        case "Execution":
            showBook()
            executionScreen(date, localInfo.text)
            turnToEnd()
            break;
        case "AllDeadEnd":
            showBook()
            endScreen("AllDead", localInfo.text)
            turnToEnd()
            break;
        case "WerewolfEnd":
            showBook()
            endScreen("Werewolf", localInfo.text)
            turnToEnd()
            break;
        case "VillageEnd":
            showBook()
            endScreen("Village", localInfo.text)
            turnToEnd()
            break;
        case "Outro":
            showBook()
            turnToEnd()
            showOutro()
            break;
        default:
            startScreen()
    }
}



