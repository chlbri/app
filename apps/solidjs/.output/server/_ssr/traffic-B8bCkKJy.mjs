import { H as onMount, a as escape, c as ssr, d as ssrHydrationKey } from "../_libs/@solid-primitives/refs+[...].mjs";
import { i as useService, n as interpret, r as toArray } from "./lib-C0sA_zn2.mjs";
import { t as trafficMachine } from "./traffic.machine-DmSrr6eh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/traffic-B8bCkKJy.js
var _tmpl$ = [
	"<div",
	" class=\"max-w-4xl mx-auto space-y-8\"><div><h2 class=\"text-3xl font-extrabold text-white\">Nested Traffic Machine Tester</h2><p class=\"text-sm text-slate-400 mt-1\">Testing nested state values, tags, and reactive transitions via <code class=\"text-purple-400 font-mono\">useService</code></p></div><div class=\"p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-around gap-8\"><div class=\"w-24 p-4 rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-inner flex flex-col gap-4 items-center\"><div class=\"",
	"\"></div><div class=\"",
	"\"></div><div class=\"",
	"\"></div></div><div class=\"space-y-6 flex-1 max-w-md\"><div class=\"space-y-2\"><span class=\"text-xs uppercase font-bold tracking-widest text-slate-500\">Active Tags</span><div class=\"flex flex-wrap gap-2\">",
	"</div></div><div class=\"space-y-3\"><button class=\"w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer\">Send NEXT Event</button><!--$-->",
	"<!--/--></div></div></div><div class=\"p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono text-xs\"><h3 class=\"text-sm font-bold text-slate-200 font-sans\">Full State Representation</h3><pre class=\"text-purple-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-[11px]\">",
	"</pre></div></div>"
];
var _tmpl$2 = [
	"<span",
	" class=\"px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm\">#<!--$-->",
	"<!--/--></span>"
];
var _tmpl$3 = [
	"<button",
	" class=\"w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer\">",
	"</button>"
];
var service = interpret(trafficMachine, { context: { cycles: 0 } });
var SplitComponent = () => {
	onMount(() => {
		service.start();
	});
	const fullState = useService(service);
	const stateValue = useService(service, { selector: (s) => s.value });
	const tags = useService(service, { selector: (s) => toArray.typed(s.tags) });
	const isRed = () => stateValue() === "red";
	const isYellow = () => stateValue() === "yellow";
	const isGreen = () => typeof stateValue() === "object" && stateValue().green;
	return ssr(_tmpl$, ssrHydrationKey(), `w-14 h-14 rounded-full border-2 transition-all duration-300 ${isRed() ? "bg-red-500 border-red-300 shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-105" : "bg-red-950/40 border-red-900/40 opacity-40"}`, `w-14 h-14 rounded-full border-2 transition-all duration-300 ${isYellow() ? "bg-amber-400 border-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.8)] scale-105" : "bg-amber-950/40 border-amber-900/40 opacity-40"}`, `w-14 h-14 rounded-full border-2 transition-all duration-300 ${isGreen() ? "bg-emerald-500 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.8)] scale-105" : "bg-emerald-950/40 border-emerald-900/40 opacity-40"}`, escape(tags().map((tag) => ssr(_tmpl$2, ssrHydrationKey(), escape(tag)))), isGreen() && ssr(_tmpl$3, ssrHydrationKey(), isGreen() === "normal" ? "Accelerate (green.fast)" : "Slow Down (green.normal)"), escape(JSON.stringify(fullState(), null, 2)));
};
//#endregion
export { SplitComponent as component };
