const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const Player = require('./server_modules/Player');
const GameLogic = require('./server_modules/GameLogic');
const AILogic = require('./server_modules/openAI');
const Session = require('./server_modules/Session');
const ElevenLabs = require('./server_modules/elevenLabs_functions')
const { randomUUID } = require('crypto');
const info = require('./server_modules/mainScreenInfo.js');
const { default: OpenAI } = require('openai');
const mainInfo = info.mainScreenInfo;
console.log(mainInfo.phase)
const nightScreenDelay = 15000;

let gameLogic = GameLogic.getGameLogic();
const sessions = new Session();

AILogic.initOpenAI();

const publicPath = path.join(__dirname, '/../public');
const port = 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
const mainScreen = io.of("/main");

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

//Route zur Startseite
app.get('/', (req, res) => {
    if(gameLogic.state === "None") {
        sessions.clearAll();
        res.redirect(`/mainScreen`);
    } else {
        res.redirect(`/game`);
    }
    
})

app.get('/mainScreen', (req, res) => {
    res.render('mainScreen')
})

app.get('/test', (req, res) => {
    //res.render('test')
    /*ElevenLabs.tts("Test lol").then((response) => {
        console.log(response)
        ElevenLabs.play_audio(response)
        
        res.render('test')
    })*/
    /*ElevenLabs.generate_sound("Birds singing").then((response) => {
        console.log(response)
        
        res.render('test', {audioOutput: response})
    })*/
    /*ElevenLabs.generate_sound("Birds singing").then((response) => {
        console.log(response);
        const audioURL = response[Symbol(state)].urlList;
        console.log(audioURL)

        // Convert response body to JSON
        res.render('test', {audioOutput: audioURL})
    })*/
    /*AILogic.testAllImages().then((testObject) => {
        console.log(testObject)
        res.render('test', testObject)
    })*/

    let Hans = new Player("0", "Werewolf");
    gameLogic.addPlayer(Hans);
    Hans.setCharacterTraits("Hans", "Er/Ihm", "35", "Der Bäcker des Dorfes. Jeder liebt seine Brötchen. Er hat rote Haare und blaue Augen.");

    let Wurmi = new Player("1", "Dorfbewohner");
    gameLogic.addPlayer(Wurmi);
    Wurmi.setCharacterTraits("Wurmi", "Er/Ihm", "55", "Ein durch einen Zauberspruch in einen Frosch verwandelter Mensch. Er lebt seit einigen Jahren im Dorf und trägt stets seinen liebsten Hut.");

    let Bernda = new Player("2", "Hexe");
    gameLogic.addPlayer(Bernda);
    Bernda.setCharacterTraits("Bernda", "Sie/Ihr", "77", "Die Dorfälteste. Sie hat immer ein offenes Ohr für die anderen Mitbewohner. Sie hat graue Haare und ein altes, faltiges Gesicht.");

    let Lennard = new Player("3", "Werwolf");
    gameLogic.addPlayer(Lennard);
    Lennard.setCharacterTraits("Lennard", "Er/Ihm", "202", "Ein alter Graf. Sehr eingebildet und arrogant anderen gegenüber. Seine dünnen schwarzen Haare werden meist von einem teuren Zylinder verdeckt. Er sitzt meistens alleine in seinem Haus und zeichnet.");

    let Anna = new Player("4", "Seher");
    gameLogic.addPlayer(Anna);
    Anna.setCharacterTraits("Anna", "Sie/Ihr", "19", "Die jüngste der Gemeinschaft. Sie hat lange rosane Haare. Anna liebt es zu tanzen und trink auch gerne mal etwas zu viel. Sie trägt häufig eine lange Kette ihrer verstorbenen Mutter.");

    AILogic.testAllEntries(Hans, Wurmi, Bernda, Lennard, Anna).then((testObject) => {
        console.log(testObject)
        res.render('test', testObject)
    })
})

