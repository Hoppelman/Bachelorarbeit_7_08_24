
const Game = new localGame();
let thisPlayer = new localPlayer("0", "Ich", "Connected", "Unknown", "Alive", "/images/avatar_placeholder_100px.png");

let socket = io('/', { autoConnect: false });//socket connection. Connection wird erst dann aufgegeben, wenn der Nutzer signalisiert, dass er dem Spiel beitreten will
let charBtn = document.getElementById('charBtn');
let readyBtn = document.getElementById('readyBtn');
let joinBtn = document.getElementById('joinBtn');


//Bei jedem neuladen der Seite soll gepüft werden ob der Nutzer schon dem Spiel beigetreten ist
checkIfReconnect();


//Prüft ob der Nutzer bereits dem Spiel beigetreten ist
function checkIfReconnect() {
    let sessionID = localStorage.getItem("sessionID");
    //let sessionID = sessionStorage.getItem("sessionID");
    console.log(sessionID);

    if(sessionID) {
        console.log("Reconnecting...");
        socket.auth = { sessionID };
        socket.connect();
        socket.emit("user-reconnect");

    } else {
        console.log("New player");
        showJoinButton();
        hideList();
    }
}

//EVENTS

//Spieler signalisiert, dass er dem Spiel beitreten will
joinBtn.addEventListener('click', () => {
    waitForPlayers();
    //socket.auth = { SESSION_ID };
    socket.connect();
    socket.emit('join-game');
    initList();
});

//Charakter wurde vom Nutzer erstellt. Daten werden an den Server übermittelt.
charBtn.addEventListener('click', () => {
    socket.emit('character-data', 
        document.getElementById('name').value,
        document.getElementById('pronouns').value,
        document.getElementById('age').value,
        document.getElementById('description').value
    );
    finishedCharacter();
});

//Signalisiert dem Server, dass der Spieler bereit ist.
readyBtn.addEventListener('click', () => {
    socket.emit('player-ready');
});




//SOCKETS
/*---------------Connecting-------------*/

//Spieler aus einem vorherigen Spiel will beitreten. SessionID im localStorage ist aus vorheriger Partie noch vorhanden und muss gelöscht werden.
socket.on('old-user', () => {
    localStorage.removeItem("sessionID");
    //sessionStorage.removeItem("sessionID");
    socket.disconnect();
    window.location.href = '/unavailable/lobbyFull';
    console.log("Old User");
});

//Client wird die userID und SessionID übermittelt
socket.on('give-client-id', ({sessionID, userID}) => {
    socket.auth = { sessionID };
    localStorage.setItem("sessionID", sessionID);
    //sessionStorage.setItem("sessionID", sessionID);
    socket.userID = userID;
    thisPlayer.ID = userID;
    console.log("SessionID:" + sessionID);
    console.log("UserID:" + userID);
});

socket.on('lobby-full', () => {
    console.log("Lobby is full");
    //window.location.replace()
});


/*---------------Game-Start-------------*/

//Client bekommt vom Server eine Rolle zugewiesen
socket.on('get-role', (playerRole, mainInfo) => {
    thisPlayer.role = playerRole;
    console.log(mainInfo)
    Game.citizenImage = mainInfo.citizenImage;
    Game.werewolfImage = mainInfo.werewolfImage;
    Game.seerImage = mainInfo.seerImage;
    Game.witchImage = mainInfo.witchImage;
    console.log("Role: " + playerRole);
})

socket.on('get-name', (playerName) => {
    thisPlayer.name = playerName;
})

socket.on('hide-phone', () => {
    hidePhone();
}) 

socket.on('hide-all', () => {
    hideAll();
}) 

//Server gibt Client die Anweisung, die Rollen dem Spieler zu zeigen
socket.on('show-roles', () => {
    showRoles();

    //window.addEventListener('beforeunload', disableLeavingSite);
})


//Alle Spieler haben signalisiert, dass sie bereit sind
socket.on('players-ready', () => {
    //showIntro(intro);
    console.log("Character selection");
    characterSelection();
})

