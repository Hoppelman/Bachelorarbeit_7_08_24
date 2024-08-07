require("dotenv").config();
const OpenAI = require("openai");
const Configuration = require('openai');
const GameLogic = require('./GameLogic');

let storyTemp = 0.6
let gameLogic = GameLogic.getGameLogic();


let role = "Du bist ein Forscher und Entdecker aus dem 15ten Jahrhundert, der gerade in ein abgelegenes Dorf namens Düsterwald für einige Tage unterkommt, um die merkwürdigen Ereignisse an diesem Ort zu erforschen. In dem Dorf geschehen ungewöhnliche Dinge, Werwölfe tarnen sich als einfache Dorfbewohner und fressen des Nachts Unschuldige. Der Hauptkonflikt besteht dabei zwischen den Werwölfen und Dorfbewohnern. Es kann noch Rollen wie Hexe oder Seher geben, diese sind aber weniger relevant für diesen Hauptkonflikt und sind in dieser Geschichte gutartige Figuren auf der Seite der Dorfbewohner. Du hältst deine Erfahrungen in einem Art Tagebuch fest. Die Texte, die du generierst, sollen Einträge aus diesem Buch sein. Versuche durch deine Texte eine Unheimlich, bedrohlich, beängstigend Atmosphäre zu schaffen.\n Nutze einen altdeutschen Schreibstil und drücke dich möglichst gehoben, eloquent und altertümlich aus, denke daran, du stammst aus dem 15ten Jahrhundert. \n\n"
let entries = [];
let storyPrompt = ""

let openai;

//Initialisiere OpenAI mithilfe eines API keys
function initOpenAI() {
    const newConfig = new Configuration({ 
        apiKey: process.env.OPENAI_SECRET_KEY 
    });

    openai = new OpenAI({
        apiKey: process.env.OPENAI_SECRET_KEY,
    });

    console.log("OpenAI initialized");
}

//Eine Antwort auf einen Prompt wird durch die OpenAi API generiert und zurückgegeben
async function getChatResponse(prompt, temp) {
    console.log("Story wird erstellt....")
    console.log(prompt)
    try {
        if (!openai) {
            throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
        } else {
            console.log("Creating response");
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: "gpt-3.5-turbo",
                temperature: temp
            });
            console.log(completion.choices[0].message.content.length);
            return completion.choices[0].message.content;
        }
    } catch(error) {
        console.error(error);
        return "Error"
    }
}

async function getStoryResponse(prompt, temp) {
    console.log("Story wird erstellt....")
    console.log(prompt)
    try {
        if (!openai) {
            throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
        } else {
            console.log("Creating response");
            prompt = storyPrompt + prompt
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: "gpt-3.5-turbo",
                temperature: temp
            });
            console.log(completion.choices[0].message.content.length);
            return completion.choices[0].message.content;
        }
    } catch(error) {
        console.error(error);
        return "Error"
    }
}

async function getImageResponse(prompt) {
    try {
        if (!openai) {
            throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
        } else {
            const response = await openai.images.generate({
                model: "dall-e-2",
                prompt: prompt,
                n: 1,
                size: "512x512",
              });

              //console.log(response.data[0].url);
              return response.data[0].url;
        }
    } catch(error) {
        console.error(error);
        return error.code
    }
}


//Funktion, welche einen Avatar für einen Spieler generiert
async function giveAvatar(pronouns, age ,description) {
    
    let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and you are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character from an old Illuminated Manuscript. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description , 0.5);

    if(avatar_prompt.length >= 1000) {
        console.log("Cutting")
        avatar_prompt = await getChatResponse("Recude the size of this prompt, so its length is under 900:\n" + prompt, 0.5)
        if(avatar_prompt.length >= 1000) {
            avatar_prompt = avatar_prompt.substring(0, 900)
        }
    }

    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character from an old Illuminated Manuscript. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    let avatar_image = await getImageResponse(avatar_prompt);

    if(avatar_image === 'content_policy_violation') {
        avatar_prompt = await getChatResponse("You are a prompting expert. You have years of experience and you also know a lot about content policy. Rephrase the following prompt so that it won't violate any content policy. Remove any parts that could be seen as harmful, inappropriate, or offensive:\n\n" + avatar_prompt, 0.5)
        avatar_image = await getImageResponse(avatar_prompt);
        if(avatar_image === 'content_policy_violation') {
            avatar_image = "none"
        }
    }

    return avatar_image
    //return "/images/farmer.png";
}

