import Decimal from "decimal.js";

/**
 * Calculates the factorial of a non-negative integer.
 * Returns an error if the input is negative or not an integer.
 */
export function factorial(n: Decimal): Decimal {
	if (n.isNegative()) return new Decimal(NaN);
	if (!n.isInteger()) return new Decimal(NaN);

	let result = new Decimal(1);
	let current = new Decimal(1);

	while (current.lte(n)) {
		result = result.mul(current);
		current = current.add(1);
	}

	return result;
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

function ncr(n: Decimal, r: Decimal | undefined = undefined) {
	if (!r) return new Decimal(NaN);
	if (r.gt(n)) return new Decimal(0);
	return factorial(n).div(factorial(r).times(factorial(n.sub(r))));
}

function npr(n: Decimal, r: Decimal | undefined = undefined) {
	if (!r) return new Decimal(NaN);
	if (r.gt(n)) return new Decimal(0);
	return factorial(n).div(factorial(n.sub(r)));
}

function average(...nums: Decimal[]) {
	if (nums.length === 0) return new Decimal(0);
	if (nums.length === 1) return nums[0];
	const total = nums.reduce((a, b) => a.add(b), new Decimal(0));
	return total.div(nums.length);
}

export const functions = {
	log,
	lg,
	ncr,
	npr,
	average,
} as const;