//Client bekommt die Anweisung das Intro zu zeigen
socket.on('show-intro', (intro) => {
    Game.currentText = intro;
    hideAll();
})

socket.on('show-loadingScreen', () => {
    showLoadingScreen();
})

/*---------------Night-Phase-------------*/

socket.on('go-to-sleep', () => {
    changeStyle("night")
    goToSleep();
});

/*---------------Werewolf-Phase-------------*/

//Funktion um Werwolf Voting zu managen: Wenn der Spieler die Seite neu lädt wird automatisch seine Auswahl auf "None" gestellt. Wenn dieser einen Spieler auswählt, wird dieser seine Auswahl ändert wird dies an den Server übermittelt
function initWerewolfSelection() {
    socket.emit("werewolf-selection",
        "None"
    );
    buttons = werewolfSelection();

    //Hier wird ebenfalls ein Event Listener den buttons hinzugefügt. trennung: In lobby.js wird die Spielelogik implementiert, für die GUI ist functions_GUI zuständig
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            if(button.classList.contains("selected")) {
                console.log("Selected: " + button.innerText )
                //let selectedPlayer = Game.playerList.find(player => player.name.trim() === button.innerText.trim())//BUG PLAYER ID ?????
                /*let selectedPlayer = Game.playerList.find(player => player.ID === button.socketID)
                console.log("DEBUGGING")
                console.log(selectedPlayer)*/
                socket.emit("werewolf-selection",
                    button.socketID
                );
            } else {
                console.log("Selected: " + "None")
                socket.emit("werewolf-selection",
                    "None"
                );
            }
        })
    }) 
}

socket.on('werewolf-selection-update', (voteList) => {
    console.log(voteList);
})

socket.on('werewolf-selection', () => {
    initWerewolfSelection();
})

//Sobald der Spieler seine Auswahl des Opfers bestätigt, legt er sich wieder schlafen
document.getElementById("werewolfConfirmBtn").addEventListener("click", () => {
    console.log("Hello")
    socket.emit("confirm-werewolf-selection");
    finishedWerewolfSelection();
    document.getElementById("werewolfConfirmBtn").style.display = "none";
});




/*---------------Seer-Phase-------------*/

socket.on('seer-selection', () => {
    changeStyle("seer")
    initSeerSelection();
})

function initSeerSelection() {
    buttons = seerSelection();
}

//Sobald der Seher seine Auswahl getroffen hat, wird der Server nach der Identität des Spielers gefragt
document.getElementById("seerConfirmBtn").addEventListener("click", () => {
    let list = document.getElementById("seerList");
    buttons = list.querySelectorAll("button");
    let selectedName = "None"
    
    //Schaue nach, welche Name ausgewählt wurde und sende die entsprechende Spieler ID an den Server
    buttons.forEach(function(button) {
        if(button.classList.contains("selected")) {
            selectedName = button.innerText
            let selectedPlayer = Game.playerList.find(player => player.name.trim() === selectedName.trim())
            console.log("DEBUGGING")
            console.log(Game.playerList)
            console.log(button.innerText)
            console.log(selectedPlayer)
            socket.emit("confirm-seer-selection",
                button.socketID
            );
            document.getElementById("seerConfirmBtn").style.display = "none";
        } 

    }) 
});

//Der Client erhält vom Server die Identität und zeigt diese dem Spieler an
socket.on('seer-show-role', (role, name) => {
    finishedSeerSelection(role, name);
})


/*---------------Witch-Phase-------------*/

//TODO ADD COMMENTS !

socket.on('witch-heal-selection', () => {
    initWitchHealSelection();
})

function initWitchHealSelection() {
    socket.emit("ask-witch-info");
    //buttons = seerSelection();
}

socket.on('get-witch-info', (target) => {
    if(target !== "None") {
        buttons = witchHealSelection(target);
    } else {
        socket.emit('heal-target-player',
            false
        )
    }
    
})

