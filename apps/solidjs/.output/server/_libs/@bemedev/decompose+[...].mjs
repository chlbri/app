//#region ../../node_modules/@bemedev/decompose/lib/sortMap.js
function sortMap(a, b) {
	return a.localeCompare(b);
}
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/constants/objects.js
var DEFAULT_FLAT_OPTIONS = {
	sep: ".",
	children: false
};
var DEFAULT_DECOMPOSE_OPTIONS = {
	sep: ".",
	object: "key",
	start: true
};
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/constants/strings.js
var DELIMITER = "-{/./:}-";
var LEFT_BRACKET = "-{LEFT_BRACKET}-";
var RIGHT_BRACKET = "-{RIGHT_BRACKET}-";
//#endregion
//#region ../../node_modules/ts-deepmerge/esm/index.js
// istanbul ignore next
var isObject = (obj) => {
	if (typeof obj === "object" && obj !== null) {
		if (typeof Object.getPrototypeOf === "function") {
			const prototype = Object.getPrototypeOf(obj);
			return prototype === Object.prototype || prototype === null;
		}
		return Object.prototype.toString.call(obj) === "[object Object]";
	}
	return false;
};
var UNSAFE_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype",
	"toString",
	"valueOf",
	"hasOwnProperty",
	"isPrototypeOf",
	"propertyIsEnumerable",
	"toLocaleString"
]);
var merge = (...objects) => objects.reduce((result, current) => {
	if (current === void 0) return result;
	if (Array.isArray(current)) throw new TypeError("Arguments provided to ts-deepmerge must be objects, not arrays.");
	Object.keys(current).forEach((key) => {
		if (UNSAFE_KEYS.has(key)) return;
		if (Array.isArray(result[key]) && Array.isArray(current[key])) result[key] = merge.options.mergeArrays ? merge.options.uniqueArrayItems ? Array.from(new Set(result[key].concat(current[key]))) : [...result[key], ...current[key]] : current[key];
		else if (isObject(result[key]) && isObject(current[key])) result[key] = merge(result[key], current[key]);
		else if (!isObject(result[key]) && isObject(current[key])) result[key] = merge(current[key], void 0);
		else result[key] = current[key] === void 0 ? merge.options.allowUndefinedOverrides ? current[key] : result[key] : current[key];
	});
	return result;
}, {});
var defaultOptions = {
	allowUndefinedOverrides: true,
	mergeArrays: true,
	uniqueArrayItems: true
};
merge.options = defaultOptions;
merge.withOptions = (options, ...objects) => {
	merge.options = Object.assign(Object.assign({}, defaultOptions), options);
	const result = merge(...objects);
	merge.options = defaultOptions;
	return result;
};
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/recompose.js
function recomposeObjectUrl(shape, value, sep = ".") {
	const obj = {};
	if (shape.length <= 0) return obj;
	const keys = shape.split(sep);
	if (keys.length === 1) {
		const key = keys.shift();
		obj[key] = value;
	} else {
		const key = keys.shift();
		obj[key] = recomposeObjectUrl(keys.join(sep), value, sep);
	}
	return obj;
}
var _recompose = (shape, options) => {
	const { sep, start } = {
		...DEFAULT_DECOMPOSE_OPTIONS,
		...options
	};
	const entries = Object.entries(shape);
	if (entries.length === 0) return {};
	const arr = [];
	entries.forEach(([key, value]) => {
		const cleanKey = start && key.startsWith(sep) ? key.slice(sep.length) : key;
		arr.push(recomposeObjectUrl(cleanKey, value, sep));
	});
	return _recompose2(merge(...arr));
};
var _recompose2 = (shape) => {
	if (Array.isArray(shape) || typeof shape !== "object" || shape === null) return shape;
	const entries = Object.entries(shape).sort(([a], [b]) => a.localeCompare(b));
	if (entries.length === 0) return {};
	if (entries.every(([key]) => key.startsWith("[") && key.endsWith("]"))) {
		const arr = [];
		entries.forEach(([key, value]) => {
			const index = parseInt(key.slice(1, -1), 10);
			arr[index] = _recompose2(value);
		});
		return arr;
	}
	return entries.reduce((acc, [key, value]) => {
		acc[key] = _recompose2(value);
		return acc;
	}, {});
};
var recompose = (shape, options) => _recompose(shape, options);
recompose.low = _recompose;
recompose.strict = _recompose;
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/helpers.js
function isPrimitive(arg) {
	return typeof arg === "number" || typeof arg === "string" || typeof arg === "boolean" || arg === void 0 || arg === null;
}
var isArrayIndex = (segment) => {
	return /^\[\d+\]$/.test(segment);
};
var parseIndex = (segment) => {
	return parseInt(segment.slice(1, -1), 10);
};
var splitKey = (key) => {
	return key.split(".").filter((s) => s !== "");
};
var nextDefault = (segment) => {
	return isArrayIndex(segment) ? [] : {};
};
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/decompose.js
function ddecompose$1(arg, prev = "", options = DEFAULT_DECOMPOSE_OPTIONS, first = true) {
	const { object } = {
		...DEFAULT_DECOMPOSE_OPTIONS,
		...options
	};
	const canAddObjectKeys = object === "both" || object === "object";
	const canAddKeys = object === "both" || object === "key";
	const _prev = prev ? prev + DELIMITER : "";
	const output = [];
	if (Array.isArray(arg)) {
		if (canAddObjectKeys && !first) output.push([`${prev}`, arg]);
		arg.forEach((item, index) => {
			const values = ddecompose$1(item, `${_prev}${LEFT_BRACKET}${index}${RIGHT_BRACKET}`, options, false);
			output.push(...values);
		});
		return output;
	}
	if (isPrimitive(arg)) {
		const isFirst = !prev.includes(DELIMITER);
		if (canAddKeys || isFirst) output.push([`${prev}`, arg]);
		return output;
	}
	if (canAddObjectKeys && prev !== "") output.push([`${prev}`, arg]);
	Object.entries(arg).forEach(([key, value]) => {
		const values = ddecompose$1(value, `${_prev}${key}`, options, false);
		output.push(...values);
	});
	return output;
}
var _decompose = (val, options) => {
	const entries1 = ddecompose$1(val, "", options);
	const { sep, start } = {
		...DEFAULT_DECOMPOSE_OPTIONS,
		...options
	};
	if (entries1.length == 0) {
		if (Array.isArray(val)) return [];
		return {};
	}
	const regexDel = new RegExp(DELIMITER, "g");
	const regexLeft = new RegExp(LEFT_BRACKET, "g");
	const regexRight = new RegExp(RIGHT_BRACKET, "g");
	const entries2 = entries1.map(([__key, value]) => {
		const _key = __key.replace(regexDel, sep).replace(regexLeft, `[`).replace(regexRight, `]`);
		return [start ? `${sep}${_key}` : _key, value];
	});
	return Object.fromEntries(entries2);
};
var decompose = (val, options) => _decompose(val, options);
decompose.low = decompose;
decompose.strict = decompose;
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/libs/bemedev/globals/utils/_unknown.js
/**
* _unknown variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var _unknown = (value) => value;
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/libs/bemedev/globals/utils/expandFn.js
/**
* expandFn variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var expandFn = (main, extensions) => {
	const out = main;
	if (extensions) Object.assign(out, extensions);
	return out;
};
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/libs/bemedev/globals/utils/castFn.js
/**
* castFn variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var castFn = () => {
	const _out = (extensions) => {
		return expandFn((arg) => arg, {
			...extensions,
			forceCast: (arg) => {
				return _unknown(arg);
			},
			dynamic: (arg) => {
				return arg;
			}
		});
	};
	return _out;
};
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/libs/bemedev/features/common/castings/any.js
/**
* fn const - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var fn = castFn()();
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/decomposeKeys.js
function ddecomposeKeys(val, prev = "", addObjectKeys = true) {
	const _prev = prev ? prev + DELIMITER : "";
	const output = [];
	Object.entries(val).forEach(([key, value]) => {
		if (!isPrimitive(value)) {
			if (addObjectKeys) output.push(`${_prev}${key}`);
			const values = ddecomposeKeys(value, `${_prev}${key}`, addObjectKeys);
			output.push(...values);
		} else output.push(`${_prev}${key}`);
	});
	return output;
}
var _decomposeKeys = (val, sorter = sortMap, addObjectKeys = true) => {
	const output1 = ddecomposeKeys(val, "", addObjectKeys);
	output1.sort(sorter);
	const regex = new RegExp(DELIMITER, "g");
	return output1.map((value) => value.replace(regex, "."));
};
var decomposeKeys = (val, sorter, addObjectKeys) => {
	return fn(_decomposeKeys(val, sorter, addObjectKeys));
};
decomposeKeys.low = _decomposeKeys;
decomposeKeys.strict = _unknown(_decomposeKeys);
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/decomposeSV.js
function ddecompose(val, prev = "") {
	const output = [];
	const _prev = prev ? prev + DELIMITER : "";
	if (prev !== "") output.push(prev);
	if (typeof val === "string") output.push(`${_prev}${val}`);
	else {
		const keys = Object.keys(val);
		output.push(...keys.map((key) => ddecompose(val[key], `${_prev}${key}`)).flat());
	}
	return output;
}
var _decomposeSV = (val, sorter = sortMap) => {
	const output1 = ddecompose(val, "");
	output1.sort(sorter);
	const regex = new RegExp(DELIMITER, "g");
	return output1.map((value) => value.replace(regex, "."));
};
var decomposeSV = (val, sorter) => {
	return fn(_decomposeSV(val, sorter));
};
decomposeSV.low = _decomposeSV;
decomposeSV.strict = _unknown(_decomposeSV);
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/flatByKey.js
var _flat = (val, omitKey, options, path = "") => {
	const _options = {
		...DEFAULT_FLAT_OPTIONS,
		...options
	};
	const { [omitKey]: recursives, ...rest } = val;
	const check = _options.children;
	let out = {};
	out[path === "" ? _options.sep : path] = check ? val : rest;
	if (recursives) {
		for (const key in recursives) if (Object.prototype.hasOwnProperty.call(recursives, key)) {
			const element = recursives[key];
			const inner = _flat(element, omitKey, options, `${path}${_options.sep}${key}`);
			out = {
				...out,
				...inner
			};
		}
	}
	return out;
};
var flatByKey = (val, key, options) => _flat(val, key, options);
flatByKey.low = _flat;
flatByKey.strict = _flat;
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/contexts/assign.js
var _assignByKey = (obj, key, value) => {
	const [first, ...rest] = splitKey(key);
	const out = obj ?? nextDefault(first);
	if (rest.length === 0) {
		if (isArrayIndex(first)) {
			let idx = parseIndex(first);
			if (idx > out.length) idx = out.length;
			out[idx] = value;
		} else out[first] = value;
		return out;
	}
	const nextKey = rest.join(".");
	const next = rest[0];
	const _nextDefault = nextDefault(next);
	if (isArrayIndex(first)) {
		let idx = parseIndex(first);
		if (idx > out.length) idx = out.length;
		out[idx] = _assignByKey(out[idx] ?? _nextDefault, nextKey, value);
	} else out[first] = _assignByKey(out[first] ?? _nextDefault, nextKey, value);
	return out;
};
/**
* Assigns a value to a path in an object.
* @param obj The object to assign the value to
* @param path The key to assign the value to, can be a nested key (e.g. 'a.b.c')
* @param value The value to assign to the key
* @returns The modified object with the value assigned to the specified key
*
* @see {@linkcode Decompose} for more details on object decomposition.
*/
var assignByKey = (obj, path, value) => {
	return _assignByKey(obj, path, value);
};
assignByKey.low = assignByKey;
assignByKey.typed = assignByKey;
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/contexts/constants.js
var DEFAULT_OPTIONS = {
	start: false,
	sep: ".",
	object: "both"
};
//#endregion
//#region ../../node_modules/@bemedev/decompose/lib/contexts/get.js
var _getByKey = (obj, key) => {
	return decompose.low(obj, DEFAULT_OPTIONS)[key];
};
/**
* Retrieves a value from an object by a specified key.
* @param obj The object to retrieve the value from
* @param key The key to retrieve the value for, can be a nested key (e.g. 'a.b.c')
* @returns The value associated with the specified key in the object
*
* @see {@linkcode Decompose} for more details on object decomposition.
*/
var getByKey = (obj, key) => _getByKey(obj, key);
getByKey.low = getByKey;
getByKey.typed = getByKey;
getByKey.defined = getByKey;
getByKey.options = (options) => (obj, key) => {
	return decompose.low(obj, {
		...DEFAULT_OPTIONS,
		...options
	})[key];
};
//#endregion
export { decompose as a, decomposeKeys as i, flatByKey as n, recompose as o, decomposeSV as r, getByKey as t };
