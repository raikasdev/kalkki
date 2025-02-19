import { useCallback, useState, useRef, useEffect } from 'preact/hooks'
import { calculate } from './math';
import Decimal from 'decimal.js';
import prettify from './math/prettify';
import { latexToMath } from './math/latex-to-math';
import Logo from './components/Logo';
import { MathError, parseError } from './util';
import './app.scss'

export function App() {
  const [answer, setAnswer] = useState<Decimal>(new Decimal(0));
  const [ind, _setInd] = useState<Decimal>(new Decimal(0));
  const [answers, setAnswers] = useState<[string, Decimal][]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [extraInfo, setExtraInfo] = useState<string | null>(null);

  useEffect(() => {
    // Focus on any keyboard activity
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't capture if user is typing in another input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      inputRef.current?.focus();
    };

    // Focus on window focus
    const handleFocus = () => {
      inputRef.current?.focus();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!inputRef.current) return;
    const input = inputRef.current.value;
    const res = calculate(input, answer, ind, "deg");

    if (event.key === 'Enter') {
      if (res.isErr()) {
        return;
      }
      const { value } = res;
      setAnswer(value);
      setExtraInfo('');
      inputRef.current.value = "";

      setAnswers((answers) => [[prettify(input), value], ...answers]);
    } else {
      if (input === '') {
        setExtraInfo('');
      } else if (res.isErr()) {
        setExtraInfo(parseError(res.error as unknown as MathError));
      } else {
        setExtraInfo(res.value.toDecimalPlaces(8).toString().replace('.', ','))
      }
    }
  }, [inputRef, answer, ind]);

  const pasteLatex = useCallback((event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    // Get the pasted content
    const pastedContent = event.clipboardData.getData('text');

    // Get the target input element
    const input = event.target as HTMLInputElement;
    console.log(pastedContent);
    // Check if paste replaces entire content or input is empty
    if (!input.value || input.selectionStart === 0 && input.selectionEnd === input.value.length) {
      // Check if pasted content contains backslashes
      if (pastedContent.includes('\\')) {
        // Process entire string through latexToMath
        if (inputRef.current) inputRef.current.value = latexToMath(pastedContent);

        // Prevent default paste behavior
        event.preventDefault();
      }
    }
  }, [inputRef, answer, ind]);

  // Handle global paste events
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't capture if user is pasting in another input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      inputRef.current?.focus();
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <>
      <div class="history">
        <div className={`welcome-message${answers.length > 0 ? ' hidden' : ''}`}>
          <Logo height="128" width="128" />
          <h1>Abikalkki</h1>
          <p>Tervetuloa käyttämään Abikalkkia!</p>
          <p>Aloita kirjoittamalla lauseke alla olevaan kenttään.</p>
          <p class="hide-pwa-prompt">Tietokoneella parhaan kokemuksen saat <span id="pwa-install-prompt" hidden><a href="#" onClick={() => (window as any).installPWA()}>asentamalla sen PWA-sovelluksena</a> tai </span><a href="/app">iframe-tilassa</a>.</p>
        </div>
        {answers.map(([expression, answer], index) => <div class="history-line" key={`line-${index}`}>
          <p class="expression">{expression}</p>
          <p class="answer" onClick={(event) => {
            if (event.detail !== 2) return;
            if (!inputRef.current) return;
            event.preventDefault();
            inputRef.current.value += answer.toDecimalPlaces(8).toString().replace('.', ',');
            inputRef.current.focus();
          }}>
            <span class="equals">= </span>
            {answer.toDecimalPlaces(8).toString().replace('.', ',')}
          </p>
        </div>)}
      </div>
      <div class="input">
        {extraInfo && <div class="extra-info">
          <p dangerouslySetInnerHTML={{ __html: extraInfo }} />
        </div>}
        <input
          ref={inputRef}
          name="math-line"
          onKeyUp={handleKeyDown}
          onPaste={pasteLatex}
          autoFocus
          spellcheck={false}
          autocomplete="off"
        />
      </div>
    </>
  )
}
