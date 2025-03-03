import { translate } from "@/lang";
import syntaxHighlight from "@/math/syntax-highlighter";
import type { RefObject } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import type { AppState } from "../App";
import { calculateAsync } from "../math";
import { getDocumentation } from "../math/documentation";
import { latexToMath } from "../math/latex-to-math";
import prettify from "../math/prettify";
import { type MathError, getOpenFunction, parseError } from "../util";
import type { Options } from "./TopBar";

export default function MathInput({
	state: {
		answer,
		answers,
		extraInfo,
		latex,
		history,
		workHistory,
		historyIndex,
		userSpace,
	},
	setState,
	inputRef,
	options,
}: {
	state: AppState;
	setState: (val: Partial<AppState>) => void;
	inputRef: RefObject<HTMLInputElement>;
	options: Options;
}) {
	const [syntax, setSyntax] = useState<ReturnType<typeof syntaxHighlight> | null>(null);

	// Syntax highlighting
	const handleChange = useCallback(() => {
		setSyntax(
			syntaxHighlight(
				inputRef.current?.value ?? "",
			)
		);
	}, [inputRef]);

	useEffect(() => {
		// Focus on any keyboard activity
		const handleKeyPress = (e: KeyboardEvent) => {
			// Don't capture if user is typing in another input
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				return;
			}
			// Don't capture if trying to do control something
			if (e.key === "Control" || e.key === "Alt") return;
			if (e.ctrlKey || e.altKey) return;

			inputRef.current?.focus();
		};

		// Focus on window focus
		const handleFocus = () => {
			inputRef.current?.focus();
		};

		window.addEventListener("keydown", handleKeyPress);
		window.addEventListener("focus", handleFocus);

		return () => {
			window.removeEventListener("keydown", handleKeyPress);
			window.removeEventListener("focus", handleFocus);
		};
	}, [inputRef.current]);

	const processInput = useCallback(
		async (event: KeyboardEvent) => {
			if (!inputRef.current) return;
			const input = inputRef.current.value;

			if (event.key === "Enter") {
				event.preventDefault();

				inputRef.current.disabled = true;
				const res = await calculateAsync(
					input,
					answer,
					userSpace,
					options.angleUnit,
				);
				inputRef.current.disabled = false;
				inputRef.current.focus();

				if (res.isErr()) {
					return;
				}

				const { value } = res;
				setState({
					answer: value.value ?? answer,
					extraInfo: "",
					answers: [
						{
							expression: prettify(input),
							answer: value.value,
							latex,
						},
						...answers,
					],
					latex: false,
					history: [input, ...history],
					workHistory: [input, ...history],
					historyIndex: -1,
					userSpace: value.userSpace ?? userSpace,
				});
				inputRef.current.value = "";
				handleChange();
			} else if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
				if (input === "") {
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
				const res = await calculateAsync(
					input,
					answer,
					userSpace,
					options.angleUnit,
				);
				if (res.isErr()) {
					const error = res.error as unknown as MathError;
					if (
						error.type === "TIMEOUT" &&
						error.expression !== inputRef.current.value
					)
						return;
					setState({
						extraInfo: parseError(error, options.language),
					});
				} else {
					setState({
						extraInfo:
							res.value.value
								?.toSignificantDigits(options.resultAccuracy)
								.toString()
								.replace(".", ",") ?? null,
					});
				}
			}
		},
		[
			inputRef,
			answer,
			userSpace,
			latex,
			options,
			answers,
			history,
			setState,
			handleChange,
		],
	);

	const processKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!inputRef.current) return;
			if (event.key === "ArrowUp") {
				/**
				 * The history quickly (works like bash etc):
				 * You can use up down arrow to go to old entries
				 * You can edit them, go to other old ones, and the changes stay (workHistory)
				 * But only the line you edit and submit will be persist so all other changes disappear (history)
				 */
				event.preventDefault();
				if (historyIndex === -1) {
					workHistory = Array.from(
						new Set([inputRef.current.value, ...history]),
					); // Use a set to remove duplicates
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
				handleChange();
			} else if (event.key === "ArrowDown") {
				event.preventDefault();
				const index = historyIndex - 1;
				if (index < 0) return;
				workHistory[historyIndex] = inputRef.current.value;
				inputRef.current.value = workHistory[index];

				setState({
					historyIndex: index,
					workHistory,
				});
				handleChange();
			}
		},
		[historyIndex, history, inputRef, setState, workHistory, handleChange],
	);

	const pasteLatex = useCallback(
		(event: ClipboardEvent) => {
			if (!event.clipboardData) return;
			// Get the pasted content
			const pastedContent = event.clipboardData.getData("text");

			// Get the target input element
			const input = event.target as HTMLInputElement;

			// Check if paste replaces entire content or input is empty
			if (
				!input.value ||
				(input.selectionStart === 0 &&
					input.selectionEnd === input.value.length)
			) {
				// Check if pasted content contains backslashes
				if (pastedContent.includes("\\")) {
					// Process entire string through latexToMath
					if (inputRef.current)
						inputRef.current.value = latexToMath(pastedContent);

					// Prevent default paste behavior
					event.preventDefault();

					setState({
						latex: true,
					});
					handleChange();
				}
			}
		},
		[inputRef, setState, handleChange],
	);

	// Handle global paste events
	useEffect(() => {
		const handlePaste = (e: ClipboardEvent) => {
			// Don't capture if user is pasting in another input
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				return;
			}
			inputRef.current?.focus();
		};

		window.addEventListener("paste", handlePaste);
		return () => window.removeEventListener("paste", handlePaste);
	}, [inputRef]);

	return (
		<div class="input">
			{extraInfo && (
				<div class="extra-info">
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Localisation */}
					<p dangerouslySetInnerHTML={{ __html: extraInfo }} />
				</div>
			)}
			<p class="syntax-highlight">
				{syntax}
			</p>
			<input
				ref={inputRef}
				name="math-line"
				onKeyUp={processInput}
				onKeyDown={processKeyDown}
				onPaste={pasteLatex}
				onChange={handleChange}
				// biome-ignore lint/a11y/noAutofocus: Application is meant to be used immediately after opening
				autoFocus
				spellcheck={false}
				autocomplete="off"
				aria-label={translate("ariaMathInput", options.language)}
			/>
		</div>
	);
}