document.getElementById("healConfirmBtn").addEventListener("click", () => {
    socket.emit('heal-target-player',
        true
    )
});

document.getElementById("healRefuseBtn").addEventListener("click", () => {
    socket.emit('heal-target-player',
        false
    )
});

socket.on('witch-kill-selection',() => {
    initWitchKillSelection()
})

function initWitchKillSelection() {
    console.log("kill")
    buttons = witchKillSelection();
}

document.getElementById("witchKillConfirmBtn").addEventListener("click", () => {
    let list = document.getElementById("witchKillList");
    buttons = list.querySelectorAll("button");
    let selectedName = "None"
    
    //Schaue nach, welche Name ausgewählt wurde und sende die entsprechende Spieler ID an den Server
    buttons.forEach(function(button) {
        if(button.classList.contains("selected")) {
            selectedName = button.innerText
            let selectedPlayer = Game.playerList.find(player => player.name.trim() === selectedName.trim())

            socket.emit("witch-kill-decision",
                button.socketID
            );
            document.getElementById("witchKillConfirmBtn").style.display = "none";
        } 
    }) 
})

document.getElementById("witchKillRefuseBtn").addEventListener("click", () => {
    socket.emit("witch-kill-decision",
        "None"
    );
})

/*---------------Morning-Phase-------------*/

socket.on('show-morningScreen', () => {
    showMorningScreen();
})

socket.on('morning-entry', (entry) => {
    Game.currentText = entry;
})

/*---------------Day-Phase-------------*/

socket.on("start-voting", () => {
    initVoting()
})

function initVoting() {
    socket.emit("voting-selection",
        "None"
    );
    buttons = votingSelection();

    //Hier wird ebenfalls ein Event Listener den buttons hinzugefügt. trennung: In lobby.js wird die Spielelogik implementiert, für die GUI ist functions_GUI zuständig
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            if(button.classList.contains("selected")) {
                console.log("Selected: " + button.innerText )
                let selectedPlayer = Game.playerList.find(player => player.name.trim() === button.innerText.trim())
                console.log("DEBUGGING")
                console.log(Game.playerList)
                console.log(button.innerText)
                console.log(selectedPlayer)
                socket.emit("voting-selection",
                    button.socketID
                );
            } else {
                console.log("Selected: " + "None")
                socket.emit("voting-selection",
                    "None"
                );
            }
        })
    }) 
}

socket.on('voting-selection-update', (voteList) => {
    console.log(voteList);
})

//Sobald der Spieler seine Auswahl getroffen hat, wartet er bis alle Spieler ihre Stimme getroffen haben
document.getElementById("votingConfirmBtn").addEventListener("click", () => {
    socket.emit("confirm-voting-selection");
    document.getElementById("votingConfirmBtn").style.display = "none";
    finishedVotingSelection();
});

socket.on('vote-count', () => {
    showCountScreen()
}) 


/*---------------Game-Update-------------*/

//Liste an Spielern wird überreicht
socket.on('give-user-list', (users) => {
    Game.playerList = [];
    for(i = 0; i < users.length; i++) {
        let tmpPlayer = new localPlayer(users[i].userID, users[i].name, users[i].connectStatus, users[i].role, users[i].status, users[i].image);
        Game.addPlayer(tmpPlayer);
    }
    /*console.log("Connected Players: ");
    console.log(Game.playerList);*/
    listUsers(users);
});

//Game State vom Server wird übermittelt
socket.on('update-gameState', (gameState) => {
    Game.state = gameState;
    console.log("updated gameState: " + Game.state);
});

socket.on('you-are-dead', () => {
    showDeathScreen();
}) 

//Server übermittelt dem Client, dass ein bestimmter Style angenommen werden soll
socket.on('change-style', (phase) => {
    console.log("Change style to: " + phase)
    changeStyle(phase)
})



