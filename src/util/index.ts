import { type Language, translate } from "@/lang";
import { LargeNumber } from "@/math/internal/large-number";
import type { EvaluationError, UserObject } from "../math/internal/evaluator";
import type { LexicalError } from "../math/internal/tokeniser";

export type MathError = EvaluationError | LexicalError;
export function parseError(error: MathError, lang: Language) {
	if (error.type === "UNKNOWN_TOKEN") {
		// LexicalError
		return translate("errorUnknownSymbol", lang).replace("%s", `${error.idx}`);
	}

	switch (error.type) {
		case "INFINITY":
			return translate("errorInfinity", lang);
		case "INVALID_ARG_COUNT":
			return translate("errorInvalidArgCount", lang);
		case "NOT_A_NUMBER":
			return translate("errorNaN", lang);
		case "NO_LHS_BRACKET":
			return translate("errorNoLhsBracket", lang);
		case "NO_RHS_BRACKET":
			return translate("errorNoRhsBracket", lang);
		case "TRIG_PRECISION":
			return translate("errorTrigPrecision", lang);
		case "UNEXPECTED_EOF":
			return translate("errorUnexpectedEOF", lang);
		case "UNEXPECTED_TOKEN":
			return translate("errorUnexpectedToken", lang);
		case "PRECISION_OVERFLOW":
			return translate("errorPrecisionOverflow", lang);
		case "RECURSION":
			return translate("errorRecursion", lang);
		case "TIMEOUT":
			return translate("errorTimeout", lang);
		case "UNKNOWN_NAME":
			return translate("errorUnknownName", lang).replace("%s", error.name);
		case "RESERVED_NAME":
			return translate("errorReservedName", lang).replace("%s", error.name);
	}

	console.error("Unhandled error!", error);
	return translate("errorUnknown", lang);
}

/**
 * Tries to get the function user is currently typing
 * @returns {string | null} Function name or null
 */
export function getOpenFunction(expression: string): string | null {
	if (expression[expression.length - 1] !== "(") return null;

	const funcName = [];
	for (let i = expression.length - 2; i >= 0; i--) {
		const char = expression[i];
		if (!/[a-z]/.test(char)) {
			break;
		}

		funcName.push(char);
	}

	return funcName.length === 0 ? null : funcName.reverse().join("");
}

export function serializeUserspace(userSpace: Map<string, UserObject>) {
	const obj: Record<string, unknown> = {};

	for (const [name, value] of userSpace.entries()) {
		if (value.type === "variable") {
			obj[name] = {
				...value,
				value: value.value.toString(),
			};
		} else {
			obj[name] = {
				...value,
				value: value.value.map((i) => {
					return i.type === "litr"
						? {
								...i,
								value: i.value.toString(),
							}
						: i;
				}),
			};
		}
	}

	return obj;
}

export function deserializeUserspace(
	// biome-ignore lint/suspicious/noExplicitAny: JSON
	userSpace: Record<string, any>,
): Map<string, UserObject> {
	const obj: Map<string, UserObject> = new Map();

	for (const [name, value] of Object.entries(userSpace)) {
		if (value.type === "variable") {
			obj.set(name, {
				...value,
				value: new LargeNumber(value.value),
			});
		} else {
			obj.set(name, {
				...value,
				// biome-ignore lint/suspicious/noExplicitAny: JSON
				value: value.value.map((i: any) => {
					return i.type === "litr"
						? {
								...i,
								value: new LargeNumber(i.value),
							}
						: i;
				}),
			});
		}
	}

	return obj;
}
