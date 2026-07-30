import { n as type } from "../_libs/bemedev__typings.mjs";
import { t as createMachine } from "./lib-C0sA_zn2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/traffic.machine-DmSrr6eh.js
var trafficMachine = createMachine({
	initial: "red",
	states: {
		red: {
			tags: ["stop_light"],
			on: { NEXT: "/green" }
		},
		yellow: {
			tags: ["caution_light"],
			on: { NEXT: "/red" }
		},
		green: {
			tags: ["go_light"],
			initial: "normal",
			states: {
				normal: {
					tags: ["normal_speed"],
					on: { ACCELERATE: "/green/fast" }
				},
				fast: {
					tags: ["fast_speed"],
					on: { SLOW_DOWN: "/green/normal" }
				}
			},
			on: { NEXT: "/yellow" }
		}
	}
}, {
	context: type({ cycles: "number" }),
	eventsMap: type({
		NEXT: "never",
		ACCELERATE: "never",
		SLOW_DOWN: "never"
	}),
	sync: true
});
//#endregion
export { trafficMachine as t };
