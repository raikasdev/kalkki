import { P, match } from "ts-pattern";
import { type Token, tokenise } from ".";

/**
 * Takes in an unformatted expression (e.g. `1+2*(cos(2)/sqrt(pi))`) and gives out a "prettified"
 * but equivalent expression (`1 + 2 × (cos(2) / √(π))`).
 *
 * Returns `undefined` if the input expression cannot be tokenised.
 */
export default function prettify(expression: string | Token[]) {
	let tokens: Token[];
	if (typeof expression === "string") {
		const result = tokenise(expression);
		if (result.isErr()) return expression;

		tokens = result.value;
	} else {
		tokens = expression;
	}

	const pretty = Array.from(prettiedCharacters(tokens));

	return pretty.join("");
}

/**
 * Takes in an array of tokens and returns a generator of strings where each string is
 * either a space or a prettified (e.g. `"√"` instead of `"sqrt"`) version of an input token.
 *
 * The strings will be output in the same relative order as they appear in the input token array,
 * meaning that the concatted output of the generator will be an expression that's strictly equivalent
 * to the input token array.
 */
function* prettiedCharacters(tokens: Token[]) {
	const { any, not, union } = P;

	for (let i = 0; i < tokens.length; i++) {
		const lhs = tokens[i - 1] ?? null;
		const cur = tokens[i];
		const rhs = tokens[i + 1] ?? null;

		const formattedToken = match(cur)
			.with({ type: "litr" }, (token) =>
				token.value.toString().replace(".", ","),
			)
			.with({ type: "lbrk" }, () => "(")
			.with({ type: "rbrk" }, () => ")")
			.with({ type: "nextparam" }, () => ";")
			.with({ type: "var", name: "ans" }, () => "ANS")
			.with({ type: "var", name: "pi" }, () => "π")
			.with({ type: "var", name: "e" }, () => "e")
			.with({ type: "var", name: any }, (token) => token.name)
			.with({ type: "oper", name: "*" }, () => "×")
			.with({ type: "oper", name: "-" }, () => "−")
			.with({ type: "oper", name: any }, (token) => token.name)
			.with({ type: "func", name: any }, (token) =>
				match(token.name)
					.with("asin", () => "arcsin")
					.with("acos", () => "arccos")
					.with("atan", () => "arctan")
					.with("asinh", () => "arsinh" as const)
					.with("acosh", () => "arcosh" as const)
					.with("atanh", () => "artanh" as const)
					.otherwise(() => token.name),
			)
			.otherwise((token) => token);

		yield formattedToken;

		// Decide whether we want a space between the *current* and *left-hand-side* tokens:
		const shouldHaveSpace =
			(lhs || rhs) &&
			match([lhs, cur, rhs])
				.with(
					// No spaces at bracket inside boundaries: "(1 + 1)"
					[any, { type: "lbrk" }, not(null)],
					[any, any, { type: "rbrk" }],
					// No space between function name and opening brakcet: "sin(…"
					[any, { type: "func" }, { type: "lbrk" }],
					// No space between rbrk and other "(10)(10)"
					[any, { type: "func" }, { type: "lbrk" }],
					// No space before number + variable (10x, 5x, 2cos(x))
					[any, { type: "litr" }, { type: union("var", "func", "lbrk") }],
					// No space between factorial: "5!"
					[any, any, { type: "oper", name: "!" }],
					// No space before semicolon: "sin(x; y)"
					[any, any, { type: "nextparam" }],
					// Negative numbers: e.g. "-5" and "-5 + 5" instead of "- 5" and "- 5 + 5"
					[
						not({ type: union("litr", "var", "rbrk") }),
						{ type: "oper", name: "-" },
						any,
					],
					() => false,
				)
				.with([any, any, P.nullish], () => false)
				.otherwise(() => true);

		// (10)(10) => (10) × (10)
		if (
			cur?.type === "rbrk" &&
			rhs &&
			rhs.type !== "oper" &&
			rhs.type !== "rbrk"
		)
			yield " × ";

		// 2cos(x) => 2 × cos(x)
		if (cur?.type === "litr" && rhs && rhs.type === "func") yield " × ";

		if (shouldHaveSpace) yield " ";
	}
}
