
//Hilfsfunktion um alle Div-Elemente auszublenden die den "Game"-Klassennamen haben. Blendet alles aus, außer die Spielerliste und Hilfsansichten
function hideAll() {
    let divs = document.getElementsByTagName('div');
    for(var i = 0; i < divs.length; i++) {
        if(divs[i].classList.contains("game")) {
            divs[i].style.display = "none";
        }
    }
    showList();
}

//Hilfsfunktion, welche aus einer Liste an Button-Elementen alle Buttons deaktiviert außer jener, welcher ausgewählt werden soll
function selectButton(buttons, selectedButton) {
    buttons.forEach(function(button) {
        if(button === selectedButton) {
            selectedButton.classList.add("selected")
        } else {
            button.classList.remove("selected")
        }
    })
}




/*---------------Game-Start-------------*/

function waitForPlayers() {
    hideAll();
    document.getElementById("waitForPlayers").style.display = "block";
}

function showLoadingScreen() {
    hideAll();
    document.getElementById("loadingScreen").style.display = "block";
}

function goToSleep() {
    hideAll();
    document.getElementById("sleepScreen").style.display = "block";
}

function showJoinButton() {
    hideAll();
    console.log("FunctionGUI: ");
    console.log(document.getElementById("joining"));
    document.getElementById("joining").style.display = "block";
}

function showList() {
    document.getElementById("playerList").style.display = "block";
}

function hideList() {
    document.getElementById("playerList").style.display = "none";
    document.getElementById("open-list-button").style.display = "none";
    document.getElementById("close-list-button").style.display = "none";
}

function hidePhone() {
    hideAll();
    document.getElementById("hide-phone").style.display = "block";
}

function characterSelection() {
    hideAll();
    document.getElementById("characterSelection").style.display = "block";
}

function finishedCharacter() {
    hideAll();
    document.getElementById("characterSelection").style.display = "none";
    document.getElementById("waitForPlayers").style.display = "block";
}

function showRoles() {
    hideAll();
    document.getElementById("waitForPlayers").style.display = "none";
    document.getElementById("roleTitle").innerHTML = thisPlayer.role;
    document.getElementById("viewRole").style.display = "block";
    let button = document.getElementById("readyBtn");
    button.addEventListener("click", function() {
        button.style.display = "none"
    })
    roleImage = document.getElementById("roleCard");
    roleText = document.getElementById("roleText")
    console.log(Game.citizenImage)
    switch(thisPlayer.role) {
        case "Dorfbewohner":
            if(Game.citizenImage !== "none" && Game.citizenImage !== undefined) {
                roleImage.src = Game.citizenImage
            } else {
                roleImage.src = "/images/BackUp/Citizen.png"
            }
            roleText.innerHTML = "Du hast keine besonderen Fähigkeiten. \nDeine einzigen Waffen sind dein scharfer Sinn für verdächtiges Verhalten und die Fähigkeit, die anderen von deiner Unschuld zu überzeugen."
            break;
        case "Werwolf":
            if(Game.werewolfImage !== "none" && Game.werewolfImage !== undefined) {
                roleImage.src = Game.werewolfImage
            } else {
                roleImage.src = "/images/BackUp/Werewolf.png"
            }
            roleText.innerHTML = "Jede Nacht frisst du, in Abstimmung mit den anderen Werwölfen, einen Dorfbewohner. Das Opfer scheidet aus der Partie aus und darf für den Rest der Partie nicht mehr kommunizieren. \nTagsüber musst du versuchen, deine wahre Identität zu verbergen..."
            break;
        case "Seher":
            if(Game.seerImage !== "none" && Game.seerImage !== undefined) {
                roleImage.src = Game.seerImage
            } else {
                roleImage.src = "/images/BackUp/Seer.png"
            }
            roleText.innerHTML = "Du musst den anderen Dorfbewohnern helfen, dabei aber sehr bedacht vorgehen, da du sonst von den Werwölfen entdeckt wird. \nJede Nacht erkennt du die wahre Identität eines Spielers deiner Wahl."
            break;
        case "Hexe":
            if(Game.witchImage !== "none" && Game.witchImage !== undefined) {
                roleImage.src = Game.witchImage
            } else {
                roleImage.src = "/images/BackUp/Witch.png"
            }
            roleText.innerHTML = "Du kannst zwei sehr mächtige Zaubertränke brauen: \nEinen Heiltrank, um ein Opfer der Werwölfe vor dem Tod zu bewahren, und einen Gifttrank, um des Nachts einen beliebigen Spieler zu eliminieren. \nDie Hexe kann diese Zaubertränke jeweils nur einmal im Verlauf einer Partie nutzen."
            break;
    }
    roleText.style.display = "block"
    roleImage.style.display = "block"
}


/*---------------Werewolf-Phase-------------*/

