import type { LexicalError } from "@/math/internal/tokeniser";
import { Result, err, ok } from "neverthrow";

type TokenMatcher = (typeof tokenMatchers)[number];
type TokenId = ReturnType<TokenMatcher[1]>["type"];
type TokenAny = ReturnType<TokenMatcher[1]>;
type Token<T extends TokenId = TokenId> = Extract<TokenAny, { type: T }>;

/**
 * A modified tokeniser for syntax highlighting
 */
const tokenMatchers = [
	[
		/^\s/,
		(str) => ({
			type: "whitespace" as const,
			value: str,
		}),
	],
	[
		// Unsigned numeric literal: "0", "123", "25.6", etc...
		/^((\d+[,.]\d+)|([1-9]\d*)|0)([eE][-+]?\d+)?/,
		(str) => ({
			type: "litr" as const,
			value: str,
		}),
	],
	[
		// Operators: "-", "+", "/", "*", "^" and "="
		// The multiplication and minus signs have unicode variants that also need to be handled
		/^(\*\*|[-=+/*^−×!\\])/,
		(str) => ({
			type: "oper" as const,
			name: str,
		}),
	],
	[
		// Left bracket: "("
		/^\(/,
		(_) => ({ type: "lbrk" as const }),
	],
	[
		// Right bracket: ")"
		/^\)/,
		(_) => ({ type: "rbrk" as const }),
	],
	[
		// Semicolon, parameter separator
		/^;/,
		(_) => ({ type: "nextparam" as const }),
	],
	[
		// Function name: "sin", "log", "√", etc...
		/^([\p{L}_][\p{L}_0-9]*)(?=\()/iu,
		(str) => ({
			type: "func" as const,
			name: str,
		}),
	],
	[
		// Variables, first letter any letter or underscore, other letters can also be numbers
		// Any unresolved string
		/^([\p{L}_][\p{L}_0-9]*)/iu,
		(str) => ({
			type: "var" as const,
			name: str,
		}),
	],
	[
		/^.*/,
		(str) => ({
			type: "unknown" as const,
			name: str,
		}),
	],
] satisfies [RegExp, (str: string) => { type: string }][];

/**
 * Reads an input expression and returns a `Result<Token[], LexicalError>` where
 * - `Token[]` is the tokenised expression, or
 * - `LexicalError.idx` is the starting index of the *first lexical error* (i.e. unrecognised word) in the input expression.
 *
 * @see {@link Token}
 * @example
 * ```typescript
 * tokenise("1 + 2") // => Ok([{ type: "litr", value: Decimal(1) }, { type: "oper", name: "+" }, ...])
 * tokenise("1 ö 2") // => Err({ type: "UNKNOWN_TOKEN", idx: 2 }) // 2 === "1 ö 2".indexOf("ö")
 * ```
 */
function tokenise(expression: string): Result<Token[], LexicalError> {
	return Result.combine([...tokens(expression)]);
}

/**
 * Reads an input expression and returns a `Generator` of `Result<Token, number>` where
 * - `Token` is a token object as built by one of the matchers in {@link tokenMatchers}, or
 * - `number` is the index (of the passed in string) where none of the matchers could be applied,
 *   meaning that there is a lexical error at that point in the input.
 *
 * The generator stops on the first lexical error.
 * I.e. if an error is encountered, it will be the last value output by the generator.
 *
 * @see {@link tokenise}
 * @see {@link Token}
 */
function* tokens(
	expression: string,
): Generator<Result<Token, LexicalError>, void, void> {
	const end = expression.length;
	let idx = 0;

	eating: while (idx < end) {
		const slice = expression.slice(idx, end);

		if (import.meta.env.DEV && slice.startsWith("improbatur")) {
			throw Error(
				"Simulated Error: This is a simulated error for testing purposes.",
			);
		}

		for (const [regex, build] of tokenMatchers) {
			const str = regex.exec(slice)?.[0];

			if (!str) continue;

			const token = build(str);

			idx += str.length;

			yield ok(token);
			continue eating;
		}

		yield err({ type: "UNKNOWN_TOKEN", idx }); // Should be impossible
		return;
	}
}

/**
 * Tokenises expression and returns raw HTML
 * @param expression Math expression
 */
export default function syntaxHighlight(expression: string) {
	const tokens = tokenise(expression);
	if (tokens.isErr()) return expression.replaceAll(" ", "&nbsp;"); // Tokenisation errors should be rare

	return tokens.value.map((token, tokenIndex) => {
		let value = "\u00A0"; // &nbsp;
		switch (token.type) {
			case "litr":
				value = token.value;
				break;
			case "var":
			case "func":
			case "oper":
			case "unknown":
				value = token.name;
				break;
			case "nextparam":
				value = ";";
				break;
			case "lbrk":
				value = "(";
				break;
			case "rbrk":
				value = ")";
				break;
		}
		return (
			<span
				className={`symbol-${token.type}`}
				key={`${token.type}-${tokenIndex}`}
			>
				{value}
			</span>
		);
	});
}