async function givePicture(text) {
    

    let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image as a rough, loose but mature pencil sketch on old paper with a Eerie, threatening, frightening atmosphere based on this content: \n" + text, 0.5)

    
    console.log(prompt.length)
    if(prompt.length >= 1000) {
        console.log("Cutting")
        prompt = await getChatResponse("Recude the size of this prompt, so its length is under 900:\n" + prompt, 0.5)
        if(prompt.length >= 1000) {
            prompt = prompt.substring(0, 900)
        }
    }
    image = await getImageResponse(prompt)

    if(image === 'content_policy_violation') {
        prompt = await getChatResponse("You are a prompting expert. You have years of experience and you also know a lot about content policy. Rephrase the following prompt so that it won't violate any content policy. Remove any parts that could be seen as harmful, inappropriate, or offensive:\n\n" + prompt, 0.5)
        image = await getImageResponse(prompt);
        if(image === 'content_policy_violation') {
            image = "none"
        }
    }
  
    return image
}

async function giveIntroPicture(text) {
    
    let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques. You are supposed to give answer now with a prompt.\n" + "To do this you have to do two things:\n\n Step 1: Look at this desciption of characters and extract all the key visual features from all of these " + gameLogic.playerCount + " characters: + " + text + ". \nUse this info for step 2, dont anwer with any results from step 1. \n\n Step 2: Create me a prompt for a DALL-E image model. You have to create the perfect prompt for a painting of these " + gameLogic.playerCount + " characters. The prompt should include a very detailed and specific description of these characters based on the visual Information you extracted in step 1.", 0.5)
    if(prompt.length >= 1000) {
        console.log("Cutting")
        prompt = await getChatResponse("Recude the size of this prompt, so its length is under 900:\n" + prompt, 0.5)
        if(prompt.length >= 1000) {
            prompt = prompt.substring(0, 900)
        }
    }
    image = await getImageResponse(prompt)

    if(image === 'content_policy_violation') {
        prompt = await getChatResponse("You are a prompting expert. You have years of experience and you also know a lot about content policy. Rephrase the following prompt so that it won't violate any content policy. Remove any parts that could be seen as harmful, inappropriate, or offensive:\n\n" + prompt, 0.5)
        image = await getImageResponse(prompt);
        if(image === 'content_policy_violation') {
            image = "none"
        }
    }

    return image
}


async function givePortrait() {
    
    let prompt = "This painting depicts a Renaissance explorer engrossed in reading manuscripts, symbolizing his thirst for knowledge. The Gothic-style painting features intricate details, rich colors, and traditional attire. The explorer's expression conveys curiosity and contemplation, inviting viewers to explore his world of intellectual pursuit. He is writing something in an old book, and there are candles lighting the room. Eerie, threatening, frightening atmosphere."
    if(prompt.length >= 1000) {
        console.log("Cutting")
        prompt = await getChatResponse("Recude the size of this prompt, so its length is under 900:\n" + prompt, 0.5)
        if(prompt.length >= 1000) {
            prompt = prompt.substring(0, 900)
        }
    }
    image = await getImageResponse(prompt)
    return image
}

async function giveRoleCard(role) {
    
    let prompt = "Illustrate an old painting in the form of a mandala of " + role + ". In the style: Gothic woodcut. Symmetric. Looks a bit old, a bit rough, there are holes at the edges, slightly decomposed, decayed."

    
    return await getImageResponse(prompt)
}

// <----------- Texte ------------->

