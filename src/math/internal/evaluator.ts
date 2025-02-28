import { LargeNumber, LargeNumberOperation } from "@/math/internal/large-number";
import { err, ok, Ok, Result } from "neverthrow";
import { isMatching, match, P, Pattern } from "ts-pattern";

import { AngleUnit } from "..";
import { Token } from "./tokeniser";
import { factorial, functions } from "./functions";

export type EvalResult = Result<LargeNumber, EvalErrorId>;
export type EvalErrorId =
	| "UNEXPECTED_EOF"
	| "UNEXPECTED_TOKEN"
	| "UNKNOWN_NAME"
	| "INVALID_ARG_COUNT"
	| "NOT_A_NUMBER"
	| "INFINITY"
	| "NO_LHS_BRACKET"
	| "NO_RHS_BRACKET"
	| "TRIG_PRECISION"
	| "PRECISION_OVERFLOW"
	| "TIMEOUT";

/**
 * A function defined by the user
 */
type UserFunction = {
	type: 'function';
	name: string;
	parameters: string[];
	value: string;
}

/**
 * A variable defined by the user
 */
type UserVariable = {
	type: 'variable';
	name: string;
	value: LargeNumber;
}

type UserObject = UserVariable | UserFunction;

/**
 * Parses and evaluates a mathematical expression as a list of `Token`s into a `LargeNumber` value.
 *
 * The returned `Result` is either
 * - The value of the given expression as a `LargeNumber` object, or
 * - A string representing a syntax error in the input
 *
 */