//Spiel wird auf aktuellen Zustand gebracht. Wird gesendet falls der Spieler die Seite neu lädt
socket.on('update-game', (gameState, role, playerState, playerStatus, text, mainInfo) => {
    Game.state = gameState;
    Game.currentText = text;
    console.log(mainInfo)
    Game.citizenImage = mainInfo.citizenImage;
    Game.werewolfImage = mainInfo.werewolfImage;
    Game.seerImage = mainInfo.seerImage;
    Game.witchImage = mainInfo.witchImage;
    thisPlayer.role = role;
    thisPlayer.status = playerStatus;
    thisPlayer.status = playerStatus;
    console.log("updated gameState: " + Game.state);
    changeStyle("night")
    if(thisPlayer.status === "dead") {
        changeStyle("dead")
        death();
    } else if(gameState === "joining") {
        waitForPlayers();
        changeStyle("night")
    } else if(gameState === "Get-Ready") {
        showRoles();
        changeStyle("night")
    } else if(gameState === "Character-Selection") {
        characterSelection();
        changeStyle("night")
        if(playerState === "createdChar") {
            finishedCharacter();
        }
    } else if(gameState === "Intro") {
        hideAll();
        changeStyle("night")
    } else if(gameState === "Loading") {
        showLoadingScreen();
        changeStyle("night")
    } else if(gameState === "Sleep") {
        goToSleep()
    } else if(gameState === "WerewolfSelection") {
        changeStyle("werewolf")
        console.log(playerState)
        if(role === "Werwolf" && playerState !== "votedVictim") {
            initWerewolfSelection()
        } else {
            goToSleep()
        }
    } else if(gameState === "SeerSelection") {
        changeStyle("seer")
        if(role === "Seher") {
            initSeerSelection();
        } else {
            goToSleep()
        }
    } else if(gameState === "SeerView") {
        changeStyle("seer")
        if(role === "Seher") {
            goToSleep();
        } else {
            goToSleep();
        }
    } else if(gameState === "witchHealSelection") {
        changeStyle("witch")
        if(role === "Hexe") {
            initWitchHealSelection();
        } else {
            goToSleep();
        }
    } else if(gameState === "witchKillSelection") {
        changeStyle("witch")
        if(role === "Hexe") {
            initWitchKillSelection();
        } else {
            goToSleep();
        }
    } else if(gameState === "morningLoading") {
        changeStyle("day")
        showMorningScreen();
    } else if (gameState === "morningEntry"){
        //showMorningEntry(Game.currentText);////
        changeStyle("day")
        //initVoting(); ///MUSS WEG
    } else if(gameState === "voting") {
        changeStyle("day")
        if(playerState !== "voted") {
            initVoting();
        } else {
            finishedVotingSelection()
        }
    } else if (gameState === "voteCount") {
        changeStyle("day")
        showCountScreen()
    } else if (gameState === "execution") {
        changeStyle("day")
        showExecutionScreen()
    } else if(gameState === "werewolfsWon") {
        changeStyle("day")
    } else if(gameState === "villageWon") {
        changeStyle("day")
    } else if(gameState === "hideAllNight") {
        hideAll()
    } else {
        console.log("No game available");
        localStorage.removeItem("sessionID");
        //sessionStorage.removeItem("sessionID");
        socket.disconnect();
        location.reload();
    }
});


// Der Server benachrichtigt den client, dass das Spiel endet
socket.on('game-end', (winner) => {
    showEnding(winner)
})

//Server benachrichtigt dem Client, dass er gestorben ist
socket.on('you-are-dead', () => {
    changeStyle("dead")
    death();
});

//Funktion falls der Spieler gestorben ist: Entferne alle socket events. Fügt dann, dass game-end event wieder hinzu
function death() {
    console.log("You have died");
    socket.removeAllListeners();
    showDeathScreen();
    socket.on('game-end', (winner) => {
        if(winner === "werewolfs") {
            showEnding(winner)
        } else if (winner == "village") {
            showEnding(winner)
        }
    })
}





