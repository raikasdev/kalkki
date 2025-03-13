import { type Result, err, ok } from "neverthrow";

import { LargeNumber } from "@/math/internal/large-number";
import Worker from "@/math/worker?worker";
import { deserializeUserspace, serializeUserspace } from "@/util";
import evaluate, {
	type EvaluationError,
	type EvalValue,
	type UserObject,
} from "./internal/evaluator";
import tokenize, { type LexicalError } from "./internal/tokenizer";

export type { Token, TokenId } from "./internal/tokenizer";
export { tokenize, evaluate };

export type AngleUnit = "deg" | "rad";

const resultCache = new Map();

export function calculate(
	expression: string,
	ans: LargeNumber,
	userSpace: Map<string, UserObject>,
	angleUnit: AngleUnit,
): Result<EvalValue, EvaluationError | LexicalError> {
	// This could be a one-liner with neverthrow's `andThen` but we want to
	// jump out of neverthrow-land for React anyhow soon
	const tokens = tokenize(expression);
	if (tokens.isErr()) return err(tokens.error);
	try {
		let cacheKey = `${angleUnit}:${JSON.stringify(userSpace)}:${expression}`;
		if (expression.toLowerCase().includes("ans")) {
			cacheKey += `:${ans}`;
		}
		if (resultCache.has(cacheKey)) {
			return resultCache.get(cacheKey);
		}
		const result = evaluate(tokens.value, ans, userSpace, angleUnit);
		if (result.isErr()) {
			return err(result.error);
		}

		const res = ok(result.value);
		resultCache.set(cacheKey, res); // The preview has probably already calculated the value, so no need to recalc
		return res;
	} catch (error) {
		// Usually means out-of-bits
		// Can't err here for some reason...
		if (error instanceof RangeError) {
			return err({ type: "RECURSION" } as const);
		}
		console.error("Execution fail", error);
	}
	return err({ type: "PRECISION_OVERFLOW" } as const);
}

/**
 * Worker pooling
 */
const workers: Worker[] = [];

export async function prepareWorker() {
	await getWorker(async () => {});
}

async function getWorker(cb: (w: Worker) => Promise<void>) {
	let worker = workers.pop();
	if (!worker) {
		worker = new Worker();
		worker.postMessage(JSON.stringify({ type: "init" }));
	}
	try {
		await cb(worker);

		if (workers.length === 0) {
			workers.push(worker); // Return to pool
		} else {
			worker.terminate(); // Theres a worker available in the pool
		}
	} catch (e) {
		worker.terminate();
		if (workers.length === 0) {
			await getWorker(async () => {}); // New one into pool
		}
	}
}

export function calculateAsync(
	expression: string,
	ans: LargeNumber,
	userSpace: Map<string, UserObject>,
	angleUnit: AngleUnit,
): Promise<ReturnType<typeof calculate>> {
	return new Promise((resolve) => {
		let cacheKey = `${angleUnit}:${JSON.stringify(userSpace)}:${expression}`;
		if (expression.toLowerCase().includes("ans")) {
			cacheKey += `:${ans}`;
		}

		if (resultCache.has(cacheKey)) {
			resolve(resultCache.get(cacheKey));
			return;
		}

		const randomId = Math.random().toString(16).substring(2);
		getWorker(
			(w) =>
				new Promise((innerResolve, innerReject) => {
					w.postMessage(
						JSON.stringify({
							type: "calculate",
							id: randomId,
							data: [
								expression,
								ans.toString(),
								JSON.stringify(serializeUserspace(userSpace)),
								angleUnit,
							],
						}),
					);

					const timeoutTimer = setTimeout(() => {
						resolve(err({ type: "TIMEOUT", expression }));
						innerReject(new Error("Operation timeout"));
					}, 5000);

					function listener(e: MessageEvent<string>) {
						const data: {
							id?: string;
							value?: Record<string, string>;
							error: LexicalError | EvaluationError;
						} = JSON.parse(e.data);
						if (data.id !== randomId) return;
						w.removeEventListener("message", listener);
						clearTimeout(timeoutTimer);
						if (data.value) {
							// Workers have individual caches, so have to do this here too
							const response = data.value;
							const res: Record<string, unknown> = {};
							if (response.value) {
								res.value = new LargeNumber(response.value);
							}
							if (response.userSpace) {
								res.userSpace = deserializeUserspace(
									JSON.parse(response.userSpace as string),
								);
							}
							const value = ok(res);
							resultCache.set(cacheKey, value);
							resolve(value);
						} else {
							resolve(err(data.error));
						}
						innerResolve();
					}

					w.addEventListener("message", listener);
				}),
		);
	});
}
