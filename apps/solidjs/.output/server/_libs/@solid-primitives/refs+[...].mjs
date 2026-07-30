//#region ../../node_modules/solid-js/dist/server.js
var ERROR = Symbol("error");
function castError(err) {
	if (err instanceof Error) return err;
	return new Error(typeof err === "string" ? err : "Unknown error", { cause: err });
}
function handleError(err, owner = Owner) {
	const fns = owner && owner.context && owner.context[ERROR];
	const error = castError(err);
	if (!fns) throw error;
	try {
		for (const f of fns) f(error);
	} catch (e) {
		handleError(e, owner && owner.owner || null);
	}
}
var UNOWNED = {
	context: null,
	owner: null,
	owned: null,
	cleanups: null
};
var Owner = null;
function createOwner() {
	const o = {
		owner: Owner,
		context: Owner ? Owner.context : null,
		owned: null,
		cleanups: null
	};
	if (Owner) if (!Owner.owned) Owner.owned = [o];
	else Owner.owned.push(o);
	return o;
}
function createRoot(fn, detachedOwner) {
	const owner = Owner, current = detachedOwner === void 0 ? owner : detachedOwner, root = fn.length === 0 ? UNOWNED : {
		context: current ? current.context : null,
		owner: current,
		owned: null,
		cleanups: null
	};
	Owner = root;
	let result;
	try {
		result = fn(fn.length === 0 ? () => {} : () => cleanNode(root));
	} catch (err) {
		handleError(err);
	} finally {
		Owner = owner;
	}
	return result;
}
function createSignal(value, options) {
	return [() => value, (v) => {
		return value = typeof v === "function" ? v(value) : v;
	}];
}
function createComputed(fn, value) {
	Owner = createOwner();
	try {
		fn(value);
	} catch (err) {
		handleError(err);
	} finally {
		Owner = Owner.owner;
	}
}
var createRenderEffect = createComputed;
function createEffect(fn, value) {}
function createMemo(fn, value) {
	Owner = createOwner();
	let v;
	try {
		v = fn(value);
	} catch (err) {
		handleError(err);
	} finally {
		Owner = Owner.owner;
	}
	return () => v;
}
function batch(fn) {
	return fn();
}
var untrack = batch;
function on$1(deps, fn, options = {}) {
	const isArray = Array.isArray(deps);
	const defer = options.defer;
	return () => {
		if (defer) return void 0;
		let value;
		if (isArray) {
			value = [];
			for (let i = 0; i < deps.length; i++) value.push(deps[i]());
		} else value = deps();
		return fn(value);
	};
}
function onMount(fn) {}
function onCleanup(fn) {
	if (Owner) if (!Owner.cleanups) Owner.cleanups = [fn];
	else Owner.cleanups.push(fn);
	return fn;
}
function cleanNode(node) {
	if (node.owned) {
		for (let i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
		node.owned = null;
	}
	if (node.cleanups) {
		for (let i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
		node.cleanups = null;
	}
}
function catchError(fn, handler) {
	const owner = createOwner();
	owner.context = {
		...owner.context,
		[ERROR]: [handler]
	};
	Owner = owner;
	try {
		return fn();
	} catch (err) {
		handleError(err);
	} finally {
		Owner = Owner.owner;
	}
}
function createContext(defaultValue) {
	const id = Symbol("context");
	return {
		id,
		Provider: createProvider(id),
		defaultValue
	};
}
function useContext(context) {
	return Owner && Owner.context && Owner.context[context.id] !== void 0 ? Owner.context[context.id] : context.defaultValue;
}
function children(fn) {
	const memo = createMemo(() => resolveChildren(fn()));
	memo.toArray = () => {
		const c = memo();
		return Array.isArray(c) ? c : c != null ? [c] : [];
	};
	return memo;
}
function runWithOwner(o, fn) {
	const prev = Owner;
	Owner = o;
	try {
		return fn();
	} catch (err) {
		handleError(err);
	} finally {
		Owner = prev;
	}
}
function resolveChildren(children) {
	if (typeof children === "function" && !children.length) return resolveChildren(children());
	if (Array.isArray(children)) {
		const results = [];
		for (let i = 0; i < children.length; i++) {
			const result = resolveChildren(children[i]);
			if (Array.isArray(result)) if (result.length < 32768) results.push.apply(results, result);
			else for (let j = 0; j < result.length; j++) results.push(result[j]);
			else results.push(result);
		}
		return results;
	}
	return children;
}
function createProvider(id) {
	return function provider(props) {
		return createMemo(() => {
			Owner.context = {
				...Owner.context,
				[id]: props.value
			};
			return children(() => props.children);
		});
	};
}
function escape$1(s, attr) {
	const t = typeof s;
	if (t !== "string") {
		if (t === "function") return escape$1(s());
		if (Array.isArray(s)) {
			for (let i = 0; i < s.length; i++) s[i] = escape$1(s[i]);
			return s;
		}
		return s;
	}
	const delim = "<";
	const escDelim = "&lt;";
	let iDelim = s.indexOf(delim);
	let iAmp = s.indexOf("&");
	if (iDelim < 0 && iAmp < 0) return s;
	let left = 0, out = "";
	while (iDelim >= 0 && iAmp >= 0) if (iDelim < iAmp) {
		if (left < iDelim) out += s.substring(left, iDelim);
		out += escDelim;
		left = iDelim + 1;
		iDelim = s.indexOf(delim, left);
	} else {
		if (left < iAmp) out += s.substring(left, iAmp);
		out += "&amp;";
		left = iAmp + 1;
		iAmp = s.indexOf("&", left);
	}
	if (iDelim >= 0) do {
		if (left < iDelim) out += s.substring(left, iDelim);
		out += escDelim;
		left = iDelim + 1;
		iDelim = s.indexOf(delim, left);
	} while (iDelim >= 0);
	else while (iAmp >= 0) {
		if (left < iAmp) out += s.substring(left, iAmp);
		out += "&amp;";
		left = iAmp + 1;
		iAmp = s.indexOf("&", left);
	}
	return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode$1(node) {
	const t = typeof node;
	if (t === "string") return node;
	if (node == null || t === "boolean") return "";
	if (Array.isArray(node)) {
		let prev = {};
		let mapped = "";
		for (let i = 0, len = node.length; i < len; i++) {
			if (typeof prev !== "object" && typeof node[i] !== "object") mapped += `<!--!$-->`;
			mapped += resolveSSRNode$1(prev = node[i]);
		}
		return mapped;
	}
	if (t === "object") return node.t;
	if (t === "function") return resolveSSRNode$1(node());
	return String(node);
}
var sharedConfig = {
	context: void 0,
	getContextId() {
		if (!this.context) throw new Error(`getContextId cannot be used under non-hydrating context`);
		return getContextId(this.context.count);
	},
	getNextContextId() {
		if (!this.context) throw new Error(`getNextContextId cannot be used under non-hydrating context`);
		return getContextId(this.context.count++);
	}
};
function getContextId(count) {
	const num = String(count), len = num.length - 1;
	return sharedConfig.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
}
function setHydrateContext(context) {
	sharedConfig.context = context;
}
function nextHydrateContext() {
	return sharedConfig.context ? {
		...sharedConfig.context,
		id: sharedConfig.getNextContextId(),
		count: 0
	} : void 0;
}
function createUniqueId() {
	return sharedConfig.getNextContextId();
}
function createComponent(Comp, props) {
	if (sharedConfig.context && !sharedConfig.context.noHydrate) {
		const c = sharedConfig.context;
		setHydrateContext(nextHydrateContext());
		const r = Comp(props || {});
		setHydrateContext(c);
		return r;
	}
	return Comp(props || {});
}
function mergeProps(...sources) {
	const target = {};
	for (let i = 0; i < sources.length; i++) {
		let source = sources[i];
		if (typeof source === "function") source = source();
		if (source) {
			const descriptors = Object.getOwnPropertyDescriptors(source);
			for (const key in descriptors) {
				if (key === "__proto__" || key === "constructor" || Object.prototype.hasOwnProperty.call(target, key)) continue;
				Object.defineProperty(target, key, {
					enumerable: true,
					get() {
						for (let i = sources.length - 1; i >= 0; i--) {
							let v, s = sources[i];
							if (typeof s === "function") s = s();
							v = (s || {})[key];
							if (v !== void 0) return v;
						}
					}
				});
			}
		}
	}
	return target;
}
function splitProps(props, ...keys) {
	const descriptors = Object.getOwnPropertyDescriptors(props), split = (k) => {
		const clone = {};
		for (let i = 0; i < k.length; i++) {
			const key = k[i];
			if (descriptors[key]) {
				Object.defineProperty(clone, key, descriptors[key]);
				delete descriptors[key];
			}
		}
		return clone;
	};
	return keys.map(split).concat(split(Object.keys(descriptors)));
}
function simpleMap(props, wrap) {
	const list = props.each || [], len = list.length, fn = props.children;
	if (len) {
		let mapped = Array(len);
		for (let i = 0; i < len; i++) mapped[i] = wrap(fn, list[i], i);
		return mapped;
	}
	return props.fallback;
}
function For(props) {
	return simpleMap(props, (fn, item, i) => fn(item, () => i));
}
function Show(props) {
	let c;
	return props.when ? typeof (c = props.children) === "function" && c.length > 0 ? c(props.keyed ? props.when : () => props.when) : c : props.fallback || "";
}
function Switch(props) {
	let conditions = props.children;
	Array.isArray(conditions) || (conditions = [conditions]);
	for (let i = 0; i < conditions.length; i++) {
		const w = conditions[i].when;
		if (w) {
			const c = conditions[i].children;
			return typeof c === "function" && c.length > 0 ? c(conditions[i].keyed ? w : () => w) : c;
		}
	}
	return props.fallback || "";
}
function Match(props) {
	return props;
}
function ErrorBoundary(props) {
	let error, res, clean, sync = true;
	const ctx = sharedConfig.context;
	const id = sharedConfig.getContextId();
	function displayFallback() {
		cleanNode(clean);
		ctx.serialize(id, error);
		setHydrateContext({
			...ctx,
			count: 0
		});
		const f = props.fallback;
		return typeof f === "function" && f.length ? f(error, () => {}) : f;
	}
	createMemo(() => {
		clean = Owner;
		return catchError(() => res = props.children, (err) => {
			error = err;
			!sync && ctx.replace("e" + id, displayFallback);
			sync = true;
		});
	});
	if (error) return displayFallback();
	sync = false;
	return { t: `<!--!$e${id}-->${resolveSSRNode$1(escape$1(res))}<!--!$/e${id}-->` };
}
var SuspenseContext = createContext();
var resourceContext = null;
function createResource(source, fetcher, options = {}) {
	if (typeof fetcher !== "function") {
		options = fetcher || {};
		fetcher = source;
		source = true;
	}
	const contexts = /* @__PURE__ */ new Set();
	const id = sharedConfig.getNextContextId();
	let resource = {};
	let value = options.storage ? options.storage(options.initialValue)[0]() : options.initialValue;
	let p;
	let error;
	if (sharedConfig.context.async && options.ssrLoadFrom !== "initial") {
		resource = sharedConfig.context.resources[id] || (sharedConfig.context.resources[id] = {});
		if (resource.ref) {
			if (!resource.data && !resource.ref[0]._loading && !resource.ref[0].error) resource.ref[1].refetch();
			return resource.ref;
		}
	}
	const prepareResource = () => {
		if (error) throw error;
		const resolved = options.ssrLoadFrom !== "initial" && sharedConfig.context.async && "data" in sharedConfig.context.resources[id];
		if (!resolved && resourceContext) resourceContext.push(id);
		if (!resolved && read._loading) {
			const ctx = useContext(SuspenseContext);
			if (ctx) {
				ctx.resources.set(id, read);
				contexts.add(ctx);
			}
		}
		return resolved;
	};
	const read = () => {
		return prepareResource() ? sharedConfig.context.resources[id].data : value;
	};
	const loading = () => {
		prepareResource();
		return read._loading;
	};
	read._loading = false;
	read.error = void 0;
	read.state = "initialValue" in options ? "ready" : "unresolved";
	Object.defineProperties(read, {
		latest: { get() {
			return read();
		} },
		loading: { get() {
			return loading();
		} }
	});
	function load() {
		const ctx = sharedConfig.context;
		if (!ctx.async) return read._loading = !!(typeof source === "function" ? source() : source);
		if (ctx.resources && id in ctx.resources && "data" in ctx.resources[id]) {
			value = ctx.resources[id].data;
			return;
		}
		let lookup;
		try {
			resourceContext = [];
			lookup = typeof source === "function" ? source() : source;
			if (resourceContext.length) return;
		} finally {
			resourceContext = null;
		}
		if (!p) {
			if (lookup == null || lookup === false) return;
			p = fetcher(lookup, { value });
		}
		if (p != void 0 && typeof p === "object" && "then" in p) {
			read._loading = true;
			read.state = "pending";
			p = p.then((res) => {
				read._loading = false;
				read.state = "ready";
				ctx.resources[id].data = res;
				p = null;
				notifySuspense(contexts);
				return res;
			}).catch((err) => {
				read._loading = false;
				read.state = "errored";
				read.error = error = castError(err);
				p = null;
				notifySuspense(contexts);
				throw error;
			});
			if (ctx.serialize) ctx.serialize(id, p, options.deferStream);
			return p;
		}
		ctx.resources[id].data = p;
		if (ctx.serialize) ctx.serialize(id, p);
		p = null;
		return ctx.resources[id].data;
	}
	if (options.ssrLoadFrom !== "initial") load();
	const ref = [read, {
		refetch: load,
		mutate: (v) => value = v
	}];
	if (p) resource.ref = ref;
	return ref;
}
function suspenseComplete(c) {
	for (const r of c.resources.values()) if (r._loading) return false;
	return true;
}
function notifySuspense(contexts) {
	for (const c of contexts) {
		if (!suspenseComplete(c)) continue;
		c.completed();
		contexts.delete(c);
	}
}
function startTransition(fn) {
	fn();
}
function useTransition() {
	return [() => false, (fn) => {
		fn();
	}];
}
function Suspense(props) {
	let done;
	const ctx = sharedConfig.context;
	const id = sharedConfig.getContextId();
	const o = createOwner();
	const value = ctx.suspense[id] || (ctx.suspense[id] = {
		resources: /* @__PURE__ */ new Map(),
		completed: () => {
			const res = runSuspense();
			if (suspenseComplete(value)) done(resolveSSRNode$1(escape$1(res)));
		}
	});
	function suspenseError(err) {
		if (!done || !done(void 0, err)) runWithOwner(o.owner, () => {
			throw err;
		});
	}
	function runSuspense() {
		setHydrateContext({
			...ctx,
			count: 0
		});
		cleanNode(o);
		return runWithOwner(o, () => createComponent(SuspenseContext.Provider, {
			value,
			get children() {
				return catchError(() => props.children, suspenseError);
			}
		}));
	}
	const res = runSuspense();
	if (suspenseComplete(value)) {
		delete ctx.suspense[id];
		return res;
	}
	done = ctx.async ? ctx.registerFragment(id) : void 0;
	return catchError(() => {
		if (ctx.async) {
			setHydrateContext({
				...ctx,
				count: 0,
				id: ctx.id + "0F",
				noHydrate: true
			});
			const res = { t: `<template id="pl-${id}"></template>${resolveSSRNode$1(escape$1(props.fallback))}<!--pl-${id}-->` };
			setHydrateContext(ctx);
			return res;
		}
		setHydrateContext({
			...ctx,
			count: 0,
			id: ctx.id + "0F"
		});
		ctx.serialize(id, "$$f");
		return props.fallback;
	}, suspenseError);
}
//#endregion
//#region ../../node_modules/solid-js/node_modules/seroval/dist/esm/production/index.mjs
var L$1 = ((i) => (i[i.AggregateError = 1] = "AggregateError", i[i.ArrowFunction = 2] = "ArrowFunction", i[i.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", i[i.ObjectAssign = 8] = "ObjectAssign", i[i.BigIntTypedArray = 16] = "BigIntTypedArray", i[i.RegExp = 32] = "RegExp", i))(L$1 || {});
var v$2 = Symbol.asyncIterator;
var dr = Symbol.hasInstance;
var R = Symbol.isConcatSpreadable;
var C$1 = Symbol.iterator;
var gr = Symbol.match;
var yr = Symbol.matchAll;
var Nr = Symbol.replace;
var br = Symbol.search;
var vr = Symbol.species;
var Cr = Symbol.split;
var Ar = Symbol.toPrimitive;
var P$1 = Symbol.toStringTag;
var Er = Symbol.unscopables;
var nt = {
	0: "Symbol.asyncIterator",
	1: "Symbol.hasInstance",
	2: "Symbol.isConcatSpreadable",
	3: "Symbol.iterator",
	4: "Symbol.match",
	5: "Symbol.matchAll",
	6: "Symbol.replace",
	7: "Symbol.search",
	8: "Symbol.species",
	9: "Symbol.split",
	10: "Symbol.toPrimitive",
	11: "Symbol.toStringTag",
	12: "Symbol.unscopables"
};
var Ce = {
	[v$2]: 0,
	[dr]: 1,
	[R]: 2,
	[C$1]: 3,
	[gr]: 4,
	[yr]: 5,
	[Nr]: 6,
	[br]: 7,
	[vr]: 8,
	[Cr]: 9,
	[Ar]: 10,
	[P$1]: 11,
	[Er]: 12
};
var at = {
	2: "!0",
	3: "!1",
	1: "void 0",
	0: "null",
	4: "-0",
	5: "1/0",
	6: "-1/0",
	7: "0/0"
};
var o$2 = void 0;
Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY;
var Ae = {
	0: "Error",
	1: "EvalError",
	2: "RangeError",
	3: "ReferenceError",
	4: "SyntaxError",
	5: "TypeError",
	6: "URIError"
};
function c$2(e, r, t, n, a, s, i, u, l, g, S, d) {
	return {
		t: e,
		i: r,
		s: t,
		c: n,
		m: a,
		p: s,
		e: i,
		a: u,
		f: l,
		b: g,
		o: S,
		l: d
	};
}
function B$2(e) {
	return c$2(2, o$2, e, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
var J$2 = B$2(2);
var Z$1 = B$2(3);
var Ee$1 = B$2(1);
var Ie$1 = B$2(0);
var ut$1 = B$2(4);
var lt$1 = B$2(5);
var ct$1 = B$2(6);
var ft$1 = B$2(7);
function dn(e) {
	switch (e) {
		case "\"": return "\\\"";
		case "\\": return "\\\\";
		case `
`: return "\\n";
		case "\r": return "\\r";
		case "\b": return "\\b";
		case "	": return "\\t";
		case "\f": return "\\f";
		case "<": return "\\x3C";
		case "\u2028": return "\\u2028";
		case "\u2029": return "\\u2029";
		default: return o$2;
	}
}
function y$1(e) {
	let r = "", t = 0, n;
	for (let a = 0, s = e.length; a < s; a++) n = dn(e[a]), n && (r += e.slice(t, a) + n, t = a + 1);
	return t === 0 ? r = e : r += e.slice(t), r;
}
function gn(e) {
	switch (e) {
		case "\\\\": return "\\";
		case "\\\"": return "\"";
		case "\\n": return `
`;
		case "\\r": return "\r";
		case "\\b": return "\b";
		case "\\t": return "	";
		case "\\f": return "\f";
		case "\\x3C": return "<";
		case "\\u2028": return "\u2028";
		case "\\u2029": return "\u2029";
		default: return e;
	}
}
function h$1(e) {
	return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, gn);
}
var U$1 = "__SEROVAL_REFS__";
var le$2 = "$R";
var Re$1 = `self.${le$2}`;
function yn(e) {
	return e == null ? `${Re$1}=${Re$1}||[]` : `(${Re$1}=${Re$1}||{})["${y$1(e)}"]=[]`;
}
var Ir = /* @__PURE__ */ new Map();
var j$2 = /* @__PURE__ */ new Map();
function Rr(e) {
	return Ir.has(e);
}
function St(e) {
	if (Rr(e)) return Ir.get(e);
	throw new Pe(e);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, U$1, {
	value: j$2,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof window != "undefined" ? Object.defineProperty(window, U$1, {
	value: j$2,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof self != "undefined" ? Object.defineProperty(self, U$1, {
	value: j$2,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof global != "undefined" && Object.defineProperty(global, U$1, {
	value: j$2,
	configurable: !0,
	writable: !1,
	enumerable: !1
});
function Te(e) {
	return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function vn(e) {
	let r = Ae[Te(e)];
	return e.name !== r ? { name: e.name } : e.constructor.name !== r ? { name: e.constructor.name } : {};
}
function $(e, r) {
	let t = vn(e), n = Object.getOwnPropertyNames(e);
	for (let a = 0, s = n.length, i; a < s; a++) i = n[a], i !== "name" && i !== "message" && (i === "stack" ? r & 4 && (t = t || {}, t[i] = e[i]) : (t = t || {}, t[i] = e[i]));
	return t;
}
function Oe(e) {
	return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function we(e) {
	switch (e) {
		case Number.POSITIVE_INFINITY: return lt$1;
		case Number.NEGATIVE_INFINITY: return ct$1;
	}
	return e !== e ? ft$1 : Object.is(e, -0) ? ut$1 : c$2(0, o$2, e, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function X(e) {
	return c$2(1, o$2, y$1(e), o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function he(e) {
	return c$2(3, o$2, "" + e, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function dt(e) {
	return c$2(4, e, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function ze(e, r) {
	let t = r.valueOf();
	return c$2(5, e, t !== t ? "" : r.toISOString(), o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function _e(e, r) {
	return c$2(6, e, o$2, y$1(r.source), r.flags, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function gt(e, r) {
	return c$2(17, e, Ce[r], o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function yt(e, r) {
	return c$2(18, e, y$1(St(r)), o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function ce(e, r, t) {
	return c$2(25, e, t, y$1(r), o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function ke(e, r, t) {
	return c$2(9, e, o$2, o$2, o$2, o$2, o$2, t, o$2, o$2, Oe(r), o$2);
}
function De(e, r) {
	return c$2(21, e, o$2, o$2, o$2, o$2, o$2, o$2, r, o$2, o$2, o$2);
}
function Fe(e, r, t) {
	return c$2(15, e, o$2, r.constructor.name, o$2, o$2, o$2, o$2, t, r.byteOffset, o$2, r.length);
}
function Be(e, r, t) {
	return c$2(16, e, o$2, r.constructor.name, o$2, o$2, o$2, o$2, t, r.byteOffset, o$2, r.length);
}
function Ve(e, r, t) {
	return c$2(20, e, o$2, o$2, o$2, o$2, o$2, o$2, t, r.byteOffset, o$2, r.byteLength);
}
function Me(e, r, t) {
	return c$2(13, e, Te(r), o$2, y$1(r.message), t, o$2, o$2, o$2, o$2, o$2, o$2);
}
function Le(e, r, t) {
	return c$2(14, e, Te(r), o$2, y$1(r.message), t, o$2, o$2, o$2, o$2, o$2, o$2);
}
function Ue(e, r) {
	return c$2(7, e, o$2, o$2, o$2, o$2, o$2, r, o$2, o$2, o$2, o$2);
}
function je(e, r) {
	return c$2(28, o$2, o$2, o$2, o$2, o$2, o$2, [e, r], o$2, o$2, o$2, o$2);
}
function Ye(e, r) {
	return c$2(30, o$2, o$2, o$2, o$2, o$2, o$2, [e, r], o$2, o$2, o$2, o$2);
}
function qe(e, r, t) {
	return c$2(31, e, o$2, o$2, o$2, o$2, o$2, t, r, o$2, o$2, o$2);
}
function We(e, r) {
	return c$2(32, e, o$2, o$2, o$2, o$2, o$2, o$2, r, o$2, o$2, o$2);
}
function Ke(e, r) {
	return c$2(33, e, o$2, o$2, o$2, o$2, o$2, o$2, r, o$2, o$2, o$2);
}
function Ge(e, r) {
	return c$2(34, e, o$2, o$2, o$2, o$2, o$2, o$2, r, o$2, o$2, o$2);
}
function He(e, r, t, n) {
	return c$2(35, e, t, o$2, o$2, o$2, o$2, r, o$2, o$2, o$2, n);
}
var { toString: bs$1 } = Object.prototype;
var Cn = {
	parsing: 1,
	serialization: 2,
	deserialization: 3
};
function An(e) {
	return `Seroval Error (step: ${Cn[e]})`;
}
var En = (e, r) => An(e);
var fe = class extends Error {
	constructor(t, n) {
		super(En(t, n));
		this.cause = n;
	}
};
var _ = class extends fe {
	constructor(r) {
		super("parsing", r);
	}
};
function k(e) {
	return `Seroval Error (specific: ${e})`;
}
var x$1 = class extends Error {
	constructor(t) {
		super(k(1));
		this.value = t;
	}
};
var z = class extends Error {
	constructor(r) {
		super(k(2));
	}
};
var Q$1 = class extends Error {
	constructor(r) {
		super(k(3));
	}
};
var Pe = class extends Error {
	constructor(t) {
		super(k(5));
		this.value = t;
	}
};
var M$1 = class extends Error {
	constructor(r) {
		super(k(9));
	}
};
var Y = class {
	constructor(r, t) {
		this.value = r;
		this.replacement = t;
	}
};
var ee$2 = () => {
	let e = {
		p: 0,
		s: 0,
		f: 0
	};
	return e.p = new Promise((r, t) => {
		e.s = r, e.f = t;
	}), e;
};
var In$1 = (e, r) => {
	e.s(r), e.p.s = 1, e.p.v = r;
};
var Rn$1 = (e, r) => {
	e.f(r), e.p.s = 2, e.p.v = r;
};
var bt$1 = ee$2.toString();
var vt$1 = In$1.toString();
var Ct$1 = Rn$1.toString();
var xr$1 = () => {
	let e = [], r = [], t = !0, n = !1, a = 0, s = (l, g, S) => {
		for (S = 0; S < a; S++) r[S] && r[S][g](l);
	}, i = (l, g, S, d) => {
		for (g = 0, S = e.length; g < S; g++) d = e[g], !t && g === S - 1 ? l[n ? "return" : "throw"](d) : l.next(d);
	}, u = (l, g) => (t && (g = a++, r[g] = l), i(l), () => {
		t && (r[g] = r[a], r[a--] = void 0);
	});
	return {
		__SEROVAL_STREAM__: !0,
		on: (l) => u(l),
		next: (l) => {
			t && (e.push(l), s(l, "next"));
		},
		throw: (l) => {
			t && (e.push(l), s(l, "throw"), t = !1, n = !1, r.length = 0);
		},
		return: (l) => {
			t && (e.push(l), s(l, "return"), t = !1, n = !0, r.length = 0);
		}
	};
};
var At$1 = xr$1.toString();
var Tr$1 = (e) => (r) => () => {
	let t = 0, n = {
		[e]: () => n,
		next: () => {
			if (t > r.d) return {
				done: !0,
				value: void 0
			};
			let a = t++, s = r.v[a];
			if (a === r.t) throw s;
			return {
				done: a === r.d,
				value: s
			};
		}
	};
	return n;
};
var Et$1 = Tr$1.toString();
var Or$1 = (e, r) => (t) => () => {
	let n = 0, a = -1, s = !1, i = [], u = [], l = (S = 0, d = u.length) => {
		for (; S < d; S++) u[S].s({
			done: !0,
			value: void 0
		});
	};
	t.on({
		next: (S) => {
			let d = u.shift();
			d && d.s({
				done: !1,
				value: S
			}), i.push(S);
		},
		throw: (S) => {
			let d = u.shift();
			d && d.f(S), l(), a = i.length, s = !0, i.push(S);
		},
		return: (S) => {
			let d = u.shift();
			d && d.s({
				done: !0,
				value: S
			}), l(), a = i.length, i.push(S);
		}
	});
	let g = {
		[e]: () => g,
		next: () => {
			if (a === -1) {
				let G = n++;
				if (G >= i.length) {
					let tt = r();
					return u.push(tt), tt.p;
				}
				return {
					done: !1,
					value: i[G]
				};
			}
			if (n > a) return {
				done: !0,
				value: void 0
			};
			let S = n++, d = i[S];
			if (S !== a) return {
				done: !1,
				value: d
			};
			if (s) throw d;
			return {
				done: !0,
				value: d
			};
		}
	};
	return g;
};
var It$1 = Or$1.toString();
var wr$1 = (e) => {
	let r = atob(e), t = r.length, n = new Uint8Array(t);
	for (let a = 0; a < t; a++) n[a] = r.charCodeAt(a);
	return n.buffer;
};
var Rt$1 = wr$1.toString();
function $e(e) {
	return "__SEROVAL_SEQUENCE__" in e;
}
function hr(e, r, t) {
	return {
		__SEROVAL_SEQUENCE__: !0,
		v: e,
		t: r,
		d: t
	};
}
function Xe(e) {
	let r = [], t = -1, n = -1, a = e[C$1]();
	for (;;) try {
		let s = a.next();
		if (r.push(s.value), s.done) {
			n = r.length - 1;
			break;
		}
	} catch (s) {
		t = r.length, r.push(s);
	}
	return hr(r, t, n);
}
var xt = {};
var Tt = {};
var Ot = {
	0: {},
	1: {},
	2: {},
	3: {},
	4: {},
	5: {}
};
var wt = {
	0: "[]",
	1: bt$1,
	2: vt$1,
	3: Ct$1,
	4: At$1,
	5: Rt$1
};
function Qe(e) {
	return "__SEROVAL_STREAM__" in e;
}
function re$2() {
	return xr$1();
}
function er(e) {
	let r = re$2(), t = e[v$2]();
	async function n() {
		try {
			let a = await t.next();
			a.done ? r.return(a.value) : (r.next(a.value), await n());
		} catch (a) {
			r.throw(a);
		}
	}
	return n().catch(() => {}), r;
}
function me(e, r) {
	return {
		plugins: r.plugins,
		mode: e,
		marked: /* @__PURE__ */ new Set(),
		features: 63 ^ (r.disabledFeatures || 0),
		refs: r.refs || /* @__PURE__ */ new Map(),
		depthLimit: r.depthLimit || 1e3
	};
}
function pe(e, r) {
	e.marked.add(r);
}
function _r(e, r) {
	let t = e.refs.size;
	return e.refs.set(r, t), t;
}
function rr(e, r) {
	let t = e.refs.get(r);
	return t != null ? (pe(e, t), {
		type: 1,
		value: dt(t)
	}) : {
		type: 0,
		value: _r(e, r)
	};
}
function q(e, r) {
	let t = rr(e, r);
	return t.type === 1 ? t : Rr(r) ? {
		type: 2,
		value: yt(t.value, r)
	} : t;
}
function I(e, r) {
	let t = q(e, r);
	if (t.type !== 0) return t.value;
	if (r in Ce) return gt(t.value, r);
	throw new x$1(r);
}
function D$1(e, r) {
	let t = rr(e, Ot[r]);
	return t.type === 1 ? t.value : c$2(26, t.value, r, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2, o$2);
}
function tr(e) {
	let r = rr(e, xt);
	return r.type === 1 ? r.value : c$2(27, r.value, o$2, o$2, o$2, o$2, o$2, o$2, I(e, C$1), o$2, o$2, o$2);
}
function nr(e) {
	let r = rr(e, Tt);
	return r.type === 1 ? r.value : c$2(29, r.value, o$2, o$2, o$2, o$2, o$2, [D$1(e, 1), I(e, v$2)], o$2, o$2, o$2, o$2);
}
function or(e, r, t, n) {
	return c$2(t ? 11 : 10, e, o$2, o$2, o$2, n, o$2, o$2, o$2, o$2, Oe(r), o$2);
}
function ar(e, r, t, n) {
	return c$2(8, r, o$2, o$2, o$2, o$2, {
		k: t,
		v: n
	}, o$2, D$1(e, 0), o$2, o$2, o$2);
}
function _t(e, r, t) {
	return c$2(22, r, t, o$2, o$2, o$2, o$2, o$2, D$1(e, 1), o$2, o$2, o$2);
}
function sr(e, r, t) {
	let n = new Uint8Array(t), a = "";
	for (let s = 0, i = n.length; s < i; s++) a += String.fromCharCode(n[s]);
	return c$2(19, r, y$1(btoa(a)), o$2, o$2, o$2, o$2, o$2, D$1(e, 5), o$2, o$2, o$2);
}
var oe$2 = ((t) => (t[t.Vanilla = 1] = "Vanilla", t[t.Cross = 2] = "Cross", t))(oe$2 || {});
function Ft(e, r) {
	for (let t = 0, n = r.length; t < n; t++) {
		let a = r[t];
		e.has(a) || (e.add(a), a.extends && Ft(e, a.extends));
	}
}
function A$1(e) {
	if (e) {
		let r = /* @__PURE__ */ new Set();
		return Ft(r, e), [...r];
	}
}
function de$1(e) {
	switch (e) {
		case "constructor":
		case "__proto__":
		case "prototype":
		case "__defineGetter__":
		case "__defineSetter__":
		case "__lookupGetter__":
		case "__lookupSetter__": return !1;
		default: return !0;
	}
}
var Ro$1 = () => T;
var Po$1 = Ro$1.toString();
var Ht$1 = /=>/.test(Po$1);
function ur(e, r) {
	return Ht$1 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + e.join(",") + "){return " + r + "}";
}
function Jt(e, r) {
	return Ht$1 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}" : "function(" + e.join(",") + "){" + r + "}";
}
var Xt$1 = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
var Zt$1 = Xt$1.length;
var Qt$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
var $t$1 = Qt$1.length;
function Mr(e) {
	let r = e % Zt$1, t = Xt$1[r];
	for (e = (e - r) / Zt$1; e > 0;) r = e % $t$1, t += Qt$1[r], e = (e - r) / $t$1;
	return t;
}
var xo = /^[$A-Z_][0-9A-Z_$]*$/i;
function Lr(e) {
	let r = e[0];
	return (r === "$" || r === "_" || r >= "A" && r <= "Z" || r >= "a" && r <= "z") && xo.test(e);
}
function Ne(e) {
	switch (e.t) {
		case 0: return e.s + "=" + e.v;
		case 2: return e.s + ".set(" + e.k + "," + e.v + ")";
		case 1: return e.s + ".add(" + e.v + ")";
		case 3: return e.s + ".delete(" + e.k + ")";
		case 4: return "Object.defineProperty(" + e.s + ",\"__proto__\",{value:" + e.k + ",configurable:!0,enumerable:!0,writable:!0})";
	}
}
function To(e) {
	let r = [], t = e[0];
	for (let n = 1, a = e.length, s, i = t; n < a; n++) s = e[n], s.t === 0 && s.v === i.v ? t = {
		t: 0,
		s: s.s,
		k: o$2,
		v: Ne(t)
	} : s.t === 2 && s.s === i.s ? t = {
		t: 2,
		s: Ne(t),
		k: s.k,
		v: s.v
	} : s.t === 1 && s.s === i.s ? t = {
		t: 1,
		s: Ne(t),
		k: o$2,
		v: s.v
	} : s.t === 3 && s.s === i.s ? t = {
		t: 3,
		s: Ne(t),
		k: s.k,
		v: o$2
	} : (r.push(t), t = s), i = s;
	return r.push(t), r;
}
function sn(e) {
	if (e.length) {
		let r = "", t = To(e);
		for (let n = 0, a = t.length; n < a; n++) r += Ne(t[n]) + ",";
		return r;
	}
	return o$2;
}
var Oo = "Object.create(null)";
var wo = "new Set";
var ho = "new Map";
var zo = "Promise.resolve";
var _o = "Promise.reject";
var ko = {
	3: "Object.freeze",
	2: "Object.seal",
	1: "Object.preventExtensions",
	0: o$2
};
function un(e, r) {
	return {
		mode: e,
		plugins: r.plugins,
		features: r.features,
		marked: new Set(r.markedRefs),
		stack: [],
		flags: [],
		assignments: []
	};
}
function cr(e) {
	return {
		mode: 2,
		base: un(2, e),
		state: e,
		child: o$2
	};
}
var Ur = class {
	constructor(r) {
		this._p = r;
	}
	serialize(r) {
		return f$1(this._p, r);
	}
};
function Fo(e, r) {
	let t = e.valid.get(r);
	t ?? (t = e.valid.size, e.valid.set(r, t));
	let n = e.vars[t];
	return n ?? (n = Mr(t), e.vars[t] = n), n;
}
function Bo(e) {
	return le$2 + "[" + e + "]";
}
function m$1(e, r) {
	return e.mode === 1 ? Fo(e.state, r) : Bo(r);
}
function w$1(e, r) {
	e.marked.add(r);
}
function jr(e, r) {
	return e.marked.has(r);
}
function qr(e, r, t) {
	r !== 0 && (w$1(e.base, t), e.base.flags.push({
		type: r,
		value: m$1(e, t)
	}));
}
function Vo(e) {
	let r = "";
	for (let t = 0, n = e.flags, a = n.length; t < a; t++) {
		let s = n[t];
		r += ko[s.type] + "(" + s.value + "),";
	}
	return r;
}
function ln(e) {
	let r = sn(e.assignments), t = Vo(e);
	return r ? t ? r + t : r : t;
}
function Wr(e, r, t) {
	e.assignments.push({
		t: 0,
		s: r,
		k: o$2,
		v: t
	});
}
function Mo(e, r, t) {
	e.base.assignments.push({
		t: 1,
		s: m$1(e, r),
		k: o$2,
		v: t
	});
}
function ye$1(e, r, t, n) {
	e.base.assignments.push({
		t: 2,
		s: m$1(e, r),
		k: t,
		v: n
	});
}
function en(e, r, t) {
	e.base.assignments.push({
		t: 3,
		s: m$1(e, r),
		k: t,
		v: o$2
	});
}
function be(e, r, t, n) {
	Wr(e.base, m$1(e, r) + "[" + t + "]", n);
}
function Yr(e, r, t, n) {
	if (!de$1(t)) {
		e.base.assignments.push({
			t: 4,
			s: m$1(e, r),
			k: n,
			v: o$2
		});
		return;
	}
	Wr(e.base, m$1(e, r) + "." + t, n);
}
function Lo(e, r, t, n) {
	Wr(e.base, m$1(e, r) + ".v[" + t + "]", n);
}
function F$1(e, r) {
	return r.t === 4 && e.stack.includes(r.i);
}
function ae(e, r, t) {
	return e.mode === 1 && !jr(e.base, r) ? t : m$1(e, r) + "=" + t;
}
function Uo(e) {
	return U$1 + ".get(\"" + e.s + "\")";
}
function rn(e, r, t, n) {
	return t ? F$1(e.base, t) ? (w$1(e.base, r), be(e, r, n, m$1(e, t.i)), "") : f$1(e, t) : "";
}
function jo(e, r) {
	let t = r.i, n = r.a, a = n.length;
	if (a > 0) {
		e.base.stack.push(t);
		let s = rn(e, t, n[0], 0), i = s === "";
		for (let u = 1, l; u < a; u++) l = rn(e, t, n[u], u), s += "," + l, i = l === "";
		return e.base.stack.pop(), qr(e, r.o, r.i), "[" + s + (i ? ",]" : "]");
	}
	return "[]";
}
function tn(e, r, t, n) {
	if (typeof t == "string") {
		let a = Number(t), s = a >= 0 && a.toString() === t || Lr(t);
		if (F$1(e.base, n)) {
			let i = m$1(e, n.i);
			return w$1(e.base, r.i), s && a !== a ? Yr(e, r.i, t, i) : be(e, r.i, s ? t : "\"" + t + "\"", i), "";
		}
		return de$1(t) ? (s ? t : "\"" + t + "\"") + ":" + f$1(e, n) : "[\"" + t + "\"]:" + f$1(e, n);
	}
	return "[" + f$1(e, t) + "]:" + f$1(e, n);
}
function cn(e, r, t) {
	let n = t.k, a = n.length;
	if (a > 0) {
		let s = t.v;
		e.base.stack.push(r.i);
		let i = tn(e, r, n[0], s[0]);
		for (let u = 1, l = i; u < a; u++) l = tn(e, r, n[u], s[u]), i += (l && i && ",") + l;
		return e.base.stack.pop(), "{" + i + "}";
	}
	return "{}";
}
function Yo(e, r) {
	return qr(e, r.o, r.i), cn(e, r, r.p);
}
function qo(e, r, t, n) {
	let a = cn(e, r, t);
	return a !== "{}" ? "Object.assign(" + n + "," + a + ")" : n;
}
function Wo(e, r, t, n, a) {
	let s = e.base, i = f$1(e, a), u = Number(n), l = u >= 0 && u.toString() === n || Lr(n);
	if (F$1(s, a)) l && u !== u ? Yr(e, r.i, n, i) : be(e, r.i, l ? n : "\"" + n + "\"", i);
	else {
		let g = s.assignments;
		s.assignments = t, l && u !== u ? Yr(e, r.i, n, i) : be(e, r.i, l ? n : "\"" + n + "\"", i), s.assignments = g;
	}
}
function Ko(e, r, t, n, a) {
	if (typeof n == "string") Wo(e, r, t, n, a);
	else {
		let s = e.base, i = s.stack;
		s.stack = [];
		let u = f$1(e, a);
		s.stack = i;
		let l = s.assignments;
		s.assignments = t, be(e, r.i, f$1(e, n), u), s.assignments = l;
	}
}
function Go(e, r, t) {
	let n = t.k, a = n.length;
	if (a > 0) {
		let s = [], i = t.v;
		e.base.stack.push(r.i);
		for (let u = 0; u < a; u++) Ko(e, r, s, n[u], i[u]);
		return e.base.stack.pop(), sn(s);
	}
	return o$2;
}
function Kr(e, r, t) {
	if (r.p) {
		let n = e.base;
		if (n.features & 8) t = qo(e, r, r.p, t);
		else {
			w$1(n, r.i);
			let a = Go(e, r, r.p);
			if (a) return "(" + ae(e, r.i, t) + "," + a + m$1(e, r.i) + ")";
		}
	}
	return t;
}
function Ho(e, r) {
	return qr(e, r.o, r.i), Kr(e, r, Oo);
}
function Jo(e) {
	return "new Date(\"" + e.s + "\")";
}
function Zo(e, r) {
	if (e.base.features & 32) return "/" + h$1(r.c) + "/" + r.m;
	throw new z(r);
}
function nn(e, r, t) {
	let n = e.base;
	return F$1(n, t) ? (w$1(n, r), Mo(e, r, m$1(e, t.i)), "") : f$1(e, t);
}
function $o(e, r) {
	let t = wo, n = r.a, a = n.length, s = r.i;
	if (a > 0) {
		e.base.stack.push(s);
		let i = nn(e, s, n[0]);
		for (let u = 1, l = i; u < a; u++) l = nn(e, s, n[u]), i += (l && i && ",") + l;
		e.base.stack.pop(), i && (t += "([" + i + "])");
	}
	return t;
}
function on(e, r, t, n, a) {
	let s = e.base;
	if (F$1(s, t)) {
		let i = m$1(e, t.i);
		if (w$1(s, r), F$1(s, n)) return ye$1(e, r, i, m$1(e, n.i)), "";
		if (n.t !== 4 && n.i != null && jr(s, n.i)) {
			let l = "(" + f$1(e, n) + ",[" + a + "," + a + "])";
			return ye$1(e, r, i, m$1(e, n.i)), en(e, r, a), l;
		}
		let u = s.stack;
		return s.stack = [], ye$1(e, r, i, f$1(e, n)), s.stack = u, "";
	}
	if (F$1(s, n)) {
		let i = m$1(e, n.i);
		if (w$1(s, r), t.t !== 4 && t.i != null && jr(s, t.i)) {
			let l = "(" + f$1(e, t) + ",[" + a + "," + a + "])";
			return ye$1(e, r, m$1(e, t.i), i), en(e, r, a), l;
		}
		let u = s.stack;
		return s.stack = [], ye$1(e, r, f$1(e, t), i), s.stack = u, "";
	}
	return "[" + f$1(e, t) + "," + f$1(e, n) + "]";
}
function Xo(e, r) {
	let t = ho, n = r.e.k, a = n.length, s = r.i, i = r.f, u = m$1(e, i.i), l = e.base;
	if (a > 0) {
		let g = r.e.v;
		l.stack.push(s);
		let S = on(e, s, n[0], g[0], u);
		for (let d = 1, G = S; d < a; d++) G = on(e, s, n[d], g[d], u), S += (G && S && ",") + G;
		l.stack.pop(), S && (t += "([" + S + "])");
	}
	return i.t === 26 && (w$1(l, i.i), t = "(" + f$1(e, i) + "," + t + ")"), t;
}
function Qo(e, r) {
	return W(e, r.f) + "(\"" + r.s + "\")";
}
function ea(e, r) {
	return "new " + r.c + "(" + f$1(e, r.f) + "," + r.b + "," + r.l + ")";
}
function ra(e, r) {
	return "new DataView(" + f$1(e, r.f) + "," + r.b + "," + r.l + ")";
}
function ta(e, r) {
	let t = r.i;
	e.base.stack.push(t);
	let n = Kr(e, r, "new AggregateError([],\"" + r.m + "\")");
	return e.base.stack.pop(), n;
}
function na(e, r) {
	return Kr(e, r, "new " + Ae[r.s] + "(\"" + r.m + "\")");
}
function oa(e, r) {
	let t, n = r.f, a = r.i, s = r.s ? zo : _o, i = e.base;
	if (F$1(i, n)) {
		let u = m$1(e, n.i);
		t = s + (r.s ? "().then(" + ur([], u) + ")" : "().catch(" + Jt([], "throw " + u) + ")");
	} else {
		i.stack.push(a);
		let u = f$1(e, n);
		i.stack.pop(), t = s + "(" + u + ")";
	}
	return t;
}
function aa(e, r) {
	return "Object(" + f$1(e, r.f) + ")";
}
function W(e, r) {
	let t = f$1(e, r);
	return r.t === 4 ? t : "(" + t + ")";
}
function sa(e, r) {
	if (e.mode === 1) throw new z(r);
	return "(" + ae(e, r.s, W(e, r.f) + "()") + ").p";
}
function ia(e, r) {
	if (e.mode === 1) throw new z(r);
	return W(e, r.a[0]) + "(" + m$1(e, r.i) + "," + f$1(e, r.a[1]) + ")";
}
function ua(e, r) {
	if (e.mode === 1) throw new z(r);
	return W(e, r.a[0]) + "(" + m$1(e, r.i) + "," + f$1(e, r.a[1]) + ")";
}
function la(e, r) {
	let t = e.base.plugins;
	if (t) for (let n = 0, a = t.length; n < a; n++) {
		let s = t[n];
		if (s.tag === r.c) return e.child ??= new Ur(e), s.serialize(r.s, e.child, { id: r.i });
	}
	throw new Q$1(r.c);
}
function ca(e, r) {
	let t = "", n = !1;
	return r.f.t !== 4 && (w$1(e.base, r.f.i), t = "(" + f$1(e, r.f) + ",", n = !0), t += ae(e, r.i, "(" + Et$1 + ")(" + m$1(e, r.f.i) + ")"), n && (t += ")"), t;
}
function fa(e, r) {
	return W(e, r.a[0]) + "(" + f$1(e, r.a[1]) + ")";
}
function Sa(e, r) {
	let t = r.a[0], n = r.a[1], a = e.base, s = "";
	t.t !== 4 && (w$1(a, t.i), s += "(" + f$1(e, t)), n.t !== 4 && (w$1(a, n.i), s += (s ? "," : "(") + f$1(e, n)), s && (s += ",");
	let i = ae(e, r.i, "(" + It$1 + ")(" + m$1(e, n.i) + "," + m$1(e, t.i) + ")");
	return s ? s + i + ")" : i;
}
function ma(e, r) {
	return W(e, r.a[0]) + "(" + f$1(e, r.a[1]) + ")";
}
function pa(e, r) {
	let t = ae(e, r.i, W(e, r.f) + "()"), n = r.a.length;
	if (n) {
		let a = f$1(e, r.a[0]);
		for (let s = 1; s < n; s++) a += "," + f$1(e, r.a[s]);
		return "(" + t + "," + a + "," + m$1(e, r.i) + ")";
	}
	return t;
}
function da(e, r) {
	return m$1(e, r.i) + ".next(" + f$1(e, r.f) + ")";
}
function ga(e, r) {
	return m$1(e, r.i) + ".throw(" + f$1(e, r.f) + ")";
}
function ya(e, r) {
	return m$1(e, r.i) + ".return(" + f$1(e, r.f) + ")";
}
function an(e, r, t, n) {
	let a = e.base;
	return F$1(a, n) ? (w$1(a, r), Lo(e, r, t, m$1(e, n.i)), "") : f$1(e, n);
}
function Na(e, r) {
	let t = r.a, n = t.length, a = r.i;
	if (n > 0) {
		e.base.stack.push(a);
		let s = an(e, a, 0, t[0]);
		for (let i = 1, u = s; i < n; i++) u = an(e, a, i, t[i]), s += (u && s && ",") + u;
		if (e.base.stack.pop(), s) return "{__SEROVAL_SEQUENCE__:!0,v:[" + s + "],t:" + r.s + ",d:" + r.l + "}";
	}
	return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function ba(e, r) {
	switch (r.t) {
		case 17: return nt[r.s];
		case 18: return Uo(r);
		case 9: return jo(e, r);
		case 10: return Yo(e, r);
		case 11: return Ho(e, r);
		case 5: return Jo(r);
		case 6: return Zo(e, r);
		case 7: return $o(e, r);
		case 8: return Xo(e, r);
		case 19: return Qo(e, r);
		case 16:
		case 15: return ea(e, r);
		case 20: return ra(e, r);
		case 14: return ta(e, r);
		case 13: return na(e, r);
		case 12: return oa(e, r);
		case 21: return aa(e, r);
		case 22: return sa(e, r);
		case 25: return la(e, r);
		case 26: return wt[r.s];
		case 35: return Na(e, r);
		default: throw new z(r);
	}
}
function f$1(e, r) {
	switch (r.t) {
		case 2: return at[r.s];
		case 0: return "" + r.s;
		case 1: return "\"" + r.s + "\"";
		case 3: return r.s + "n";
		case 4: return m$1(e, r.i);
		case 23: return ia(e, r);
		case 24: return ua(e, r);
		case 27: return ca(e, r);
		case 28: return fa(e, r);
		case 29: return Sa(e, r);
		case 30: return ma(e, r);
		case 31: return pa(e, r);
		case 32: return da(e, r);
		case 33: return ga(e, r);
		case 34: return ya(e, r);
		default: return ae(e, r.i, ba(e, r));
	}
}
function Sr(e, r) {
	let t = f$1(e, r), n = r.i;
	if (n == null) return t;
	let a = ln(e.base), s = m$1(e, n), i = e.state.scopeId, u = i == null ? "" : le$2, l = a ? "(" + t + "," + a + s + ")" : t;
	if (u === "") return r.t === 10 && !a ? "(" + l + ")" : l;
	let g = i == null ? "()" : "(" + le$2 + "[\"" + y$1(i) + "\"])";
	return "(" + ur([u], l) + ")" + g;
}
var Hr = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	parse(r) {
		return E$1(this._p, this.depth, r);
	}
};
var Jr = class {
	constructor(r, t) {
		this._p = r;
		this.depth = t;
	}
	parse(r) {
		return E$1(this._p, this.depth, r);
	}
	parseWithError(r) {
		return K(this._p, this.depth, r);
	}
	isAlive() {
		return this._p.state.alive;
	}
	pushPendingState() {
		et(this._p);
	}
	popPendingState() {
		ve(this._p);
	}
	onParse(r) {
		se(this._p, r);
	}
	onError(r) {
		Xr(this._p, r);
	}
	addCleanup(r) {
		this._p.state.cleanups.push(r);
	}
};
function va(e) {
	return {
		alive: !0,
		pending: 0,
		initial: !0,
		buffer: [],
		onParse: e.onParse,
		onError: e.onError,
		onDone: e.onDone,
		cleanups: []
	};
}
function Zr(e) {
	return {
		type: 2,
		base: me(2, e),
		state: va(e)
	};
}
function Ca(e, r, t) {
	let n = [];
	for (let a = 0, s = t.length; a < s; a++) a in t ? n[a] = E$1(e, r, t[a]) : n[a] = 0;
	return n;
}
function Aa(e, r, t, n) {
	return ke(t, n, Ca(e, r, n));
}
function $r(e, r, t) {
	let n = Object.entries(t), a = [], s = [];
	for (let i = 0, u = n.length; i < u; i++) a.push(y$1(n[i][0])), s.push(E$1(e, r, n[i][1]));
	return C$1 in t && (a.push(I(e.base, C$1)), s.push(je(tr(e.base), E$1(e, r, Xe(t))))), v$2 in t && (a.push(I(e.base, v$2)), s.push(Ye(nr(e.base), E$1(e, r, e.type === 1 ? re$2() : er(t))))), P$1 in t && (a.push(I(e.base, P$1)), s.push(X(t[P$1]))), R in t && (a.push(I(e.base, R)), s.push(t[R] ? J$2 : Z$1)), {
		k: a,
		v: s
	};
}
function Gr(e, r, t, n, a) {
	return or(t, n, a, $r(e, r, n));
}
function Ea(e, r, t, n) {
	return De(t, E$1(e, r, n.valueOf()));
}
function Ia(e, r, t, n) {
	return Fe(t, n, E$1(e, r, n.buffer));
}
function Ra(e, r, t, n) {
	return Be(t, n, E$1(e, r, n.buffer));
}
function Pa(e, r, t, n) {
	return Ve(t, n, E$1(e, r, n.buffer));
}
function fn(e, r, t, n) {
	let a = $(n, e.base.features);
	return Me(t, n, a ? $r(e, r, a) : o$2);
}
function xa(e, r, t, n) {
	let a = $(n, e.base.features);
	return Le(t, n, a ? $r(e, r, a) : o$2);
}
function Ta(e, r, t, n) {
	let a = [], s = [];
	for (let [i, u] of n.entries()) a.push(E$1(e, r, i)), s.push(E$1(e, r, u));
	return ar(e.base, t, a, s);
}
function Oa(e, r, t, n) {
	let a = [];
	for (let s of n.keys()) a.push(E$1(e, r, s));
	return Ue(t, a);
}
function wa(e, r, t, n) {
	let a = qe(t, D$1(e.base, 4), []);
	return e.type === 1 || (et(e), n.on({
		next: (s) => {
			if (e.state.alive) {
				let i = K(e, r, s);
				i && se(e, We(t, i));
			}
		},
		throw: (s) => {
			if (e.state.alive) {
				let i = K(e, r, s);
				i && se(e, Ke(t, i));
			}
			ve(e);
		},
		return: (s) => {
			if (e.state.alive) {
				let i = K(e, r, s);
				i && se(e, Ge(t, i));
			}
			ve(e);
		}
	})), a;
}
function ha(e, r, t) {
	if (this.state.alive) {
		let n = K(this, r, t);
		n && se(this, c$2(23, e, o$2, o$2, o$2, o$2, o$2, [D$1(this.base, 2), n], o$2, o$2, o$2, o$2)), ve(this);
	}
}
function za(e, r, t) {
	if (this.state.alive) {
		let n = K(this, r, t);
		n && se(this, c$2(24, e, o$2, o$2, o$2, o$2, o$2, [D$1(this.base, 3), n], o$2, o$2, o$2, o$2));
	}
	ve(this);
}
function _a(e, r, t, n) {
	let a = _r(e.base, {});
	return e.type === 2 && (et(e), n.then(ha.bind(e, a, r), za.bind(e, a, r))), _t(e.base, t, a);
}
function ka(e, r, t, n, a) {
	for (let s = 0, i = a.length; s < i; s++) {
		let u = a[s];
		if (u.parse.sync && u.test(n)) return ce(t, u.tag, u.parse.sync(n, new Hr(e, r), { id: t }));
	}
	return o$2;
}
function Da(e, r, t, n, a) {
	for (let s = 0, i = a.length; s < i; s++) {
		let u = a[s];
		if (u.parse.stream && u.test(n)) return ce(t, u.tag, u.parse.stream(n, new Jr(e, r), { id: t }));
	}
	return o$2;
}
function Sn(e, r, t, n) {
	let a = e.base.plugins;
	return a ? e.type === 1 ? ka(e, r, t, n, a) : Da(e, r, t, n, a) : o$2;
}
function Fa(e, r, t, n) {
	let a = [];
	for (let s = 0, i = n.v.length; s < i; s++) a[s] = E$1(e, r, n.v[s]);
	return He(t, a, n.t, n.d);
}
function Ba(e, r, t, n, a) {
	switch (a) {
		case Object: return Gr(e, r, t, n, !1);
		case o$2: return Gr(e, r, t, n, !0);
		case Date: return ze(t, n);
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return fn(e, r, t, n);
		case Number:
		case Boolean:
		case String:
		case BigInt: return Ea(e, r, t, n);
		case ArrayBuffer: return sr(e.base, t, n);
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return Ia(e, r, t, n);
		case DataView: return Pa(e, r, t, n);
		case Map: return Ta(e, r, t, n);
		case Set: return Oa(e, r, t, n);
	}
	if (a === Promise || n instanceof Promise) return _a(e, r, t, n);
	let s = e.base.features;
	if (s & 32 && a === RegExp) return _e(t, n);
	if (s & 16) switch (a) {
		case BigInt64Array:
		case BigUint64Array: return Ra(e, r, t, n);
		default: break;
	}
	if (s & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n instanceof AggregateError)) return xa(e, r, t, n);
	if (n instanceof Error) return fn(e, r, t, n);
	if (C$1 in n || v$2 in n) return Gr(e, r, t, n, !!a);
	throw new x$1(n);
}
function Va(e, r, t, n) {
	if (Array.isArray(n)) return Aa(e, r, t, n);
	if (Qe(n)) return wa(e, r, t, n);
	if ($e(n)) return Fa(e, r, t, n);
	let a = n.constructor;
	if (a === Y) return E$1(e, r, n.replacement);
	return Sn(e, r, t, n) || Ba(e, r, t, n, a);
}
function Ma(e, r, t) {
	let n = q(e.base, t);
	if (n.type !== 0) return n.value;
	let a = Sn(e, r, n.value, t);
	if (a) return a;
	throw new x$1(t);
}
function E$1(e, r, t) {
	if (r >= e.base.depthLimit) throw new M$1(e.base.depthLimit);
	switch (typeof t) {
		case "boolean": return t ? J$2 : Z$1;
		case "undefined": return Ee$1;
		case "string": return X(t);
		case "number": return we(t);
		case "bigint": return he(t);
		case "object":
			if (t) {
				let n = q(e.base, t);
				return n.type === 0 ? Va(e, r + 1, n.value, t) : n.value;
			}
			return Ie$1;
		case "symbol": return I(e.base, t);
		case "function": return Ma(e, r, t);
		default: throw new x$1(t);
	}
}
function se(e, r) {
	e.state.initial ? e.state.buffer.push(r) : Qr(e, r, !1);
}
function Xr(e, r) {
	if (e.state.onError) e.state.onError(r);
	else throw r instanceof _ ? r : new _(r);
}
function mn(e) {
	e.state.onDone && e.state.onDone();
	for (let r = 0, t = e.state.cleanups.length; r < t; r++) e.state.cleanups[r]();
}
function Qr(e, r, t) {
	try {
		e.state.onParse(r, t);
	} catch (n) {
		Xr(e, n);
	}
}
function et(e) {
	e.state.pending++;
}
function ve(e) {
	--e.state.pending <= 0 && mn(e);
}
function K(e, r, t) {
	try {
		return E$1(e, r, t);
	} catch (n) {
		return Xr(e, n), o$2;
	}
}
function rt(e, r) {
	let t = K(e, 0, r);
	t && (Qr(e, t, !0), e.state.initial = !1, La(e, e.state), e.state.pending <= 0 && mr(e));
}
function La(e, r) {
	for (let t = 0, n = r.buffer.length; t < n; t++) Qr(e, r.buffer[t], !1);
}
function mr(e) {
	e.state.alive && (mn(e), e.state.alive = !1);
}
function pn(e, r) {
	let t = A$1(r.plugins), n = Zr({
		plugins: t,
		refs: r.refs,
		disabledFeatures: r.disabledFeatures,
		onParse(a, s) {
			let i = cr({
				plugins: t,
				features: n.base.features,
				scopeId: r.scopeId,
				markedRefs: n.base.marked
			}), u;
			try {
				u = Sr(i, a);
			} catch (l) {
				r.onError && r.onError(l);
				return;
			}
			r.onSerialize(u, s);
		},
		onError: r.onError,
		onDone: r.onDone
	});
	return rt(n, e), mr.bind(null, n);
}
var pr = class {
	constructor(r) {
		this.options = r;
		this.alive = !0;
		this.flushed = !1;
		this.done = !1;
		this.pending = 0;
		this.cleanups = [];
		this.refs = /* @__PURE__ */ new Map();
		this.keys = /* @__PURE__ */ new Set();
		this.ids = 0;
		this.plugins = A$1(r.plugins);
	}
	write(r, t) {
		this.alive && !this.flushed && (this.pending++, this.keys.add(r), this.cleanups.push(pn(t, {
			plugins: this.plugins,
			scopeId: this.options.scopeId,
			refs: this.refs,
			disabledFeatures: this.options.disabledFeatures,
			onError: this.options.onError,
			onSerialize: (n, a) => {
				this.alive && this.options.onData(a ? this.options.globalIdentifier + "[\"" + y$1(r) + "\"]=" + n : n);
			},
			onDone: () => {
				this.alive && (this.pending--, this.pending <= 0 && this.flushed && !this.done && this.options.onDone && (this.options.onDone(), this.done = !0));
			}
		})));
	}
	getNextID() {
		for (; this.keys.has("" + this.ids);) this.ids++;
		return "" + this.ids;
	}
	push(r) {
		let t = this.getNextID();
		return this.write(t, r), t;
	}
	flush() {
		this.alive && (this.flushed = !0, this.pending <= 0 && !this.done && this.options.onDone && (this.options.onDone(), this.done = !0));
	}
	close() {
		if (this.alive) {
			for (let r = 0, t = this.cleanups.length; r < t; r++) this.cleanups[r]();
			!this.done && this.options.onDone && (this.options.onDone(), this.done = !0), this.alive = !1;
		}
	}
};
//#endregion
//#region ../../node_modules/seroval-plugins/node_modules/seroval/dist/esm/production/index.mjs
var L = ((i) => (i[i.AggregateError = 1] = "AggregateError", i[i.ArrowFunction = 2] = "ArrowFunction", i[i.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", i[i.ObjectAssign = 8] = "ObjectAssign", i[i.BigIntTypedArray = 16] = "BigIntTypedArray", i[i.RegExp = 32] = "RegExp", i))(L || {});
var o$1 = void 0;
Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY;
function c$1(e, r, t, n, a, s, i, u, l, g, S, d) {
	return {
		t: e,
		i: r,
		s: t,
		c: n,
		m: a,
		p: s,
		e: i,
		a: u,
		f: l,
		b: g,
		o: S,
		l: d
	};
}
function B$1(e) {
	return c$1(2, o$1, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
B$1(2);
B$1(3);
B$1(1);
B$1(0);
B$1(4);
B$1(5);
B$1(6);
B$1(7);
var U = "__SEROVAL_REFS__";
var j$1 = /* @__PURE__ */ new Map();
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, U, {
	value: j$1,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof window != "undefined" ? Object.defineProperty(window, U, {
	value: j$1,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof self != "undefined" ? Object.defineProperty(self, U, {
	value: j$1,
	configurable: !0,
	writable: !1,
	enumerable: !1
}) : typeof global != "undefined" && Object.defineProperty(global, U, {
	value: j$1,
	configurable: !0,
	writable: !1,
	enumerable: !1
});
var { toString: bs } = Object.prototype;
var ee$1 = () => {
	let e = {
		p: 0,
		s: 0,
		f: 0
	};
	return e.p = new Promise((r, t) => {
		e.s = r, e.f = t;
	}), e;
};
var In = (e, r) => {
	e.s(r), e.p.s = 1, e.p.v = r;
};
var Rn = (e, r) => {
	e.f(r), e.p.s = 2, e.p.v = r;
};
ee$1.toString();
In.toString();
Rn.toString();
var xr = () => {
	let e = [], r = [], t = !0, n = !1, a = 0, s = (l, g, S) => {
		for (S = 0; S < a; S++) r[S] && r[S][g](l);
	}, i = (l, g, S, d) => {
		for (g = 0, S = e.length; g < S; g++) d = e[g], !t && g === S - 1 ? l[n ? "return" : "throw"](d) : l.next(d);
	}, u = (l, g) => (t && (g = a++, r[g] = l), i(l), () => {
		t && (r[g] = r[a], r[a--] = void 0);
	});
	return {
		__SEROVAL_STREAM__: !0,
		on: (l) => u(l),
		next: (l) => {
			t && (e.push(l), s(l, "next"));
		},
		throw: (l) => {
			t && (e.push(l), s(l, "throw"), t = !1, n = !1, r.length = 0);
		},
		return: (l) => {
			t && (e.push(l), s(l, "return"), t = !1, n = !0, r.length = 0);
		}
	};
};
xr.toString();
var Tr = (e) => (r) => () => {
	let t = 0, n = {
		[e]: () => n,
		next: () => {
			if (t > r.d) return {
				done: !0,
				value: void 0
			};
			let a = t++, s = r.v[a];
			if (a === r.t) throw s;
			return {
				done: a === r.d,
				value: s
			};
		}
	};
	return n;
};
Tr.toString();
var Or = (e, r) => (t) => () => {
	let n = 0, a = -1, s = !1, i = [], u = [], l = (S = 0, d = u.length) => {
		for (; S < d; S++) u[S].s({
			done: !0,
			value: void 0
		});
	};
	t.on({
		next: (S) => {
			let d = u.shift();
			d && d.s({
				done: !1,
				value: S
			}), i.push(S);
		},
		throw: (S) => {
			let d = u.shift();
			d && d.f(S), l(), a = i.length, s = !0, i.push(S);
		},
		return: (S) => {
			let d = u.shift();
			d && d.s({
				done: !0,
				value: S
			}), l(), a = i.length, i.push(S);
		}
	});
	let g = {
		[e]: () => g,
		next: () => {
			if (a === -1) {
				let G = n++;
				if (G >= i.length) {
					let tt = r();
					return u.push(tt), tt.p;
				}
				return {
					done: !1,
					value: i[G]
				};
			}
			if (n > a) return {
				done: !0,
				value: void 0
			};
			let S = n++, d = i[S];
			if (S !== a) return {
				done: !1,
				value: d
			};
			if (s) throw d;
			return {
				done: !0,
				value: d
			};
		}
	};
	return g;
};
Or.toString();
var wr = (e) => {
	let r = atob(e), t = r.length, n = new Uint8Array(t);
	for (let a = 0; a < t; a++) n[a] = r.charCodeAt(a);
	return n.buffer;
};
wr.toString();
function re$1() {
	return xr();
}
var oe$1 = ((t) => (t[t.Vanilla = 1] = "Vanilla", t[t.Cross = 2] = "Cross", t))(oe$1 || {});
function ai(e) {
	return e;
}
var Ro = () => T;
var Po = Ro.toString();
/=>/.test(Po);
//#endregion
//#region ../../node_modules/seroval-plugins/dist/esm/production/web.mjs
var u = (e) => {
	let r = new AbortController(), a = r.abort.bind(r);
	return e.then(a, a), r;
};
function D(e) {
	e(this.reason);
}
function F(e) {
	this.addEventListener("abort", D.bind(this, e), { once: !0 });
}
function g(e) {
	return new Promise(F.bind(e));
}
var n = {};
var O = ai({
	tag: "seroval-plugins/web/AbortSignal",
	extends: [ai({
		tag: "seroval-plugins/web/AbortControllerFactoryPlugin",
		test(e) {
			return e === n;
		},
		parse: {
			sync() {
				return n;
			},
			async async() {
				return await Promise.resolve(n);
			},
			stream() {
				return n;
			}
		},
		serialize() {
			return u.toString();
		},
		deserialize() {
			return u;
		}
	})],
	test(e) {
		return typeof AbortSignal == "undefined" ? !1 : e instanceof AbortSignal;
	},
	parse: {
		sync(e, r) {
			return e.aborted ? { reason: r.parse(e.reason) } : {};
		},
		async async(e, r) {
			if (e.aborted) return { reason: await r.parse(e.reason) };
			let a = await g(e);
			return { reason: await r.parse(a) };
		},
		stream(e, r) {
			if (e.aborted) return { reason: r.parse(e.reason) };
			let a = g(e);
			return {
				factory: r.parse(n),
				controller: r.parse(a)
			};
		}
	},
	serialize(e, r) {
		return e.reason ? "AbortSignal.abort(" + r.serialize(e.reason) + ")" : e.controller && e.factory ? "(" + r.serialize(e.factory) + ")(" + r.serialize(e.controller) + ").signal" : "(new AbortController).signal";
	},
	deserialize(e, r) {
		return e.reason ? AbortSignal.abort(r.deserialize(e.reason)) : e.controller ? u(r.deserialize(e.controller)).signal : new AbortController().signal;
	}
});
function d(e) {
	return {
		detail: e.detail,
		bubbles: e.bubbles,
		cancelable: e.cancelable,
		composed: e.composed
	};
}
var M = ai({
	tag: "seroval-plugins/web/CustomEvent",
	test(e) {
		return typeof CustomEvent == "undefined" ? !1 : e instanceof CustomEvent;
	},
	parse: {
		sync(e, r) {
			return {
				type: r.parse(e.type),
				options: r.parse(d(e))
			};
		},
		async async(e, r) {
			return {
				type: await r.parse(e.type),
				options: await r.parse(d(e))
			};
		},
		stream(e, r) {
			return {
				type: r.parse(e.type),
				options: r.parse(d(e))
			};
		}
	},
	serialize(e, r) {
		return "new CustomEvent(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
	},
	deserialize(e, r) {
		return new CustomEvent(r.deserialize(e.type), r.deserialize(e.options));
	}
});
var H = ai({
	tag: "seroval-plugins/web/DOMException",
	test(e) {
		return typeof DOMException == "undefined" ? !1 : e instanceof DOMException;
	},
	parse: {
		sync(e, r) {
			return {
				name: r.parse(e.name),
				message: r.parse(e.message)
			};
		},
		async async(e, r) {
			return {
				name: await r.parse(e.name),
				message: await r.parse(e.message)
			};
		},
		stream(e, r) {
			return {
				name: r.parse(e.name),
				message: r.parse(e.message)
			};
		}
	},
	serialize(e, r) {
		return "new DOMException(" + r.serialize(e.message) + "," + r.serialize(e.name) + ")";
	},
	deserialize(e, r) {
		return new DOMException(r.deserialize(e.message), r.deserialize(e.name));
	}
});
function f(e) {
	return {
		bubbles: e.bubbles,
		cancelable: e.cancelable,
		composed: e.composed
	};
}
var j = ai({
	tag: "seroval-plugins/web/Event",
	test(e) {
		return typeof Event == "undefined" ? !1 : e instanceof Event;
	},
	parse: {
		sync(e, r) {
			return {
				type: r.parse(e.type),
				options: r.parse(f(e))
			};
		},
		async async(e, r) {
			return {
				type: await r.parse(e.type),
				options: await r.parse(f(e))
			};
		},
		stream(e, r) {
			return {
				type: r.parse(e.type),
				options: r.parse(f(e))
			};
		}
	},
	serialize(e, r) {
		return "new Event(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
	},
	deserialize(e, r) {
		return new Event(r.deserialize(e.type), r.deserialize(e.options));
	}
});
var m = ai({
	tag: "seroval-plugins/web/File",
	test(e) {
		return typeof File == "undefined" ? !1 : e instanceof File;
	},
	parse: { async async(e, r) {
		return {
			name: await r.parse(e.name),
			options: await r.parse({
				type: e.type,
				lastModified: e.lastModified
			}),
			buffer: await r.parse(await e.arrayBuffer())
		};
	} },
	serialize(e, r) {
		return "new File([" + r.serialize(e.buffer) + "]," + r.serialize(e.name) + "," + r.serialize(e.options) + ")";
	},
	deserialize(e, r) {
		return new File([r.deserialize(e.buffer)], r.deserialize(e.name), r.deserialize(e.options));
	}
});
function y(e) {
	let r = [];
	return e.forEach((a, t) => {
		r.push([t, a]);
	}), r;
}
var s = {};
var v = (e, r = new FormData(), a = 0, t = e.length, p) => {
	for (; a < t; a++) p = e[a], r.append(p[0], p[1]);
	return r;
};
var Q = ai({
	tag: "seroval-plugins/web/FormData",
	extends: [m, ai({
		tag: "seroval-plugins/web/FormDataFactory",
		test(e) {
			return e === s;
		},
		parse: {
			sync() {
				return s;
			},
			async async() {
				return await Promise.resolve(s);
			},
			stream() {
				return s;
			}
		},
		serialize() {
			return v.toString();
		},
		deserialize() {
			return s;
		}
	})],
	test(e) {
		return typeof FormData == "undefined" ? !1 : e instanceof FormData;
	},
	parse: {
		sync(e, r) {
			return {
				factory: r.parse(s),
				entries: r.parse(y(e))
			};
		},
		async async(e, r) {
			return {
				factory: await r.parse(s),
				entries: await r.parse(y(e))
			};
		},
		stream(e, r) {
			return {
				factory: r.parse(s),
				entries: r.parse(y(e))
			};
		}
	},
	serialize(e, r) {
		return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.entries) + ")";
	},
	deserialize(e, r) {
		return v(r.deserialize(e.entries));
	}
});
function c(e) {
	let r = [];
	return e.forEach((a, t) => {
		r.push([t, a]);
	}), r;
}
var i = ai({
	tag: "seroval-plugins/web/Headers",
	test(e) {
		return typeof Headers == "undefined" ? !1 : e instanceof Headers;
	},
	parse: {
		sync(e, r) {
			return { value: r.parse(c(e)) };
		},
		async async(e, r) {
			return { value: await r.parse(c(e)) };
		},
		stream(e, r) {
			return { value: r.parse(c(e)) };
		}
	},
	serialize(e, r) {
		return "new Headers(" + r.serialize(e.value) + ")";
	},
	deserialize(e, r) {
		return new Headers(r.deserialize(e.value));
	}
});
var o = {};
var P = (e) => new ReadableStream({ start: (r) => {
	e.on({
		next: (a) => {
			try {
				r.enqueue(a);
			} catch (t) {}
		},
		throw: (a) => {
			r.error(a);
		},
		return: () => {
			try {
				r.close();
			} catch (a) {}
		}
	});
} });
var ee = ai({
	tag: "seroval-plugins/web/ReadableStreamFactory",
	test(e) {
		return e === o;
	},
	parse: {
		sync() {
			return o;
		},
		async async() {
			return await Promise.resolve(o);
		},
		stream() {
			return o;
		}
	},
	serialize() {
		return P.toString();
	},
	deserialize() {
		return o;
	}
});
async function N(e, r) {
	try {
		let a = await r.read();
		a.done ? (e.return(a.value), r.releaseLock()) : (e.next(a.value), await N(e, r));
	} catch (a) {
		e.throw(a);
	}
}
function re(e) {
	e.cancel().catch(() => {}), e.releaseLock();
}
function w(e) {
	let r = re$1(), a = e.getReader(), t = re.bind(null, a);
	return N(r, a).catch(t), [r, t];
}
var l = ai({
	tag: "seroval/plugins/web/ReadableStream",
	extends: [ee],
	test(e) {
		return typeof ReadableStream == "undefined" ? !1 : e instanceof ReadableStream;
	},
	parse: {
		sync(e, r) {
			return {
				factory: r.parse(o),
				stream: r.parse(re$1())
			};
		},
		async async(e, r) {
			return {
				factory: await r.parse(o),
				stream: await r.parse(w(e)[0])
			};
		},
		stream(e, r) {
			let [a, t] = w(e);
			return r.addCleanup(t), {
				factory: r.parse(o),
				stream: r.parse(a)
			};
		}
	},
	serialize(e, r) {
		return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
	},
	deserialize(e, r) {
		return P(r.deserialize(e.stream));
	}
});
function h(e, r) {
	return {
		body: r,
		cache: e.cache,
		credentials: e.credentials,
		headers: e.headers,
		integrity: e.integrity,
		keepalive: e.keepalive,
		method: e.method,
		mode: e.mode,
		redirect: e.redirect,
		referrer: e.referrer,
		referrerPolicy: e.referrerPolicy
	};
}
var oe = ai({
	tag: "seroval-plugins/web/Request",
	extends: [l, i],
	test(e) {
		return typeof Request == "undefined" ? !1 : e instanceof Request;
	},
	parse: {
		async async(e, r) {
			return {
				url: await r.parse(e.url),
				options: await r.parse(h(e, e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null))
			};
		},
		stream(e, r) {
			return {
				url: r.parse(e.url),
				options: r.parse(h(e, e.body && !e.bodyUsed ? e.clone().body : null))
			};
		}
	},
	serialize(e, r) {
		return "new Request(" + r.serialize(e.url) + "," + r.serialize(e.options) + ")";
	},
	deserialize(e, r) {
		return new Request(r.deserialize(e.url), r.deserialize(e.options));
	}
});
function E(e) {
	return {
		headers: e.headers,
		status: e.status,
		statusText: e.statusText
	};
}
var le = ai({
	tag: "seroval-plugins/web/Response",
	extends: [l, i],
	test(e) {
		return typeof Response == "undefined" ? !1 : e instanceof Response;
	},
	parse: {
		async async(e, r) {
			return {
				body: await r.parse(e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null),
				options: await r.parse(E(e))
			};
		},
		stream(e, r) {
			return {
				body: r.parse(e.body && !e.bodyUsed ? e.clone().body : null),
				options: r.parse(E(e))
			};
		}
	},
	serialize(e, r) {
		return "new Response(" + r.serialize(e.body) + "," + r.serialize(e.options) + ")";
	},
	deserialize(e, r) {
		return new Response(r.deserialize(e.body), r.deserialize(e.options));
	}
});
var de = ai({
	tag: "seroval-plugins/web/URL",
	test(e) {
		return typeof URL == "undefined" ? !1 : e instanceof URL;
	},
	parse: {
		sync(e, r) {
			return { value: r.parse(e.href) };
		},
		async async(e, r) {
			return { value: await r.parse(e.href) };
		},
		stream(e, r) {
			return { value: r.parse(e.href) };
		}
	},
	serialize(e, r) {
		return "new URL(" + r.serialize(e.value) + ")";
	},
	deserialize(e, r) {
		return new URL(r.deserialize(e.value));
	}
});
var ye = ai({
	tag: "seroval-plugins/web/URLSearchParams",
	test(e) {
		return typeof URLSearchParams == "undefined" ? !1 : e instanceof URLSearchParams;
	},
	parse: {
		sync(e, r) {
			return { value: r.parse(e.toString()) };
		},
		async async(e, r) {
			return { value: await r.parse(e.toString()) };
		},
		stream(e, r) {
			return { value: r.parse(e.toString()) };
		}
	},
	serialize(e, r) {
		return "new URLSearchParams(" + r.serialize(e.value) + ")";
	},
	deserialize(e, r) {
		return new URLSearchParams(r.deserialize(e.value));
	}
});
//#endregion
//#region ../../node_modules/solid-js/web/dist/server.js
var booleans = [
	"allowfullscreen",
	"async",
	"alpha",
	"autofocus",
	"autoplay",
	"checked",
	"controls",
	"default",
	"disabled",
	"formnovalidate",
	"hidden",
	"indeterminate",
	"inert",
	"ismap",
	"loop",
	"multiple",
	"muted",
	"nomodule",
	"novalidate",
	"open",
	"playsinline",
	"readonly",
	"required",
	"reversed",
	"seamless",
	"selected",
	"adauctionheaders",
	"browsingtopics",
	"credentialless",
	"defaultchecked",
	"defaultmuted",
	"defaultselected",
	"defer",
	"disablepictureinpicture",
	"disableremoteplayback",
	"preservespitch",
	"shadowrootclonable",
	"shadowrootcustomelementregistry",
	"shadowrootdelegatesfocus",
	"shadowrootserializable",
	"sharedstoragewritable"
];
var BooleanAttributes = /*#__PURE__*/ new Set(booleans);
[...booleans];
var ChildProperties = /*#__PURE__*/ new Set([
	"innerHTML",
	"textContent",
	"innerText",
	"children"
]);
var Aliases = /*#__PURE__*/ Object.assign(Object.create(null), {
	className: "class",
	htmlFor: "for"
});
var ES2017FLAG = L$1.AggregateError | L$1.BigIntTypedArray;
var GLOBAL_IDENTIFIER = "_$HY.r";
function createSerializer({ onData, onDone, scopeId, onError, plugins: customPlugins }) {
	const defaultPlugins = [
		O,
		M,
		H,
		j,
		Q,
		i,
		l,
		oe,
		le,
		ye,
		de
	];
	return new pr({
		scopeId,
		plugins: customPlugins ? [...customPlugins, ...defaultPlugins] : defaultPlugins,
		globalIdentifier: GLOBAL_IDENTIFIER,
		disabledFeatures: ES2017FLAG,
		onData,
		onDone,
		onError
	});
}
function getLocalHeaderScript(id) {
	return yn(id) + ";";
}
var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
var REPLACE_SCRIPT = `function $df(e,n,o,t){if(n=document.getElementById(e),o=document.getElementById("pl-"+e)){for(;o&&8!==o.nodeType&&o.nodeValue!=="pl-"+e;)t=o.nextSibling,o.remove(),o=t;_$HY.done?o.remove():o.replaceWith(n.content)}n.remove(),_$HY.fe(e)}`;
function renderToStream(code, options = {}) {
	let { nonce, onCompleteShell, onCompleteAll, renderId, noScripts } = options;
	let dispose;
	const blockingPromises = [];
	const pushTask = (task) => {
		if (noScripts) return;
		if (!tasks && !firstFlushed) tasks = getLocalHeaderScript(renderId);
		tasks += task + ";";
		if (!timer && firstFlushed) timer = setTimeout(writeTasks);
	};
	const onDone = () => {
		writeTasks();
		doShell();
		onCompleteAll && onCompleteAll({ write(v) {
			!completed && buffer.write(v);
		} });
		writable && writable.end();
		completed = true;
		if (firstFlushed) dispose();
	};
	const serializer = createSerializer({
		scopeId: options.renderId,
		plugins: options.plugins,
		onData: pushTask,
		onDone,
		onError: options.onError
	});
	const flushEnd = () => {
		if (!registry.size) queue(() => queue(() => serializer.flush()));
	};
	const registry = /* @__PURE__ */ new Map();
	const writeTasks = () => {
		if (tasks.length && !completed && firstFlushed) {
			buffer.write(`<script${nonce ? ` nonce="${nonce}"` : ""}>${tasks}<\/script>`);
			tasks = "";
		}
		timer && clearTimeout(timer);
		timer = null;
	};
	let context;
	let writable;
	let tmp = "";
	let tasks = "";
	let firstFlushed = false;
	let completed = false;
	let shellCompleted = false;
	let scriptFlushed = false;
	let timer = null;
	let buffer = { write(payload) {
		tmp += payload;
	} };
	sharedConfig.context = context = {
		id: renderId || "",
		count: 0,
		async: true,
		resources: {},
		lazy: {},
		suspense: {},
		assets: [],
		nonce,
		block(p) {
			if (!firstFlushed) blockingPromises.push(p);
		},
		replace(id, payloadFn) {
			if (firstFlushed) return;
			const placeholder = `<!--!$${id}-->`;
			const first = html.indexOf(placeholder);
			if (first === -1) return;
			const last = html.indexOf(`<!--!$/${id}-->`, first + placeholder.length);
			html = html.slice(0, first) + resolveSSRNode(escape(payloadFn())) + html.slice(last + placeholder.length + 1);
		},
		serialize(id, p, wait) {
			const serverOnly = sharedConfig.context.noHydrate;
			if (!firstFlushed && wait && typeof p === "object" && "then" in p) {
				blockingPromises.push(p);
				!serverOnly && p.then((d) => {
					serializer.write(id, d);
				}).catch((e) => {
					serializer.write(id, e);
				});
			} else if (!serverOnly) serializer.write(id, p);
		},
		roots: 0,
		nextRoot() {
			return this.renderId + "i-" + this.roots++;
		},
		registerFragment(key) {
			if (!registry.has(key)) {
				let resolve, reject;
				const p = new Promise((r, rej) => (resolve = r, reject = rej));
				registry.set(key, (err) => queue(() => queue(() => {
					err ? reject(err) : resolve(true);
					queue(flushEnd);
				})));
				serializer.write(key, p);
			}
			return (value, error) => {
				if (registry.has(key)) {
					const resolve = registry.get(key);
					registry.delete(key);
					if (waitForFragments(registry, key)) {
						resolve();
						return;
					}
					if (!completed) if (!firstFlushed) {
						queue(() => html = replacePlaceholder(html, key, value !== void 0 ? value : ""));
						resolve(error);
					} else {
						buffer.write(`<template id="${key}">${value !== void 0 ? value : " "}</template>`);
						pushTask(`$df("${key}")${!scriptFlushed ? ";" + REPLACE_SCRIPT : ""}`);
						resolve(error);
						scriptFlushed = true;
					}
				}
				return firstFlushed;
			};
		}
	};
	let html = createRoot((d) => {
		dispose = d;
		return resolveSSRNode(escape(code()));
	});
	function doShell() {
		if (shellCompleted) return;
		sharedConfig.context = context;
		context.noHydrate = true;
		html = injectAssets(context.assets, html);
		if (tasks.length) html = injectScripts(html, tasks, nonce);
		buffer.write(html);
		tasks = "";
		onCompleteShell && onCompleteShell({ write(v) {
			!completed && buffer.write(v);
		} });
		shellCompleted = true;
	}
	return {
		then(fn) {
			function complete() {
				dispose();
				fn(tmp);
			}
			if (onCompleteAll) {
				let ogComplete = onCompleteAll;
				onCompleteAll = (options) => {
					ogComplete(options);
					complete();
				};
			} else onCompleteAll = complete;
			queue(flushEnd);
		},
		pipe(w) {
			allSettled(blockingPromises).then(() => {
				setTimeout(() => {
					doShell();
					buffer = writable = w;
					buffer.write(tmp);
					firstFlushed = true;
					if (completed) {
						dispose();
						writable.end();
					} else flushEnd();
				});
			});
		},
		pipeTo(w) {
			return allSettled(blockingPromises).then(() => {
				let resolve;
				const p = new Promise((r) => resolve = r);
				setTimeout(() => {
					doShell();
					const encoder = new TextEncoder();
					const writer = w.getWriter();
					writable = { end() {
						writer.releaseLock();
						w.close().catch(() => {});
						resolve();
					} };
					buffer = { write(payload) {
						writer.write(encoder.encode(payload)).catch(() => {});
					} };
					buffer.write(tmp);
					firstFlushed = true;
					if (completed) {
						dispose();
						writable.end();
					} else flushEnd();
				});
				return p;
			});
		}
	};
}
function HydrationScript(props) {
	const { nonce } = sharedConfig.context;
	return ssr(generateHydrationScript({
		nonce,
		...props
	}));
}
function ssr(t, ...nodes) {
	if (nodes.length) {
		let result = "";
		for (let i = 0; i < nodes.length; i++) {
			result += t[i];
			const node = nodes[i];
			if (node !== void 0) result += resolveSSRNode(node);
		}
		t = result + t[nodes.length];
	}
	return { t };
}
function ssrClassList(value) {
	if (!value) return "";
	let classKeys = Object.keys(value), result = "";
	for (let i = 0, len = classKeys.length; i < len; i++) {
		const key = classKeys[i], classValue = !!value[key];
		if (!key || key === "undefined" || !classValue) continue;
		i && (result += " ");
		result += escape(key);
	}
	return result;
}
function ssrStyle(value) {
	if (!value) return "";
	if (typeof value === "string") return escape(value, true);
	let result = "";
	const k = Object.keys(value);
	for (let i = 0; i < k.length; i++) {
		const s = k[i];
		const v = value[s];
		if (v != void 0) {
			if (i) result += ";";
			const r = escape(v, true);
			if (r != void 0 && r !== "undefined") result += `${s}:${r}`;
		}
	}
	return result;
}
function ssrStyleProperty(name, value) {
	return value != null ? name + value : "";
}
function ssrElement(tag, props, children, needsId) {
	if (props == null) props = {};
	else if (typeof props === "function") props = props();
	const skipChildren = VOID_ELEMENTS.test(tag);
	const keys = Object.keys(props);
	let result = `<${tag}${needsId ? ssrHydrationKey() : ""} `;
	let classResolved;
	for (let i = 0; i < keys.length; i++) {
		const prop = keys[i];
		if (ChildProperties.has(prop)) {
			if (children === void 0 && !skipChildren) children = tag === "script" || tag === "style" || prop === "innerHTML" ? props[prop] : escape(props[prop]);
			continue;
		}
		const value = props[prop];
		if (prop === "style") result += `style="${ssrStyle(value)}"`;
		else if (prop === "class" || prop === "className" || prop === "classList") {
			if (classResolved) continue;
			let n;
			result += `class="${escape(((n = props.class) ? n + " " : "") + ((n = props.className) ? n + " " : ""), true) + ssrClassList(props.classList)}"`;
			classResolved = true;
		} else if (BooleanAttributes.has(prop)) if (value) result += prop;
		else continue;
		else if (value == void 0 || prop === "ref" || prop.slice(0, 2) === "on" || prop.slice(0, 5) === "prop:") continue;
		else if (prop.slice(0, 5) === "bool:") {
			if (!value) continue;
			result += escape(prop.slice(5));
		} else if (prop.slice(0, 5) === "attr:") result += `${escape(prop.slice(5))}="${escape(value, true)}"`;
		else result += `${Aliases[prop] || escape(prop)}="${escape(value, true)}"`;
		if (i !== keys.length - 1) result += " ";
	}
	if (skipChildren) return { t: result + "/>" };
	if (typeof children === "function") children = children();
	return { t: result + `>${resolveSSRNode(children, true)}</${tag}>` };
}
function ssrAttribute(key, value, isBoolean) {
	return isBoolean ? value ? " " + key : "" : value != null ? ` ${key}="${value}"` : "";
}
function ssrHydrationKey() {
	const hk = getHydrationKey();
	return hk ? ` data-hk="${hk}"` : "";
}
function escape(s, attr) {
	const t = typeof s;
	if (t !== "string") {
		if (!attr && t === "function") return escape(s());
		if (!attr && Array.isArray(s)) {
			s = s.slice();
			for (let i = 0; i < s.length; i++) s[i] = escape(s[i]);
			return s;
		}
		if (attr && t === "boolean") return String(s);
		return s;
	}
	const delim = attr ? "\"" : "<";
	const escDelim = attr ? "&quot;" : "&lt;";
	let iDelim = s.indexOf(delim);
	let iAmp = s.indexOf("&");
	if (iDelim < 0 && iAmp < 0) return s;
	let left = 0, out = "";
	while (iDelim >= 0 && iAmp >= 0) if (iDelim < iAmp) {
		if (left < iDelim) out += s.substring(left, iDelim);
		out += escDelim;
		left = iDelim + 1;
		iDelim = s.indexOf(delim, left);
	} else {
		if (left < iAmp) out += s.substring(left, iAmp);
		out += "&amp;";
		left = iAmp + 1;
		iAmp = s.indexOf("&", left);
	}
	if (iDelim >= 0) do {
		if (left < iDelim) out += s.substring(left, iDelim);
		out += escDelim;
		left = iDelim + 1;
		iDelim = s.indexOf(delim, left);
	} while (iDelim >= 0);
	else while (iAmp >= 0) {
		if (left < iAmp) out += s.substring(left, iAmp);
		out += "&amp;";
		left = iAmp + 1;
		iAmp = s.indexOf("&", left);
	}
	return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node, top) {
	const t = typeof node;
	if (t === "string") return node;
	if (node == null || t === "boolean") return "";
	if (Array.isArray(node)) {
		let prev = {};
		let mapped = "";
		for (let i = 0, len = node.length; i < len; i++) {
			if (!top && typeof prev !== "object" && typeof node[i] !== "object") mapped += `<!--!$-->`;
			mapped += resolveSSRNode(prev = node[i]);
		}
		return mapped;
	}
	if (t === "object") return node.t;
	if (t === "function") return resolveSSRNode(node());
	return String(node);
}
function getHydrationKey() {
	const hydrate = sharedConfig.context;
	return hydrate && !hydrate.noHydrate && sharedConfig.getNextContextId();
}
function useAssets(fn) {
	sharedConfig.context.assets.push(() => resolveSSRNode(escape(fn())));
}
function generateHydrationScript({ eventNames = ["click", "input"], nonce } = {}) {
	return `<script${nonce ? ` nonce="${nonce}"` : ""}>window._$HY||(e=>{let t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host.nodeType?e.host:e.parentNode));["${eventNames.join("\", \"")}"].forEach((o=>document.addEventListener(o,(o=>{if(!e.events)return;let s=t(o.composedPath&&o.composedPath()[0]||o.target);s&&!e.completed.has(s)&&e.events.push([s,o])}))))})(_$HY={events:[],completed:new WeakSet,r:{},fe(){}});<\/script><!--xs-->`;
}
function NoHydration(props) {
	if (sharedConfig.context) sharedConfig.context.noHydrate = true;
	return props.children;
}
function queue(fn) {
	return Promise.resolve().then(fn);
}
function allSettled(promises) {
	let length = promises.length;
	return Promise.allSettled(promises).then(() => {
		if (promises.length !== length) return allSettled(promises);
	});
}
function injectAssets(assets, html) {
	if (!assets || !assets.length) return html;
	let out = "";
	for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
	const index = html.indexOf("</head>");
	if (index === -1) return html;
	return html.slice(0, index) + out + html.slice(index);
}
function injectScripts(html, scripts, nonce) {
	const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}<\/script>`;
	const index = html.indexOf("<!--xs-->");
	if (index > -1) return html.slice(0, index) + tag + html.slice(index);
	return html + tag;
}
function waitForFragments(registry, key) {
	for (const k of [...registry.keys()].reverse()) if (key.startsWith(k)) return true;
	return false;
}
function replacePlaceholder(html, key, value) {
	const marker = `<template id="pl-${key}">`;
	const close = `<!--pl-${key}-->`;
	const first = html.indexOf(marker);
	if (first === -1) return html;
	const last = html.indexOf(close, first + marker.length);
	return html.slice(0, first) + value + html.slice(last + close.length);
}
function notSup() {
	throw new Error("Client-only API called on the server side. Run client-only code in onMount, or conditionally run client-only component with <Show>.");
}
function createDynamic(component, props) {
	const comp = component(), t = typeof comp;
	if (comp) {
		if (t === "function") return comp(props);
		else if (t === "string") return ssrElement(comp, props, void 0, true);
	}
}
function Dynamic(props) {
	const [, others] = splitProps(props, ["component"]);
	return createDynamic(() => props.component, others);
}
//#endregion
//#region ../../node_modules/@solid-primitives/utils/dist/index.js
/**
* Returns a function that will call all functions in the order they were chained with the same arguments.
*/
function chain(callbacks) {
	return (...args) => {
		for (const callback of callbacks) callback && callback(...args);
	};
}
//#endregion
//#region ../../node_modules/@solid-primitives/refs/dist/index.js
/**
* Utility for chaining multiple `ref` assignments with `props.ref` forwarding.
* @param refs list of ref setters. Can be a `props.ref` prop for ref forwarding or a setter to a local variable (`el => ref = el`).
* @example
* ```tsx
* interface ButtonProps {
*    ref?: Ref<HTMLButtonElement>
* }
* function Button (props: ButtonProps) {
*    let ref: HTMLButtonElement | undefined
*    onMount(() => {
*        // use the local ref
*    })
*    return <button ref={mergeRefs(props.ref, el => ref = el)} />
* }
*
* // in consumer's component:
* let ref: HTMLButtonElement | undefined
* <Button ref={ref} />
* ```
*/
function mergeRefs(...refs) {
	return chain(refs);
}
//#endregion
export { createUniqueId as A, useTransition as B, createContext as C, createResource as D, createRenderEffect as E, sharedConfig as F, splitProps as I, startTransition as L, on$1 as M, onCleanup as N, createRoot as O, onMount as P, untrack as R, createComputed as S, createMemo as T, Show as _, escape as a, batch as b, ssr as c, ssrHydrationKey as d, ssrStyleProperty as f, Match as g, For as h, NoHydration as i, mergeProps as j, createSignal as k, ssrAttribute as l, ErrorBoundary as m, Dynamic as n, notSup as o, useAssets as p, HydrationScript as r, renderToStream as s, mergeRefs as t, ssrElement as u, Suspense as v, createEffect as w, createComponent as x, Switch as y, useContext as z };
