//#region ../../node_modules/@bemedev/scheduler/lib/helpers.js
var ERROR = /* @__PURE__ */ new Error("Scheduler stopped");
//#endregion
//#region ../../node_modules/@bemedev/scheduler/lib/scheduler.common.js
/**
* A class that manages a queue of tasks and their execution status.
*/
var CommonScheduler = class {
	__queue = [];
	__performeds = 0;
	__state = "available";
	/**
	* Returns the number of tasks that have been performed.
	*/
	get performeds() {
		return this.__performeds;
	}
	/**
	* Returns the current status of the scheduler.
	*
	* The status can be one of the following:
	* - 'processing': The scheduler is currently processing a task.
	* - 'available': The scheduler is ready to process tasks.
	* - 'stopped': The scheduler has been stopped and will not process any more tasks.
	*/
	get state() {
		return this.__state;
	}
	get #processing() {
		return this.__state === "processing";
	}
	/**
	* Schedules a callback function for execution.
	* @param task of type {@linkcode Cb} The callback function to be scheduled for execution.
	*/
	#schedule = (task) => {
		if (this.#processing) return this.__queue.push(task);
		return this.__process(task);
	};
	/**
	* Clears the task queue.
	*/
	#clear = () => this.__queue.length = 0;
	/**
	* Stops the scheduler by aborting any ongoing tasks, clearing the task queue,
	* and updating the status to 'stopped'.
	*
	* @returns {@linkcode Status} 'stopped'
	*/
	stop() {
		if (this.__state === "stopped") return this.__state;
		this.#clear();
		return this.__state = "stopped";
	}
	/**
	* Processes the callback if the scheduler is in 'available' state.
	*/
	__process = (callback) => {
		/* v8 ignore else -- @preserve */
		if (this.__state === "available") {
			this.__state = "processing";
			return this.__processImmediate(callback);
		}
	};
	/**
	* Schedules a callback function for execution, with an option to execute it immediately.
	*
	* If `immediate` is `true` the callback bypasses the queue and runs right away.
	* Otherwise it is enqueued for sequential execution.
	*
	* @param callback The callback function to be scheduled.
	* @param immediate Whether the callback should bypass the queue.
	* @returns A promise that resolves when the callback has been processed.
	*/
	schedule(callback, immediate = false) {
		if (this.__state === "stopped") this.__state = "available";
		return immediate ? this.__processImmediate(callback) : this.#schedule(callback);
	}
};
//#endregion
//#region ../../node_modules/@bemedev/scheduler/lib/scheduler.js
/**
* A class that manages a queue of tasks and their execution status.
*/
var Scheduler = class extends CommonScheduler {
	#controller = new AbortController();
	/**
	* Stops the scheduler by aborting any ongoing tasks, clearing the task queue,
	* and updating the status to 'stopped'.
	*
	* @returns {@linkcode Status} 'stopped'
	*/
	stop = () => {
		this.#controller.abort();
		return super.stop();
	};
	#flush = async () => {
		let nextCallback = this.__queue.shift();
		while (nextCallback) {
			await this.__process(nextCallback);
			nextCallback = this.__queue.shift();
		}
	};
	/**
	* Immediately processes the callback function, updates the status,
	* and increments the performed count.
	*
	* @param callback of type {@linkcode Cb} The callback function to be executed immediately.
	*/
	__processImmediate = async (callback) => {
		const result = callback();
		if (result instanceof Promise) return Promise.race([result, new Promise((_, reject) => this.#controller.signal.addEventListener("abort", () => reject(ERROR)))]).catch((error) => {
			if (error === ERROR) {
				this.stop();
				return;
			}
			throw error;
		}).finally(() => {
			this.__performeds++;
			this.__state = "available";
			return this.#flush();
		});
		this.__performeds++;
		this.__state = "available";
		return this.#flush();
	};
	/**
	* Schedules a callback function for execution, with an option to execute it immediately.
	*
	* If `immediate` is `true` the callback bypasses the queue and runs right away.
	* Otherwise it is enqueued for sequential execution.
	*
	* @param callback The callback function to be scheduled.
	* @param immediate Whether the callback should bypass the queue.
	* @returns A promise that resolves when the callback has been processed.
	*/
	schedule = async (callback, immediate = false) => super.schedule(callback, immediate);
};
/**
* Creates and returns a new instance of the `Scheduler` class.
*
* @see {@linkcode Scheduler}
*/
var createScheduler$1 = () => new Scheduler();
//#endregion
//#region ../../node_modules/@bemedev/scheduler/lib/scheduler.sync.js
/**
* A class that manages a queue of tasks and their execution status.
*/
var SyncScheduler = class extends CommonScheduler {
	/**
	* Immediately processes the callback function, updates the status,
	* and increments the performed count.
	*
	* @param callback of type {@linkcode Cb} The callback function to be executed immediately.
	*/
	__processImmediate = (callback) => {
		callback();
		this.__performeds++;
		this.__state = "available";
	};
	/**
	* Schedules a callback function for execution, with an option to execute it immediately.
	*
	* If `immediate` is `true` the callback bypasses the queue and runs right away.
	* Otherwise it is enqueued for sequential execution.
	*
	* @param callback The callback function to be scheduled.
	* @param immediate Whether the callback should bypass the queue.
	* @returns A promise that resolves when the callback has been processed.
	*/
	schedule = (callback) => super.schedule(callback, false);
};
/**
* Creates and returns a new instance of the `Scheduler` class.
*
* @see {@linkcode SyncScheduler}
*/
var createSyncScheduler = () => new SyncScheduler();
var createScheduler = createSyncScheduler;
//#endregion
export { createScheduler$1 as n, createScheduler as t };
