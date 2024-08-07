class localGame {
    constructor() {
        this.state = "None";
        this.playerCount = 0;
        this.playerList = new Array();
        this.currentText = "None";
        this.citizenImage = "None";
        this.werewolfImage = "None";
        this.seerImage = "None";
        this.witchImage = "None";
    }

    addPlayer(player) {
        this.playerList.push(player);
    }

    getPlayerByID(playerID) {
        return this.playerList.find((e) => e.ID === playerID);
    }
}