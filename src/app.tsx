import { useEffect, useRef } from 'preact/hooks'
import Logo from './components/Logo';
import HistoryLine, { HistoryLineData } from './components/HistoryLine';
import { useObjectState } from './use-object-state';
import MathInput from './components/MathInput';
import { Options, TopBar } from './components/TopBar';
import './styles/app.scss'
import { LargeNumber } from '@/math/internal/large-number';
import { prepareWorker } from '@/math';

export type AppState = {
  answer: LargeNumber;
  ind: LargeNumber;
  answers: HistoryLineData[];
  extraInfo: string | null;
  latex: boolean;
  history: string[];
  workHistory: string[];
  historyIndex: number;
}

export function App() {
  const [options, setOptions] = useObjectState<Options>({
    degreeUnit: 'deg',
    resultAccuracy: 8
  });
  const [appState, setAppState] = useObjectState<AppState>({
    answer: new LargeNumber(0),
    ind: new LargeNumber(0),
    answers: [],
    extraInfo: null,
    latex: false,
    history: [], // Only past commands
    workHistory: [], // User may edit these
    historyIndex: -1,
  });
  useEffect(() => {
    prepareWorker();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <TopBar options={options} setOptions={setOptions} />
      <div class="history">
        <div className={`welcome-message${appState.answers.length > 0 ? ' hidden' : ''}`}>
          <Logo height="128" width="128" />
          <h1>Kalkki</h1>
          <p>Tervetuloa käyttämään Kalkkia!</p>
          <p>Aloita kirjoittamalla lauseke alla olevaan kenttään.</p>
          {import.meta.env.VITE_HIDE_PWA_PROMPT !== 'true' && <p class="hide-pwa-prompt">Tietokoneella parhaan kokemuksen saat <span id="pwa-install-prompt" hidden><a href="#" onClick={() => (window as any).installPWA()}>asentamalla sen PWA-sovelluksena</a> tai </span><a href="/app">iframe-tilassa</a>.</p>}
        </div>
        {appState.answers.map((line, index) => <HistoryLine key={`line-${index}`} inputRef={inputRef} {...line} accuracy={options.resultAccuracy} />)}
      </div>
      <MathInput inputRef={inputRef} state={appState} setState={setAppState} options={options} />
    </>
  )
}
