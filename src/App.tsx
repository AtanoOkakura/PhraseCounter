import { useState, useEffect, useReducer } from 'react';
import React from 'react';
import { PhraseCounter } from './PhraseCounter';
// import logo from '/logo512.png';
import './App.css';

interface AppState {
  bgColor: string;
  textColor: string;
  phrase: string;
  animate: boolean;
  shake: boolean;
}

interface RecognizerState {
  count: number;
  message: string;
}

let recognizer: PhraseCounter;

type PhraseCounterEvent =
  | { type: 'count-changed', count: number}
  | { type: 'phrase-recognized', count: number, message: string}

function reducer(recognizerState: RecognizerState, action: PhraseCounterEvent): RecognizerState {
  switch (action.type) {
    case 'count-changed':
      return {
        ...recognizerState,
        count: action.count,
      };
    case 'phrase-recognized':
      return {
        count: action.count,
        message: action.message,
      };
  }
} 




export default function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    const loadStateFromLocalStorage = (key: string, defaultValue: string) => {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null ? storedValue : defaultValue;
    };
    
    const defaultState = {
      bgColor: loadStateFromLocalStorage('bgColor', '#ffffff'),
      textColor: loadStateFromLocalStorage('textColor', '#1a1a1a'),
      phrase: loadStateFromLocalStorage('phrase', '口癖'),
      count: 0,
      animate: loadStateFromLocalStorage('animate', 'false') === 'true',
      shake: false,
    };
    
    return defaultState;
  });

  const [recognizerState, dispatchRecognitionEvent] = 
    useReducer(reducer,  {
      count: 0,
      message: 'ここに認識されたテキスト',
    });

  const handleRecognition = (phrase: string, count: number, message?: string) => {
    if (message) {
      dispatchRecognitionEvent({
        type: 'phrase-recognized',
        count: count,
        message: message,
      });
    }
  }

  useEffect (() => {
    recognizer = PhraseCounter.getInstance(appState.phrase, handleRecognition);
    recognizer.start();
  });

  // set phrase and update callback
  useEffect(() => {
    recognizer.setPhrase(appState.phrase);
    recognizer.callback = handleRecognition;
  }, [appState.phrase]);

  // set count
  useEffect(() => {
    recognizer.setCount(recognizerState.count);
  }, [recognizerState.count]);

  // animate on count up
  useEffect(() => {
    if (appState.animate) {
      setAppState({
        ...appState,
        shake: true,
      });      
    }
  }, [appState]);

  const handleBGColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let bgColor = e.target.value;
    setAppState({
      ...appState,
      bgColor: bgColor,
    });
    localStorage.setItem('bgColor', bgColor);
  }

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let textColor = e.target.value;
    setAppState({
      ...appState,
      textColor: textColor,
    });
    localStorage.setItem('textColor', textColor);
  }

  const handlePhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phrase = e.target.value;
    setAppState({
      ...appState,
      phrase: phrase,
    });
    localStorage.setItem('phrase', phrase);
  }

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchRecognitionEvent({
      type: 'count-changed',
      count: parseInt(e.target.value) || 0,
    });
  }

  const handleAnimateChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setAppState({
      ...appState,
      animate: e.target.checked,
    });
    localStorage.setItem('animate', e.target.checked.toString());
  }

  return (
    <div className="App">
      <header className="App-header"
        // <header className="App-header pure-u-1 pure-u-md-2-3"
        style={{
          backgroundColor: appState.bgColor,
          color: appState.textColor,
        }}
      >
        <article className="App-display">
          <h1 className="app-title">{appState.phrase.split('|')[0]}カウンター</h1>
          <div className={'counter' + (appState.shake ? ' shake' : '')} onAnimationEnd={() => {
            setAppState({
              ...appState,
              shake: false,
            });
          }}>{recognizerState.count}</div>
          <div className="recognized-text">{recognizerState.message}</div>
        </article>
      </header>
      {/* <footer className='App-config pure-u-1 pure-u-md-1-3'> */}
      <footer className='App-config'>
        <form className="pure-form pure-form-aligned">
          <fieldset>
            {/* <legend>設定</legend> */}
            <div className="pure-control-group">
              <label htmlFor="bg-color">背景色</label>
              <input onChange={handleBGColorChange} defaultValue={appState.bgColor} className="pure-button" type="color" name="bg-color" id="bg-color" />
            </div>
            <div className="pure-control-group">
              <label htmlFor="text-color">文字色</label>
              <input onChange={handleTextColorChange} defaultValue={appState.textColor} type="color" name="text-color" id="text-color" />
            </div>
            <div className="pure-control-group">
              <label htmlFor="phrase">くちぐせ</label>
              <input onInput={handlePhraseChange} defaultValue={appState.phrase} type="text" placeholder="口癖を入力" name="phrase" id="phrase" />
            </div>
            <div className="pure-control-group">
              <label htmlFor="count">カウント</label>
              <input onChange={handleCountChange} defaultValue="0" min="0" max="100" step="1" size={3} maxLength={3}
                pattern="[0-9]*"
                title="数字のみ入力受付"
                inputMode="numeric"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                required type="number" placeholder="回数を設定" name="count" id="count" />
            </div>
            <div className="pure-control-group">
              <label htmlFor="animate">アニメーション</label>
              <input onChange={handleAnimateChange} defaultChecked={appState.animate} type="checkbox" name="animate" id="animate" />
            </div>
          </fieldset>
        </form>
      </footer>
    </div>
  );
}