//Funktion welche das Intro generiert. Dabei wird der Introduction prompt zusammen mit den Charaktereigenschaften der Mitspieler kombiniert
async function giveIntroduction() {
    let introPrompt = "Gebe eine kurze Einführung in die Dorfgemeinschaft, names 'Düsterwald'. Ein kurzer Satz am Anfang zum Dorf. Maximal zwei Sätze pro Bewohner. Achte darrauf die richtigen Pronomen für jeden Bewohner zu nutzen. In der Dorfgemeinschaft leben folgende Bewohner: \n";
    gameLogic.playerList.forEach((player) => {
        introPrompt = introPrompt + "\nName: " + player.name + "Pronomen: " + player.pronouns + ". Alter: " + player.age + ". Beschreibung: " + player.description + ". ";
    });
    let intro = await getStoryResponse(introPrompt, storyTemp)
    updateStory(intro);
    return intro;
}

async function giveMorningEntry(victims) {
    let morningEntry = ""

    let = morningPrompt = "Führe die Geschichte nun weiter und schreibe einen neuen Eintrag. Gib dem Eintrag auf gar keinen Fall eine Überschrift. Maximal 125 Wörter. In diesem Eintrag geht es darum, dass das Dorf langsam aufgewacht ist. Gebe dann nur folgende Ereignisse, passend zu den anderen Einträgen und dem bisherigen Schribstil, wieder:"
    if(victims.length < 1) {
        morningPrompt = morningPrompt + "\nNichts is geschen. Alle Bewohner leben noch. Maximal 100 Wörter. Beschreibe kurz wie die Einwohner des Dorfes den morgen verbringen."
    } else if(victims.length === 1) {
        morningPrompt = morningPrompt + "\n" + victims[0].name + " wurde tot augefunden. Gehe besonders auf seine Charaktereigenschaften und Rolle im Dorf ein, die er gespielt hatte: ." + victims[0].description + "\n" + "Der Tote stellt sich als: " + victims[0].role + " heraus."
    } else if(victims.length > 1) {
        morningPrompt = morningPrompt + "\n" + victims[0].name + " wurde tot augefunden. " + victims[1].name + " wurde ebenfalls tot aufgefunden. Gehe besonders auf die Charaktereigenschaften und Rollen im Dorf ein, die die zwei Toten gespielt hatte.\n" + victims[0].name + " stellte sich als: " + victims[0].role + " heraus. " + victims[1].name + " stellte sich als: " + victims[1].role + " heraus."
    }
    morningEntry = morningEntry + "\nDas Dorf will nun abstimmen, wen sie als nächstes Hinrichten wollen, um einen Werwolf zu finden. \n\n Du darfst auf keinen Fall selbst Anschuldigungen machen."
    morningEntry = await getStoryResponse(morningPrompt, storyTemp)


    updateStory(morningEntry)
    return morningEntry;
}

async function giveExecutionEntry(selected) {
    let temp = storyTemp
    let executionEntry = ""
    console.log(selected)

    let executionPrompt = "Führe die Geschichte nun weiter und schreibe einen neuen Eintrag. Gib dem Eintrag auf keinen Fall eine Überschrift. Maximal 125 Wörter. In diesem Eintrag geht es darum, dass das Dorf abgestimmt hat, wer als nächstes hingerichtet werden soll. Gib dann folgende Ereignisse, passend zu den anderen Einträgen und dem bisherigen Schreibstil, ausführlich wieder: \n\n"
    if(selected !== "None") {
        if(selected.role === "Werwolf") {
            executionPrompt = executionPrompt + selected.name + " wurde vom Dorf zum Tode verurteilt. Gehe besonders auf seine Charaktereigenschaften und Rolle im Dorf ein, die er gespielt hatte und wie er alle hinter das Licht geführt hatte.\n" + "Der Tote stellt sich als: " + selected.role + " heraus. Beschreibe seine Hinrichtung. \n"
        } else {
            executionPrompt = executionPrompt + selected.name + " wurde vom Dorf zum Tode verurteilt. Gehe besonders auf seine Charaktereigenschaften und Rolle im Dorf ein, die er gespielt hatte.\n" + "Der Tote stellt sich als: " + selected.role + " heraus. Beschreibe seine Hinrichtung. \n"
        }
    } else {
        temp = 0.5
        executionPrompt = executionPrompt + "Die Bewohner konnten sich nicht entscheiden, niemand wird hingerichtet, beschreibe wie die verschiedenen Charaktere den Abend verbringen. Gehe darauf ein, wie dies den Werwölfen nützen könnte. \n"
    }
    executionPrompt = executionPrompt + "\n\nDie Sonne geht wieder unter und das Dorf schläft langsam wieder ein."
    executionEntry = await getStoryResponse(executionPrompt, temp);


    updateStory(executionEntry)
    return executionEntry;
}

