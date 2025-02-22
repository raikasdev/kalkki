import { RefObject } from "preact";
import { useCallback, useEffect } from "preact/hooks";
import type { AppState } from '../app';
import { calculateAsync } from "../math";
import prettify from "../math/prettify";
import { getOpenFunction, MathError, parseError } from "../util";
import { getDocumentation } from "../functions";
import { latexToMath } from "../math/latex-to-math";
import { Options } from "./TopBar";

export default function MathInput({
  state: { answer, answers, extraInfo, ind, latex, history, workHistory, historyIndex },
  setState,
  inputRef,
  options
}: {
  state: AppState;
  setState: (val: Partial<AppState>) => void;
  inputRef: RefObject<HTMLInputElement>;
  options: Options;
}) {
  useEffect(() => {
    // Focus on any keyboard activity
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't capture if user is typing in another input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      // Don't capture if trying to do control something
      if (e.key === 'Control' || e.key === 'Alt') return;
      if (e.ctrlKey || e.altKey) return;

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

  const processInput = useCallback(async (event: KeyboardEvent) => {
    if (!inputRef.current) return;
    const input = inputRef.current.value;

    if (event.key === 'Enter') {
      event.preventDefault();

      inputRef.current.disabled = true;
      const res = await calculateAsync(input, answer, ind, options.degreeUnit);
      inputRef.current.disabled = false;
      inputRef.current.focus();

      if (res.isErr()) {
        return;
      }

      const { value } = res;
      setState({
        answer: value,
        extraInfo: '',
        answers: [{
          expression: prettify(input),
          answer: value,
          latex,
        }, ...answers],
        latex: false,
        history: [input, ...history],
        workHistory: [input, ...history],
        historyIndex: -1,
      });
      inputRef.current.value = "";
    } else if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      if (input === '') {
        setState({
          extraInfo: null,
        });
        return;
      }

      const openFunction = getOpenFunction(input);
      if (openFunction !== null) {
        const doc = getDocumentation(openFunction);
        if (doc) {
          setState({
            extraInfo: doc.usage,
          });
          return;
        }
      }
      const res = await calculateAsync(input, answer, ind, options.degreeUnit);
      if (res.isErr()) {
        setState({
          extraInfo: parseError(res.error as unknown as MathError),
        });
      } else {
        setState({
          extraInfo: res.value.toSignificantDigits(options.resultAccuracy).toString().replace('.', ','),
        })
      }
    }
  }, [inputRef, answer, ind, latex, options]);

  const processKeyDown = useCallback((event: KeyboardEvent) => {
    if (!inputRef.current) return;
    if (event.key === 'ArrowUp') {
      /**
       * The history quickly (works like bash etc):
       * You can use up down arrow to go to old entries
       * You can edit them, go to other old ones, and the changes stay (workHistory)
       * But only the line you edit and submit will be persist so all other changes disappear (history)
       */
      event.preventDefault();
      if (historyIndex === -1) {
        workHistory = Array.from(new Set([inputRef.current.value, ...history])); // Use a set to remove duplicates
        historyIndex = 0;
      } else {
        workHistory[historyIndex] = inputRef.current.value;
      }

      const index = historyIndex + 1;
      if (index >= workHistory.length) return;
      inputRef.current.value = workHistory[index];
      setState({
        historyIndex: index,
        workHistory,
      });
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      let index = historyIndex - 1;
      if (index < 0) return;
      workHistory[historyIndex] = inputRef.current.value;
      inputRef.current.value = workHistory[index];

      setState({
        historyIndex: index,
        workHistory,
      });
    }
  }, [historyIndex, history, inputRef])

  const pasteLatex = useCallback((event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    // Get the pasted content
    const pastedContent = event.clipboardData.getData('text');

    // Get the target input element
    const input = event.target as HTMLInputElement;

    // Check if paste replaces entire content or input is empty
    if (!input.value || input.selectionStart === 0 && input.selectionEnd === input.value.length) {
      // Check if pasted content contains backslashes
      if (pastedContent.includes('\\')) {
        // Process entire string through latexToMath
        if (inputRef.current) inputRef.current.value = latexToMath(pastedContent);

        // Prevent default paste behavior
        event.preventDefault();

        setState({
          latex: true,
        })
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
    <div class="input">
      {extraInfo && <div class="extra-info">
        <p dangerouslySetInnerHTML={{ __html: extraInfo }} />
      </div>}
      <input
        ref={inputRef}
        name="math-line"
        onKeyUp={processInput}
        onKeyDown={processKeyDown}
        onPaste={pasteLatex}
        autoFocus
        spellcheck={false}
        autocomplete="off"
      />
    </div>
  )
}