///Liste der möglichen Opfer der Werwölfe mit einem Button
function werewolfSelection() {
    hideAll()

    let list = document.getElementById("victimList");
    list.innerHTML = '';
    let players = Game.playerList;
    for(i = 0; i < players.length; i++) {
        if(players[i].role !== "Werwolf" && players[i].status !== "dead") {
            const listElement = document.createElement('li');
            listElement.classList.add("list-group-item");
            listElement.classList.add("selection-list-item");

            //Button zur Auswahl des Spielers mit seinem Namen
            const buttonElement = document.createElement('button');
            //buttonElement.classList.add("btn");
            buttonElement.classList.add("btn-outline-dark");
            buttonElement.classList.add("btn-lg");
            buttonElement.classList.add("select-list-button");
            buttonElement.classList.add("werewolf-select-list-button");//ENTFERNEN ? NOCHMAL CHECKEN
            buttonElement.innerText = players[i].name;
            buttonElement.socketID = players[i].ID;

            //Bild, dass neben dem Namen angezeigt wird
            let image = players[i].image;
            if(image === undefined || image === null || image === "none") {
                image = "/images/BackUp/AvatarFrog.png"
            }
            const imageElement = document.createElement('img');
            imageElement.src = image;
            imageElement.style.width = '100px';
            imageElement.style.height = '100px';

            listElement.appendChild(imageElement);
            listElement.appendChild(buttonElement);
            list.appendChild(listElement);
        }

    }

    //Auswahllogik hinzufügen. Sobald eine Auswahl getroffen wurde, wird der class list "selected hinzugefügt"
    let buttons = list.querySelectorAll("button");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            if(button.classList.contains("selected")) {
                button.classList.remove("selected")
                document.getElementById("werewolfConfirmBtn").style.display = "none";
            } else {
                selectButton(buttons, button);
                document.getElementById("werewolfConfirmBtn").style.display = "block";
            }
        })
    })

    document.getElementById("werewolfSelection").style.display = "block";
    changeStyle(currentStyle)
    //Buttons werden wieder lobby.js übermittelt. Hier werden erneut eventListener hinzugefügt, welche dem Server übermitteln wenn ein Spieler ausgewählt wurde.
    return buttons;
}

//TODO
function finishedWerewolfSelection() {
    hideAll();
    goToSleep();
}


/*---------------Seer-Phase-------------*/

///Liste der möglichen Opfer der Werwölfe mit einem Button
function seerSelection() {
    hideAll();

    let list = document.getElementById("seerList");
    list.innerHTML = '';
    let players = Game.playerList;
    for(i = 0; i < players.length; i++) {
        console.log(players[i].role)
        if(players[i].role !== "Seher" && players[i].status !== "dead") {
            const listElement = document.createElement('li');
            listElement.classList.add("list-group-item");
            listElement.classList.add("selection-list-item");

            //Button zur Auswahl des Spielers mit seinem Namen
            const buttonElement = document.createElement('button');
            buttonElement.classList.add("btn-outline-dark");
            buttonElement.classList.add("btn-lg");
            buttonElement.classList.add("select-list-button");
            buttonElement.innerText = players[i].name;
            buttonElement.socketID = players[i].ID;

            //Bild, dass neben dem Namen angezeigt wird
            let image = players[i].image;
            if(image === undefined || image === null || image === "none") {
                image = "/images/BackUp/AvatarFrog.png"
            }
            const imageElement = document.createElement('img');
            imageElement.src = image;
            imageElement.style.width = '100px';
            imageElement.style.height = '100px';

            listElement.appendChild(imageElement);
            listElement.appendChild(buttonElement);
            list.appendChild(listElement);
        }

    }

    //Auswahllogik hinzufügen. Sobald eine Auswahl getroffen wurde, wird der class list "selected hinzugefügt"
    let buttons = list.querySelectorAll("button");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            if(button.classList.contains("selected")) {
                button.classList.remove("selected")
                document.getElementById("seerConfirmBtn").style.display = "none";
            } else {
                //Hilfsfunktion: Alle außer der Ausgewählte Button sollen als unausgewählt angezeigt werden
                selectButton(buttons, button);
                document.getElementById("seerConfirmBtn").style.display = "block";
            }
        })
    })

    document.getElementById("seerSelection").style.display = "block";
    changeStyle(currentStyle)
    //Buttons werden wieder lobby.js übermittelt. 
    return buttons;
}

//TODO
function finishedSeerSelection(role, name) {
    hideAll();
    document.getElementById("seerView").style.display = "block";
    document.getElementById("seerName").innerHTML = name;
    document.getElementById("seerRole").innerHTML = role;
}


/*---------------Witch-Phase-------------*/

