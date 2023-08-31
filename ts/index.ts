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

type Color = {bg: string, txt: string}

class FormManager {
    title: HTMLHeadingElement;
    ok: HTMLButtonElement;
    phrase_e: HTMLInputElement;
    count_e: HTMLInputElement;
    phraseCounter: PhraseCounter;
    colorBG_e: HTMLInputElement;
    colorText_e: HTMLInputElement;
    color: Color = {bg: '#ffffff', txt: '#000000'};
    
    constructor(p) {
        let title = document.querySelector('h1#title');
        let ok = document.querySelector('#ok');
        let bgColor = document.querySelector('input#bg-color');
        let textColor = document.querySelector('input#text-color');
        let phrase_e = document.querySelector('input#phrase-input');
        let count_e = document.querySelector('input#count-input');
        if (title !== null && ok !== null && phrase_e !== null &&
            count_e !== null && textColor !== null && bgColor !== null) {
            this.phraseCounter = p;
            this.title = <HTMLHeadingElement>title;
            this.ok = <HTMLButtonElement>ok;
            this.colorBG_e = <HTMLInputElement>bgColor;
            this.colorText_e = <HTMLInputElement>textColor;
            this.phrase_e = <HTMLInputElement>phrase_e;
            this.count_e = <HTMLInputElement>count_e;
        } else {
            console.error('FormManagerの初期化に失敗しました');
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.ok.addEventListener('click', this.onSubmit);

        this.setValuesFromStorage();
        this.applyColors();
    }

    applyColors() {
        let body = document.querySelector('body');
        if (body) {
            body.setAttribute('style', 'background-color: ' + this.color.bg + '; color: ' + this.color.txt + ';')
        }
    }

    setValuesFromStorage() {
        let phrase = localStorage.getItem('input#phrase-input');
        if (phrase) {
            this.phrase_e.value = phrase;
            this.phraseCounter.setPhrase(phrase);
            this.title.textContent = phrase.split('|')[0] + 'カウンター';
        }

        let count = localStorage.getItem('input#count-input');  
        if (count) {
            this.count_e.value = count;
            this.phraseCounter.setCount(parseInt(count) || 0);
        }
        
        let colorBG = localStorage.getItem('input#bg-color');
        if (colorBG) {
            this.colorBG_e.value = colorBG;
            this.color.bg = colorBG;
        }

        let colorText = localStorage.getItem('input#text-color');
        if (colorText) {
            this.colorText_e.value = colorText;
            this.color.txt = colorText;
        }
    }

    onSubmit() {
        console.log('ok button clicked')
        let phrase = this.phrase_e.value;
        let count = parseInt(this.count_e.value) || 0;
        this.color.bg = this.colorBG_e.value;
        this.color.txt = this.colorText_e.value;

        localStorage.setItem('input#phrase-input', phrase);
        localStorage.setItem('input#count-input', count + '');
        localStorage.setItem('input#bg-color', this.color.bg);
        localStorage.setItem('input#text-color', this.color.txt);

        this.phraseCounter.setPhrase(phrase);
        this.phraseCounter.setCount(count);
        this.title.textContent = phrase.split('|')[0] + 'カウンター';
        this.applyColors();
    }
}

addEventListener('load', () => {
    main();
});