//Einstellungen werden an den Server übergeben und dort validiert
app.post('/options', (req, res) => {
    let check = checkGameOptions(parseInt(req.body.playerCount), parseInt(req.body.citizenCount), parseInt(req.body.werewolfCount), req.body.witch, req.body.seer);
    console.log("Check: " + check);
    if(check === true) {
        gameLogic.state = "joining";
        gameLogic.setPlayerCount(parseInt(req.body.playerCount), parseInt(req.body.citizenCount), parseInt(req.body.werewolfCount), req.body.witch === "witch", req.body.seer === "seer");
        AILogic.giveRoleCard("a group of ordinary citizens. Normal clothing for the middle ages. Different age groups. Men and woman. Yellow and plain colors.").then((image) => {
            mainInfo.citizenImage = image;
            //Normal clothing for the middle ages. Yellow and plain colors.
        });
        AILogic.giveRoleCard("a werewolf. Evil and scary. Sharp teeth. Dark Red and black colors. A full moon. Red background.").then((image) => {
            mainInfo.werewolfImage = image;
            //Evil and scary. Sharp teeth. Dark Red and black colors. A full moon.
        });
        AILogic.giveRoleCard("a fortune teller. Holding her hands over a crystal ball. Mystical. Visions. Eyes everywhere. Violet and yellow Color.").then((image) => {
            mainInfo.seerImage = image;
            //Having a crystal ball to tell the future. Mystical. Eyes everywhere. Violet Color.
        });
        AILogic.giveRoleCard("a witch. Dancing around a kettle with boiling water. Magical. Green, Yellow and Orange colors. Potions. Snake. Poison.").then((image) => {
            mainInfo.witchImage = image;
            //She is dancing around a cessel with boiling water. Magical. Green and Orange colors. Poisen.
        });
        AILogic.givePortrait().then((image) => {
            mainInfo.GPTImage = image;
        });
        res.status(200).send('Options updated successfully');
    } else {
        gameLogic.state = "None";
        res.status(400).send('Anzahl der Rollen stimmen nicht mit Spieleranzahl überein'); 
    }
})

//Route für das eigentliche Spiel
app.get('/game', (req, res) => {
    if(gameLogic.state === "None") {
        res.redirect('/unavailable/notStarted');
    } else {
        res.render('game');
    }
    
})

//Route falls Seite nicht erreichbar mit Begründung
app.get('/unavailable/:code', (req, res) => {
    res.render("unavailable", {message: getUnavailableMessage(req.params.code)});
})

server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
})

//io.use to check if user already has a sessionID address and make sure that users that have a address but are not known to the server are identified as old user 
io.use((socket, next) => {
    //console.log(socket.handshake.auth.USER_ID);
    const sessionID = socket.handshake.auth.sessionID;
    console.log(sessionID);
    if (sessionID) {
        const currentSession = sessions.getSessionByID(sessionID);
        console.log("Current Session:");
        console.log(currentSession);
        if(currentSession) {
            console.log("Session is there");
            socket.sessionID = sessionID;
            socket.userID = currentSession.userID;
            return next();
        }
        //Ein Nutzer hat eine Addresse, sie gehört aber zu keiner Session. Es handelt sich um einen Nutzer von einem vorherigen Spiel 
        console.log("Old User");
        socket.old = true;
        next();
    //Sicherung dafür, dass keine Session erstellt wird, solang das Spiel nicht gestartet hat
    } else if(gameLogic.slotsAvailable() < 1 || gameLogic.state === "None" || gameLogic.state === "options"){
        console.log("Old User");
        socket.old = true;
        next();
    } else {
        console.log("create new ID");
        socket.sessionID = randomUUID();
        socket.userID = randomUUID();
        sessions.addSession(socket.sessionID, {
            userID: socket.userID,
            connectStatus: "Connected"
        });
    
        next();
    }
    
});

