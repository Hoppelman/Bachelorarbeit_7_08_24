console.log("Options");

window.addEventListener('beforeunload', (event) => {
    //event.preventDefault();
    //event.returnValue = '';
});

const player = document.getElementById("playerCount");
const citizenCount = document.getElementById("citizenCount");
const werewolfCount = document.getElementById("werewolfCount");
const seer = document.getElementById("seer");
const witch = document.getElementById("witch");

player.addEventListener('blur', (event) => {
    
    werewolfCount.value = (parseInt)(0.4 * player.value);
    let leftPlayers = playerCount.value - werewolfCount.value;
    if(player.value >= 5) {
        seer.checked = true;
        leftPlayers = leftPlayers - 1;
    } else {
        seer.checked = false;
    }
    if(player.value >= 7) {
        witch.checked = true;
        leftPlayers = leftPlayers - 1;
    } else {
        witch.checked = false;
    }
    console.log(leftPlayers);
    citizenCount.value = leftPlayers;
});



if(player.value === "") {
    //player.setCustomValidity("");
}
