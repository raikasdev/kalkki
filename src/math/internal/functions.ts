import Decimal from "decimal.js";
import { ok, type Result } from "neverthrow";
import type { EvalErrorId } from "./evaluator";

/**
 * Calculates the factorial of a non-negative integer.
 * Returns an error if the input is negative or not an integer.
 */
export function factorial(n: Decimal): Result<Decimal, EvalErrorId> {
	if (n.isNegative()) return ok(new Decimal(NaN));
	if (!n.isInteger()) return ok(new Decimal(NaN));

	let result = new Decimal(1);
	let current = new Decimal(1);

	while (current.lte(n)) {
		result = result.mul(current);
		current = current.add(1);
	}

	return ok(result);
}

/**
 * Speedcrunch syntax, base first
 * @param base Log base
 * @param x Value to log
 */
function log(base: Decimal, x: Decimal | undefined = undefined): Decimal {
	if (!x) return new Decimal(NaN);
	return x.log(base);
}

function lg(x: Decimal) {
	return log(new Decimal(10), x);
}

export const functions = {
	log,
	lg,
} as const;