///Falls es ein Opfer der Werwölfe gibt: Auswahl ob Spieler geheilt werden soll
function witchHealSelection(target) {
    hideAll()
    console.log("Hello")

    let list = document.getElementById("healList");
    list.innerHTML = '';
    let players = Game.playerList;
    console.log(target)
    for(i = 0; i < players.length; i++) {
        console.log(players[i].ID === target)
        if(players[i].ID === target) {
            const listElement = document.createElement('li');
            listElement.classList.add("list-group-item");
            listElement.classList.add("selection-list-item");
            listElement.classList.add("heal");

            textElement = document.createElement("p")
            textElement.classList.add("witch-heal-name");
            textElement.textContent = players[i].name;

            //listElement.textContent = players[i].name;

            //Bild, dass neben dem Namen angezeigt wird
            let image = players[i].image;
            if(image === undefined || image === null || image === "none") {
                image = "/images/BackUp/AvatarFrog.png"
            }
            const imageElement = document.createElement('img');
            imageElement.src = image;
            imageElement.style.width = '100px';
            imageElement.style.height = '100px';

            listElement.appendChild(imageElement);
            listElement.appendChild(textElement);
            list.appendChild(listElement);
        }

    }

    document.getElementById("witchHealSelection").style.display = "block";
    changeStyle(currentStyle)
}


///Liste der möglichen Opfer der Werwölfe mit einem Button
function witchKillSelection() {
    hideAll()

    let list = document.getElementById("witchKillList");
    list.innerHTML = '';
    let players = Game.playerList;
    
    for(i = 0; i < players.length; i++) {
        console.log(players[i].status)
        if(players[i].role !== "Hexe" && players[i].status !== "dead" && players[i].status !== "targeted") {
            const listElement = document.createElement('li');
            listElement.classList.add("list-group-item");
            listElement.classList.add("selection-list-item");
            listElement.classList.add("kill");

            //Button zur Auswahl des Spielers mit seinem Namen
            const buttonElement = document.createElement('button');
            //buttonElement.classList.add("btn");
            buttonElement.classList.add("select-list-button");
            buttonElement.classList.add("btn-outline-dark");
            buttonElement.classList.add("btn-lg");
            buttonElement.innerText = players[i].name;
            buttonElement.socketID = players[i].ID;

            //Bild, dass neben dem Namen angezeigt wird
            let image = players[i].image;
            if(image === undefined || image === null || image === "none") {
                image = "/images/BackUp/AvatarFrog.png"
            }
            const imageElement = document.createElement('img');
            imageElement.src = image;
            imageElement.style.width = '100px';
            imageElement.style.height = '100px';

            listElement.appendChild(imageElement);
            listElement.appendChild(buttonElement);
            list.appendChild(listElement);
        }

    }

    //Auswahllogik hinzufügen. Sobald eine Auswahl getroffen wurde, wird der class list "selected hinzugefügt"
    let buttons = list.querySelectorAll("button");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            if(button.classList.contains("selected")) {
                button.classList.remove("selected")
                document.getElementById("witchKillConfirmBtn").style.display = "none";
            } else {
                selectButton(buttons, button);
                document.getElementById("witchKillConfirmBtn").style.display = "block";
            }
        })
    })

    document.getElementById("witchKillSelection").style.display = "block";
    //Buttons werden wieder lobby.js übermittelt. Hier werden erneut eventListener hinzugefügt, welche dem Server übermitteln wenn ein Spieler ausgewählt wurde.
    changeStyle(currentStyle)
    return buttons;
}


/*---------------Morning-Phase-------------*/

function showMorningScreen() {
    hideAll();
    document.getElementById("morningScreen").style.display = "block";
}

/*---------------Day-Phase-------------*/

function votingSelection() {
    hideAll()

    let list = document.getElementById("votingList");
    list.innerHTML = '';
    let players = Game.playerList;
    for(i = 0; i < players.length; i++) {
        console.log(players[i].role)
        if(players[i].status !== "dead" && players[i].ID !== thisPlayer.ID) {
            const listElement = document.createElement('li');
            listElement.classList.add("list-group-item");
            listElement.classList.add("selection-list-item");

            //Button zur Auswahl des Spielers mit seinem Namen
            const buttonElement = document.createElement('button');
            buttonElement.classList.add("btn-outline-dark");
            buttonElement.classList.add("btn-lg");
            buttonElement.classList.add("select-list-button");
            buttonElement.innerText = players[i].name;
            buttonElement.socketID = players[i].ID;

            //Bild, dass neben dem Namen angezeigt wird
            let image = players[i].image;
            if(image === undefined || image === null || image === "none") {
                image = "/images/BackUp/AvatarFrog.png"
            }
            const imageElement = document.createElement('img');
            imageElement.src = image;
            imageElement.style.width = '100px';
            imageElement.style.height = '100px';

            listElement.appendChild(imageElement);
            listElement.appendChild(buttonElement);
            list.appendChild(listElement);
        }

    }

    //Auswahllogik hinzufügen. Sobald eine Auswahl getroffen wurde, wird der class list "selected hinzugefügt"
    let buttons = list.querySelectorAll("button");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            if(button.classList.contains("selected")) {
                button.classList.remove("selected")
                document.getElementById("votingConfirmBtn").style.display = "none";
            } else {
                selectButton(buttons, button);
                document.getElementById("votingConfirmBtn").style.display = "block";
            }
        })
    })

    document.getElementById("votingSelection").style.display = "block";
    //Buttons werden wieder lobby.js übermittelt. Hier werden erneut eventListener hinzugefügt, welche dem Server übermitteln wenn ein Spieler ausgewählt wurde.
    changeStyle(currentStyle)
    return buttons;
}