// Sobald die connection aufgebaut wurde
io.on('connection', (socket) => {

    /*-----------Connecting------------*/

    //Falls es sich um einen alten Nutzer handelt, wird die SessionID auf clientseite gelöscht und die Verbindung getrennt
    if(socket.old) {
        io.to(socket.id).emit('old-user');
        return;
    }
    // Überreicht dem client seine Socket ID
    socket.emit('give-client-id', {
        sessionID: socket.sessionID,
        userID: socket.userID
    });

    // Der Nutzer tritt einen room mit der eigenen user ID bei. Mit diesem wird er addressiert
    socket.join(socket.userID);
    

    //Falls es bereits eine Player instanz mit der userID gibt, wird getestet ob dieser bereits eine Rolle zugeordnet wurde
    if(typeof gameLogic.getPlayerByID(socket.userID) !== 'undefined') {
        //Der Spieler tritt einem room für seine Spielerrolle bei. Mit diesem werden alle Spieler der Rolle addressiert
        if(gameLogic.getPlayerByID(socket.userID).role !== 'undefined')
            socket.join(gameLogic.getPlayerByID(socket.userID).role)
    }

    /*-----------Game-Start------------*/

    //Nutzer möchte dem Spiel beitreten
    socket.on('join-game', (userID) => {
        console.log("-----JOIN GAME------");

        //Falls das Spiel noch nicht gestartet wurde, sich aber ein Nutzer mit einer ID von einem vorherigen Spiel einloggen möchte (Da keine IO connection benötigt wird, kann es passieren, dass Nutzer den join btn klicken können obwohl noch kein Spiel gestartet wurde)
        if(gameLogic.state === "None" || gameLogic.state === "options") {
            io.to(socket.id).emit('old-user');
            return;
        }

        console.log("Slots Available:" + gameLogic.slotsAvailable());
        //Slots sind Verfügbar -> Spieler wird eine Rolle zugeteilt
        if(gameLogic.slotsAvailable() > 0) { 
            let playerRole = gameLogic.selectRole();
            let newPlayer = new Player(socket.userID, playerRole);
            gameLogic.addPlayer(newPlayer);
            console.log(gameLogic.playerList);
            console.log("Player By ID: " + socket.userID);
            console.log(gameLogic.getPlayerByID(socket.userID));

            //Der Spieler tritt einem room für seine Spielerrolle bei. Mit diesem werden alle Spieler der Rolle addressiert
            socket.join(playerRole)
            if(playerRole === "Werwolf") {
                gameLogic.werewolfList.push(gameLogic.getPlayerByID(socket.userID))
            } 

            //Client die Rolle übergeben
            io.to(socket.userID).emit('get-role',
                playerRole,
                mainInfo
            );
            updateList();

            //Teste ob noch slots verfügbar sind. Wenn nicht, allen Clients das Signal geben, die Rollen zu zeigen
            if(gameLogic.slotsAvailable() === 0) {
                io.emit('change-style', "night")
                mainScreen.emit('hide-phone');
                
                for(let i = 0; i < gameLogic.playerList.length; i++) {
                    console.log(gameLogic.playerList[i]);
                }
                gameLogic.state = "Get-Ready";

                io.emit('hide-phone');
                mainInfo.phase = "HidePhone";
                setTimeout(function() {
                    mainScreen.emit('look-roles');
                    mainInfo.phase = "LookRoles";
                    io.emit('show-roles');
                }, 10000)
                
            }
        } else {
            console.log("We are full!");
            io.to(socket.userID).emit('lobby-full');
        }
    })

    //Warte bis alle spieler bereit sind TODO -> An Game Logic auslagern
    socket.on('player-ready', (userID) => {
        console.log("I am ready!")
        gameLogic.getPlayerByID(socket.userID).state = "ready";
        io.to(socket.userID).emit("hide-all");
        
        //Sobald alle Spieler ihre Rolle geshen und verstanden haben 
        if(gameLogic.playerList.every(index => index.state === "ready")) {
            console.log("Everyone is ready!")
        

            AILogic.givePortrait().then((image) => {
                mainInfo.GPTImage = image;
                mainScreen.emit('game-intro', mainInfo);
                io.emit("hide-all");
                gameLogic.state = "hideAllNight";
            });
        } else {
            console.log("Not everyone is ready yet");
        }
    })

    //Charakterdaten werden übermittelt TODO -> Lagere Logik zum erstellen von Spielern an Game Logic aus
    socket.on('character-data', (name, pronouns, age, description) => {

        let player = gameLogic.getPlayerByID(socket.userID);
        player.setCharacterTraits(name, pronouns, age, description);
        console.log(player);
        player.state = "createdChar";
        player.image = "/images/loading.gif";
        updateList();
        AILogic.giveAvatar(pronouns, age, description).then((result) => {
            console.log("Server result: " + result);
            player.image = result;
            updateList();
        });
        
        if(gameLogic.playerList.every(index => index.state === "createdChar")) {
            console.log("Everyone is ready!")
            io.emit("hide-all");
            gameLogic.state = "hideAllNight";
            generateIntro();
            

        } else {
            console.log("Not everyone is ready yet");
        }
        
    })

    function generateIntro() {
        io.emit("show-loadingScreen");
        //Während das Intro generiert wird, soll ein Ladebildschirm erscheinen
        gameLogic.state = "Loading";
        //AI Call für das Intro
        //Erst wird der Antwort Text generiert -> Sobald dieser fertig ist wird er genutz um audio zu generieren -> Der text wird dem Client übermittelt um angezeigt zu werden und die Play funktion wird aufgerufen => sobald Audio endet wird die nächste Spielphase begonnen
        AILogic.giveIntroduction().then((textResult) => {
            ElevenLabs.tts(textResult).then((audio) => {
                gameLogic.state = "Intro";
                gameLogic.intro = textResult;
                mainInfo.text = textResult;
                //io.emit("show-intro", textResult);

                AILogic.giveIntroPicture(textResult).then((image) => {
                    mainScreen.emit("show-intro", textResult, image);
                    mainInfo.introImage = image;
                    ElevenLabs.play_audio(audio).then(() => {
                        //Wait a bit before the next phase starts
                        setTimeout(() => {
                            goToSleep()
                        }, 1000)
                    })
                });
                
            })  
        })
    }


    /*-----------Night-Phase------------*/

    //Funktion wird aufgerufen, sobald die Nachtphase beginnt
    function goToSleep() {
        gameLogic.state = "Sleep"

        //Setze den Datumstähler einen Tag weiter 
        let newDate = new Date(mainInfo.date)
        newDate.setDate(newDate.getDate() + 1)
        mainInfo.date = newDate;

        for(let i = 0; i < gameLogic.playerList.length; i++) {
            gameLogic.playerList[i].state = "asleep";
        }

        if(mainInfo.sleepImage === "none") {
            AILogic.givePicture("A image of dark forest and with a medieval village in the background, trees in the night, the moon.").then((image) => {
                setTimeout(() => {
                    mainInfo.sleepImage = image;
                    mainScreen.emit("go-to-sleep", mainInfo)
                }, 3000)
                setTimeout(() => {
                    io.emit("go-to-sleep")
                    mainScreen.emit("night-screen")
                    setTimeout(() => {
                        werewolfSelection()
                    }, nightScreenDelay)
                }, 8000)
            });
        } else {
            mainScreen.emit("go-to-sleep", mainInfo)
            setTimeout(() => {
                io.emit("go-to-sleep")
                mainScreen.emit("night-screen")
                setTimeout(() => {
                    werewolfSelection()
                }, nightScreenDelay)
            }, 4000)
        }

    }


    /*-----------Werewolf-Phase------------*/

    //Werwölfe wachen auf und suchen sich ein Opfer
    function werewolfSelection() {
        gameLogic.state = "WerewolfSelection"
        io.emit('change-style', "werewolf")
        mainScreen.emit('werewolf');

        setTimeout(() => {
            io.to("Werwolf").emit("werewolf-selection")
        }, 5000)
    }

    //Wird gesendet, sobald ein Werwolf seine Auswahl getroffen oder abgeändert hat
    //Eine Liste wird erstellt und dem Client übergeben, welches potentielle Opfer wie viele Stimmen hat
    //TODO: Auf Client seite anzeigen lassen bzw. überlegen ob dies sinnvoll wäre
    socket.on('werewolf-selection', (selectedID) => {
        gameLogic.getPlayerByID(socket.userID).vote = selectedID;
        let voteList = gameLogic.checkWerewolfSelection();
        console.log(voteList)
        io.to("Werwolf").emit("werewolf-selection-update", 
            voteList
        )
    })

    //Wird gesendet, sobald ein Werwolf seine Auswahl bestätigt. Sobald alle Werwölfe ihre Auswahl bestätigt haben geht das Spiel in die nächste Phase über
    //TODO: Darstellung nanchdem man bestätigt hat anpassen & Opfer zeigen
    socket.on('confirm-werewolf-selection', () => {
        if (gameLogic.checkWerewolfConfirm(gameLogic.getPlayerByID(socket.userID))) {
            gameLogic.selectVictim()
            io.emit("go-to-sleep")
            //Ändere Stil wieder zu "Nacht"
            io.emit('change-style', "night")
            mainScreen.emit("night-screen")
            gameLogic.state = "Sleep"
            setTimeout(() => {
                updateList()
                if(gameLogic.seerAvailable) {
                    seerSelection();
                } else if(gameLogic.witchAvailable) {
                    witchSelection();
                } else {
                    wakeUp();
                }
            }, nightScreenDelay)
            }
    })


    /*-----------Seer-Phase------------*/

    //Der Seher wacht auf und wählt einen Mitspieler aus
    function seerSelection() {
        gameLogic.state = "SeerSelection"
        mainScreen.emit("seer")
        io.emit('change-style', "seer")
        io.to("Seher").emit("seer-selection")
    }

    //Entnehme die Rolle des Spielers mit der gesendeten ID und schicke sie zum Client 
    //TODO Rolle auch anzeigen auf Clientseite
    socket.on('confirm-seer-selection', (selectedID) => {
        gameLogic.state = "SeerView"
        name = gameLogic.getPlayerByID(selectedID).name;
        role = gameLogic.getPlayerByID(selectedID).role;
        io.to("Seher").emit("seer-show-role",
            role,
            name
        )
        setTimeout(() => {
            io.emit("go-to-sleep")
            gameLogic.state = "Sleep"
            mainScreen.emit("night-screen")
            
            if(gameLogic.witchAvailable) {
                setTimeout(() => {
                    witchSelection();
                }, nightScreenDelay)
            } else {
                wakeUp();
            }
            
        }, 5000)
    })


    /*-----------Witch-Phase------------*/

    //TODO ADD COMMENTS !

    //Die Hexe wacht auf. Es wird geprüft ob sie bereits einen Spieler geheilt oder getötet hat und startet entsprechend die Auswahl
    function witchSelection() {
        mainScreen.emit("witch")
        io.emit('change-style', "witch")
        if(gameLogic.witchHealAvailable) {
            gameLogic.state = "witchHealSelection"
            io.to("Hexe").emit("witch-heal-selection")
        } else if(gameLogic.witchKillAvailable) {
            gameLogic.state = "witchKillSelection"
            io.to("Hexe").emit("witch-kill-selection")
        } else {
            mainScreen.emit("night-screen")
            io.emit("go-to-sleep")
            gameLogic.state = "Sleep"
            setTimeout(() => {
                wakeUp();
            }, 5000)
        }
    }

    //Client erfragt ob es ein Opfer der Werwölfe gibt 
    socket.on('ask-witch-info',() => {
        target = "None";
        for(let i = 0; i < gameLogic.playerList.length; i++) {
            if(gameLogic.playerList[i].state === "targeted") {
                target = gameLogic.playerList[i].ID;
            }
        }

        io.to("Hexe").emit('get-witch-info',
            target,
            gameLogic.witchHealAvailable,
            gameLogic.witchKillAvailable
        )
    })

    //Client übermittelt ob er jemanden heilen kann und will
    socket.on('heal-target-player', (decisionHeal) => {
        if(decisionHeal) {
            for(let i = 0; i < gameLogic.playerList.length; i++) {
                if(gameLogic.playerList[i].state === "targeted") {
                    gameLogic.playerList[i].state = "asleep";
                    gameLogic.witchHealAvailable = false;
                    if(gameLogic.witchKillAvailable === false ) {
                        gameLogic.witchAvailable = false;
                    }
                    console.log("Spared: " + gameLogic.playerList[i].name)
                }
            }
        }
        if(gameLogic.witchKillAvailable) {
            gameLogic.state = "witchKillSelection"
            io.to("Hexe").emit("witch-kill-selection")
        } else {
            mainScreen.emit("night-screen")
            io.emit("go-to-sleep")
            gameLogic.state = "Sleep"
            setTimeout(() => {
                wakeUp();
            }, 5000)
        }
    })

    //Client übermittelt wen er töten will. Falls kein Opfer ausgewählt wurde ist target "None"
    socket.on('witch-kill-decision', (target) => {
        for(let i = 0; i < gameLogic.playerList.length; i++) {
            if(gameLogic.playerList[i].ID === target) {
                gameLogic.witchKillAvailable = false;
                if(gameLogic.witchHealAvailable === false ) {
                    gameLogic.witchAvailable = false;
                }
                gameLogic.playerList[i].state = "targeted";
                console.log("Kill: " + gameLogic.playerList[i].name)
            } 
        }
        mainScreen.emit("night-screen")
        io.emit("go-to-sleep")
        gameLogic.state = "Sleep"
        setTimeout(() => {
            wakeUp();
        }, 5000)
    })


    /*-------------Morning-Phase------------*/

    function wakeUp() {
        console.log("WakeUp")
        let killedPlayer = new Array();
        gameLogic.state = "wakeUp"
        let gameEnds = "None";
        mainInfo.foundDead = false;
        for(let i = 0; i < gameLogic.playerList.length; i++) {
            if(gameLogic.playerList[i].state === "targeted") {
                mainInfo.foundDead = true;
                console.log("Found dead: " + gameLogic.playerList[i].name);
                killedPlayer.push(gameLogic.playerList[i])
                gameEnds = killPlayer(gameLogic.playerList[i])
            } 
        }
        if(gameEnds === "AllDead") {
            allDeadEnding()
        } else if(gameEnds === "Werewolf") {
            werewolfEnding()
        } else if(gameEnds === "Village") {
            villageEnding()
        } else {
            if(mainInfo.wakeUpImage === "none") {
                AILogic.givePicture("The view from a hill towards an old and small village from the middle ages, surrounded by a dark forest.").then((image) => {
                    mainInfo.wakeUpImage = image;
                    generateMorningSpeech(killedPlayer)
                });
            } else { 
                generateMorningSpeech(killedPlayer)
            }
        }
    }

    function generateMorningSpeech(killedPlayer) {
        mainScreen.emit('wake-up', mainInfo);
        io.emit("show-morningScreen");
        //Während das Intro generiert wird, soll ein Ladebildschirm erscheinen
        gameLogic.state = "morningLoading";
        //KILL player before entry and check if game ended
        //AI Call für das Intro
        //Erst wird der Antwort Text generiert -> Sobald dieser fertig ist wird er genutz um audio zu generieren -> Der text wird dem Client übermittelt um angezeigt zu werden und die Play funktion wird aufgerufen => sobald Audio endet wird die nächste Spielphase begonnen
        AILogic.giveMorningEntry(killedPlayer).then((textResult) => {
            ElevenLabs.tts(textResult).then((audio) => {
                gameLogic.state = "morningEntry";
                //io.emit("morning-entry", textResult);
                mainInfo.text = textResult;
                mainScreen.emit("morning-entry", mainInfo)
                //Änder den Stily zu "Tag"
                io.emit('change-style', "day")
                ElevenLabs.play_audio(audio).then(() => {
                    //Wait a bit before the next phase starts
                    setTimeout(() => {
                        updateList();

                        //Die Abstimmung startet, sobald der Text vorgelesen wurde
                        gameLogic.state = "voting";
                        io.emit('start-voting');
                        mainScreen.emit("day");
                        mainScreen.emit("listen");
                    }, 1000)
                })
                
            })  
        })
    }


    /*-------------Day-Phase------------*/

    //Wird gesendet, sobald ein Spieler seine Auswahl getroffen oder abgeändert hat
    //Eine Liste wird erstellt und dem Client übergeben, welcher Spieler, wie viele Stimmen hat
    //TODO: Auf Client seite anzeigen lassen bzw. überlegen ob dies sinnvoll wäre
    socket.on('voting-selection', (selectedID) => {
        gameLogic.getPlayerByID(socket.userID).vote = selectedID;
        let voteList = gameLogic.checkVotingSelection();
        console.log(voteList)
        io.emit("voting-selection-update", 
            voteList
        )
    })

    socket.on('confirm-voting-selection', () => {
        if (gameLogic.checkVotingConfirm(gameLogic.getPlayerByID(socket.userID))) {

            let selected = gameLogic.selectExecution()

            if(selected !== "None") {
                selected = gameLogic.getPlayerByID(selected)
            }
            console.log(selected)

            
            let gameEnds = "None";
            mainInfo.foundDead = false;
            if(selected !== "None") {
                mainInfo.foundDead = true;
                gameEnds = killPlayer(selected)
            }
            //Der main-Screen soll nicht weiter das gesagte Trankribieren
            mainScreen.emit("stop-listening")
            //Falls eine Enbedingung erfüllt wurde, wird keine Morgeneintrag erstellt
            if(gameEnds === "AllDead") {
                allDeadEnding()
            } else if(gameEnds === "Werewolf") {
                werewolfEnding()
            } else if(gameEnds === "Village") {
                villageEnding()
            } else {
                generateExecutionEntry(selected)
            }
        }
    })

    //Der Hinrichtungsbeitrag wird erstellt und eine Audio erstellt
    function generateExecutionEntry(killedPlayer) {

        //Während der Hinrichtungsbeitrag generiert wird, soll ein Ladebildschirm erscheinen
        gameLogic.state = "voteCount"
        io.emit('vote-count')
        //AI Call für den Hinrichtungsbeitrag
        //Erst wird der Antwort Text generiert -> Sobald dieser fertig ist wird er genutz um audio zu generieren -> Der text wird dem Client übermittelt um angezeigt zu werden und die Play funktion wird aufgerufen => sobald Audio endet wird die nächste Spielphase begonnen
        AILogic.giveExecutionEntry(killedPlayer).then((textResult) => {
            ElevenLabs.tts(textResult).then((audio) => {
                gameLogic.state = "executionEntry";
                mainInfo.text = textResult;
                mainScreen.emit("execution", mainInfo);

                io.emit("execution-entry", textResult);
                //Die erstellte Audio wird abgespielt
                ElevenLabs.play_audio(audio).then(() => {
                    //Verzögerung, bevor die nächste Phase beginnt
                    setTimeout(() => {
                        updateList();
                        //Ändere Stil zu "Nacht"
                        io.emit('change-style', "night")
                        goToSleep();
                    }, 1000)
                })
                
            })  
        })
    }


    /*---------------Game-Update-------------*/

    //Client fragt game State an, wird an Client übermittelt
    socket.on("get-gameState", () => {
        io.to(socket.id).emit('update-gameState', 
                gameLogic.state
        )
    });

    //Ein Nutzer hat sich wieder eingeloggt. Zunächst werden ihm alle wichtigen Informationen über die Mitspieler mitgeteilt (updateList()), danch alle wichtigen Informationen über das Spiel und den Nutzer selbst
    socket.on('user-reconnect', () => {
        updateList();
        io.to(socket.id).emit('update-game', 
            gameLogic.state,
            gameLogic.getPlayerByID(socket.userID).role,
            gameLogic.getPlayerByID(socket.userID).state,
            gameLogic.getPlayerByID(socket.userID).status,
            gameLogic.intro,
            mainInfo
        )
    });

    //Wenn ein Spieler disconnected TODO: Connect status ändern und an Liste updaten
    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
    });
});