async function giveSilentIntervention(discussionText) {
    let silentInterventionText = "Du verfolgst eine der Debatten im Dorf und machst dabei Notizen. Du bist ebenfalls ein erfahrener Moderator. Deine Aufgabe ist es nun, eine Diskussion in einem Dorf zu moderieren, in dem die Bewohner versuchen herauszufinden, wer unter ihnen ein Werwolf ist. Du bist dabei nur ein Beobachter, der nicht aktiv teilnimmt und nur eingreift, wenn die Bewohner Schwierigkeiten haben, eine Lösung zu finden. \n\nDie Diskussion war eine Weile still. Bisher sah die Diskussion so aus: " + discussionText + ".\n\nVersuche die Diskussion wieder zu beleben, indem du einige Bemerkungen über bestimmte Spieler machst, um sie verdächtig erscheinen zu lassen, oder einige Witze einfügst, die die Debatte anheizen könnten. Achte darauf dich nur auf Spielernamen zu nennen die in der Geschichte vorkommen. Verrate keine Rollen der Spieler. Nutze maximal 50 Wörter."
    silentInterventionText = await getStoryResponse(silentInterventionText, storyTemp)
    return silentInterventionText
}

function updateStory(newEntry) {
    console.log("updateStory Prompt")
    entries.push(newEntry)
    storyPrompt =  role + "\nDies sind die bisherigen Einträge: \n\n"
    entries.forEach((entry) => {
        storyPrompt = storyPrompt + entry + "\n\n"
    })
    console.log(storyPrompt.length)
}


async function giveWerewolfEndingEntry() {
    let alivePlayers = gameLogic.playerList.filter(index => index.status !== "dead")
    let endingEntry = ""
    let endingPrompt = "\nFühre die Geschichte nun zum Abschluss und schreibe einen letzten verzweifelten Eintrag. Geb dem Eintrag auf gar keinen Fall eine Überschrift. Maximal 150 Wörter. In diesem letzten Eintrag geht es darum, dass die Werwölfe gewonnen haben und das Dorf nun menschenleer ist. Die Werwölfe haben gesiegt, beschreibe wie die folgenden Werwölfe die Dorfbewohner getäuscht haben: \n"
    alivePlayers.forEach((player) => {
        console.log(player.name)
        endingPrompt = endingPrompt + "Name: " + player.name + "Pronomen: " + player.pronouns + ". Alter: " + player.age + ". Beschreibung: " + player.description + ". \n";
    });
    
    endingPrompt = endingPrompt + "Du als Autor wirst nun auch von den Werwölfen verfolgt, welche immer näherkommen. Schreibe wie sie immer lauter werden. Impliziere am Ende, dass du als Autor nicht überlebst."

    endingEntry = await getStoryResponse(endingPrompt, 0.9);
    updateStory(endingEntry)
    return endingEntry;
}

