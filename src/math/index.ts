import { err, ok } from "neverthrow";

import evaluate from "./internal/evaluator";
import tokenise from "./internal/tokeniser";
import { LargeNumber } from "@/math/internal/large-number";
import Worker from '@/math/worker?worker';

export type { Token, TokenId } from "./internal/tokeniser";
export { tokenise, evaluate };

export type AngleUnit = "deg" | "rad";

const resultCache = new Map();

export function calculate(expression: string, ans: LargeNumber, ind: LargeNumber, angleUnit: AngleUnit) {
	// This could be a one-liner with neverthrow's `andThen` but we want to
	// jump out of neverthrow-land for React anyhow soon
	const tokens = tokenise(expression);
	if (tokens.isErr()) return err(tokens);
	try {
		if (resultCache.has(expression)) {
			return resultCache.get(expression);
		}
		const result = evaluate(tokens.value, ans, ind, angleUnit);
		if (result.isErr()) {
			return err(result.error);
		}

		const res = ok(result.value);
		resultCache.set(expression, res); // The preview has probably already calculated the value, so no need to recalc
		return res;
	} catch (err) {
		// Usually means out-of-bits
		// Can't err here for some reason...
		console.error("Execution fail", err)
	}
	return err("PRECISION_OVERFLOW");
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
		worker.postMessage(JSON.stringify({ type: 'init' }));
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

export function calculateAsync(expression: string, ans: LargeNumber, ind: LargeNumber, angleUnit: AngleUnit): Promise<ReturnType<typeof calculate>> {
	return new Promise((resolve) => {
		if (resultCache.has(expression)) {
			resolve(resultCache.get(expression));
		}

		const randomId = Math.random().toString(16).substring(2);
		getWorker((w) => new Promise((innerResolve, innerReject) => {
			w.postMessage(JSON.stringify({
				type: 'calculate',
				id: randomId,
				data: [expression, ans.toString(), ind.toString(), angleUnit],
			}));

			const timeoutTimer = setTimeout(() => {
				resolve(err("TIMEOUT"));
				innerReject(new Error('Operation timeout'));
			}, 5000);

			function listener(e: MessageEvent<string>) {
				const data: { id?: string; value?: any; error?: any; } = JSON.parse(e.data);
				if (data.id !== randomId) return;
				delete data.id;
				w.removeEventListener('message', listener);
				clearTimeout(timeoutTimer);
				if (data.value) {
					// Workers have individual caches, so have to do this here too
					const value = ok(new LargeNumber(data.value.value));
					resultCache.set(expression, value);
					resolve(value);
				} else {
					resolve(err(data.error));
				}
				innerResolve();
			}

			w.addEventListener('message', listener);
		}));
	});
}
