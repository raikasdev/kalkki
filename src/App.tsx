import { useEffect, useRef } from 'preact/hooks'
import Logo from './components/Logo';
import HistoryLine, { HistoryLineData } from './components/HistoryLine';
import { useObjectState } from './util/use-object-state';
import MathInput from './components/MathInput';
import { Options, TopBar } from './components/TopBar';
import './styles/app.scss'
import { LargeNumber } from '@/math/internal/large-number';
import { prepareWorker } from '@/math';
import { getDefaultLanguage, translate } from '@/lang';
import { AutoUpdate } from '@/components/AutoUpdate';

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
  language: getDefaultLanguage(),
};

function getDefaultAppState(): AppState {
  const appState: AppState = {
    answer: new LargeNumber(0),
    ind: new LargeNumber(0),
    answers: [],
    extraInfo: null,
    latex: false,
    history: [], // Only past commands
    workHistory: [], // User may edit these
    historyIndex: -1,
  };

  if (localStorage.getItem('kalkki-history') === null) return appState;
  try {
    const { history, answers } = JSON.parse(localStorage.getItem('kalkki-history') ?? '{}');
    if (!history || !answers) throw new Error('Invalid history data');
    appState.history = history;
    appState.workHistory = history;
    appState.answers = answers.map((i: Record<string, string>) => ({ ...i, answer: new LargeNumber(i.answer) }));
  } catch (e) {
    console.error('Loading history from local storage failed!', e);
    localStorage.removeItem('kalkki-history');
  }

  return appState;
}

export function App() {
  const [options, setOptions] = useObjectState<Options>({
    ...DEFAULT_OPTIONS,
    ...JSON.parse(localStorage.getItem('kalkki-options') ?? '{}')
  });
  const [appState, setAppState] = useObjectState<AppState>(getDefaultAppState());

  // Prepare one math worker to be ready in the pool
  useEffect(() => {
    prepareWorker();
  }, []);

  // Save options and history to localStorage
  useEffect(() => {
    localStorage.setItem('kalkki-options', JSON.stringify(options));
    localStorage.setItem('kalkki-history', JSON.stringify({
      history: appState.history,
      answers: appState.answers.map((i) => ({ ...i, answer: i.answer.toString() })), // Class value needs to be serialized
    }));
  }, [options, appState]);


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
      {import.meta.env.VITE_DISABLE_AUTO_UPDATE !== 'true' && <AutoUpdate language={options.language} />}
    </>
  )
}
