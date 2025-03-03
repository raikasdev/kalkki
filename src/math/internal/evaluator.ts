import {
	LargeNumber,
	type LargeNumberOperation,
} from "@/math/internal/large-number";
import { type Ok, type Result, err, ok } from "neverthrow";
import { P, type Pattern, isMatching, match } from "ts-pattern";

import type { AngleUnit } from "..";
import { factorial, functions } from "./functions";
import type { Token } from "./tokeniser";

export type EvalResult = Result<LargeNumber, EvaluationError>;
export type EvalValue = {
	value?: LargeNumber;
	userSpace?: Map<string, UserObject>;
};
export type EvaluationError =
	| {
			type:
				| "UNEXPECTED_EOF"
				| "UNEXPECTED_TOKEN"
				| "INVALID_ARG_COUNT"
				| "NOT_A_NUMBER"
				| "INFINITY"
				| "NO_LHS_BRACKET"
				| "NO_RHS_BRACKET"
				| "TRIG_PRECISION"
				| "PRECISION_OVERFLOW"
				| "RECURSION"
				| "TOKENISER_ERROR";
	  }
	| {
			type: "UNKNOWN_NAME" | "RESERVED_NAME";
			name: string;
	  }
	| {
			type: "TIMEOUT";
			expression: string;
	  };

/**
 * A function defined by the user
 */
export type UserFunction = {
	type: "function";
	parameters: string[];
	value: Token[];
};

/**
 * A variable defined by the user
 */
export type UserVariable = {
	type: "variable";
	value: LargeNumber;
};

export type UserObject = UserVariable | UserFunction;

const RESERVED_VARIABLES = [
	"pi",
	"e",
	"ans",
	"sqrt",
	"ln",
	"sin",
	"cos",
	"tan",
	"asin",
	"acos",
	"atan",
	"exp",
	"floor",
	"ceil",
	"acosh",
	"asinh",
	"atanh",
	"gamma",
	"trunc",
	"erf",
	"erfc",
	"csc",
	"cot",
	"cbrt",
	"average",
	"log",
	"ncr",
	"npr",
	"nthroot",
	"arccos",
	"arctan",
	"arcos",
	"lg",
	"degrees",
	"radians",
	"arsinh",
	"arcosh",
	"artanh",
	"log10",
	"√",
	"π",
	"ℇ",
	"𝑒",
	"ℯ",
];
const SYNTAX_ERRORS = [
	"UNEXPECTED_EOF",
	"UNEXPECTED_TOKEN",
	"NO_LHS_BRACKET",
	"NO_RHS_BRACKET",
];

/**
 * Parses and evaluates a mathematical expression as a list of `Token`s into a `LargeNumber` value.
 *
 * The returned `Result` is either
 * - The value of the given expression as a `LargeNumber` object, or
 * - A string representing a syntax error in the input
 *
 */
