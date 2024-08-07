require("dotenv").config();
const OpenAI = require("openai");
const Configuration = require('openai');
const GameLogic = require('./GameLogic');

let storyTemp = 0.6
let gameLogic = GameLogic.getGameLogic();

//let role = "Du bist ein Forscher und Entdecker aus dem 15ten Jahundert, der gerade in ein abgelegenes Dorf namens Düsterwald für einige Tage unterkommt. In dem Dorf geschehen merkwürdige Dinge, Werwölfe tarnen sich als einfache Dorfbewohner und fressen des Nachts Unschuldige. Der Hauptkonflikt besteht dabei zwischen den Werwölfen und Dorfbewohnern. Es kann noch Rollen wie Hexe oder Seher geben, diese sind aber weniger relevant für diesen Hauptkonflikt. Du hälst deine Erfahrungen in einem art Tagebuch fest.Die Texte die du generierst sollen Einträge aus diesem Buch sein. Schreibe immer in Präsenz, als würdest du die vergangenen Erieginisse vom Tag am Abend beschreiben und nutze einen altdeutschen Schreibstil."
//let role = "Du bist ein Forscher und Entdecker aus dem 15ten Jahundert, der gerade in ein abgelegenes Dorf namens Düsterwald für einige Tage unterkommt. In dem Dorf geschehen merkwürdige Dinge, Werwölfe tarnen sich als einfache Dorfbewohner und fressen des Nachts Unschuldige. Der Hauptkonflikt besteht dabei zwischen den Werwölfen und Dorfbewohnern. Es kann noch Rollen wie Hexe oder Seher geben, diese sind aber weniger relevant für diesen Hauptkonflikt. Du hälst deine Erfahrungen in einem art Tagebuch fest.Die Texte die du generierst sollen Einträge aus diesem Buch sein. Nutze einen altdeutschen Schreibstil und drücke dich möglichst gehoben, eloquent und altertümlich aus, denke daran: Du bist stammst aus dem 15ten Jahundert. Ein Beispielsatz an dessen Schreibstil du dich orientieren sollst: 'So sei dies gesagt, mit ehrfürchtiger Demut und in frommer Ergebung bekenne ich, dass der Mensch gleich einem Rädchen im großen Räderwerk des Schicksals wandelt, dessen Wege unergründlich und dessen Ratschlüsse unerforschlich sind.'"
//let role = "Du bist ein Forscher und Entdecker aus dem 15ten Jahundert, der gerade in ein abgelegenes Dorf namens Düsterwald für einige Tage unterkommt um die merkwürdigen Ereignisse an diesem Ort zu erforschen. In dem Dorf geschehen merkwürdige Dinge, Werwölfe tarnen sich als einfache Dorfbewohner und fressen des Nachts Unschuldige. Der Hauptkonflikt besteht dabei zwischen den Werwölfen und Dorfbewohnern. Es kann noch Rollen wie Hexe oder Seher geben, diese sind aber weniger relevant für diesen Hauptkonflikt. Du hälst deine Erfahrungen in einem art Tagebuch fest.Die Texte die du generierst sollen Einträge aus diesem Buch sein.\n Nutze einen altdeutschen Schreibstil und drücke dich möglichst gehoben, eloquent und altertümlich aus, denke daran: Du bist stammst aus dem 15ten Jahundert. \n\nEin Beispielsatz an dessen Schreibstil du dich orientieren sollst: 'So sei dies gesagt, mit ehrfürchtiger Demut und in frommer Ergebung bekenne ich, dass der Mensch gleich einem Rädchen im großen Räderwerk des Schicksals wandelt, dessen Wege unergründlich und dessen Ratschlüsse unerforschlich sind.'\n\n"
//let role = "Du bist ein Forscher und Entdecker aus dem 15ten Jahundert, der gerade in ein abgelegenes Dorf namens Düsterwald für einige Tage unterkommt um die merkwürdigen Ereignisse an diesem Ort zu erforschen. In dem Dorf geschehen merkwürdige Dinge, Werwölfe tarnen sich als einfache Dorfbewohner und fressen des Nachts Unschuldige. Der Hauptkonflikt besteht dabei zwischen den Werwölfen und Dorfbewohnern. Es kann noch Rollen wie Hexe oder Seher geben, diese sind aber weniger relevant für diesen Hauptkonflikt. Du hälst deine Erfahrungen in einem art Tagebuch fest.Die Texte die du generierst sollen Einträge aus diesem Buch sein. Versuche durch deine Texte eine Unheimlich, bedrohlich, beängstigend Atmosphäre zu schaffen.\n Nutze einen altdeutschen Schreibstil und drücke dich möglichst gehoben, eloquent und altertümlich aus, denke daran: Du bist stammst aus dem 15ten Jahundert. \n\nEin Beispielsatz an dessen Schreibstil du dich orientieren sollst: 'So sei dies gesagt, mit ehrfürchtiger Demut und in frommer Ergebung bekenne ich, dass der Mensch gleich einem Rädchen im großen Räderwerk des Schicksals wandelt, dessen Wege unergründlich und dessen Ratschlüsse unerforschlich sind.'\n\n"
let role = "Du bist ein Forscher und Entdecker aus dem 15ten Jahundert, der gerade in ein abgelegenes Dorf namens Düsterwald für einige Tage unterkommt um die merkwürdigen Ereignisse an diesem Ort zu erforschen. In dem Dorf geschehen ungewöhnliche Dinge, Werwölfe tarnen sich als einfache Dorfbewohner und fressen des Nachts Unschuldige. Der Hauptkonflikt besteht dabei zwischen den Werwölfen und Dorfbewohnern. Es kann noch Rollen wie Hexe oder Seher geben, diese sind aber weniger relevant für diesen Hauptkonflikt und sind in dieser Geschichte gutartige Figuren auf der Seite der Dorfbewohner. Du hälst deine Erfahrungen in einem art Tagebuch fest. Die Texte die du generierst sollen Einträge aus diesem Buch sein. Versuche durch deine Texte eine Unheimlich, bedrohlich, beängstigend Atmosphäre zu schaffen.\n Nutze einen altdeutschen Schreibstil und drücke dich möglichst gehoben, eloquent und altertümlich aus, denke daran: Du bist stammst aus dem 15ten Jahundert. \n\n"
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
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: storyPrompt + prompt }],
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
    //return
    //let DALLE_prompt = "Create a prompt for Dall-E with the following information so that I get the best possible picture: A character protrait similiar to a role card from a game with a dark fantasy setting. Face from the front, portrait. Only his face should be seen in the final picture. The character lives in a medieval village in a dark and fantasy world. It should look like an illustration from a book or have a printoptic, similiar to a character from dungeons and dragons. The following information is available about the character: \n The age of the character:" + age + " The gender of the character: " + pronouns +  " The description of the character: " + description + " The descriptions about the look of the character and its gender should be followed very closely."
    //let avatar_prompt = await getChatResponse(DALLE_prompt);
    //console.log(avatar_prompt)
    //let prompt = " Alter: " + age + " Beschreibung: " + description + "illustration, print, HD, high quality, no bad atonomy. Ein Bild von einer Figur in einem RolePlayingGame. Verzichte auf jegliche Schrift oder Buchstaben. Setting: Mittelalter und Fantasy. Gesicht von vorne, Portrait. Druckoptik, ähnlich dem Druck einer Karte eines Kartenspieles. Dungeons and Dragons." 
    //let prompt = " Age: " + age + " Description: " + description + "illustration, print, high quality, no bad atonomy. Setting: Middle ages and dark fantasy. Face from the front, portrait. Printoptic, similiar to a print of a card in fantasy card game. Dungeons and Dragons. No letters, words or sentences on the card." 
    //let avatar_prompt = "A character protrait similiar to a role card from a game with a dark fantasy setting. Face from the front, portrait. Only his face should be seen in the final picture. The character lives in a medieval village. It should look like an illustration from a book or have a printoptic, similiar to a character from dungeons and dragons. The following information is available about the character and should be followed very accuratly : \n The age of the character:" + age + " The gender of the character: " + pronouns +  " The description of the character: " + description + " The descriptions about the look of the character and its gender should be followed very closely."
    //let avatar_prompt = "Create an illustrated avatar portrait similar to a role card from a dark fantasy game. \n\nCharacter Details:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description + "Please adhere strictly to the provided details regarding the character's appearance and gender. The portrait should depict only the face, viewed from the front, and evoke a medieval village setting. Illuminated Manuscript Style."
    //let avatar_prompt = "Create a Avatar for a character. Please adhere strictly to the provided details regarding the character's appearance and gender.\n\nCharacter Details:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description + " The portrait should depict only the face, viewed from the front, and evoke a medieval village setting. In a Illuminated Manuscript Style. The picture should not include any text"
    //let avatar_prompt = "Paint a Portrait of a character in a fantasy game. Please adhere strictly to the provided details regarding the character's appearance and gender.\n\nCharacter Details:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description + " The portrait should depict only the face, viewed from the front, and evoke a medieval village setting. In a Illuminated Manuscript Style. The picture should not include any text"
    //let avatar_prompt = "Paint a Portrait of a character in a fantasy setting. Please adhere strictly to the provided details regarding the character's appearance and gender.\n\nCharacter Details:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description + " The portrait should depict only the face, viewed from the front, and evoke a medieval village setting. In a Illuminated Manuscript Style. The picture should not include any text"
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game as a Medieval and Renaissance Illuminations. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game in a Medieval and Renaissance Illuminations style. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game in a Engravings and Woodcuts Style. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character from an old Illuminated Manuscript. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character from an old Illuminated Manuscript with Elaborate borders and marginalia with floral, geometric, or fantastical designs. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game in a Medieval Manuscript Style. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game in a Illuminated Manuscript Style.\n\n You have the following information that you are supposed to create a perfect prompt out of and it is very important that the picture contains these elements:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game in a Illuminated Manuscript Style.\n\n You have the following information that you are supposed to create a perfect prompt out of and it is very important that the picture is representing this description:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game in a Illuminated Manuscript Style. The prompt should follow this format: [Medium] [Subject] [Artist(s)] [Details] [Image repository support]. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game in a Illuminated Manuscript Style. You have the following information that you are supposed to create a perfect prompt out of, make sure in your prompt, that the image is representing the description this description exactly:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);

    //let avatar_prompt = "Create a Avatar for a character. Please adhere strictly to the provided details regarding the character's appearance and gender.\n\nCharacter Details:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description + " The portrait should depict only the face, viewed from the front, and evoke a medieval village setting. In a Illuminated Manuscript Style. The picture should not include any text"
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game in a Illuminated Manuscript Style. Fairy tale style. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character for a fantasy game as a Medieval and Renaissance Illuminations. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    //let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character from an old Illuminated Manuscript. The painting should convey a Eerie, threatening, frightening atmosphere. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description);
    let avatar_prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a portrait of a character from an old Illuminated Manuscript. You have the following information that you are supposed to create a perfect prompt out of:\n\nAge:" + age + "\nGender: " + pronouns + "\nDescription: " + description, 0.5);

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
    //return
    //let prompt = "Illustrate a old painting. " + text + "An old illustration with a pencil, copper engraving or wood print. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed."
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create a image of a village from a Illuminated Manuscript. You have the following information that you are supposed to create a perfect prompt out of:\n\n" + text);
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. The prompt is supposed to create an image with this content: \n" + text + "\n In the style of: Gothic woodcut")

    //GUt Goth
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of gothic woodcut based on this content: \n" + text)
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in mixture style of gothic woodcut and a preparatory, Renaissance era, rough pencil sketch based on this content: \n" + text)

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of a sketch from the Renaissance based on this content: \n" + text)
    //Gut Renneccains
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of a preparatory, pencil sketch from the Renaissance era based on this content: \n" + text)
    
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of a preparatory, pencil sketch from the Renaissance era, a bit old and decomposed, based on this content: \n" + text)

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of a preparatory, rough pencil sketch from the Renaissance era, a bit old and faded already, based on this content: \n" + text)

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image based on this content: \n" + text + "\n In the style of a preparatory, rough pencil sketch from the Renaissance era, a bit old and faded already.")

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of a illuminated manuscript, with painted decoration and ornaments, a bit old and faded already, based on this content: \n" + text )

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of Carolingian Art, a bit old and faded already, based on this content: \n" + text )

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of medieval Gothic Art, a bit old and faded already, based on this content: \n" + text )

    //Good Sketch
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image as a rough, loose but mature pencil sketch on old paper based on this content: \n" + text, 0.5)

    let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image as a rough, loose but mature pencil sketch on old paper with a Eerie, threatening, frightening atmosphere based on this content: \n" + text, 0.5)

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt. The prompt should include a very detailed and specific description of the image as a rough, loose but mature pencil sketch on old paper based on this content: \n" + text + " \n The artist that this sketch is from, is very skilled, but this sketch is only half finished, just for studies.")

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt. The sketch that will be created from this prompt should be from a scientist and skilled artist, as a rough, loose but mature pencil sketch for studies on old paper. The prompt should include a very detailed and specific description of the image based on this content: \n" + text )

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt. \nThe sketch that will be created from this prompt should be from a scientist and skilled artist, as a rough, loose pencil sketch for studies on old paper. The prompt should include a very detailed and specific description of the image based on this content: \n" + text )

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of an old Book illustration based on this content: \n" + text)

    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "Create me a prompt for a DALL-E image model. You have to create the perfect prompt, the prompt should include a very detailed and specific description of the image in the style of an old Book illustration, in black and white from the medieval times based on this content: \n" + text)
    
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
    //console.log(image)
    //OG
    //let prompt = "Illustrate a old painting. " + text + "An old illustration with a pencil, copper engraving or wood print. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed."
    return image
}

