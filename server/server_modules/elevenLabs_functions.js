//import { ElevenLabsClient, play } from "elevenlabs";
const { ElevenLabsClient, play } = require("elevenlabs");
require("dotenv").config();

const eleven_labs_key = process.env.ELEVEN_LABS_KEY;

const elevenlabs = new ElevenLabsClient({
  apiKey: eleven_labs_key // Defaults to process.env.ELEVENLABS_API_KEY
})

async function tts(text) {
    //return
    if(text === "Error") {
        return
    }
    let audio = ""

    try {
        audio = await elevenlabs.generate({
            voice: "Wizard",
            text: text,
            model_id: "eleven_multilingual_v2"
        });
        return audio
    } catch(error) {
        console.error(error);
        return
    }
}

async function tts_debate(text) {
    //return
    if(text === "Error") {
        return
    }
    let audio = ""

    try {
        audio = await elevenlabs.generate({
            voice: "Wizard",
            text: text,
            model_id: "eleven_multilingual_v2"
        });
        return audio
    } catch(error) {
        console.error(error);
        return
    }
}
    

async function play_audio(audio) {
    if(!audio || audio === undefined) {
        console.log("No audio provided")
        return
    }
    //return
    await play(audio)
    return 
    console.log("Playing audio...")
}

//play_audio()
//play(await tts_elevenLabs("Hello"));




async function generate_sound(prompt) {
    const options = {
        method: 'POST',
        headers: {
          'xi-api-key': '255a8969858bab467d1b4704739d2f19',
          'Content-Type': 'application/json'
        },
        body: '{"text":"Morning sounds in medieval village","duration_seconds":1}'
      };
      
    response = await fetch('https://api.elevenlabs.io/v1/sound-generation', options)
    return response
    /*console.log(response)
    console.log(response[Symbol.state])
    console.log(response[Symbol.state].urlList[0])
    audio = response[Symbol.state].urlList[0].href;
    console.log(audio)
    return audio*/
        /*.then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));*/
}




module.exports = {
    play_audio,
    tts,
    generate_sound,
    tts_debate
}
