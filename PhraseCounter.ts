const MySpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const MySpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;

type Callback = (phrase: string, count: number, message?:string) => void;

export class PhraseCounter {
    //    speechRecognitionList: typeof MySpeechGrammarList;
    recognition: SpeechRecognition;
    recognitionList: SpeechGrammarList;
    cnt: number;
    phrase: string;
    callback?: Callback;
    running: boolean;
    private static hasInstance: boolean;
    private static instance: PhraseCounter;

    constructor(phrase: string, callback?:Callback) {
        this.phrase = phrase;
        this.callback = callback;
        this.running = false;

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
        PhraseCounter.hasInstance = true;
    }

    public static getInstance(phrase: string, callback?: Callback) {
        if (!PhraseCounter.hasInstance) {
            PhraseCounter.instance = new PhraseCounter(phrase, callback);
        }
        return PhraseCounter.instance;
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

    onresult(event: SpeechRecognitionEvent) {
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
    
        
        this.setCount(this.cnt + tempCnt);

        if (this.callback) {
            this.callback(this.phrase, this.cnt, speechResult);
        }

        // console.log('話した内容: ' + speechResult);
    
    } 

    onend() {
        this.running = false;
        //Fired when the speech recognition service has disconnected.
        // console.log('SpeechRecognition.onend');
        // // restart speech recognition
        // console.log('restart recognition')
        this.start();
    }

    start() {
        if (!this.running) {
            this.recognition.start();
            this.running = true;
        }
    }
}

function onstart() {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart');
}