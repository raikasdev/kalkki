import { useEffect, useRef } from 'preact/hooks'
import Logo from './components/Logo';
import HistoryLine, { HistoryLineData } from './components/HistoryLine';
import { useObjectState } from './util/use-object-state';
import MathInput from './components/MathInput';
import { Options, TopBar } from './components/TopBar';
import './styles/app.scss'
import { LargeNumber } from '@/math/internal/large-number';
import { prepareWorker } from '@/math';
import { translate } from '@/lang';

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

const DEFAULT_OPTIONS = {
  angleUnit: 'deg',
  resultAccuracy: 8,
  language: 'fi',
};

export function App() {
  const [options, setOptions] = useObjectState<Options>({
    ...DEFAULT_OPTIONS,
    ...JSON.parse(localStorage.getItem('kalkki-options') ?? '{}')
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

  useEffect(() => {
    localStorage.setItem('kalkki-options', JSON.stringify(options));
  }, [options]);

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <TopBar options={options} setOptions={setOptions} />
      <div class="history">
        <div className={`welcome-message${appState.answers.length > 0 ? ' hidden' : ''}`}>
          <Logo height="128" width="128" />
          <h1>Kalkki</h1>
          <p dangerouslySetInnerHTML={{ __html: translate('welcome', options.language) }} />
          <p>{translate('welcomeStart', options.language)}</p>
          {
            import.meta.env.VITE_HIDE_PWA_PROMPT !== 'true' && (
              <p class="hide-pwa-prompt" dangerouslySetInnerHTML={{ __html: translate('welcomePwaPrompt', options.language) }} />
            )
          }
        </div>
        {appState.answers.map((line, index) => <HistoryLine key={`line-${index}`} inputRef={inputRef} {...line} accuracy={options.resultAccuracy} />)}
      </div>
      <MathInput inputRef={inputRef} state={appState} setState={setAppState} options={options} />
    </>
  )
}
