import { LargeNumber } from "@/math/internal/large-number";
import { CircleAlert } from "lucide-react";
import { RefObject } from "preact";

export type HistoryLineData = {
  expression: string;
  answer: LargeNumber;
  latex: boolean;
}

export default function HistoryLine({ expression, answer, latex, inputRef, accuracy }: HistoryLineData & { inputRef?: RefObject<HTMLInputElement>; accuracy: number; }) {
  return (
    <div class="history-line">
      {latex && (<p class="latex-warning"><CircleAlert size={18} /> Luotu LaTeXin pohjalta, voi sisältää virheitä</p>)}
      <p class="expression">
        {expression}
      </p>
      <p class="answer" onClick={(event) => {
        if (event.detail !== 2) return;
        if (!inputRef?.current) return;
        event.preventDefault();
        inputRef.current.value += answer.toSignificantDigits(accuracy).toString().replace('.', ',');
        inputRef.current.focus();
      }}>
        <span class="equals">= </span>
        {answer.toSignificantDigits(accuracy).toString().replace('.', ',')}
      </p>
    </div>
  )
}