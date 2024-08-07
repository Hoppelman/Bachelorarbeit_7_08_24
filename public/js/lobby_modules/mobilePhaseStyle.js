const styleClasses = ["day", "night", "werewolf", "seer", "witch"]
let currentStyle = "day"

//TODO Evt. muss dies bei dynamischen Elementen neu geladen werden, also in der changeStyle funktion

function changeStyle(newPhase) {
    currentStyle = newPhase;
    const elements = {
        background: document.body,
        text: document.querySelectorAll('p'),
        listItem: document.getElementsByClassName('selection-list-item'),
        listButtons: document.getElementsByClassName('select-list-button'),
        confirmButtons: document.getElementsByClassName('confirm-button')
    }
    //Wähle die Klassen der derzeitigen Phase
    let phaseClasses = styleClasses[newPhase]
    //console.log(document.getElementsByClassName('list-group-item'))
    console.log("Item: ")
    console.log(elements["listItem"])

    //Gehe durch alle relevanten Elemente und entferne jeweils die Phasenspezifischen Klassen und füge die Klassen der derzeitigen Phase den Elementen hinzu
    for (const [key, value] of Object.entries(elements)) {
        //Element ist eine Liste z.b. Liste aller Textelemente p
        if (NodeList.prototype.isPrototypeOf(value) || HTMLCollection.prototype.isPrototypeOf(value)) {
            Array.from(value).forEach(element => {
                for (let phase in styleClasses) {
                    if(element.classList.contains(styleClasses[phase])) {
                        element.classList.remove(styleClasses[phase])
                    }
                }
                //Füge Element die Klasse der jeweiligen Phase hinzu
                element.classList.add(newPhase)
            });
        //Element ist keine Liste z.b. der Hintergrund
        } else {
            for (let phase in styleClasses) {
                if(value.classList.contains(styleClasses[phase])) {
                    value.classList.remove(styleClasses[phase])
                }
            }
            //Füge Element die Klasse der jeweiligen Phase hinzu
            value.classList.add(newPhase)
        }
    }
}

changeStyle("night")


/*function changeStyle(newPhase) {
    const elements = {
        background: document.body,
        text: document.querySelectorAll('p')
    }
    //Wähle die Klassen der derzeitigen Phase
    let phaseClasses = styleClasses[newPhase]

    //Gehe durch alle relevanten Elemente und entferne jeweils die Phasenspezifischen Klassen und füge die Klassen der derzeitigen Phase den Elementen hinzu
    for (const [key, value] of Object.entries(elements)) {
        //Element ist eine Liste z.b. Liste aller Textelemente p
        if (NodeList.prototype.isPrototypeOf(value) || HTMLCollection.prototype.isPrototypeOf(value)) {
            Array.from(value).forEach(element => {
                for (let phase in styleClasses) {
                    if(element.classList.contains(styleClasses[phase][key])) {
                        element.classList.remove(styleClasses[phase][key])
                    }
                }
                //Füge Element die Klasse der jeweiligen Phase hinzu
                element.classList.add(phaseClasses[key])
            });
        //Element ist keine Liste z.b. der Hintergrund
        } else {
            for (let phase in styleClasses) {
                if(value.classList.contains(styleClasses[phase][key])) {
                    value.classList.remove(styleClasses[phase][key])
                }
            }
            //Füge Element die Klasse der jeweiligen Phase hinzu
            value.classList.add(phaseClasses[key])
        }
    }
}*/