//Liste der Mitspieler und deren relevanten Informationen für das Frontend, werden übermittelt. Wird aufgerufen sobald im frontend die Liste der Spieler aktualisiert werden muss (Spieler tritt bei, Spieler ist ausgeschieden, neuer Name, Bild etc.) Zum identifzieren der Mitspieler wird die UserID Genutzt welche in dem Session Objekt gespeichert ist
function updateList() {
    const users = [];
    sessions.getAll().forEach((session) => {
        users.push({
            userID: session.userID,
            name: gameLogic.getPlayerByID(session.userID).name,
            connectStatus: session.connectStatus,
            status: gameLogic.getPlayerByID(session.userID).status,
            role: gameLogic.getPlayerByID(session.userID).role,
            image: gameLogic.getPlayerByID(session.userID).image
        });
    });

    //Sende dem Client alle verbundenen Spieler und relevante Informationen
    io.emit('give-user-list', users);
}

//TODO: Wenn ein Spieler ausscheidet muss er bspw. aus der liste der Werwölfe rausgenommen werden, außerdem überprüfen ob ein Spiel endet 
function killPlayer(player) {
    player.status = "dead"
    if(player.role === "Seher") {
        gameLogic.seerAvailable = false;
    } 
    if(player.role === "Hexe") {
        gameLogic.witchAvailable = false;
    }
    if(player.role === "Werwolf") {
        console.log(gameLogic.werewolfList)
        let wIndex = gameLogic.werewolfList.indexOf(player)
        console.log(wIndex)
        gameLogic.werewolfList.splice(wIndex, 1);
        console.log(gameLogic.werewolfList)
    }

    io.to(player.ID).emit('you-are-dead');
    updateList()
    if(gameLogic.playerList.every(index => index.status === "dead")) {
        gameLogic.state = "allDead"
        return "AllDead"
    } else if(gameLogic.werewolfList.every(index => index.status === "dead")) {
        gameLogic.state = "villageWon"
        console.log("Die Dorfbewohner haben gewonnen!")
        return "Village"

    } else if(gameLogic.playerList.filter(index => index.status !== "dead").every(index => index.role === "Werwolf")) {
        gameLogic.state = "werewolfsWon"
        console.log("Die Werwölfe haben gewonnen!")
        return "Werewolf"
    } else {
        return "None";
    }
    
}

