import { t as __commonJSMin } from "../_runtime.mjs";
//#region ../../node_modules/kind-of/index.js
var require_kind_of = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toString = Object.prototype.toString;
	module.exports = function kindOf(val) {
		if (val === void 0) return "undefined";
		if (val === null) return "null";
		var type = typeof val;
		if (type === "boolean") return "boolean";
		if (type === "string") return "string";
		if (type === "number") return "number";
		if (type === "symbol") return "symbol";
		if (type === "function") return isGeneratorFn(val) ? "generatorfunction" : "function";
		if (isArray(val)) return "array";
		if (isBuffer(val)) return "buffer";
		if (isArguments(val)) return "arguments";
		if (isDate(val)) return "date";
		if (isError(val)) return "error";
		if (isRegexp(val)) return "regexp";
		switch (ctorName(val)) {
			case "Symbol": return "symbol";
			case "Promise": return "promise";
			case "WeakMap": return "weakmap";
			case "WeakSet": return "weakset";
			case "Map": return "map";
			case "Set": return "set";
			case "Int8Array": return "int8array";
			case "Uint8Array": return "uint8array";
			case "Uint8ClampedArray": return "uint8clampedarray";
			case "Int16Array": return "int16array";
			case "Uint16Array": return "uint16array";
			case "Int32Array": return "int32array";
			case "Uint32Array": return "uint32array";
			case "Float32Array": return "float32array";
			case "Float64Array": return "float64array";
		}
		if (isGeneratorObj(val)) return "generator";
		type = toString.call(val);
		switch (type) {
			case "[object Object]": return "object";
			case "[object Map Iterator]": return "mapiterator";
			case "[object Set Iterator]": return "setiterator";
			case "[object String Iterator]": return "stringiterator";
			case "[object Array Iterator]": return "arrayiterator";
		}
		return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
	};
	function ctorName(val) {
		return typeof val.constructor === "function" ? val.constructor.name : null;
	}
	function isArray(val) {
		if (Array.isArray) return Array.isArray(val);
		return val instanceof Array;
	}
	function isError(val) {
		return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
	}
	function isDate(val) {
		if (val instanceof Date) return true;
		return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
	}
	function isRegexp(val) {
		if (val instanceof RegExp) return true;
		return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
	}
	function isGeneratorFn(name, val) {
		return ctorName(name) === "GeneratorFunction";
	}
	function isGeneratorObj(val) {
		return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
	}
	function isArguments(val) {
		try {
			if (typeof val.length === "number" && typeof val.callee === "function") return true;
		} catch (err) {
			if (err.message.indexOf("callee") !== -1) return true;
		}
		return false;
	}
	/**
	* If you need to support Safari 5-7 (8-10 yr-old browser),
	* take a look at https://github.com/feross/is-buffer
	*/
	function isBuffer(val) {
		if (val.constructor && typeof val.constructor.isBuffer === "function") return val.constructor.isBuffer(val);
		return false;
	}
}));
//#endregion
//#region ../../node_modules/shallow-clone/index.js
/*!
* shallow-clone <https://github.com/jonschlinkert/shallow-clone>
*
* Copyright (c) 2015-present, Jon Schlinkert.
* Released under the MIT License.
*/
var require_shallow_clone = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var valueOf = Symbol.prototype.valueOf;
	var typeOf = require_kind_of();
	function clone(val, deep) {
		switch (typeOf(val)) {
			case "array": return val.slice();
			case "object": return Object.assign({}, val);
			case "date": return new val.constructor(Number(val));
			case "map": return new Map(val);
			case "set": return new Set(val);
			case "buffer": return cloneBuffer(val);
			case "symbol": return cloneSymbol(val);
			case "arraybuffer": return cloneArrayBuffer(val);
			case "float32array":
			case "float64array":
			case "int16array":
			case "int32array":
			case "int8array":
			case "uint16array":
			case "uint32array":
			case "uint8clampedarray":
			case "uint8array": return cloneTypedArray(val);
			case "regexp": return cloneRegExp(val);
			case "error": return Object.create(val);
			default: return val;
		}
	}
	function cloneRegExp(val) {
		const flags = val.flags !== void 0 ? val.flags : /\w+$/.exec(val) || void 0;
		const re = new val.constructor(val.source, flags);
		re.lastIndex = val.lastIndex;
		return re;
	}
	function cloneArrayBuffer(val) {
		const res = new val.constructor(val.byteLength);
		new Uint8Array(res).set(new Uint8Array(val));
		return res;
	}
	function cloneTypedArray(val, deep) {
		return new val.constructor(val.buffer, val.byteOffset, val.length);
	}
	function cloneBuffer(val) {
		const len = val.length;
		const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
		val.copy(buf);
		return buf;
	}
	function cloneSymbol(val) {
		return valueOf ? Object(valueOf.call(val)) : {};
	}
	/**
	* Expose `clone`
	*/
	module.exports = clone;
}));
//#endregion
//#region ../../node_modules/isobject/index.js
/*!
* isobject <https://github.com/jonschlinkert/isobject>
*
* Copyright (c) 2014-2017, Jon Schlinkert.
* Released under the MIT License.
*/
var require_isobject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function isObject(val) {
		return val != null && typeof val === "object" && Array.isArray(val) === false;
	};
}));
//#endregion
//#region ../../node_modules/is-plain-object/index.js
/*!
* is-plain-object <https://github.com/jonschlinkert/is-plain-object>
*
* Copyright (c) 2014-2017, Jon Schlinkert.
* Released under the MIT License.
*/
var require_is_plain_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isObject = require_isobject();
	function isObjectObject(o) {
		return isObject(o) === true && Object.prototype.toString.call(o) === "[object Object]";
	}
	module.exports = function isPlainObject(o) {
		var ctor, prot;
		if (isObjectObject(o) === false) return false;
		ctor = o.constructor;
		if (typeof ctor !== "function") return false;
		prot = ctor.prototype;
		if (isObjectObject(prot) === false) return false;
		if (prot.hasOwnProperty("isPrototypeOf") === false) return false;
		return true;
	};
}));
//#endregion
//#region ../../node_modules/clone-deep/index.js
var require_clone_deep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependenices
	*/
	var clone = require_shallow_clone();
	var typeOf = require_kind_of();
	var isPlainObject = require_is_plain_object();
	function cloneDeep(val, instanceClone) {
		switch (typeOf(val)) {
			case "object": return cloneObjectDeep(val, instanceClone);
			case "array": return cloneArrayDeep(val, instanceClone);
			default: return clone(val);
		}
	}
	function cloneObjectDeep(val, instanceClone) {
		if (typeof instanceClone === "function") return instanceClone(val);
		if (instanceClone || isPlainObject(val)) {
			const res = new val.constructor();
			for (let key in val) res[key] = cloneDeep(val[key], instanceClone);
			return res;
		}
		return val;
	}
	function cloneArrayDeep(val, instanceClone) {
		const res = new val.constructor(val.length);
		for (let i = 0; i < val.length; i++) res[i] = cloneDeep(val[i], instanceClone);
		return res;
	}
	/**
	* Expose `cloneDeep`
	*/
	module.exports = cloneDeep;
}));
//#endregion
export { require_clone_deep as t };