async function giveIntroPicture(text) {
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n Create me a prompt for a DALL-E image model. You have to create the perfect prompt for a loose sketch of" + gameLogic.playerCount + ".\n The prompt should include a very detailed and specific description the following people, who live together in a medieval village:" + text + "\n The most important thing is, that these characters can be identified based on the description given")
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n" + "You have two tasks:\n\n Step 1: Look at this desciption of characters and extract all the key visual features from all of these " + gameLogic.playerCount + " characters: + " + text + ". \n\n Step 2: Create me a prompt for a DALL-E image model. You have to create the perfect prompt for a painting of these " + gameLogic.playerCount + " characters. The prompt should include a very detailed and specific description of the image based on the visual Information you extracted in step 1.")
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
    //let prompt = await getChatResponse("You are a prompt engineering expert. You have years of experience in the field and your are up to date with the newest trends and techniques.\n You are supposed to create the perfect prompt. The Portrait that is supposed to be created should show this: A full body portrait painting of a exlorer, artist and intellectual during the middle Ages. You can see that he is reading and exploring a lot. His books and manuscripts can be seen as well as an old ink pen and jar.\n In the style of gothic art" )
    //let prompt = "A portrait of a Renaissance man during the Middle Ages, embodying the roles of an explorer, artist, and intellectual. Engrossed in reading amidst ancient tomes in a dimly lit study, he wears intricate Gothic attire with a cloak. His intense concentration is evident as he holds an ink pen, ready to annotate manuscripts. The detailed painting showcases the texture of parchment and delicate script, set against ornate tapestries and dramatic lighting. A masterpiece celebrating the pursuit of knowledge and creativity in the Middle Ages."
    //let prompt = "This painting depicts a Renaissance explorer engrossed in reading manuscripts, symbolizing his thirst for knowledge. The gothic style painting features intricate details, rich colors, and traditional attire. The explorer's expression conveys curiosity and contemplation, inviting viewers to explore his world of intellectual pursuit. He is writting something in a old book. There are candles lighting the room."
    //let prompt = "This painting depicts a Renaissance explorer engrossed in reading manuscripts, symbolizing his thirst for knowledge. The Gothic-style painting features intricate details, rich colors, and traditional attire. The explorer's expression conveys curiosity and contemplation, inviting viewers to explore his world of intellectual pursuit. He is writing something in an old book, and there are candles lighting the room."
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
    //return
    //let prompt = "Create a role card for the game 'The Werewolves of Miller's Hollow' for the following role: " + role + ". \nThe card should resemble the existing role cards from the game. It should have a dark, mysterious, and rustic design with elements that suggest a medieval village setting. The card should include an illustration of the character in the role, surrounded by an ornate frame. The character should be dressed in period-appropriate attire. Ensure the overall aesthetic matches the tone and style of the existing cards in the game."
    //let prompt = "Illustrate a old wall painting of " + role + ". An old wall painting of a ancient civilization."
    //let prompt = "Illustrate a old painting of " + role + ". An old wall painting of a ancient civilization, like the celts. Symmetric. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed. In the style of Insular Art."
    //let prompt = "Illustrate a old painting of " + role + ". An old wall painting of a ancient civilization, like the celts. Symmetric. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed. In the style of Pictish Art."
    //let prompt = "Illustrate a old painting of " + role + ". An old wall painting of an ancient civilization, like the celts. Symmetric. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed. In the style of Modern Naturalism."
    //let prompt = "Illustrate a old painting of " + role + ". An old wall painting of an ancient civilization. Symmetric. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed. It should feature many Geometric Patterns."
    //let prompt = "Illustrate a old painting of " + role + ". An old wall painting of an ancient civilization. Symmetric. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed. It should feature many Geometric Patterns."
    //let prompt = "Illustrate a old painting of " + role + ". An old wall painting of an ancient civilization, like the celts. Symmetric. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed. It should feature many Geometric Patterns similiar to a mandala."
    //let prompt = "Illustrate a old painting of " + role + ". An old wall painting of an ancient civilization, like the celts. Symmetric. Looks a bit old, a bit rough and yellowed, there are holes at the edges, slightly decomposed, decayed. It should look a bit like a mandala."
    //let prompt = "Illustrate a old print from medieval times of " + role + ". In the style: Gothic woodcut. Symmetric. Looks a bit old, a bit rough and yellowed, there are holes at the edges, slightly decomposed, decayed. It should feature many Geometric Patterns similiar to a mandala."
    let prompt = "Illustrate a old painting in the form of an mandala of " + role + ". In the style: Gothic woodcut. Symmetric. Looks a bit old, a bit rough, there are holes at the edges, slightly decomposed, decayed."

    //OGGGGGG NEW
    //let prompt = "Illustrate a old painting in the form of an mandala of " + role + ". In the style: Gothic woodcut. Symmetric. Looks a bit old, a bit rough, there are holes at the edges, slightly decomposed, decayed."

    //OG NEW
    //let prompt = "Illustrate a old painting of " + role + ". In the style: Gothic woodcut. Symmetric. Looks a bit old, a bit rough and yellowed, there are holes at the edges, slightly decomposed, decayed. It should feature many Geometric Patterns similiar to a mandala."

    //OG
    //let prompt = "Illustrate a old painting of " + role + ". An old wall painting of an ancient civilization, like the celts. Symmetric. Looks very old, a bit rough and yellowed, there are holes at the edges, decomposed, decayed."
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
    /*storyPrompt = storyPrompt + "\nFühre die Geschichte nun weiter und schreibe einen neuen Eintrag. Geb dem Eintrag auf gar keinen Fall eine Überschrift. Maximal 125 Wörter. In diesem Eintrag geht es darum, dass das Dorf langsam aufgewacht ist. Gebe dann nur folgende Ereignisse, passend zu den anderen Einträgen und dem bisherigen Schribstil, wieder: "
    if(victims.length < 1) {
        storyPrompt = storyPrompt + "\nNichts is geschen. Alle Bewohner leben noch."
    } else if(victims.length === 1) {
        storyPrompt = storyPrompt + "\n" + victims[0].name + " wurde Tot augefunden. Gehe besonders auf seine Charaktereigenschaften und Rolle im Dorf ein, die er gespielt hatte: ." + victims[0].description + "\n" + "Der Tote stellt sich als: " + victims[0].role + " heraus."
    } else if(victims.length > 1) {
        storyPrompt = storyPrompt + "\n" + victims[0].name + " wurde Tot augefunden. " + victims[1].name + " wurde ebenfalls Tot aufgefunden. Gehe besonders auf die Charaktereigenschaften und Rollen im Dorf ein, die die zwei Toten gespielt hatte.\n" + victims[0].name + " stellte sich als: " + victims[0].role + " heraus. " + victims[1].name + " stellte sich als: " + victims[1].role + " heraus." 
    }

    storyPrompt = storyPrompt + "\nDas Dorf will nun abstimmen, wenn sie als nächstes Hinrichten wollen. Um einen Werwolf zu finden. \n\n Du darfst auf keinen Fall, selber anschuldigungen machen. "
    morningEntry = await getStoryResponse(storyPrompt, storyTemp);*/


    let = morningPrompt = "Führe die Geschichte nun weiter und schreibe einen neuen Eintrag. Geb dem Eintrag auf gar keinen Fall eine Überschrift. Maximal 125 Wörter. In diesem Eintrag geht es darum, dass das Dorf langsam aufgewacht ist. Gebe dann nur folgende Ereignisse, passend zu den anderen Einträgen und dem bisherigen Schribstil, wieder: "
    if(victims.length < 1) {
        morningPrompt = morningPrompt + "\nNichts is geschen. Alle Bewohner leben noch. Maximal 100 Wörter. Beschreibe kurz wie die Einwohner des Dorfes den morgen verbringen."
    } else if(victims.length === 1) {
        morningPrompt = morningPrompt + "\n" + victims[0].name + " wurde tot augefunden. Gehe besonders auf seine Charaktereigenschaften und Rolle im Dorf ein, die er gespielt hatte: ." + victims[0].description + "\n" + "Der Tote stellt sich als: " + victims[0].role + " heraus."
    } else if(victims.length > 1) {
        morningPrompt = morningPrompt + "\n" + victims[0].name + " wurde tot augefunden. " + victims[1].name + " wurde ebenfalls tot aufgefunden. Gehe besonders auf die Charaktereigenschaften und Rollen im Dorf ein, die die zwei Toten gespielt hatte.\n" + victims[0].name + " stellte sich als: " + victims[0].role + " heraus. " + victims[1].name + " stellte sich als: " + victims[1].role + " heraus." 
    }
    morningEntry = morningEntry + "\nDas Dorf will nun abstimmen, wenn sie als nächstes Hinrichten wollen um einen Werwolf zu finden. \n\n Du darfst auf keinen Fall, selbst Anschuldigungen machen. "
    morningEntry = await getStoryResponse(morningPrompt, storyTemp)


    updateStory(morningEntry)
    return morningEntry;
}