//Nachrichten falls das Spiel noch nicht gestartet wurde, gerade von einem anderen Nutzer erstellt wird oder falls versucht wird der Lobby beizutreten, obwohl diese schon voll ist
function getUnavailableMessage(code) {
    if (code === "gameStarted") {
        return "Das Spiele wurde bereits gestartet oder wird gerade erstellt, sorry :(";
    } else if (code === "notStarted"){
        return "Gelduld! Das Spiel hat noch nicht gestartet.";
    } else if(code === "lobbyFull") {
        return "Die Lobby ist leider bereits voll :/";
    } else {
        return "Etwas lief schief :/";
    }
}

//Server-Seite Validierung ob die Anzahl der Rollen mit der Anzahl der angegebenen Spieler übereinstimmt
function checkGameOptions(playerCount, citizenCount, werewolfCount, witchAvailable, seerAvailable) {
    let playerNumber = 0;
    playerNumber = citizenCount + werewolfCount;
    if(witchAvailable === "witch") {
        playerNumber = playerNumber + 1;
    }
    if(seerAvailable === "seer") {
        playerNumber = playerNumber + 1;
    }
    
    return playerCount === playerNumber;
}


function allDeadEnding() {
    console.log("Alle sind tot!")
    AILogic.giveAllDeadEndingEntry().then((textResult) => {
        ElevenLabs.tts(textResult).then((audio) => {
            gameLogic.state = "AllDeadEnd";
            mainInfo.text = textResult;
            mainScreen.emit('game-end', "AllDead", mainInfo)
            io.emit('game-end',
                "None"
            )
            //Die erstellte Audio wird abgespielt
            ElevenLabs.play_audio(audio).then(() => {
                setTimeout(() => {
                    mainScreen.emit('game-outro')
                    io.emit('game-outro')
                }, 2000)
            })
            
        })  
    })
}

