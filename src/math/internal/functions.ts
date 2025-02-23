import { LargeNumber, LargeNumberOperation } from "@/math/internal/large-number";

/**
 * Calculates the factorial of a non-negative integer.
 * Returns an error if the input is negative or not an integer.
 */
export function factorial(n: LargeNumber): LargeNumber {
	if (n.isNegative()) return new LargeNumber(NaN);
	if (!n.isInteger()) {
		return n.add(new LargeNumber(1)).gamma().run();
	}

	return n.factorial().run();
}

/**
 * Speedcrunch syntax, base first
 * @param base Log base
 * @param x Value to log
 */
function log(base: LargeNumber, x: LargeNumber | undefined = undefined): LargeNumber {
	if (!x) return new LargeNumber(NaN);
	return x.log(base).run();
}

function nthroot(n: LargeNumber, x: LargeNumber | undefined = undefined): LargeNumber {
	if (!x) return new LargeNumber(NaN);
	return x.pow(new LargeNumber(1).div(n)).run();
}

function lg(x: LargeNumber): LargeNumber {
	return log(new LargeNumber(10), x);
}

function ncr(n: LargeNumber, r: LargeNumber | undefined = undefined): LargeNumber {
	if (!r) return new LargeNumber(NaN);
	if (r.gt(n)) return new LargeNumber(0);
	return factorial(n).div(factorial(r).mul(factorial(n.sub(r).run()))).run();
}

function npr(n: LargeNumber, r: LargeNumber | undefined = undefined): LargeNumber {
	if (!r) return new LargeNumber(NaN);
	if (r.gt(n)) return new LargeNumber(0);
	return factorial(n).div(factorial(n.sub(r).run())).run();
}

function average(...nums: LargeNumber[]): LargeNumber {
	if (nums.length === 0) return new LargeNumber(0);
	if (nums.length === 1) return nums[0];
	const total = nums.reduce((a, b) => a.add(b), new LargeNumber(0).op());
	return total.div(new LargeNumber(nums.length)).run();
}

function radians(deg: LargeNumber): LargeNumber {
	return deg.div(LargeNumber.RAD_DEG_RATIO).run();
}

function degrees(rad: LargeNumber): LargeNumber {
	return rad.mul(LargeNumber.RAD_DEG_RATIO).run();
}

export const functions = {
	log,
	lg,
	ncr,
	npr,
	average,
	radians,
	degrees,
	nthroot,
} as const;
