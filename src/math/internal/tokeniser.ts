import { LargeNumber } from "@/math/internal/large-number";
import { Result, err, ok } from "neverthrow";
import { match } from "ts-pattern";
import type { functions } from "./functions";

/**
 * Represents an error where the tokeniser couldn't match the input to any token.
 * The `idx` field points to the start of the unknown part in the input.
 */
export type LexicalError = { type: "UNKNOWN_TOKEN"; idx: number };

/** A tuple of Regex and a token builder function. See {@link tokenMathcers} for details. */
type TokenMatcher = (typeof tokenMatchers)[number];
/** Any of the tokens created by the token builder function in {@link tokenMatchers}. */
type TokenAny = ReturnType<TokenMatcher[1]>;

/**
 * A union of all the possible `Token` `type` values.
 * Automatically computed from `tokenMatchers`.
 * @see {@link tokenMatchers}
 * @see {@link Token}
 */
export type TokenId = ReturnType<TokenMatcher[1]>["type"];

/**
 * A utility type to get the type of a `Token` by type id.
 * @see {@link TokenId} for a comprehensive list of the different token types.
 * @example
 * ```typescript
 * type ConstantToken = Token<"var">
 * //   ConstantToken = { type: "var"; name: "pi" | "e" }
 * type FunctionToken = Token<"func">
 * //   FunctionToken = { type: "func"; name: "sin" | "cos" ... }
 * type LeftBrakToken = Token<"lbrk">
 * //   FunctionToken = { type: "lbrk" }
 * ```
 */
export type Token<T extends TokenId = TokenId> = Extract<TokenAny, { type: T }>;

export type DecimalFunctions = keyof (typeof LargeNumber)["prototype"];
export type Functions = DecimalFunctions | keyof typeof functions;

/**
 * An array of regex & builder function tuples where
 * - The regex detects a token from the input
 * - The builder builds a token object from the slice that the regex detected
 * @see {@link TokenId}
 * @see {@link Token}
 */
const tokenMatchers = [
	// **Notes:**
	// - Each regex should only try to find its token from the beginning of the string.
	// - When adding new types, remember to mark the `type` property `as const` for TypeScript.

	[
		// Unsigned numeric literal: "0", "123", "25.6", etc...
		/^((\d+[,.]\d+)|([1-9]\d*)|0)/,
		(str) => ({
			type: "litr" as const,
			value: new LargeNumber(str.replace(",", ".")),
		}),
	],
	[
		// Operators: "-", "+", "/", "*", "^" and "="
		// The multiplication and minus signs have unicode variants that also need to be handled
		/^[-=+/*^−×!]/,
		(str) => ({
			type: "oper" as const,
			name: match(str)
				.with("-", "+", "/", "*", "^", "!", "=", (op) => op)
				.with("−", () => "-" as const)
				.with("×", () => "*" as const)
				.otherwise((op) => {
					throw Error(`Programmer error: neglected operator "${op}"`);
				}),
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
			name: match(str.toLowerCase())
				.with("log10", () => "log" as const)
				.with("√", () => "sqrt" as const)
				.with("arcsin", () => "asin" as const)
				.with("arccos", () => "acos" as const)
				.with("arctan", () => "atan" as const)
				.with("arsinh", () => "asinh" as const)
				.with("arcosh", () => "acosh" as const)
				.with("artanh", () => "atanh" as const)
				.otherwise((name) => name),
		}),
	],
	[
		// Variables, first letter any letter or underscore, other letters can also be numbers
		// Any unresolved string
		/^([\p{L}_][\p{L}_0-9]*)/iu,
		(str) => ({
			type: "var" as const,
			name: match(str.toLowerCase())
				.with("π", () => "pi" as const)
				.with("ℇ", "𝑒", "ℯ", () => "e" as const)
				.otherwise((name) => name),
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
export default function tokenise(
	expression: string,
): Result<Token[], LexicalError> {
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

		const whitespace = /^\s+/.exec(slice)?.[0];
		if (whitespace) {
			idx += whitespace.length;
			continue;
		}

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

		yield err({ type: "UNKNOWN_TOKEN", idx });
		return;
	}
}
