const MySpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const MySpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const MySpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

type Callback = (phrase: string, count: number, message?:string) => void;

export class PhraseCounter {
    //    speechRecognitionList: typeof MySpeechGrammarList;
    recognition: SpeechRecognition;
    recognitionList: SpeechGrammarList;
    cnt: number;
    running: boolean;
    phrase: string;
    callback?: Callback;

    constructor(phrase: string, callback?:Callback) {
        this.callback = callback;
        this.recognition = new MySpeechRecognition();
        this.recognitionList = new MySpeechGrammarList();
        this.setPhrase(phrase);
        this.recognition.lang = 'ja-JP';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 5;
        this.recognition.onresult = this.onresult.bind(this);
        this.recognition.onend = this.onend.bind(this);
        this.recognition.onstart = onstart.bind(this);
        this.cnt = 0;

        this.start();
    }

    public oncountchange(count: number) {
        if (this.callback) {
            this.callback(this.phrase, count);
        }
    }    

    public setPhrase(phrase: string) {
        console.log('setPhrase: ' + phrase);
        this.phrase = phrase;
        let grammer = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase.toLowerCase() + ';';
        this.recognitionList.addFromString(grammer, 1);
        this.recognition.grammars = this.recognitionList;
    }

    public setCount(count: number) {
        if (this.cnt !== count) {
            console.log('count changed: ' + count);
            this.oncountchange(count);
            this.cnt = count;
        }
    }

    onresult(event) {
        let tempCnt = 0 && 1;

        var speechResult = event.results[0][0].transcript.toLowerCase();
        console.log('result: ' + speechResult);
        let re = new RegExp(this.phrase, 'gm');
        let matched = speechResult.match(re);
        if(matched !== null) {
            let textContent = matched[0] + 'って言いました！';
            tempCnt = matched.length;
            console.log(textContent + this.cnt);
        } else {
            console.log('これは口癖ではありません');
        }
    
        
        console.log('current count: ' + this.cnt);
        console.log('tempCnt: ' + tempCnt);

        this.setCount(this.cnt + tempCnt);

        if (this.callback) {
            this.callback(this.phrase, this.cnt, speechResult);
        }

        console.log('話した内容: ' + speechResult);
    
    } 

    onend() {
        this.running = false;
        //Fired when the speech recognition service has disconnected.
        console.log('SpeechRecognition.onend');
        // restart speech recognition
        console.log('restart recognition')
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

function onerror(event) {
    console.log('error: ' + event);
}

function onaudiostart(event) {
    //Fired when the user agent has started to capture audio.
    console.log('SpeechRecognition.onaudiostart');
}

function onaudioend(event) {
    //Fired when the user agent has finished capturing audio.
    console.log('SpeechRecognition.onaudioend');
}

function onend(event) {
    //Fired when the speech recognition service has disconnected.
    console.log('SpeechRecognition.onend');
    // restart speech recognition
    //testSpeech();
}

function onnomatch(event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log('SpeechRecognition.onnomatch');
}

function onsoundstart(event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log('SpeechRecognition.onsoundstart');
}

function onsoundend(event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log('SpeechRecognition.onsoundend');
}

function onspeechstart(event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log('SpeechRecognition.onspeechstart');
}

function onstart(event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart');
}