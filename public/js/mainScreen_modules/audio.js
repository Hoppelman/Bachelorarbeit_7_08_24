//Atmo sounds
var fireplace_audio = new Audio('/audio/start/Fireplace.mp3');
var crickets_audio = new Audio('/audio/start/crickets.mp3');
var atmo8_audio = new Audio('/audio/start/Atmo8.mp3');


//Narrative
var pageTurn_audio = new Audio('/audio/book/turnPage.mp3');
var gameIntro_audio = new Audio('/audio/narrator/gameIntro.m4a')
var char_audio = new Audio('/audio/narrator/character.m4a')
var goToSleep_audio = new Audio('/audio/narrator/goToSleep.mp3')
var werewolfWake_audio = new Audio('/audio/narrator/werewolfWake.mp3')
var werewolfSleep_audio = new Audio('/audio/narrator/werewolfSleep.mp3')
var seerWake_audio = new Audio('/audio/narrator/seerWake.mp3')
var seerSleep_audio = new Audio('/audio/narrator/seerSleep.mp3')
var witchWake_audio = new Audio('/audio/narrator/witchWake.mp3')
var witchSleep_audio = new Audio('/audio/narrator/witchSleep.mp3')
var wakeUp_audio = new Audio('/audio/narrator/wakeUp.mp3')
var debate_audio = new Audio('/audio/narrator/debate.mp3')
var endDebate_audio = new Audio('/audio/narrator/endDebate.mp3')

//intro
var dream_audio = new Audio('/audio/intro/castle-of-dreams.mp3')

//Werewolf
var werewolfVocal_audio = new Audio('/audio/Werewolf/CreepyVocal.mp3')
var werewolfDespair_audio = new Audio('/audio/Werewolf/eeriedespair.mp3')
var werewolfBreathing_audio = new Audio('/audio/Werewolf/Breathing.mp3')
var werewolfGrowling_audio = new Audio('/audio/Werewolf/growling.mp3')

//Seer
var seerSword_audio = new Audio('/audio/Seer/sword1.mp3')
var seerMystical_audio = new Audio('/audio/Seer/mystical.mp3')

//Witch
var witchBoiling_audio = new Audio('/audio/Witch/boiling.mp3')
var witchSpell_audio = new Audio('/audio/Witch/magic-spell.mp3')
var witchDance_audio = new Audio('/audio/Witch/witch_dance.mp3')

//Morning
var morningBirds_audio = new Audio('/audio/Day/birds-in-the-morning.mp3')
var morningBell_audio = new Audio('/audio/Day/Bells.mp3')
var birds_audio = new Audio('/audio/Day/Birds_singing.mp3')
var birds2_audio = new Audio('/audio/Day/Birds_singing2.mp3')

//Day
var village_audio = new Audio("/audio/Day/village1.mp3")

var currentAudio = []


//<--------- Game-Intro ---------->

function playFireplace() {
    currentAudio.push(fireplace_audio)
    currentAudio.push(crickets_audio)
    crickets_audio.volume = 0.7;
    playBackgroundAudio()
}


function playNight() {
    removeAllAudio()
    addBackgroundAudio(crickets_audio, 0.6)
    //addBackgroundAudio(atmo8_audio, 0.3)
    playBackgroundAudio()
}

//<--------- Werewolf ---------->

function playWerewolf() {
    removeAllAudio()
    addBackgroundAudio(werewolfVocal_audio, 0.6)
    addBackgroundAudio(werewolfDespair_audio, 0.7)
    addBackgroundAudio(werewolfBreathing_audio, 0.9)
    playAudio(werewolfGrowling_audio, 0.3)
    playBackgroundAudio()
}


//<--------- Seer ---------->

function playSeer() {
    removeAllAudio()
    playAudio(seerMystical_audio, 0.5)
    changeVolume(birds2_audio, 0.1, 1000)
    addBackgroundAudio(seerSword_audio, 0.3)
    playBackgroundAudio()
}

//<--------- Witch ---------->

function playWitch() {
    removeAllAudio()
    addBackgroundAudio(witchBoiling_audio, 0.95)
    addBackgroundAudio(witchSpell_audio, 0.25)
    addBackgroundAudio(witchDance_audio, 0.1)
    playBackgroundAudio()
}


//<--------- Morning ---------->

function playMorning() {
    removeAllAudio()
    //playAudio(morningBirds_audio, 0.3)
    playAudio(birds2_audio, 0.4)
    playAudio(birds_audio, 0.2)
    playBackgroundAudio()
    setTimeout(() => {
        changeVolume(birds2_audio, 0.1, 13000)
    }, 5000)
}

//<--------- Morning ---------->
function playFoundDead() {
    playAudio(morningBell_audio, 0.6)
}

//<--------- Day ---------->

function playDay() {
    removeAllAudio()
    playAudio(birds_audio, 0.2)
    addBackgroundAudio(village_audio, 0.7)
    playBackgroundAudio()
}

//<--------- Audio-Update ---------->

//Audio einmalig, mit ausgewählter Lautstärke abspielen
function playAudio(audio, volume) {
    audio.volume = volume;
    audio.play();
}

//Fügt die Audio mit ausgewählter Lautstärke hinzu
function addBackgroundAudio(audio, volume) {
    audio.volume = volume;
    currentAudio.push(audio)
}

//Die im currentAudio array gespeicherten audio Objekte, werden im Loop gespielt
function playBackgroundAudio() {
    currentAudio.forEach(audio => {
        //audio.play();
        changeVolume(audio, audio.volume, 2000);
        //Event listener wird jedem audio objekt gegeben. Falls die Audio endet, wird diese erneut abgespielt durch die "loopAudio" Funktion
        /*audio.addEventListener("ended", function() {
            audio.currentTime = 0; 
            audio.play();
        });*/
        audio.loop = true;
    })
}

//Spielt die Audio wieder von vorne ab
function loopAudio(audio) {
    audio.currentTime = 0; 
    audio.play();
}

//Lässt alle Hintergrundmusik ausblenden
function removeAllAudio() {
    while(currentAudio.length > 0) {
        removeAudio(currentAudio[0])
    }
    console.log(currentAudio)
}

// Entferne Audio vom background Loop
function removeAudio(audio) {
    audio.loop = false;
    changeVolume(audio, 0.1, 5000);
    /*audio.currentTime = 0;
    audio.pause();*/
    //audio.removeEventListener("ended", loopAudio)
    
    let audioIndex = currentAudio.indexOf(audio)
    currentAudio.splice(audioIndex, 1);
}

//Füge Sound zum Background Loop hinzu
function addAudio(audio, volume) {
    audio.volume = volume;
    currentAudio.push(audio)
    playBackgroundAudio()
}

//Funktion welche ein audio Element entgegennimmt und die Lautstärke von diesem auf einen bestimmten Wert anpasst, über einen definierten Zeitraum
function changeVolume(audio, endVolume, time) {
    if(audio.paused) {
        audio.volume = 0;
        audio.play();
    }
    currentVolume = audio.volume;
    let difference = endVolume - currentVolume;
    let steps = difference / 0.05;
    let interval = Math.abs(time/steps);

    var fade = setInterval(function() {
        if(difference > 0) {
            if(audio.volume >= endVolume || audio.volume >= 0.95) {
                clearInterval(fade)
            } else {
                audio.volume += 0.05;
            }
        } else {
            
            if(audio.volume <= endVolume) {
                clearInterval(fade)
            } {
                audio.volume -= 0.05;
            }
            if(audio.colume <= 0.1) audio.pause();
        }
    }, interval)
}