async function giveExecutionEntry(selected) {
    let temp = storyTemp
    let executionEntry = ""
    console.log(selected)
    /*storyPrompt = storyPrompt + "\nFühre die Geschichte nun weiter und schreibe einen neuen Eintrag. Geb dem Eintrag auf gar keinen Fall eine Überschrift. Maximal 125 Wörter. In diesem Eintrag geht es darum, dass das Dorf abgestimmt hat wer als nächstes Hingerichtet werden soll. Gebe dann folgende Ereignisse, passend zu den anderen Einträgen und dem bisherigen Schribstil, ausführlich wieder: \n\n"
    if(selected !== "None") {
        temp = 0.5
        storyPrompt = storyPrompt + selected.name + " wurde vom Dorf zum Tode verurteilt. Gehe besonders auf seine Charaktereigenschaften und Rolle im Dorf ein, die er gespielt hatte.\n" + "Der Tote stellt sich als: " + selected.role + " heraus. Beschreibe seine Hinrichtung. \n"
    } else {
        storyPrompt = storyPrompt + "Die Bewohner konnten sich nicht entscheiden, niemand wird hingerichtet. Gehe darrauf ein wie dies den Werwölfen nützen könnte. \n"
    }

    storyPrompt = storyPrompt + "\n\nDie Sonne geht wieder unter und das Dorf schläft langsam wieder ein. "
    executionEntry = await getStoryResponse(storyPrompt, temp);*/


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
    //let silentInterventionText = "You are a expert moderator and game guide. Your mission is to moderate a discussion between people in a village who try to find out who of them is a werewolf. \nIn the story you are the eldest person in the village, who doesnt participate in all of this and only intervenes, when the young have problems finding a solution.\n\nThe story till now looks like this: " + storyPrompt + "\n\nNow the discussion was silent for a while. The discussion looked like this till now: " + discussionText +  "\n\nTry to warm up the discussion again, with some remarks about certain players to make them a suspect or some jokes that could be used to heat up a debate. Dont reveal any roles of the players. Only use max 50 words:"
    let silentInterventionText = "Du verfolgst eine der Debatten im Dorf und machst dabei Notizen. Du bist ebenfalls ein erfahrener Moderator. Deine Aufgabe ist es nun, eine Diskussion in einem Dorf zu moderieren, in dem die Bewohner versuchen herauszufinden, wer unter ihnen ein Werwolf ist. Du bist dabei nur ein Beobachter, der nicht aktiv teilnimmt und nur eingreift, wenn die Bewohner Schwierigkeiten haben, eine Lösung zu finden. \n\nDie Diskussion war eine Weile still. Bisher sah die Diskussion so aus: " + discussionText + ".\n\nVersuche die Diskussion wieder zu beleben, indem du einige Bemerkungen über bestimmte Spieler machst, um sie verdächtig erscheinen zu lassen, oder einige Witze einfügst, die die Debatte anheizen könnten. Verrate keine Rollen der Spieler. Nutze maximal 50 Wörter."
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
    let endingPrompt = "\nFühre die Geschichte nun zum Abschluss und schreibe einen letzten verzweifelten Eintrag. Geb dem Eintrag auf gar keinen Fall eine Überschrift. Maximal 150 Wörter. In diesem letzten Eintrag geht es darum, dass die Werwölfe gewonnen haben und das Dorf nun menschenleer ist. Die Werwölfe haben gesiegt, beschreibe wie sie die Dorfbewohner getäuscht haben: \n"
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

    endingPrompt = endingPrompt + "\nFühre die Geschichte nun zum Abschluss und schreibe einen letzten Eintrag. Gib dem Eintrag auf keinen Fall eine Überschrift. Maximal 150 Wörter. In diesem letzten Eintrag geht es darum, dass die Werwölfe besiegt wurden und das Dorf wieder in Frieden Leben kann. Rekapituliere noch einmal die Ereignisse. \n"
    if(deadVillager.length > 0) {
        endingPrompt = endingPrompt + "Schreibe einen kleinen Nachruf an alle die gestorben sind und keine Werwölfe waren:\n"
        deadVillager.forEach((player) => {
            endingPrompt = endingPrompt + "Name: " + player.name + "Pronomen: " + player.pronouns + ". Alter: " + player.age + ". Beschreibung: " + player.description + ". \n";
        });
    }
    endingPrompt = endingPrompt+ "\n\nBlicke in die Zukunft und erzähle was, so hast du gehört, aus den noch Lebenden Einwohnern geworden ist:\n"
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
    let endingPrompt = "\nFühre die Geschichte nun zum Abschluss und schreibe einen letzten Eintrag. Gib dem Eintrag auf keinen Fall eine Überschrift. Maximal 150 Wörter. In diesem letzten Eintrag geht es darum, dass niemand überlebt hat und das Dorf nun menschenleer ist.  Sowohl alle Werwölfe als auch Dorfbewohner sind gestorben. Du als Autor wirst abreisen. Blicke zurück auf die Ereignisse und Einwohner. Sei wehmütig, dass sich niemand an das Geschehene Erinnern wird."

    endingEntry = await getStoryResponse(endingPrompt, 0.9);
    updateStory(endingEntry)
    return endingEntry;
}


