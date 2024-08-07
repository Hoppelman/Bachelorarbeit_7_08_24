class Player {
    
    constructor(socketID, role) {
        this.ID = socketID;
        this.name = "Neuer Mitspieler"; 
        this.pronouns = "Sie/Ihr"
        this.age = "20";
        this.description = "Einfacher Bürger";
        this.role = role;
        this.status= "alive";
        this.state = "just-joined";
        this.image = "/images/avatar_placeholder_100px.png";
        this.vote = "None"
    }

    getPlayerName() {
        return this.name;
    }

    setCharacterTraits(name, pronouns, age, description) {
        if(name) this.name = name;
        if(pronouns) this.pronouns = pronouns;
        if(age)this.age = age;
        if(description)this.description = description;
    }

}

module.exports = Player;