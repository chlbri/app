import { r as parseHref } from "../tanstack__history.mjs";
import "node:stream";
import { ReadableStream as ReadableStream$1 } from "node:stream/web";
//#region ../../node_modules/@tanstack/router-core/dist/esm/utils.js
/**
* Return the last element of an array.
* Intended for non-empty arrays used within router internals.
*/
function last(arr) {
	return arr[arr.length - 1];
}
function isFunction(d) {
	return typeof d === "function";
}
/**
* Apply a value-or-updater to a previous value.
* Accepts either a literal value or a function of the previous value.
*/
function functionalUpdate(updater, previous) {
	if (isFunction(updater)) return updater(previous);
	return updater;
}
var hasOwn = Object.prototype.hasOwnProperty;
function hasKeys(obj) {
	for (const key in obj) if (hasOwn.call(obj, key)) return true;
	return false;
}
var createNull = () => Object.create(null);
var nullReplaceEqualDeep = (prev, next) => replaceEqualDeep(prev, next, createNull);
/**
* This function returns `prev` if `_next` is deeply equal.
* If not, it will replace any deeply equal children of `b` with those of `a`.
* This can be used for structural sharing between immutable JSON values for example.
* Do not use this with signals
*/
function replaceEqualDeep(prev, _next, _makeObj = () => ({}), _depth = 0) {
	return _next;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return false;
	const ctor = o.constructor;
	if (typeof ctor === "undefined") return true;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
/**
* Perform a deep equality check with options for partial comparison and
* ignoring `undefined` values. Optimized for router state comparisons.
*/
function deepEqual(a, b, opts) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0, l = a.length; i < l; i++) if (!deepEqual(a[i], b[i], opts)) return false;
		return true;
	}
	if (isPlainObject(a) && isPlainObject(b)) {
		const ignoreUndefined = opts?.ignoreUndefined ?? true;
		if (opts?.partial) {
			for (const k in b) if (!ignoreUndefined || b[k] !== void 0) {
				if (!deepEqual(a[k], b[k], opts)) return false;
			}
			return true;
		}
		let aCount = 0;
		if (!ignoreUndefined) aCount = Object.keys(a).length;
		else for (const k in a) if (a[k] !== void 0) aCount++;
		let bCount = 0;
		for (const k in b) if (!ignoreUndefined || b[k] !== void 0) {
			bCount++;
			if (bCount > aCount || !deepEqual(a[k], b[k], opts)) return false;
		}
		return aCount === bCount;
	}
	return false;
}
/**
* Create a promise with exposed resolve/reject and status fields.
* Useful for coordinating async router lifecycle operations.
*/
function createControlledPromise(onResolve) {
	let resolveLoadPromise;
	let rejectLoadPromise;
	const controlledPromise = new Promise((resolve, reject) => {
		resolveLoadPromise = resolve;
		rejectLoadPromise = reject;
	});
	controlledPromise.status = "pending";
	controlledPromise.resolve = (value) => {
		controlledPromise.status = "resolved";
		controlledPromise.value = value;
		resolveLoadPromise(value);
		onResolve?.(value);
	};
	controlledPromise.reject = (e) => {
		controlledPromise.status = "rejected";
		rejectLoadPromise(e);
	};
	return controlledPromise;
}
/**
* Heuristically detect dynamic import "module not found" errors
* across major browsers for lazy route component handling.
*/
function isModuleNotFoundError(error) {
	if (typeof error?.message !== "string") return false;
	return error.message.startsWith("Failed to fetch dynamically imported module") || error.message.startsWith("error loading dynamically imported module") || error.message.startsWith("Importing a module script failed");
}
function isPromise(value) {
	return Boolean(value && typeof value === "object" && typeof value.then === "function");
}
/**
* Re-encode characters that are unsafe in URL paths.
* Includes ASCII control characters (0x00-0x1F, 0x7F) and a subset of the
* WHATWG URL "path percent-encode set" (", <, >, `, {, }).
*
* Space (0x20) is intentionally excluded — decodeURI decodes %20 to space
* and the router stores decoded spaces in location.pathname. The existing
* encodePathLikeUrl already handles re-encoding spaces for outgoing URLs.
*
* These characters are decoded by decodeURI but must remain percent-encoded
* in paths to match how upstream layers (CDNs, edge middleware, browsers)
* interpret the URL, preventing infinite redirect loops and path mismatches.
*/
var PATH_UNSAFE_RE = /[\x00-\x1f\x7f"<>`{}]/g;
function sanitizePathSegment(segment) {
	return segment.replace(PATH_UNSAFE_RE, (ch) => "%" + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"));
}
function decodeSegment(segment) {
	let decoded;
	try {
		decoded = decodeURI(segment);
	} catch {
		decoded = segment.replaceAll(/%[0-9A-F]{2}/gi, (match) => {
			try {
				return decodeURI(match);
			} catch {
				return match;
			}
		});
	}
	return sanitizePathSegment(decoded);
}
/**
* Default list of URL protocols to allow in links, redirects, and navigation.
* Any absolute URL protocol not in this list is treated as dangerous by default.
*/
var DEFAULT_PROTOCOL_ALLOWLIST = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
/**
* Check if a URL string uses a protocol that is not in the allowlist.
* Returns true for blocked protocols like javascript:, blob:, data:, etc.
*
* The URL constructor correctly normalizes:
* - Mixed case (JavaScript: → javascript:)
* - Whitespace/control characters (java\nscript: → javascript:)
* - Leading whitespace
*
* For relative URLs (no protocol), returns false (safe).
*
* @param url - The URL string to check
* @param allowlist - Set of protocols to allow
* @returns true if the URL uses a protocol that is not allowed
*/
function isDangerousProtocol(url, allowlist) {
	if (!url) return false;
	try {
		const parsed = new URL(url);
		return !allowlist.has(parsed.protocol);
	} catch {
		return false;
	}
}
var HTML_ESCAPE_LOOKUP = {
	"&": "\\u0026",
	">": "\\u003e",
	"<": "\\u003c",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029"
};
var HTML_ESCAPE_REGEX = /[&><\u2028\u2029]/g;
/**
* Escape HTML special characters in a string to prevent XSS attacks
* when embedding strings in script tags during SSR.
*
* This is essential for preventing XSS vulnerabilities when user-controlled
* content is embedded in inline scripts.
*/
function escapeHtml(str) {
	return str.replace(HTML_ESCAPE_REGEX, (match) => HTML_ESCAPE_LOOKUP[match]);
}
function decodePath(path) {
	if (!path) return {
		path,
		handledProtocolRelativeURL: false
	};
	if (!/[%\\\x00-\x1f\x7f]/.test(path) && !path.startsWith("//")) return {
		path,
		handledProtocolRelativeURL: false
	};
	const re = /%25|%5C/gi;
	let cursor = 0;
	let result = "";
	let match;
	while (null !== (match = re.exec(path))) {
		result += decodeSegment(path.slice(cursor, match.index)) + match[0];
		cursor = re.lastIndex;
	}
	result = result + decodeSegment(cursor ? path.slice(cursor) : path);
	let handledProtocolRelativeURL = false;
	if (result.startsWith("//")) {
		handledProtocolRelativeURL = true;
		result = "/" + result.replace(/^\/+/, "");
	}
	return {
		path: result,
		handledProtocolRelativeURL
	};
}
/**
* Encodes a path the same way `new URL()` would, but without the overhead of full URL parsing.
*
* This function encodes:
* - Whitespace characters (spaces → %20, tabs → %09, etc.)
* - Non-ASCII/Unicode characters (emojis, accented characters, etc.)
*
* It preserves:
* - Already percent-encoded sequences (won't double-encode %2F, %25, etc.)
* - ASCII special characters valid in URL paths (@, $, &, +, etc.)
* - Forward slashes as path separators
*
* Used to generate proper href values for SSR without constructing URL objects.
*
* @example
* encodePathLikeUrl('/path/file name.pdf') // '/path/file%20name.pdf'
* encodePathLikeUrl('/path/日本語') // '/path/%E6%97%A5%E6%9C%AC%E8%AA%9E'
* encodePathLikeUrl('/path/already%20encoded') // '/path/already%20encoded' (preserved)
*/
function encodePathLikeUrl(path) {
	if (!/\s|[^\u0000-\u007F]/.test(path)) return path;
	return path.replace(/\s|[^\u0000-\u007F]/gu, encodeURIComponent);
}
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/invariant.js
function invariant() {
	throw new Error("Invariant failed");
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/lru-cache.js
function createLRUCache(max) {
	const cache = /* @__PURE__ */ new Map();
	let oldest;
	let newest;
	const touch = (entry) => {
		if (!entry.next) return;
		if (!entry.prev) {
			entry.next.prev = void 0;
			oldest = entry.next;
			entry.next = void 0;
			if (newest) {
				entry.prev = newest;
				newest.next = entry;
			}
		} else {
			entry.prev.next = entry.next;
			entry.next.prev = entry.prev;
			entry.next = void 0;
			if (newest) {
				newest.next = entry;
				entry.prev = newest;
			}
		}
		newest = entry;
	};
	return {
		get(key) {
			const entry = cache.get(key);
			if (!entry) return void 0;
			touch(entry);
			return entry.value;
		},
		set(key, value) {
			if (cache.size >= max && oldest) {
				const toDelete = oldest;
				cache.delete(toDelete.key);
				if (toDelete.next) {
					oldest = toDelete.next;
					toDelete.next.prev = void 0;
				}
				if (toDelete === newest) newest = void 0;
			}
			const existing = cache.get(key);
			if (existing) {
				existing.value = value;
				touch(existing);
			} else {
				const entry = {
					key,
					value,
					prev: newest
				};
				if (newest) newest.next = entry;
				newest = entry;
				if (!oldest) oldest = entry;
				cache.set(key, entry);
			}
		},
		clear() {
			cache.clear();
			oldest = void 0;
			newest = void 0;
		}
	};
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/new-process-route-tree.js
var SEGMENT_TYPE_INDEX = 4;
var SEGMENT_TYPE_PATHLESS = 5;
function getOpenAndCloseBraces(part) {
	const openBrace = part.indexOf("{");
	if (openBrace === -1) return null;
	const closeBrace = part.indexOf("}", openBrace);
	if (closeBrace === -1) return null;
	if (openBrace + 1 >= part.length) return null;
	return [openBrace, closeBrace];
}
/**
* Populates the `output` array with the parsed representation of the given `segment` string.
*
* Usage:
* ```ts
* let output
* let cursor = 0
* while (cursor < path.length) {
*   output = parseSegment(path, cursor, output)
*   const end = output[5]
*   cursor = end + 1
* ```
*
* `output` is stored outside to avoid allocations during repeated calls. It doesn't need to be typed
* or initialized, it will be done automatically.
*/
function parseSegment(path, start, output = /* @__PURE__ */ new Uint16Array(6)) {
	const next = path.indexOf("/", start);
	const end = next === -1 ? path.length : next;
	const part = path.substring(start, end);
	if (!part || !part.includes("$")) {
		output[0] = 0;
		output[1] = start;
		output[2] = start;
		output[3] = end;
		output[4] = end;
		output[5] = end;
		return output;
	}
	if (part === "$") {
		const total = path.length;
		output[0] = 2;
		output[1] = start;
		output[2] = start;
		output[3] = total;
		output[4] = total;
		output[5] = total;
		return output;
	}
	if (part.charCodeAt(0) === 36) {
		output[0] = 1;
		output[1] = start;
		output[2] = start + 1;
		output[3] = end;
		output[4] = end;
		output[5] = end;
		return output;
	}
	const braces = getOpenAndCloseBraces(part);
	if (braces) {
		const [openBrace, closeBrace] = braces;
		const firstChar = part.charCodeAt(openBrace + 1);
		if (firstChar === 45) {
			if (openBrace + 2 < part.length && part.charCodeAt(openBrace + 2) === 36) {
				const paramStart = openBrace + 3;
				const paramEnd = closeBrace;
				if (paramStart < paramEnd) {
					output[0] = 3;
					output[1] = start + openBrace;
					output[2] = start + paramStart;
					output[3] = start + paramEnd;
					output[4] = start + closeBrace + 1;
					output[5] = end;
					return output;
				}
			}
		} else if (firstChar === 36) {
			const dollarPos = openBrace + 1;
			const afterDollar = openBrace + 2;
			if (afterDollar === closeBrace) {
				output[0] = 2;
				output[1] = start + openBrace;
				output[2] = start + dollarPos;
				output[3] = start + afterDollar;
				output[4] = start + closeBrace + 1;
				output[5] = path.length;
				return output;
			}
			output[0] = 1;
			output[1] = start + openBrace;
			output[2] = start + afterDollar;
			output[3] = start + closeBrace;
			output[4] = start + closeBrace + 1;
			output[5] = end;
			return output;
		}
	}
	output[0] = 0;
	output[1] = start;
	output[2] = start;
	output[3] = end;
	output[4] = end;
	output[5] = end;
	return output;
}
/**
* Recursively parses the segments of the given route tree and populates a segment trie.
*
* @param data A reusable Uint16Array for parsing segments. (non important, we're just avoiding allocations)
* @param route The current route to parse.
* @param start The starting index for parsing within the route's full path.
* @param node The current segment node in the trie to populate.
* @param onRoute Callback invoked for each route processed.
*/
function parseSegments(defaultCaseSensitive, data, route, start, node, depth, onRoute) {
	onRoute?.(route);
	let cursor = start;
	{
		const path = route.fullPath ?? route.from;
		const length = path.length;
		const caseSensitive = route.options?.caseSensitive ?? defaultCaseSensitive;
		const parseParams = route.options?.params?.parse ?? route.options?.parseParams;
		while (cursor < length) {
			const segment = parseSegment(path, cursor, data);
			let nextNode;
			const start = cursor;
			const end = segment[5];
			cursor = end + 1;
			depth++;
			switch (segment[0]) {
				case 0: {
					const value = path.substring(segment[2], segment[3]);
					if (caseSensitive) {
						const existingNode = node.static?.get(value);
						if (existingNode) nextNode = existingNode;
						else {
							node.static ??= /* @__PURE__ */ new Map();
							const next = createStaticNode(route.fullPath ?? route.from);
							next.parent = node;
							next.depth = depth;
							nextNode = next;
							node.static.set(value, next);
						}
					} else {
						const name = value.toLowerCase();
						const existingNode = node.staticInsensitive?.get(name);
						if (existingNode) nextNode = existingNode;
						else {
							node.staticInsensitive ??= /* @__PURE__ */ new Map();
							const next = createStaticNode(route.fullPath ?? route.from);
							next.parent = node;
							next.depth = depth;
							nextNode = next;
							node.staticInsensitive.set(name, next);
						}
					}
					break;
				}
				case 1: {
					const prefix_raw = path.substring(start, segment[1]);
					const suffix_raw = path.substring(segment[4], end);
					const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
					const prefix = !prefix_raw ? void 0 : actuallyCaseSensitive ? prefix_raw : prefix_raw.toLowerCase();
					const suffix = !suffix_raw ? void 0 : actuallyCaseSensitive ? suffix_raw : suffix_raw.toLowerCase();
					const existingNode = !parseParams && node.dynamic?.find((s) => !s.parse && s.caseSensitive === actuallyCaseSensitive && s.prefix === prefix && s.suffix === suffix);
					if (existingNode) nextNode = existingNode;
					else {
						const next = createDynamicNode(1, route.fullPath ?? route.from, actuallyCaseSensitive, prefix, suffix);
						nextNode = next;
						next.depth = depth;
						next.parent = node;
						node.dynamic ??= [];
						node.dynamic.push(next);
					}
					break;
				}
				case 3: {
					const prefix_raw = path.substring(start, segment[1]);
					const suffix_raw = path.substring(segment[4], end);
					const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
					const prefix = !prefix_raw ? void 0 : actuallyCaseSensitive ? prefix_raw : prefix_raw.toLowerCase();
					const suffix = !suffix_raw ? void 0 : actuallyCaseSensitive ? suffix_raw : suffix_raw.toLowerCase();
					const existingNode = !parseParams && node.optional?.find((s) => !s.parse && s.caseSensitive === actuallyCaseSensitive && s.prefix === prefix && s.suffix === suffix);
					if (existingNode) nextNode = existingNode;
					else {
						const next = createDynamicNode(3, route.fullPath ?? route.from, actuallyCaseSensitive, prefix, suffix);
						nextNode = next;
						next.parent = node;
						next.depth = depth;
						node.optional ??= [];
						node.optional.push(next);
					}
					break;
				}
				case 2: {
					const prefix_raw = path.substring(start, segment[1]);
					const suffix_raw = path.substring(segment[4], end);
					const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
					const prefix = !prefix_raw ? void 0 : actuallyCaseSensitive ? prefix_raw : prefix_raw.toLowerCase();
					const suffix = !suffix_raw ? void 0 : actuallyCaseSensitive ? suffix_raw : suffix_raw.toLowerCase();
					const next = createDynamicNode(2, route.fullPath ?? route.from, actuallyCaseSensitive, prefix, suffix);
					nextNode = next;
					next.parent = node;
					next.depth = depth;
					node.wildcard ??= [];
					node.wildcard.push(next);
				}
			}
			node = nextNode;
		}
		if (parseParams && route.children && !route.isRoot && route.id && route.id.charCodeAt(route.id.lastIndexOf("/") + 1) === 95) {
			const pathlessNode = createStaticNode(route.fullPath ?? route.from);
			pathlessNode.kind = SEGMENT_TYPE_PATHLESS;
			pathlessNode.parent = node;
			depth++;
			pathlessNode.depth = depth;
			node.pathless ??= [];
			node.pathless.push(pathlessNode);
			node = pathlessNode;
		}
		const isLeaf = (route.path || !route.children) && !route.isRoot;
		if (isLeaf && path.endsWith("/")) {
			const indexNode = createStaticNode(route.fullPath ?? route.from);
			indexNode.kind = SEGMENT_TYPE_INDEX;
			indexNode.parent = node;
			depth++;
			indexNode.depth = depth;
			node.index = indexNode;
			node = indexNode;
		}
		node.parse = parseParams ?? null;
		node.priority = route.options?.params?.priority ?? 0;
		if (isLeaf && !node.route) {
			node.route = route;
			node.fullPath = route.fullPath ?? route.from;
		}
	}
	if (route.children) for (const child of route.children) parseSegments(defaultCaseSensitive, data, child, cursor, node, depth, onRoute);
}
function sortDynamic(a, b) {
	if (a.parse && !b.parse) return -1;
	if (!a.parse && b.parse) return 1;
	if (a.parse && b.parse && (a.priority || b.priority)) return b.priority - a.priority;
	if (a.prefix && b.prefix && a.prefix !== b.prefix) {
		if (a.prefix.startsWith(b.prefix)) return -1;
		if (b.prefix.startsWith(a.prefix)) return 1;
	}
	if (a.suffix && b.suffix && a.suffix !== b.suffix) {
		if (a.suffix.endsWith(b.suffix)) return -1;
		if (b.suffix.endsWith(a.suffix)) return 1;
	}
	if (a.prefix && !b.prefix) return -1;
	if (!a.prefix && b.prefix) return 1;
	if (a.suffix && !b.suffix) return -1;
	if (!a.suffix && b.suffix) return 1;
	if (a.caseSensitive && !b.caseSensitive) return -1;
	if (!a.caseSensitive && b.caseSensitive) return 1;
	return 0;
}
function sortTreeNodes(node) {
	if (node.pathless) for (const child of node.pathless) sortTreeNodes(child);
	if (node.static) for (const child of node.static.values()) sortTreeNodes(child);
	if (node.staticInsensitive) for (const child of node.staticInsensitive.values()) sortTreeNodes(child);
	if (node.dynamic?.length) {
		node.dynamic.sort(sortDynamic);
		for (const child of node.dynamic) sortTreeNodes(child);
	}
	if (node.optional?.length) {
		node.optional.sort(sortDynamic);
		for (const child of node.optional) sortTreeNodes(child);
	}
	if (node.wildcard?.length) {
		node.wildcard.sort(sortDynamic);
		for (const child of node.wildcard) sortTreeNodes(child);
	}
}
function createStaticNode(fullPath) {
	return {
		kind: 0,
		depth: 0,
		pathless: null,
		index: null,
		static: null,
		staticInsensitive: null,
		dynamic: null,
		optional: null,
		wildcard: null,
		route: null,
		fullPath,
		parent: null,
		parse: null,
		priority: 0
	};
}
/**
* Keys must be declared in the same order as in `SegmentNode` type,
* to ensure they are represented as the same object class in the engine.
*/
function createDynamicNode(kind, fullPath, caseSensitive, prefix, suffix) {
	return {
		kind,
		depth: 0,
		pathless: null,
		index: null,
		static: null,
		staticInsensitive: null,
		dynamic: null,
		optional: null,
		wildcard: null,
		route: null,
		fullPath,
		parent: null,
		parse: null,
		priority: 0,
		caseSensitive,
		prefix,
		suffix
	};
}
function processRouteMasks(routeList, processedTree) {
	const segmentTree = createStaticNode("/");
	const data = /* @__PURE__ */ new Uint16Array(6);
	for (const route of routeList) parseSegments(false, data, route, 1, segmentTree, 0);
	sortTreeNodes(segmentTree);
	processedTree.masksTree = segmentTree;
	processedTree.flatCache = createLRUCache(1e3);
}
/**
* Take an arbitrary list of routes, create a tree from them (if it hasn't been created already), and match a path against it.
*/
function findFlatMatch(path, processedTree) {
	path ||= "/";
	const cached = processedTree.flatCache.get(path);
	if (cached) return cached;
	const result = findMatch(path, processedTree.masksTree);
	processedTree.flatCache.set(path, result);
	return result;
}
/**
* @deprecated keep until v2 so that `router.matchRoute` can keep not caring about the actual route tree
*/
function findSingleMatch(from, caseSensitive, fuzzy, path, processedTree) {
	from ||= "/";
	path ||= "/";
	const key = caseSensitive ? `case\0${from}` : from;
	let tree = processedTree.singleCache.get(key);
	if (!tree) {
		tree = createStaticNode("/");
		parseSegments(caseSensitive, /* @__PURE__ */ new Uint16Array(6), { from }, 1, tree, 0);
		processedTree.singleCache.set(key, tree);
	}
	return findMatch(path, tree, fuzzy);
}
function findRouteMatch(path, processedTree, fuzzy = false) {
	const key = fuzzy ? path : `nofuzz\0${path}`;
	const cached = processedTree.matchCache.get(key);
	if (cached !== void 0) return cached;
	path ||= "/";
	let result;
	try {
		result = findMatch(path, processedTree.segmentTree, fuzzy);
	} catch (err) {
		if (err instanceof URIError) result = null;
		else throw err;
	}
	if (result) result.branch = buildRouteBranch(result.route);
	processedTree.matchCache.set(key, result);
	return result;
}
/** Trim trailing slashes (except preserving root '/'). */
function trimPathRight$1(path) {
	return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
/**
* Processes a route tree into a segment trie for efficient path matching.
* Also builds lookup maps for routes by ID and by trimmed full path.
*/
function processRouteTree(routeTree, caseSensitive = false, initRoute) {
	const segmentTree = createStaticNode(routeTree.fullPath);
	const data = /* @__PURE__ */ new Uint16Array(6);
	const routesById = {};
	const routesByPath = {};
	let index = 0;
	parseSegments(caseSensitive, data, routeTree, 1, segmentTree, 0, (route) => {
		initRoute?.(route, index);
		if (route.id in routesById) invariant();
		routesById[route.id] = route;
		if (index !== 0 && route.path) {
			const trimmedFullPath = trimPathRight$1(route.fullPath);
			if (!routesByPath[trimmedFullPath] || route.fullPath.endsWith("/")) routesByPath[trimmedFullPath] = route;
		}
		index++;
	});
	sortTreeNodes(segmentTree);
	return {
		processedTree: {
			segmentTree,
			singleCache: createLRUCache(1e3),
			matchCache: createLRUCache(1e3),
			flatCache: null,
			masksTree: null
		},
		routesById,
		routesByPath
	};
}
function findMatch(path, segmentTree, fuzzy = false) {
	const parts = path.split("/");
	const leaf = getNodeMatch(path, parts, segmentTree, fuzzy);
	if (!leaf) return null;
	const [rawParams] = extractParams(path, parts, leaf);
	return {
		route: leaf.node.route,
		rawParams
	};
}
/**
* This function is "resumable":
* - the `leaf` input can contain `extract` and `rawParams` properties from a previous `extractParams` call
* - the returned `state` can be passed back as `extract` in a future call to continue extracting params from where we left off
*
* Inputs are *not* mutated.
*/
function extractParams(path, parts, leaf) {
	const list = buildBranch(leaf.node);
	let nodeParts = null;
	const rawParams = Object.create(null);
	/** which segment of the path we're currently processing */
	let partIndex = leaf.extract?.part ?? 0;
	/** which node of the route tree branch we're currently processing */
	let nodeIndex = leaf.extract?.node ?? 0;
	/** index of the 1st character of the segment we're processing in the path string */
	let pathIndex = leaf.extract?.path ?? 0;
	/** which fullPath segment we're currently processing */
	let segmentCount = leaf.extract?.segment ?? 0;
	for (; nodeIndex < list.length; partIndex++, nodeIndex++, pathIndex++, segmentCount++) {
		const node = list[nodeIndex];
		if (node.kind === SEGMENT_TYPE_INDEX) break;
		if (node.kind === SEGMENT_TYPE_PATHLESS) {
			segmentCount--;
			partIndex--;
			pathIndex--;
			continue;
		}
		const part = parts[partIndex];
		const currentPathIndex = pathIndex;
		if (part) pathIndex += part.length;
		if (node.kind === 1) {
			nodeParts ??= leaf.node.fullPath.split("/");
			const nodePart = nodeParts[segmentCount];
			const preLength = node.prefix?.length ?? 0;
			if (nodePart.charCodeAt(preLength) === 123) {
				const sufLength = node.suffix?.length ?? 0;
				const name = nodePart.substring(preLength + 2, nodePart.length - sufLength - 1);
				const value = part.substring(preLength, part.length - sufLength);
				rawParams[name] = decodeURIComponent(value);
			} else {
				const name = nodePart.substring(1);
				rawParams[name] = decodeURIComponent(part);
			}
		} else if (node.kind === 3) {
			if (leaf.skipped & 1 << nodeIndex) {
				partIndex--;
				pathIndex = currentPathIndex - 1;
				continue;
			}
			nodeParts ??= leaf.node.fullPath.split("/");
			const nodePart = nodeParts[segmentCount];
			const preLength = node.prefix?.length ?? 0;
			const sufLength = node.suffix?.length ?? 0;
			const name = nodePart.substring(preLength + 3, nodePart.length - sufLength - 1);
			const value = node.suffix || node.prefix ? part.substring(preLength, part.length - sufLength) : part;
			if (value) rawParams[name] = decodeURIComponent(value);
		} else if (node.kind === 2) {
			const n = node;
			const value = path.substring(currentPathIndex + (n.prefix?.length ?? 0), path.length - (n.suffix?.length ?? 0));
			const splat = decodeURIComponent(value);
			rawParams["*"] = splat;
			rawParams._splat = splat;
			break;
		}
	}
	if (leaf.rawParams) Object.assign(rawParams, leaf.rawParams);
	return [rawParams, {
		part: partIndex,
		node: nodeIndex,
		path: pathIndex,
		segment: segmentCount
	}];
}
function buildRouteBranch(route) {
	const list = [route];
	while (route.parentRoute) {
		route = route.parentRoute;
		list.push(route);
	}
	list.reverse();
	return list;
}
function buildBranch(node) {
	const list = Array(node.depth + 1);
	do {
		list[node.depth] = node;
		node = node.parent;
	} while (node);
	return list;
}
function getNodeMatch(path, parts, segmentTree, fuzzy) {
	if (path === "/" && segmentTree.index) return {
		node: segmentTree.index,
		skipped: 0
	};
	const trailingSlash = !last(parts);
	const pathIsIndex = trailingSlash && path !== "/";
	const partsLength = parts.length - (trailingSlash ? 1 : 0);
	const stack = [{
		node: segmentTree,
		index: 1,
		skipped: 0,
		depth: 1,
		statics: 0,
		dynamics: 0,
		optionals: 0
	}];
	let bestFuzzy = null;
	let bestMatch = null;
	while (stack.length) {
		const frame = stack.pop();
		const { node, index, skipped, depth, statics, dynamics, optionals } = frame;
		let { extract, rawParams } = frame;
		if (node.kind === 2 && node.route && !isFrameMoreSpecific(bestMatch, frame)) continue;
		if (node.parse) {
			if (!validateParseParams(path, parts, frame)) continue;
			rawParams = frame.rawParams;
			extract = frame.extract;
		}
		if (fuzzy && node.route && node.kind !== SEGMENT_TYPE_INDEX && isFrameMoreSpecific(bestFuzzy, frame)) bestFuzzy = frame;
		const isBeyondPath = index === partsLength;
		if (isBeyondPath) {
			if (node.route && (!pathIsIndex || node.kind === SEGMENT_TYPE_INDEX || node.kind === 2) && isFrameMoreSpecific(bestMatch, frame)) bestMatch = frame;
			if (!node.optional && !node.wildcard && !node.index && !node.pathless) continue;
		}
		const part = isBeyondPath ? void 0 : parts[index];
		let lowerPart;
		if (isBeyondPath && node.index) {
			const indexFrame = {
				node: node.index,
				index,
				skipped,
				depth: depth + 1,
				statics,
				dynamics,
				optionals,
				extract,
				rawParams
			};
			let indexValid = true;
			if (node.index.parse) {
				if (!validateParseParams(path, parts, indexFrame)) indexValid = false;
			}
			if (indexValid) {
				if (!dynamics && !optionals && !skipped && isPerfectStaticMatch(statics, partsLength)) return indexFrame;
				if (isFrameMoreSpecific(bestMatch, indexFrame)) bestMatch = indexFrame;
			}
		}
		if (node.wildcard) for (let i = node.wildcard.length - 1; i >= 0; i--) {
			const segment = node.wildcard[i];
			const { prefix, suffix } = segment;
			if (prefix) {
				if (isBeyondPath) continue;
				if (!(segment.caseSensitive ? part : lowerPart ??= part.toLowerCase()).startsWith(prefix)) continue;
			}
			if (suffix) {
				if (isBeyondPath) continue;
				const end = parts.slice(index).join("/").slice(-suffix.length);
				if ((segment.caseSensitive ? end : end.toLowerCase()) !== suffix) continue;
			}
			stack.push({
				node: segment,
				index: partsLength,
				skipped,
				depth: depth + 1,
				statics,
				dynamics,
				optionals,
				extract,
				rawParams
			});
		}
		if (node.optional) {
			const nextSkipped = skipped | 1 << depth;
			const nextDepth = depth + 1;
			for (let i = node.optional.length - 1; i >= 0; i--) {
				const segment = node.optional[i];
				stack.push({
					node: segment,
					index,
					skipped: nextSkipped,
					depth: nextDepth,
					statics,
					dynamics,
					optionals,
					extract,
					rawParams
				});
			}
			if (!isBeyondPath) for (let i = node.optional.length - 1; i >= 0; i--) {
				const segment = node.optional[i];
				const { prefix, suffix } = segment;
				if (prefix || suffix) {
					const casePart = segment.caseSensitive ? part : lowerPart ??= part.toLowerCase();
					if (prefix && !casePart.startsWith(prefix)) continue;
					if (suffix && !casePart.endsWith(suffix)) continue;
				}
				stack.push({
					node: segment,
					index: index + 1,
					skipped,
					depth: nextDepth,
					statics,
					dynamics,
					optionals: optionals + segmentScore(partsLength, index),
					extract,
					rawParams
				});
			}
		}
		if (!isBeyondPath && node.dynamic && part) for (let i = node.dynamic.length - 1; i >= 0; i--) {
			const segment = node.dynamic[i];
			const { prefix, suffix } = segment;
			if (prefix || suffix) {
				const casePart = segment.caseSensitive ? part : lowerPart ??= part.toLowerCase();
				if (prefix && !casePart.startsWith(prefix)) continue;
				if (suffix && !casePart.endsWith(suffix)) continue;
			}
			stack.push({
				node: segment,
				index: index + 1,
				skipped,
				depth: depth + 1,
				statics,
				dynamics: dynamics + segmentScore(partsLength, index),
				optionals,
				extract,
				rawParams
			});
		}
		if (!isBeyondPath && node.staticInsensitive) {
			const match = node.staticInsensitive.get(lowerPart ??= part.toLowerCase());
			if (match) stack.push({
				node: match,
				index: index + 1,
				skipped,
				depth: depth + 1,
				statics: statics + segmentScore(partsLength, index),
				dynamics,
				optionals,
				extract,
				rawParams
			});
		}
		if (!isBeyondPath && node.static) {
			const match = node.static.get(part);
			if (match) stack.push({
				node: match,
				index: index + 1,
				skipped,
				depth: depth + 1,
				statics: statics + segmentScore(partsLength, index),
				dynamics,
				optionals,
				extract,
				rawParams
			});
		}
		if (node.pathless) {
			const nextDepth = depth + 1;
			for (let i = node.pathless.length - 1; i >= 0; i--) {
				const segment = node.pathless[i];
				stack.push({
					node: segment,
					index,
					skipped,
					depth: nextDepth,
					statics,
					dynamics,
					optionals,
					extract,
					rawParams
				});
			}
		}
	}
	if (bestMatch) return bestMatch;
	if (fuzzy && bestFuzzy) {
		let sliceIndex = bestFuzzy.index;
		for (let i = 0; i < bestFuzzy.index; i++) sliceIndex += parts[i].length;
		const splat = sliceIndex === path.length ? "/" : path.slice(sliceIndex);
		bestFuzzy.rawParams ??= Object.create(null);
		bestFuzzy.rawParams["**"] = decodeURIComponent(splat);
		return bestFuzzy;
	}
	return null;
}
function segmentScore(partsLength, index) {
	return 2 ** (partsLength - index - 1);
}
function isPerfectStaticMatch(statics, partsLength) {
	return statics === 2 ** (partsLength - 1) - 1;
}
function validateParseParams(path, parts, frame) {
	let rawParams;
	let state;
	try {
		[rawParams, state] = extractParams(path, parts, frame);
	} catch {
		return null;
	}
	frame.rawParams = rawParams;
	frame.extract = state;
	if (!frame.node.parse) return true;
	try {
		if (frame.node.parse(rawParams) === false) return null;
	} catch {}
	return true;
}
function isFrameMoreSpecific(prev, next) {
	if (!prev) return true;
	return next.statics > prev.statics || next.statics === prev.statics && (next.dynamics > prev.dynamics || next.dynamics === prev.dynamics && (next.optionals > prev.optionals || next.optionals === prev.optionals && ((next.node.kind === SEGMENT_TYPE_INDEX) > (prev.node.kind === SEGMENT_TYPE_INDEX) || next.node.kind === SEGMENT_TYPE_INDEX === (prev.node.kind === SEGMENT_TYPE_INDEX) && next.depth > prev.depth)));
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/path.js
/** Join path segments, cleaning duplicate slashes between parts. */
function joinPaths(paths) {
	return cleanPath(paths.filter((val) => {
		return val !== void 0;
	}).join("/"));
}
/** Remove repeated slashes from a path string. */
function cleanPath(path) {
	return path.replace(/\/{2,}/g, "/");
}
/** Trim leading slashes (except preserving root '/'). */
function trimPathLeft(path) {
	return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
/** Trim trailing slashes (except preserving root '/'). */
function trimPathRight(path) {
	const len = path.length;
	return len > 1 && path[len - 1] === "/" ? path.replace(/\/{1,}$/, "") : path;
}
/** Trim both leading and trailing slashes. */
function trimPath(path) {
	return trimPathRight(trimPathLeft(path));
}
/** Remove a trailing slash from value when appropriate for comparisons. */
function removeTrailingSlash(value, basepath) {
	if (value?.endsWith("/") && value !== "/" && value !== `${basepath}/`) return value.slice(0, -1);
	return value;
}
/**
* Compare two pathnames for exact equality after normalizing trailing slashes
* relative to the provided `basepath`.
*/
function exactPathTest(pathName1, pathName2, basepath) {
	return removeTrailingSlash(pathName1, basepath) === removeTrailingSlash(pathName2, basepath);
}
/**
* Resolve a destination path against a base, honoring trailing-slash policy
* and supporting relative segments (`.`/`..`) and absolute `to` values.
*/
function resolvePath({ base, to, trailingSlash = "never", cache }) {
	const isAbsolute = to.startsWith("/");
	const isBase = !isAbsolute && to === ".";
	let key;
	if (cache) {
		key = isAbsolute ? to : isBase ? base : base + "\0" + to;
		const cached = cache.get(key);
		if (cached) return cached;
	}
	let baseSegments;
	if (isBase) baseSegments = base.split("/");
	else if (isAbsolute) baseSegments = to.split("/");
	else {
		baseSegments = base.split("/");
		while (baseSegments.length > 1 && last(baseSegments) === "") baseSegments.pop();
		const toSegments = to.split("/");
		for (let index = 0, length = toSegments.length; index < length; index++) {
			const value = toSegments[index];
			if (value === "") {
				if (!index) baseSegments = [value];
				else if (index === length - 1) baseSegments.push(value);
			} else if (value === "..") baseSegments.pop();
			else if (value === ".") {} else baseSegments.push(value);
		}
	}
	if (baseSegments.length > 1) {
		if (last(baseSegments) === "") {
			if (trailingSlash === "never") baseSegments.pop();
		} else if (trailingSlash === "always") baseSegments.push("");
	}
	const result = cleanPath(baseSegments.join("/")) || "/";
	if (key && cache) cache.set(key, result);
	return result;
}
/**
* Create a pre-compiled decode config from allowed characters.
* This should be called once at router initialization.
*/
function compileDecodeCharMap(pathParamsAllowedCharacters) {
	const charMap = new Map(pathParamsAllowedCharacters.map((char) => [encodeURIComponent(char), char]));
	const pattern = Array.from(charMap.keys()).map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
	const regex = new RegExp(pattern, "g");
	return (encoded) => encoded.replace(regex, (match) => charMap.get(match) ?? match);
}
function encodeParam(key, params, decoder) {
	const value = params[key];
	if (typeof value !== "string") return value;
	if (key === "_splat") {
		if (/^[a-zA-Z0-9\-._~!/]*$/.test(value)) return value;
		return value.split("/").map((segment) => encodePathParam(segment, decoder)).join("/");
	} else return encodePathParam(value, decoder);
}
/**
* Interpolate params and wildcards into a route path template.
*
* - Encodes params safely (configurable allowed characters)
* - Supports `{-$optional}` segments, `{prefix{$id}suffix}` and `{$}` wildcards
*/
function interpolatePath({ path, params, decoder, ...rest }) {
	let isMissingParams = false;
	const usedParams = Object.create(null);
	if (!path || path === "/") return {
		interpolatedPath: "/",
		usedParams,
		isMissingParams
	};
	if (!path.includes("$")) return {
		interpolatedPath: path,
		usedParams,
		isMissingParams
	};
	if (path.indexOf("{") === -1) {
		const length = path.length;
		let cursor = 0;
		let joined = "";
		while (cursor < length) {
			while (cursor < length && path.charCodeAt(cursor) === 47) cursor++;
			if (cursor >= length) break;
			const start = cursor;
			let end = path.indexOf("/", cursor);
			if (end === -1) end = length;
			cursor = end;
			const part = path.substring(start, end);
			if (!part) continue;
			if (part.charCodeAt(0) === 36) if (part.length === 1) {
				const splat = params._splat;
				usedParams._splat = splat;
				usedParams["*"] = splat;
				if (!splat) {
					isMissingParams = true;
					continue;
				}
				const value = encodeParam("_splat", params, decoder);
				joined += "/" + value;
			} else {
				const key = part.substring(1);
				if (!isMissingParams && !(key in params)) isMissingParams = true;
				usedParams[key] = params[key];
				const value = encodeParam(key, params, decoder) ?? "undefined";
				joined += "/" + value;
			}
			else joined += "/" + part;
		}
		if (path.endsWith("/")) joined += "/";
		return {
			usedParams,
			interpolatedPath: joined || "/",
			isMissingParams
		};
	}
	const length = path.length;
	let cursor = 0;
	let segment;
	let joined = "";
	while (cursor < length) {
		const start = cursor;
		segment = parseSegment(path, start, segment);
		const end = segment[5];
		cursor = end + 1;
		if (start === end) continue;
		const kind = segment[0];
		if (kind === 0) {
			joined += "/" + path.substring(start, end);
			continue;
		}
		if (kind === 2) {
			const splat = params._splat;
			usedParams._splat = splat;
			usedParams["*"] = splat;
			const prefix = path.substring(start, segment[1]);
			const suffix = path.substring(segment[4], end);
			if (!splat) {
				isMissingParams = true;
				if (prefix || suffix) joined += "/" + prefix + suffix;
				continue;
			}
			const value = encodeParam("_splat", params, decoder);
			joined += "/" + prefix + value + suffix;
			continue;
		}
		if (kind === 1) {
			const key = path.substring(segment[2], segment[3]);
			if (!isMissingParams && !(key in params)) isMissingParams = true;
			usedParams[key] = params[key];
			const prefix = path.substring(start, segment[1]);
			const suffix = path.substring(segment[4], end);
			const value = encodeParam(key, params, decoder) ?? "undefined";
			joined += "/" + prefix + value + suffix;
			continue;
		}
		if (kind === 3) {
			const key = path.substring(segment[2], segment[3]);
			const valueRaw = params[key];
			if (valueRaw == null) continue;
			usedParams[key] = valueRaw;
			const prefix = path.substring(start, segment[1]);
			const suffix = path.substring(segment[4], end);
			const value = encodeParam(key, params, decoder) ?? "";
			joined += "/" + prefix + value + suffix;
			continue;
		}
	}
	if (path.endsWith("/")) joined += "/";
	return {
		usedParams,
		interpolatedPath: joined || "/",
		isMissingParams
	};
}
function encodePathParam(value, decoder) {
	const encoded = encodeURIComponent(value);
	return decoder?.(encoded) ?? encoded;
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/not-found.js
/** Determine if a value is a TanStack Router not-found error. */
function isNotFound(obj) {
	return obj?.isNotFound === true;
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/scroll-restoration.js
function getSafeSessionStorage() {
	try {
		return sessionStorage;
	} catch {
		return;
	}
}
var storageKey = "tsr-scroll-restoration-v1_3";
getSafeSessionStorage();
/**
* The default `getKey` function for `useScrollRestoration`.
* It returns the `key` from the location state or the `href` of the location.
*
* The `location.href` is used as a fallback to support the use case where the location state is not available like the initial render.
*/
var defaultGetScrollRestorationKey = (location) => {
	return location.state.__TSR_key || location.href;
};
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/qss.js
/**
* Program is a reimplementation of the `qss` package:
* Copyright (c) Luke Edwards luke.edwards05@gmail.com, MIT License
* https://github.com/lukeed/qss/blob/master/license.md
*
* This reimplementation uses modern browser APIs
* (namely URLSearchParams) and TypeScript while still
* maintaining the original functionality and interface.
*
* Update: this implementation has also been mangled to
* fit exactly our use-case (single value per key in encoding).
*/
/**
* Encodes an object into a query string.
* @param obj - The object to encode into a query string.
* @param stringify - An optional custom stringify function.
* @returns The encoded query string.
* @example
* ```
* // Example input: encode({ token: 'foo', key: 'value' })
* // Expected output: "token=foo&key=value"
* ```
*/
function encode(obj, stringify = String) {
	const result = new URLSearchParams();
	for (const key in obj) {
		const val = obj[key];
		if (val !== void 0) result.set(key, stringify(val));
	}
	return result.toString();
}
/**
* Converts a string value to its appropriate type (string, number, boolean).
* @param mix - The string value to convert.
* @returns The converted value.
* @example
* // Example input: toValue("123")
* // Expected output: 123
*/
function toValue(str) {
	if (!str) return "";
	if (str === "false") return false;
	if (str === "true") return true;
	return +str * 0 === 0 && +str + "" === str ? +str : str;
}
/**
* Decodes a query string into an object.
* @param str - The query string to decode.
* @returns The decoded key-value pairs in an object format.
* @example
* // Example input: decode("token=foo&key=value")
* // Expected output: { "token": "foo", "key": "value" }
*/
function decode(str) {
	const searchParams = new URLSearchParams(str);
	const result = Object.create(null);
	for (const [key, value] of searchParams.entries()) {
		const previousValue = result[key];
		if (previousValue == null) result[key] = toValue(value);
		else if (Array.isArray(previousValue)) previousValue.push(toValue(value));
		else result[key] = [previousValue, toValue(value)];
	}
	return result;
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/searchParams.js
/** Default `parseSearch` that strips leading '?' and JSON-parses values. */
var defaultParseSearch = parseSearchWith(JSON.parse);
/** Default `stringifySearch` using JSON.stringify for complex values. */
var defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
/**
* Build a `parseSearch` function using a provided JSON-like parser.
*
* The returned function strips a leading `?`, decodes values, and attempts to
* JSON-parse string values using the given `parser`.
*
* @param parser Function to parse a string value (e.g. `JSON.parse`).
* @returns A `parseSearch` function compatible with `Router` options.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/custom-search-param-serialization
*/
function parseSearchWith(parser) {
	return (searchStr) => {
		if (searchStr[0] === "?") searchStr = searchStr.substring(1);
		const query = decode(searchStr);
		for (const key in query) {
			const value = query[key];
			if (typeof value === "string") try {
				query[key] = parser(value);
			} catch (_err) {}
		}
		return query;
	};
}
/**
* Build a `stringifySearch` function using a provided serializer.
*
* Non-primitive values are serialized with `stringify`. If a `parser` is
* supplied, string values that are parseable are re-serialized to ensure
* symmetry with `parseSearch`.
*
* @param stringify Function to serialize a value (e.g. `JSON.stringify`).
* @param parser Optional parser to detect parseable strings.
* @returns A `stringifySearch` function compatible with `Router` options.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/custom-search-param-serialization
*/
function stringifySearchWith(stringify, parser) {
	const hasParser = typeof parser === "function";
	function stringifyValue(val) {
		if (typeof val === "object" && val !== null) try {
			return stringify(val);
		} catch (_err) {}
		else if (hasParser && typeof val === "string") try {
			parser(val);
			return stringify(val);
		} catch (_err) {}
		return val;
	}
	return (search) => {
		const searchStr = encode(search, stringifyValue);
		return searchStr ? `?${searchStr}` : "";
	};
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/root.js
/** Stable identifier used for the root route in a route tree. */
var rootRouteId = "__root__";
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/redirect.js
/**
* Create a redirect Response understood by TanStack Router.
*
* Use from route `loader`/`beforeLoad` or server functions to trigger a
* navigation. If `throw: true` is set, the redirect is thrown instead of
* returned. When an absolute `href` is supplied and `reloadDocument` is not
* set, a full-document navigation is inferred.
*
* @param opts Options for the redirect. Common fields:
* - `href`: absolute URL for external redirects; infers `reloadDocument`.
* - `statusCode`: HTTP status code to use (defaults to 307).
* - `headers`: additional headers to include on the Response.
* - Standard navigation options like `to`, `params`, `search`, `replace`,
*   and `reloadDocument` for internal redirects.
* @returns A Response augmented with router navigation options.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/redirectFunction
*/
function redirect(opts) {
	opts.statusCode = opts.statusCode || opts.code || 307;
	if (!opts._builtLocation && !opts.reloadDocument && typeof opts.href === "string") try {
		new URL(opts.href);
		opts.reloadDocument = true;
	} catch {}
	const headers = new Headers(opts.headers);
	if (opts.href && headers.get("Location") === null) headers.set("Location", opts.href);
	const response = new Response(null, {
		status: opts.statusCode,
		headers
	});
	response.options = opts;
	if (opts.throw) throw response;
	return response;
}
/** Check whether a value is a TanStack Router redirect Response. */
/** Check whether a value is a TanStack Router redirect Response. */
function isRedirect(obj) {
	return obj instanceof Response && !!obj.options;
}
/** True if value is a redirect with a resolved `href` location. */
/** True if value is a redirect with a resolved `href` location. */
function isResolvedRedirect(obj) {
	return isRedirect(obj) && !!obj.options.href;
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/rewrite.js
/** Compose multiple rewrite pairs into a single in/out rewrite. */
function composeRewrites(rewrites) {
	return {
		input: ({ url }) => {
			for (const rewrite of rewrites) url = executeRewriteInput(rewrite, url);
			return url;
		},
		output: ({ url }) => {
			for (let i = rewrites.length - 1; i >= 0; i--) url = executeRewriteOutput(rewrites[i], url);
			return url;
		}
	};
}
/** Create a rewrite pair that strips/adds a basepath on input/output. */
function rewriteBasepath(opts) {
	const trimmedBasepath = trimPath(opts.basepath);
	const normalizedBasepath = `/${trimmedBasepath}`;
	const checkBasepath = opts.caseSensitive ? normalizedBasepath : normalizedBasepath.toLowerCase();
	const checkBasepathWithSlash = `${checkBasepath}/`;
	return {
		input: ({ url }) => {
			const pathname = opts.caseSensitive ? url.pathname : url.pathname.toLowerCase();
			if (pathname === checkBasepath) url.pathname = "/";
			else if (pathname.startsWith(checkBasepathWithSlash)) url.pathname = url.pathname.slice(normalizedBasepath.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = joinPaths([
				"/",
				trimmedBasepath,
				url.pathname
			]);
			return url;
		}
	};
}
/** Execute a location input rewrite if provided. */
function executeRewriteInput(rewrite, url) {
	const res = rewrite?.input?.({ url });
	if (res) {
		if (typeof res === "string") return new URL(res);
		else if (res instanceof URL) return res;
	}
	return url;
}
/** Execute a location output rewrite if provided. */
function executeRewriteOutput(rewrite, url) {
	const res = rewrite?.output?.({ url });
	if (res) {
		if (typeof res === "string") return new URL(res);
		else if (res instanceof URL) return res;
	}
	return url;
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/stores.js
/** SSR non-reactive createMutableStore */
function createNonReactiveMutableStore(initialValue) {
	let value = initialValue;
	return {
		get() {
			return value;
		},
		set(nextOrUpdater) {
			value = functionalUpdate(nextOrUpdater, value);
		}
	};
}
/** SSR non-reactive createReadonlyStore */
function createNonReactiveReadonlyStore(read) {
	return { get() {
		return read();
	} };
}
function createRouterStores(initialState, config) {
	const { createMutableStore, createReadonlyStore, batch, init } = config;
	const matchStores = /* @__PURE__ */ new Map();
	const pendingMatchStores = /* @__PURE__ */ new Map();
	const cachedMatchStores = /* @__PURE__ */ new Map();
	const status = createMutableStore(initialState.status);
	const loadedAt = createMutableStore(initialState.loadedAt);
	const isLoading = createMutableStore(initialState.isLoading);
	const isTransitioning = createMutableStore(initialState.isTransitioning);
	const location = createMutableStore(initialState.location);
	const resolvedLocation = createMutableStore(initialState.resolvedLocation);
	const statusCode = createMutableStore(initialState.statusCode);
	const redirect = createMutableStore(initialState.redirect);
	const matchesId = createMutableStore([]);
	const pendingIds = createMutableStore([]);
	const cachedIds = createMutableStore([]);
	const matches = createReadonlyStore(() => readPoolMatches(matchStores, matchesId.get()));
	const pendingMatches = createReadonlyStore(() => readPoolMatches(pendingMatchStores, pendingIds.get()));
	const cachedMatches = createReadonlyStore(() => readPoolMatches(cachedMatchStores, cachedIds.get()));
	const firstId = createReadonlyStore(() => matchesId.get()[0]);
	const hasPending = createReadonlyStore(() => matchesId.get().some((matchId) => {
		return matchStores.get(matchId)?.get().status === "pending";
	}));
	const matchRouteDeps = createReadonlyStore(() => ({
		locationHref: location.get().href,
		resolvedLocationHref: resolvedLocation.get()?.href,
		status: status.get()
	}));
	const __store = createReadonlyStore(() => ({
		status: status.get(),
		loadedAt: loadedAt.get(),
		isLoading: isLoading.get(),
		isTransitioning: isTransitioning.get(),
		matches: matches.get(),
		location: location.get(),
		resolvedLocation: resolvedLocation.get(),
		statusCode: statusCode.get(),
		redirect: redirect.get()
	}));
	const matchStoreByRouteIdCache = createLRUCache(64);
	function getRouteMatchStore(routeId) {
		let cached = matchStoreByRouteIdCache.get(routeId);
		if (!cached) {
			cached = createReadonlyStore(() => {
				const ids = matchesId.get();
				for (const id of ids) {
					const matchStore = matchStores.get(id);
					if (matchStore && matchStore.routeId === routeId) return matchStore.get();
				}
			});
			matchStoreByRouteIdCache.set(routeId, cached);
		}
		return cached;
	}
	const store = {
		status,
		loadedAt,
		isLoading,
		isTransitioning,
		location,
		resolvedLocation,
		statusCode,
		redirect,
		matchesId,
		pendingIds,
		cachedIds,
		matches,
		pendingMatches,
		cachedMatches,
		firstId,
		hasPending,
		matchRouteDeps,
		matchStores,
		pendingMatchStores,
		cachedMatchStores,
		__store,
		getRouteMatchStore,
		setMatches,
		setPending,
		setCached
	};
	setMatches(initialState.matches);
	init?.(store);
	function setMatches(nextMatches) {
		reconcileMatchPool(nextMatches, matchStores, matchesId, createMutableStore, batch);
	}
	function setPending(nextMatches) {
		reconcileMatchPool(nextMatches, pendingMatchStores, pendingIds, createMutableStore, batch);
	}
	function setCached(nextMatches) {
		reconcileMatchPool(nextMatches, cachedMatchStores, cachedIds, createMutableStore, batch);
	}
	return store;
}
function readPoolMatches(pool, ids) {
	const matches = [];
	for (const id of ids) {
		const matchStore = pool.get(id);
		if (matchStore) matches.push(matchStore.get());
	}
	return matches;
}
function reconcileMatchPool(nextMatches, pool, idStore, createMutableStore, batch) {
	const nextIds = nextMatches.map((d) => d.id);
	const nextIdSet = new Set(nextIds);
	batch(() => {
		for (const id of pool.keys()) if (!nextIdSet.has(id)) pool.delete(id);
		for (const nextMatch of nextMatches) {
			const existing = pool.get(nextMatch.id);
			if (!existing) {
				const matchStore = createMutableStore(nextMatch);
				matchStore.routeId = nextMatch.routeId;
				pool.set(nextMatch.id, matchStore);
				continue;
			}
			existing.routeId = nextMatch.routeId;
			if (existing.get() !== nextMatch) existing.set(nextMatch);
		}
		if (!arraysEqual(idStore.get(), nextIds)) idStore.set(nextIds);
	});
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/load-matches.js
var triggerOnReady = (inner) => {
	if (!inner.rendered) {
		inner.rendered = true;
		return inner.onReady?.();
	}
};
var resolvePreload = (inner, matchId) => {
	return !!(inner.preload && !inner.router.stores.matchStores.has(matchId));
};
/**
* Builds the accumulated context from router options and all matches up to (and optionally including) the given index.
* Merges __routeContext and __beforeLoadContext from each match.
*/
var buildMatchContext = (inner, index, includeCurrentMatch = true) => {
	const context = { ...inner.router.options.context ?? {} };
	const end = includeCurrentMatch ? index : index - 1;
	for (let i = 0; i <= end; i++) {
		const innerMatch = inner.matches[i];
		if (!innerMatch) continue;
		const m = inner.router.getMatch(innerMatch.id);
		if (!m) continue;
		Object.assign(context, m.__routeContext, m.__beforeLoadContext);
	}
	return context;
};
var getNotFoundBoundaryIndex = (inner, err) => {
	if (!inner.matches.length) return;
	const requestedRouteId = err.routeId;
	const matchedRootIndex = inner.matches.findIndex((m) => m.routeId === inner.router.routeTree.id);
	const rootIndex = matchedRootIndex >= 0 ? matchedRootIndex : 0;
	let startIndex = requestedRouteId ? inner.matches.findIndex((match) => match.routeId === requestedRouteId) : inner.firstBadMatchIndex ?? inner.matches.length - 1;
	if (startIndex < 0) startIndex = rootIndex;
	for (let i = startIndex; i >= 0; i--) {
		const match = inner.matches[i];
		if (inner.router.looseRoutesById[match.routeId].options.notFoundComponent) return i;
	}
	return requestedRouteId ? startIndex : rootIndex;
};
var handleRedirectAndNotFound = (inner, match, err) => {
	if (!isRedirect(err) && !isNotFound(err)) return;
	if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) throw err;
	if (match) {
		match._nonReactive.beforeLoadPromise?.resolve();
		match._nonReactive.loaderPromise?.resolve();
		match._nonReactive.beforeLoadPromise = void 0;
		match._nonReactive.loaderPromise = void 0;
		match._nonReactive.error = err;
		inner.updateMatch(match.id, (prev) => ({
			...prev,
			status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : prev.status === "pending" ? "success" : prev.status,
			context: buildMatchContext(inner, match.index),
			isFetching: false,
			error: err
		}));
		if (isNotFound(err) && !err.routeId) err.routeId = match.routeId;
		match._nonReactive.loadPromise?.resolve();
	}
	if (isRedirect(err)) {
		inner.rendered = true;
		err.options._fromLocation = inner.location;
		err.redirectHandled = true;
		err = inner.router.resolveRedirect(err);
	}
	throw err;
};
var shouldSkipLoader = (inner, matchId) => {
	const match = inner.router.getMatch(matchId);
	if (!match) return true;
	if (match.ssr === false) return true;
	return false;
};
var syncMatchContext = (inner, matchId, index) => {
	const nextContext = buildMatchContext(inner, index);
	inner.updateMatch(matchId, (prev) => {
		return {
			...prev,
			context: nextContext
		};
	});
};
var handleSerialError = (inner, index, err) => {
	const { id: matchId, routeId } = inner.matches[index];
	const route = inner.router.looseRoutesById[routeId];
	if (err instanceof Promise) throw err;
	inner.firstBadMatchIndex ??= index;
	handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
	try {
		route.options.onError?.(err);
	} catch (errorHandlerErr) {
		err = errorHandlerErr;
		handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
	}
	inner.updateMatch(matchId, (prev) => {
		prev._nonReactive.beforeLoadPromise?.resolve();
		prev._nonReactive.beforeLoadPromise = void 0;
		prev._nonReactive.loadPromise?.resolve();
		return {
			...prev,
			error: err,
			status: "error",
			isFetching: false,
			updatedAt: Date.now(),
			abortController: new AbortController()
		};
	});
	if (!inner.preload && !isRedirect(err) && !isNotFound(err)) inner.serialError ??= err;
};
var isBeforeLoadSsr = (inner, matchId, index, route) => {
	const existingMatch = inner.router.getMatch(matchId);
	const parentMatchId = inner.matches[index - 1]?.id;
	const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
	if (inner.router.isShell()) {
		existingMatch.ssr = route.id === rootRouteId;
		return;
	}
	if (parentMatch?.ssr === false) {
		existingMatch.ssr = false;
		return;
	}
	const parentOverride = (tempSsr) => {
		if (tempSsr === true && parentMatch?.ssr === "data-only") return "data-only";
		return tempSsr;
	};
	const defaultSsr = inner.router.options.defaultSsr ?? true;
	if (route.options.ssr === void 0) {
		existingMatch.ssr = parentOverride(defaultSsr);
		return;
	}
	if (typeof route.options.ssr !== "function") {
		existingMatch.ssr = parentOverride(route.options.ssr);
		return;
	}
	const { search, params } = existingMatch;
	const ssrFnContext = {
		search: makeMaybe(search, existingMatch.searchError),
		params: makeMaybe(params, existingMatch.paramsError),
		location: inner.location,
		matches: inner.matches.map((match) => ({
			index: match.index,
			pathname: match.pathname,
			fullPath: match.fullPath,
			staticData: match.staticData,
			id: match.id,
			routeId: match.routeId,
			search: makeMaybe(match.search, match.searchError),
			params: makeMaybe(match.params, match.paramsError),
			ssr: match.ssr
		}))
	};
	const tempSsr = route.options.ssr(ssrFnContext);
	if (isPromise(tempSsr)) return tempSsr.then((ssr) => {
		existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
	});
	existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
};
var setupPendingTimeout = (inner, matchId, route, match) => {
	if (match._nonReactive.pendingTimeout !== void 0) return;
	route.options.pendingMs ?? inner.router.options.defaultPendingMs;
	if (!!(inner.onReady && false));
};
var preBeforeLoadSetup = (inner, matchId, route) => {
	const existingMatch = inner.router.getMatch(matchId);
	if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise) return;
	setupPendingTimeout(inner, matchId, route, existingMatch);
	const then = () => {
		const match = inner.router.getMatch(matchId);
		if (match.preload && (match.status === "redirected" || match.status === "notFound")) handleRedirectAndNotFound(inner, match, match.error);
	};
	return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
var executeBeforeLoad = (inner, matchId, index, route) => {
	const match = inner.router.getMatch(matchId);
	let prevLoadPromise = match._nonReactive.loadPromise;
	match._nonReactive.loadPromise = createControlledPromise(() => {
		prevLoadPromise?.resolve();
		prevLoadPromise = void 0;
	});
	const { paramsError, searchError } = match;
	if (paramsError) handleSerialError(inner, index, paramsError);
	if (searchError) handleSerialError(inner, index, searchError);
	setupPendingTimeout(inner, matchId, route, match);
	const abortController = new AbortController();
	let isPending = false;
	const pending = () => {
		if (isPending) return;
		isPending = true;
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: "beforeLoad",
			fetchCount: prev.fetchCount + 1,
			abortController
		}));
	};
	const resolve = () => {
		match._nonReactive.beforeLoadPromise?.resolve();
		match._nonReactive.beforeLoadPromise = void 0;
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: false
		}));
	};
	if (!route.options.beforeLoad) {
		inner.router.batch(() => {
			pending();
			resolve();
		});
		return;
	}
	match._nonReactive.beforeLoadPromise = createControlledPromise();
	const context = {
		...buildMatchContext(inner, index, false),
		...match.__routeContext
	};
	const { search, params, cause } = match;
	const preload = resolvePreload(inner, matchId);
	const beforeLoadFnContext = {
		search,
		abortController,
		params,
		preload,
		context,
		location: inner.location,
		navigate: (opts) => inner.router.navigate({
			...opts,
			_fromLocation: inner.location
		}),
		buildLocation: inner.router.buildLocation,
		cause: preload ? "preload" : cause,
		matches: inner.matches,
		routeId: route.id,
		...inner.router.options.additionalContext
	};
	const updateContext = (beforeLoadContext) => {
		if (beforeLoadContext === void 0) {
			inner.router.batch(() => {
				pending();
				resolve();
			});
			return;
		}
		if (isRedirect(beforeLoadContext) || isNotFound(beforeLoadContext)) {
			pending();
			handleSerialError(inner, index, beforeLoadContext);
		}
		inner.router.batch(() => {
			pending();
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				__beforeLoadContext: beforeLoadContext
			}));
			resolve();
		});
	};
	let beforeLoadContext;
	try {
		beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
		if (isPromise(beforeLoadContext)) {
			pending();
			return beforeLoadContext.catch((err) => {
				handleSerialError(inner, index, err);
			}).then(updateContext);
		}
	} catch (err) {
		pending();
		handleSerialError(inner, index, err);
	}
	updateContext(beforeLoadContext);
};
var handleBeforeLoad = (inner, index) => {
	const { id: matchId, routeId } = inner.matches[index];
	const route = inner.router.looseRoutesById[routeId];
	const serverSsr = () => {
		{
			const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
			if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
		}
		return queueExecution();
	};
	const execute = () => executeBeforeLoad(inner, matchId, index, route);
	const queueExecution = () => {
		if (shouldSkipLoader(inner, matchId)) return;
		const result = preBeforeLoadSetup(inner, matchId, route);
		return isPromise(result) ? result.then(execute) : execute();
	};
	return serverSsr();
};
var executeHead = (inner, matchId, route) => {
	const match = inner.router.getMatch(matchId);
	if (!match) return;
	if (!route.options.head && !route.options.scripts && !route.options.headers) return;
	const assetContext = {
		ssr: inner.router.options.ssr,
		matches: inner.matches,
		match,
		params: match.params,
		loaderData: match.loaderData
	};
	return Promise.all([
		route.options.head?.(assetContext),
		route.options.scripts?.(assetContext),
		route.options.headers?.(assetContext)
	]).then(([headFnContent, scripts, headers]) => {
		return {
			meta: headFnContent?.meta,
			links: headFnContent?.links,
			headScripts: headFnContent?.scripts,
			headers,
			scripts,
			styles: headFnContent?.styles
		};
	});
};
var getLoaderContext = (inner, matchPromises, matchId, index, route) => {
	const parentMatchPromise = matchPromises[index - 1];
	const { params, loaderDeps, abortController, cause } = inner.router.getMatch(matchId);
	const context = buildMatchContext(inner, index);
	const preload = resolvePreload(inner, matchId);
	return {
		params,
		deps: loaderDeps,
		preload: !!preload,
		parentMatchPromise,
		abortController,
		context,
		location: inner.location,
		navigate: (opts) => inner.router.navigate({
			...opts,
			_fromLocation: inner.location
		}),
		cause: preload ? "preload" : cause,
		route,
		...inner.router.options.additionalContext
	};
};
var runLoader = async (inner, matchPromises, matchId, index, route) => {
	try {
		const match = inner.router.getMatch(matchId);
		try {
			if (match.ssr === true) loadRouteChunk(route);
			const routeLoader = route.options.loader;
			const loader = typeof routeLoader === "function" ? routeLoader : routeLoader?.handler;
			const loaderResult = loader?.(getLoaderContext(inner, matchPromises, matchId, index, route));
			const loaderResultIsPromise = !!loader && isPromise(loaderResult);
			if (!!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise)) inner.updateMatch(matchId, (prev) => ({
				...prev,
				isFetching: "loader"
			}));
			if (loader) {
				const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
				handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), loaderData);
				if (loaderData !== void 0) inner.updateMatch(matchId, (prev) => ({
					...prev,
					loaderData
				}));
			}
			if (route._lazyPromise) await route._lazyPromise;
			const pendingPromise = match._nonReactive.minPendingPromise;
			if (pendingPromise) await pendingPromise;
			if (route._componentsPromise) await route._componentsPromise;
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				error: void 0,
				context: buildMatchContext(inner, index),
				status: "success",
				isFetching: false,
				updatedAt: Date.now()
			}));
		} catch (e) {
			let error = e;
			if (error?.name === "AbortError") {
				if (match.abortController.signal.aborted) {
					match._nonReactive.loaderPromise?.resolve();
					match._nonReactive.loaderPromise = void 0;
					return;
				}
				inner.updateMatch(matchId, (prev) => ({
					...prev,
					status: prev.status === "pending" ? "success" : prev.status,
					isFetching: false,
					context: buildMatchContext(inner, index)
				}));
				return;
			}
			const pendingPromise = match._nonReactive.minPendingPromise;
			if (pendingPromise) await pendingPromise;
			if (isNotFound(e)) await route.options.notFoundComponent?.preload?.();
			handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
			try {
				route.options.onError?.(e);
			} catch (onErrorError) {
				error = onErrorError;
				handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), onErrorError);
			}
			if (!isRedirect(error) && !isNotFound(error)) await loadRouteChunk(route, ["errorComponent"]);
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				error,
				context: buildMatchContext(inner, index),
				status: "error",
				isFetching: false
			}));
		}
	} catch (err) {
		const match = inner.router.getMatch(matchId);
		if (match) match._nonReactive.loaderPromise = void 0;
		handleRedirectAndNotFound(inner, match, err);
	}
};
var loadRouteMatch = async (inner, matchPromises, index) => {
	async function handleLoader(preload, prevMatch, previousRouteMatchId, match, route) {
		const age = Date.now() - prevMatch.updatedAt;
		const staleAge = preload ? route.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
		const shouldReloadOption = route.options.shouldReload;
		const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchPromises, matchId, index, route)) : shouldReloadOption;
		const { status, invalid } = match;
		const staleMatchShouldReload = age >= staleAge && (!!inner.forceStaleReload || match.cause === "enter" || previousRouteMatchId !== void 0 && previousRouteMatchId !== match.id);
		loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? staleMatchShouldReload));
		if (preload && route.options.preload === false) {} else if (loaderShouldRunAsync && !inner.sync && shouldReloadInBackground) {
			loaderIsRunningAsync = true;
			(async () => {
				try {
					await runLoader(inner, matchPromises, matchId, index, route);
					const match = inner.router.getMatch(matchId);
					match._nonReactive.loaderPromise?.resolve();
					match._nonReactive.loadPromise?.resolve();
					match._nonReactive.loaderPromise = void 0;
					match._nonReactive.loadPromise = void 0;
				} catch (err) {
					if (isRedirect(err)) await inner.router.navigate(err.options);
				}
			})();
		} else if (status !== "success" || loaderShouldRunAsync) await runLoader(inner, matchPromises, matchId, index, route);
		else syncMatchContext(inner, matchId, index);
	}
	const { id: matchId, routeId } = inner.matches[index];
	let loaderShouldRunAsync = false;
	let loaderIsRunningAsync = false;
	const route = inner.router.looseRoutesById[routeId];
	const routeLoader = route.options.loader;
	const shouldReloadInBackground = ((typeof routeLoader === "function" ? void 0 : routeLoader?.staleReloadMode) ?? inner.router.options.defaultStaleReloadMode) !== "blocking";
	if (shouldSkipLoader(inner, matchId)) {
		if (!inner.router.getMatch(matchId)) return inner.matches[index];
		syncMatchContext(inner, matchId, index);
		return inner.router.getMatch(matchId);
	} else {
		const prevMatch = inner.router.getMatch(matchId);
		const activeIdAtIndex = inner.router.stores.matchesId.get()[index];
		const previousRouteMatchId = (activeIdAtIndex && inner.router.stores.matchStores.get(activeIdAtIndex) || null)?.routeId === routeId ? activeIdAtIndex : inner.router.stores.matches.get().find((d) => d.routeId === routeId)?.id;
		const preload = resolvePreload(inner, matchId);
		if (prevMatch._nonReactive.loaderPromise) {
			if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload && shouldReloadInBackground) return prevMatch;
			await prevMatch._nonReactive.loaderPromise;
			const match = inner.router.getMatch(matchId);
			const error = match._nonReactive.error || match.error;
			if (error) handleRedirectAndNotFound(inner, match, error);
			if (match.status === "pending") await handleLoader(preload, prevMatch, previousRouteMatchId, match, route);
		} else {
			const nextPreload = preload && !inner.router.stores.matchStores.has(matchId);
			const match = inner.router.getMatch(matchId);
			match._nonReactive.loaderPromise = createControlledPromise();
			if (nextPreload !== match.preload) inner.updateMatch(matchId, (prev) => ({
				...prev,
				preload: nextPreload
			}));
			await handleLoader(preload, prevMatch, previousRouteMatchId, match, route);
		}
	}
	const match = inner.router.getMatch(matchId);
	if (!loaderIsRunningAsync) {
		match._nonReactive.loaderPromise?.resolve();
		match._nonReactive.loadPromise?.resolve();
		match._nonReactive.loadPromise = void 0;
	}
	clearTimeout(match._nonReactive.pendingTimeout);
	match._nonReactive.pendingTimeout = void 0;
	if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
	match._nonReactive.dehydrated = void 0;
	const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
	if (nextIsFetching !== match.isFetching || match.invalid !== false) {
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: nextIsFetching,
			invalid: false
		}));
		return inner.router.getMatch(matchId);
	} else return match;
};
async function loadMatches(arg) {
	const inner = arg;
	const matchPromises = [];
	let beforeLoadNotFound;
	for (let i = 0; i < inner.matches.length; i++) {
		try {
			const beforeLoad = handleBeforeLoad(inner, i);
			if (isPromise(beforeLoad)) await beforeLoad;
		} catch (err) {
			if (isRedirect(err)) throw err;
			if (isNotFound(err)) beforeLoadNotFound = err;
			else if (!inner.preload) throw err;
			break;
		}
		if (inner.serialError || inner.firstBadMatchIndex != null) break;
	}
	const baseMaxIndexExclusive = inner.firstBadMatchIndex ?? inner.matches.length;
	const boundaryIndex = beforeLoadNotFound && !inner.preload ? getNotFoundBoundaryIndex(inner, beforeLoadNotFound) : void 0;
	const maxIndexExclusive = beforeLoadNotFound && inner.preload ? 0 : boundaryIndex !== void 0 ? Math.min(boundaryIndex + 1, baseMaxIndexExclusive) : baseMaxIndexExclusive;
	let firstNotFound;
	let firstUnhandledRejection;
	for (let i = 0; i < maxIndexExclusive; i++) matchPromises.push(loadRouteMatch(inner, matchPromises, i));
	try {
		await Promise.all(matchPromises);
	} catch {
		const settled = await Promise.allSettled(matchPromises);
		for (const result of settled) {
			if (result.status !== "rejected") continue;
			const reason = result.reason;
			if (isRedirect(reason)) throw reason;
			if (isNotFound(reason)) firstNotFound ??= reason;
			else firstUnhandledRejection ??= reason;
		}
		if (firstUnhandledRejection !== void 0) throw firstUnhandledRejection;
	}
	const notFoundToThrow = firstNotFound ?? (beforeLoadNotFound && !inner.preload ? beforeLoadNotFound : void 0);
	let headMaxIndex = inner.firstBadMatchIndex !== void 0 ? inner.firstBadMatchIndex : inner.matches.length - 1;
	if (!notFoundToThrow && beforeLoadNotFound && inner.preload) return inner.matches;
	if (notFoundToThrow) {
		const renderedBoundaryIndex = getNotFoundBoundaryIndex(inner, notFoundToThrow);
		if (renderedBoundaryIndex === void 0) invariant();
		const boundaryMatch = inner.matches[renderedBoundaryIndex];
		const boundaryRoute = inner.router.looseRoutesById[boundaryMatch.routeId];
		const defaultNotFoundComponent = inner.router.options?.defaultNotFoundComponent;
		if (!boundaryRoute.options.notFoundComponent && defaultNotFoundComponent) boundaryRoute.options.notFoundComponent = defaultNotFoundComponent;
		notFoundToThrow.routeId = boundaryMatch.routeId;
		const boundaryIsRoot = boundaryMatch.routeId === inner.router.routeTree.id;
		inner.updateMatch(boundaryMatch.id, (prev) => ({
			...prev,
			...boundaryIsRoot ? {
				status: "success",
				globalNotFound: true,
				error: void 0
			} : {
				status: "notFound",
				error: notFoundToThrow
			},
			isFetching: false
		}));
		headMaxIndex = renderedBoundaryIndex;
		await loadRouteChunk(boundaryRoute, ["notFoundComponent"]);
	} else if (!inner.preload) {
		const rootMatch = inner.matches[0];
		if (!rootMatch.globalNotFound) {
			if (inner.router.getMatch(rootMatch.id)?.globalNotFound) inner.updateMatch(rootMatch.id, (prev) => ({
				...prev,
				globalNotFound: false,
				error: void 0
			}));
		}
	}
	if (inner.serialError && inner.firstBadMatchIndex !== void 0) {
		const errorRoute = inner.router.looseRoutesById[inner.matches[inner.firstBadMatchIndex].routeId];
		await loadRouteChunk(errorRoute, ["errorComponent"]);
	}
	for (let i = 0; i <= headMaxIndex; i++) {
		const { id: matchId, routeId } = inner.matches[i];
		const route = inner.router.looseRoutesById[routeId];
		try {
			const headResult = executeHead(inner, matchId, route);
			if (headResult) {
				const head = await headResult;
				inner.updateMatch(matchId, (prev) => ({
					...prev,
					...head
				}));
			}
		} catch (err) {
			console.error(`Error executing head for route ${routeId}:`, err);
		}
	}
	const readyPromise = triggerOnReady(inner);
	if (isPromise(readyPromise)) await readyPromise;
	if (notFoundToThrow) throw notFoundToThrow;
	if (inner.serialError && !inner.preload && !inner.onReady) throw inner.serialError;
	return inner.matches;
}
function preloadRouteComponents(route, componentTypesToLoad) {
	const preloads = componentTypesToLoad.map((type) => route.options[type]?.preload?.()).filter(Boolean);
	if (preloads.length === 0) return void 0;
	return Promise.all(preloads);
}
function loadRouteChunk(route, componentTypesToLoad = componentTypes) {
	if (!route._lazyLoaded && route._lazyPromise === void 0) if (route.lazyFn) route._lazyPromise = route.lazyFn().then((lazyRoute) => {
		const { id: _id, ...options } = lazyRoute.options;
		Object.assign(route.options, options);
		route._lazyLoaded = true;
		route._lazyPromise = void 0;
	});
	else route._lazyLoaded = true;
	const runAfterLazy = () => route._componentsLoaded ? void 0 : componentTypesToLoad === componentTypes ? (() => {
		if (route._componentsPromise === void 0) {
			const componentsPromise = preloadRouteComponents(route, componentTypes);
			if (componentsPromise) route._componentsPromise = componentsPromise.then(() => {
				route._componentsLoaded = true;
				route._componentsPromise = void 0;
			});
			else route._componentsLoaded = true;
		}
		return route._componentsPromise;
	})() : preloadRouteComponents(route, componentTypesToLoad);
	return route._lazyPromise ? route._lazyPromise.then(runAfterLazy) : runAfterLazy();
}
function makeMaybe(value, error) {
	if (error) return {
		status: "error",
		error
	};
	return {
		status: "success",
		value
	};
}
function routeNeedsPreload(route) {
	for (const componentType of componentTypes) if (route.options[componentType]?.preload) return true;
	return false;
}
var componentTypes = [
	"component",
	"errorComponent",
	"pendingComponent",
	"notFoundComponent"
];
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/router.js
/**
* Compute whether path, href or hash changed between previous and current
* resolved locations.
*/
function getLocationChangeInfo(location, resolvedLocation) {
	const fromLocation = resolvedLocation;
	const toLocation = location;
	return {
		fromLocation,
		toLocation,
		pathChanged: fromLocation?.pathname !== toLocation.pathname,
		hrefChanged: fromLocation?.href !== toLocation.href,
		hashChanged: fromLocation?.hash !== toLocation.hash
	};
}
/**
* Core, framework-agnostic router engine that powers TanStack Router.
*
* Provides navigation, matching, loading, preloading, caching and event APIs
* used by framework adapters (React/Solid). Prefer framework helpers like
* `createRouter` in app code.
*
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/RouterType
*/
var RouterCore = class {
	/**
	* @deprecated Use the `createRouter` function instead
	*/
	constructor(options, getStoreConfig) {
		this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
		this._scroll = { next: true };
		this.shouldViewTransition = void 0;
		this.isViewTransitionTypesSupported = void 0;
		this.subscribers = /* @__PURE__ */ new Set();
		this.routeBranchCache = /* @__PURE__ */ new WeakMap();
		this.lightweightCache = /* @__PURE__ */ new WeakMap();
		this.startTransition = (fn) => fn();
		this.update = (newOptions) => {
			const prevOptions = this.options;
			const prevBasepath = this.basepath ?? prevOptions?.basepath ?? "/";
			const basepathWasUnset = this.basepath === void 0;
			const prevRewriteOption = prevOptions?.rewrite;
			this.options = {
				...prevOptions,
				...newOptions
			};
			this.isServer = this.options.isServer ?? typeof document === "undefined";
			this.protocolAllowlist = new Set(this.options.protocolAllowlist);
			if (this.options.pathParamsAllowedCharacters) this.pathParamsDecoder = compileDecodeCharMap(this.options.pathParamsAllowedCharacters);
			if (!this.history || this.options.history && this.options.history !== this.history) if (!this.options.history) {} else this.history = this.options.history;
			this.origin = this.options.origin;
			if (!this.origin) this.origin = "http://localhost";
			if (this.history) this.updateLatestLocation();
			if (this.options.routeTree !== this.routeTree) {
				this.routeTree = this.options.routeTree;
				let processRouteTreeResult;
				if (globalThis.__TSR_CACHE__ && globalThis.__TSR_CACHE__.routeTree === this.routeTree) {
					const cached = globalThis.__TSR_CACHE__;
					this.resolvePathCache = cached.resolvePathCache;
					processRouteTreeResult = cached.processRouteTreeResult;
				} else {
					this.resolvePathCache = createLRUCache(1e3);
					processRouteTreeResult = this.buildRouteTree();
					if (globalThis.__TSR_CACHE__ === void 0) globalThis.__TSR_CACHE__ = {
						routeTree: this.routeTree,
						processRouteTreeResult,
						resolvePathCache: this.resolvePathCache
					};
				}
				this.setRoutes(processRouteTreeResult);
			}
			if (!this.stores && this.latestLocation) {
				const config = this.getStoreConfig(this);
				this.batch = config.batch;
				this.stores = createRouterStores(getInitialRouterState(this.latestLocation), config);
			}
			let needsLocationUpdate = false;
			const nextBasepath = this.options.basepath ?? "/";
			const nextRewriteOption = this.options.rewrite;
			if (basepathWasUnset || prevBasepath !== nextBasepath || prevRewriteOption !== nextRewriteOption) {
				this.basepath = nextBasepath;
				const rewrites = [];
				const trimmed = trimPath(nextBasepath);
				if (trimmed && trimmed !== "/") rewrites.push(rewriteBasepath({ basepath: nextBasepath }));
				if (nextRewriteOption) rewrites.push(nextRewriteOption);
				this.rewrite = rewrites.length === 0 ? void 0 : rewrites.length === 1 ? rewrites[0] : composeRewrites(rewrites);
				if (this.history) this.updateLatestLocation();
				needsLocationUpdate = true;
			}
			if (needsLocationUpdate && this.stores) this.stores.location.set(this.latestLocation);
			if (typeof window !== "undefined" && "CSS" in window && typeof window.CSS?.supports === "function") this.isViewTransitionTypesSupported = window.CSS.supports("selector(:active-view-transition-type(a))");
		};
		this.updateLatestLocation = () => {
			this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
		};
		this.buildRouteTree = () => {
			const result = processRouteTree(this.routeTree, this.options.caseSensitive, (route, i) => {
				route.init({ originalIndex: i });
			});
			if (this.options.routeMasks) processRouteMasks(this.options.routeMasks, result.processedTree);
			return result;
		};
		this.subscribe = (eventType, fn) => {
			const listener = {
				eventType,
				fn
			};
			this.subscribers.add(listener);
			return () => {
				this.subscribers.delete(listener);
			};
		};
		this.emit = (routerEvent) => {
			this.subscribers.forEach((listener) => {
				if (listener.eventType === routerEvent.type) listener.fn(routerEvent);
			});
		};
		this.parseLocation = (locationToParse, previousLocation) => {
			const parse = ({ pathname, search, hash, href, state }) => {
				if (!this.rewrite && !/[ \x00-\x1f\x7f\u0080-\uffff]/.test(pathname)) {
					const parsedSearch = this.options.parseSearch(search);
					const searchStr = this.options.stringifySearch(parsedSearch);
					return {
						href: pathname + searchStr + hash,
						publicHref: pathname + searchStr + hash,
						pathname: decodePath(pathname).path,
						external: false,
						searchStr,
						search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
						hash: decodePath(hash.slice(1)).path,
						state: replaceEqualDeep(previousLocation?.state, state)
					};
				}
				const fullUrl = new URL(href, this.origin);
				const url = executeRewriteInput(this.rewrite, fullUrl);
				const parsedSearch = this.options.parseSearch(url.search);
				const searchStr = this.options.stringifySearch(parsedSearch);
				url.search = searchStr;
				return {
					href: url.href.replace(url.origin, ""),
					publicHref: href,
					pathname: decodePath(url.pathname).path,
					external: !!this.rewrite && url.origin !== this.origin,
					searchStr,
					search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
					hash: decodePath(url.hash.slice(1)).path,
					state: replaceEqualDeep(previousLocation?.state, state)
				};
			};
			const location = parse(locationToParse);
			const { __tempLocation, __tempKey } = location.state;
			if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
				const parsedTempLocation = parse(__tempLocation);
				parsedTempLocation.state.key = location.state.key;
				parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
				delete parsedTempLocation.state.__tempLocation;
				return {
					...parsedTempLocation,
					maskedLocation: location
				};
			}
			return location;
		};
		this.resolvePathWithBase = (from, path) => {
			return resolvePath({
				base: from,
				to: path.includes("//") ? cleanPath(path) : path,
				trailingSlash: this.options.trailingSlash,
				cache: this.resolvePathCache
			});
		};
		this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
			if (typeof pathnameOrNext === "string") return this.matchRoutesInternal({
				pathname: pathnameOrNext,
				search: locationSearchOrOpts
			}, opts);
			return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
		};
		this.getMatchedRoutes = (pathname) => {
			return getMatchedRoutes({
				pathname,
				routesById: this.routesById,
				processedTree: this.processedTree
			});
		};
		this.cancelMatch = (id) => {
			const match = this.getMatch(id);
			if (!match) return;
			match.abortController.abort();
			clearTimeout(match._nonReactive.pendingTimeout);
			match._nonReactive.pendingTimeout = void 0;
		};
		this.cancelMatches = () => {
			this.stores.pendingIds.get().forEach((matchId) => {
				this.cancelMatch(matchId);
			});
			this.stores.matchesId.get().forEach((matchId) => {
				if (this.stores.pendingMatchStores.has(matchId)) return;
				const match = this.stores.matchStores.get(matchId)?.get();
				if (!match) return;
				if (match.status === "pending" || match.isFetching === "loader") this.cancelMatch(matchId);
			});
		};
		this.buildLocation = (opts) => {
			const build = (dest = {}) => {
				const currentLocation = dest._fromLocation || this.pendingBuiltLocation || this.latestLocation;
				const lightweightResult = this.matchRoutesLightweight(currentLocation);
				if (dest.from && false);
				const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lightweightResult.fullPath;
				const destTo = dest.to ? `${dest.to}` : void 0;
				const fromSearch = lightweightResult.search;
				const fromParams = Object.assign(Object.create(null), lightweightResult.params);
				const sourcePath = destTo?.charCodeAt(0) === 47 ? "/" : this.resolvePathWithBase(defaultedFromPath, ".");
				const nextTo = destTo ? this.resolvePathWithBase(sourcePath, destTo) : sourcePath;
				const nextParams = dest.params === false || dest.params === null ? Object.create(null) : (dest.params ?? true) === true ? fromParams : Object.assign(fromParams, functionalUpdate(dest.params, fromParams));
				const destRoute = this.routesByPath[trimPathRight(nextTo)];
				let destRoutes;
				if (destRoute) destRoutes = this.getRouteBranch(destRoute);
				else if (nextTo.includes("$")) destRoutes = [];
				else {
					const destMatchResult = this.getMatchedRoutes(nextTo);
					destRoutes = destMatchResult.matchedRoutes;
					if (this.options.notFoundRoute && (!destMatchResult.foundRoute || destMatchResult.foundRoute.path !== "/" && destMatchResult.routeParams["**"])) destRoutes = [...destRoutes, this.options.notFoundRoute];
				}
				if (destRoutes.length && hasKeys(nextParams)) for (const route of destRoutes) {
					const fn = route.options.params?.stringify ?? route.options.stringifyParams;
					if (fn) try {
						Object.assign(nextParams, fn(nextParams));
					} catch {}
				}
				const nextPathname = opts.leaveParams ? nextTo : decodePath(interpolatePath({
					path: nextTo,
					params: nextParams,
					decoder: this.pathParamsDecoder,
					server: this.isServer
				}).interpolatedPath).path;
				let nextSearch = fromSearch;
				if (opts._includeValidateSearch && this.options.search?.strict) {
					const validatedSearch = {};
					destRoutes.forEach((route) => {
						if (route.options.validateSearch) try {
							Object.assign(validatedSearch, validateSearch(route.options.validateSearch, {
								...validatedSearch,
								...nextSearch
							}));
						} catch {}
					});
					nextSearch = validatedSearch;
				}
				nextSearch = applySearchMiddleware({
					search: nextSearch,
					dest,
					destRoutes,
					_includeValidateSearch: opts._includeValidateSearch
				});
				nextSearch = nullReplaceEqualDeep(fromSearch, nextSearch);
				const searchStr = this.options.stringifySearch(nextSearch);
				const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate(dest.hash, currentLocation.hash) : void 0;
				const hashStr = hash ? `#${hash}` : "";
				let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate(dest.state, currentLocation.state) : {};
				nextState = replaceEqualDeep(currentLocation.state, nextState);
				const fullPath = `${nextPathname}${searchStr}${hashStr}`;
				let href;
				let publicHref;
				let external = false;
				if (this.rewrite) {
					const url = new URL(fullPath, this.origin);
					const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
					href = url.href.replace(url.origin, "");
					if (rewrittenUrl.origin !== this.origin) {
						publicHref = rewrittenUrl.href;
						external = true;
					} else publicHref = rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash;
				} else {
					href = encodePathLikeUrl(fullPath);
					publicHref = href;
				}
				return {
					publicHref,
					href,
					pathname: nextPathname,
					search: nextSearch,
					searchStr,
					state: nextState,
					hash: hash ?? "",
					external,
					unmaskOnReload: dest.unmaskOnReload
				};
			};
			const buildWithMatches = (dest = {}, maskedDest) => {
				const next = build(dest);
				let maskedNext = maskedDest ? build(maskedDest) : void 0;
				if (!maskedNext) {
					const params = Object.create(null);
					if (this.options.routeMasks) {
						const match = findFlatMatch(next.pathname, this.processedTree);
						if (match) {
							Object.assign(params, match.rawParams);
							const { from: _from, params: maskParams, ...maskProps } = match.route;
							const nextParams = maskParams === false || maskParams === null ? Object.create(null) : (maskParams ?? true) === true ? params : Object.assign(params, functionalUpdate(maskParams, params));
							maskedDest = {
								from: opts.from,
								...maskProps,
								params: nextParams
							};
							maskedNext = build(maskedDest);
						}
					}
				}
				if (maskedNext) next.maskedLocation = maskedNext;
				return next;
			};
			if (opts.mask) return buildWithMatches(opts, {
				from: opts.from,
				...opts.mask
			});
			return buildWithMatches(opts);
		};
		this.commitLocation = async ({ viewTransition, ignoreBlocker, ...next }) => {
			let historyAction;
			const isSameState = () => {
				const ignoredProps = [
					"key",
					"__TSR_key",
					"__TSR_index",
					"__hashScrollIntoViewOptions"
				];
				ignoredProps.forEach((prop) => {
					next.state[prop] = this.latestLocation.state[prop];
				});
				const isEqual = deepEqual(next.state, this.latestLocation.state);
				ignoredProps.forEach((prop) => {
					delete next.state[prop];
				});
				return isEqual;
			};
			const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next.href);
			let previousCommitPromise = this.commitLocationPromise;
			this.commitLocationPromise = createControlledPromise(() => {
				previousCommitPromise?.resolve();
				previousCommitPromise = void 0;
			});
			if (isSameUrl && isSameState()) this.load();
			else {
				let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
				if (maskedLocation) {
					nextHistory = {
						...maskedLocation,
						state: {
							...maskedLocation.state,
							__tempKey: void 0,
							__tempLocation: {
								...nextHistory,
								search: nextHistory.searchStr,
								state: {
									...nextHistory.state,
									__tempKey: void 0,
									__tempLocation: void 0,
									__TSR_key: void 0,
									key: void 0
								}
							}
						}
					};
					if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) nextHistory.state.__tempKey = this.tempLocationKey;
				}
				nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
				this.shouldViewTransition = viewTransition;
				historyAction = next.replace ? "REPLACE" : "PUSH";
				this.history[historyAction === "REPLACE" ? "replace" : "push"](nextHistory.publicHref, nextHistory.state, { ignoreBlocker });
			}
			this._scroll.next = next.resetScroll ?? true;
			if (!this.history.subscribers.size) this.load(historyAction ? { action: { type: historyAction } } : void 0);
			return this.commitLocationPromise;
		};
		this.buildAndCommitLocation = ({ replace, resetScroll, hashScrollIntoView, viewTransition, ignoreBlocker, href, ...rest } = {}) => {
			if (href) {
				const currentIndex = this.history.location.state.__TSR_index;
				const parsed = parseHref(href, { __TSR_index: replace ? currentIndex : currentIndex + 1 });
				const hrefUrl = new URL(parsed.pathname, this.origin);
				rest.to = executeRewriteInput(this.rewrite, hrefUrl).pathname;
				rest.search = this.options.parseSearch(parsed.search);
				rest.hash = parsed.hash.slice(1);
			}
			const location = this.buildLocation({
				...rest,
				_includeValidateSearch: true
			});
			this.pendingBuiltLocation = location;
			const commitPromise = this.commitLocation({
				...location,
				viewTransition,
				replace,
				resetScroll,
				hashScrollIntoView,
				ignoreBlocker
			});
			queueMicrotask(() => {
				if (this.pendingBuiltLocation === location) this.pendingBuiltLocation = void 0;
			});
			return commitPromise;
		};
		this.navigate = async ({ to, reloadDocument, href, publicHref, ...rest }) => {
			let hrefIsUrl = false;
			if (href) try {
				new URL(`${href}`);
				hrefIsUrl = true;
			} catch {}
			if (hrefIsUrl && !reloadDocument) reloadDocument = true;
			if (reloadDocument) {
				if (to !== void 0 || !href) {
					const location = this.buildLocation({
						to,
						...rest
					});
					href = href ?? location.publicHref;
					publicHref = publicHref ?? location.publicHref;
				}
				const reloadHref = !hrefIsUrl && publicHref ? publicHref : href;
				if (isDangerousProtocol(reloadHref, this.protocolAllowlist)) return;
				if (!rest.ignoreBlocker) {
					const blockers = this.history.getBlockers?.() ?? [];
					for (const blocker of blockers) if (blocker?.blockerFn) {
						if (await blocker.blockerFn({
							currentLocation: this.latestLocation,
							nextLocation: this.latestLocation,
							action: "PUSH"
						})) return;
					}
				}
				if (rest.replace) window.location.replace(reloadHref);
				else window.location.href = reloadHref;
				return;
			}
			return this.buildAndCommitLocation({
				...rest,
				href,
				to,
				_isNavigate: true
			});
		};
		this.beforeLoad = () => {
			this.cancelMatches();
			this.updateLatestLocation();
			{
				const nextLocation = this.buildLocation({
					to: this.latestLocation.pathname,
					search: true,
					params: true,
					hash: true,
					state: true,
					_includeValidateSearch: true
				});
				if (this.latestLocation.publicHref !== nextLocation.publicHref) {
					const href = this.getParsedLocationHref(nextLocation);
					if (nextLocation.external) throw redirect({ href });
					else throw redirect({
						href,
						_builtLocation: nextLocation
					});
				}
			}
			const pendingMatches = this.matchRoutes(this.latestLocation);
			const nextCachedMatches = this.stores.cachedMatches.get().filter((d) => !pendingMatches.some((e) => e.id === d.id));
			this.batch(() => {
				this.stores.status.set("pending");
				this.stores.statusCode.set(200);
				this.stores.isLoading.set(true);
				this.stores.location.set(this.latestLocation);
				this.stores.setPending(pendingMatches);
				this.stores.setCached(nextCachedMatches);
			});
		};
		this.load = async (opts) => {
			const historyAction = opts?.action?.type;
			let redirect;
			let notFound;
			let loadPromise;
			const previousLocation = this.stores.resolvedLocation.get() ?? this.stores.location.get();
			loadPromise = new Promise((resolve) => {
				this.startTransition(async () => {
					try {
						this.beforeLoad();
						if (historyAction) this._scroll.hash = historyAction === "PUSH" || historyAction === "REPLACE";
						const next = this.latestLocation;
						const locationChangeInfo = getLocationChangeInfo(next, this.stores.resolvedLocation.get());
						if (!this.stores.redirect.get()) this.emit({
							type: "onBeforeNavigate",
							...locationChangeInfo
						});
						this.emit({
							type: "onBeforeLoad",
							...locationChangeInfo
						});
						await loadMatches({
							router: this,
							sync: opts?.sync,
							forceStaleReload: previousLocation.href === next.href,
							matches: this.stores.pendingMatches.get(),
							location: next,
							updateMatch: this.updateMatch,
							onReady: async () => {
								this.startTransition(() => {
									this.startViewTransition(async () => {
										let exitingMatches = null;
										let hookExitingMatches = null;
										let hookEnteringMatches = null;
										let hookStayingMatches = null;
										this.batch(() => {
											const pendingMatches = this.stores.pendingMatches.get();
											const mountPending = pendingMatches.length;
											const currentMatches = this.stores.matches.get();
											exitingMatches = mountPending ? currentMatches.filter((match) => !this.stores.pendingMatchStores.has(match.id)) : null;
											const pendingRouteIds = /* @__PURE__ */ new Set();
											for (const s of this.stores.pendingMatchStores.values()) if (s.routeId) pendingRouteIds.add(s.routeId);
											const activeRouteIds = /* @__PURE__ */ new Set();
											for (const s of this.stores.matchStores.values()) if (s.routeId) activeRouteIds.add(s.routeId);
											hookExitingMatches = mountPending ? currentMatches.filter((match) => !pendingRouteIds.has(match.routeId)) : null;
											hookEnteringMatches = mountPending ? pendingMatches.filter((match) => !activeRouteIds.has(match.routeId)) : null;
											hookStayingMatches = mountPending ? pendingMatches.filter((match) => activeRouteIds.has(match.routeId)) : currentMatches;
											this.stores.isLoading.set(false);
											this.stores.loadedAt.set(Date.now());
											/**
											* When committing new matches, cache any exiting matches that are still usable.
											* Routes that resolved with `status: 'error'` or `status: 'notFound'` are
											* deliberately excluded from `cachedMatches` so that subsequent invalidations
											* or reloads re-run their loaders instead of reusing the failed/not-found data.
											*/
											if (mountPending) {
												this.stores.setMatches(pendingMatches);
												this.stores.setPending([]);
												this.stores.setCached([...this.stores.cachedMatches.get(), ...exitingMatches.filter((d) => d.status !== "error" && d.status !== "notFound" && d.status !== "redirected")]);
												this.clearExpiredCache();
											}
										});
										for (const [matches, hook] of [
											[hookExitingMatches, "onLeave"],
											[hookEnteringMatches, "onEnter"],
											[hookStayingMatches, "onStay"]
										]) {
											if (!matches) continue;
											for (const match of matches) this.looseRoutesById[match.routeId].options[hook]?.(match);
										}
									});
								});
							}
						});
					} catch (err) {
						if (isRedirect(err)) redirect = err;
						else if (isNotFound(err)) notFound = err;
						const nextStatusCode = redirect ? redirect.status : notFound ? 404 : this.stores.matches.get().some((d) => d.status === "error") ? 500 : 200;
						this.batch(() => {
							this.stores.statusCode.set(nextStatusCode);
							this.stores.redirect.set(redirect);
						});
					}
					if (this.latestLoadPromise === loadPromise) {
						this.commitLocationPromise?.resolve();
						this.latestLoadPromise = void 0;
						this.commitLocationPromise = void 0;
					}
					resolve();
				});
			});
			this.latestLoadPromise = loadPromise;
			await loadPromise;
			while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) await this.latestLoadPromise;
			let newStatusCode = void 0;
			if (this.hasNotFoundMatch()) newStatusCode = 404;
			else if (this.stores.matches.get().some((d) => d.status === "error")) newStatusCode = 500;
			if (newStatusCode !== void 0) this.stores.statusCode.set(newStatusCode);
		};
		this.startViewTransition = (fn) => {
			const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
			this.shouldViewTransition = void 0;
			if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
				let startViewTransitionParams;
				if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
					const next = this.latestLocation;
					const prevLocation = this.stores.resolvedLocation.get();
					const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(getLocationChangeInfo(next, prevLocation)) : shouldViewTransition.types;
					if (resolvedViewTransitionTypes === false) {
						fn();
						return;
					}
					startViewTransitionParams = {
						update: fn,
						types: resolvedViewTransitionTypes
					};
				} else startViewTransitionParams = fn;
				document.startViewTransition(startViewTransitionParams);
			} else fn();
		};
		this.updateMatch = (id, updater) => {
			this.startTransition(() => {
				const pendingMatch = this.stores.pendingMatchStores.get(id);
				if (pendingMatch) {
					pendingMatch.set(updater);
					return;
				}
				const activeMatch = this.stores.matchStores.get(id);
				if (activeMatch) {
					activeMatch.set(updater);
					return;
				}
				const cachedMatch = this.stores.cachedMatchStores.get(id);
				if (cachedMatch) {
					const next = updater(cachedMatch.get());
					if (next.status === "redirected") {
						if (this.stores.cachedMatchStores.delete(id)) this.stores.cachedIds.set((prev) => prev.filter((matchId) => matchId !== id));
					} else cachedMatch.set(next);
				}
			});
		};
		this.getMatch = (matchId) => {
			return this.stores.cachedMatchStores.get(matchId)?.get() ?? this.stores.pendingMatchStores.get(matchId)?.get() ?? this.stores.matchStores.get(matchId)?.get();
		};
		this.invalidate = (opts) => {
			const invalidate = (d) => {
				if (opts?.filter?.(d) ?? true) return {
					...d,
					invalid: true,
					...opts?.forcePending || d.status === "error" || d.status === "notFound" ? {
						status: "pending",
						error: void 0
					} : void 0
				};
				return d;
			};
			this.batch(() => {
				this.stores.setMatches(this.stores.matches.get().map(invalidate));
				this.stores.setCached(this.stores.cachedMatches.get().map(invalidate));
				this.stores.setPending(this.stores.pendingMatches.get().map(invalidate));
			});
			this.shouldViewTransition = false;
			return this.load({ sync: opts?.sync });
		};
		this.getParsedLocationHref = (location) => {
			return location.publicHref || "/";
		};
		this.resolveRedirect = (redirect) => {
			const locationHeader = redirect.headers.get("Location");
			if (!redirect.options.href || redirect.options._builtLocation) {
				const location = redirect.options._builtLocation ?? this.buildLocation(redirect.options);
				const href = this.getParsedLocationHref(location);
				redirect.options.href = href;
				redirect.headers.set("Location", href);
			} else if (locationHeader) try {
				const url = new URL(locationHeader);
				if (this.origin && url.origin === this.origin) {
					const href = url.pathname + url.search + url.hash;
					redirect.options.href = href;
					redirect.headers.set("Location", href);
				}
			} catch {}
			if (redirect.options.href && !redirect.options._builtLocation && isDangerousProtocol(redirect.options.href, this.protocolAllowlist)) throw new Error("Redirect blocked: unsafe protocol");
			if (!redirect.headers.get("Location")) redirect.headers.set("Location", redirect.options.href);
			return redirect;
		};
		this.clearCache = (opts) => {
			const filter = opts?.filter;
			if (filter !== void 0) this.stores.setCached(this.stores.cachedMatches.get().filter((m) => !filter(m)));
			else this.stores.setCached([]);
		};
		this.clearExpiredCache = () => {
			const now = Date.now();
			const filter = (d) => {
				const route = this.looseRoutesById[d.routeId];
				if (!route.options.loader) return true;
				const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 3e5;
				if (d.status === "error") return true;
				return now - d.updatedAt >= gcTime;
			};
			this.clearCache({ filter });
		};
		this.loadRouteChunk = loadRouteChunk;
		this.preloadRoute = async (opts) => {
			const next = opts._builtLocation ?? this.buildLocation(opts);
			let matches = this.matchRoutes(next, {
				throwOnError: true,
				preload: true,
				dest: opts
			});
			const activeMatchIds = /* @__PURE__ */ new Set([...this.stores.matchesId.get(), ...this.stores.pendingIds.get()]);
			const loadedMatchIds = /* @__PURE__ */ new Set([...activeMatchIds, ...this.stores.cachedIds.get()]);
			const matchesToCache = matches.filter((match) => !loadedMatchIds.has(match.id));
			if (matchesToCache.length) {
				const cachedMatches = this.stores.cachedMatches.get();
				this.stores.setCached([...cachedMatches, ...matchesToCache]);
			}
			try {
				matches = await loadMatches({
					router: this,
					matches,
					location: next,
					preload: true,
					updateMatch: (id, updater) => {
						if (activeMatchIds.has(id)) matches = matches.map((d) => d.id === id ? updater(d) : d);
						else this.updateMatch(id, updater);
					}
				});
				return matches;
			} catch (err) {
				if (isRedirect(err)) {
					if (err.options.reloadDocument) return;
					return await this.preloadRoute({
						...err.options,
						_fromLocation: next
					});
				}
				if (!isNotFound(err)) console.error(err);
				return;
			}
		};
		this.matchRoute = (location, opts) => {
			const matchLocation = {
				...location,
				to: location.to ? this.resolvePathWithBase(location.from || "", location.to) : void 0,
				params: location.params || {},
				leaveParams: true
			};
			const next = this.buildLocation(matchLocation);
			if (opts?.pending && this.stores.status.get() !== "pending") return false;
			const baseLocation = (opts?.pending === void 0 ? !this.stores.isLoading.get() : opts.pending) ? this.latestLocation : this.stores.resolvedLocation.get() || this.stores.location.get();
			const match = findSingleMatch(next.pathname, opts?.caseSensitive ?? false, opts?.fuzzy ?? false, baseLocation.pathname, this.processedTree);
			if (!match) return false;
			if (location.params) {
				if (!deepEqual(match.rawParams, location.params, { partial: true })) return false;
			}
			if (opts?.includeSearch ?? true) return deepEqual(baseLocation.search, next.search, { partial: true }) ? match.rawParams : false;
			return match.rawParams;
		};
		this.hasNotFoundMatch = () => {
			return this.stores.matches.get().some((d) => d.status === "notFound" || d.globalNotFound);
		};
		this.getStoreConfig = getStoreConfig;
		this.update({
			defaultPreloadDelay: 50,
			defaultPendingMs: 1e3,
			defaultPendingMinMs: 500,
			context: void 0,
			...options,
			caseSensitive: options.caseSensitive ?? false,
			notFoundMode: options.notFoundMode ?? "fuzzy",
			stringifySearch: options.stringifySearch ?? defaultStringifySearch,
			parseSearch: options.parseSearch ?? defaultParseSearch,
			protocolAllowlist: options.protocolAllowlist ?? DEFAULT_PROTOCOL_ALLOWLIST
		});
		if (typeof document !== "undefined") self.__TSR_ROUTER__ = this;
	}
	isShell() {
		return !!this.options.isShell;
	}
	isPrerendering() {
		return !!this.options.isPrerendering;
	}
	get state() {
		return this.stores.__store.get();
	}
	setRoutes({ routesById, routesByPath, processedTree }) {
		this.routesById = routesById;
		this.routesByPath = routesByPath;
		this.processedTree = processedTree;
		const notFoundRoute = this.options.notFoundRoute;
		if (notFoundRoute) {
			notFoundRoute.init({ originalIndex: 99999999999 });
			this.routesById[notFoundRoute.id] = notFoundRoute;
		}
	}
	getRouteBranch(route) {
		let branch = this.routeBranchCache.get(route);
		if (!branch) {
			branch = buildRouteBranch(route);
			this.routeBranchCache.set(route, branch);
		}
		return branch;
	}
	get looseRoutesById() {
		return this.routesById;
	}
	getParentContext(parentMatch) {
		return !parentMatch?.id ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
	}
	matchRoutesInternal(next, opts) {
		const matchedRoutesResult = this.getMatchedRoutes(next.pathname);
		const { foundRoute, routeParams } = matchedRoutesResult;
		let { matchedRoutes } = matchedRoutesResult;
		let isGlobalNotFound = false;
		if (foundRoute ? foundRoute.path !== "/" && routeParams["**"] : trimPathRight(next.pathname)) if (this.options.notFoundRoute) matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
		else isGlobalNotFound = true;
		const globalNotFoundRouteId = isGlobalNotFound ? findGlobalNotFoundRouteId(this.options.notFoundMode, matchedRoutes) : void 0;
		const matches = new Array(matchedRoutes.length);
		const previousActiveMatchesByRouteId = /* @__PURE__ */ new Map();
		for (const store of this.stores.matchStores.values()) if (store.routeId) previousActiveMatchesByRouteId.set(store.routeId, store.get());
		for (let index = 0; index < matchedRoutes.length; index++) {
			const route = matchedRoutes[index];
			const parentMatch = matches[index - 1];
			let preMatchSearch;
			let strictMatchSearch;
			let searchError;
			{
				const parentSearch = parentMatch?.search ?? next.search;
				const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
				try {
					const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
					preMatchSearch = {
						...parentSearch,
						...strictSearch
					};
					strictMatchSearch = {
						...parentStrictSearch,
						...strictSearch
					};
					searchError = void 0;
				} catch (err) {
					let searchParamError = err;
					if (!(err instanceof SearchParamError)) searchParamError = new SearchParamError(err.message, { cause: err });
					if (opts?.throwOnError) throw searchParamError;
					preMatchSearch = parentSearch;
					strictMatchSearch = {};
					searchError = searchParamError;
				}
			}
			const loaderDeps = route.options.loaderDeps?.({ search: preMatchSearch }) ?? "";
			const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
			const { interpolatedPath, usedParams } = interpolatePath({
				path: route.fullPath,
				params: routeParams,
				decoder: this.pathParamsDecoder,
				server: this.isServer
			});
			const matchId = route.id + interpolatedPath + loaderDepsHash;
			const existingMatch = this.getMatch(matchId);
			const previousMatch = previousActiveMatchesByRouteId.get(route.id);
			const strictParams = existingMatch?._strictParams ?? usedParams;
			let paramsError = void 0;
			if (!existingMatch) try {
				extractStrictParams(route, strictParams);
			} catch (err) {
				if (isNotFound(err) || isRedirect(err)) paramsError = err;
				else paramsError = new PathParamError(err.message, { cause: err });
				if (opts?.throwOnError) throw paramsError;
			}
			Object.assign(routeParams, strictParams);
			const cause = previousMatch ? "stay" : "enter";
			let match;
			if (existingMatch) match = {
				...existingMatch,
				cause,
				params: previousMatch?.params ?? routeParams,
				_strictParams: strictParams,
				search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : nullReplaceEqualDeep(existingMatch.search, preMatchSearch),
				_strictSearch: strictMatchSearch
			};
			else {
				const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
				match = {
					id: matchId,
					ssr: void 0,
					index,
					routeId: route.id,
					params: previousMatch?.params ?? routeParams,
					_strictParams: strictParams,
					pathname: interpolatedPath,
					updatedAt: Date.now(),
					search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
					_strictSearch: strictMatchSearch,
					searchError: void 0,
					status,
					isFetching: false,
					error: void 0,
					paramsError,
					__routeContext: void 0,
					_nonReactive: { loadPromise: createControlledPromise() },
					__beforeLoadContext: void 0,
					context: {},
					abortController: new AbortController(),
					fetchCount: 0,
					cause,
					loaderDeps: previousMatch ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
					invalid: false,
					preload: false,
					links: void 0,
					scripts: void 0,
					headScripts: void 0,
					meta: void 0,
					staticData: route.options.staticData || {},
					fullPath: route.fullPath
				};
			}
			if (!opts?.preload) match.globalNotFound = globalNotFoundRouteId === route.id;
			match.searchError = searchError;
			const parentContext = this.getParentContext(parentMatch);
			match.context = {
				...parentContext,
				...match.__routeContext,
				...match.__beforeLoadContext
			};
			matches[index] = match;
		}
		for (let index = 0; index < matches.length; index++) {
			const match = matches[index];
			const route = this.looseRoutesById[match.routeId];
			const existingMatch = this.getMatch(match.id);
			const previousMatch = previousActiveMatchesByRouteId.get(match.routeId);
			match.params = previousMatch ? nullReplaceEqualDeep(previousMatch.params, routeParams) : routeParams;
			if (!existingMatch) {
				const parentMatch = matches[index - 1];
				const parentContext = this.getParentContext(parentMatch);
				if (route.options.context) {
					const contextFnContext = {
						deps: match.loaderDeps,
						params: match.params,
						context: parentContext ?? {},
						location: next,
						navigate: (opts) => this.navigate({
							...opts,
							_fromLocation: next
						}),
						buildLocation: this.buildLocation,
						cause: match.cause,
						abortController: match.abortController,
						preload: !!match.preload,
						matches,
						routeId: route.id
					};
					match.__routeContext = route.options.context(contextFnContext) ?? void 0;
				}
				match.context = {
					...parentContext,
					...match.__routeContext,
					...match.__beforeLoadContext
				};
			}
		}
		return matches;
	}
	/**
	* Lightweight route matching for buildLocation.
	* Only computes fullPath, accumulated search, and params - skipping expensive
	* operations like AbortController, ControlledPromise, loaderDeps, and full match objects.
	*/
	matchRoutesLightweight(location) {
		const lastStateMatchId = last(this.stores.matchesId.get());
		const cached = this.lightweightCache.get(location);
		if (cached && cached[0] === lastStateMatchId) return cached[1];
		const { matchedRoutes, routeParams } = this.getMatchedRoutes(location.pathname);
		const lastRoute = last(matchedRoutes);
		const accumulatedSearch = { ...location.search };
		for (const route of matchedRoutes) try {
			Object.assign(accumulatedSearch, validateSearch(route.options.validateSearch, accumulatedSearch));
		} catch {}
		const lastStateMatch = lastStateMatchId && this.stores.matchStores.get(lastStateMatchId)?.get();
		const canReuseParams = lastStateMatch && lastStateMatch.routeId === lastRoute.id && lastStateMatch.pathname === location.pathname;
		let params;
		if (canReuseParams) params = lastStateMatch.params;
		else {
			const strictParams = Object.assign(Object.create(null), routeParams);
			for (const route of matchedRoutes) try {
				extractStrictParams(route, strictParams);
			} catch {}
			params = strictParams;
		}
		const result = {
			matchedRoutes,
			fullPath: lastRoute.fullPath,
			search: accumulatedSearch,
			params
		};
		this.lightweightCache.set(location, [lastStateMatchId, result]);
		return result;
	}
};
/** Error thrown when search parameter validation fails. */
var SearchParamError = class extends Error {};
/** Error thrown when path parameter parsing/validation fails. */
var PathParamError = class extends Error {};
/** Create an initial RouterState from a parsed location. */
function getInitialRouterState(location) {
	return {
		loadedAt: 0,
		isLoading: false,
		isTransitioning: false,
		status: "idle",
		resolvedLocation: void 0,
		location,
		matches: [],
		statusCode: 200
	};
}
function validateSearch(validateSearch, input) {
	if (validateSearch == null) return {};
	if ("~standard" in validateSearch) {
		const result = validateSearch["~standard"].validate(input);
		if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
		if (result.issues) throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), { cause: result });
		return result.value;
	}
	if ("parse" in validateSearch) return validateSearch.parse(input);
	if (typeof validateSearch === "function") return validateSearch(input);
	return {};
}
/**
* Build the matched route chain and extract params for a pathname.
* Falls back to the root route if no specific route is found.
*/
function getMatchedRoutes({ pathname, routesById, processedTree }) {
	const routeParams = Object.create(null);
	const trimmedPath = trimPathRight(pathname);
	let foundRoute = void 0;
	const match = findRouteMatch(trimmedPath, processedTree, true);
	if (match) {
		foundRoute = match.route;
		Object.assign(routeParams, match.rawParams);
	}
	return {
		matchedRoutes: match?.branch || [routesById["__root__"]],
		routeParams,
		foundRoute
	};
}
/**
* TODO: once caches are persisted across requests on the server,
* we can cache the built middleware chain using `last(destRoutes)` as the key
*/
function applySearchMiddleware({ search, dest, destRoutes, _includeValidateSearch }) {
	return buildMiddlewareChain(destRoutes)(search, dest, _includeValidateSearch ?? false);
}
function buildMiddlewareChain(destRoutes) {
	let dest;
	let includeValidateSearch;
	const middlewares = [];
	for (const route of destRoutes) {
		const routeOptions = route.options;
		if ("search" in routeOptions) {
			if (routeOptions.search?.middlewares) middlewares.push(...routeOptions.search.middlewares);
		} else if (routeOptions.preSearchFilters || routeOptions.postSearchFilters) {
			const legacyMiddleware = ({ search, next }) => {
				const result = next(routeOptions.preSearchFilters ? routeOptions.preSearchFilters.reduce((prev, next) => next(prev), search) : search);
				return routeOptions.postSearchFilters ? routeOptions.postSearchFilters.reduce((prev, next) => next(prev), result) : result;
			};
			middlewares.push(legacyMiddleware);
		}
		const routeValidateSearch = routeOptions.validateSearch;
		if (routeValidateSearch) {
			const validate = ({ search, next, meta }) => {
				const result = next(search);
				if (includeValidateSearch) try {
					const validated = validateSearch(routeValidateSearch, result);
					if (meta && validated) {
						for (const key in validated) if (!(key in result)) (meta.defaulted ||= /* @__PURE__ */ new Map()).set(key, validated[key]);
					}
					return {
						...result,
						...validated
					};
				} catch {}
				return result;
			};
			middlewares.push(validate);
		}
	}
	const applyNext = (index, currentSearch, meta) => {
		if (index >= middlewares.length) {
			if (!dest.search) return {};
			if (dest.search === true) return currentSearch;
			const result = functionalUpdate(dest.search, currentSearch);
			if (meta) meta.explicit = result;
			return result;
		}
		const next = (newSearch, collectMeta) => {
			if (collectMeta) {
				const nextMeta = meta || {};
				return {
					search: applyNext(index + 1, newSearch, nextMeta),
					meta: nextMeta
				};
			}
			return applyNext(index + 1, newSearch, meta);
		};
		return middlewares[index]({
			search: currentSearch,
			next,
			meta
		});
	};
	return function middleware(search, nextDest, _includeValidateSearch) {
		dest = nextDest;
		includeValidateSearch = _includeValidateSearch;
		return applyNext(0, search);
	};
}
function findGlobalNotFoundRouteId(notFoundMode, routes) {
	if (notFoundMode !== "root") for (let i = routes.length - 1; i >= 0; i--) {
		const route = routes[i];
		if (route.children) return route.id;
	}
	return rootRouteId;
}
function extractStrictParams(route, accumulatedParams) {
	const parseParams = route.options.params?.parse ?? route.options.parseParams;
	if (parseParams) {
		const result = parseParams(accumulatedParams);
		if (result === false) throw new Error("Route params.parse returned false for a matched route");
		Object.assign(accumulatedParams, result);
	}
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/link.js
var preloadWarning = "Error preloading route! ☝️";
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/manifest.js
function getAssetCrossOrigin(assetCrossOrigin, kind) {
	if (!assetCrossOrigin) return;
	if (typeof assetCrossOrigin === "string") return assetCrossOrigin;
	return assetCrossOrigin[kind];
}
function getManifestScriptFormat(manifest) {
	return manifest?.scriptFormat ?? "module";
}
function getScriptPreloadAttrs(manifest, link, assetCrossOrigin) {
	const preloadLink = resolveManifestAssetLink(link);
	const crossOrigin = getAssetCrossOrigin(assetCrossOrigin, "script") ?? preloadLink.crossOrigin;
	return {
		...getManifestScriptFormat(manifest) === "iife" ? {
			rel: "preload",
			as: "script"
		} : { rel: "modulepreload" },
		href: preloadLink.href,
		...crossOrigin ? { crossOrigin } : {}
	};
}
function resolveManifestAssetLink(link) {
	if (typeof link === "string") return {
		href: link,
		crossOrigin: void 0
	};
	return link;
}
function appendUniqueUserTags(target, tags) {
	if (tags.length === 0) return;
	if (tags.length === 1) {
		target.push(tags[0]);
		return;
	}
	const seen = /* @__PURE__ */ new Set();
	for (const tag of tags) {
		const key = JSON.stringify(tag);
		if (seen.has(key)) continue;
		seen.add(key);
		target.push(tag);
	}
}
function getStylesheetHref(asset) {
	return resolveManifestCssLink(asset).href;
}
function resolveManifestCssLink(link) {
	if (typeof link === "string") return {
		href: link,
		crossOrigin: void 0
	};
	return link;
}
function createInlineCssStyleAsset(css) {
	return {
		attrs: { suppressHydrationWarning: true },
		children: css
	};
}
function createInlineCssPlaceholderAsset() {
	return { attrs: { suppressHydrationWarning: true } };
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/route.js
var BaseRoute = class {
	get to() {
		return this._to;
	}
	get id() {
		return this._id;
	}
	get path() {
		return this._path;
	}
	get fullPath() {
		return this._fullPath;
	}
	constructor(options) {
		this.init = (opts) => {
			this.originalIndex = opts.originalIndex;
			const options = this.options;
			const isRoot = !options?.path && !options?.id;
			this.parentRoute = this.options.getParentRoute?.();
			if (isRoot) this._path = rootRouteId;
			else if (!this.parentRoute) invariant();
			let path = isRoot ? rootRouteId : options?.path;
			if (path && path !== "/") path = trimPathLeft(path);
			const customId = options?.id || path;
			let id = isRoot ? rootRouteId : joinPaths([this.parentRoute.id === "__root__" ? "" : this.parentRoute.id, customId]);
			if (path === "__root__") path = "/";
			if (id !== "__root__") id = joinPaths(["/", id]);
			const fullPath = id === "__root__" ? "/" : joinPaths([this.parentRoute.fullPath, path]);
			this._path = path;
			this._id = id;
			this._fullPath = fullPath;
			this._to = trimPathRight(fullPath);
		};
		this.addChildren = (children) => {
			return this._addFileChildren(children);
		};
		this._addFileChildren = (children) => {
			if (Array.isArray(children)) this.children = children;
			if (typeof children === "object" && children !== null) this.children = Object.values(children);
			return this;
		};
		this._addFileTypes = () => {
			return this;
		};
		this.updateLoader = (options) => {
			Object.assign(this.options, options);
			return this;
		};
		this.update = (options) => {
			Object.assign(this.options, options);
			return this;
		};
		this.lazy = (lazyFn) => {
			this.lazyFn = lazyFn;
			return this;
		};
		this.redirect = (opts) => redirect({
			from: this.fullPath,
			...opts
		});
		this.options = options || {};
		this.isRoot = !options?.getParentRoute;
		if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
	}
};
var BaseRootRoute = class extends BaseRoute {
	constructor(options) {
		super(options);
	}
};
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/constants.js
var GLOBAL_TSR = "$_TSR";
var TSR_SCRIPT_BARRIER_ID = "$tsr-stream-barrier";
//#endregion
//#region ../../node_modules/seroval/dist/index.js
var SYM_ASYNC_ITERATOR = Symbol.asyncIterator;
var SYM_HAS_INSTANCE = Symbol.hasInstance;
var SYM_IS_CONCAT_SPREADABLE = Symbol.isConcatSpreadable;
var SYM_ITERATOR = Symbol.iterator;
var SYM_MATCH = Symbol.match;
var SYM_MATCH_ALL = Symbol.matchAll;
var SYM_REPLACE = Symbol.replace;
var SYM_SEARCH = Symbol.search;
var SYM_SPECIES = Symbol.species;
var SYM_SPLIT = Symbol.split;
var SYM_TO_PRIMITIVE = Symbol.toPrimitive;
var SYM_TO_STRING_TAG = Symbol.toStringTag;
var SYM_UNSCOPABLES = Symbol.unscopables;
var SYMBOL_STRING = {
	[0]: "Symbol.asyncIterator",
	[1]: "Symbol.hasInstance",
	[2]: "Symbol.isConcatSpreadable",
	[3]: "Symbol.iterator",
	[4]: "Symbol.match",
	[5]: "Symbol.matchAll",
	[6]: "Symbol.replace",
	[7]: "Symbol.search",
	[8]: "Symbol.species",
	[9]: "Symbol.split",
	[10]: "Symbol.toPrimitive",
	[11]: "Symbol.toStringTag",
	[12]: "Symbol.unscopables"
};
var INV_SYMBOL_REF = {
	[SYM_ASYNC_ITERATOR]: 0,
	[SYM_HAS_INSTANCE]: 1,
	[SYM_IS_CONCAT_SPREADABLE]: 2,
	[SYM_ITERATOR]: 3,
	[SYM_MATCH]: 4,
	[SYM_MATCH_ALL]: 5,
	[SYM_REPLACE]: 6,
	[SYM_SEARCH]: 7,
	[SYM_SPECIES]: 8,
	[SYM_SPLIT]: 9,
	[SYM_TO_PRIMITIVE]: 10,
	[SYM_TO_STRING_TAG]: 11,
	[SYM_UNSCOPABLES]: 12
};
var SYMBOL_REF = {
	[0]: SYM_ASYNC_ITERATOR,
	[1]: SYM_HAS_INSTANCE,
	[2]: SYM_IS_CONCAT_SPREADABLE,
	[3]: SYM_ITERATOR,
	[4]: SYM_MATCH,
	[5]: SYM_MATCH_ALL,
	[6]: SYM_REPLACE,
	[7]: SYM_SEARCH,
	[8]: SYM_SPECIES,
	[9]: SYM_SPLIT,
	[10]: SYM_TO_PRIMITIVE,
	[11]: SYM_TO_STRING_TAG,
	[12]: SYM_UNSCOPABLES
};
var CONSTANT_STRING = {
	[2]: "!0",
	[3]: "!1",
	[1]: "void 0",
	[0]: "null",
	[4]: "-0",
	[5]: "1/0",
	[6]: "-1/0",
	[7]: "0/0"
};
var CONSTANT_VAL = {
	[2]: true,
	[3]: false,
	[1]: void 0,
	[0]: null,
	[4]: -0,
	[5]: Number.POSITIVE_INFINITY,
	[6]: Number.NEGATIVE_INFINITY,
	[7]: NaN
};
var ERROR_CONSTRUCTOR_STRING = {
	[0]: "Error",
	[1]: "EvalError",
	[2]: "RangeError",
	[3]: "ReferenceError",
	[4]: "SyntaxError",
	[5]: "TypeError",
	[6]: "URIError"
};
var ERROR_CONSTRUCTOR = {
	[0]: Error,
	[1]: EvalError,
	[2]: RangeError,
	[3]: ReferenceError,
	[4]: SyntaxError,
	[5]: TypeError,
	[6]: URIError
};
function createSerovalNode(t, i, s, c, m, p, e, a, f, b, o, l) {
	return {
		t,
		i,
		s,
		c,
		m,
		p,
		e,
		a,
		f,
		b,
		o,
		l
	};
}
function createConstantNode(value) {
	return createSerovalNode(2, void 0, value, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
var TRUE_NODE = /* @__PURE__ */ createConstantNode(2);
var FALSE_NODE = /* @__PURE__ */ createConstantNode(3);
var UNDEFINED_NODE = /* @__PURE__ */ createConstantNode(1);
var NULL_NODE = /* @__PURE__ */ createConstantNode(0);
var NEG_ZERO_NODE = /* @__PURE__ */ createConstantNode(4);
var INFINITY_NODE = /* @__PURE__ */ createConstantNode(5);
var NEG_INFINITY_NODE = /* @__PURE__ */ createConstantNode(6);
var NAN_NODE = /* @__PURE__ */ createConstantNode(7);
function serializeChar(str) {
	switch (str) {
		case "\"": return "\\\"";
		case "\\": return "\\\\";
		case "\n": return "\\n";
		case "\r": return "\\r";
		case "\b": return "\\b";
		case "	": return "\\t";
		case "\f": return "\\f";
		case "<": return "\\x3C";
		case "\u2028": return "\\u2028";
		case "\u2029": return "\\u2029";
		default: return;
	}
}
function serializeString(str) {
	let result = "";
	let lastPos = 0;
	let replacement;
	for (let i = 0, len = str.length; i < len; i++) {
		replacement = serializeChar(str[i]);
		if (replacement) {
			result += str.slice(lastPos, i) + replacement;
			lastPos = i + 1;
		}
	}
	if (lastPos === 0) result = str;
	else result += str.slice(lastPos);
	return result;
}
function deserializeReplacer(str) {
	switch (str) {
		case "\\\\": return "\\";
		case "\\\"": return "\"";
		case "\\n": return "\n";
		case "\\r": return "\r";
		case "\\b": return "\b";
		case "\\t": return "	";
		case "\\f": return "\f";
		case "\\x3C": return "<";
		case "\\u2028": return "\u2028";
		case "\\u2029": return "\u2029";
		default: return str;
	}
}
function deserializeString(str) {
	return str.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, deserializeReplacer);
}
var REFERENCES_KEY = "__SEROVAL_REFS__";
var GLOBAL_CONTEXT_R = `self.\$R`;
function getCrossReferenceHeader(id) {
	if (id == null) return `${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||[]`;
	return `(${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||{})["${serializeString(id)}"]=[]`;
}
var REFERENCE = /* @__PURE__ */ new Map();
var INV_REFERENCE = /* @__PURE__ */ new Map();
function hasReferenceID(value) {
	return REFERENCE.has(value);
}
function hasReference(id) {
	return INV_REFERENCE.has(id);
}
function getReferenceID(value) {
	if (hasReferenceID(value)) return REFERENCE.get(value);
	throw new SerovalMissingReferenceError(value);
}
function getReference(id) {
	if (hasReference(id)) return INV_REFERENCE.get(id);
	throw new SerovalMissingReferenceForIdError(id);
}
if (typeof globalThis !== "undefined") Object.defineProperty(globalThis, REFERENCES_KEY, {
	value: INV_REFERENCE,
	configurable: true,
	writable: false,
	enumerable: false
});
else if (typeof window !== "undefined") Object.defineProperty(window, REFERENCES_KEY, {
	value: INV_REFERENCE,
	configurable: true,
	writable: false,
	enumerable: false
});
else if (typeof self !== "undefined") Object.defineProperty(self, REFERENCES_KEY, {
	value: INV_REFERENCE,
	configurable: true,
	writable: false,
	enumerable: false
});
else if (typeof global !== "undefined") Object.defineProperty(global, REFERENCES_KEY, {
	value: INV_REFERENCE,
	configurable: true,
	writable: false,
	enumerable: false
});
function getErrorConstructor(error) {
	if (error instanceof EvalError) return 1;
	if (error instanceof RangeError) return 2;
	if (error instanceof ReferenceError) return 3;
	if (error instanceof SyntaxError) return 4;
	if (error instanceof TypeError) return 5;
	if (error instanceof URIError) return 6;
	return 0;
}
function getInitialErrorOptions(error) {
	const construct = ERROR_CONSTRUCTOR_STRING[getErrorConstructor(error)];
	if (error.name !== construct) return { name: error.name };
	if (error.constructor.name !== construct) return { name: error.constructor.name };
	return {};
}
function getErrorOptions(error, features) {
	let options = getInitialErrorOptions(error);
	const names = Object.getOwnPropertyNames(error);
	for (let i = 0, len = names.length, name; i < len; i++) {
		name = names[i];
		if (name !== "name" && name !== "message") if (name === "stack") {
			if (features & 4) {
				options = options || {};
				options[name] = error[name];
			}
		} else {
			options = options || {};
			options[name] = error[name];
		}
	}
	return options;
}
function getObjectFlag(obj) {
	if (Object.isFrozen(obj)) return 3;
	if (Object.isSealed(obj)) return 2;
	if (Object.isExtensible(obj)) return 0;
	return 1;
}
function createNumberNode(value) {
	switch (value) {
		case Number.POSITIVE_INFINITY: return INFINITY_NODE;
		case Number.NEGATIVE_INFINITY: return NEG_INFINITY_NODE;
	}
	if (value !== value) return NAN_NODE;
	if (Object.is(value, -0)) return NEG_ZERO_NODE;
	return createSerovalNode(0, void 0, value, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createStringNode(value) {
	return createSerovalNode(1, void 0, serializeString(value), void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createBigIntNode(current) {
	return createSerovalNode(3, void 0, "" + current, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createIndexedValueNode(id) {
	return createSerovalNode(4, id, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createDateNode(id, current) {
	const timestamp = current.valueOf();
	return createSerovalNode(5, id, timestamp !== timestamp ? "" : current.toISOString(), void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createTemporalNode(id, type, current) {
	return createSerovalNode(36, id, current.toString(), type, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createRegExpNode(id, current) {
	return createSerovalNode(6, id, void 0, serializeString(current.source), current.flags, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createWKSymbolNode(id, current) {
	return createSerovalNode(17, id, INV_SYMBOL_REF[current], void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createReferenceNode(id, ref) {
	return createSerovalNode(18, id, serializeString(getReferenceID(ref)), void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createPluginNode(id, tag, value) {
	return createSerovalNode(25, id, value, serializeString(tag), void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createArrayNode(id, current, parsedItems) {
	return createSerovalNode(9, id, void 0, void 0, void 0, void 0, void 0, parsedItems, void 0, void 0, getObjectFlag(current), void 0);
}
function createBoxedNode(id, boxed) {
	return createSerovalNode(21, id, void 0, void 0, void 0, void 0, void 0, void 0, boxed, void 0, void 0, void 0);
}
function createTypedArrayNode(id, current, buffer) {
	return createSerovalNode(15, id, void 0, current.constructor.name, void 0, void 0, void 0, void 0, buffer, current.byteOffset, void 0, current.length);
}
function createBigIntTypedArrayNode(id, current, buffer) {
	return createSerovalNode(16, id, void 0, current.constructor.name, void 0, void 0, void 0, void 0, buffer, current.byteOffset, void 0, current.length);
}
function createDataViewNode(id, current, buffer) {
	return createSerovalNode(20, id, void 0, void 0, void 0, void 0, void 0, void 0, buffer, current.byteOffset, void 0, current.byteLength);
}
function createErrorNode(id, current, options) {
	return createSerovalNode(13, id, getErrorConstructor(current), void 0, serializeString(current.message), options, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createAggregateErrorNode(id, current, options) {
	return createSerovalNode(14, id, getErrorConstructor(current), void 0, serializeString(current.message), options, void 0, void 0, void 0, void 0, void 0, void 0);
}
function createSetNode(id, items) {
	return createSerovalNode(7, id, void 0, void 0, void 0, void 0, void 0, items, void 0, void 0, void 0, void 0);
}
function createIteratorFactoryInstanceNode(factory, items) {
	return createSerovalNode(28, void 0, void 0, void 0, void 0, void 0, void 0, [factory, items], void 0, void 0, void 0, void 0);
}
function createAsyncIteratorFactoryInstanceNode(factory, items) {
	return createSerovalNode(30, void 0, void 0, void 0, void 0, void 0, void 0, [factory, items], void 0, void 0, void 0, void 0);
}
function createStreamConstructorNode(id, factory, sequence) {
	return createSerovalNode(31, id, void 0, void 0, void 0, void 0, void 0, sequence, factory, void 0, void 0, void 0);
}
function createStreamNextNode(id, parsed) {
	return createSerovalNode(32, id, void 0, void 0, void 0, void 0, void 0, void 0, parsed, void 0, void 0, void 0);
}
function createStreamThrowNode(id, parsed) {
	return createSerovalNode(33, id, void 0, void 0, void 0, void 0, void 0, void 0, parsed, void 0, void 0, void 0);
}
function createStreamReturnNode(id, parsed) {
	return createSerovalNode(34, id, void 0, void 0, void 0, void 0, void 0, void 0, parsed, void 0, void 0, void 0);
}
function createSequenceNode(id, sequence, throwAt, doneAt) {
	return createSerovalNode(35, id, throwAt, void 0, void 0, void 0, void 0, sequence, void 0, void 0, void 0, doneAt);
}
var { toString: objectToString } = Object.prototype;
var STEP_ERROR_CODES = {
	parsing: 1,
	serialization: 2,
	deserialization: 3
};
function getErrorMessageProd(type) {
	return `Seroval Error (step: ${STEP_ERROR_CODES[type]})`;
}
var getErrorMessage = (type, cause) => getErrorMessageProd(type);
var SerovalError = class extends Error {
	constructor(type, cause) {
		super(getErrorMessage(type, cause));
		this.cause = cause;
	}
};
var SerovalParserError = class extends SerovalError {
	constructor(cause) {
		super("parsing", cause);
	}
};
var SerovalDeserializationError = class extends SerovalError {
	constructor(cause) {
		super("deserialization", cause);
	}
};
function getSpecificErrorMessage(code) {
	return `Seroval Error (specific: ${code})`;
}
var SerovalUnsupportedTypeError = class extends Error {
	constructor(value) {
		super(getSpecificErrorMessage(1));
		this.value = value;
	}
};
var SerovalUnsupportedNodeError = class extends Error {
	constructor(node) {
		super(getSpecificErrorMessage(2));
	}
};
var SerovalMissingPluginError = class extends Error {
	constructor(tag) {
		super(getSpecificErrorMessage(3));
	}
};
var SerovalMissingInstanceError = class extends Error {
	constructor(tag) {
		super(getSpecificErrorMessage(4));
	}
};
var SerovalMissingReferenceError = class extends Error {
	constructor(value) {
		super(getSpecificErrorMessage(5));
		this.value = value;
	}
};
var SerovalMissingReferenceForIdError = class extends Error {
	constructor(id) {
		super(getSpecificErrorMessage(6));
	}
};
var SerovalUnknownTypedArrayError = class extends Error {
	constructor(name) {
		super(getSpecificErrorMessage(7));
	}
};
var SerovalMalformedNodeError = class extends Error {
	constructor(node) {
		super(getSpecificErrorMessage(8));
	}
};
var SerovalDepthLimitError = class extends Error {
	constructor(limit) {
		super(getSpecificErrorMessage(9));
	}
};
/**
* An opaque reference allows hiding values from the serializer.
*/
var OpaqueReference = class {
	constructor(value, replacement) {
		this.value = value;
		this.replacement = replacement;
	}
};
var PROMISE_CONSTRUCTOR = () => {
	const resolver = {
		p: 0,
		s: 0,
		f: 0
	};
	resolver.p = new Promise((resolve, reject) => {
		resolver.s = resolve;
		resolver.f = reject;
	});
	return resolver;
};
var PROMISE_SUCCESS = (resolver, data) => {
	resolver.s(data);
	resolver.p.s = 1;
	resolver.p.v = data;
};
var PROMISE_FAILURE = (resolver, data) => {
	resolver.f(data);
	resolver.p.s = 2;
	resolver.p.v = data;
};
var SERIALIZED_PROMISE_CONSTRUCTOR = /* @__PURE__ */ PROMISE_CONSTRUCTOR.toString();
var SERIALIZED_PROMISE_SUCCESS = /* @__PURE__ */ PROMISE_SUCCESS.toString();
var SERIALIZED_PROMISE_FAILURE = /* @__PURE__ */ PROMISE_FAILURE.toString();
var STREAM_CONSTRUCTOR = () => {
	const buffer = [];
	const listeners = [];
	let alive = true;
	let success = false;
	let count = 0;
	const internal = {
		flush(value, mode, x) {
			for (x = 0; x < count; x++) if (listeners[x]) listeners[x][mode](value);
		},
		up(listener, x, z, current) {
			for (x = 0, z = buffer.length; x < z; x++) {
				current = buffer[x];
				if (!alive && x === z - 1) listener[success ? "return" : "throw"](current);
				else listener.next(current);
			}
		},
		on(listener, temp) {
			if (alive) {
				temp = count++;
				listeners[temp] = listener;
			}
			internal.up(listener);
			return () => {
				if (alive) {
					listeners[temp] = listeners[count];
					listeners[count--] = void 0;
				}
			};
		}
	};
	return {
		__SEROVAL_STREAM__: true,
		on(listener) {
			return internal.on(listener);
		},
		next(value) {
			if (alive) {
				buffer.push(value);
				internal.flush(value, "next");
			}
		},
		throw(value) {
			if (alive) {
				buffer.push(value);
				internal.flush(value, "throw");
				alive = false;
				success = false;
				listeners.length = 0;
			}
		},
		return(value) {
			if (alive) {
				buffer.push(value);
				internal.flush(value, "return");
				alive = false;
				success = true;
				listeners.length = 0;
			}
		}
	};
};
var SERIALIZED_STREAM_CONSTRUCTOR = /* @__PURE__ */ STREAM_CONSTRUCTOR.toString();
var ITERATOR_CONSTRUCTOR = (symbol) => (sequence) => () => {
	let index = 0;
	const instance = {
		[symbol]() {
			return instance;
		},
		next() {
			if (index > sequence.d) return {
				done: true,
				value: void 0
			};
			const currentIndex = index++;
			const data = sequence.v[currentIndex];
			if (currentIndex === sequence.t) throw data;
			return {
				done: currentIndex === sequence.d,
				value: data
			};
		}
	};
	return instance;
};
var SERIALIZED_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ITERATOR_CONSTRUCTOR.toString();
var ASYNC_ITERATOR_CONSTRUCTOR = (symbol, createPromise) => (stream) => () => {
	let count = 0;
	let doneAt = -1;
	let isThrow = false;
	const buffer = [];
	const pending = [];
	const internal = { finalize(i = 0, len = pending.length) {
		for (; i < len; i++) pending[i].s({
			done: true,
			value: void 0
		});
	} };
	stream.on({
		next(value) {
			const temp = pending.shift();
			if (temp) temp.s({
				done: false,
				value
			});
			buffer.push(value);
		},
		throw(value) {
			const temp = pending.shift();
			if (temp) temp.f(value);
			internal.finalize();
			doneAt = buffer.length;
			isThrow = true;
			buffer.push(value);
		},
		return(value) {
			const temp = pending.shift();
			if (temp) temp.s({
				done: true,
				value
			});
			internal.finalize();
			doneAt = buffer.length;
			buffer.push(value);
		}
	});
	const instance = {
		[symbol]() {
			return instance;
		},
		next() {
			if (doneAt === -1) {
				const index = count++;
				if (index >= buffer.length) {
					const temp = createPromise();
					pending.push(temp);
					return temp.p;
				}
				return {
					done: false,
					value: buffer[index]
				};
			}
			if (count > doneAt) return {
				done: true,
				value: void 0
			};
			const index = count++;
			const value = buffer[index];
			if (index !== doneAt) return {
				done: false,
				value
			};
			if (isThrow) throw value;
			return {
				done: true,
				value
			};
		}
	};
	return instance;
};
var SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ASYNC_ITERATOR_CONSTRUCTOR.toString();
var ARRAY_BUFFER_CONSTRUCTOR = (b64) => {
	const decoded = atob(b64);
	const length = decoded.length;
	const arr = new Uint8Array(length);
	for (let i = 0; i < length; i++) arr[i] = decoded.charCodeAt(i);
	return arr.buffer;
};
var SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR = /* @__PURE__ */ ARRAY_BUFFER_CONSTRUCTOR.toString();
function isSequence(value) {
	return "__SEROVAL_SEQUENCE__" in value;
}
function createSequence(values, throwAt, doneAt) {
	return {
		__SEROVAL_SEQUENCE__: true,
		v: values,
		t: throwAt,
		d: doneAt
	};
}
function createSequenceFromIterable(source) {
	const values = [];
	let throwsAt = -1;
	let doneAt = -1;
	const iterator = source[SYM_ITERATOR]();
	while (true) try {
		const value = iterator.next();
		values.push(value.value);
		if (value.done) {
			doneAt = values.length - 1;
			break;
		}
	} catch (error) {
		throwsAt = values.length;
		values.push(error);
	}
	return createSequence(values, throwsAt, doneAt);
}
var createIterator = ITERATOR_CONSTRUCTOR(SYM_ITERATOR);
function sequenceToIterator(sequence) {
	return createIterator(sequence);
}
var ITERATOR = {};
var ASYNC_ITERATOR = {};
/**
* Placeholder references
*/
var SPECIAL_REFS = {
	[0]: {},
	[1]: {},
	[2]: {},
	[3]: {},
	[4]: {},
	[5]: {}
};
var SPECIAL_REF_STRING = {
	[0]: "[]",
	[1]: SERIALIZED_PROMISE_CONSTRUCTOR,
	[2]: SERIALIZED_PROMISE_SUCCESS,
	[3]: SERIALIZED_PROMISE_FAILURE,
	[4]: SERIALIZED_STREAM_CONSTRUCTOR,
	[5]: SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR
};
function isStream(value) {
	return "__SEROVAL_STREAM__" in value;
}
function createStream() {
	return STREAM_CONSTRUCTOR();
}
function createStreamFromAsyncIterable(iterable) {
	const stream = createStream();
	const iterator = iterable[SYM_ASYNC_ITERATOR]();
	async function push() {
		try {
			const value = await iterator.next();
			if (value.done) stream.return(value.value);
			else {
				stream.next(value.value);
				await push();
			}
		} catch (error) {
			stream.throw(error);
		}
	}
	push().catch(() => {});
	return stream;
}
var createAsyncIterable = ASYNC_ITERATOR_CONSTRUCTOR(SYM_ASYNC_ITERATOR, PROMISE_CONSTRUCTOR);
function streamToAsyncIterable(stream) {
	return createAsyncIterable(stream);
}
async function promiseToResult(current) {
	try {
		return [1, await current];
	} catch (e) {
		return [0, e];
	}
}
function createBaseParserContext(mode, options) {
	return {
		plugins: options.plugins,
		mode,
		marked: /* @__PURE__ */ new Set(),
		features: 127 ^ (options.disabledFeatures || 0),
		refs: options.refs || /* @__PURE__ */ new Map(),
		depthLimit: options.depthLimit || 1e3
	};
}
/**
* Ensures that the value (based on an identifier) has been visited by the parser.
* @param ctx
* @param id
*/
function markParserRef(ctx, id) {
	ctx.marked.add(id);
}
/**
* Creates an identifier for a value
* @param ctx
* @param current
*/
function createIndexForValue(ctx, current) {
	const id = ctx.refs.size;
	ctx.refs.set(current, id);
	return id;
}
function getNodeForIndexedValue(ctx, current) {
	const registeredId = ctx.refs.get(current);
	if (registeredId != null) {
		markParserRef(ctx, registeredId);
		return {
			type: 1,
			value: createIndexedValueNode(registeredId)
		};
	}
	return {
		type: 0,
		value: createIndexForValue(ctx, current)
	};
}
function getReferenceNode(ctx, current) {
	const indexed = getNodeForIndexedValue(ctx, current);
	if (indexed.type === 1) return indexed;
	if (hasReferenceID(current)) return {
		type: 2,
		value: createReferenceNode(indexed.value, current)
	};
	return indexed;
}
/**
* Parsing methods
*/
function parseWellKnownSymbol(ctx, current) {
	const ref = getReferenceNode(ctx, current);
	if (ref.type !== 0) return ref.value;
	if (current in INV_SYMBOL_REF) return createWKSymbolNode(ref.value, current);
	throw new SerovalUnsupportedTypeError(current);
}
function parseSpecialReference(ctx, ref) {
	const result = getNodeForIndexedValue(ctx, SPECIAL_REFS[ref]);
	if (result.type === 1) return result.value;
	return createSerovalNode(26, result.value, ref, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0);
}
function parseIteratorFactory(ctx) {
	const result = getNodeForIndexedValue(ctx, ITERATOR);
	if (result.type === 1) return result.value;
	return createSerovalNode(27, result.value, void 0, void 0, void 0, void 0, void 0, void 0, parseWellKnownSymbol(ctx, SYM_ITERATOR), void 0, void 0, void 0);
}
function parseAsyncIteratorFactory(ctx) {
	const result = getNodeForIndexedValue(ctx, ASYNC_ITERATOR);
	if (result.type === 1) return result.value;
	return createSerovalNode(29, result.value, void 0, void 0, void 0, void 0, void 0, [parseSpecialReference(ctx, 1), parseWellKnownSymbol(ctx, SYM_ASYNC_ITERATOR)], void 0, void 0, void 0, void 0);
}
function createObjectNode(id, current, empty, record) {
	return createSerovalNode(empty ? 11 : 10, id, void 0, void 0, void 0, record, void 0, void 0, void 0, void 0, getObjectFlag(current), void 0);
}
function createMapNode(ctx, id, k, v) {
	return createSerovalNode(8, id, void 0, void 0, void 0, void 0, {
		k,
		v
	}, void 0, parseSpecialReference(ctx, 0), void 0, void 0, void 0);
}
function createPromiseConstructorNode(ctx, id, resolver) {
	return createSerovalNode(22, id, resolver, void 0, void 0, void 0, void 0, void 0, parseSpecialReference(ctx, 1), void 0, void 0, void 0);
}
function createArrayBufferNode(ctx, id, current) {
	const bytes = new Uint8Array(current);
	let result = "";
	for (let i = 0, len = bytes.length; i < len; i++) result += String.fromCharCode(bytes[i]);
	return createSerovalNode(19, id, serializeString(btoa(result)), void 0, void 0, void 0, void 0, void 0, parseSpecialReference(ctx, 5), void 0, void 0, void 0);
}
function createAsyncParserContext(mode, options) {
	return {
		base: createBaseParserContext(mode, options),
		child: void 0
	};
}
var AsyncParsePluginContext = class {
	constructor(_p, depth) {
		this._p = _p;
		this.depth = depth;
	}
	parse(current) {
		return parseAsync(this._p, this.depth, current);
	}
};
async function parseItems$1(ctx, depth, current) {
	const nodes = [];
	for (let i = 0, len = current.length; i < len; i++) if (i in current) nodes[i] = await parseAsync(ctx, depth, current[i]);
	else nodes[i] = 0;
	return nodes;
}
async function parseArray$1(ctx, depth, id, current) {
	return createArrayNode(id, current, await parseItems$1(ctx, depth, current));
}
async function parseProperties$1(ctx, depth, properties) {
	const entries = Object.entries(properties);
	const keyNodes = [];
	const valueNodes = [];
	for (let i = 0, len = entries.length; i < len; i++) {
		keyNodes.push(serializeString(entries[i][0]));
		valueNodes.push(await parseAsync(ctx, depth, entries[i][1]));
	}
	if (SYM_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(parseIteratorFactory(ctx.base), await parseAsync(ctx, depth, createSequenceFromIterable(properties))));
	}
	if (SYM_ASYNC_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
		valueNodes.push(createAsyncIteratorFactoryInstanceNode(parseAsyncIteratorFactory(ctx.base), await parseAsync(ctx, depth, createStreamFromAsyncIterable(properties))));
	}
	if (SYM_TO_STRING_TAG in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
		valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
	}
	if (SYM_IS_CONCAT_SPREADABLE in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
		valueNodes.push(properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE);
	}
	return {
		k: keyNodes,
		v: valueNodes
	};
}
async function parsePlainObject$1(ctx, depth, id, current, empty) {
	return createObjectNode(id, current, empty, await parseProperties$1(ctx, depth, current));
}
async function parseBoxed$1(ctx, depth, id, current) {
	return createBoxedNode(id, await parseAsync(ctx, depth, current.valueOf()));
}
async function parseTypedArray$1(ctx, depth, id, current) {
	return createTypedArrayNode(id, current, await parseAsync(ctx, depth, current.buffer));
}
async function parseBigIntTypedArray$1(ctx, depth, id, current) {
	return createBigIntTypedArrayNode(id, current, await parseAsync(ctx, depth, current.buffer));
}
async function parseDataView$1(ctx, depth, id, current) {
	return createDataViewNode(id, current, await parseAsync(ctx, depth, current.buffer));
}
async function parseError$1(ctx, depth, id, current) {
	const options = getErrorOptions(current, ctx.base.features);
	return createErrorNode(id, current, options ? await parseProperties$1(ctx, depth, options) : void 0);
}
async function parseAggregateError$1(ctx, depth, id, current) {
	const options = getErrorOptions(current, ctx.base.features);
	return createAggregateErrorNode(id, current, options ? await parseProperties$1(ctx, depth, options) : void 0);
}
async function parseMap$1(ctx, depth, id, current) {
	const keyNodes = [];
	const valueNodes = [];
	for (const [key, value] of current.entries()) {
		keyNodes.push(await parseAsync(ctx, depth, key));
		valueNodes.push(await parseAsync(ctx, depth, value));
	}
	return createMapNode(ctx.base, id, keyNodes, valueNodes);
}
async function parseSet$1(ctx, depth, id, current) {
	const items = [];
	for (const item of current.keys()) items.push(await parseAsync(ctx, depth, item));
	return createSetNode(id, items);
}
async function parsePlugin$1(ctx, depth, id, current) {
	const currentPlugins = ctx.base.plugins;
	if (currentPlugins) for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.async && plugin.test(current)) return createPluginNode(id, plugin.tag, await plugin.parse.async(current, new AsyncParsePluginContext(ctx, depth), { id }));
	}
}
async function parsePromise$1(ctx, depth, id, current) {
	const [status, result] = await promiseToResult(current);
	return createSerovalNode(12, id, status, void 0, void 0, void 0, void 0, void 0, await parseAsync(ctx, depth, result), void 0, void 0, void 0);
}
function parseStreamHandle(depth, id, current, resolve, reject) {
	const sequence = [];
	const cleanup = current.on({
		next: (value) => {
			markParserRef(this.base, id);
			parseAsync(this, depth, value).then((data) => {
				sequence.push(createStreamNextNode(id, data));
			}, (data) => {
				reject(data);
				cleanup();
			});
		},
		throw: (value) => {
			markParserRef(this.base, id);
			parseAsync(this, depth, value).then((data) => {
				sequence.push(createStreamThrowNode(id, data));
				resolve(sequence);
				cleanup();
			}, (data) => {
				reject(data);
				cleanup();
			});
		},
		return: (value) => {
			markParserRef(this.base, id);
			parseAsync(this, depth, value).then((data) => {
				sequence.push(createStreamReturnNode(id, data));
				resolve(sequence);
				cleanup();
			}, (data) => {
				reject(data);
				cleanup();
			});
		}
	});
}
async function parseStream$1(ctx, depth, id, current) {
	return createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), await new Promise(parseStreamHandle.bind(ctx, depth, id, current)));
}
async function parseSequence$1(ctx, depth, id, current) {
	const nodes = [];
	for (let i = 0, len = current.v.length; i < len; i++) nodes[i] = await parseAsync(ctx, depth, current.v[i]);
	return createSequenceNode(id, nodes, current.t, current.d);
}
async function parseObjectAsync(ctx, depth, id, current) {
	if (Array.isArray(current)) return parseArray$1(ctx, depth, id, current);
	if (isStream(current)) return parseStream$1(ctx, depth, id, current);
	if (isSequence(current)) return parseSequence$1(ctx, depth, id, current);
	let currentClass = current.constructor;
	if (currentClass !== void 0 && typeof currentClass !== "function") {
		const proto = Object.getPrototypeOf(current);
		currentClass = proto === null ? void 0 : proto.constructor;
	}
	if (currentClass === OpaqueReference) return parseAsync(ctx, depth, current.replacement);
	const parsed = await parsePlugin$1(ctx, depth, id, current);
	if (parsed) return parsed;
	switch (currentClass) {
		case Object: return parsePlainObject$1(ctx, depth, id, current, false);
		case void 0: return parsePlainObject$1(ctx, depth, id, current, true);
		case Date: return createDateNode(id, current);
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return parseError$1(ctx, depth, id, current);
		case Number:
		case Boolean:
		case String:
		case BigInt: return parseBoxed$1(ctx, depth, id, current);
		case ArrayBuffer: return createArrayBufferNode(ctx.base, id, current);
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return parseTypedArray$1(ctx, depth, id, current);
		case DataView: return parseDataView$1(ctx, depth, id, current);
		case Map: return parseMap$1(ctx, depth, id, current);
		case Set: return parseSet$1(ctx, depth, id, current);
	}
	if (currentClass === Promise || current instanceof Promise) return parsePromise$1(ctx, depth, id, current);
	const currentFeatures = ctx.base.features;
	if (currentFeatures & 32 && currentClass === RegExp) return createRegExpNode(id, current);
	if (currentFeatures & 16) switch (currentClass) {
		case BigInt64Array:
		case BigUint64Array: return parseBigIntTypedArray$1(ctx, depth, id, current);
		default: break;
	}
	if (currentFeatures & 1 && typeof AggregateError !== "undefined" && (currentClass === AggregateError || current instanceof AggregateError)) return parseAggregateError$1(ctx, depth, id, current);
	if (currentFeatures & 64 && typeof Temporal !== "undefined") switch (currentClass) {
		case Temporal.Instant: return createTemporalNode(id, 0, current);
		case Temporal.Duration: return createTemporalNode(id, 1, current);
		case Temporal.PlainDate: return createTemporalNode(id, 2, current);
		case Temporal.PlainDateTime: return createTemporalNode(id, 3, current);
		case Temporal.PlainMonthDay: return createTemporalNode(id, 4, current);
		case Temporal.PlainTime: return createTemporalNode(id, 5, current);
		case Temporal.PlainYearMonth: return createTemporalNode(id, 6, current);
		case Temporal.ZonedDateTime: return createTemporalNode(id, 7, current);
		default: break;
	}
	if (current instanceof Error) return parseError$1(ctx, depth, id, current);
	if (SYM_ITERATOR in current || SYM_ASYNC_ITERATOR in current) return parsePlainObject$1(ctx, depth, id, current, !!currentClass);
	throw new SerovalUnsupportedTypeError(current);
}
async function parseFunctionAsync(ctx, depth, current) {
	const ref = getReferenceNode(ctx.base, current);
	if (ref.type !== 0) return ref.value;
	const plugin = await parsePlugin$1(ctx, depth, ref.value, current);
	if (plugin) return plugin;
	throw new SerovalUnsupportedTypeError(current);
}
async function parseAsync(ctx, depth, current) {
	if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	switch (typeof current) {
		case "boolean": return current ? TRUE_NODE : FALSE_NODE;
		case "undefined": return UNDEFINED_NODE;
		case "string": return createStringNode(current);
		case "number": return createNumberNode(current);
		case "bigint": return createBigIntNode(current);
		case "object":
			if (current) {
				const ref = getReferenceNode(ctx.base, current);
				return ref.type === 0 ? await parseObjectAsync(ctx, depth + 1, ref.value, current) : ref.value;
			}
			return NULL_NODE;
		case "symbol": return parseWellKnownSymbol(ctx.base, current);
		case "function": return parseFunctionAsync(ctx, depth, current);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
async function parseTopAsync(ctx, current) {
	try {
		return await parseAsync(ctx, 0, current);
	} catch (error) {
		throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
	}
}
function createPlugin(plugin) {
	return plugin;
}
function dedupePlugins(deduped, plugins) {
	for (let i = 0, len = plugins.length; i < len; i++) {
		const current = plugins[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupePlugins(deduped, current.extends);
		}
	}
}
function resolvePlugins(plugins) {
	if (plugins) {
		const deduped = /* @__PURE__ */ new Set();
		dedupePlugins(deduped, plugins);
		return [...deduped];
	}
}
function getTypedArrayConstructor(name) {
	switch (name) {
		case "Int8Array": return Int8Array;
		case "Int16Array": return Int16Array;
		case "Int32Array": return Int32Array;
		case "Uint8Array": return Uint8Array;
		case "Uint16Array": return Uint16Array;
		case "Uint32Array": return Uint32Array;
		case "Uint8ClampedArray": return Uint8ClampedArray;
		case "Float32Array": return Float32Array;
		case "Float64Array": return Float64Array;
		case "BigInt64Array": return BigInt64Array;
		case "BigUint64Array": return BigUint64Array;
		default: throw new SerovalUnknownTypedArrayError(name);
	}
}
function isValidKey(key) {
	switch (key) {
		case "constructor":
		case "__proto__":
		case "prototype":
		case "__defineGetter__":
		case "__defineSetter__":
		case "__lookupGetter__":
		case "__lookupSetter__": return false;
		default: return true;
	}
}
function isValidSymbol(symbol) {
	switch (symbol) {
		case SYM_ASYNC_ITERATOR:
		case SYM_IS_CONCAT_SPREADABLE:
		case SYM_TO_STRING_TAG:
		case SYM_ITERATOR: return true;
		default: return false;
	}
}
var MAX_BASE64_LENGTH = 1e6;
var MAX_BIGINT_LENGTH = 1e4;
var MAX_REGEXP_SOURCE_LENGTH = 2e4;
function applyObjectFlag(obj, flag) {
	switch (flag) {
		case 3: return Object.freeze(obj);
		case 1: return Object.preventExtensions(obj);
		case 2: return Object.seal(obj);
		default: return obj;
	}
}
var DEFAULT_DEPTH_LIMIT = 1e3;
function createBaseDeserializerContext(mode, options) {
	var _options$features;
	const refs = options.refs || /* @__PURE__ */ new Map();
	if (!("types" in refs)) Object.assign(refs, { types: /* @__PURE__ */ new Map() });
	return {
		mode,
		plugins: options.plugins,
		refs,
		features: (_options$features = options.features) !== null && _options$features !== void 0 ? _options$features : 127 ^ (options.disabledFeatures || 0),
		depthLimit: options.depthLimit || DEFAULT_DEPTH_LIMIT
	};
}
function createVanillaDeserializerContext(options) {
	return {
		mode: 1,
		base: createBaseDeserializerContext(1, options),
		child: void 0,
		state: { marked: new Set(options.markedRefs) }
	};
}
var DeserializePluginContext = class {
	constructor(_p, depth) {
		this._p = _p;
		this.depth = depth;
	}
	deserialize(node) {
		return deserialize$1(this._p, this.depth, node);
	}
};
function guardIndexedValue(ctx, id) {
	if (id < 0 || !Number.isFinite(id) || !Number.isInteger(id)) throw new SerovalMalformedNodeError({
		t: 4,
		i: id
	});
	if (ctx.refs.has(id)) throw new Error("Conflicted ref id: " + id);
}
function assignIndexedValueVanilla(ctx, id, value) {
	guardIndexedValue(ctx.base, id);
	if (ctx.state.marked.has(id)) ctx.base.refs.set(id, value);
	return value;
}
function assignIndexedValueCross(ctx, id, value) {
	guardIndexedValue(ctx.base, id);
	ctx.base.refs.set(id, value);
	return value;
}
function assignIndexedValue$1(ctx, id, value) {
	return ctx.mode === 1 ? assignIndexedValueVanilla(ctx, id, value) : assignIndexedValueCross(ctx, id, value);
}
function deserializeKnownValue(node, record, key) {
	if (Object.hasOwn(record, key)) return record[key];
	throw new SerovalMalformedNodeError(node);
}
function deserializeReference(ctx, node) {
	return assignIndexedValue$1(ctx, node.i, getReference(deserializeString(node.s)));
}
function deserializeArray(ctx, depth, node) {
	const items = node.a;
	const len = items.length;
	const result = assignIndexedValue$1(ctx, node.i, new Array(len));
	for (let i = 0, item; i < len; i++) {
		item = items[i];
		if (item) result[i] = deserialize$1(ctx, depth, item);
	}
	applyObjectFlag(result, node.o);
	return result;
}
function assignStringProperty(object, key, value) {
	if (isValidKey(key)) object[key] = value;
	else Object.defineProperty(object, key, {
		value,
		configurable: true,
		enumerable: true,
		writable: true
	});
}
function assignProperty(ctx, depth, object, key, value) {
	if (typeof key === "string") assignStringProperty(object, deserializeString(key), deserialize$1(ctx, depth, value));
	else {
		const actual = deserialize$1(ctx, depth, key);
		switch (typeof actual) {
			case "string":
				assignStringProperty(object, actual, deserialize$1(ctx, depth, value));
				break;
			case "symbol":
				if (isValidSymbol(actual)) object[actual] = deserialize$1(ctx, depth, value);
				break;
			default: throw new SerovalMalformedNodeError(key);
		}
	}
}
function assignNodeType(ctx, id, type) {
	ctx.base.refs.types.set(id, type);
}
function validateNodeType(ctx, node, id, type) {
	if (ctx.base.refs.types.get(id) !== type) throw new SerovalMalformedNodeError(node);
}
function deserializeProperties(ctx, depth, node, result) {
	const keys = node.k;
	if (keys.length > 0) for (let i = 0, vals = node.v, len = keys.length; i < len; i++) assignProperty(ctx, depth, result, keys[i], vals[i]);
	return result;
}
function deserializeObject(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, node.t === 10 ? {} : Object.create(null));
	deserializeProperties(ctx, depth, node.p, result);
	applyObjectFlag(result, node.o);
	return result;
}
function deserializeDate(ctx, node) {
	return assignIndexedValue$1(ctx, node.i, new Date(node.s));
}
function deserializeTemporal(ctx, node) {
	if (!(ctx.base.features & 64)) throw new SerovalUnsupportedNodeError(node);
	let value;
	switch (node.c) {
		case 0:
			value = Temporal.Instant.from(node.s);
			break;
		case 1:
			value = Temporal.Duration.from(node.s);
			break;
		case 2:
			value = Temporal.PlainDate.from(node.s);
			break;
		case 3:
			value = Temporal.PlainDateTime.from(node.s);
			break;
		case 4:
			value = Temporal.PlainMonthDay.from(node.s);
			break;
		case 5:
			value = Temporal.PlainTime.from(node.s);
			break;
		case 6:
			value = Temporal.PlainYearMonth.from(node.s);
			break;
		case 7:
			value = Temporal.ZonedDateTime.from(node.s);
			break;
		default: throw new SerovalMalformedNodeError(node);
	}
	return assignIndexedValue$1(ctx, node.i, value);
}
function deserializeRegExp(ctx, node) {
	if (ctx.base.features & 32) {
		const source = deserializeString(node.c);
		if (source.length > MAX_REGEXP_SOURCE_LENGTH) throw new SerovalMalformedNodeError(node);
		return assignIndexedValue$1(ctx, node.i, new RegExp(source, node.m));
	}
	throw new SerovalUnsupportedNodeError(node);
}
function deserializeSet(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, /* @__PURE__ */ new Set());
	for (let i = 0, items = node.a, len = items.length; i < len; i++) result.add(deserialize$1(ctx, depth, items[i]));
	return result;
}
function deserializeMap(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, /* @__PURE__ */ new Map());
	for (let i = 0, keys = node.e.k, vals = node.e.v, len = keys.length; i < len; i++) result.set(deserialize$1(ctx, depth, keys[i]), deserialize$1(ctx, depth, vals[i]));
	return result;
}
function deserializeArrayBuffer(ctx, node) {
	if (node.s.length > MAX_BASE64_LENGTH) throw new SerovalMalformedNodeError(node);
	return assignIndexedValue$1(ctx, node.i, ARRAY_BUFFER_CONSTRUCTOR(deserializeString(node.s)));
}
function deserializeTypedArray(ctx, depth, node) {
	var _node$b;
	const construct = getTypedArrayConstructor(node.c);
	const source = deserialize$1(ctx, depth, node.f);
	const offset = (_node$b = node.b) !== null && _node$b !== void 0 ? _node$b : 0;
	if (offset < 0 || offset > source.byteLength) throw new SerovalMalformedNodeError(node);
	return assignIndexedValue$1(ctx, node.i, new construct(source, offset, node.l));
}
function deserializeDataView(ctx, depth, node) {
	var _node$b2;
	const source = deserialize$1(ctx, depth, node.f);
	const offset = (_node$b2 = node.b) !== null && _node$b2 !== void 0 ? _node$b2 : 0;
	if (offset < 0 || offset > source.byteLength) throw new SerovalMalformedNodeError(node);
	return assignIndexedValue$1(ctx, node.i, new DataView(source, offset, node.l));
}
function deserializeDictionary(ctx, depth, node, result) {
	if (node.p) {
		const fields = deserializeProperties(ctx, depth, node.p, {});
		Object.defineProperties(result, Object.getOwnPropertyDescriptors(fields));
	}
	return result;
}
function deserializeAggregateError(ctx, depth, node) {
	return deserializeDictionary(ctx, depth, node, assignIndexedValue$1(ctx, node.i, new AggregateError([], deserializeString(node.m))));
}
function deserializeError(ctx, depth, node) {
	const construct = deserializeKnownValue(node, ERROR_CONSTRUCTOR, node.s);
	return deserializeDictionary(ctx, depth, node, assignIndexedValue$1(ctx, node.i, new construct(deserializeString(node.m))));
}
function deserializePromise(ctx, depth, node) {
	const deferred = PROMISE_CONSTRUCTOR();
	const result = assignIndexedValue$1(ctx, node.i, deferred.p);
	const deserialized = deserialize$1(ctx, depth, node.f);
	if (node.s) deferred.s(deserialized);
	else deferred.f(deserialized);
	return result;
}
function deserializeBoxed(ctx, depth, node) {
	return assignIndexedValue$1(ctx, node.i, Object(deserialize$1(ctx, depth, node.f)));
}
function deserializePlugin(ctx, depth, node) {
	const currentPlugins = ctx.base.plugins;
	if (currentPlugins) {
		const tag = deserializeString(node.c);
		for (let i = 0, len = currentPlugins.length; i < len; i++) {
			const plugin = currentPlugins[i];
			if (plugin.tag === tag) return assignIndexedValue$1(ctx, node.i, plugin.deserialize(node.s, new DeserializePluginContext(ctx, depth), { id: node.i }));
		}
	}
	throw new SerovalMissingPluginError(node.c);
}
function deserializePromiseConstructor(ctx, node) {
	const value = assignIndexedValue$1(ctx, node.i, assignIndexedValue$1(ctx, node.s, PROMISE_CONSTRUCTOR()).p);
	assignNodeType(ctx, node.s, 22);
	return value;
}
function deserializePromiseResolve(ctx, depth, node) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 22);
		deferred.s(deserialize$1(ctx, depth, node.a[1]));
		return;
	}
	throw new SerovalMissingInstanceError("Promise");
}
function deserializePromiseReject(ctx, depth, node) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 22);
		deferred.f(deserialize$1(ctx, depth, node.a[1]));
		return;
	}
	throw new SerovalMissingInstanceError("Promise");
}
function deserializeIteratorFactoryInstance(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[0]);
	return sequenceToIterator(deserialize$1(ctx, depth, node.a[1]));
}
function deserializeAsyncIteratorFactoryInstance(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[0]);
	return streamToAsyncIterable(deserialize$1(ctx, depth, node.a[1]));
}
function deserializeStreamConstructor(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, createStream());
	assignNodeType(ctx, node.i, 31);
	const items = node.a;
	const len = items.length;
	if (len) for (let i = 0; i < len; i++) deserialize$1(ctx, depth, items[i]);
	return result;
}
function deserializeStreamNext(ctx, depth, node) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 31);
		deferred.next(deserialize$1(ctx, depth, node.f));
		return;
	}
	throw new SerovalMissingInstanceError("Stream");
}
function deserializeStreamThrow(ctx, depth, node) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 31);
		deferred.throw(deserialize$1(ctx, depth, node.f));
		return;
	}
	throw new SerovalMissingInstanceError("Stream");
}
function deserializeStreamReturn(ctx, depth, node) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 31);
		deferred.return(deserialize$1(ctx, depth, node.f));
		return;
	}
	throw new SerovalMissingInstanceError("Stream");
}
function deserializeIteratorFactory(ctx, depth, node) {
	deserialize$1(ctx, depth, node.f);
}
function deserializeAsyncIteratorFactory(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[1]);
}
function deserializeSequence(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, createSequence([], node.s, node.l));
	for (let i = 0, len = node.a.length; i < len; i++) result.v[i] = deserialize$1(ctx, depth, node.a[i]);
	return result;
}
function deserialize$1(ctx, depth, node) {
	if (depth > ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	depth += 1;
	switch (node.t) {
		case 2: return deserializeKnownValue(node, CONSTANT_VAL, node.s);
		case 0: return Number(node.s);
		case 1: return deserializeString(String(node.s));
		case 3:
			if (String(node.s).length > MAX_BIGINT_LENGTH) throw new SerovalMalformedNodeError(node);
			return BigInt(node.s);
		case 4: return ctx.base.refs.get(node.i);
		case 18: return deserializeReference(ctx, node);
		case 9: return deserializeArray(ctx, depth, node);
		case 10:
		case 11: return deserializeObject(ctx, depth, node);
		case 5: return deserializeDate(ctx, node);
		case 6: return deserializeRegExp(ctx, node);
		case 7: return deserializeSet(ctx, depth, node);
		case 8: return deserializeMap(ctx, depth, node);
		case 19: return deserializeArrayBuffer(ctx, node);
		case 16:
		case 15: return deserializeTypedArray(ctx, depth, node);
		case 20: return deserializeDataView(ctx, depth, node);
		case 14: return deserializeAggregateError(ctx, depth, node);
		case 13: return deserializeError(ctx, depth, node);
		case 12: return deserializePromise(ctx, depth, node);
		case 17: return deserializeKnownValue(node, SYMBOL_REF, node.s);
		case 21: return deserializeBoxed(ctx, depth, node);
		case 25: return deserializePlugin(ctx, depth, node);
		case 22: return deserializePromiseConstructor(ctx, node);
		case 23: return deserializePromiseResolve(ctx, depth, node);
		case 24: return deserializePromiseReject(ctx, depth, node);
		case 28: return deserializeIteratorFactoryInstance(ctx, depth, node);
		case 30: return deserializeAsyncIteratorFactoryInstance(ctx, depth, node);
		case 31: return deserializeStreamConstructor(ctx, depth, node);
		case 32: return deserializeStreamNext(ctx, depth, node);
		case 33: return deserializeStreamThrow(ctx, depth, node);
		case 34: return deserializeStreamReturn(ctx, depth, node);
		case 27: return deserializeIteratorFactory(ctx, depth, node);
		case 29: return deserializeAsyncIteratorFactory(ctx, depth, node);
		case 35: return deserializeSequence(ctx, depth, node);
		case 36: return deserializeTemporal(ctx, node);
		default: throw new SerovalUnsupportedNodeError(node);
	}
}
function deserializeTop(ctx, node) {
	try {
		return deserialize$1(ctx, 0, node);
	} catch (error) {
		throw new SerovalDeserializationError(error);
	}
}
var RETURN = () => T;
var SERIALIZED_RETURN = /* @__PURE__ */ RETURN.toString();
var IS_MODERN = /* @__PURE__ */ /=>/.test(SERIALIZED_RETURN);
function createFunction(parameters, body) {
	if (IS_MODERN) return (parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")") + "=>" + (body.startsWith("{") ? "(" + body + ")" : body);
	return "function(" + parameters.join(",") + "){return " + body + "}";
}
function createEffectfulFunction(parameters, body) {
	if (IS_MODERN) return (parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")") + "=>{" + body + "}";
	return "function(" + parameters.join(",") + "){" + body + "}";
}
var REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
var REF_START_CHARS_LEN = 34;
var REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
var REF_CHARS_LEN = 64;
function getIdentifier(index) {
	let mod = index % REF_START_CHARS_LEN;
	let ref = REF_START_CHARS[mod];
	index = (index - mod) / REF_START_CHARS_LEN;
	while (index > 0) {
		mod = index % REF_CHARS_LEN;
		ref += REF_CHARS[mod];
		index = (index - mod) / REF_CHARS_LEN;
	}
	return ref;
}
var IDENTIFIER_CHECK = /^[$A-Z_][0-9A-Z_$]*$/i;
function isValidIdentifier(name) {
	const char = name[0];
	return (char === "$" || char === "_" || char >= "A" && char <= "Z" || char >= "a" && char <= "z") && IDENTIFIER_CHECK.test(name);
}
function getAssignmentExpression(assignment) {
	switch (assignment.t) {
		case 0: return assignment.s + "=" + assignment.v;
		case 2: return assignment.s + ".set(" + assignment.k + "," + assignment.v + ")";
		case 1: return assignment.s + ".add(" + assignment.v + ")";
		case 3: return assignment.s + ".delete(" + assignment.k + ")";
		case 4: return "Object.defineProperty(" + assignment.s + ",\"__proto__\",{value:" + assignment.k + ",configurable:!0,enumerable:!0,writable:!0})";
	}
}
function mergeAssignments(assignments) {
	const newAssignments = [];
	let current = assignments[0];
	for (let i = 1, len = assignments.length, item, prev = current; i < len; i++) {
		item = assignments[i];
		if (item.t === 0 && item.v === prev.v) current = {
			t: 0,
			s: item.s,
			k: void 0,
			v: getAssignmentExpression(current)
		};
		else if (item.t === 2 && item.s === prev.s) current = {
			t: 2,
			s: getAssignmentExpression(current),
			k: item.k,
			v: item.v
		};
		else if (item.t === 1 && item.s === prev.s) current = {
			t: 1,
			s: getAssignmentExpression(current),
			k: void 0,
			v: item.v
		};
		else if (item.t === 3 && item.s === prev.s) current = {
			t: 3,
			s: getAssignmentExpression(current),
			k: item.k,
			v: void 0
		};
		else {
			newAssignments.push(current);
			current = item;
		}
		prev = item;
	}
	newAssignments.push(current);
	return newAssignments;
}
function resolveAssignments(assignments) {
	if (assignments.length) {
		let result = "";
		const merged = mergeAssignments(assignments);
		for (let i = 0, len = merged.length; i < len; i++) result += getAssignmentExpression(merged[i]) + ",";
		return result;
	}
}
var NULL_CONSTRUCTOR = "Object.create(null)";
var SET_CONSTRUCTOR = "new Set";
var MAP_CONSTRUCTOR = "new Map";
var PROMISE_RESOLVE = "Promise.resolve";
var PROMISE_REJECT = "Promise.reject";
var OBJECT_FLAG_CONSTRUCTOR = {
	[3]: "Object.freeze",
	[2]: "Object.seal",
	[1]: "Object.preventExtensions",
	[0]: void 0
};
function createBaseSerializerContext(mode, options) {
	return {
		mode,
		plugins: options.plugins,
		features: options.features,
		marked: new Set(options.markedRefs),
		stack: [],
		flags: [],
		assignments: []
	};
}
function createCrossSerializerContext(options) {
	return {
		mode: 2,
		base: createBaseSerializerContext(2, options),
		state: options,
		child: void 0
	};
}
var SerializePluginContext = class {
	constructor(_p) {
		this._p = _p;
	}
	serialize(node) {
		return serialize$1(this._p, node);
	}
};
/**
* Creates the reference param (identifier) from the given reference ID
* Calling this function means the value has been referenced somewhere
*/
function getVanillaRefParam(state, index) {
	/**
	* Creates a new reference ID from a given reference ID
	* This new reference ID means that the reference itself
	* has been referenced at least once, and is used to generate
	* the variables
	*/
	let actualIndex = state.valid.get(index);
	if (actualIndex == null) {
		actualIndex = state.valid.size;
		state.valid.set(index, actualIndex);
	}
	let identifier = state.vars[actualIndex];
	if (identifier == null) {
		identifier = getIdentifier(actualIndex);
		state.vars[actualIndex] = identifier;
	}
	return identifier;
}
function getCrossRefParam(id) {
	return "$R[" + id + "]";
}
/**
* Converts the ID of a reference into a identifier string
* that is used to refer to the object instance in the
* generated script.
*/
function getRefParam(ctx, id) {
	return ctx.mode === 1 ? getVanillaRefParam(ctx.state, id) : getCrossRefParam(id);
}
function markSerializerRef(ctx, id) {
	ctx.marked.add(id);
}
function isSerializerRefMarked(ctx, id) {
	return ctx.marked.has(id);
}
function pushObjectFlag(ctx, flag, id) {
	if (flag !== 0) {
		markSerializerRef(ctx.base, id);
		ctx.base.flags.push({
			type: flag,
			value: getRefParam(ctx, id)
		});
	}
}
function resolveFlags(ctx) {
	let result = "";
	for (let i = 0, current = ctx.flags, len = current.length; i < len; i++) {
		const flag = current[i];
		result += OBJECT_FLAG_CONSTRUCTOR[flag.type] + "(" + flag.value + "),";
	}
	return result;
}
function resolvePatches(ctx) {
	const assignments = resolveAssignments(ctx.assignments);
	const flags = resolveFlags(ctx);
	if (assignments) {
		if (flags) return assignments + flags;
		return assignments;
	}
	return flags;
}
/**
* Generates the inlined assignment for the reference
* This is different from the assignments array as this one
* signifies creation rather than mutation
*/
function createAssignment(ctx, source, value) {
	ctx.assignments.push({
		t: 0,
		s: source,
		k: void 0,
		v: value
	});
}
function createAddAssignment(ctx, ref, value) {
	ctx.base.assignments.push({
		t: 1,
		s: getRefParam(ctx, ref),
		k: void 0,
		v: value
	});
}
function createSetAssignment(ctx, ref, key, value) {
	ctx.base.assignments.push({
		t: 2,
		s: getRefParam(ctx, ref),
		k: key,
		v: value
	});
}
function createDeleteAssignment(ctx, ref, key) {
	ctx.base.assignments.push({
		t: 3,
		s: getRefParam(ctx, ref),
		k: key,
		v: void 0
	});
}
function createArrayAssign(ctx, ref, index, value) {
	createAssignment(ctx.base, getRefParam(ctx, ref) + "[" + index + "]", value);
}
function createObjectAssign(ctx, ref, key, value) {
	if (!isValidKey(key)) {
		ctx.base.assignments.push({
			t: 4,
			s: getRefParam(ctx, ref),
			k: value,
			v: void 0
		});
		return;
	}
	createAssignment(ctx.base, getRefParam(ctx, ref) + "." + key, value);
}
function createSequenceAssign(ctx, ref, index, value) {
	createAssignment(ctx.base, getRefParam(ctx, ref) + ".v[" + index + "]", value);
}
/**
* Checks if the value is in the stack. Stack here is a reference
* structure to know if a object is to be accessed in a TDZ.
*/
function isIndexedValueInStack(ctx, node) {
	return node.t === 4 && ctx.stack.includes(node.i);
}
/**
* Produces an assignment expression. `id` generates a reference
* parameter (through `getRefParam`) and has the option to
* return the reference parameter directly or assign a value to
* it.
*/
function assignIndexedValue(ctx, index, value) {
	if (ctx.mode === 1 && !isSerializerRefMarked(ctx.base, index)) return value;
	/**
	* In cross-reference, we have to assume that
	* every reference are going to be referenced
	* in the future, and so we need to store
	* all of it into the reference array.
	*
	* otherwise in vanilla, we only do this if it
	* is actually referenced
	*/
	return getRefParam(ctx, index) + "=" + value;
}
function serializeReference(node) {
	return "__SEROVAL_REFS__.get(\"" + node.s + "\")";
}
function serializeArrayItem(ctx, id, item, index) {
	if (item) {
		if (isIndexedValueInStack(ctx.base, item)) {
			markSerializerRef(ctx.base, id);
			createArrayAssign(ctx, id, index, getRefParam(ctx, item.i));
			return "";
		}
		return serialize$1(ctx, item);
	}
	return "";
}
function serializeArray(ctx, node) {
	const id = node.i;
	const list = node.a;
	const len = list.length;
	if (len > 0) {
		ctx.base.stack.push(id);
		let values = serializeArrayItem(ctx, id, list[0], 0);
		let isHoley = values === "";
		for (let i = 1, item; i < len; i++) {
			item = serializeArrayItem(ctx, id, list[i], i);
			values += "," + item;
			isHoley = item === "";
		}
		ctx.base.stack.pop();
		pushObjectFlag(ctx, node.o, node.i);
		return "[" + values + (isHoley ? ",]" : "]");
	}
	return "[]";
}
function serializeProperty(ctx, source, key, val) {
	if (typeof key === "string") {
		const check = Number(key);
		const isIdentifier = check >= 0 && check.toString() === key || isValidIdentifier(key);
		if (isIndexedValueInStack(ctx.base, val)) {
			const refParam = getRefParam(ctx, val.i);
			markSerializerRef(ctx.base, source.i);
			if (isIdentifier && check !== check) createObjectAssign(ctx, source.i, key, refParam);
			else createArrayAssign(ctx, source.i, isIdentifier ? key : "\"" + key + "\"", refParam);
			return "";
		}
		if (isValidKey(key)) return (isIdentifier ? key : "\"" + key + "\"") + ":" + serialize$1(ctx, val);
		return "[\"" + key + "\"]:" + serialize$1(ctx, val);
	}
	return "[" + serialize$1(ctx, key) + "]:" + serialize$1(ctx, val);
}
function serializeProperties(ctx, source, record) {
	const keys = record.k;
	const len = keys.length;
	if (len > 0) {
		const values = record.v;
		ctx.base.stack.push(source.i);
		let result = serializeProperty(ctx, source, keys[0], values[0]);
		for (let i = 1, item = result; i < len; i++) {
			item = serializeProperty(ctx, source, keys[i], values[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		return "{" + result + "}";
	}
	return "{}";
}
function serializeObject(ctx, node) {
	pushObjectFlag(ctx, node.o, node.i);
	return serializeProperties(ctx, node, node.p);
}
function serializeWithObjectAssign(ctx, source, value, serialized) {
	const fields = serializeProperties(ctx, source, value);
	if (fields !== "{}") return "Object.assign(" + serialized + "," + fields + ")";
	return serialized;
}
function serializeStringKeyAssignment(ctx, source, mainAssignments, key, value) {
	const base = ctx.base;
	const serialized = serialize$1(ctx, value);
	const check = Number(key);
	const isIdentifier = check >= 0 && check.toString() === key || isValidIdentifier(key);
	if (isIndexedValueInStack(base, value)) if (isIdentifier && check !== check) createObjectAssign(ctx, source.i, key, serialized);
	else createArrayAssign(ctx, source.i, isIdentifier ? key : "\"" + key + "\"", serialized);
	else {
		const parentAssignment = base.assignments;
		base.assignments = mainAssignments;
		if (isIdentifier && check !== check) createObjectAssign(ctx, source.i, key, serialized);
		else createArrayAssign(ctx, source.i, isIdentifier ? key : "\"" + key + "\"", serialized);
		base.assignments = parentAssignment;
	}
}
function serializeAssignment(ctx, source, mainAssignments, key, value) {
	if (typeof key === "string") serializeStringKeyAssignment(ctx, source, mainAssignments, key, value);
	else {
		const base = ctx.base;
		const parent = base.stack;
		base.stack = [];
		const serialized = serialize$1(ctx, value);
		base.stack = parent;
		const parentAssignment = base.assignments;
		base.assignments = mainAssignments;
		createArrayAssign(ctx, source.i, serialize$1(ctx, key), serialized);
		base.assignments = parentAssignment;
	}
}
function serializeAssignments(ctx, source, node) {
	const keys = node.k;
	const len = keys.length;
	if (len > 0) {
		const mainAssignments = [];
		const values = node.v;
		ctx.base.stack.push(source.i);
		for (let i = 0; i < len; i++) serializeAssignment(ctx, source, mainAssignments, keys[i], values[i]);
		ctx.base.stack.pop();
		return resolveAssignments(mainAssignments);
	}
}
function serializeDictionary(ctx, node, init) {
	if (node.p) {
		const base = ctx.base;
		if (base.features & 8) init = serializeWithObjectAssign(ctx, node, node.p, init);
		else {
			markSerializerRef(base, node.i);
			const assignments = serializeAssignments(ctx, node, node.p);
			if (assignments) return "(" + assignIndexedValue(ctx, node.i, init) + "," + assignments + getRefParam(ctx, node.i) + ")";
		}
	}
	return init;
}
function serializeNullConstructor(ctx, node) {
	pushObjectFlag(ctx, node.o, node.i);
	return serializeDictionary(ctx, node, NULL_CONSTRUCTOR);
}
function serializeDate(node) {
	return "new Date(\"" + node.s + "\")";
}
var TEMPORAL_CONSTRUCTOR = {
	[0]: "Temporal.Instant",
	[1]: "Temporal.Duration",
	[2]: "Temporal.PlainDate",
	[3]: "Temporal.PlainDateTime",
	[4]: "Temporal.PlainMonthDay",
	[5]: "Temporal.PlainTime",
	[6]: "Temporal.PlainYearMonth",
	[7]: "Temporal.ZonedDateTime"
};
function serializeTemporal(ctx, node) {
	if (ctx.base.features & 64) return TEMPORAL_CONSTRUCTOR[node.c] + ".from(\"" + node.s + "\")";
	throw new SerovalUnsupportedNodeError(node);
}
function serializeRegExp(ctx, node) {
	if (ctx.base.features & 32) return "/" + deserializeString(node.c) + "/" + node.m;
	throw new SerovalUnsupportedNodeError(node);
}
function serializeSetItem(ctx, id, item) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, item)) {
		markSerializerRef(base, id);
		createAddAssignment(ctx, id, getRefParam(ctx, item.i));
		return "";
	}
	return serialize$1(ctx, item);
}
function serializeSet(ctx, node) {
	let serialized = SET_CONSTRUCTOR;
	const items = node.a;
	const size = items.length;
	const id = node.i;
	if (size > 0) {
		ctx.base.stack.push(id);
		let result = serializeSetItem(ctx, id, items[0]);
		for (let i = 1, item = result; i < size; i++) {
			item = serializeSetItem(ctx, id, items[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		if (result) serialized += "([" + result + "])";
	}
	return serialized;
}
function serializeMapEntry(ctx, id, key, val, sentinel) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, key)) {
		const keyRef = getRefParam(ctx, key.i);
		markSerializerRef(base, id);
		if (isIndexedValueInStack(base, val)) {
			createSetAssignment(ctx, id, keyRef, getRefParam(ctx, val.i));
			return "";
		}
		if (val.t !== 4 && val.i != null && isSerializerRefMarked(base, val.i)) {
			const serialized = "(" + serialize$1(ctx, val) + ",[" + sentinel + "," + sentinel + "])";
			createSetAssignment(ctx, id, keyRef, getRefParam(ctx, val.i));
			createDeleteAssignment(ctx, id, sentinel);
			return serialized;
		}
		const parent = base.stack;
		base.stack = [];
		createSetAssignment(ctx, id, keyRef, serialize$1(ctx, val));
		base.stack = parent;
		return "";
	}
	if (isIndexedValueInStack(base, val)) {
		const valueRef = getRefParam(ctx, val.i);
		markSerializerRef(base, id);
		if (key.t !== 4 && key.i != null && isSerializerRefMarked(base, key.i)) {
			const serialized = "(" + serialize$1(ctx, key) + ",[" + sentinel + "," + sentinel + "])";
			createSetAssignment(ctx, id, getRefParam(ctx, key.i), valueRef);
			createDeleteAssignment(ctx, id, sentinel);
			return serialized;
		}
		const parent = base.stack;
		base.stack = [];
		createSetAssignment(ctx, id, serialize$1(ctx, key), valueRef);
		base.stack = parent;
		return "";
	}
	return "[" + serialize$1(ctx, key) + "," + serialize$1(ctx, val) + "]";
}
function serializeMap(ctx, node) {
	let serialized = MAP_CONSTRUCTOR;
	const keys = node.e.k;
	const size = keys.length;
	const id = node.i;
	const sentinel = node.f;
	const sentinelId = getRefParam(ctx, sentinel.i);
	const base = ctx.base;
	if (size > 0) {
		const vals = node.e.v;
		base.stack.push(id);
		let result = serializeMapEntry(ctx, id, keys[0], vals[0], sentinelId);
		for (let i = 1, item = result; i < size; i++) {
			item = serializeMapEntry(ctx, id, keys[i], vals[i], sentinelId);
			result += (item && result && ",") + item;
		}
		base.stack.pop();
		if (result) serialized += "([" + result + "])";
	}
	if (sentinel.t === 26) {
		markSerializerRef(base, sentinel.i);
		serialized = "(" + serialize$1(ctx, sentinel) + "," + serialized + ")";
	}
	return serialized;
}
function serializeArrayBuffer(ctx, node) {
	return getConstructor(ctx, node.f) + "(\"" + node.s + "\")";
}
function serializeTypedArray(ctx, node) {
	return "new " + node.c + "(" + serialize$1(ctx, node.f) + "," + node.b + "," + node.l + ")";
}
function serializeDataView(ctx, node) {
	return "new DataView(" + serialize$1(ctx, node.f) + "," + node.b + "," + node.l + ")";
}
function serializeAggregateError(ctx, node) {
	const id = node.i;
	ctx.base.stack.push(id);
	const serialized = serializeDictionary(ctx, node, "new AggregateError([],\"" + node.m + "\")");
	ctx.base.stack.pop();
	return serialized;
}
function serializeError(ctx, node) {
	return serializeDictionary(ctx, node, "new " + ERROR_CONSTRUCTOR_STRING[node.s] + "(\"" + node.m + "\")");
}
function serializePromise(ctx, node) {
	let serialized;
	const fulfilled = node.f;
	const id = node.i;
	const promiseConstructor = node.s ? PROMISE_RESOLVE : PROMISE_REJECT;
	const base = ctx.base;
	if (isIndexedValueInStack(base, fulfilled)) {
		const ref = getRefParam(ctx, fulfilled.i);
		serialized = promiseConstructor + (node.s ? "().then(" + createFunction([], ref) + ")" : "().catch(" + createEffectfulFunction([], "throw " + ref) + ")");
	} else {
		base.stack.push(id);
		const result = serialize$1(ctx, fulfilled);
		base.stack.pop();
		serialized = promiseConstructor + "(" + result + ")";
	}
	return serialized;
}
function serializeBoxed(ctx, node) {
	return "Object(" + serialize$1(ctx, node.f) + ")";
}
function getConstructor(ctx, node) {
	const current = serialize$1(ctx, node);
	return node.t === 4 ? current : "(" + current + ")";
}
function serializePromiseConstructor(ctx, node) {
	if (ctx.mode === 1) throw new SerovalUnsupportedNodeError(node);
	return "(" + assignIndexedValue(ctx, node.s, getConstructor(ctx, node.f) + "()") + ").p";
}
function serializePromiseResolve(ctx, node) {
	if (ctx.mode === 1) throw new SerovalUnsupportedNodeError(node);
	return getConstructor(ctx, node.a[0]) + "(" + getRefParam(ctx, node.i) + "," + serialize$1(ctx, node.a[1]) + ")";
}
function serializePromiseReject(ctx, node) {
	if (ctx.mode === 1) throw new SerovalUnsupportedNodeError(node);
	return getConstructor(ctx, node.a[0]) + "(" + getRefParam(ctx, node.i) + "," + serialize$1(ctx, node.a[1]) + ")";
}
function serializePlugin(ctx, node) {
	const currentPlugins = ctx.base.plugins;
	if (currentPlugins) for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.tag === node.c) {
			if (ctx.child == null) ctx.child = new SerializePluginContext(ctx);
			return plugin.serialize(node.s, ctx.child, { id: node.i });
		}
	}
	throw new SerovalMissingPluginError(node.c);
}
function serializeIteratorFactory(ctx, node) {
	let result = "";
	let initialized = false;
	if (node.f.t !== 4) {
		markSerializerRef(ctx.base, node.f.i);
		result = "(" + serialize$1(ctx, node.f) + ",";
		initialized = true;
	}
	result += assignIndexedValue(ctx, node.i, "(" + SERIALIZED_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, node.f.i) + ")");
	if (initialized) result += ")";
	return result;
}
function serializeIteratorFactoryInstance(ctx, node) {
	return getConstructor(ctx, node.a[0]) + "(" + serialize$1(ctx, node.a[1]) + ")";
}
function serializeAsyncIteratorFactory(ctx, node) {
	const promise = node.a[0];
	const symbol = node.a[1];
	const base = ctx.base;
	let result = "";
	if (promise.t !== 4) {
		markSerializerRef(base, promise.i);
		result += "(" + serialize$1(ctx, promise);
	}
	if (symbol.t !== 4) {
		markSerializerRef(base, symbol.i);
		result += (result ? "," : "(") + serialize$1(ctx, symbol);
	}
	if (result) result += ",";
	const iterator = assignIndexedValue(ctx, node.i, "(" + SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, symbol.i) + "," + getRefParam(ctx, promise.i) + ")");
	if (result) return result + iterator + ")";
	return iterator;
}
function serializeAsyncIteratorFactoryInstance(ctx, node) {
	return getConstructor(ctx, node.a[0]) + "(" + serialize$1(ctx, node.a[1]) + ")";
}
function serializeStreamConstructor(ctx, node) {
	const result = assignIndexedValue(ctx, node.i, getConstructor(ctx, node.f) + "()");
	const len = node.a.length;
	if (len) {
		let values = serialize$1(ctx, node.a[0]);
		for (let i = 1; i < len; i++) values += "," + serialize$1(ctx, node.a[i]);
		return "(" + result + "," + values + "," + getRefParam(ctx, node.i) + ")";
	}
	return result;
}
function serializeStreamNext(ctx, node) {
	return getRefParam(ctx, node.i) + ".next(" + serialize$1(ctx, node.f) + ")";
}
function serializeStreamThrow(ctx, node) {
	return getRefParam(ctx, node.i) + ".throw(" + serialize$1(ctx, node.f) + ")";
}
function serializeStreamReturn(ctx, node) {
	return getRefParam(ctx, node.i) + ".return(" + serialize$1(ctx, node.f) + ")";
}
function serializeSequenceItem(ctx, id, index, item) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, item)) {
		markSerializerRef(base, id);
		createSequenceAssign(ctx, id, index, getRefParam(ctx, item.i));
		return "";
	}
	return serialize$1(ctx, item);
}
function serializeSequence(ctx, node) {
	const items = node.a;
	const size = items.length;
	const id = node.i;
	if (size > 0) {
		ctx.base.stack.push(id);
		let result = serializeSequenceItem(ctx, id, 0, items[0]);
		for (let i = 1, item = result; i < size; i++) {
			item = serializeSequenceItem(ctx, id, i, items[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		if (result) return "{__SEROVAL_SEQUENCE__:!0,v:[" + result + "],t:" + node.s + ",d:" + node.l + "}";
	}
	return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function serializeAssignable(ctx, node) {
	switch (node.t) {
		case 17: return SYMBOL_STRING[node.s];
		case 18: return serializeReference(node);
		case 9: return serializeArray(ctx, node);
		case 10: return serializeObject(ctx, node);
		case 11: return serializeNullConstructor(ctx, node);
		case 5: return serializeDate(node);
		case 6: return serializeRegExp(ctx, node);
		case 7: return serializeSet(ctx, node);
		case 8: return serializeMap(ctx, node);
		case 19: return serializeArrayBuffer(ctx, node);
		case 16:
		case 15: return serializeTypedArray(ctx, node);
		case 20: return serializeDataView(ctx, node);
		case 14: return serializeAggregateError(ctx, node);
		case 13: return serializeError(ctx, node);
		case 12: return serializePromise(ctx, node);
		case 21: return serializeBoxed(ctx, node);
		case 22: return serializePromiseConstructor(ctx, node);
		case 25: return serializePlugin(ctx, node);
		case 26: return SPECIAL_REF_STRING[node.s];
		case 35: return serializeSequence(ctx, node);
		case 36: return serializeTemporal(ctx, node);
		default: throw new SerovalUnsupportedNodeError(node);
	}
}
function serialize$1(ctx, node) {
	switch (node.t) {
		case 2: return CONSTANT_STRING[node.s];
		case 0: return "" + node.s;
		case 1: return "\"" + node.s + "\"";
		case 3: return node.s + "n";
		case 4: return getRefParam(ctx, node.i);
		case 23: return serializePromiseResolve(ctx, node);
		case 24: return serializePromiseReject(ctx, node);
		case 27: return serializeIteratorFactory(ctx, node);
		case 28: return serializeIteratorFactoryInstance(ctx, node);
		case 29: return serializeAsyncIteratorFactory(ctx, node);
		case 30: return serializeAsyncIteratorFactoryInstance(ctx, node);
		case 31: return serializeStreamConstructor(ctx, node);
		case 32: return serializeStreamNext(ctx, node);
		case 33: return serializeStreamThrow(ctx, node);
		case 34: return serializeStreamReturn(ctx, node);
		default: return assignIndexedValue(ctx, node.i, serializeAssignable(ctx, node));
	}
}
function serializeTopCross(ctx, tree) {
	const result = serialize$1(ctx, tree);
	const id = tree.i;
	if (id == null) return result;
	const patches = resolvePatches(ctx.base);
	const ref = getRefParam(ctx, id);
	const scopeId = ctx.state.scopeId;
	const params = scopeId == null ? "" : "$R";
	const body = patches ? "(" + result + "," + patches + ref + ")" : result;
	if (params === "") {
		if (tree.t === 10 && !patches) return "(" + body + ")";
		return body;
	}
	const args = scopeId == null ? "()" : "($R[\"" + serializeString(scopeId) + "\"])";
	return "(" + createFunction([params], body) + ")" + args;
}
var SyncParsePluginContext = class {
	constructor(_p, depth) {
		this._p = _p;
		this.depth = depth;
	}
	parse(current) {
		return parseSOS(this._p, this.depth, current);
	}
};
var StreamParsePluginContext = class {
	constructor(_p, depth) {
		this._p = _p;
		this.depth = depth;
	}
	parse(current) {
		return parseSOS(this._p, this.depth, current);
	}
	parseWithError(current) {
		return parseWithError(this._p, this.depth, current);
	}
	isAlive() {
		return this._p.state.alive;
	}
	pushPendingState() {
		pushPendingState(this._p);
	}
	popPendingState() {
		popPendingState(this._p);
	}
	onParse(node) {
		onParse(this._p, node);
	}
	onError(error) {
		onError(this._p, error);
	}
	addCleanup(callback) {
		this._p.state.cleanups.push(callback);
	}
};
function createStreamParserState(options) {
	return {
		alive: true,
		pending: 0,
		initial: true,
		buffer: [],
		onParse: options.onParse,
		onError: options.onError,
		onDone: options.onDone,
		cleanups: []
	};
}
function createStreamParserContext(options) {
	return {
		type: 2,
		base: createBaseParserContext(2, options),
		state: createStreamParserState(options)
	};
}
function parseItems(ctx, depth, current) {
	const nodes = [];
	for (let i = 0, len = current.length; i < len; i++) if (i in current) nodes[i] = parseSOS(ctx, depth, current[i]);
	else nodes[i] = 0;
	return nodes;
}
function parseArray(ctx, depth, id, current) {
	return createArrayNode(id, current, parseItems(ctx, depth, current));
}
function parseProperties(ctx, depth, properties) {
	const entries = Object.entries(properties);
	const keyNodes = [];
	const valueNodes = [];
	for (let i = 0, len = entries.length; i < len; i++) {
		keyNodes.push(serializeString(entries[i][0]));
		valueNodes.push(parseSOS(ctx, depth, entries[i][1]));
	}
	if (SYM_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(parseIteratorFactory(ctx.base), parseSOS(ctx, depth, createSequenceFromIterable(properties))));
	}
	if (SYM_ASYNC_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
		valueNodes.push(createAsyncIteratorFactoryInstanceNode(parseAsyncIteratorFactory(ctx.base), parseSOS(ctx, depth, ctx.type === 1 ? createStream() : createStreamFromAsyncIterable(properties))));
	}
	if (SYM_TO_STRING_TAG in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
		valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
	}
	if (SYM_IS_CONCAT_SPREADABLE in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
		valueNodes.push(properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE);
	}
	return {
		k: keyNodes,
		v: valueNodes
	};
}
function parsePlainObject(ctx, depth, id, current, empty) {
	return createObjectNode(id, current, empty, parseProperties(ctx, depth, current));
}
function parseBoxed(ctx, depth, id, current) {
	return createBoxedNode(id, parseSOS(ctx, depth, current.valueOf()));
}
function parseTypedArray(ctx, depth, id, current) {
	return createTypedArrayNode(id, current, parseSOS(ctx, depth, current.buffer));
}
function parseBigIntTypedArray(ctx, depth, id, current) {
	return createBigIntTypedArrayNode(id, current, parseSOS(ctx, depth, current.buffer));
}
function parseDataView(ctx, depth, id, current) {
	return createDataViewNode(id, current, parseSOS(ctx, depth, current.buffer));
}
function parseError(ctx, depth, id, current) {
	const options = getErrorOptions(current, ctx.base.features);
	return createErrorNode(id, current, options ? parseProperties(ctx, depth, options) : void 0);
}
function parseAggregateError(ctx, depth, id, current) {
	const options = getErrorOptions(current, ctx.base.features);
	return createAggregateErrorNode(id, current, options ? parseProperties(ctx, depth, options) : void 0);
}
function parseMap(ctx, depth, id, current) {
	const keyNodes = [];
	const valueNodes = [];
	for (const [key, value] of current.entries()) {
		keyNodes.push(parseSOS(ctx, depth, key));
		valueNodes.push(parseSOS(ctx, depth, value));
	}
	return createMapNode(ctx.base, id, keyNodes, valueNodes);
}
function parseSet(ctx, depth, id, current) {
	const items = [];
	for (const item of current.keys()) items.push(parseSOS(ctx, depth, item));
	return createSetNode(id, items);
}
function parseStream(ctx, depth, id, current) {
	const result = createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), []);
	if (ctx.type === 1) return result;
	pushPendingState(ctx);
	current.on({
		next: (value) => {
			if (ctx.state.alive) {
				const parsed = parseWithError(ctx, depth, value);
				if (parsed) onParse(ctx, createStreamNextNode(id, parsed));
			}
		},
		throw: (value) => {
			if (ctx.state.alive) {
				const parsed = parseWithError(ctx, depth, value);
				if (parsed) onParse(ctx, createStreamThrowNode(id, parsed));
			}
			popPendingState(ctx);
		},
		return: (value) => {
			if (ctx.state.alive) {
				const parsed = parseWithError(ctx, depth, value);
				if (parsed) onParse(ctx, createStreamReturnNode(id, parsed));
			}
			popPendingState(ctx);
		}
	});
	return result;
}
function handlePromiseSuccess(id, depth, data) {
	if (this.state.alive) {
		const parsed = parseWithError(this, depth, data);
		if (parsed) onParse(this, createSerovalNode(23, id, void 0, void 0, void 0, void 0, void 0, [parseSpecialReference(this.base, 2), parsed], void 0, void 0, void 0, void 0));
		popPendingState(this);
	}
}
function handlePromiseFailure(id, depth, data) {
	if (this.state.alive) {
		const parsed = parseWithError(this, depth, data);
		if (parsed) onParse(this, createSerovalNode(24, id, void 0, void 0, void 0, void 0, void 0, [parseSpecialReference(this.base, 3), parsed], void 0, void 0, void 0, void 0));
	}
	popPendingState(this);
}
function parsePromise(ctx, depth, id, current) {
	const resolver = createIndexForValue(ctx.base, {});
	if (ctx.type === 2) {
		pushPendingState(ctx);
		current.then(handlePromiseSuccess.bind(ctx, resolver, depth), handlePromiseFailure.bind(ctx, resolver, depth));
	}
	return createPromiseConstructorNode(ctx.base, id, resolver);
}
function parsePluginSync(ctx, depth, id, current, currentPlugins) {
	for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.sync && plugin.test(current)) return createPluginNode(id, plugin.tag, plugin.parse.sync(current, new SyncParsePluginContext(ctx, depth), { id }));
	}
}
function parsePluginStream(ctx, depth, id, current, currentPlugins) {
	for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.stream && plugin.test(current)) return createPluginNode(id, plugin.tag, plugin.parse.stream(current, new StreamParsePluginContext(ctx, depth), { id }));
	}
}
function parsePlugin(ctx, depth, id, current) {
	const currentPlugins = ctx.base.plugins;
	if (currentPlugins) return ctx.type === 1 ? parsePluginSync(ctx, depth, id, current, currentPlugins) : parsePluginStream(ctx, depth, id, current, currentPlugins);
}
function parseSequence(ctx, depth, id, current) {
	const nodes = [];
	for (let i = 0, len = current.v.length; i < len; i++) nodes[i] = parseSOS(ctx, depth, current.v[i]);
	return createSequenceNode(id, nodes, current.t, current.d);
}
function parseObjectPhase2(ctx, depth, id, current, currentClass) {
	switch (currentClass) {
		case Object: return parsePlainObject(ctx, depth, id, current, false);
		case void 0: return parsePlainObject(ctx, depth, id, current, true);
		case Date: return createDateNode(id, current);
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return parseError(ctx, depth, id, current);
		case Number:
		case Boolean:
		case String:
		case BigInt: return parseBoxed(ctx, depth, id, current);
		case ArrayBuffer: return createArrayBufferNode(ctx.base, id, current);
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return parseTypedArray(ctx, depth, id, current);
		case DataView: return parseDataView(ctx, depth, id, current);
		case Map: return parseMap(ctx, depth, id, current);
		case Set: return parseSet(ctx, depth, id, current);
	}
	if (currentClass === Promise || current instanceof Promise) return parsePromise(ctx, depth, id, current);
	const currentFeatures = ctx.base.features;
	if (currentFeatures & 32 && currentClass === RegExp) return createRegExpNode(id, current);
	if (currentFeatures & 16) switch (currentClass) {
		case BigInt64Array:
		case BigUint64Array: return parseBigIntTypedArray(ctx, depth, id, current);
		default: break;
	}
	if (currentFeatures & 1 && typeof AggregateError !== "undefined" && (currentClass === AggregateError || current instanceof AggregateError)) return parseAggregateError(ctx, depth, id, current);
	if (currentFeatures & 64 && typeof Temporal !== "undefined") switch (currentClass) {
		case Temporal.Instant: return createTemporalNode(id, 0, current);
		case Temporal.Duration: return createTemporalNode(id, 1, current);
		case Temporal.PlainDate: return createTemporalNode(id, 2, current);
		case Temporal.PlainDateTime: return createTemporalNode(id, 3, current);
		case Temporal.PlainMonthDay: return createTemporalNode(id, 4, current);
		case Temporal.PlainTime: return createTemporalNode(id, 5, current);
		case Temporal.PlainYearMonth: return createTemporalNode(id, 6, current);
		case Temporal.ZonedDateTime: return createTemporalNode(id, 7, current);
		default: break;
	}
	if (current instanceof Error) return parseError(ctx, depth, id, current);
	if (SYM_ITERATOR in current || SYM_ASYNC_ITERATOR in current) return parsePlainObject(ctx, depth, id, current, !!currentClass);
	throw new SerovalUnsupportedTypeError(current);
}
function parseObject(ctx, depth, id, current) {
	if (Array.isArray(current)) return parseArray(ctx, depth, id, current);
	if (isStream(current)) return parseStream(ctx, depth, id, current);
	if (isSequence(current)) return parseSequence(ctx, depth, id, current);
	let currentClass = current.constructor;
	if (currentClass !== void 0 && typeof currentClass !== "function") {
		const proto = Object.getPrototypeOf(current);
		currentClass = proto === null ? void 0 : proto.constructor;
	}
	if (currentClass === OpaqueReference) return parseSOS(ctx, depth, current.replacement);
	const parsed = parsePlugin(ctx, depth, id, current);
	if (parsed) return parsed;
	return parseObjectPhase2(ctx, depth, id, current, currentClass);
}
function parseFunction(ctx, depth, current) {
	const ref = getReferenceNode(ctx.base, current);
	if (ref.type !== 0) return ref.value;
	const plugin = parsePlugin(ctx, depth, ref.value, current);
	if (plugin) return plugin;
	throw new SerovalUnsupportedTypeError(current);
}
function parseSOS(ctx, depth, current) {
	if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	switch (typeof current) {
		case "boolean": return current ? TRUE_NODE : FALSE_NODE;
		case "undefined": return UNDEFINED_NODE;
		case "string": return createStringNode(current);
		case "number": return createNumberNode(current);
		case "bigint": return createBigIntNode(current);
		case "object":
			if (current) {
				const ref = getReferenceNode(ctx.base, current);
				return ref.type === 0 ? parseObject(ctx, depth + 1, ref.value, current) : ref.value;
			}
			return NULL_NODE;
		case "symbol": return parseWellKnownSymbol(ctx.base, current);
		case "function": return parseFunction(ctx, depth, current);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
function onParse(ctx, node) {
	if (ctx.state.initial) ctx.state.buffer.push(node);
	else onParseInternal(ctx, node, false);
}
function onError(ctx, error) {
	if (ctx.state.onError) ctx.state.onError(error);
	else throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
}
function onDone(ctx) {
	if (ctx.state.onDone) ctx.state.onDone();
	for (let i = 0, len = ctx.state.cleanups.length; i < len; i++) ctx.state.cleanups[i]();
}
function onParseInternal(ctx, node, initial) {
	try {
		ctx.state.onParse(node, initial);
	} catch (error) {
		onError(ctx, error);
	}
}
function pushPendingState(ctx) {
	ctx.state.pending++;
}
function popPendingState(ctx) {
	if (--ctx.state.pending <= 0) onDone(ctx);
}
function parseWithError(ctx, depth, current) {
	try {
		return parseSOS(ctx, depth, current);
	} catch (err) {
		onError(ctx, err);
		return;
	}
}
function startStreamParse(ctx, current) {
	const parsed = parseWithError(ctx, 0, current);
	if (parsed) {
		onParseInternal(ctx, parsed, true);
		ctx.state.initial = false;
		flushStreamParse(ctx, ctx.state);
		if (ctx.state.pending <= 0) destroyStreamParse(ctx);
	}
}
function flushStreamParse(ctx, state) {
	for (let i = 0, len = state.buffer.length; i < len; i++) onParseInternal(ctx, state.buffer[i], false);
}
function destroyStreamParse(ctx) {
	if (ctx.state.alive) {
		onDone(ctx);
		ctx.state.alive = false;
	}
}
async function toCrossJSONAsync(source, options = {}) {
	return await parseTopAsync(createAsyncParserContext(2, {
		plugins: resolvePlugins(options.plugins),
		disabledFeatures: options.disabledFeatures,
		refs: options.refs
	}), source);
}
function crossSerializeStream(source, options) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createStreamParserContext({
		plugins,
		refs: options.refs,
		disabledFeatures: options.disabledFeatures,
		onParse(node, initial) {
			const serial = createCrossSerializerContext({
				plugins,
				features: ctx.base.features,
				scopeId: options.scopeId,
				markedRefs: ctx.base.marked
			});
			let serialized;
			try {
				serialized = serializeTopCross(serial, node);
			} catch (err) {
				if (options.onError) options.onError(err);
				return;
			}
			options.onSerialize(serialized, initial);
		},
		onError: options.onError,
		onDone: options.onDone
	});
	startStreamParse(ctx, source);
	return destroyStreamParse.bind(null, ctx);
}
function toCrossJSONStream(source, options) {
	const ctx = createStreamParserContext({
		plugins: resolvePlugins(options.plugins),
		refs: options.refs,
		disabledFeatures: options.disabledFeatures,
		depthLimit: options.depthLimit,
		onParse: options.onParse,
		onError: options.onError,
		onDone: options.onDone
	});
	startStreamParse(ctx, source);
	return destroyStreamParse.bind(null, ctx);
}
function fromJSON(source, options = {}) {
	var _source$f;
	const plugins = resolvePlugins(options.plugins);
	const disabledFeatures = options.disabledFeatures || 0;
	const sourceFeatures = (_source$f = source.f) !== null && _source$f !== void 0 ? _source$f : 127;
	return deserializeTop(createVanillaDeserializerContext({
		plugins,
		markedRefs: source.m,
		features: sourceFeatures & ~disabledFeatures,
		disabledFeatures
	}), source.t);
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/serializer/transformer.js
/**
* Create a strongly-typed serialization adapter for SSR hydration.
* Use to register custom types with the router serializer.
*/
function createSerializationAdapter(opts) {
	return opts;
}
/** Create a Seroval plugin for server-side serialization only. */
/* @__NO_SIDE_EFFECTS__ */
function makeSsrSerovalPlugin(serializationAdapter, options) {
	return /* @__PURE__ */ createPlugin({
		tag: "$TSR/t/" + serializationAdapter.key,
		test: serializationAdapter.test,
		parse: { stream(value, ctx, _data) {
			return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
		} },
		serialize(node, ctx, _data) {
			options.didRun = true;
			return GLOBAL_TSR + ".t.get(\"" + serializationAdapter.key + "\")(" + ctx.serialize(node.v) + ")";
		},
		deserialize: void 0
	});
}
/** Create a Seroval plugin for client/server symmetric (de)serialization. */
/* @__NO_SIDE_EFFECTS__ */
function makeSerovalPlugin(serializationAdapter) {
	return /* @__PURE__ */ createPlugin({
		tag: "$TSR/t/" + serializationAdapter.key,
		test: serializationAdapter.test,
		parse: {
			sync(value, ctx, _data) {
				return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
			},
			async async(value, ctx, _data) {
				return { v: await ctx.parse(serializationAdapter.toSerializable(value)) };
			},
			stream(value, ctx, _data) {
				return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
			}
		},
		serialize: void 0,
		deserialize(node, ctx, _data) {
			return serializationAdapter.fromSerializable(ctx.deserialize(node.v));
		}
	});
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/serializer/RawStream.js
/**
* Marker class for ReadableStream<Uint8Array> that should be serialized
* with base64 encoding (SSR) or binary framing (server functions).
*
* Wrap your binary streams with this to get efficient serialization:
* ```ts
* // For binary data (files, images, etc.)
* return { data: new RawStream(file.stream()) }
*
* // For text-heavy data (RSC payloads, etc.)
* return { data: new RawStream(rscStream, { hint: 'text' }) }
* ```
*/
var RawStream = class {
	constructor(stream, options) {
		this.stream = stream;
		this.hint = options?.hint ?? "binary";
	}
};
var BufferCtor = globalThis.Buffer;
var hasNodeBuffer = !!BufferCtor && typeof BufferCtor.from === "function";
function uint8ArrayToBase64(bytes) {
	if (bytes.length === 0) return "";
	if (hasNodeBuffer) return BufferCtor.from(bytes).toString("base64");
	const CHUNK_SIZE = 32768;
	const chunks = [];
	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		const chunk = bytes.subarray(i, i + CHUNK_SIZE);
		chunks.push(String.fromCharCode.apply(null, chunk));
	}
	return btoa(chunks.join(""));
}
function base64ToUint8Array(base64) {
	if (base64.length === 0) return /* @__PURE__ */ new Uint8Array(0);
	if (hasNodeBuffer) {
		const buf = BufferCtor.from(base64, "base64");
		return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
	}
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
var RAW_STREAM_FACTORY_BINARY = Object.create(null);
var RAW_STREAM_FACTORY_TEXT = Object.create(null);
var RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY = (stream) => new ReadableStream({ start(controller) {
	stream.on({
		next(base64) {
			try {
				controller.enqueue(base64ToUint8Array(base64));
			} catch {}
		},
		throw(error) {
			controller.error(error);
		},
		return() {
			try {
				controller.close();
			} catch {}
		}
	});
} });
var textEncoderForFactory = new TextEncoder();
var RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT = (stream) => {
	return new ReadableStream({ start(controller) {
		stream.on({
			next(value) {
				try {
					if (typeof value === "string") controller.enqueue(textEncoderForFactory.encode(value));
					else controller.enqueue(base64ToUint8Array(value.$b64));
				} catch {}
			},
			throw(error) {
				controller.error(error);
			},
			return() {
				try {
					controller.close();
				} catch {}
			}
		});
	} });
};
var FACTORY_BINARY = `(s=>new ReadableStream({start(c){s.on({next(b){try{const d=atob(b),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}catch(_){}},throw(e){c.error(e)},return(){try{c.close()}catch(_){}}})}}))`;
var FACTORY_TEXT = `(s=>{const e=new TextEncoder();return new ReadableStream({start(c){s.on({next(v){try{if(typeof v==='string'){c.enqueue(e.encode(v))}else{const d=atob(v.$b64),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}}catch(_){}},throw(x){c.error(x)},return(){try{c.close()}catch(_){}}})}})})`;
function toBinaryStream(readable) {
	const stream = createStream();
	const reader = readable.getReader();
	(async () => {
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					stream.return(void 0);
					break;
				}
				stream.next(uint8ArrayToBase64(value));
			}
		} catch (error) {
			stream.throw(error);
		} finally {
			reader.releaseLock();
		}
	})();
	return stream;
}
function toTextStream(readable) {
	const stream = createStream();
	const reader = readable.getReader();
	const decoder = new TextDecoder("utf-8", { fatal: true });
	(async () => {
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					try {
						const remaining = decoder.decode();
						if (remaining.length > 0) stream.next(remaining);
					} catch {}
					stream.return(void 0);
					break;
				}
				try {
					const text = decoder.decode(value, { stream: true });
					if (text.length > 0) stream.next(text);
				} catch {
					stream.next({ $b64: uint8ArrayToBase64(value) });
				}
			}
		} catch (error) {
			stream.throw(error);
		} finally {
			reader.releaseLock();
		}
	})();
	return stream;
}
/**
* SSR Plugin - uses base64 or UTF-8+base64 encoding for chunks, delegates to seroval's stream mechanism.
* Used during SSR when serializing to JavaScript code for HTML injection.
*
* Supports two modes based on RawStream hint:
* - 'binary': Always base64 encode (default)
* - 'text': Try UTF-8 first, fallback to base64 for invalid UTF-8
*/
var RawStreamSSRPlugin = /* @__PURE__ */ createPlugin({
	tag: "tss/RawStream",
	extends: [/* @__PURE__ */ createPlugin({
		tag: "tss/RawStreamFactory",
		test(value) {
			return value === RAW_STREAM_FACTORY_BINARY;
		},
		parse: {
			sync(_value, _ctx, _data) {
				return {};
			},
			async async(_value, _ctx, _data) {
				return {};
			},
			stream(_value, _ctx, _data) {
				return {};
			}
		},
		serialize(_node, _ctx, _data) {
			return FACTORY_BINARY;
		},
		deserialize(_node, _ctx, _data) {
			return RAW_STREAM_FACTORY_BINARY;
		}
	}), /* @__PURE__ */ createPlugin({
		tag: "tss/RawStreamFactoryText",
		test(value) {
			return value === RAW_STREAM_FACTORY_TEXT;
		},
		parse: {
			sync(_value, _ctx, _data) {
				return {};
			},
			async async(_value, _ctx, _data) {
				return {};
			},
			stream(_value, _ctx, _data) {
				return {};
			}
		},
		serialize(_node, _ctx, _data) {
			return FACTORY_TEXT;
		},
		deserialize(_node, _ctx, _data) {
			return RAW_STREAM_FACTORY_TEXT;
		}
	})],
	test(value) {
		return value instanceof RawStream;
	},
	parse: {
		sync(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			return {
				hint: ctx.parse(value.hint),
				factory: ctx.parse(factory),
				stream: ctx.parse(createStream())
			};
		},
		async async(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			const encodedStream = value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
			return {
				hint: await ctx.parse(value.hint),
				factory: await ctx.parse(factory),
				stream: await ctx.parse(encodedStream)
			};
		},
		stream(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			const encodedStream = value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
			return {
				hint: ctx.parse(value.hint),
				factory: ctx.parse(factory),
				stream: ctx.parse(encodedStream)
			};
		}
	},
	serialize(node, ctx, _data) {
		return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.stream) + ")";
	},
	deserialize(node, ctx, _data) {
		const stream = ctx.deserialize(node.stream);
		return ctx.deserialize(node.hint) === "text" ? RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT(stream) : RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY(stream);
	}
});
/**
* Creates an RPC plugin instance that registers raw streams with a multiplexer.
* Used for server function responses where we want binary framing.
* Note: RPC always uses binary framing regardless of hint.
*
* @param onRawStream Callback invoked when a RawStream is encountered during serialization
*/
/* @__NO_SIDE_EFFECTS__ */
function createRawStreamRPCPlugin(onRawStream) {
	let nextStreamId = 1;
	return /* @__PURE__ */ createPlugin({
		tag: "tss/RawStream",
		test(value) {
			return value instanceof RawStream;
		},
		parse: {
			async async(value, ctx, _data) {
				const streamId = nextStreamId++;
				onRawStream(streamId, value.stream);
				return { streamId: await ctx.parse(streamId) };
			},
			stream(value, ctx, _data) {
				const streamId = nextStreamId++;
				onRawStream(streamId, value.stream);
				return { streamId: ctx.parse(streamId) };
			}
		},
		serialize() {
			throw new Error("RawStreamRPCPlugin.serialize should not be called. RPC uses JSON serialization, not JS code generation.");
		},
		deserialize() {
			throw new Error("RawStreamRPCPlugin.deserialize should not be called. Use createRawStreamDeserializePlugin on client.");
		}
	});
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/serializer/ShallowErrorPlugin.js
/**
* this plugin serializes only the `message` part of an Error
* this helps with serializing e.g. a ZodError which has functions attached that cannot be serialized
*/
var ShallowErrorPlugin = /* @__PURE__ */ createPlugin({
	tag: "$TSR/Error",
	test(value) {
		return value instanceof Error;
	},
	parse: {
		sync(value, ctx) {
			return { message: ctx.parse(value.message) };
		},
		async async(value, ctx) {
			return { message: await ctx.parse(value.message) };
		},
		stream(value, ctx) {
			return { message: ctx.parse(value.message) };
		}
	},
	serialize(node, ctx) {
		return "new Error(" + ctx.serialize(node.message) + ")";
	},
	deserialize(node, ctx) {
		return new Error(ctx.deserialize(node.message));
	}
});
//#endregion
//#region ../../node_modules/@tanstack/router-core/node_modules/seroval-plugins/dist/web-43VA2W_p.js
var READABLE_STREAM_FACTORY = {};
var READABLE_STREAM_FACTORY_CONSTRUCTOR = (stream) => new ReadableStream({ start(controller) {
	stream.on({
		next(value) {
			try {
				controller.enqueue(value);
			} catch (_error) {}
		},
		throw(value) {
			controller.error(value);
		},
		return() {
			try {
				controller.close();
			} catch (_error) {}
		}
	});
} });
var ReadableStreamFactoryPlugin = /* @__PURE__ */ createPlugin({
	tag: "seroval-plugins/web/ReadableStreamFactory",
	test(value) {
		return value === READABLE_STREAM_FACTORY;
	},
	parse: {
		sync() {
			return READABLE_STREAM_FACTORY;
		},
		async async() {
			return await Promise.resolve(READABLE_STREAM_FACTORY);
		},
		stream() {
			return READABLE_STREAM_FACTORY;
		}
	},
	serialize() {
		return READABLE_STREAM_FACTORY_CONSTRUCTOR.toString();
	},
	deserialize() {
		return READABLE_STREAM_FACTORY;
	}
});
async function drainStream(stream, reader) {
	try {
		const result = await reader.read();
		if (result.done) {
			stream.return(result.value);
			reader.releaseLock();
		} else {
			stream.next(result.value);
			await drainStream(stream, reader);
		}
	} catch (error) {
		stream.throw(error);
	}
}
function cleanupStream(reader) {
	reader.cancel().catch(() => {});
	reader.releaseLock();
}
function toStream(value) {
	const stream = createStream();
	const reader = value.getReader();
	const cleanup = cleanupStream.bind(null, reader);
	drainStream(stream, reader).catch(cleanup);
	return [stream, cleanup];
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/serializer/seroval-plugins.js
var defaultSerovalPlugins = [
	ShallowErrorPlugin,
	RawStreamSSRPlugin,
	/* @__PURE__ */ createPlugin({
		tag: "seroval/plugins/web/ReadableStream",
		extends: [ReadableStreamFactoryPlugin],
		test(value) {
			if (typeof ReadableStream === "undefined") return false;
			return value instanceof ReadableStream;
		},
		parse: {
			sync(_value, ctx) {
				return {
					factory: ctx.parse(READABLE_STREAM_FACTORY),
					stream: ctx.parse(createStream())
				};
			},
			async async(value, ctx) {
				return {
					factory: await ctx.parse(READABLE_STREAM_FACTORY),
					stream: await ctx.parse(toStream(value)[0])
				};
			},
			stream(value, ctx) {
				const [stream, cleanup] = toStream(value);
				ctx.addCleanup(cleanup);
				return {
					factory: ctx.parse(READABLE_STREAM_FACTORY),
					stream: ctx.parse(stream)
				};
			}
		},
		serialize(node, ctx) {
			return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.stream) + ")";
		},
		deserialize(node, ctx) {
			return READABLE_STREAM_FACTORY_CONSTRUCTOR(ctx.deserialize(node.stream));
		}
	})
];
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/scroll-restoration-inline.js
var scroll_restoration_inline_default = "function(a,f){let l;try{l=JSON.parse(sessionStorage.getItem(a)||\"{}\")}catch{return}const n=l?.[f||history.state?.__TSR_key];let c=!1;for(const t in n){const e=n[t],o=e?.scrollX,s=e?.scrollY;if(Number.isFinite(o)&&Number.isFinite(s)){if(t===\"window\")scrollTo(o,s),c=!0;else if(t)try{const r=document.querySelector(t);r&&(r.scrollLeft=o,r.scrollTop=s)}catch{}}}if(c)return;const i=location.hash.slice(1);if(i){const t=history.state?.__hashScrollIntoViewOptions??!0;if(t){const e=document.getElementById(i);e&&e.scrollIntoView(t)}return}scrollTo(0,0)}";
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/scroll-restoration-script/server.js
var defaultInlineScrollRestorationScript = `(${scroll_restoration_inline_default})(${escapeHtml(JSON.stringify(storageKey))})`;
function getScrollRestorationScript(key) {
	if (key === void 0) return defaultInlineScrollRestorationScript;
	return `(${scroll_restoration_inline_default})(${escapeHtml(JSON.stringify(storageKey))},${escapeHtml(JSON.stringify(key))})`;
}
function getScrollRestorationScriptForRouter(router) {
	if (typeof router.options.scrollRestoration === "function" && !router.options.scrollRestoration({ location: router.latestLocation })) return null;
	const getKey = router.options.getScrollRestorationKey;
	if (!getKey) return defaultInlineScrollRestorationScript;
	const location = router.latestLocation;
	const userKey = getKey(location);
	if (userKey === defaultGetScrollRestorationKey(location)) return defaultInlineScrollRestorationScript;
	return getScrollRestorationScript(userKey);
}
//#endregion
//#region ../../node_modules/cookie-es/dist/index.mjs
function splitSetCookieString(cookiesString) {
	if (Array.isArray(cookiesString)) return cookiesString.flatMap((c) => splitSetCookieString(c));
	if (typeof cookiesString !== "string") return [];
	const cookiesStrings = [];
	let pos = 0;
	let start;
	let ch;
	let lastComma;
	let nextStart;
	let cookiesSeparatorFound;
	const skipWhitespace = () => {
		while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
		return pos < cookiesString.length;
	};
	const notSpecialChar = () => {
		ch = cookiesString.charAt(pos);
		return ch !== "=" && ch !== ";" && ch !== ",";
	};
	while (pos < cookiesString.length) {
		start = pos;
		cookiesSeparatorFound = false;
		while (skipWhitespace()) {
			ch = cookiesString.charAt(pos);
			if (ch === ",") {
				lastComma = pos;
				pos += 1;
				skipWhitespace();
				nextStart = pos;
				while (pos < cookiesString.length && notSpecialChar()) pos += 1;
				if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
					cookiesSeparatorFound = true;
					pos = nextStart;
					cookiesStrings.push(cookiesString.slice(start, lastComma));
					start = pos;
				} else pos = lastComma + 1;
			} else pos += 1;
		}
		if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.slice(start));
	}
	return cookiesStrings;
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/headers.js
function toHeadersInstance(init) {
	if (init instanceof Headers) return init;
	else if (Array.isArray(init)) return new Headers(init);
	else if (typeof init === "object") return new Headers(init);
	else return null;
}
function mergeHeaders(...headers) {
	return headers.reduce((acc, header) => {
		const headersInstance = toHeadersInstance(header);
		if (!headersInstance) return acc;
		for (const [key, value] of headersInstance.entries()) if (key === "set-cookie") splitSetCookieString(value).forEach((cookie) => acc.append("set-cookie", cookie));
		else acc.set(key, value);
		return acc;
	}, new Headers());
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/ssr-match-id.js
function dehydrateSsrMatchId(id) {
	return id.replaceAll("/", "\0");
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/tsrScript.js
var tsrScript_default = "self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]}";
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/ssr-server.js
var SCOPE_ID = "tsr";
var TSR_PREFIX = GLOBAL_TSR + ".router=";
var P_PREFIX = GLOBAL_TSR + ".p(()=>";
var P_SUFFIX = ")";
function dehydrateMatch(match) {
	const dehydratedMatch = {
		i: dehydrateSsrMatchId(match.id),
		u: match.updatedAt,
		s: match.status
	};
	for (const [key, shorthand] of [
		["__beforeLoadContext", "b"],
		["loaderData", "l"],
		["error", "e"],
		["ssr", "ssr"]
	]) if (match[key] !== void 0) dehydratedMatch[shorthand] = match[key];
	if (match.globalNotFound) dehydratedMatch.g = true;
	return dehydratedMatch;
}
var INITIAL_SCRIPTS = [getCrossReferenceHeader(SCOPE_ID), tsrScript_default];
var ScriptBuffer = class {
	constructor(injectScript) {
		this._scriptBarrierLifted = false;
		this._cleanedUp = false;
		this._microtaskVersion = 0;
		this._pendingMicrotaskVersion = 0;
		this.injectScript = injectScript;
		this._queue = INITIAL_SCRIPTS.slice();
	}
	enqueue(script) {
		if (this._cleanedUp) return;
		this._queue.push(script);
		if (this._scriptBarrierLifted) this.scheduleInjectBufferedScripts();
	}
	liftBarrier() {
		if (this._scriptBarrierLifted || this._cleanedUp) return;
		this._scriptBarrierLifted = true;
		if (this._queue.length > 0) this.scheduleInjectBufferedScripts();
	}
	scheduleInjectBufferedScripts() {
		if (this._pendingMicrotaskVersion !== 0) return;
		const pendingVersion = ++this._microtaskVersion;
		this._pendingMicrotaskVersion = pendingVersion;
		queueMicrotask(() => {
			if (this._pendingMicrotaskVersion !== pendingVersion) return;
			this._pendingMicrotaskVersion = 0;
			this.injectBufferedScripts();
		});
	}
	clearPendingMicrotask() {
		if (this._pendingMicrotaskVersion === 0) return;
		this._pendingMicrotaskVersion = 0;
		this._microtaskVersion++;
	}
	/**
	* Flushes any pending scripts synchronously.
	* Call this before signaling serialization finished to ensure all scripts are injected.
	*
	* IMPORTANT: Only injects if the barrier has been lifted. Before the barrier is lifted,
	* scripts should remain in the queue so takeBufferedScripts() can retrieve them
	*/
	flush() {
		if (!this._scriptBarrierLifted) return;
		if (this._cleanedUp) return;
		this.clearPendingMicrotask();
		this.injectBufferedScripts();
	}
	takeAll() {
		return this.takeScripts(this._queue.length);
	}
	takeScripts(count) {
		if (count <= 0) return void 0;
		const bufferedScripts = this._queue.splice(0, count);
		if (bufferedScripts.length === 0) return;
		if (bufferedScripts.length === 1) return bufferedScripts[0] + ";document.currentScript.remove()";
		return bufferedScripts.join(";") + ";document.currentScript.remove()";
	}
	hasPending() {
		return this._queue.length > 0;
	}
	injectBufferedScripts() {
		if (this._cleanedUp) return;
		if (this._queue.length === 0) return;
		const scriptsToInject = this.takeAll();
		if (scriptsToInject) this.injectScript?.(scriptsToInject);
	}
	cleanup() {
		this._cleanedUp = true;
		this.clearPendingMicrotask();
		this._queue = [];
		this.injectScript = void 0;
	}
};
var MANIFEST_CACHE_SIZE = 100;
var manifestCaches = /* @__PURE__ */ new WeakMap();
function getManifestCache(manifest) {
	const cache = manifestCaches.get(manifest);
	if (cache) return cache;
	const newCache = createLRUCache(MANIFEST_CACHE_SIZE);
	manifestCaches.set(manifest, newCache);
	return newCache;
}
function getInlineCssForPreparedRoutes(manifest, preparedRoutes) {
	if (preparedRoutes.inlineCss !== void 0) return preparedRoutes.inlineCss;
	const styles = manifest.inlineCss?.styles;
	const hrefs = preparedRoutes.inlineCssHrefs;
	if (!styles || !hrefs?.length) return void 0;
	let css = "";
	for (const href of hrefs) css += styles[href];
	preparedRoutes.inlineCss = css;
	return css;
}
function getInlineCssAssetForPreparedRoutes(manifest, preparedRoutes) {
	const css = getInlineCssForPreparedRoutes(manifest, preparedRoutes);
	return css === void 0 ? void 0 : createInlineCssStyleAsset(css);
}
function getMatchedRoutesCacheKey(matches) {
	let cacheKey = "";
	for (let i = 0; i < matches.length; i++) cacheKey += (i === 0 ? "" : "\0") + matches[i].routeId;
	return cacheKey;
}
function getPreparedMatchedManifestRoutes(manifest, matches, cacheKey) {
	{
		const cached = getManifestCache(manifest).get(cacheKey);
		if (cached) return cached;
	}
	const preparedRoutes = prepareMatchedManifestRoutes(manifest, matches);
	getManifestCache(manifest).set(cacheKey, preparedRoutes);
	return preparedRoutes;
}
function prepareMatchedManifestRoutes(manifest, matches) {
	const inlineStyles = manifest.inlineCss?.styles;
	const routes = {};
	if (!inlineStyles) {
		for (const match of matches) {
			const route = manifest.routes[match.routeId];
			if (route) routes[match.routeId] = route;
		}
		return {
			routes,
			hasStrippedRoutes: false
		};
	}
	const inlineCssHrefs = [];
	const seenInlineCssHrefs = /* @__PURE__ */ new Set();
	let hasStrippedRoutes = false;
	for (const match of matches) {
		const routeId = match.routeId;
		const route = manifest.routes[routeId];
		if (!route) continue;
		const nextRoute = stripInlinedStylesheetAssetsFromRoute(inlineStyles, route, inlineCssHrefs, seenInlineCssHrefs);
		if (nextRoute !== route) hasStrippedRoutes = true;
		routes[routeId] = nextRoute;
	}
	return {
		routes,
		hasStrippedRoutes,
		...inlineCssHrefs.length ? { inlineCssHrefs } : {}
	};
}
function stripInlinedStylesheetAssetsFromRoute(inlineStyles, route, inlineCssHrefs, seenInlineCssHrefs) {
	const css = route.css;
	if (!css) return route;
	if (css.length === 0) {
		const nextRoute = { ...route };
		delete nextRoute.css;
		return nextRoute;
	}
	let cssLinks;
	for (let i = 0; i < css.length; i++) {
		const link = css[i];
		const href = getStylesheetHref(link);
		if (inlineStyles[href] === void 0) {
			if (cssLinks) cssLinks.push(link);
			continue;
		}
		if (!seenInlineCssHrefs.has(href)) {
			seenInlineCssHrefs.add(href);
			inlineCssHrefs.push(href);
		}
		if (!cssLinks) cssLinks = css.slice(0, i);
	}
	if (!cssLinks) return route;
	if (cssLinks.length > 0) return {
		...route,
		css: cssLinks
	};
	const nextRoute = { ...route };
	delete nextRoute.css;
	return nextRoute;
}
function hasRouteAssets(route) {
	return !!route.scripts?.length || !!route.css?.length;
}
function hasRequestAssets(assets) {
	return !!assets && (!!assets.preloads?.length || hasRouteAssets(assets));
}
function mergeRequestAssetsIntoRootRoute(rootRoute, requestAssets) {
	const preloads = requestAssets?.preloads?.length ? [...requestAssets.preloads, ...rootRoute?.preloads ?? []] : rootRoute?.preloads;
	const scripts = requestAssets?.scripts?.length ? [...requestAssets.scripts, ...rootRoute?.scripts ?? []] : rootRoute?.scripts;
	const cssLinks = requestAssets?.css?.length ? [...requestAssets.css, ...rootRoute?.css ?? []] : rootRoute?.css;
	return {
		...rootRoute ?? {},
		...preloads?.length ? { preloads } : {},
		...scripts?.length ? { scripts } : {},
		...cssLinks?.length ? { css: cssLinks } : {}
	};
}
function attachRouterServerSsrUtils({ router, manifest, getRequestAssets }) {
	router.ssr = { get manifest() {
		if (!manifest) return manifest;
		const requestAssets = getRequestAssets?.();
		const matches = router.stores.matches.get();
		const hasAssets = hasRequestAssets(requestAssets);
		if (!hasAssets && !manifest.inlineCss) return manifest;
		let inlineCssAsset;
		let routes = manifest.routes;
		if (manifest.inlineCss) {
			const preparedManifest = getPreparedMatchedManifestRoutes(manifest, matches, getMatchedRoutesCacheKey(matches));
			inlineCssAsset = getInlineCssAssetForPreparedRoutes(manifest, preparedManifest);
			if (preparedManifest.hasStrippedRoutes) routes = {
				...manifest.routes,
				...preparedManifest.routes
			};
		}
		if (!hasAssets) return {
			...manifest.scriptFormat ? { scriptFormat: manifest.scriptFormat } : {},
			...inlineCssAsset ? { inlineStyle: inlineCssAsset } : {},
			routes
		};
		const rootRoute = routes[rootRouteId];
		return {
			...manifest.scriptFormat ? { scriptFormat: manifest.scriptFormat } : {},
			...inlineCssAsset ? { inlineStyle: inlineCssAsset } : {},
			routes: {
				...routes,
				[rootRouteId]: mergeRequestAssetsIntoRootRoute(rootRoute, requestAssets)
			}
		};
	} };
	let _dehydrated = false;
	let _serializationFinished = false;
	let streamFastPathReserved = false;
	const renderFinishedListeners = [];
	const injectedHtmlListeners = [];
	const serializationFinishedListeners = [];
	const cleanupListeners = [];
	let cleanupStarted = false;
	let injectedHtmlBuffer = "";
	const callListeners = (listeners, errorPrefix) => {
		const snapshot = listeners.slice();
		for (const l of snapshot) try {
			l();
		} catch (err) {
			console.error(`${errorPrefix}:`, err);
		}
	};
	const removeListener = (listeners, listener) => {
		const index = listeners.indexOf(listener);
		if (index >= 0) listeners.splice(index, 1);
	};
	const scriptBuffer = new ScriptBuffer((script) => {
		serverSsr.injectScript(script);
	});
	const serverSsr = {
		injectHtml: (html) => {
			if (!html || cleanupStarted) return;
			injectedHtmlBuffer += html;
			callListeners(injectedHtmlListeners, "SSR injected HTML listener error");
		},
		injectScript: (script) => {
			if (!script || cleanupStarted) return;
			const html = `<script${router.options.ssr?.nonce ? ` nonce='${router.options.ssr.nonce}'` : ""}>${script}<\/script>`;
			serverSsr.injectHtml(html);
		},
		dehydrate: async (opts) => {
			if (_dehydrated) invariant();
			let matchesToDehydrate = router.stores.matches.get();
			if (router.isShell()) matchesToDehydrate = matchesToDehydrate.slice(0, 1);
			const matches = matchesToDehydrate.map(dehydrateMatch);
			let manifestToDehydrate = void 0;
			if (manifest) {
				const cacheKey = getMatchedRoutesCacheKey(matchesToDehydrate);
				const preparedManifest = getPreparedMatchedManifestRoutes(manifest, matchesToDehydrate, cacheKey);
				manifestToDehydrate = {
					...manifest.scriptFormat ? { scriptFormat: manifest.scriptFormat } : {},
					...preparedManifest.inlineCssHrefs ? { inlineStyle: createInlineCssPlaceholderAsset() } : {},
					routes: preparedManifest.routes
				};
				const requestAssets = opts?.requestAssets;
				if (hasRequestAssets(requestAssets)) {
					const existingRoot = manifestToDehydrate.routes[rootRouteId];
					manifestToDehydrate.routes = {
						...manifestToDehydrate.routes,
						[rootRouteId]: mergeRequestAssetsIntoRootRoute(existingRoot, requestAssets)
					};
				}
			}
			const dehydratedRouter = {
				manifest: manifestToDehydrate,
				matches
			};
			const lastMatchId = matchesToDehydrate[matchesToDehydrate.length - 1]?.id;
			if (lastMatchId) dehydratedRouter.lastMatchId = dehydrateSsrMatchId(lastMatchId);
			const dehydratedData = await router.options.dehydrate?.();
			if (dehydratedData) dehydratedRouter.dehydratedData = dehydratedData;
			_dehydrated = true;
			const trackPlugins = { didRun: false };
			const serializationAdapters = router.options.serializationAdapters;
			const plugins = serializationAdapters ? serializationAdapters.map((t) => /* @__PURE__ */ makeSsrSerovalPlugin(t, trackPlugins)).concat(defaultSerovalPlugins) : defaultSerovalPlugins;
			let serializationCompleteSignaled = false;
			const signalSerializationComplete = () => {
				if (serializationCompleteSignaled || cleanupStarted) return;
				serializationCompleteSignaled = true;
				_serializationFinished = true;
				const listeners = serializationFinishedListeners.slice();
				serializationFinishedListeners.length = 0;
				for (const l of listeners) try {
					l();
				} catch (err) {
					console.error("Serialization listener error:", err);
				}
			};
			const finishScriptSerialization = () => {
				if (serializationCompleteSignaled || cleanupStarted) return;
				scriptBuffer.enqueue(GLOBAL_TSR + ".e()");
				scriptBuffer.flush();
				signalSerializationComplete();
			};
			crossSerializeStream(dehydratedRouter, {
				refs: /* @__PURE__ */ new Map(),
				plugins,
				onSerialize: (data, initial) => {
					let serialized = initial ? TSR_PREFIX + data : data;
					if (trackPlugins.didRun) serialized = P_PREFIX + serialized + P_SUFFIX;
					scriptBuffer.enqueue(serialized);
				},
				onError: (err) => {
					console.error("Serialization error:", err);
					if (err && err.stack) console.error(err.stack);
					finishScriptSerialization();
				},
				scopeId: SCOPE_ID,
				onDone: () => {
					finishScriptSerialization();
				}
			});
		},
		isDehydrated() {
			return _dehydrated;
		},
		isSerializationFinished() {
			return _serializationFinished;
		},
		reserveStreamFastPath() {
			if (!cleanupStarted && _serializationFinished && !streamFastPathReserved && renderFinishedListeners.length === 0 && !injectedHtmlBuffer && !scriptBuffer.hasPending()) {
				streamFastPathReserved = true;
				return true;
			}
			return false;
		},
		onInjectedHtml: (listener) => {
			if (cleanupStarted) return () => {};
			injectedHtmlListeners.push(listener);
			return () => removeListener(injectedHtmlListeners, listener);
		},
		onRenderFinished: (listener) => {
			if (cleanupStarted || streamFastPathReserved) return;
			renderFinishedListeners.push(listener);
		},
		onSerializationFinished: (listener) => {
			if (cleanupStarted) return () => {};
			if (_serializationFinished && !cleanupStarted) {
				try {
					listener();
				} catch (err) {
					console.error("Serialization listener error:", err);
				}
				return () => {};
			}
			serializationFinishedListeners.push(listener);
			return () => removeListener(serializationFinishedListeners, listener);
		},
		onCleanup: (listener) => {
			if (cleanupStarted) return;
			cleanupListeners.push(listener);
		},
		setRenderFinished: () => {
			if (cleanupStarted) return;
			scriptBuffer.liftBarrier();
			const listeners = renderFinishedListeners.slice();
			renderFinishedListeners.length = 0;
			for (const l of listeners) try {
				l();
			} catch (err) {
				console.error("Error in render finished listener:", err);
			}
			if (_serializationFinished) scriptBuffer.flush();
		},
		takeBufferedScripts() {
			const scripts = scriptBuffer.takeAll();
			if (!scripts) return void 0;
			return {
				tag: "script",
				attrs: {
					nonce: router.options.ssr?.nonce,
					className: "$tsr",
					id: TSR_SCRIPT_BARRIER_ID
				},
				children: scripts
			};
		},
		liftScriptBarrier() {
			scriptBuffer.liftBarrier();
		},
		takeBufferedHtml() {
			if (!injectedHtmlBuffer) return;
			const buffered = injectedHtmlBuffer;
			injectedHtmlBuffer = "";
			return buffered;
		},
		cleanup() {
			if (cleanupStarted) return;
			cleanupStarted = true;
			const listeners = cleanupListeners.slice();
			cleanupListeners.length = 0;
			for (const l of listeners) try {
				l();
			} catch (err) {
				console.error("Error in SSR cleanup listener:", err);
			}
			renderFinishedListeners.length = 0;
			injectedHtmlListeners.length = 0;
			serializationFinishedListeners.length = 0;
			injectedHtmlBuffer = "";
			scriptBuffer.cleanup();
			router.serverSsr = void 0;
		}
	};
	router.serverSsr = serverSsr;
	for (const listener of router.serverSsrLifecycle?.onServerSsrAttach ?? []) try {
		listener(serverSsr);
	} catch (err) {
		console.error("SSR attach listener error:", err);
	}
}
/**
* Get the origin for the request.
*
* SECURITY: We intentionally do NOT trust the Origin header for determining
* the router's origin. The Origin header can be spoofed by attackers, which
* could lead to SSRF-like vulnerabilities where redirects are constructed
* using a malicious origin (CVE-2024-34351).
*
* Instead, we derive the origin from request.url, which is typically set by
* the server infrastructure (not client-controlled headers).
*
* For applications behind proxies that need to trust forwarded headers,
* use the router's `origin` option to explicitly configure a trusted origin.
*/
function getOrigin(request) {
	try {
		return new URL(request.url).origin;
	} catch {}
	return "http://localhost";
}
function getNormalizedURL(url, base) {
	if (typeof url === "string") url = url.replace("\\", "%5C");
	const rawUrl = new URL(url, base);
	const { path: decodedPathname, handledProtocolRelativeURL } = decodePath(rawUrl.pathname);
	const searchParams = new URLSearchParams(rawUrl.search);
	const normalizedHref = decodedPathname + (searchParams.size > 0 ? "?" : "") + searchParams.toString() + rawUrl.hash;
	return {
		url: new URL(normalizedHref, rawUrl.origin),
		handledProtocolRelativeURL
	};
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/handlerCallback.js
function isSsrResponse(value) {
	return typeof value === "object" && value !== null && "response" in value && "serverSsrCleanup" in value;
}
function normalizeSsrResponse(result) {
	return isSsrResponse(result) ? result : {
		response: result,
		serverSsrCleanup: "none"
	};
}
function createSsrStreamResponse(router, response) {
	if (!response.body) throw new Error("Invariant failed: SSR stream response requires a body");
	let disposed = false;
	return {
		response,
		serverSsrCleanup: "stream",
		async dispose(reason) {
			if (disposed) return;
			disposed = true;
			try {
				await response.body.cancel(reason);
			} catch {}
			router.serverSsr?.cleanup();
		}
	};
}
async function replaceSsrResponse(result, response, reason) {
	const ssrResponse = normalizeSsrResponse(result);
	if (ssrResponse.serverSsrCleanup === "stream") await ssrResponse.dispose(reason);
	return {
		response,
		serverSsrCleanup: "none"
	};
}
async function stripSsrResponseBody(result, reason) {
	const ssrResponse = normalizeSsrResponse(result);
	if (ssrResponse.serverSsrCleanup === "stream") await ssrResponse.dispose(reason);
	return {
		response: new Response(null, ssrResponse.response),
		serverSsrCleanup: "none"
	};
}
function defineHandlerCallback(handler) {
	return handler;
}
//#endregion
//#region ../../node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js
function transformReadableStreamWithRouter(router, routerStream, opts) {
	return transformStreamWithRouter(router, routerStream, opts);
}
var MIN_CLOSING_TAG_LENGTH = 4;
var DEFAULT_SERIALIZATION_TIMEOUT_MS = 6e4;
var DEFAULT_LIFETIME_TIMEOUT_MS = DEFAULT_SERIALIZATION_TIMEOUT_MS * 2;
var MAX_LEFTOVER_CHARS = 2048;
var MAX_TAIL_CHARS = 65536;
var MAX_ROUTER_HTML_CHARS = 16777216;
var MAX_PENDING_WRITE_CHARS = 16777216;
var MergeState = {
	ReadingBody: 0,
	HoldingTail: 1,
	AppDone: 2,
	Draining: 3,
	Done: 4
};
var textEncoder = new TextEncoder();
var noop = () => {};
var resolvedPromise = Promise.resolve();
function findHtmlBoundary(str) {
	let lastClosingTagEnd = -1;
	let searchFrom = str.length - MIN_CLOSING_TAG_LENGTH;
	while (searchFrom >= 0) {
		const openSlash = str.lastIndexOf("</", searchFrom);
		if (openSlash === -1) break;
		if ((str.charCodeAt(openSlash + 2) | 32) === 98 && (str.charCodeAt(openSlash + 3) | 32) === 111 && (str.charCodeAt(openSlash + 4) | 32) === 100 && (str.charCodeAt(openSlash + 5) | 32) === 121 && str.charCodeAt(openSlash + 6) === 62) return -openSlash - 2;
		if (lastClosingTagEnd === -1) {
			let i = openSlash + 2;
			const startCode = str.charCodeAt(i);
			if (startCode >= 97 && startCode <= 122 || startCode >= 65 && startCode <= 90) {
				i++;
				while (i < str.length) {
					const code = str.charCodeAt(i);
					if (code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 48 && code <= 57 || code === 95 || code === 58 || code === 46 || code === 45) i++;
					else break;
				}
				if (str.charCodeAt(i) === 62) lastClosingTagEnd = i + 1;
			}
		}
		searchFrom = openSlash - 1;
	}
	return lastClosingTagEnd;
}
function safeReleaseReader(reader) {
	try {
		reader.releaseLock();
		return true;
	} catch {
		return false;
	}
}
/**
* Cancel a reader without producing an unhandled rejection. `reader.cancel()`
* can reject (e.g. when the underlying source's cancel() throws), and
* downstream cancel() should still wait for upstream teardown when possible.
*/
function safeCancelReader(reader, reason) {
	let cancelPromise;
	try {
		cancelPromise = reader.cancel(reason);
	} catch {}
	if (!safeReleaseReader(reader) && cancelPromise) return cancelPromise.then(noop, noop).then(() => {
		safeReleaseReader(reader);
	});
	return cancelPromise ? cancelPromise.then(noop, noop) : resolvedPromise;
}
function createReaderState(appStream) {
	const reader = appStream.getReader();
	let released = false;
	return {
		reader,
		cancel: (reason) => {
			if (released) return resolvedPromise;
			released = true;
			return safeCancelReader(reader, reason);
		},
		release: () => {
			if (released) return;
			released = true;
			safeReleaseReader(reader);
		}
	};
}
function createAbortNotifier(opts) {
	let abortNotified = false;
	return (reason) => {
		if (abortNotified) return;
		abortNotified = true;
		try {
			opts?.onAbort?.(reason);
		} catch {}
	};
}
function transformStreamWithRouter(router, appStream, opts) {
	const serverSsr = router.serverSsr;
	if (!serverSsr) throw new Error("Invariant failed: router.serverSsr is required");
	if (serverSsr.reserveStreamFastPath()) return makeFastPathStream(appStream, opts, serverSsr);
	return makeMainStream(serverSsr, appStream, opts);
}
function makeFastPathStream(appStream, opts, serverSsr) {
	let cleanedUp = false;
	let controller;
	let state = MergeState.ReadingBody;
	let lifetimeTimeoutHandle;
	let stopListeningToInjectedHtml;
	const readerState = createReaderState(appStream);
	const notifyAbort = createAbortNotifier(opts);
	const isDone = () => state === MergeState.Done;
	let renderFinished = false;
	const finishSsrRendering = () => {
		if (!serverSsr || renderFinished) return true;
		renderFinished = true;
		try {
			serverSsr.setRenderFinished();
			return true;
		} catch (error) {
			safeError(error);
			cleanup(error);
			return false;
		}
	};
	const cleanup = (reason, cancelReader = true) => {
		if (cleanedUp) return resolvedPromise;
		cleanedUp = true;
		if (lifetimeTimeoutHandle !== void 0) {
			clearTimeout(lifetimeTimeoutHandle);
			lifetimeTimeoutHandle = void 0;
		}
		try {
			stopListeningToInjectedHtml?.();
		} catch {}
		stopListeningToInjectedHtml = void 0;
		if (cancelReader) notifyAbort(reason);
		const readerDone = cancelReader ? readerState.cancel(reason) : (readerState.release(), resolvedPromise);
		if (serverSsr) try {
			serverSsr.cleanup();
		} catch (error) {
			console.error("Error in SSR cleanup:", error);
		}
		return readerDone;
	};
	const safeClose = () => {
		if (isDone()) return;
		state = MergeState.Done;
		try {
			controller?.close();
		} catch {}
	};
	const safeError = (error) => {
		if (isDone()) return;
		state = MergeState.Done;
		try {
			controller?.error(error);
		} catch {}
	};
	if (serverSsr) stopListeningToInjectedHtml = serverSsr.onInjectedHtml(() => {
		const err = /* @__PURE__ */ new Error("SSR router HTML injected during fast path");
		safeError(err);
		cleanup(err);
	});
	const lifetimeMs = opts?.lifetimeMs ?? DEFAULT_LIFETIME_TIMEOUT_MS;
	lifetimeTimeoutHandle = setTimeout(() => {
		if (!cleanedUp && !isDone()) {
			const err = /* @__PURE__ */ new Error("Stream lifetime exceeded");
			console.warn(`SSR stream transform exceeded maximum lifetime (${lifetimeMs}ms), forcing cleanup`);
			safeError(err);
			cleanup(err);
		}
	}, lifetimeMs);
	return new ReadableStream$1({
		start(c) {
			controller = c;
		},
		async pull(c) {
			if (cleanedUp || isDone()) return;
			try {
				const { done, value } = await readerState.reader.read();
				if (!done) {
					if (!cleanedUp && !isDone()) c.enqueue(value);
					return;
				}
				if (cleanedUp || isDone()) return;
				if (!finishSsrRendering()) return;
				safeClose();
				return cleanup(void 0, false);
			} catch (error) {
				if (cleanedUp) return;
				console.error("Error reading appStream:", error);
				if (state < MergeState.AppDone) try {
					serverSsr?.setRenderFinished();
				} catch {}
				safeError(error);
				return cleanup(error);
			} finally {
				if (cleanedUp || isDone()) readerState.release();
			}
		},
		cancel(reason) {
			state = MergeState.Done;
			return cleanup(reason);
		}
	});
}
function makeMainStream(serverSsr, appStream, opts) {
	let stopListeningToInjectedHtml;
	let stopListeningToSerializationFinished;
	let serializationTimeoutHandle;
	let lifetimeTimeoutHandle;
	let cleanedUp = false;
	let controller;
	let closeWhenDrained = false;
	let state = MergeState.ReadingBody;
	const readerState = createReaderState(appStream);
	const notifyAbort = createAbortNotifier(opts);
	const pendingWrites = [];
	let pendingWriteHead = 0;
	let pendingWriteChars = 0;
	function clearPending() {
		pendingWrites.length = 0;
		pendingWriteHead = 0;
		pendingWriteChars = 0;
	}
	let drainResolve = null;
	const waitForDrain = () => new Promise((r) => {
		drainResolve = r;
	});
	const signalDrain = () => {
		if (drainResolve) {
			const r = drainResolve;
			drainResolve = null;
			r();
		}
	};
	const isDone = () => state === MergeState.Done;
	function drainPending() {
		if (!controller || isDone()) return;
		while (pendingWriteHead < pendingWrites.length) {
			const ds = controller.desiredSize;
			if (ds !== null && ds <= 0) return;
			const next = pendingWrites[pendingWriteHead];
			pendingWrites[pendingWriteHead] = "";
			pendingWriteHead++;
			pendingWriteChars -= next.length;
			try {
				controller.enqueue(textEncoder.encode(next));
			} catch (error) {
				safeError(error);
				cleanup(error);
				return;
			}
		}
		if (pendingWriteHead >= pendingWrites.length) {
			pendingWrites.length = 0;
			pendingWriteHead = 0;
		}
		if (closeWhenDrained && pendingWriteHead >= pendingWrites.length) {
			closeWhenDrained = false;
			safeClose();
			cleanup(void 0, false);
		}
	}
	/**
	* Enqueue a string chunk through the backpressure queue. Stored as a
	* string and encoded only when the downstream actually accepts the chunk
	* — keeps native-memory pressure inside the controller's queue (which
	* honors desiredSize) rather than ours.
	*/
	function writeChunk(chunk) {
		if (cleanedUp || isDone()) return;
		if (!chunk.length) return;
		if (pendingWriteChars + chunk.length > MAX_PENDING_WRITE_CHARS) {
			const err = /* @__PURE__ */ new Error("SSR stream pending output exceeded maximum buffer");
			safeError(err);
			cleanup(err);
			return;
		}
		pendingWrites.push(chunk);
		pendingWriteChars += chunk.length;
		drainPending();
	}
	function safeClose() {
		if (isDone()) return;
		state = MergeState.Done;
		try {
			controller?.close();
		} catch {}
	}
	function safeError(error) {
		if (isDone()) return;
		state = MergeState.Done;
		try {
			controller?.error(error);
		} catch {}
	}
	/**
	* Cleanup with guards; must be idempotent.
	*/
	function cleanup(reason, cancelReader = true) {
		if (cleanedUp) return resolvedPromise;
		cleanedUp = true;
		try {
			stopListeningToInjectedHtml?.();
			stopListeningToSerializationFinished?.();
		} catch {}
		stopListeningToInjectedHtml = void 0;
		stopListeningToSerializationFinished = void 0;
		if (serializationTimeoutHandle !== void 0) {
			clearTimeout(serializationTimeoutHandle);
			serializationTimeoutHandle = void 0;
		}
		if (lifetimeTimeoutHandle !== void 0) {
			clearTimeout(lifetimeTimeoutHandle);
			lifetimeTimeoutHandle = void 0;
		}
		clearPendingRouterHtml();
		leftover = "";
		pendingTail = "";
		clearPending();
		if (cancelReader) notifyAbort(reason);
		const readerDone = cancelReader ? readerState.cancel(reason) : (readerState.release(), resolvedPromise);
		signalDrain();
		try {
			serverSsr.cleanup();
		} catch (error) {
			console.error("Error in SSR cleanup:", error);
		}
		return readerDone;
	}
	const textDecoder = new TextDecoder();
	const pendingRouterHtml = [];
	let pendingRouterHtmlChars = 0;
	let leftover = "";
	let pendingTail = "";
	let streamBarrierLifted = false;
	let streamBarrierMarkerSeen = false;
	let serializationFinished = false;
	function noteBarrierMarker(chunk) {
		if (streamBarrierMarkerSeen) return;
		if (chunk.includes("$tsr-stream-barrier")) streamBarrierMarkerSeen = true;
	}
	function liftBarrierAfterBoundary() {
		if (streamBarrierLifted) return;
		if (!streamBarrierMarkerSeen) return;
		streamBarrierLifted = true;
		serverSsr.liftScriptBarrier();
	}
	const stream = new ReadableStream$1({
		start(c) {
			controller = c;
			drainPending();
		},
		pull() {
			drainPending();
			signalDrain();
		},
		cancel(reason) {
			state = MergeState.Done;
			return cleanup(reason);
		}
	});
	function drainRouterHtml() {
		if (cleanedUp || isDone()) return;
		let html;
		try {
			html = serverSsr.takeBufferedHtml();
		} catch (error) {
			safeError(error);
			cleanup(error);
			return;
		}
		if (!html) return;
		if (state >= MergeState.Draining) {
			const err = /* @__PURE__ */ new Error("SSR router HTML injected after stream finalization");
			safeError(err);
			cleanup(err);
			return;
		}
		if (state === MergeState.HoldingTail) {
			flushPendingRouterHtml();
			writeChunk(html);
		} else {
			if (pendingRouterHtmlChars + html.length > MAX_ROUTER_HTML_CHARS) {
				const err = /* @__PURE__ */ new Error("SSR router HTML exceeded maximum buffer");
				safeError(err);
				cleanup(err);
				return;
			}
			pendingRouterHtml.push(html);
			pendingRouterHtmlChars += html.length;
		}
	}
	function flushPendingRouterHtml() {
		if (!pendingRouterHtml.length) return;
		for (const html of pendingRouterHtml) writeChunk(html);
		clearPendingRouterHtml();
	}
	function clearPendingRouterHtml() {
		pendingRouterHtml.length = 0;
		pendingRouterHtmlChars = 0;
	}
	function appendTail(chunk) {
		pendingTail += chunk;
		if (pendingTail.length > MAX_TAIL_CHARS) throw new Error("SSR stream tail exceeded maximum buffer");
	}
	function waitForBackpressure() {
		return !!(controller && controller.desiredSize !== null && controller.desiredSize <= 0);
	}
	function startSerializationTimeout() {
		if (cleanedUp || isDone()) return;
		if (serializationTimeoutHandle !== void 0) return;
		const timeoutMs = opts?.timeoutMs ?? DEFAULT_SERIALIZATION_TIMEOUT_MS;
		serializationTimeoutHandle = setTimeout(() => {
			if (!cleanedUp && !isDone()) {
				const err = /* @__PURE__ */ new Error("Serialization timeout after app render finished");
				console.error("Serialization timeout after app render finished");
				safeError(err);
				cleanup(err);
			}
		}, timeoutMs);
	}
	/**
	* Finish only when app done and serialization complete. Queues final
	* output and requests close-when-drained so we don't close ahead of
	* pending writes still waiting on downstream capacity.
	*/
	function tryFinish() {
		if (state !== MergeState.AppDone || !serializationFinished) return;
		if (cleanedUp || isDone()) return;
		if (serializationTimeoutHandle !== void 0) {
			clearTimeout(serializationTimeoutHandle);
			serializationTimeoutHandle = void 0;
		}
		drainRouterHtml();
		if (cleanedUp || isDone()) return;
		const decoderRemainder = textDecoder.decode();
		if (leftover) writeChunk(leftover);
		if (cleanedUp || isDone()) return;
		if (decoderRemainder) writeChunk(decoderRemainder);
		if (cleanedUp || isDone()) return;
		flushPendingRouterHtml();
		if (cleanedUp || isDone()) return;
		if (pendingTail) writeChunk(pendingTail);
		if (cleanedUp || isDone()) return;
		leftover = "";
		pendingTail = "";
		state = MergeState.Draining;
		closeWhenDrained = true;
		drainPending();
	}
	function finishAppRendering() {
		if (state >= MergeState.AppDone) return;
		state = MergeState.AppDone;
		try {
			serverSsr.setRenderFinished();
		} catch (error) {
			safeError(error);
			cleanup(error);
			return;
		}
		drainRouterHtml();
		if (cleanedUp || isDone()) return;
		serializationFinished = serializationFinished || serverSsr.isSerializationFinished();
		if (serializationFinished) tryFinish();
		else startSerializationTimeout();
	}
	const timeoutMs = opts?.timeoutMs ?? DEFAULT_SERIALIZATION_TIMEOUT_MS;
	const lifetimeMs = opts?.lifetimeMs ?? timeoutMs * 2;
	lifetimeTimeoutHandle = setTimeout(() => {
		if (!cleanedUp && !isDone()) {
			const err = /* @__PURE__ */ new Error("Stream lifetime exceeded");
			console.warn(`SSR stream transform exceeded maximum lifetime (${lifetimeMs}ms), forcing cleanup`);
			safeError(err);
			cleanup(err);
		}
	}, lifetimeMs);
	stopListeningToInjectedHtml = serverSsr.onInjectedHtml(() => {
		drainRouterHtml();
	});
	stopListeningToSerializationFinished = serverSsr.onSerializationFinished(() => {
		serializationFinished = true;
		drainRouterHtml();
		tryFinish();
	});
	drainRouterHtml();
	if (cleanedUp || isDone()) return stream;
	serializationFinished = serializationFinished || serverSsr.isSerializationFinished();
	if (serializationFinished) {
		drainRouterHtml();
		if (cleanedUp || isDone()) return stream;
	}
	(async () => {
		try {
			while (true) {
				if (waitForBackpressure()) {
					await waitForDrain();
					if (cleanedUp || isDone()) return;
				}
				const { done, value } = await readerState.reader.read();
				if (done) break;
				if (cleanedUp || isDone()) return;
				const text = typeof value === "string" ? value : textDecoder.decode(value, { stream: true });
				const chunkString = leftover ? leftover + text : text;
				if (state >= MergeState.HoldingTail) {
					appendTail(chunkString);
					leftover = "";
					continue;
				}
				const boundary = findHtmlBoundary(chunkString);
				if (boundary < -1) {
					const bodyEndIndex = -boundary - 2;
					state = MergeState.HoldingTail;
					appendTail(chunkString.slice(bodyEndIndex));
					const bodyChunk = chunkString.slice(0, bodyEndIndex);
					writeChunk(bodyChunk);
					if (cleanedUp || isDone()) return;
					noteBarrierMarker(bodyChunk);
					liftBarrierAfterBoundary();
					if (cleanedUp || isDone()) return;
					flushPendingRouterHtml();
					leftover = "";
					continue;
				}
				const lastClosingTagEnd = boundary;
				if (lastClosingTagEnd > 0) {
					const safeChunk = chunkString.slice(0, lastClosingTagEnd);
					writeChunk(safeChunk);
					if (cleanedUp || isDone()) return;
					noteBarrierMarker(safeChunk);
					liftBarrierAfterBoundary();
					if (cleanedUp || isDone()) return;
					flushPendingRouterHtml();
					leftover = chunkString.slice(lastClosingTagEnd);
					if (leftover.length > MAX_LEFTOVER_CHARS) {
						noteBarrierMarker(leftover);
						writeChunk(leftover.slice(0, leftover.length - MAX_LEFTOVER_CHARS));
						leftover = leftover.slice(-2048);
					}
				} else {
					const combined = chunkString;
					if (combined.length > MAX_LEFTOVER_CHARS) {
						noteBarrierMarker(combined);
						const flushUpto = combined.length - MAX_LEFTOVER_CHARS;
						writeChunk(combined.slice(0, flushUpto));
						leftover = combined.slice(flushUpto);
					} else leftover = combined;
				}
			}
			if (cleanedUp || isDone()) return;
			finishAppRendering();
		} catch (error) {
			if (cleanedUp) return;
			console.error("Error reading appStream:", error);
			if (state < MergeState.AppDone) try {
				serverSsr.setRenderFinished();
			} catch {}
			safeError(error);
			cleanup(error);
		} finally {
			readerState.release();
		}
	})().catch((error) => {
		if (cleanedUp) return;
		console.error("Error in stream transform:", error);
		safeError(error);
		cleanup(error);
	});
	return stream;
}
//#endregion
export { RouterCore as A, removeTrailingSlash as B, appendUniqueUserTags as C, resolveManifestAssetLink as D, getStylesheetHref as E, isRedirect as F, escapeHtml as G, invariant as H, isResolvedRedirect as I, isDangerousProtocol as J, functionalUpdate as K, rootRouteId as L, createNonReactiveMutableStore as M, createNonReactiveReadonlyStore as N, resolveManifestCssLink as O, executeRewriteInput as P, isNotFound as R, BaseRoute as S, getScriptPreloadAttrs as T, createControlledPromise as U, trimPathRight as V, deepEqual as W, replaceEqualDeep as X, isModuleNotFoundError as Y, makeSsrSerovalPlugin as _, normalizeSsrResponse as a, toCrossJSONStream as b, attachRouterServerSsrUtils as c, mergeHeaders as d, getScrollRestorationScriptForRouter as f, makeSerovalPlugin as g, createSerializationAdapter as h, isSsrResponse as i, getLocationChangeInfo as j, preloadWarning as k, getNormalizedURL as l, createRawStreamRPCPlugin as m, createSsrStreamResponse as n, replaceSsrResponse as o, defaultSerovalPlugins as p, hasKeys as q, defineHandlerCallback as r, stripSsrResponseBody as s, transformReadableStreamWithRouter as t, getOrigin as u, fromJSON as v, getAssetCrossOrigin as w, BaseRootRoute as x, toCrossJSONAsync as y, exactPathTest as z };