async function testAllImages() {
    let testObject = {
        //avatarHans: await giveAvatar('Er/Ihm', '35', 'Der Bäcker des Dorfes. Jeder liebt seine Brötchen. Er hat rote Haare und blaue Augen.'),
        //avatarBernda: await giveAvatar('Sie/Ihr', '77', 'Die Dorfälteste. Sie hat immer ein offenes Ohr für die anderen Mitbewohner. Sie hat graue Haare und ein altes, faltiges Gesicht..'),
        //avatarWurmi: await giveAvatar('Er/Ihm', '55', 'Wurmi wurde in einen Frosch verwandelt. Er lebt seit einigen Jahren im Dorf und trägt stets seinen liebsten Hut.'),
        //errorAvatar: await giveAvatar('Er/Ihm', '35', 'Ein böser Schurke. Er hat keine Freunde. Scharfe Zähne. Blut. Mord.')
        //citizen: await giveRoleCard("a group of ordinary citizens. Normal clothing for the middle ages. Different age groups. Men and woman. Yellow and plain colors."),
        //werewolf: await giveRoleCard("a werewolf. Evil and scary. Sharp teeth. Dark Red and black colors. A full moon. Red background."),
        //witch: await giveRoleCard("a witch. Dancing around a kettle with boiling water. Magical. Green, Yellow and Orange colors. Potions. Snake. Poison."),
        //seer: await giveRoleCard("a fortune teller. Holding her hands over a crystal ball. Mystical. Visions. Eyes everywhere. Violet and yellow Color.")
        authorImage: await givePortrait(),
        //introImage: await giveIntroPicture("Wurms, der ehemalige Mensch, der nun als Frosch lebt, ist bekannt für seinen liebevollen Hut und seine weise Art. Hans, der talentierte Bäcker mit roten Haaren und blauen Augen, verbreitet mit seinen Brötchen Freude im ganzen Dorf. Bernda, die respektierte Dorfälteste mit grauen Haaren und einem faltigen Gesicht, ist immer für ihre Mitbewohner da und hört ihnen aufmerksam zu."),
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
        morning3: await giveMorningEntry(new Array(Anna)),
        execution3: await giveExecutionEntry("None"),
        morning4: await giveMorningEntry(new Array()),
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