import { LargeNumber } from "@/math/internal/large-number";

/**
 * Calculates the factorial of a non-negative integer.
 * Returns an error if the input is negative or not an integer.
 */
export function factorial(n: LargeNumber): LargeNumber {
	if (n.isNegative()) return new LargeNumber(Number.NaN);

	return n.factorial().run();
}

/**
 * Speedcrunch syntax, base first
 * @param base Log base
 * @param x Value to log
 */
function log(
	base: LargeNumber,
	x: LargeNumber | undefined = undefined,
): LargeNumber {
	if (!x) return new LargeNumber(Number.NaN);
	return x.log(base).run();
}

function nthroot(
	n: LargeNumber,
	x: LargeNumber | undefined = undefined,
): LargeNumber {
	if (!x) return new LargeNumber(Number.NaN);
	return x.pow(new LargeNumber(1).div(n)).run();
}

function lg(x: LargeNumber): LargeNumber {
	return log(new LargeNumber(10), x);
}

function ncr(
	n: LargeNumber,
	r: LargeNumber | undefined = undefined,
): LargeNumber {
	if (!r) return new LargeNumber(Number.NaN);
	if (r.gt(n)) return new LargeNumber(0);
	return factorial(n)
		.div(factorial(r).mul(factorial(n.sub(r).run())))
		.run();
}

function npr(
	n: LargeNumber,
	r: LargeNumber | undefined = undefined,
): LargeNumber {
	if (!r) return new LargeNumber(Number.NaN);
	if (r.gt(n)) return new LargeNumber(0);
	return factorial(n)
		.div(factorial(n.sub(r).run()))
		.run();
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

function sum(...nums: LargeNumber[]) {
	return nums.reduce((a, b) => a.add(b), new LargeNumber(0).op()).run();
}

function variance(...nums: LargeNumber[]) {
	if (nums.length === 0) return new LargeNumber(0);
	const mean = average(...nums);

	return nums
		.reduce((acc, num) => {
			return acc.add(num.sub(mean).pow(new LargeNumber(2)));
		}, new LargeNumber(0).op())
		.div(new LargeNumber(nums.length))
		.run();
}

function min(...nums: LargeNumber[]) {
	return nums.reduce((a, b) => (a.gt(b) ? b : a), new LargeNumber(0));
}

function max(...nums: LargeNumber[]) {
	return nums.reduce((a, b) => (a.gt(b) ? a : b), new LargeNumber(0));
}

function frac(num: LargeNumber) {
	return num.sub(num.floor()).run();
}

function sgn(num: LargeNumber) {
	return num.gt(new LargeNumber(0))
		? new LargeNumber(1)
		: num.lt(new LargeNumber(0))
			? new LargeNumber(-1)
			: new LargeNumber(0);
}

function median(...nums: LargeNumber[]) {
	if (nums.length === 0) return new LargeNumber(0);
	if (nums.length === 1) return nums[0];

	const sorted = nums.sort((a, b) => (a.gt(b) ? 1 : -1));

	if (nums.length % 2 === 0) {
		return average(
			...sorted.slice(
				Math.round(nums.length / 2) - 1,
				Math.round(nums.length / 2) + 1,
			),
		);
	}

	return nums[Math.floor(nums.length / 2)];
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
	sum,
	variance,
	min,
	max,
	frac,
	sgn,
	median,
} as const;
