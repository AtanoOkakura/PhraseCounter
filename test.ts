import { myFunc } from './ts/MyModule';

class PhraseCounter {
    cnt: number;
    constructor() {
        console.log('hello!!!');
        this.cnt = 0;
    }

    start() {
        this.cnt++;
        console.log(myFunc(this.cnt, this.cnt));
    }
}

let phraseCounter = new PhraseCounter();

phraseCounter.start();

phraseCounter.start();

phraseCounter.start();