export default function evaluate(tokens: Token[], userSpace: UserObject[], angleUnit: AngleUnit): EvalResult {
	// This function is an otherwise stock-standard Pratt parser but instead
	// of building a full AST as the `left` value, we instead eagerly evaluate
	// the sub-expressions in the `led` parselets.
	//
	// If the above is gibberish to you, it's recommended to read up on Pratt parsing before
	// attempting to change this algorithm. Good explainers are e.g. (WayBackMachine archived):
	// - https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/ (https://u.ri.fi/1n)
	// - https://martin.janiczek.cz/2023/07/03/demystifying-pratt-parsers.html (https://u.ri.fi/1o)
	// - https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html (https://u.ri.fi/1p)
	// - https://abarker.github.io/typped/pratt_parsing_intro.html (https://u.ri.fi/1q)

	let idx = -1; // Incremented by the first `next()` call into the valid index zero

	/** Consumes the next token from the input and returns it */
	function next() {
		return tokens[++idx];
	}

	/** Peeks at the next unconsumed token in the input */
	function peek() {
		return tokens[idx + 1];
	}

	/**
	 * Accepts a `Pattern` for a token and returns it as a `Result`.
	 * - The result is `Ok` with the next token wrapped if the next token matches the pattern.
	 * - The result is `Err` if the next token does not match the pattern.
	 *
	 * Can either just peek at the next token or consume it, based on the value of the second argument.
	 */
	function expect(pattern: Pattern.Pattern<Token>, consumeNext: boolean): Result<Token, EvalErrorId> {
		const token = consumeNext ? next() : peek();

		if (!token) {
			return err("UNEXPECTED_EOF");
		}
		if (!isMatching(pattern, token)) return err("UNEXPECTED_TOKEN");

		return ok(token);
	}

	/**
	 * Parses function parameters
	 */
	function parseFunction() {
		// First check if we have an opening bracket
		if (expect({ type: "lbrk" }, true).isErr()) return err("UNEXPECTED_TOKEN" as const);

		// Parse arguments until we hit the closing bracket
		const args: LargeNumber[] = [];

		while (true) {
			const result = evalExpr(0);
			if (result.isErr()) return result;
			args.push(result.value);

			const nextToken = peek();
			if (!nextToken) return err("UNEXPECTED_EOF" as const);
			
			if (nextToken.type === "rbrk") {
				// Consume the closing bracket and break
				next();
				break;
			} else if (nextToken.type === "nextparam") {
				// Consume the semicolon and continue to next parameter
				next();
				continue;
			} else {
				return err("UNEXPECTED_TOKEN" as const);
			}
		}

		return ok(args);
	}

	/**
	 * The null denotation of a token.
	 * Also known as the "prefix" or "head" handler.
	 *
	 * Returns the value of a sub-expression without a preceding (i.e. left) expression (i.e. value).
	 */
	function nud(token: Token | undefined): EvalResult {
		return match(token)
			.with(undefined, () => err("UNEXPECTED_EOF" as const))
			.with({ type: "litr" }, token => {
				// Unless the next token is a operator, treat as next times val (5cos(5)=5*cos(5), 5pi=5*pi)
				const nextToken = peek();
				if (nextToken.type === 'oper') {
					return ok(token.value);
				}

				return evalExpr(3).map(right => right.mul(token.value).run());
			})
			.with({ type: "var", name: "pi" }, () => ok(LargeNumber.PI as LargeNumber))
			.with({ type: "var", name: "e" }, () => ok(LargeNumber.E as LargeNumber))
			.with({ type: "oper", name: "-" }, () => evalExpr(3).map(right => right.neg().run()))
			.with({ type: "lbrk" }, () =>
				evalExpr(0).andThen(value =>
					expect({ type: "rbrk" }, true)
						.map(() => value)
						.mapErr(() => "NO_RHS_BRACKET" as const)
				)
			)
			.with({ type: "func", name: P.union("lg", "degrees", "radians")}, token => {
				// Custom methods with one argument
				const funcName = token.name;
				const func = functions[funcName];

				const res = parseFunction();
				if (res.isErr()) return err(res.error);
				const args = res.value;

				return match([args.length])
					.with([1], () => ok(func(args[0])))
					.otherwise(() => err("INVALID_ARG_COUNT" as const));
			})
			.with({ type: "func", name: P.union("log", "ncr", "npr", "nthroot")}, token => {
				// Custom methods with two arguments
				const funcName = token.name;
				const func = functions[funcName];

				const res = parseFunction();
				if (res.isErr()) return err(res.error);
				const args = res.value;

				return match([args.length])
					.with([2], () => ok(func(args[0], args[1])))
					.otherwise(() => err("INVALID_ARG_COUNT" as const));
			})
			.with({ type: "func", name: P.union("average")}, token => {
				// Custom methods with unlimited params
				const funcName = token.name;
				const func = functions[funcName];

				const res = parseFunction();
				if (res.isErr()) return err(res.error);
				const args = res.value;

				return ok(func(...args));
			})
			.with({ type: "func", name: P.union(
				"sqrt", "ln", "sin", "cos", "tan", "asin",
				"acos", "atan", "exp", "floor", "ceil", "acosh",
				"asinh", 'atanh', "gamma", "trunc", "erf",
				"erfc", "csc", "cot", "cbrt",
			) }, token => {
				// LargeNumber methods
				const funcName = token.name;

				const res = parseFunction();
				if (res.isErr()) return err(res.error);
				const args = res.value;

				const { union, any } = P;
				const argument = args[0]; // These only have one argument
				const func = argument[funcName].bind(argument);

				return match([angleUnit, funcName, args.length])
					.with(["deg", union("sin", "cos"), 1], () => {
						const radians = degToRad(argument);

						return ok(radians[funcName].bind(radians)().run())
					})
					.with(["deg", union("asin", "acos", "atan"), 1], () => ok(radToDeg(func()).run()))
					.with([any, "tan", 1], () => {
						const argInRads = angleUnit === "deg" ? degToRad(argument).run() : argument;

						// Tangent is undefined when the tangent line is parallel to the x-axis,
						// since parallel lines, by definition, don't cross.
						// The tangent is parallel when the argument is $ pi/2 + n × pi $ where
						// $ n $ is an integer. Since we use an approximation for pi, we can only
						// check if the argument is "close enough" to being an integer.
						const coefficient = argInRads.sub(LargeNumber.PI.div(new LargeNumber(2))).div(LargeNumber.PI);
						const distFromCriticalPoint = coefficient.sub(coefficient.round()).abs().run();
						const isArgCritical = distFromCriticalPoint.lt(LargeNumber.TAN_PRECISION as LargeNumber);

						if (isArgCritical) return err("TRIG_PRECISION" as const);

						return ok(argInRads.tan().run());
					})
					.with([any, any, 1], () => ok(func().run()))
					.otherwise(() => err("INVALID_ARG_COUNT" as const));
			})
			.otherwise(() => err("UNEXPECTED_TOKEN"));
	}

	/**
	 * The left denotation of a token.
	 * Also known as the "infix" or "tail" handler.
	 *
	 * Returns the value of a sub-expression with a preceding (i.e. left) expression (i.e. value).
	 */
	function led(token: Token | undefined, left: Ok<LargeNumber, EvalErrorId>): EvalResult {
		return (
			match(token)
				.with(undefined, () => err("UNEXPECTED_EOF" as const))
				.with({ type: "oper", name: "+" }, () => evalExpr(2).map(right => left.value.add(right).run()))
				.with({ type: "oper", name: "-" }, () => evalExpr(2).map(right => left.value.sub(right).run()))
				.with({ type: "oper", name: "*" }, () => evalExpr(3).map(right => left.value.mul(right).run()))
				.with({ type: "oper", name: "/" }, () => evalExpr(3).map(right => left.value.div(right).run()))
				.with({ type: "oper", name: "^" }, () => evalExpr(3).map(right => left.value.pow(right).run()))
				.with({ type: "oper", name: "!" }, () => ok(factorial(left.value)))
				// Variables and constants should be treated as multiplication of them
				//.with({ type: "var" }, () => ok(left.value.mul(evalExpr(1)).run())))
				// Right bracket should never get parsed by anything else than the left bracket parselet
				.with({ type: "rbrk" }, () => err("NO_LHS_BRACKET" as const))
				.otherwise(() => {
					return err("UNEXPECTED_TOKEN")
				})
		);
	}

	function evalExpr(rbp: number): EvalResult {
		let left = nud(next());

		while (left.isOk() && peek() && lbp(peek()!) > rbp) {
			left = led(next(), left);
		}

		return left;
	}

	const result = evalExpr(0);

	// After the root eval call there shouldn't be anything to peek at
	if (peek()) {
		return err("UNEXPECTED_TOKEN");
	} else if (result.isErr()) {
		return result;
	} else if (result.value.isNaN()) {
		return err("NOT_A_NUMBER");
	} else if (!result.value.isFinite()) {
		return err("INFINITY");
	} else {
		return result;
	}
}

/** Returns the Left Binding Power of the given token */
function lbp(token: Token) {
	return match(token)
		.with({ type: P.union("lbrk", "rbrk", "nextparam") }, () => 0)
		.with({ type: P.union("litr", "var") }, () => 1)
		.with({ type: "oper", name: P.union("+", "-") }, () => 2)
		.with({ type: "oper", name: P.union("*", "/") }, () => 3)
		.with({ type: "oper", name: "^" }, () => 4)
		.with({ type: "oper", name: "!" }, () => 5)
		.with({ type: "func" }, () => 6)
		.exhaustive();
}

/** Converts the argument from degrees to radians */
function degToRad(deg: LargeNumber | LargeNumberOperation) {
	return deg.div(LargeNumber.RAD_DEG_RATIO);
}

/** Converts the argument from radians to degrees */
function radToDeg(rad: LargeNumber | LargeNumberOperation) {
	return rad.mul(LargeNumber.RAD_DEG_RATIO);
}