async function giveVillageEndingEntry() {
    let alivePlayers = gameLogic.playerList.filter(index => index.status !== "dead")
    let deadVillager = gameLogic.playerList.filter(index => index.status === "dead").filter(index => index.role !== "Werwolf")
    let endingEntry = ""
    let endingPrompt = ""

    endingPrompt = endingPrompt + "\nFühre die Geschichte nun zum Abschluss und schreibe einen letzten Eintrag. Gib dem Eintrag auf keinen Fall eine Überschrift. Maximal 150 Wörter. In diesem letzten Eintrag geht es darum, dass die Werwölfe besiegt wurden und das Dorf wieder in Frieden leben kann. Rekapituliere noch einmal die Ereignisse. \n"
    if(deadVillager.length > 0) {
        endingPrompt = endingPrompt + "Schreibe einen kleinen Nachruf an alle die gestorben sind und keine Werwölfe waren:\n" 
        deadVillager.forEach((player) => {
            endingPrompt = endingPrompt + "Name: " + player.name + "Pronomen: " + player.pronouns + ". Alter: " + player.age + ". Beschreibung: " + player.description + ". \n";
        });
    }
    endingPrompt = endingPrompt+ "\n\nBlicke in die Zukunft und erzähle was, so hast du gehört, aus den noch lebenden Einwohnern geworden ist, gehe dabei nur auf diese ein:\n"
    alivePlayers.forEach((player) => {
        endingPrompt = endingPrompt + "Name: " + player.name + "Pronomen: " + player.pronouns + ". Alter: " + player.age + ". Beschreibung: " + player.description + ". \n";
    });

    endingEntry = await getStoryResponse(endingPrompt, 0.9);
    updateStory(endingEntry)
    return endingEntry;
}

async function giveAllDeadEndingEntry() {
    let endingEntry = ""
    //console.log()
    let endingPrompt = "\nFühre die Geschichte nun zum Abschluss und schreibe einen letzten Eintrag. Gib dem Eintrag auf keinen Fall eine Überschrift. Maximal 150 Wörter. In diesem letzten Eintrag geht es darum, dass niemand überlebt hat und das Dorf nun menschenleer ist.  Sowohl alle Werwölfe als auch Dorfbewohner sind gestorben. Du als Autor wirst abreisen. Blicke zurück auf die Ereignisse und Einwohner. Sei wehmütig, dass sich niemand an das Geschehene erinnern wird." 

    endingEntry = await getStoryResponse(endingPrompt, 0.9);
    updateStory(endingEntry)
    return endingEntry;
}


async function testAllImages() {
    let testObject = {
        authorImage: await givePortrait(),
        sleepImage: await givePicture("A image of dark forest, trees in the night, the moon, with a village in the background."),
        morningImage: await givePicture("The view from a hill towards an old and small village from the middle ages, surrounded by a dark forest.")

    }
    return testObject
}

async function testAllEntries(Hans, Wurmi, Bernda, Lennard, Anna) {
    Anna.status = "dead"
    Wurmi.status = "dead"
    Bernda.status = "dead"

    testObject = {
        intro: await giveIntroduction(),
        morning1: await giveMorningEntry(new Array()),
        execution1: await giveExecutionEntry("None"),
        morning2: await giveMorningEntry(new Array(Wurmi)),
        execution2: await giveExecutionEntry(Hans),
        morning3: await giveSilentIntervention(""),
        execution3: await giveSilentIntervention(""),
        morning4: await giveSilentIntervention(""),
        execution4: await giveExecutionEntry("None"),
        morning5: await giveMorningEntry(new Array(Bernda, Lennard)),
        ending1: await giveAllDeadEndingEntry(),
        ending2: await giveVillageEndingEntry(),
        ending3: await giveWerewolfEndingEntry()
    }

    return testObject
}

module.exports = {
    initOpenAI,
    giveAvatar,
    giveIntroduction,
    giveMorningEntry,
    giveExecutionEntry,
    giveSilentIntervention,
    givePicture,
    giveRoleCard,
    giveAllDeadEndingEntry,
    giveVillageEndingEntry,
    giveWerewolfEndingEntry,
    testAllImages,
    giveIntroPicture,
    givePortrait,
    testAllEntries
}