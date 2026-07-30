import { n as type } from "../_libs/bemedev__typings.mjs";
import { t as createMachine } from "./lib-C0sA_zn2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/counter.machine-CJmXdGSQ.js
var counterMachine = createMachine({
	initial: "idle",
	on: {
		RESET: { actions: "reset" },
		STOP: "/idle"
	},
	states: {
		idle: {
			tags: ["stopped"],
			on: { START: "/active" }
		},
		active: {
			tags: ["running"],
			on: {
				INC: { actions: "increment" },
				DEC: { actions: "decrement" }
			}
		}
	}
}, {
	context: type({
		count: "number",
		step: "number"
	}),
	eventsMap: type({
		STOP: "never",
		INC: "never",
		DEC: "never",
		RESET: "never"
	}),
	sync: true
}).provideOptions(({ assign }) => ({ actions: {
	increment: assign("context.count", ({ context: { count, step } }) => count + step),
	decrement: assign("context.count", ({ context: { count, step } }) => Math.max(count - step, 0)),
	reset: assign("context.count", () => 0)
} }));
//#endregion
export { counterMachine as t };
