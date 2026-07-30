//#region ../../node_modules/@bemedev/better-promise/lib/constants.js
var MAX_TIMEOUT = 1e6;
//#endregion
//#region ../../node_modules/@bemedev/better-promise/lib/utils.js
var expandFn = (main, extensions) => {
	const out = main;
	if (extensions) Object.assign(out, extensions);
	return out;
};
//#endregion
//#region ../../node_modules/@bemedev/better-promise/lib/withTimeout.js
/**
* Wraps a promise with multiple timeout mechanisms to ensure it resolves or rejects within the specified time limits.
*
* @param promise - A function that returns a promise to be wrapped with timeouts.
* @param id - An identifier for the wrapped promise.
* @param timeouts - A list of timeout durations in milliseconds. The promise will be rejected if it does not resolve within any of these timeouts.
* @returns A function that, when called, returns a promise which races against the specified timeouts. The returned function also has an `abort` method to cancel the promise and an `id` property.
*
* @template WithTimeout_F - The type of the function that wraps the promise.
*
* @example
* const myPromise = () => new Promise((resolve) => setTimeout(() => resolve('Done'), 1000));
* const wrappedPromise = withTimeout(myPromise, 'examplePromise', 500, 1500);
*
* wrappedPromise().then(console.log).catch(console.error); // Will log "Timed out after 500 ms."
*
* // To abort the promise
* wrappedPromise.abort();
*/
var _withTimeout = (promise, id, ...timeouts) => {
	const _timeouts = [...timeouts, MAX_TIMEOUT];
	const timeoutPids = Array.from({ length: _timeouts.length }, () => void 0);
	const controller = new AbortController();
	const timeoutPromises = _timeouts.map(async (millis, i) => {
		return await new Promise((_, reject) => {
			controller.signal.addEventListener("abort", () => {
				reject("Aborted.");
			});
			return timeoutPids[i] = setTimeout(() => reject(`Timed out after ${millis} ms.`), millis);
		});
	});
	const out = async () => await Promise.race([promise(), ...timeoutPromises]).finally(() => {
		timeoutPids.forEach((pid) => {
			if (pid) clearTimeout(pid);
		});
	});
	out.abort = () => controller.abort();
	out.id = id;
	return out;
};
var withTimeout = expandFn(_withTimeout, { safe: (promise, id, ...timeouts) => {
	const out1 = withTimeout(promise, id, ...timeouts);
	const out2 = () => out1().catch(() => void 0);
	return withTimeout(out2, id);
} });
//#endregion
//#region ../../node_modules/@bemedev/better-promise/lib/any.js
var anyPromises = (id, ..._promises) => {
	const _finally = () => {
		return _promises.forEach(({ abort }) => {
			return abort();
		});
	};
	const promises = _promises.map((promise) => promise());
	return withTimeout(async () => await Promise.any(promises).catch((e) => {
		throw e.errors[e.errors.length - 1];
	}).finally(_finally), id);
};
//#endregion
//#region ../../node_modules/@bemedev/better-promise/lib/asyncify.js
var asyncfy = (fn) => {
	return async (...args) => fn(...args);
};
//#endregion
export { anyPromises as n, withTimeout as r, asyncfy as t };
