const $bc186b8d45a57dfc$var$MySpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const $bc186b8d45a57dfc$var$MySpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const $bc186b8d45a57dfc$var$MySpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
class $bc186b8d45a57dfc$export$fa72406a4d70b34a {
    constructor(phrase, callback){
        this.callback = callback;
        this.recognition = new $bc186b8d45a57dfc$var$MySpeechRecognition();
        this.recognitionList = new $bc186b8d45a57dfc$var$MySpeechGrammarList();
        this.setPhrase(phrase);
        this.recognition.lang = "ja-JP";
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 5;
        this.recognition.onresult = this.onresult.bind(this);
        this.recognition.onend = this.onend.bind(this);
        this.recognition.onstart = $bc186b8d45a57dfc$var$onstart.bind(this);
        this.cnt = 0;
        this.start();
    }
    oncountchange(count) {
        if (this.callback) this.callback(this.phrase, count);
    }
    setPhrase(phrase) {
        console.log("setPhrase: " + phrase);
        this.phrase = phrase;
        let grammer = "#JSGF V1.0; grammar phrase; public <phrase> = " + phrase.toLowerCase() + ";";
        this.recognitionList.addFromString(grammer, 1);
        this.recognition.grammars = this.recognitionList;
    }
    setCount(count) {
        if (this.cnt !== count) {
            console.log("count changed: " + count);
            this.oncountchange(count);
            this.cnt = count;
        }
    }
    onresult(event) {
        let tempCnt = 0;
        var speechResult = event.results[0][0].transcript.toLowerCase();
        console.log("result: " + speechResult);
        let re = new RegExp(this.phrase, "gm");
        let matched = speechResult.match(re);
        if (matched !== null) {
            let textContent = matched[0] + "って言いました！";
            tempCnt = matched.length;
            console.log(textContent + this.cnt);
        } else console.log("これは口癖ではありません");
        console.log("current count: " + this.cnt);
        console.log("tempCnt: " + tempCnt);
        this.setCount(this.cnt + tempCnt);
        if (this.callback) this.callback(this.phrase, this.cnt, speechResult);
        console.log("話した内容: " + speechResult);
    }
    onend() {
        this.running = false;
        //Fired when the speech recognition service has disconnected.
        console.log("SpeechRecognition.onend");
        // restart speech recognition
        console.log("restart recognition");
        this.start();
    }
    start() {
        if (!this.running) {
            this.recognition.start();
            this.running = true;
        }
    }
}
// function onspeechend() {
//     recognition.stop();
//     testBtn.disabled = false;
// }
function $bc186b8d45a57dfc$var$onerror(event) {
    console.log("error: " + event);
}
function $bc186b8d45a57dfc$var$onaudiostart(event) {
    //Fired when the user agent has started to capture audio.
    console.log("SpeechRecognition.onaudiostart");
}
function $bc186b8d45a57dfc$var$onaudioend(event) {
    //Fired when the user agent has finished capturing audio.
    console.log("SpeechRecognition.onaudioend");
}
function $bc186b8d45a57dfc$var$onend(event) {
    //Fired when the speech recognition service has disconnected.
    console.log("SpeechRecognition.onend");
// restart speech recognition
//testSpeech();
}
function $bc186b8d45a57dfc$var$onnomatch(event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log("SpeechRecognition.onnomatch");
}
function $bc186b8d45a57dfc$var$onsoundstart(event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log("SpeechRecognition.onsoundstart");
}
function $bc186b8d45a57dfc$var$onsoundend(event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log("SpeechRecognition.onsoundend");
}
function $bc186b8d45a57dfc$var$onspeechstart(event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log("SpeechRecognition.onspeechstart");
}
function $bc186b8d45a57dfc$var$onstart(event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log("SpeechRecognition.onstart");
}


function $551344c4fc881fc2$var$main() {
    let counter = document.querySelector("#counter");
    let talk = document.querySelector("#talk");
    let phraseCounter = new (0, $bc186b8d45a57dfc$export$fa72406a4d70b34a)("口癖", updateCounter);
    let formManager = new $551344c4fc881fc2$var$FormManager(phraseCounter);
    function updateCounter(phrase, cnt, message) {
        if (!counter || !talk) return;
        if (message) talk.textContent = message;
        counter.textContent = cnt + "";
    }
    phraseCounter.start();
}
class $551344c4fc881fc2$var$FormManager {
    constructor(p){
        this.color = {
            bg: "#ffffff",
            txt: "#000000"
        };
        let title = document.querySelector("h1#title");
        let ok = document.querySelector("#ok");
        let bgColor = document.querySelector("input#bg-color");
        let textColor = document.querySelector("input#text-color");
        let phrase_e = document.querySelector("input#phrase-input");
        let count_e = document.querySelector("input#count-input");
        if (title !== null && ok !== null && phrase_e !== null && count_e !== null && textColor !== null && bgColor !== null) {
            this.phraseCounter = p;
            this.title = title;
            this.ok = ok;
            this.colorBG_e = bgColor;
            this.colorText_e = textColor;
            this.phrase_e = phrase_e;
            this.count_e = count_e;
        } else console.error("FormManagerの初期化に失敗しました");
        this.onSubmit = this.onSubmit.bind(this);
        this.ok.addEventListener("click", this.onSubmit);
        this.setValuesFromStorage();
        this.applyColors();
    }
    applyColors() {
        let body = document.querySelector("body");
        if (body) body.setAttribute("style", "background-color: " + this.color.bg + "; color: " + this.color.txt + ";");
    }
    setValuesFromStorage() {
        let phrase = localStorage.getItem("input#phrase-input");
        if (phrase) {
            this.phrase_e.value = phrase;
            this.phraseCounter.setPhrase(phrase);
            this.title.textContent = phrase.split("|")[0] + "カウンター";
        }
        let count = localStorage.getItem("input#count-input");
        if (count) {
            this.count_e.value = count;
            this.phraseCounter.setCount(parseInt(count) || 0);
        }
        let colorBG = localStorage.getItem("input#bg-color");
        if (colorBG) {
            this.colorBG_e.value = colorBG;
            this.color.bg = colorBG;
        }
        let colorText = localStorage.getItem("input#text-color");
        if (colorText) {
            this.colorText_e.value = colorText;
            this.color.txt = colorText;
        }
    }
    onSubmit() {
        console.log("ok button clicked");
        let phrase = this.phrase_e.value;
        let count = parseInt(this.count_e.value) || 0;
        this.color.bg = this.colorBG_e.value;
        this.color.txt = this.colorText_e.value;
        localStorage.setItem("input#phrase-input", phrase);
        localStorage.setItem("input#count-input", count + "");
        localStorage.setItem("input#bg-color", this.color.bg);
        localStorage.setItem("input#text-color", this.color.txt);
        this.phraseCounter.setPhrase(phrase);
        this.phraseCounter.setCount(count);
        this.title.textContent = phrase.split("|")[0] + "カウンター";
        this.applyColors();
    }
}
addEventListener("load", ()=>{
    $551344c4fc881fc2$var$main();
});


//# sourceMappingURL=index.09af087a.js.map