function finishedVotingSelection() {
    hideAll();
    document.getElementById("waitForPlayers").style.display = "block";
}

function showCountScreen() {
    hideAll();
    document.getElementById("executionScreen").style.display = "block";
}

function showExecutionScreen() {
    hideAll();
    document.getElementById("executionScreen").style.display = "block";
}

/*---------------Update-Game-------------*/

//Liste alle User auf mit ihrem Bild
function listUsers() {
    let list = document.getElementById("playerList");
    closeButton = document.getElementById("close-list-button");
    openButton = document.getElementById("open-list-button")
    list.innerHTML = '';
    list.appendChild(closeButton)
    list.appendChild(openButton)
    let players = Game.playerList;
    for(i = 0; i < players.length; i++) {
        const listElement = document.createElement('li');
        listElement.classList.add("list-group-item");
        listElement.classList.add("player-list-item")
        if(players[i].status === "dead") {
            listElement.classList.add("player-list-dead")
        }

        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add("list-wrapper")

        //Name des Nutzers - Falls es sich um den Spieler handelt wird ein "(Ich)"" hinter den Namen gesetzt
        textElement = document.createElement("p")
        textElement.classList.add("list-name");
        //listElement.textContent = players[i].name;
        textElement.textContent = players[i].name;
        if(players[i].ID === thisPlayer.ID) {
            //listElement.textContent = listElement.textContent + " (Ich)"
            textElement.textContent = players[i].name + " (Ich)";
        }
        if(players[i].status === "dead") {
            textElement.textContent = "✝ " + players[i].name + ": " + players[i].role;
        }

        //Bild des Nutzers - solange es generiert wird, zeigt es eine Ladeanimation
        let image = players[i].image;
        if(image === undefined || image === null || image === "none") {
            image = "/images/BackUp/AvatarFrog.png"
        }
        const imageElement = document.createElement('img');
        imageElement.classList.add("list-image");
        imageElement.src = image;
        imageElement.style.width = '100px';
        imageElement.style.height = '100px';
        wrapperDiv.appendChild(textElement)
        wrapperDiv.appendChild(imageElement)
        

        listElement.appendChild(wrapperDiv);
        list.appendChild(listElement);
        listElement.addEventListener("click", function() {
            closeList()
        })
    }

    //NEW

    //NEW

    if(closeButton.style.display === "block") {
        openList()
    } else {
        closeList()
    }
    
    
}

//Lädt sobald das Dokument geladen hat
document.addEventListener("DOMContentLoaded", function(){
    //ListenmenüLogik: Öffnen und schließen des Listenmenüs
    document.getElementById("close-list-button").addEventListener("click", function() {
        closeList()
    })

    document.getElementById("open-list-button").addEventListener("click", function() {
        openList()
    })
});

function closeList() {
    console.log(document.querySelectorAll(".player-list-item"))
    document.querySelectorAll(".player-list-item").forEach(element => {
        element.style.display = "none";
    })
    document.getElementById("close-list-button").style.display = "none"
    document.getElementById("open-list-button").style.display = "block"
}

function openList() {
    document.querySelectorAll(".player-list-item").forEach(element => {
        element.style.display = "block";
    })
    document.getElementById("close-list-button").style.display = "block"
    document.getElementById("open-list-button").style.display = "none"
}

function initList() {
    showList()
}

function showDeathScreen() {
    hideAll();
    document.getElementById("deathScreen").style.display = "block"
}


function showEnding(winner) {
    hideAll();
    document.getElementById("endScreen").style.display = "block"
    if(winner === "village") {
        changeStyle("day")
        document.getElementById("endingText").innerHTML = "Das Dorf hat gewonnen!"
    } else if(winner === "werewolfs") {
        changeStyle("werewolf")
        document.getElementById("endingText").innerHTML = "Die Werwölfe haben gewonnen!"
    } else {
        changeStyle("night")
        document.getElementById("endingText").innerHTML = "Niemand hat überlebt..."
    }
}