function werewolfEnding() {
    console.log("Alle sind tot!")
    AILogic.giveWerewolfEndingEntry().then((textResult) => {
        ElevenLabs.tts(textResult).then((audio) => {
            gameLogic.state = "WerewolfEnd";
            mainInfo.text = textResult;
            mainScreen.emit('game-end', "Werewolf", mainInfo)
            io.emit('game-end',
                "werewolf"
            )
            //Die erstellte Audio wird abgespielt
            ElevenLabs.play_audio(audio).then(() => {
                setTimeout(() => {
                    mainScreen.emit('game-outro')
                    io.emit('game-outro')
                }, 2000)
            })
            
        })  
    })
}

function villageEnding() {
    console.log("Alle sind tot!")
    AILogic.giveVillageEndingEntry().then((textResult) => {
        ElevenLabs.tts(textResult).then((audio) => {
            gameLogic.state = "VillageEnd";
            mainInfo.text = textResult;
            mainScreen.emit('game-end', "Village", mainInfo)
            io.emit('game-end',
                "village"
            )
            //Die erstellte Audio wird abgespielt
            ElevenLabs.play_audio(audio).then(() => {
                setTimeout(() => {
                    mainScreen.emit('game-outro')
                    io.emit('game-outro')
                }, 2000)
            })
            
        })  
    })
}










/*---------------Main Screen-------------*/

mainScreen.use((socket, next) => {
    next();
});

mainScreen.on("connection", socket => {
    console.log("Main screen connected again!")

    //Sende die Infos über den Zustand vom mainScreen 
    console.log("Text: " + mainInfo.text)
    socket.emit("update", mainInfo);


    //Main Screen ist fertig, mit der Einführung, die Spieler können jetzt ihren Charakter erstellen 
    socket.on('start-character-selection', () => {
        gameLogic.state = "Character-Selection"
        io.emit("players-ready");
    })


    /*---------------Day Phase-------------*/
    socket.on('silent-intervention', (discussionText) => {
        console.log("SilentIntervention event")
        AILogic.giveSilentIntervention(discussionText).then((textResult) => {
            console.log(textResult)
            ElevenLabs.tts_debate(textResult).then((audio) => {
                socket.emit("silent-intervention", textResult)
                //Die erstellte Audio wird abgespielt
                ElevenLabs.play_audio(audio).then(() => {
                    //Noch etwas machen ??
                })
            })  
        })
    })



    socket.on('update-state', (phase) => {
        mainInfo.phase = phase;
    })
    

});