export default function evaluate(
	tokens: Token[],
	ans: LargeNumber,
	userSpace: Map<string, UserObject>,
	angleUnit: AngleUnit,
): Result<EvalValue, EvaluationError> {
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
	function expect(
		pattern: Pattern.Pattern<Token>,
		consumeNext: boolean,
	): Result<Token, EvaluationError> {
		const token = consumeNext ? next() : peek();

		if (!token) {
			return err({ type: "UNEXPECTED_EOF" });
		}
		if (!isMatching(pattern, token)) return err({ type: "UNEXPECTED_TOKEN" });

		return ok(token);
	}

	/**
	 * Parses function parameters
	 */
	function parseFunction() {
		// First check if we have an opening bracket
		if (expect({ type: "lbrk" }, true).isErr())
			return err({ type: "UNEXPECTED_TOKEN" } as const);

		const firstToken = peek();
		if (!firstToken) return err({ type: "UNEXPECTED_EOF" } as const);
		if (firstToken.type === 'rbrk') {
			next();
			return ok([]); // No args
		}

		// Parse arguments until we hit the closing bracket
		const args: LargeNumber[] = [];
		while (true) {
			const result = evalExpr(0);
			if (result.isErr()) return result;
			args.push(result.value);

			const nextToken = peek();
			if (!nextToken) return err({ type: "UNEXPECTED_EOF" } as const);

			if (nextToken.type === "rbrk") {
				// Consume the closing bracket and break
				next();
				break;
			}

			if (nextToken.type === "nextparam") {
				// Consume the semicolon and continue to next parameter
				next();
				continue;
			}

			return err({ type: "UNEXPECTED_TOKEN" } as const);
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
			.with(undefined, () => err({ type: "UNEXPECTED_EOF" } as const))
			.with({ type: "litr" }, (token) => {
				// Unless the next token is a operator, treat as next times val (5cos(5)=5*cos(5), 5pi=5*pi)
				const nextToken = peek();
				if (nextToken && ["func", "var", "lbrk"].includes(nextToken.type)) {
					return evalExpr(3).map((right) => right.mul(token.value).run());
				}

				return ok(token.value);
			})
			.with({ type: "var", name: "pi" }, () =>
				ok(LargeNumber.PI as LargeNumber),
			)
			.with({ type: "var", name: "e" }, () => ok(LargeNumber.E as LargeNumber))
			.with({ type: "var", name: "ans" }, () => ok(ans))
			.with({ type: "var", name: P.any }, ({ name }) => {
				const variable = userSpace.get(name) as UserVariable | undefined;
				if (!variable || variable.type !== "variable")
					return err({ type: "UNKNOWN_NAME", name } as const);
				return ok(variable.value);
			})
			.with({ type: "oper", name: "-" }, () =>
				evalExpr(3).map((right) => right.neg().run()),
			)
			.with({ type: "lbrk" }, () =>
				evalExpr(0).andThen((value) =>
					expect({ type: "rbrk" }, true)
						.mapErr(() => ({ type: "NO_RHS_BRACKET" }) as const)
						.andThen(() => {
							// (5)(5) => 25
							const nextToken = peek();
							if (
								nextToken &&
								["func", "var", "lbrk", "litr"].includes(nextToken.type)
							) {
								return evalExpr(3).map((right) => right.mul(value).run());
							}

							return ok(value);
						}),
				),
			)
			.with(
				{ type: "func", name: P.union("lg", "degrees", "radians") },
				(token) => {
					// Custom methods with one argument
					const funcName = token.name;
					const func = functions[funcName];

					const res = parseFunction();
					if (res.isErr()) return err(res.error);
					const args = res.value;

					return match([args.length])
						.with([1], () => ok(func(args[0])))
						.otherwise(() => err({ type: "INVALID_ARG_COUNT" } as const));
				},
			)
			.with(
				{ type: "func", name: P.union("log", "ncr", "npr", "nthroot") },
				(token) => {
					// Custom methods with two arguments
					const funcName = token.name;
					const func = functions[funcName];

					const res = parseFunction();
					if (res.isErr()) return err(res.error);
					const args = res.value;

					return match([args.length])
						.with([2], () => ok(func(args[0], args[1])))
						.otherwise(() => err({ type: "INVALID_ARG_COUNT" } as const));
				},
			)
			.with({ type: "func", name: P.union("average") }, (token) => {
				// Custom methods with unlimited params
				const funcName = token.name;
				const func = functions[funcName];

				const res = parseFunction();
				if (res.isErr()) return err(res.error);
				const args = res.value;

				return ok(func(...args));
			})
			.with(
				{
					type: "func",
					name: P.union(
						"sqrt",
						"ln",
						"sin",
						"cos",
						"tan",
						"asin",
						"acos",
						"atan",
						"exp",
						"floor",
						"ceil",
						"acosh",
						"asinh",
						"atanh",
						"gamma",
						"trunc",
						"erf",
						"erfc",
						"csc",
						"cot",
						"cbrt",
					),
				},
				(token) => {
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

							return ok(radians[funcName].bind(radians)().run());
						})
						.with(["deg", union("asin", "acos", "atan"), 1], () =>
							ok(radToDeg(func()).run()),
						)
						.with([any, "tan", 1], () => {
							const argInRads =
								angleUnit === "deg" ? degToRad(argument).run() : argument;

							// Tangent is undefined when the tangent line is parallel to the x-axis,
							// since parallel lines, by definition, don't cross.
							// The tangent is parallel when the argument is $ pi/2 + n × pi $ where
							// $ n $ is an integer. Since we use an approximation for pi, we can only
							// check if the argument is "close enough" to being an integer.
							const coefficient = argInRads
								.sub(LargeNumber.PI.div(new LargeNumber(2)))
								.div(LargeNumber.PI)
								.run();
							// Must .run() because coefficient is being subtracted from itself
							const distFromCriticalPoint = coefficient
								.sub(coefficient.round())
								.abs()
								.run();
							const isArgCritical = distFromCriticalPoint.lt(
								LargeNumber.TAN_PRECISION as LargeNumber,
							);

							if (isArgCritical)
								return err({ type: "TRIG_PRECISION" } as const);

							return ok(argInRads.tan().run());
						})
						.with([any, any, 1], () => ok(func().run()))
						.otherwise(() => err({ type: "INVALID_ARG_COUNT" } as const));
				},
			)
			.with({ type: "func", name: P.any }, ({ name }) => {
				const userFunc = userSpace.get(name) as UserFunction | undefined;
				if (!userFunc || userFunc.type !== "function")
					return err({ type: "UNKNOWN_NAME", name } as const);
				const res = parseFunction();
				if (res.isErr()) return err(res.error);
				const args = res.value;

				if (args.length !== userFunc.parameters.length)
					return err({ type: "INVALID_ARG_COUNT" } as const);
				const funcUserSpace = new Map(userSpace);
				userFunc.parameters.forEach((key, paramIndex) => {
					funcUserSpace.set(key, { type: "variable", value: args[paramIndex] });
				});

				const evalResult = evaluate(
					userFunc.value,
					ans,
					funcUserSpace,
					angleUnit,
				);
				if (evalResult.isErr()) return err(evalResult.error);
				if (!evalResult.value.value)
					return err({ type: "UNEXPECTED_TOKEN" } as const);
				return ok(evalResult.value.value);
			})
			.otherwise(() => err({ type: "UNEXPECTED_TOKEN" } as const));
	}

	/**
	 * The left denotation of a token.
	 * Also known as the "infix" or "tail" handler.
	 *
	 * Returns the value of a sub-expression with a preceding (i.e. left) expression (i.e. value).
	 */
	function led(
		token: Token | undefined,
		left: Ok<LargeNumber, EvaluationError>,
	): EvalResult {
		return (
			match(token)
				.with(undefined, () => err({ type: "UNEXPECTED_EOF" } as const))
				.with({ type: "oper", name: "+" }, () =>
					evalExpr(2).map((right) => left.value.add(right).run()),
				)
				.with({ type: "oper", name: "-" }, () =>
					evalExpr(2).map((right) => left.value.sub(right).run()),
				)
				.with({ type: "oper", name: "*" }, () =>
					evalExpr(3).map((right) => left.value.mul(right).run()),
				)
				.with({ type: "oper", name: "/" }, () =>
					evalExpr(3).map((right) => left.value.div(right).run()),
				)
				.with({ type: "oper", name: "^" }, () =>
					evalExpr(3).map((right) => left.value.pow(right).run()),
				)
				.with({ type: "oper", name: "!" }, () => ok(factorial(left.value)))
				// Right bracket should never get parsed by anything else than the left bracket parselet
				.with({ type: "rbrk" }, () => err({ type: "NO_LHS_BRACKET" } as const))
				// Neither should equals. Only for variable and function definition
				// which is parsed elsewhere. Kalkki is not a CAS calculator.
				.with({ type: "oper", name: "=" }, () =>
					err({ type: "UNEXPECTED_TOKEN" } as const),
				)
				.otherwise(() => err({ type: "UNEXPECTED_TOKEN" } as const))
		);
	}

	function evalExpr(rbp: number): EvalResult {
		let left = nud(next());

		while (left.isOk() && peek() && lbp(peek()) > rbp) {
			left = led(next(), left);
		}

		return left;
	}

	// Is this an assignation call?
	const assignToken = tokens.findIndex(
		(i) => i.type === "oper" && i.name === "=",
	);
	if (assignToken !== -1) {
		// Seems like it, is it in the right place (after variable of a function definition)
		const variable = tokens.splice(0, assignToken + 1);
		variable.pop(); // Equals sign

		if (variable.length === 1 && variable[0].type === "var") {
			const varName = variable[0].name;
			if (RESERVED_VARIABLES.includes(varName)) {
				return err({ type: "RESERVED_NAME", name: varName });
			}

			// Great! Set variable to eval value of tokens
			const value = evalExpr(0);
			if (value.isErr()) return err(value.error);
			userSpace.set(varName, { type: "variable", value: value.value });

			return ok({ value: value.value, userSpace });
		}

		if (variable.length >= 3 && variable[0].type === "func") {
			// Function + lbrk + rbkr
			const funcName = variable[0].name;
			if (RESERVED_VARIABLES.includes(funcName)) {
				return err({ type: "RESERVED_NAME", name: funcName });
			}

			// Just make sure the brackets are correct and remove them
			if (variable[1].type !== "lbrk")
				return err({ type: "NO_LHS_BRACKET" } as const);
			if (variable[variable.length - 1].type !== "rbrk")
				return err({ type: "NO_RHS_BRACKET" } as const);
			const rawParameters = variable.slice(2, variable.length - 1);
			const parameters: string[] = [];
			// Check all parameters are variable names
			for (let i = 0; i < rawParameters.length; i++) {
				const param = rawParameters[i];
				if (param.type !== "var") return err({ type: "UNEXPECTED_TOKEN" });
				parameters.push(param.name);

				if (i < rawParameters.length - 1) {
					// Next must be "nextparam" or throw error
					const separator = rawParameters[i + 1];
					if (separator.type !== "nextparam")
						return err({ type: "UNEXPECTED_TOKEN" });
					rawParameters.splice(i + 1, 1); // And remove it
				}
			}

			// Evaluate the tokens once with every parameter being 1, if no syntax errors we pass
			const tempUserSpace = new Map(userSpace);
			for (const p of parameters) {
				tempUserSpace.set(p, { type: "variable", value: new LargeNumber(1) });
			}

			const response = evaluate(tokens, ans, tempUserSpace, angleUnit);
			if (response.isErr() && SYNTAX_ERRORS.includes(response.error.type)) {
				return err(response.error);
			}

			userSpace.set(funcName, { type: "function", parameters, value: tokens });

			return ok({ userSpace });
		}

		return err({ type: "UNEXPECTED_TOKEN" });
	}

	const result = evalExpr(0);

	if (result.isErr()) return err(result.error);

	// After the root eval call there shouldn't be anything to peek at
	if (peek()) return err({ type: "UNEXPECTED_TOKEN" } as const);
	if (result.value.isNaN()) return err({ type: "NOT_A_NUMBER" } as const);
	if (!result.value.isFinite()) return err({ type: "INFINITY" } as const);

	return ok({ value: result.value });
}

/** Returns the Left Binding Power of the given token */
function lbp(token: Token) {
	return match(token)
		.with({ type: P.union("lbrk", "rbrk", "nextparam") }, () => 0)
		.with({ type: "oper", name: "=" }, () => 0)
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
