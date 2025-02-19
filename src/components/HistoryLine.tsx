import Decimal from "decimal.js";
import { CircleAlert } from "lucide-react";
import { RefObject } from "preact";

export type HistoryLineData = {
  expression: string;
  answer: Decimal;
  latex: boolean;
}

export default function HistoryLine({ expression, answer, latex, inputRef }: HistoryLineData & { inputRef?: RefObject<HTMLInputElement>; }) {
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
        inputRef.current.value += answer.toDecimalPlaces(8).toString().replace('.', ',');
        inputRef.current.focus();
      }}>
        <span class="equals">= </span>
        {answer.toDecimalPlaces(8).toString().replace('.', ',')}
      </p>
    </div>
  )
}