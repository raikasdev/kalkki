import type { LargeNumber } from "@/math/internal/large-number";
import syntaxHighlight from "@/math/syntax-highlighter";
import { CircleAlert } from "lucide-react";
import type { RefObject } from "preact";
import { useCallback } from "preact/hooks";

export type HistoryLineData = {
	expression: string;
	answer?: LargeNumber;
	latex: boolean;
};

export default function HistoryLine({
	expression,
	answer,
	latex,
	inputRef,
	accuracy,
}: HistoryLineData & {
	inputRef?: RefObject<HTMLInputElement>;
	accuracy: number;
}) {
	const copyAnswer = useCallback(() => {
		if (!inputRef?.current) return;
		if (!answer) return;
		inputRef.current.value += answer
			.toSignificantDigits(accuracy)
			.toString()
			.replace(".", ",");
		inputRef.current.dispatchEvent(new Event("input", { bubbles: true })); // Syntax highlight
		inputRef.current.focus();
	}, [inputRef?.current, accuracy, answer]);

	return (
		<div class="history-line">
			{latex && (
				<p class="latex-warning">
					<CircleAlert size={18} /> LaTeX experimental support
				</p>
			)}
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Internal function */}
			<p
				class="expression syntax-highlight"
			>
				{syntaxHighlight(expression)}
			</p>
			{answer ? (
				<p
					class="answer"
					onClick={(event) => {
						if (event.detail !== 2) return;
						event.preventDefault();
						copyAnswer();
					}}
					onKeyPress={() => copyAnswer()}
				>
					<span class="equals">{"="} </span>
					{answer.toSignificantDigits(accuracy).toString().replace(".", ",")}
				</p>
			) : (
				<p class="answer" aria-hidden>
					⠀
				</p>
			)}{" "}
			{/* Space taker */}
		</div>
	);
}
