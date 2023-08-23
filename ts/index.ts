import { PhraseCounter } from './PhraseCounter';

function main() {
    let counter = document.querySelector('#counter');
    let talk = document.querySelector('#talk');
    let phraseCounter = new PhraseCounter('口癖', updateCounter);
    let formManager = new FormManager(phraseCounter);

    function updateCounter(phrase: string, cnt: number, message?: string) {
        if (!counter || !talk) return;

        if (message) talk.textContent = message;
        counter.textContent = cnt + '';
    }

    phraseCounter.start();
}

class FormManager {
    title: HTMLHeadingElement;
    ok: HTMLButtonElement;
    phrase_i: HTMLInputElement;
    count_i: HTMLInputElement;
    phraseCounter: PhraseCounter;
    constructor(p) {
        let title = document.querySelector('h1#title');
        let ok = document.querySelector('#ok');
        let phrase_i = document.querySelector('input#phrase-input');
        let count_i = document.querySelector('input#count-input');
        if (title !== null && ok !== null && phrase_i !== null && count_i !== null) {
            this.phraseCounter = p;
            this.title = <HTMLHeadingElement>title;
            this.ok = <HTMLButtonElement>ok;
            this.phrase_i = <HTMLInputElement>phrase_i;
            this.count_i = <HTMLInputElement>count_i;
        } else {
            console.error('FormManagerの初期化に失敗しました');
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.ok.addEventListener('click', this.onSubmit);
    }

    onSubmit() {
        console.log('ok button clicked')
        let phrase = this.phrase_i.value;
        let count = parseInt(this.count_i.value) || 0;
        this.phraseCounter.setPhrase(phrase);
        this.phraseCounter.setCount(count);
        this.title.textContent = phrase.split('|')[0] + 'カウンター';
    }
}

addEventListener('load', () => {
    main();
});

