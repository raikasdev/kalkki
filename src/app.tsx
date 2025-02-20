import { useRef } from 'preact/hooks'
import Decimal from 'decimal.js';
import Logo from './components/Logo';
import HistoryLine, { HistoryLineData } from './components/HistoryLine';
import { useObjectState } from './use-object-state';
import MathInput from './components/MathInput';
import { Options, TopBar } from './components/TopBar';
import './styles/app.scss'

export type AppState = {
  answer: Decimal;
  ind: Decimal;
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
    answer: new Decimal(0),
    ind: new Decimal(0),
    answers: [],
    extraInfo: null,
    latex: false,
    history: [], // Only past commands
    workHistory: [], // User may edit these
    historyIndex: -1,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <TopBar options={options} setOptions={setOptions} />
      <div class="history">
        <div className={`welcome-message${appState.answers.length > 0 ? ' hidden' : ''}`}>
          <Logo height="128" width="128" />
          <h1>Abikalkki</h1>
          <p>Tervetuloa käyttämään Abikalkkia!</p>
          <p>Aloita kirjoittamalla lauseke alla olevaan kenttään.</p>
          <p class="hide-pwa-prompt">Tietokoneella parhaan kokemuksen saat <span id="pwa-install-prompt" hidden><a href="#" onClick={() => (window as any).installPWA()}>asentamalla sen PWA-sovelluksena</a> tai </span><a href="/app">iframe-tilassa</a>.</p>
        </div>
        {appState.answers.map((line, index) => <HistoryLine key={`line-${index}`} inputRef={inputRef} {...line} accuracy={options.resultAccuracy} />)}
      </div>
      <MathInput inputRef={inputRef} state={appState} setState={setAppState} options={options} />
    </>
  )
}
