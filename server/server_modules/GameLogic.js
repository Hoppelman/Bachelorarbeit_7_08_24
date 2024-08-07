const { randomInt } = require('crypto');

class GameLogic {
    constructor() {
        this.state = "None";
        this.playerCount = 3;
        this.werewolfCount = 2;
        this.werewolfList = new Array()
        this.citizenCount = 3;
        this.witchAvailable = true;
        this.witchHealAvailable = true;
        this.witchKillAvailable = true;
        this.seerAvailable = true;
        this.scenario = "In einem abgelegenem Dorf.";
        this.playerList = new Array();
        this.roles = ["citizen"];
        this.intro = "None";
        //this.voteList = {};
    }

    setPlayerCount(playerCount, citizenCount, werewolfCount, witchAvailable, seerAvailable) {
        this.playerCount = playerCount;
        this.werewolfCount = werewolfCount;
        this.citizenCount = citizenCount;
        console.log("Witch: " + witchAvailable);
        console.log("Seer: " + seerAvailable);
        this.witchAvailable = witchAvailable;
        this.seerAvailable = seerAvailable;
    }

    //Fügt einem Spieler dem Spiel hinzu 
    addPlayer(player) {
        this.playerList.push(player);
    }

    getPlayerByID(playerID) {
        return this.playerList.find((e) => e.ID === playerID);
    }

    //Prüft wie viele Spieler dem Spiel noch beitreten können
    slotsAvailable() {
        return this.playerCount - this.playerList.length;
    }

    getAlivePlayers() {
        let alivePlayer = new Array()
        for(let i = 0; i < this.playerList.length; i++) {
            if(this.playerList[i].status !== "dead") {
                alivePlayer.push(this.playerList[i])
            }
        }
        console.log("alivePlayerFunction:")
        console.log(alivePlayer)
        return alivePlayer;
    }

    // Bestimmt welche Rolle der Spieler bekommt
    selectRole() {
        let tmpWerewolfCount = this.werewolfCount;
        let tmpCitizenCount = this.citizenCount;

        let tmpRoles = ["Werwolf", "Dorfbewohner"];
        if(this.witchAvailable) {
            tmpRoles.push("Hexe");
        }
        if(this.seerAvailable) {
            tmpRoles.push("Seher");
        }

        for(let i = 0; i < this.playerList.length; i++) {
            let role = this.playerList[i].role;
            if(role === "Dorfbewohner") {
                tmpCitizenCount = tmpCitizenCount - 1;
            } else if(role === "Werwolf") {
                tmpWerewolfCount = tmpWerewolfCount - 1;
            } else if(this.witchAvailable && role === "Hexe") {
                tmpRoles.splice(tmpRoles.indexOf('Hexe'), 1);
            } else if(this.seerAvailable && role == "Seher") {
                tmpRoles.splice(tmpRoles.indexOf('Seher'), 1);
            }
        }
        if(tmpWerewolfCount < 1) {
            tmpRoles.splice(tmpRoles.indexOf('Werwolf'), 1);
        }
        if(tmpCitizenCount < 1) {
            tmpRoles.splice(tmpRoles.indexOf('Dorfbewohner'), 1);
        }

        return tmpRoles[randomInt(0, tmpRoles.length)];
    }

    //TODO Kommentare
    checkWerewolfSelection() {
        let voteList = {};
        console.log(this.werewolfList)
        for(let i = 0; i < this.werewolfList.length; i++) {
            let player = this.werewolfList[i];
            if(player.vote !== "None") {
                if(typeof voteList[player.vote] === 'undefined') {
                    voteList[player.vote] = 1;
                } else {
                    voteList[player.vote]++;
                }
            }
        }

        return voteList;
    }

    checkWerewolfConfirm(player) {
        player.state = "votedVictim";
        if(gameLogic.werewolfList.every(index => index.state === "votedVictim")) {
            gameLogic.werewolfList.every(index => index.state = "asleep");
            return true
        }
        return false
    }

    
    selectVictim() {
        let voteList = this.checkWerewolfSelection()
        let victim = "None"
        let highestVotes = 0;
        for(let ID in voteList) {
            console.log(ID)
            if(voteList[ID] > highestVotes) {
                victim = ID;
                highestVotes = voteList[ID]
            } else if(voteList[ID] === highestVotes) {
                victim = "None"
            }
        }

        console.log(victim);
        if(victim !== "None") {
            console.log(this.getPlayerByID(victim).name)
            this.getPlayerByID(victim).state = "targeted"
        }
    }

    checkVotingSelection() {
        let voteList = {};
        let alivePlayers = this.getAlivePlayers()
        for(let i = 0; i < alivePlayers.length; i++) {
            let player = alivePlayers[i];
            if(player.vote !== "None") {
                if(typeof voteList[player.vote] === 'undefined') {
                    voteList[player.vote] = 1;
                } else {
                    voteList[player.vote]++;
                }
            }
        }

        return voteList;
    }

    //Hier wird geprüft, ob alle Spieler abgestimmt haben. Es kann auch ein Zeitlimit eingefügt werden
    checkVotingConfirm(player) {
        player.state = "voted";
        let alivePlayers = this.getAlivePlayers()
        console.log("This is the player list: ")
        console.log(alivePlayers)
        if(alivePlayers.every(index => index.state === "voted")) {
            alivePlayers.every(index => index.state = "asleep");
            return true
        }
        return false
    }

    selectExecution() {
        let voteList = this.checkVotingSelection()
        let selected = "None"
        let highestVotes = 0;
        for(let ID in voteList) {
            console.log(ID)
            if(voteList[ID] > highestVotes) {
                selected = ID;
                highestVotes = voteList[ID]
            } else if(voteList[ID] === highestVotes) {
                selected = "None"
            }
        }

        console.log(selected);
        if(selected !== "None") {
            console.log(this.getPlayerByID(selected).name)
            this.getPlayerByID(selected).state = "selected"
        }
        console.log("Selected: " + selected)
        return selected
    }
}

let gameLogic = new GameLogic();

function getGameLogic() {
    return gameLogic;
}

module.exports = {
    getGameLogic,
}

