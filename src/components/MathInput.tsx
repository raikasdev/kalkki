import { RefObject } from "preact";
import { useCallback, useEffect } from "preact/hooks";
import type { AppState } from '../app';
import { calculate } from "../math";
import prettify from "../math/prettify";
import { getOpenFunction, MathError, parseError } from "../util";
import { getDocumentation } from "../functions";
import { latexToMath } from "../math/latex-to-math";
import { Options } from "./TopBar";

export default function MathInput({
  state: { answer, answers, extraInfo, ind, latex },
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

    if (event.key === 'Enter') {
      const res = calculate(input, answer, ind, options.degreeUnit);
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
      });
      inputRef.current.value = "";
    } else {
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

      const res = calculate(input, answer, ind, "deg");
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
        onKeyUp={handleKeyDown}
        onPaste={pasteLatex}
        autoFocus
        spellcheck={false}
        autocomplete="off"
      />
    </div>
  )
}