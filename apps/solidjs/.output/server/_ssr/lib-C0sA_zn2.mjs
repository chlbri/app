import { r as __toESM } from "../_runtime.mjs";
import { L as createSignal, V as onCleanup } from "../_libs/@solid-primitives/refs+[...].mjs";
import { t as deepmergeCustom } from "../_libs/deepmerge-ts.mjs";
import { _ as string, a as custom, b as union, c as number, d as optional, f as parse, g as strictObject, h as safeParse, i as check, l as object, m as record, n as array, o as lazy, p as pipe, r as boolean, s as literal, t as any, u as omit, v as symbol, y as undefined_ } from "../_libs/valibot.mjs";
import { a as decompose, i as decomposeKeys, n as flatByKey, o as recompose, r as decomposeSV, t as getByKey } from "../_libs/@bemedev/decompose+[...].mjs";
import { n as recursive, t as asyncRecursive } from "../_libs/bemedev__boolean-recursive.mjs";
import { n as type, t as pretype } from "../_libs/bemedev__typings.mjs";
import { t as require_fast_deep_equal } from "../_libs/fast-deep-equal.mjs";
import { t as sleep } from "../_libs/bemedev__sleep.mjs";
import { t as createBetterSet } from "../_libs/bemedev__better-set.mjs";
import { n as createScheduler, t as createScheduler$1 } from "../_libs/bemedev__scheduler.mjs";
import { n as createTimeout, t as createInterval } from "../_libs/@bemedev/interval2+[...].mjs";
import { t as swap } from "../_libs/bemedev__function-swap.mjs";
import { t as require_clone_deep } from "../_libs/clone-deep+[...].mjs";
import { n as anyPromises, r as withTimeout, t as asyncfy } from "../_libs/bemedev__better-promise.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lib-C0sA_zn2.js
var import_fast_deep_equal = /* @__PURE__ */ __toESM(require_fast_deep_equal());
var import_clone_deep = /* @__PURE__ */ __toESM(require_clone_deep());
process.env.CI;
var _merge = deepmergeCustom({
	mergeArrays: false,
	mergeMaps: false,
	mergeRecords: (values, all, options) => {
		return all.defaultMergeFunctions.mergeRecords(values, all, options);
	}
});
var UNEFINED_KEY = "##__FilterUndefined__";
var MergeUndefined = class {
	[UNEFINED_KEY] = UNEFINED_KEY;
};
var MERGE_UNDEFINED = new MergeUndefined();
var transformMergeUndefined = (value) => {
	if (Array.isArray(value)) return value.map(transformMergeUndefined);
	if (typeof value === "object" && value !== null) {
		if (value[UNEFINED_KEY] === UNEFINED_KEY) return void 0;
		return Object.fromEntries(Object.entries(value).map(([key, value]) => [key, transformMergeUndefined(value)]));
	}
	return value;
};
var isMergeUndefined = (value) => {
	return value[UNEFINED_KEY] === UNEFINED_KEY;
};
/**
* A custom implement of `deepmerge-ts` ({@linkcode deepmergeCustom}) for better suitability with this library.
* @param value The value to merge into.
* @param mergers The values to merge with the original value
* @returns The merged value, which is a new object containing the properties of the original value and the mergers.
*
* @see {@linkcode equal} for deep equality check
* @see {@linkcode types} for partial type definition
* @see {@linkcode NoInfer} for type inference utility
*/
var merge = (value, ...mergers) => {
	return transformMergeUndefined(_merge(value, ...mergers));
};
var action = {
	normal: "action",
	capital: "Action"
};
var guard = {
	normal: "guard",
	capital: "Guard"
};
var delay = {
	normal: "delay",
	capital: "Delay"
};
var promise = {
	normal: "promise",
	capital: "Promise"
};
var machine = {
	normal: "machine",
	capital: "Machine"
};
var notDefined = "is undefined";
var notDescribed = "is not described";
var notProvided = "is not provided";
var notDefinedF = (type) => {
	const string = `${type} ${notDefined}`;
	return {
		string,
		error: new Error(string)
	};
};
var notDescribedF = (type) => {
	const string = `${type} ${notDescribed}`;
	return {
		string,
		error: new Error(string)
	};
};
var notProvidedF = (type) => {
	const string = `${type} ${notProvided}`;
	return {
		string,
		error: new Error(string)
	};
};
var produceErrors = (...types) => {
	const out = {};
	types.forEach((value) => {
		Object.assign(out, { [value.normal]: {
			notDefined: notDefinedF(value["capital"]),
			notDescribed: notDescribedF(value["capital"]),
			notProvided: notProvidedF(value["capital"])
		} });
	});
	return out;
};
produceErrors(action, guard, delay, promise, machine);
/**
* The default maximum number of milliseconds to wait for a promise to resolve.
* One hour.
*/
var DEFAULT_MAX_TIME_PROMISE = 6e5;
var GUARD_TYPE = {
	guard: "guard",
	and: "and",
	or: "or"
};
/**
* The first event in the machine lifecycle.
* This event is used to initialize the machine.
*/
var INIT_EVENT = "machine$$init";
/**
* The event that is triggered when the machine peforms an always transition.
*/
var ALWAYS_EVENT = "machine$$always";
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
/**
* mergeIs variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var mergeIs = expandFn((...checks) => {
	return (value) => {
		return checks.some((check) => value === check);
	};
}, { type: (...checks) => {
	return (value) => {
		return checks.some((check) => typeof value === check);
	};
} });
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
castFn.withValues = (...values) => {
	const out = (extensions) => castFn()({
		...extensions,
		is: mergeIs(...values)
	});
	return out;
};
/**
* isPlainObject variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var isPlainObject = (value) => {
	return Object.prototype.toString.call(value) == "[object Object]" && value.constructor && value.constructor.name == "Object";
};
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
var fn$9 = castFn()({ is: isPlainObject });
var _toArray = (value) => {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
};
/**
* toArray const - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var toArray = expandFn(_toArray, { typed: _toArray });
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
var fn$8 = (...args) => {
	return _unknown(args);
};
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
var fn$7 = castFn()();
/**
* identify variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var identify = (arg) => {
	if (!arg) return [];
	return Object.entries(arg).map(([__id, value]) => {
		return {
			...value,
			__id
		};
	});
};
var __partialCall = (f, ...headArgs) => {
	return (...tailArgs) => f(...headArgs, ...tailArgs);
};
var _partialCall = __partialCall;
/**
* @param f The function to test
* @param headArgs First arguments for reducing
* @returns A new function without the ***headArgs*** provided
*
* This function allows you to partially apply a function by providing some of its initial arguments (the "head" arguments). The returned function will then expect the remaining arguments (the "tail" arguments) when called. This is useful for creating new functions with some preset parameters, making it easier to reuse code and create more specific functions from general ones.
*/
/**
* partialCall variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var partialCall = expandFn(_partialCall, {
	/**
	* Use with caution, as it can lead to type inference issues. It's recommended to use the `typed` version instead for better type safety.
	*
	* @param f The function to test
	* @param headArgs First arguments for reducing
	* @returns A new function without the ***headArgs*** provided
	*/
	low: __partialCall,
	/**
	*
	* @param f The function to test
	* @param headArgs First arguments for reducing
	* @returns A new function without the ***headArgs*** provided
	*
	* Use this for function that have a large number of parameters use param array as the last parameter, this will allow you to partially apply the function without having to specify all the parameters in the type signature. However, it can lead to type inference issues and is less type-safe than the `typed` version. Use it when you need to partially apply a function with a variable number of parameters.
	*
	* Example usage:
	* ```ts
	* const concatenate = (separator: string, ...strings: string[]) => strings.join(separator);
	* const commaSeparated = partialCall.paramArray(concatenate, ',');
	* console.log(commaSeparated('Hello', 'World'));
	* // Output: "Hello,World"
	*
	* ```
	*
	*/
	paramArray: __partialCall,
	/**
	*
	* @param f The function to test
	* @param headArgs First arguments for reducing
	* @returns A new function without the ***headArgs*** provided
	*
	* @see {linkcode partialCall.paramArray}
	* It's alias for `paramArray` version.
	*/
	array: __partialCall,
	/**
	*
	* @param f The function to test
	* @param headArgs First arguments for reducing
	* @returns A new function without the ***headArgs*** provided
	*
	* This version is more flexible but less type-safe, as it doesn't enforce the types of the head and tail arguments. Use it when you need to partially apply a function without strict type constraints.
	*
	* Example usage:
	* ```ts
	* const add = (a: number, b: number) => a + b;
	* const add5 = partialCall.typed(add, 5);
	* console.log(add5(10)); // Output: 15
	*
	* ```
	*/
	typed: _partialCall,
	/**
	*
	* @param f The function to test
	* @param headArgs First arguments for reducing
	* @returns A new function without the ***headArgs*** provided
	*
	* Use with caution, as it can lead to type inference issues. It's recommended to use the `typed` version instead for better type safety.
	*
	* This version is more flexible but less type-safe, as it doesn't enforce the types of the head and tail arguments. Use it when you need to partially apply a function without strict type constraints.
	*
	* Example usage:
	* ```ts
	* const add = (a: number, b: number) => a + b;
	* const add5 = partialCall.build(add, 5);
	* console.log(add5(10)); // Output: 15
	*
	* ```
	*
	*/
	build: (f, ...headArgs) => {
		const head = headArgs ?? [];
		return (...tailArgs) => f(...head, ...tailArgs);
	}
});
var __partialCallO = (f, headArgs) => {
	return (remainArgs) => {
		return f({
			...remainArgs,
			...headArgs
		});
	};
};
var _partialCallO = __partialCallO;
expandFn(_partialCallO, {
	/**
	* Use with caution, as it can lead to type inference issues. It's recommended to use the `typed` version instead for better type safety.
	*/
	low: __partialCallO,
	/**
	*
	* This version is more flexible but less type-safe, as it doesn't enforce the types of the head and tail arguments. Use it when you need to partially apply a function without strict type constraints.
	*
	* Example usage:
	* ```ts
	* const greet = ({ name, greeting }: { name: string; greeting: string }) => `${greeting}, ${name}!`;
	* const greetHello = partialCallO.typed(greet, { greeting: 'Hello' });
	* console.log(greetHello({ name: 'Alice' }));
	* // Output: "Hello, Alice!"
	*
	* ```
	*/
	typed: _partialCallO
});
var _switchValue = ({ condition, truthy, falsy }) => {
	return condition ? truthy : falsy;
};
/**
* switchValue function - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
function switchValue(condition, truthy, falsy) {
	return _switchValue({
		condition: typeof condition === "boolean",
		truthy: _switchValue({
			condition,
			truthy,
			falsy
		}),
		falsy: _switchValue(condition)
	});
}
switchValue.array = (...params) => switchValue(...params);
switchValue.object = (params) => switchValue(params);
/**
* switchV variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var switchV = switchValue;
function SoraSchema(schema) {
	const baseSchema = lazy(() => union([schema, array(lazy(() => baseSchema))]));
	return baseSchema;
}
var PrimitiveSchema = union([
	string(),
	number(),
	boolean(),
	undefined_()
]);
var KeysSchema = union([
	string(),
	number(),
	symbol()
]);
var MapSchema = (schema) => custom((value) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	return Object.entries(value).every(([key, value]) => safeParse(KeysSchema, key).success && safeParse(schema, value).success);
});
var PrimitiveObjectSchema = SoraSchema(union([PrimitiveSchema, MapSchema(lazy(() => PrimitiveObjectSchema))]));
var DescriberSchema = strictObject({
	name: string(),
	description: string()
});
var NotArray_Schema = check((a) => !Array.isArray(a), "Not an array");
var recordV = (key, value, message) => {
	return pipe(any(), NotArray_Schema, record(key, value, message));
};
union([object({
	type: string(),
	payload: PrimitiveObjectSchema
}), union([
	literal("machine$$init"),
	literal("machine$$always"),
	literal("machine$$after"),
	literal("machine$$exceeded")
])]);
recordV(string(), PrimitiveObjectSchema);
/**
* Converts an event to its type.
* If the event is a string, it returns the string.
* If the event is an object, it returns the type property of the object.
* @param event of type {@linkcode EventObject} or string
* @returns string representing the type of the event
*/
var eventToType = (event) => {
	if (typeof event === "string") return event;
	return event.type;
};
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
var fn$6 = (value) => {
	return value !== void 0 && value !== null;
};
/**
* typeFn variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var typeFn = () => {
	const _out = (extensions) => {
		return expandFn((_) => _unknown(), {
			...extensions,
			forceCast: (_) => _unknown(),
			dynamic: (_) => _unknown(),
			is: (_) => _unknown(),
			type: _unknown()
		});
	};
	return _out;
};
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
var fn$5 = typeFn()();
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
var fn$4 = (_, ...__) => _unknown();
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
var fn$3 = (_, __) => _unknown();
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
var fn$2 = expandFn((_) => _unknown(), { union: (_) => _unknown() });
/**
* PRIMITIVES variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var PRIMITIVES = [
	"string",
	"number",
	"boolean",
	"bigint",
	"symbol",
	"undefined",
	"null"
];
/**
* isPrimitive variable - Auto-generated expression
*
* ⚠️ WARNING: This expression is auto-generated and should not be modified.
* Any manual changes will be overwritten during the next generation.
*
* @generated
* @readonly
* @author chlbri (bri_lvi@icloud.com)
*/
var isPrimitive = (value) => {
	const isType = mergeIs.type(...PRIMITIVES);
	const isValue = mergeIs(null, void 0);
	return isType(value) || isValue(value);
};
typeFn()();
typeFn()();
/**
* Returns a list of all possible events from a flat record of NodeConfig.
* @param flat of type {@linkcode RecordS}<{@linkcode NodeConfig2}>, a flat record of NodeConfig.
* @returns An array of event names.
*
* @see {@linkcode castings} for the utility function to check if a value is defined.
*/
var possibleEvents = (flat) => {
	const events = [];
	Object.values(flat).forEach((value) => {
		const on = value.on;
		if (fn$6(on)) events.push(...Object.keys(on));
	});
	return events;
};
/**
* Transforms an non-formated event into a standardized event object.
* It can be a string or an object.
*
* If the event is a string, it returns an object with type set to the string and
* an empty payload. If the event is an object, it returns the event as is.
*
* @see {@linkcode EventObject}
*/
var transformEventArg = (event) => {
	if (typeof event === "string") return {
		type: event,
		payload: {}
	};
	return {
		...event,
		payload: event.payload
	};
};
/**
* Regular expression used to escape special characters in strings.
*/
var ESCAPE_REGEXP = /[.*+?^${}()|[\]\\]/g;
var MAX_TIME = DEFAULT_MAX_TIME_PROMISE;
/**
* A callback-based timeout utility that uses setTimeout.
* If the execution time exceeds the maxTime (default MAX_TIME), the onError callback is triggered.
* Otherwise, the success callback is executed when the specified ms delay has elapsed.
*/
function betterTimeout({ callback, onError, ms, maxTime = MAX_TIME }) {
	const isExceeded = ms > maxTime;
	setTimeout(() => {
		try {
			if (isExceeded) throw new Error("MAX_EXCEEDED");
			callback();
		} catch (error) {
			onError?.(error);
		}
	}, isExceeded ? maxTime : ms);
}
/**
* Checks if all specified keys are present in the given object.
* @param arg Object to check keys against
* @param keys Keys to check for presence in the object
* @returns `true` if all keys are present, `false` otherwise
*
* @see {@linkcode CheckKeys_F} for the type definition
*/
var checkKeys = (arg, ...keys) => {
	const argKeys = Object.keys(arg);
	for (const key of argKeys) if (!keys.includes(key)) return false;
	return true;
};
checkKeys.strict = (arg, ...keys) => {
	if (!checkKeys(arg, ...keys)) return false;
	const argKeys = Object.keys(arg);
	for (const key of keys) if (!argKeys.includes(key)) return false;
	return true;
};
/**
* Describer keys used to define the name and description of an object.
*/
var DESCRIBER_KEYS = ["name", "description"];
var isFunction = (value) => {
	return typeof value === "function";
};
var isString = (value) => {
	return typeof value === "string";
};
var isDescriber = (arg) => {
	return checkKeys.strict(arg, ...DESCRIBER_KEYS);
};
var fromDescriber = (value) => {
	return isDescriber(value) ? value.name : value;
};
/**
* Reduces a function map to a single function that processes events.
* @param fn the function map to reduce.
* @param events the list of expected events to match against.
* @returns a function that takes a context and an event, returning the result of the function map.
*
* @see {@linkcode ReduceFnMap_F} for the type definition.
* @see {@linkcode isFunction} for checking if a value is a function.
* @see {@linkcode nothing} for the default else function.
*/
var reduceFnMap = (fn$1, ...events) => {
	if (isFunction(fn$1)) return fn$1;
	return ({ event, ...rest }) => {
		const check5 = typeof event === "string";
		const _else = fn$1.else ?? nothing;
		if (check5) return fn$7(_else({
			...rest,
			event
		}));
		const { payload, type } = event;
		for (const key of events) {
			const check2 = type === key;
			const func = fn$7(fn$1)[key];
			if (check2 && !!func) return func({
				...rest,
				payload
			});
		}
		return fn$7(_else({
			...rest,
			event
		}));
	};
};
var checkAction = (entry) => {
	return entry !== null && (isString(entry) || isDescriber(entry));
};
var checkActions = (action) => {
	if (Array.isArray(action)) return action.every(checkAction);
	else return checkAction(action);
};
checkActions.orUndefined = (action) => {
	if (action === void 0) return true;
	return checkActions(action);
};
var _toAction = (action, actions, ...events) => {
	const name = fromDescriber(action);
	const fn = actions?.[name];
	return fn ? reduceFnMap(fn, ...events) : void 0;
};
/**
* Converts an ActionConfig to a function that can be executed with the provided events list.
* @param action of type {@linkcode WithDescriber}, action configuration to convert.
* @param actions of type {@linkcode AsyncActionMap}, The actions map containing functions to execute.
* @param events of type {@linkcode string[]}, list of events of the machine.
*
* @see {@linkcode PrimitiveObject}
* @see {@linkcode reduceFnMap}
*/
var toAction = _toAction;
var ActionConfig_Schema = union([string(), DescriberSchema]);
var GUARD_KEYS = ["and", "or"];
var checkGuards = (value) => {
	if (value === void 0) return false;
	if (checkAction(value)) return true;
	else if (Array.isArray(value)) return value.length > 0 && value.every(checkGuards);
	else {
		const _value = value;
		if (!(typeof _value === "object")) return false;
		if (!(Object.keys(_value).length === 1)) return false;
		if (!checkKeys(_value, ...GUARD_KEYS)) return false;
		const and = _value.and;
		const or = _value.or;
		if (!(Array.isArray(and) || Array.isArray(or))) return false;
		return checkGuards(and) || checkGuards(or);
	}
};
checkGuards.orUndefined = (value) => {
	if (value === void 0) return true;
	return checkGuards(value);
};
/**
* Checks if the value at the specified path in pContext, context, or events matches any of the provided values.
* @param path of type {@linkcode DefinedValue}, the path to retrieve.
* @enum
* The path can be one of the following:
* - 'pContext': checks if the value in pContext is one of the provided values
* - 'context': checks if the value in context is one of the provided values
* - 'events': checks if the value in events is one of the provided values
* - 'context.[key]': checks if the value in context at the specified key is one of the provided values
* - 'pContext.[key]': checks if the value in pContext at the specified key is one of the provided values
* - 'events.[key]': checks if the value in events at the specified key is one of the provided values
* @param values the values to check against.
* @returns a {@linkcode FnR} function that takes pContext, context, and eventsMap and returns true if the value at the specified path matches any of the provided values, false otherwise.
*
* @example
* ```ts
* const guard = isValue('context.userId', '123', '456');
* const result = guard({ context: { userId: '123' } }, {}, {});
* console.log(result); // true
* ```
*
* @see {@linkcode EventObject} for the type of the events map.
* @see {@linkcode PromiseeMap} for the type of the promisees map.
* @see {@linkcode PrimitiveObject} for the type of the context.
* @see {@linkcode getByKey} for retrieving values by key.
*  @see {@linkcode t} for type checking and validation.
*
* @see {@linkcode isNotValue} for the opposite check.
*/
var isValue = (path, ...values) => {
	const start = path.startsWith.bind(path);
	return ({ pContext, context, event }) => {
		if (path === "pContext") return values.some((value) => pContext === value);
		if (path === "context") return values.some((value) => context === value);
		if (path === "events") return values.some((value) => event === value);
		if (start("context.")) {
			const key = path.replace("context.", "");
			return values.some((value) => getByKey(context, key) === value);
		}
		if (start("pContext.")) {
			const key = path.replace("pContext.", "");
			return values.some((value) => getByKey(pContext, key) === value);
		}
		const toValidate = getByKey(event, path.replace("events.", ""));
		return values.some((value) => toValidate === value);
	};
};
/**
* Checks if the value at the specified path in pContext, context, or events doesn't matches any of the provided values.
* @param path of type {@linkcode DefinedValue}, the path to retrieve.
* @enum
* The path can be one of the following:
* - 'pContext': checks if the value in pContext is one of the provided values
* - 'context': checks if the value in context is one of the provided values
* - 'events': checks if the value in events is one of the provided values
* - 'context.[key]': checks if the value in context at the specified key is one of the provided values
* - 'pContext.[key]': checks if the value in pContext at the specified key is one of the provided values
* - 'events.[key]': checks if the value in events at the specified key is one of the provided values
* @param values the values to check against.
* @returns a {@linkcode FnR} function that takes pContext, context, and eventsMap and returns true if the value at the specified path matches doesn't any of the provided values, false otherwise.
*
* @example
* ```ts
* const guard = isNotValue('context.userId', '123', '456');
* const result = guard({ context: { userId: '123' } }, {}, {});
* console.log(result); // false
* ```
*
* @see {@linkcode EventObject} for the type of the events map.
* @see {@linkcode PromiseeMap} for the type of the promisees map.
* @see {@linkcode PrimitiveObject} for the type of the context.
* @see {@linkcode getByKey} for retrieving values by key.
* @see {@linkcode t} for type checking and validation.
*
* @see {@linkcode isValue} for the opposite check.
*/
var isNotValue = (path, ...values) => {
	const func = isValue(path, ...values);
	return (state) => {
		return !func(state);
	};
};
/**
* Checks if the given path is defined (not undefined or null).
* @param path : A {@linkcode DefinedValue}, the path to retrieve.
* @returns A {@linkcode AsyncPredicateS2} function that returns true if the path is defined, false otherwise.
*
* @see {@linkcode isNotValue} for more details.
* @see {@linkcode EventObject}
* @see {@linkcode PromiseeMap}
* @see {@linkcode PrimitiveObject}
*
*/
var isDefinedS = (path) => {
	return isNotValue(path, void 0, null);
};
/**
* Checks if the given path is undefined or null.
* @param path : A {@linkcode DefinedValue} , the path to retrieve.
* @returns A {@linkcode AsyncPredicateS2} function that returns true if the path is undefined or null, false otherwise.
*
* @see {@linkcode isValue} for more details.
* @see {@linkcode EventObject}
* @see {@linkcode PromiseeMap}
* @see {@linkcode PrimitiveObject}
*/
var isNotDefinedS = (path) => {
	return isValue(path, void 0, null);
};
var _toPredicateFn = (guard, _guards, ...events) => {
	const errors = [];
	if (isDescriber(guard)) {
		const fn = _guards?.[guard.name];
		if (typeof fn === "boolean") return {
			func: () => fn,
			errors
		};
		const func = fn ? reduceFnMap(fn, ...events) : void 0;
		if (!func) errors.push(`Predicate (${guard.name}) is not defined`);
		return {
			func,
			errors
		};
	}
	if (isString(guard)) {
		const fn = _guards?.[guard];
		if (typeof fn === "boolean") return {
			func: () => fn,
			errors
		};
		const func = fn ? reduceFnMap(fn, ...events) : void 0;
		if (!func) errors.push(`Predicate (${guard}) is not defined`);
		return {
			func,
			errors
		};
	}
	const makeArray = (guards) => {
		return guards.map((guard) => _toPredicate(guard, _guards, ...events)).filter(({ errors: errors1 }) => {
			if (errors1.length > 0) {
				errors.push(...errors1);
				return false;
			}
			return true;
		}).map(({ func }) => func).filter(fn$6);
	};
	if (GUARD_TYPE.and in guard) {
		const and = makeArray(guard.and);
		if (and.length < 1) return { errors };
		return {
			func: { and },
			errors
		};
	}
	const or = makeArray(guard.or);
	if (or.length < 1) return { errors };
	return {
		func: { or },
		errors
	};
};
var _toPredicateAsync = (guard, _guards, ...events) => {
	const errors = [];
	if (isDescriber(guard)) {
		const fn = _guards?.[guard.name];
		if (typeof fn === "boolean") return {
			func: () => fn,
			errors
		};
		const func = fn ? reduceFnMap(fn, ...events) : void 0;
		if (!func) errors.push(`Predicate (${guard.name}) is not defined`);
		return {
			func,
			errors
		};
	}
	if (isString(guard)) {
		const fn = _guards?.[guard];
		if (typeof fn === "boolean") return {
			func: () => fn,
			errors
		};
		const func = fn ? reduceFnMap(fn, ...events) : void 0;
		if (!func) errors.push(`Predicate (${guard}) is not defined`);
		return {
			func,
			errors
		};
	}
	const makeArray = (guards) => {
		return guards.map((guard) => _toPredicate.async(guard, _guards, ...events)).filter(({ errors: errors1 }) => {
			if (errors1.length > 0) {
				errors.push(...errors1);
				return false;
			}
			return true;
		}).map(({ func }) => func).filter(fn$6);
	};
	if (GUARD_TYPE.and in guard) {
		const and = makeArray(guard.and);
		if (and.length < 1) return { errors };
		return {
			func: { and },
			errors
		};
	}
	const or = makeArray(guard.or);
	if (or.length < 1) return { errors };
	return {
		func: { or },
		errors
	};
};
var _toPredicate = expandFn(_toPredicateFn, { async: _toPredicateAsync });
/**
*
* @param guard of type {@linkcode GuardConfig}, the guard configuration to convert to a predicate.
* @param guards of type {@linkcode PredicateMap}, the map of guards containing functions to execute.
* @param events of type {@linkcode string[]}, list of events of the machine.
* @returns an object containing the predicate function and any errors encountered during the conversion.
*
* @see {@linkcode PrimitiveObject}
* @see {@linkcode AsyncPredicateS3}
* @see {@linkcode GuardDefUnion}
* @see {@linkcode reduceFnMap}
* @see {@linkcode isDescriber}
* @see {@linkcode isString}
* @see {@linkcode castings}
* @see {@linkcode GUARD_TYPE}
* @see {@linkcode recursive}
*/
var toPredicate = expandFn((guard, guards, ...events) => {
	const { func, errors } = _toPredicate(guard, guards, ...events);
	if (!func) return { errors };
	return {
		predicate: recursive(func),
		errors
	};
}, { async: (guard, guards, ...events) => {
	const { func, errors } = _toPredicate.async(guard, guards, ...events);
	if (!func) return { errors };
	const predicate = asyncRecursive(func);
	const safePredicate = async (...args) => {
		try {
			return await predicate(...args);
		} catch {
			return false;
		}
	};
	return {
		predicate: safePredicate,
		errors
	};
} });
var GuardConfig_Schema = union([
	ActionConfig_Schema,
	lazy(() => GuardAnd_Schema),
	lazy(() => GuardOr_Schema)
]);
var GuardAnd_Schema = object({ and: array(GuardConfig_Schema) });
var GuardOr_Schema = object({ or: array(GuardConfig_Schema) });
/**
* Checks if a given argument is a string and if it is empty (i.e., contains only whitespace).
* @param arg The value to check.
* @returns `true` if the argument is a string and is empty, otherwise `false`.
*
* @see {@linkcode isString} for checking if the argument is a string
*/
var isStringEmpty = (arg) => {
	return isString(arg) && arg.trim() === "";
};
var isStringOrUndefined = (value) => {
	if (value === void 0) return true;
	return typeof value === "string";
};
var checkValues = (value, ...values) => {
	if (values.length === 0) return true;
	return values.includes(value);
};
checkValues.orUndefined = (value, ...values) => {
	if (value === void 0) return true;
	return checkValues(value, ...values);
};
var TRANSITIONS_KEYS = [
	"target",
	"actions",
	"guards",
	"description"
];
var isTransitionConfigMap = (value, ...keys) => {
	if (!value) return false;
	if (typeof value !== "object") return false;
	const _value = value;
	if (Object.keys(_value).length === 0) return false;
	if (!checkKeys(_value, ...TRANSITIONS_KEYS)) return false;
	const description = _value.description;
	const target = _value.target;
	const actions = _value.actions;
	const guards = _value.guards;
	if (target === void 0 && actions === void 0) return false;
	if (!isStringOrUndefined(description)) return false;
	if (!isStringOrUndefined(target)) return false;
	if (!checkValues.orUndefined(target, ...keys)) return false;
	if (!checkActions.orUndefined(actions)) return false;
	return checkGuards.orUndefined(guards);
};
var isTransitionConfigMapTarget = (value, ...keys) => {
	return isTransitionConfigMap(value, ...keys) && value.target !== void 0;
};
var isTransitionConfigMapActions = (value, ...keys) => {
	return isTransitionConfigMap(value, ...keys) && checkActions(value.actions);
};
var isTransitionConfig = (value, ...keys) => {
	if (typeof value === "string") return checkValues(value, ...keys);
	return isTransitionConfigMap(value, ...keys);
};
var isTransitionConfigTarget = (value, ...keys) => {
	if (typeof value === "string") return checkValues(value, ...keys);
	return isTransitionConfigMapTarget(value, ...keys);
};
var isTransitionArray = (value, ...keys) => {
	if (!Array.isArray(value)) return false;
	const _value = [...value];
	const pop = _value.pop();
	if (!pop) return false;
	if (!isTransitionConfig(pop, ...keys)) return false;
	return _value.every((v) => {
		if (!isTransitionConfigMap(v, ...keys)) return false;
		const guards = v.guards;
		return checkGuards(guards);
	});
};
var isSingleOrArrayT = (value, ...keys) => {
	return isTransitionArray(value, ...keys) || isTransitionConfig(value, ...keys);
};
isSingleOrArrayT.orUndefined = (value, ...keys) => {
	if (value === void 0) return true;
	return isSingleOrArrayT(value, ...keys);
};
var isAfter = (value, ...keys) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	return Object.values(value).every((v) => isSingleOrArrayT(v, ...keys));
};
isAfter.orUndefined = (value, ...keys) => {
	if (value === void 0) return true;
	return isAfter(value, ...keys);
};
var isOn = isAfter;
/**
* Converts a transition configuration to a structured transition object with all functions.
*
* @param config - The transition configuration to convert.
* @param options - Optional machine options that may include actions and guards configurations.
* @param events - The events list used for action and guard resolution.
* @returns A structured transition object with target, actions, guards, and optional description.
*
* @see {@linkcode ToTransition_F} for more details
* @see {@linkcode toAction} for converting actions
* @see {@linkcode toPredicate} for converting guards
* @see {@linkcode toArray.typed} for ensuring typed arrays
* @see {@linkcode toArray} for ensuring typed arrays
*/
var toTransition = (config, options, ...events) => {
	if (typeof config === "string") return { target: config };
	const { description, target } = config;
	const out = {
		target,
		actions: toArray.typed(config.actions).map((action) => toAction(action, options?.actions, ...events)),
		guards: toArray(config.guards).map((guard) => toPredicate(guard, options?.guards, ...events))
	};
	if (description) out.description = description;
	return out;
};
var isAlways = (value, ...keys) => {
	if (Array.isArray(value)) {
		const _value = [...value];
		const pop = _value.pop();
		if (!pop) return false;
		if (!isTransitionConfigTarget(pop, ...keys)) return false;
		return _value.every((v) => {
			if (!isTransitionConfigMapTarget(v, ...keys)) return false;
			return checkGuards(v.guards);
		});
	}
	return isTransitionConfigTarget(value, ...keys);
};
isAlways.orUndefined = (value, ...keys) => {
	if (value === void 0) return true;
	return isAlways(value, ...keys);
};
var isFinallyConfig1 = (value) => {
	if (checkAction(value)) return true;
	return isTransitionConfigMapActions(value) && value.target === void 0;
};
var isFinallyConfig = (value) => {
	if (Array.isArray(value)) {
		const _value = [...value];
		const pop = _value.pop();
		if (!pop) return false;
		if (!isFinallyConfig1(pop)) return false;
		return _value.every((v) => {
			if (!isTransitionConfigMapActions(v)) return false;
			return checkGuards(v.guards);
		});
	}
	return isFinallyConfig1(value);
};
isFinallyConfig.orUndefined = (value) => {
	if (value === void 0) return true;
	return isFinallyConfig(value);
};
var isEmitterConfig = (value, ...keys) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	const _value = value;
	const description = _value.description;
	const next = _value.next;
	const error = _value.error;
	const complete = _value.complete;
	if (!isStringOrUndefined(description)) return false;
	if (!isSingleOrArrayT(next, ...keys)) return false;
	if (!isSingleOrArrayT.orUndefined(error, ...keys)) return false;
	return isFinallyConfig.orUndefined(complete);
};
var isActor = (value, ...keys) => {
	return isChildConfig(value, ...keys) || isEmitterConfig(value, ...keys);
};
var isActors = (value, ...keys) => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	return Object.values(value).every((v) => isActor(v, ...keys));
};
isActors.orUndefined = (value, ...keys) => {
	if (value === void 0) return true;
	return isActors(value, ...keys);
};
var isTransitionsConfig = (value, ...keys) => {
	const _value = value;
	const on = _value.on;
	const always = _value.always;
	const actors = _value.actors;
	const after = _value.after;
	if (!isOn.orUndefined(on, ...keys)) return false;
	if (!isAlways.orUndefined(always, ...keys)) return false;
	if (!isActors.orUndefined(actors, ...keys)) return false;
	return isAfter.orUndefined(after, ...keys);
};
var SoaLSchema = (schema) => {
	return union([pipe(array(schema), check((a) => a.length > 0)), schema]);
};
var TargetSchema = (paths) => {
	return paths.length === 0 ? string() : union(paths.map((p) => literal(p)));
};
var TransitionConfigMapA_Schema = (...paths) => {
	return strictObject({
		target: optional(TargetSchema(paths)),
		actions: SoaLSchema(ActionConfig_Schema),
		guards: optional(SoaLSchema(GuardConfig_Schema)),
		description: optional(string())
	});
};
var TransitionConfigMapF_Schema = (...paths) => {
	return strictObject({
		target: TargetSchema(paths),
		actions: optional(SoaLSchema(ActionConfig_Schema)),
		guards: optional(SoaLSchema(GuardConfig_Schema)),
		description: optional(string())
	});
};
var TransitionConfigMapG_Schema = (...paths) => {
	return union([strictObject({
		...omit(TransitionConfigMapA_Schema(...paths), ["guards"]).entries,
		guards: SoaLSchema(GuardConfig_Schema)
	}), strictObject({
		...omit(TransitionConfigMapF_Schema(...paths), ["guards"]).entries,
		guards: SoaLSchema(GuardConfig_Schema)
	})]);
};
var TransitionConfigMapFG_Schema = (...paths) => {
	return strictObject({
		...omit(TransitionConfigMapF_Schema(...paths), ["guards"]).entries,
		guards: SoaLSchema(GuardConfig_Schema)
	});
};
var TransitionConfigF_Schema = (...paths) => {
	return union([TargetSchema(paths), TransitionConfigMapF_Schema(...paths)]);
};
var TransitionConfig_Schema = (...paths) => {
	return union([
		TargetSchema(paths),
		TransitionConfigMapA_Schema(...paths),
		TransitionConfigMapF_Schema(...paths)
	]);
};
var ArrayTransitions_Schema = (...paths) => {
	return pipe(array(TransitionConfig_Schema(...paths)), check((a) => a.length > 0), check((a) => {
		const [_, ...rest] = [...a].reverse();
		const schema = TransitionConfigMapG_Schema(...paths);
		const fn = (value) => safeParse(schema, value).success;
		return rest.every(fn);
	}));
};
var ArrayTransitionsF_Schema = (...paths) => {
	return pipe(array(TransitionConfigF_Schema(...paths)), check((a) => a.length > 0), check((a) => {
		const [_, ...rest] = [...a].reverse();
		const schema = TransitionConfigMapFG_Schema(...paths);
		const fn = (value) => safeParse(schema, value).success;
		return rest.every(fn);
	}));
};
var SingleOrArrayT_Schema = (...paths) => {
	return union([ArrayTransitions_Schema(...paths), TransitionConfig_Schema(...paths)]);
};
var AlwaysConfig_Schema = (...paths) => {
	return union([TransitionConfigF_Schema(...paths), ArrayTransitionsF_Schema(...paths)]);
};
var DelayedTransitions_Config = (...paths) => {
	return pipe(any(), NotArray_Schema, recordV(string(), SingleOrArrayT_Schema(...paths)));
};
var CommonActorSchema = object({ description: optional(string()) });
var ContextsSchema = recordV(string(), string());
var ChildConfig_Schema = (...paths) => union([strictObject({
	...CommonActorSchema.entries,
	contexts: optional(ContextsSchema),
	on: DelayedTransitions_Config(...paths)
}), strictObject({
	...CommonActorSchema.entries,
	contexts: ContextsSchema,
	on: optional(DelayedTransitions_Config(...paths))
})]);
var _F_Schema = strictObject({
	actions: SoaLSchema(ActionConfig_Schema),
	guards: optional(SoaLSchema(GuardConfig_Schema)),
	description: optional(string())
});
var _FG_Schema = strictObject({
	actions: SoaLSchema(ActionConfig_Schema),
	guards: SoaLSchema(GuardConfig_Schema),
	description: optional(string())
});
var _FinallyConfigSchema = union([_F_Schema, ActionConfig_Schema]);
var FinallyConfigSchema = union([_FinallyConfigSchema, pipe(array(_FinallyConfigSchema), check((val) => val.length > 0), check((val) => {
	const [_, ...rest] = [...val].reverse();
	const fn = (value) => {
		return safeParse(_FG_Schema, value).success;
	};
	return rest.every(fn);
}))]);
var EmitterConfig_Schema = (...paths) => {
	return strictObject({
		...CommonActorSchema.entries,
		next: SingleOrArrayT_Schema(...paths),
		error: optional(SingleOrArrayT_Schema(...paths)),
		complete: optional(FinallyConfigSchema)
	});
};
var ActorConfig_Schema = (...paths) => {
	return union([ChildConfig_Schema(...paths), EmitterConfig_Schema(...paths)]);
};
var Transitions_Schema = (...paths) => {
	const on = optional(DelayedTransitions_Config(...paths));
	return object({
		on,
		always: optional(AlwaysConfig_Schema(...paths)),
		after: on,
		actors: optional(recordV(string(), ActorConfig_Schema(...paths)))
	});
};
var CHILD_KEYS = [
	"on",
	"contexts",
	"description"
];
var isChildConfig = (value, ...keys) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	const _value = value;
	const valueKeys = Object.keys(_value);
	if (!checkKeys(_value, ...CHILD_KEYS)) return false;
	if (!(valueKeys.length > 0)) return false;
	const on = _value.on;
	const contexts = _value.contexts;
	const description = _value.description;
	if (!isStringOrUndefined(description)) return false;
	if (on === void 0 && contexts === void 0) return false;
	if (!isOn.orUndefined(on, ...keys)) return false;
	if (contexts === void 0) return true;
	if (typeof contexts !== "object" || contexts === null || Array.isArray(contexts)) return false;
	return Object.values(contexts).every(isString);
};
var constructEvents = (node) => {
	const out = [];
	const on = node.on;
	if (on) {
		const keys = Object.keys(on);
		out.push(...keys);
	}
	const actors = node.actors;
	if (actors) Object.entries(actors).forEach(([key, actor]) => {
		if (isChildConfig(actor)) {
			const on = actor.on;
			if (on) Object.keys(on).forEach((k) => {
				out.push(`${key}::on::${k}`);
			});
		} else {
			out.push(`${key}::next`);
			out.push(`${key}::error`);
		}
	});
	const states = node.states;
	if (states) Object.values(states).forEach((state) => {
		out.push(...constructEvents(state));
	});
	return out;
};
/**
* Reduces a value to its name if it is a describer, otherwise returns the value as is.
* @param value of type {@linkcode Describer } or string, value to reduce
* @returns prop "name" if the value is a describer, otherwise the value itself.
*
* @see {@linkcode isDescriber} for more details.
*/
var reduceDescriber = (value) => {
	if (isDescriber(value)) return value.name;
	return value;
};
/**
* Deletes the first occurrence of a specified delimiter from the start of a string.
* @param arg  The string from which to delete the first occurrence of the specified delimiter.
* @param toDelete The delimiter to remove from the start of the string. Defaults to {@linkcode DEFAULT_DELIMITER}.
* @returns The modified string with the first occurrence of the specified value removed, or the original string if the delimiter is not found at the start.
*
* @see {@linkcode DeleteFirst_F} for the type definition
* @see {@linkcode DEFAULT_DELIMITER} for the default delimiter used if none is specified
*/
var deleteFirst = (arg, toDelete = "/") => {
	return arg.startsWith(toDelete) ? arg.substring(1) : arg;
};
/**
* Escapes special characters in a string to be used in a regular expression.
* @param arg The string to escape.
* @returns The escaped string, where special characters are prefixed with a `'\\$&'`.
*
* @see {@linkcode EscapeRexExp_F} for the type definition
* @see {@linkcode ESCAPE_REGEXP} for the regular expression used to identify special characters.
*/
var escapeRegExp = (arg) => {
	return arg.replace(ESCAPE_REGEXP, "\\$&");
};
/**
* Recombines a string into a state value object.
* The string is expected to be delimited by the default delimiter.
* The first part of the string becomes the key, and the rest becomes the value.
* If the string starts with the delimiter, it is removed before processing.
* @param arg The string to recompose.
* @param delimiter The delimiter used to split the string. Defaults to {@linkcode DEFAULT_DELIMITER}.
* @returns An object with the first part as the key and the recomposed value as the value.
*
* @see {@linkcode RecomposeSV_F} for the type definition
*/
var recomposeSV = (arg, delimiter = "/") => {
	const arg1 = arg.startsWith(delimiter) ? arg.substring(1) : arg;
	const splits = arg1.split(delimiter);
	if (splits.length === 1) return arg1;
	const first = splits.shift();
	const rest = splits.join(delimiter);
	return { [first]: recomposeSV(rest) };
};
/**
* Replaces all occurrences of a specified substring in a string with a replacement string.
* @param params Object containing the string to modify, the substring to match, and the replacement string.
* @returns The modified string with all occurrences replaced.
*
* @see {@linkcode ReplaceAll_F} for the type definition
*/
var replaceAll = ({ entry, match, replacement }) => {
	const regex = escapeRegExp(match);
	return entry.replace(new RegExp(regex, "g"), () => replacement);
};
pretype(type(({ primitiveObject }) => primitiveObject.const)).type, pretype(type(({ primitiveObject }) => primitiveObject.map.const)), pretype(type(({ partial, record, primitiveObject }) => partial({
	emitters: record({
		next: primitiveObject.const,
		error: primitiveObject.const
	}),
	children: record(primitiveObject.map.const)
})));
/**
* Flattens a state node configuration into a map structure.
*
* @param node - The state node configuration to flatten.
* @param withChildren - Whether to include child states in the output.
* @param delimiter - The delimiter to use for paths in the output map. Defaults to {@linkcode DEFAULT_DELIMITER}.
* @param path - The current path in the output map (used for recursion).
* @returns A flat map of the state node configuration.
*
* @see {@linkcode FlatMap_F} for more details.
*/
var flatMap = expandFn((node, children, sep = "/") => {
	return flatByKey.low(node, "states", {
		children,
		sep
	});
}, { low: (node, children = false, sep = "/") => {
	return flatByKey.low(node, "states", {
		children,
		sep
	});
} });
expandFn((obj) => {
	return obj;
}, { freeze: (obj) => {
	return Object.freeze(obj);
} });
var isSoa = (check, entry) => {
	if (Array.isArray(entry)) return entry.every(check);
	else return check(entry);
};
var checkSoAString = partialCall(isSoa, (str) => typeof str === "string");
checkSoAString.orUndefined = (value) => {
	if (value === void 0) return true;
	return checkSoAString(value);
};
var deepEqual = (a, b) => (0, import_fast_deep_equal.default)(a, b);
/**
* A utility function used when no action is required or when a placeholder value is needed.
*
* @returns in text environment {@linkcode DEFAULT_NOTHING}.
*/
var nothing = () => {};
/**
* Determines the type of state based on its configuration.
*
* @param config - The state configuration object.
* @returns The type of the state: 'atomic', 'compound', or the specified type.
*
* @see {@linkcode StateType_F} for more details.
*/
var stateType = (config) => {
	const type = config.type;
	if (type) return type;
	const states = config.states;
	if (states) {
		/* v8 ignore else -- @preserve */
		if (Object.keys(states).length > 0) return "compound";
	}
	return "atomic";
};
function isAtomic(arg) {
	return stateType(arg) === "atomic";
}
function isCompound(arg) {
	return stateType(arg) === "compound";
}
var ALLKEYS = [
	"on",
	"after",
	"activities",
	"initial",
	"entry",
	"exit",
	"description",
	"states",
	"type",
	"tags",
	"always",
	"actors",
	"after"
];
var ACTIVITY_KEYS = ["guards", "actions"];
var checkActivity = (value) => {
	if (!value) return false;
	if (checkAction(value)) return true;
	else if (Array.isArray(value)) return value.every(checkActivity);
	else {
		const _value = value;
		if (typeof _value !== "object") return false;
		const keys = Object.keys(_value);
		if (!(keys.length === 1 || keys.length === 2)) return false;
		if (!checkKeys(_value, ...ACTIVITY_KEYS)) return false;
		const guards = _value.guards;
		const actions = _value.actions;
		if (guards !== void 0) {
			if (!checkGuards(guards)) return false;
		}
		if (!actions) return false;
		return checkActions(actions);
	}
};
var checkActivities = (value) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	return Object.values(value).every(checkActivity);
};
checkActivities.orUndefined = (value) => {
	if (value === void 0) return true;
	return checkActivities(value);
};
var checkAtomic = (value, ...keys) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	if (!isTransitionsConfig(value, ...keys)) return false;
	const { __longRuns: _, strict: __, ..._value } = value;
	if (!checkKeys(_value, ...ALLKEYS)) return false;
	const entry = _value.entry;
	const exit = _value.exit;
	const description = _value.description;
	const tags = _value.tags;
	const activities = _value.activities;
	const initial = _value.initial;
	const type = _value.type;
	if (!checkActions.orUndefined(entry)) return false;
	if (!checkActions.orUndefined(exit)) return false;
	if (!isStringOrUndefined(description)) return false;
	if (!checkSoAString.orUndefined(tags)) return false;
	if (!checkActivities.orUndefined(activities)) return false;
	if (!isStringOrUndefined(type)) return false;
	if (!checkValues.orUndefined(type, "atomic", "compound", "parallel")) return false;
	return isStringOrUndefined(initial);
};
var isNodeConfig = (value, ...keys) => {
	if (!checkAtomic(value, ...keys)) return false;
	const _value = value;
	if (stateType(_value) === "atomic") return true;
	return Object.values(_value.states).every((v) => isNodeConfig(v, ...keys));
};
isNodeConfig.orUndefined = (value, ...keys) => {
	if (value === void 0) return true;
	return isNodeConfig(value, ...keys);
};
function isParallel(arg) {
	return arg.type === "parallel";
}
/**
* Returns an array of keys that are included the given string, excluding the string itself.
* @param str - The string to check against.
* @param keys - The keys to check.
* @returns An array of keys that include the given string, excluding the string itself.
*/
var getChildren = (str, ...keys) => {
	const noKeys = keys.length > 0;
	const out = [];
	/* v8 ignore else -- @preserve */
	if (noKeys) keys.forEach((key) => {
		const notMatch = str !== key;
		const check3 = key.startsWith(str);
		if (notMatch && check3) out.push(key);
	});
	return out;
};
var _getParents = (value) => {
	const last = value.lastIndexOf("/");
	const out = /* @__PURE__ */ new Set("/");
	out.add(value);
	const str2 = value.substring(0, last);
	if (isStringEmpty(str2)) return Array.from(out);
	_getParents(str2).forEach((v) => out.add(v));
	return Array.from(out);
};
/**
* Returns an array of parent paths for the given path.
* @param value - The path to get parents for.
* @returns An array of parent paths.
*
* @see {@linkcode GetParents_F} for type details.
* @see {@linkcode _getParents} for the implementation.
*/
var getParents = _getParents;
/**
* Returns the initial configuration of a state machine.
*
* @param body - The state machine configuration to process.
* @returns The initial configuration of the state machine.
*
* @see {@linkcode isAtomic} for checking atomic states
* @see {@linkcode isParallel} for checking parallel states
* @see {@linkcode InitialConfig_F} for more details
* @see {@linkcode t} for type utilities
*/
var initialConfig = (body) => {
	if (body === void 0 || body === null) return {};
	if (isAtomic(body)) return body;
	if (isParallel(body)) {
		const { states: _states, ...config } = body;
		const states = Object.entries(_states).map(([key, state]) => {
			return fn$8(key, initialConfig(state));
		}).reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {});
		return {
			...config,
			states
		};
	}
	const __id = body.initial;
	const initial = body.states[__id];
	if (!initial) {
		const { states: _states, ...config } = body;
		const states = Object.entries(_states).map(([key, state]) => {
			return fn$8(key, initialConfig(state));
		}).reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {});
		return {
			...config,
			states
		};
	}
	if (isAtomic(initial)) return {
		...body,
		states: { [__id]: initial }
	};
	return {
		...body,
		states: { [__id]: initialConfig(initial) }
	};
};
var _getTargetsFromConfig = (node, remain = "/") => {
	const out = createBetterSet();
	out.add("/");
	const { states } = node;
	if (states) Object.entries(states).forEach(([key, value]) => {
		out.add(`${remain}${key}`);
		const subOut = _getTargetsFromConfig(value, `${remain}${key}/`);
		out.add(...subOut);
	});
	return out;
};
/**
* Returns an array of targets from the given node config.
* @param node - The node config to get targets from.
* @returns An array of targets.
*
* @see {@linkcode getTargetsFromConfig} for the implementation.
*/
var getTargetsFromConfig = (node) => {
	return Array.from(_getTargetsFromConfig(node, "/"));
};
/**
* Returns the next state value based on the current state value and a target string.
*
* @param from - The current state value, which can be a string or an object.
* @param target - The target string to transition to. If not provided, the function returns the current state value.
* @returns The next state value based on the provided conditions.
*
* @see {@linkcode NextStateValue_F} for more type details of this function.
* @see {@linkcode isStringEmpty} for checking if a string is empty

* @see {@linkcode isString} for checking if a value is a string
* @see {@linkcode decompose} for decomposing objects into key-value pairs
* @see {@linkcode recompose} for recomposing key-value pairs into an object
* @see {@linkcode recomposeSV} for recomposing state values
* @see {@linkcode replaceAll} for replacing all occurrences of a substring in a string
* @see {@linkcode deleteFirst} for deleting the first occurrence of a substring in a string
* @see {@linkcode decomposeKeys} for getting the keys of an object after decomposition
* @see {@linkcode DEFAULT_DELIMITER} for the default delimiter used in state paths
*/
var nextSV = (from, target) => {
	if (isStringEmpty(from)) return {};
	if (!fn$6(target)) return from;
	if (isStringEmpty(target)) return from;
	if (!target.startsWith("/")) return from;
	if (isString(from)) {
		if (target.includes(`${from}/`)) return recomposeSV(target);
		return target;
	}
	if (Object.keys(from).length === 0) return from;
	const decomposed = fn$7(decompose(fn$9.forceCast(from), {
		start: false,
		object: "key"
	}));
	const last = target.lastIndexOf("/");
	const target2 = deleteFirst(replaceAll({
		entry: target.substring(0, last),
		match: "/",
		replacement: "."
	}), ".");
	if (decomposeKeys.low(from).includes(target2)) decomposed[target2] = target.substring(last + 1);
	else return target;
	return recompose(decomposed);
};
/**
* Converts a state machine config into a StateValue.
*
* @param body - The state machine configuration to process.
* @returns A value representation of the state machine, which can be a string,
*         an object, or an empty object if the state is atomic.
*
* @see {@linkcode NodeToValue_F} for more details
* @see {@linkcode isAtomic} for checking atomic states
* @see {@linkcode isCompound} for checking compound states
*/
var nodeToValue = (body) => {
	if (isAtomic(body)) return {};
	if (isCompound(body)) {
		const __id = body.initial;
		const initial = body.states[__id];
		if (!!initial && isAtomic(initial)) return __id;
		const keys = Object.keys(body.states);
		/* v8 ignore else -- @preserve */
		if (keys.length === 1) {
			const key = keys[0];
			const value = body.states[key];
			if (isAtomic(value)) return key;
		}
	}
	return Object.entries(body.states).map(([key, body]) => {
		const __id = body.initial;
		if (__id) {
			const initial = body.states[__id];
			if (initial) {
				if (isAtomic(initial)) return fn$8(key, __id);
				return fn$8(key, { [__id]: nodeToValue(initial) });
			}
		}
		return fn$8(key, nodeToValue(body));
	}).reduce((acc, [key, value]) => {
		acc[key] = value;
		return acc;
	}, {});
};
/**
* Recompose an object URL based on the provided shape and value.
*
* @param shape - The shape of the URL to recompose.
* @param value - The value to recompose into the URL.
* @returns A recomposed object URL.
*
* @see {@linkcode Url_F} for type details.
* @see {@linkcode DEFAULT_DELIMITER} for the default delimiter used in the URL.
*/
var recomposeObjectUrl = (shape, value) => {
	const obj = {};
	const { states, ...rest } = value;
	if (shape === "/") return rest;
	const keys = shape.split("/").filter((str) => str !== "");
	obj.states = {};
	if (keys.length === 1) {
		const key = keys.shift();
		obj.states[key] = value;
	} else {
		const key = keys.shift();
		const _value = recomposeObjectUrl(keys.join("/"), value);
		obj.states[key] = _value;
	}
	return obj;
};
/**
* Recompose a configuration object into a nested structure based on the provided shape.
*
* @param shape - The shape of the configuration to recompose.
* @returns A recomposed configuration object.
*
* @see {@linkcode RecomposeConfig_F} for type details.
* @see {@linkcode recomposeObjectUrl} for the implementation of the recomposition logic.
* @see {@linkcode merge} for merging objects.
*/
var recomposeConfig = (shape) => {
	const entries = Object.entries(shape);
	const arr = [];
	entries.forEach(([key, value]) => {
		arr.push(recomposeObjectUrl(key, value));
	});
	return merge(...arr);
};
/**
* Converts a child configuration to a child machine object.
* @param child of type {@linkcode string}, the machine child identifier.
* @param children of type {@linkcode ChildrenMap}, the map of children to look up the child configuration.
* @param events of type {@linkcode string[]}, list of events of the machine.
* @returns an emitter object with an id, or undefined if the emitter is not found.
*/
var toChildSrc = (child, children, ...events) => {
	const fn = children?.[child];
	return fn ? reduceFnMap(fn, ...events) : void 0;
};
/**
* Converts an emitter config to an emitter object with a source and transitions.
* @param child of type {@linkcode ChildConfig}, the child configuration to convert.
* @param options of type {@linkcode SimpleMachineOptions2}, the machine options.
* @param events of type {@linkcode string[]}, list of events of the machine.
* @returns an emitter object with a source and transitions.
*
* @see {@linkcode toChildSrc} for converting the source.
* @see {@linkcode toTransition} for converting transitions.
* @see {@linkcode toArray} for the type of the context.
* @see {@linkcode ToChild_F} for more details
*/
var toChild = (child, options, ...events) => {
	const tMapper = (config) => {
		return toTransition(config, options, ...events);
	};
	const out = fn$7({
		src: toChildSrc(child.__id, options?.actors?.children, ...events),
		on: identify(child.on).map(tMapper),
		contexts: Object.keys(child.contexts || {})
	});
	const { description } = child;
	if (description) out.description = description;
	return out;
};
var toEmitterSrc = (emitter, emitters) => {
	return emitters?.[emitter];
};
/**
* Converts an emitter config to an emitter object with a source and transitions.
* @param emitter of type {@linkcode EmitterConfig}, the emitter config.
* @param options of type {@linkcode SimpleMachineOptions2}, the machine options.
* @param events of type {@linkcode string[]}, list of events of the machine.
* @returns an emitter object with a source and transitions.
*
* @see {@linkcode toEmitterSrc} for converting the source.
* @see {@linkcode toTransition} for converting transitions.
* @see {@linkcode toArray.typed} for the type of the context.
* @see {@linkcode ToEmitter_F} for more details
*/
var toEmitter = (emitter, options, ...events) => {
	const out = {
		src: toEmitterSrc(emitter.__id, options?.actors?.emitters),
		resolves: toArray.typed(emitter.next).map((config) => toTransition(config, options, ...events)),
		catch: toArray.typed(emitter.error).map((config) => toTransition(config, options, ...events)),
		finally: toArray.typed(emitter.complete).map((config) => {
			if (typeof config === "object" && "actions" in config) return toTransition(config, options, ...events);
			return toTransition({ actions: config }, options, ...events);
		})
	};
	const { description } = emitter;
	if (description) out.description = description;
	return out;
};
/**
* Resolves a node configuration into a full node with all functions.
*
* @param config - The node configuration to resolve.
* @param options - Optional machine options that may include actions and actors configurations.
* @param events - The list of events of the machine.
* @returns A structured representation of the node with its properties and transitions.
*
* @see {@linkcode ResolveNode_F} for more details
* @see {@linkcode toAction} for converting actions
* @see {@linkcode toTransition} for converting transitions
* @see {@linkcode toArray.typed} for ensuring typed arrays
* @see {@linkcode stateType} for determining the type of the state
* @see {@linkcode identify} for identifying properties in the configuration
*
*/
var resolveNode = (config, options, ...events) => {
	const aMapper = (action) => {
		return toAction(action, options?.actions, ...events);
	};
	const tMapper = (config) => {
		return toTransition(config, options, ...events);
	};
	const { description, initial, tags: _tags } = config;
	const __id = config.__id;
	const type = stateType(config);
	const tags = toArray.typed(_tags);
	const entry = toArray.typed(config.entry).map(aMapper);
	const exit = toArray.typed(config.exit).map(aMapper);
	const states = identify(config.states).map((config) => resolveNode(config, options, ...events));
	const on = identify(config.on).map(tMapper);
	const always = toArray.typed(config.always).map(tMapper);
	const after = identify(config.after).map(tMapper);
	const actors = identify(config.actors);
	const out = fn$7({
		type,
		entry,
		exit,
		tags,
		states,
		on,
		always,
		after,
		emitters: actors.filter((actor) => "next" in actor).map((emitter) => toEmitter(emitter, options, ...events)),
		children: actors.filter((actor) => "on" in actor || "contexts" in actor).map((child) => toChild(child, options, ...events))
	});
	if (__id) out.__id = __id;
	if (initial) out.initial = initial;
	if (description) out.description = description;
	return out;
};
/**
* Converts a state value to a node configuration based on the provided body and from value.
*
* @param body - The node configuration body to convert from.
* @param from - The state value to convert to a node configuration.
* @param initial - Optional flag to indicate if the initial state should be included.
* @returns A node configuration object that represents the state value.
*
* @see {@linkcode ValueToNodeConfig_F} for more details
* @see {@linkcode flatMap} for flattening the node configuration
* @see {@linkcode getChildren} for retrieving child states
* @see {@linkcode getParents} for retrieving parent states
* @see {@linkcode recomposeConfig} for recomposing the node configuration
* @see {@linkcode decomposeSV} for decomposing state values
* @see {@linkcode replaceAll} for replacing substrings in the state value
* @see {@linkcode DEFAULT_DELIMITER} for the default delimiter used in state paths
*/
var valueToNodeConfig = (body, from) => {
	const flatBody = flatMap(body, false);
	const keysFlatBody = Object.keys(flatBody);
	if (isString(from)) {
		if (keysFlatBody.includes(from)) {
			const parents = getParents(from);
			const children = getChildren(from, ...keysFlatBody);
			const out1 = {};
			parents.concat(children).forEach((key) => {
				out1[key] = flatBody[key];
			});
			return recomposeConfig(out1);
		}
		return {};
	}
	const flatFrom = decomposeSV(from).map((key) => replaceAll({
		entry: key,
		match: ".",
		replacement: "/"
	})).map((key) => `/${key}`);
	const out1 = {};
	flatFrom.forEach((key1, _, all) => {
		/* v8 ignore else -- @preserve */
		if (keysFlatBody.some((key) => key.startsWith(key1))) {
			out1[key1] = flatBody[key1];
			const initial = flatBody[key1].initial;
			if (initial) {
				const _initial = `${key1}/${initial}`;
				if (all.some((key) => key.startsWith(`${key1}/`))) return;
				out1[_initial] = flatBody[_initial];
			}
		}
	});
	return recomposeConfig(out1);
};
var ActivityMap_Schema = union([ActionConfig_Schema, strictObject({
	description: optional(string()),
	actions: SoaLSchema(ActionConfig_Schema),
	guards: optional(SoaLSchema(GuardConfig_Schema))
})]);
var ActivityMapG_Schema = strictObject({
	description: optional(string()),
	actions: SoaLSchema(ActionConfig_Schema),
	guards: SoaLSchema(GuardConfig_Schema)
});
var ActivityConfig_Schema = union([ActivityMap_Schema, pipe(array(ActivityMap_Schema), check((a) => {
	return a.length > 0;
}, "Empty Activity Array"), check((a) => {
	const [_, ...rest] = [...a].reverse();
	const schema = ActivityMapG_Schema;
	const fn = (value) => safeParse(schema, value).success;
	return rest.every(fn);
}, "Wrong activity Array"))]);
var CommonNodeConfigEntries = (...paths) => {
	return {
		...Transitions_Schema(...paths).entries,
		description: optional(string()),
		entry: optional(SoaLSchema(ActionConfig_Schema)),
		exit: optional(SoaLSchema(ActionConfig_Schema)),
		tags: optional(SoaLSchema(string())),
		initial: optional(string()),
		activities: optional(recordV(string(), ActivityConfig_Schema)),
		type: optional(union([
			literal("compound"),
			literal("parallel"),
			literal("atomic")
		]))
	};
};
var _checkNodeType = (node) => {
	const checkAtomic = (!node.type || node.type === "atomic") && node.states === void 0 && node.initial === void 0;
	const checkParallel = node.type === "parallel" && node.states !== void 0 && node.initial === void 0;
	const checkCompound = (!node.type || node.type === "compound") && node.states !== void 0 && node.initial !== void 0;
	return checkAtomic || checkParallel || checkCompound;
};
var checkNodeType = check(_checkNodeType, "Must be \"Atomic\" or \"Parallel\" or \"Compound\" config");
var NodeConfig_Schema = (...paths) => {
	return pipe(strictObject({
		...CommonNodeConfigEntries(...paths),
		states: optional(recordV(string(), lazy(() => NodeConfig_Schema(...paths))))
	}, ({ path = [] }) => {
		return `Unexpected key '${path.map(({ key }) => key).join(".")}' in node config`;
	}), checkNodeType);
};
var getTags = (node) => {
	const flat = flatMap(node);
	const out = [];
	Object.entries(flat).forEach(([, state]) => {
		const tags = toArray.typed(state.tags);
		out.push(...tags);
	});
	if (out.length === 0) return void 0;
	return out;
};
var CommonMachine = class {
	/**
	* The configuration of the machine for this {@linkcode Machine}.
	*
	* @see {@linkcode Config}
	* @see {@linkcode C}
	*/
	#config;
	get config() {
		return this.#config;
	}
	__eventsList;
	get eventsList() {
		return this.__eventsList;
	}
	__flat;
	get decomposed() {
		return decompose(this.#config, {
			sep: ".",
			start: false,
			object: "both"
		});
	}
	/**
	* @deprecated
	*
	* This property provides the decomposed state for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode State}
	* @see {@linkcode Decompose}
	* @see {@linkcode Eo}
	* @see {@linkcode Tc}
	* @see {@linkcode Ta}
	*/
	get __decomposedState() {
		return _unknown();
	}
	/**
	* Public accessor for the events map for this {@linkcode Machine}.
	*
	* @see {@linkcode EventsMap}
	* @see {@linkcode E}
	*/
	get eventsMap() {
		return _unknown();
	}
	/**
	* Public accessor for the promisees map for this {@linkcode Machine}.
	*
	* @see {@linkcode PromiseeMap}
	* @see {@linkcode A}
	*/
	get actorsMap() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides the events map for this {@linkcode Machine} as a type.
	*
	* @see {@linkcode ToEvents}
	* @see {@linkcode E}
	* @see {@linkcode A}
	*
	* @remarks Used for typing purposes only.
	*/
	get __events() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides any action key for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*/
	get __actionKey() {
		return this.#typingsByKey("actions");
	}
	/**
	* @deprecated
	*
	* This property provides the action parameters of action function for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode E}
	* @see {@linkcode Pc}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode Tc}
	*/
	get __actionParams() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides the state for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode State}
	* @see {@linkcode ToEventsR2}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode ActorsConfigMap}
	* @see {@linkcode E}
	* @see {@linkcode A}   * @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __state() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides the state extended for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode StateExtended}
	* @see {@linkcode ToEvents}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode ActorsConfigMap}
	* @see {@linkcode E}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __stateExtended() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides the state payload for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode StateP}
	* @see {@linkcode ToEventsR2}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode ActorsConfigMap}
	* @see {@linkcode E}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __stateP() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides the extended state payload for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode StatePextended}
	* @see {@linkcode ToEventsR2}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode ActorsConfigMap}
	* @see {@linkcode E}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __statePextended() {
		return _unknown();
	}
	#typingsByKey = (key) => {
		const out2 = fn$4(fn$3(fn$5.dynamic(this), key), {});
		return fn$2.union(out2);
	};
	/**
	* @deprecated
	*
	* This property provides any guard key for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*/
	get __guardKey() {
		return this.#typingsByKey("guards");
	}
	/**
	* @deprecated
	*
	* This property provides any delay key for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*/
	get __delayKey() {
		return this.#typingsByKey("delays");
	}
	/**
	* @deprecated
	*
	* This property provides any {@linkcode DefinedValue} for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode DefinedValue}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __definedValue() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides any child key for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*/
	get __childKey() {
		return this.#typingsByKey("children");
	}
	/**
	* @deprecated
	*
	* Return this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*/
	get __machine() {
		return _unknown();
	}
	get __tag() {
		return _unknown();
	}
	#actions;
	#guards;
	#delays;
	#actors;
	/**
	* Context for this {@linkcode Machine}.
	*
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode Tc}
	*/
	__context;
	/**
	* Private context for this {@linkcode Machine}.
	*
	* @see {@linkcode Pc}
	*/
	__pContext;
	#tags;
	get tags() {
		return this.#tags;
	}
	#initialKeys = [];
	/**
	* The initial node config of this {@linkcode Machine}.
	*/
	#initialConfig;
	#getInitialKeys = () => {
		Object.entries(this.__flat).forEach(([key, { initial }]) => {
			if (initial !== void 0) {
				const toPush = `${key}/${initial}`;
				this.#initialKeys.push(toPush);
			}
		});
	};
	/**
	* Creates an instance of Machine.
	*
	* @param config : of type {@linkcode Config} [C] - The configuration for the machine.
	*
	* @remarks
	* This constructor initializes the machine with the provided configuration.
	* It flattens the configuration and prepares it for further operations ({@linkcode flat}).
	*/
	constructor(config) {
		this.#config = config;
		this.__flat = flatMap.low(this.#config, true);
		this.#tags = Object.values(this.__flat).map(({ tags }) => toArray.typed(tags)).filter(Boolean).flat();
		this.#initialConfig = initialConfig(this.#config);
		this.#getInitialKeys();
		this.__eventsList = constructEvents(this.#config);
	}
	swap = (fn, ev) => (types) => {
		const _swappped = swap(fn).constraint()(types);
		return reduceFnMap(ev ? { [ev]: _swappped } : _swappped, ...this.__eventsList);
	};
	/**
	* The accessor of context for this {@linkcode Machine}.
	*
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode Tc}
	*/
	get context() {
		return this.__elements.context;
	}
	/**
	* The accessor of private context for this {@linkcode Machine}.
	*
	* @see {@linkcode Pc}
	*/
	get pContext() {
		return this.__elements.pContext;
	}
	get actions() {
		return this.#actions;
	}
	get guards() {
		return this.#guards;
	}
	get delays() {
		return this.#delays;
	}
	get children() {
		return this.#actors?.children;
	}
	get emitters() {
		return this.#actors?.emitters;
	}
	/**
	* @deprecated
	*
	* This property provides all possible paths for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*/
	get __allPaths() {
		return _unknown();
	}
	isInitial = (target) => {
		return this.#initialKeys.includes(target);
	};
	retrieveParentFromInitial = (target) => {
		const check1 = this.isInitial(target);
		const flat = this.__flat;
		if (check1) {
			const parent = target.substring(0, target.lastIndexOf("/"));
			if (this.isInitial(parent)) return this.retrieveParentFromInitial.bind(this)(parent);
			return flat[parent];
		}
		return flat[target];
	};
	#addActions = (actions) => this.#actions = merge(this.#actions, actions);
	#addGuards = (guards) => this.#guards = merge(this.#guards, guards);
	#addDelays = (delays) => this.#delays = merge(this.#delays, delays);
	#addChildren = (children) => this.#actors = merge(this.#actors, fn$7({ children }));
	#addEmitters = (emitters) => this.#actors = merge(this.#actors, fn$7({ emitters }));
	/**
	* Provides options for the machine.
	*
	* @param option a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	*/
	addOptions(helper) {
		const out = this.createOptions(helper);
		this.#addActions(out?.actions);
		this.#addGuards(out?.guards);
		this.#addDelays(out?.delays);
		this.#addChildren(out?.actors?.children);
		this.#addEmitters(out?.actors?.emitters);
		return out;
	}
	/**
	* Returns a new instance from this {@linkcode Machine} with all its {@linkcode Elements}.
	*/
	get renew() {
		return this.__renew();
	}
	/**
	* Provides options for the machine.
	*
	* @param helper a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	* @returns a new instance of the machine with the provided options applied.
	*/
	provideOptions(helper) {
		const out = this.renew;
		out.addOptions(helper);
		return out;
	}
	/**
	* Get all meaningful elements of the machine.
	*
	* @see {@linkcode Elements}
	*
	* @see type inferences :
	*
	* @see {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2}, {@linkcode Mo}
	*/
	get __elements() {
		return {
			config: structuredClone(this.#config),
			pContext: (0, import_clone_deep.default)(this.__pContext),
			context: structuredClone(this.__context),
			actions: (0, import_clone_deep.default)(this.#actions),
			guards: (0, import_clone_deep.default)(this.#guards),
			delays: (0, import_clone_deep.default)(this.#delays),
			actors: (0, import_clone_deep.default)(this.#actors)
		};
	}
	addPrivateContext = (pContext) => {
		this.__pContext = pContext;
	};
	addContext = (context) => {
		this.__context = context;
	};
	/**
	* Converts a {@linkcode StateValue} to a {@linkcode NodeConfigWithInitials} with the {@linkcode NodeConfigWithInitials} postConfig of this {@linkcode Machine}.
	*
	* @param from the {@linkcode StateValue} to convert.
	* @returns the converted {@linkcode NodeConfigWithInitials}.
	*
	* @see {@linkcode valueToNodeConfig}
	*/
	valueToConfig = (from) => {
		return valueToNodeConfig(this.#config, from);
	};
	/**
	* The accessor of the initial node config of this {@linkcode Machine}.
	*/
	get initialConfig() {
		return this.#initialConfig;
	}
	/**
	* The accessor of the initial {@linkcode StateValue} of this {@linkcode Machine}.
	*
	* @see {@linkcode nodeToValue}
	*/
	get initialValue() {
		return nodeToValue(this.#initialConfig);
	}
	/**
	* Alias of {@linkcode valueToConfig} method.
	*/
	toNode = this.valueToConfig;
	get options() {
		const guards = this.#guards;
		const actions = this.#actions;
		const delays = this.#delays;
		const actors = this.#actors;
		return _unknown({
			guards,
			actions,
			delays,
			actors
		});
	}
	/**
	* Function helper to check if a value matches the provided values
	*
	* @see type inferences :
	*
	* {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
	*
	* @see {@linkcode isValue}
	*/
	get __isValue() {
		return isValue;
	}
	/**
	* Function helper to check if a value is not one of the provided values.
	*
	* @see type inferences :
	*
	*  {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
	*
	* @see {@linkcode isNotValue}
	*/
	get __isNotValue() {
		return isNotValue;
	}
	/**
	* Function helper to check if a value is defined
	*
	* @see type inferences :
	*
	* {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
	*
	* @see {@linkcode isDefinedS}
	*/
	get __isDefined() {
		return isDefinedS;
	}
	/**
	* Function helper to check if a value is undefined or null
	* @see type inferences :
	*
	* {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
	*
	* @see {@linkcode isDefinedS}
	*/
	get __isNotDefined() {
		return isNotDefinedS;
	}
	__cloneStateExtended = (state) => {
		return structuredClone(state);
	};
	__timeAction = (name) => {
		return (id) => ({ context, pContext }) => {
			return fn$7({
				context,
				pContext,
				[name]: id
			});
		};
	};
};
/**
* Helper to retrieve entry or exit actions from a node.
*
* @see {@linkcode GetIO_F}
* @see {@linkcode toArray.typed}
* @see {@linkcode isAtomic}
* @see {@linkcode isCompound}
*/
var getIO = (key, node) => {
	if (!node) return [];
	const out = toArray.typed(node?.[key]);
	if (isAtomic(node)) return out;
	const states = node.states;
	if (isCompound(node)) {
		const initial = states[node.initial];
		out.push(...getIO(key, initial));
	}
	return out;
};
/**
* Retrieves all entry actions from a node.
*/
var getEntries = partialCall.paramArray(getIO, "entry");
/**
* Retrieves all exit actions from a node.
*/
var getExits = partialCall.paramArray(getIO, "exit");
/**
* A class representing a state machine.
* It provides methods to manage states, actions, guards, delays, promises, and machines.
*
* @template : {@linkcode AsyncConfig} [C] - The configuration type of the machine.
* @template Pc : The private context type of the machine.
* @template : {@linkcode PrimitiveObject} [Pc] - The context type of the machine.
* @template : {@linkcode GetEventsFromConfig}<{@linkcode C}> [E] - The events map type derived from the configuration.
* @template : {@linkcode PromiseeMap} [P] - The promisees map type derived from the configuration.
* @template : {@linkcode SimpleMachineOptions2} [Mo] - The options type for the machine, which includes actions, guards, delays, promises, and machines. Defaults to {@linkcode SimpleMachineOptions2}<[{@linkcode C} , {@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} ]>.
*
* @implements {@linkcode AnyMachine}<{@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} >
*/
var AsyncMachine = class AsyncMachine extends CommonMachine {
	TYPE = "async";
	/**
	* @deprecated
	* This property provides the action function for this {@linkcode AsyncMachine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode E}
	* @see {@linkcode PromiseeMap}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode Tc}
	*/
	get __actionFn() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides the predicate function for this {@linkcode AsyncMachine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode AsyncPredicateS}
	* @see {@linkcode ActorsConfigMap}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode E}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __predicate() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides the delay function for this {@linkcode AsyncMachine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode AsyncDelayFunction}
	* @see {@linkcode ActorsConfigMap}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode E}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __delay() {
		return _unknown();
	}
	/**
	* The public accessor of the flat map of the configuration for this {@linkcode AsyncMachine}.
	*
	* @see {@linkcode FlatMapN}
	* @see {@linkcode AsyncConfig}
	* @see {@linkcode C}
	*/
	get flat() {
		return this.__flat;
	}
	/**
	* Create options for the machine.
	*
	* @param option a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	*
	* Remark: Used for typings, when you're outside the Machine class.
	*/
	createOptions = (helper) => {
		const isValue = this.__isValue;
		const isNotValue = this.__isNotValue;
		const isDefined = this.__isDefined;
		const isNotDefined = this.__isNotDefined;
		const voidAction = this.__voidAction;
		const sendTo = this.__sendTo;
		const _legacy = Object.freeze({
			actions: (0, import_clone_deep.default)(this.__elements.actions),
			guards: (0, import_clone_deep.default)(this.__elements.guards),
			delays: (0, import_clone_deep.default)(this.__elements.delays),
			actors: (0, import_clone_deep.default)(this.__elements.actions)
		});
		return helper({
			isValue,
			isNotValue,
			isDefined,
			isNotDefined,
			swap: this.swap,
			assign: (keys, fn, options) => {
				const keysArray = Array.isArray(keys) ? keys : [keys];
				const isArray = Array.isArray(keys);
				if (!options) {
					const _fn = reduceFnMap(fn, ...this.__eventsList);
					return async (state) => {
						const result = await _fn(state);
						if (!isArray) return recompose({ [keysArray[0]]: result });
						const obj = {};
						keysArray.forEach((k, idx) => {
							obj[k] = result?.[idx];
						});
						return recompose(obj);
					};
				}
				const { catch: errorFn, then: thenFn, max } = options;
				const _fn = reduceFnMap(fn, ...this.__eventsList);
				return async (state) => {
					const { pContext, context, event, ...rest } = state;
					const _state = (0, import_clone_deep.default)({
						pContext,
						context
					});
					const execute = async () => {
						const rawResult = await _fn(state);
						console.warn("result", "=>", "rawResult");
						if (!isArray) return recompose({ [keysArray[0]]: rawResult });
						const obj = {};
						keysArray.forEach((k, idx) => {
							obj[k] = rawResult?.[idx];
						});
						return recompose(obj);
					};
					try {
						let res;
						if (max !== void 0) res = await withTimeout(execute, `assign-${keysArray.join("-")}`, max)();
						else res = await execute();
						if (thenFn) {
							const nextContext = _merge(context, res?.context);
							const nextPContext = _merge(pContext, res?.pContext);
							const thenRes = await thenFn({
								...rest,
								event,
								context: nextContext,
								pContext: nextPContext
							});
							return _merge(res, thenRes);
						}
						return res;
					} catch (e) {
						return await errorFn(e)({
							..._state,
							event,
							...rest
						});
					}
				};
			},
			batch: (...fns) => {
				return async ({ context, pContext, ...rest }) => {
					const state = this.__cloneStateExtended({
						context,
						pContext,
						...rest
					});
					let out;
					for (const fn of fns.filter((f) => !!f)) if (!out) out = await fn(state);
					else {
						const temp = await fn(Object.assign(out, rest));
						out = _merge(out, temp);
					}
					return out;
				};
			},
			filter: (key, fn) => {
				return ({ context, pContext }) => {
					const currentValue = getByKey.low({
						context,
						pContext
					}, key);
					const predicate = fn;
					let filteredValue;
					/* v8 ignore else -- @preserve */
					if (Array.isArray(currentValue)) filteredValue = currentValue.filter(predicate);
					else if (currentValue !== null && typeof currentValue === "object") {
						if (isMergeUndefined(currentValue)) return MERGE_UNDEFINED;
						filteredValue = Object.entries(currentValue).reduce((acc, [objKey, value]) => {
							if (predicate(value, currentValue)) acc[objKey] = value;
							else acc[objKey] = MERGE_UNDEFINED;
							return acc;
						}, {});
					}
					return recompose({ [key]: filteredValue });
				};
			},
			erase: (key) => () => recompose({ [key]: MERGE_UNDEFINED }),
			voidAction,
			sendTo,
			debounce: (fn$1, { id, ms = 100 }) => {
				return async ({ context, pContext, ...rest }) => {
					return fn$7({
						context,
						pContext,
						scheduled: {
							data: await fn$1(this.__cloneStateExtended({
								context,
								pContext,
								...rest
							})),
							ms,
							id
						}
					});
				};
			},
			resend: (resend) => {
				return ({ context, pContext }) => {
					return fn$7({
						context,
						pContext,
						resend
					});
				};
			},
			forceSend: (forceSend) => {
				return ({ context, pContext }) => {
					return fn$7({
						context,
						pContext,
						forceSend
					});
				};
			},
			pauseActivity: this.__timeAction("pauseActivity"),
			resumeActivity: this.__timeAction("resumeActivity"),
			stopActivity: this.__timeAction("stopActivity"),
			pauseTimer: this.__timeAction("pauseTimer"),
			resumeTimer: this.__timeAction("resumeTimer"),
			stopTimer: this.__timeAction("stopTimer")
		}, { _legacy });
	};
	/**
	* Provides options for the machine.
	*
	* @param option a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	*/
	addOptions = (helper) => {
		return super.addOptions(helper);
	};
	/**
	* Provides options for the machine.
	*
	* @param helper a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	* @returns a new instance of the machine with the provided options applied.
	*/
	provideOptions = (helper) => super.provideOptions(helper);
	/**
	* Provides elements of the machine.
	* @param key the key of the element to provide.
	* @param value the value of the element to provide.
	* If not provided, the current elements will be returned.
	* @returns the elements of the machine with the provided key and value.
	*
	* @see {@linkcode Elements}
	*
	* @see type inferences :
	*
	*  {@linkcode AsyncConfig} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode Mo}
	*/
	/**
	* Renews the machine with the provided key and value.
	* @param key the key of the element to provide.
	* @param value the value of the element to provide.
	* If not provided, the current elements will be returned.
	* @returns a new instance of this {@linkcode AsyncMachine} with the provided key and value.
	*
	* @see {@linkcode Elements}
	*
	* @see type inferences :
	*
	*  {@linkcode AsyncConfig} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode types} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode Mo}
	*/
	__renew = () => {
		const { config, pContext, context, guards, actions, delays, actors } = this.__elements;
		const out = new AsyncMachine(config);
		out.__pContext = pContext;
		out.__context = context;
		out.addOptions(() => ({
			guards,
			actions,
			delays,
			actors
		}));
		return out;
	};
	longRuns;
	/**
	* Creates an instance of Machine.
	*
	* @param config : of type {@linkcode AsyncConfig} [C] - The configuration for the machine.
	*
	* @remarks
	* This constructor initializes the machine with the provided configuration.
	* It flattens the configuration and prepares it for further operations ({@linkcode flat}).
	*/
	constructor(config) {
		super(config);
		this.longRuns = this.config.__longRuns === true;
	}
	/**
	* Function helper to send an event to a child service.
	*
	* @param _ an optional parameter of type {@linkcode AnyMachine} [{@linkcode T}] to specify the machine context. Only used for type inference.
	*
	* @see type inferences :
	*
	* {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
	*
	* @see {@linkcode reduceFnMap}
	*/
	__sendTo = () => {
		return (fn$2, options) => {
			if (!options) {
				const fn2 = reduceFnMap(fn$2, ...this.__eventsList);
				return ({ context, pContext, ...rest }) => {
					const state = this.__cloneStateExtended({
						context,
						pContext,
						...rest
					});
					const { event, to } = fn2(state);
					return fn$7({
						context,
						pContext,
						sentEvent: {
							to,
							event
						}
					});
				};
			}
			const { catch: errorFn, max } = options;
			return async ({ context, pContext, event, ...rest }) => {
				const out = fn$7({
					context,
					pContext
				});
				const state = this.__cloneStateExtended({
					context,
					pContext,
					event,
					...rest
				});
				const execute = async () => {
					const { event, to } = await reduceFnMap(fn$2, ...this.__eventsList)(state);
					const sentEvent = {
						to,
						event
					};
					return fn$7({
						...out,
						sentEvent
					});
				};
				try {
					if (max !== void 0) return await withTimeout(execute, "sendTo", max)();
					return await execute();
				} catch (e) {
					return await errorFn(e)({
						context,
						pContext,
						event,
						...rest
					});
				}
			};
		};
	};
	/**
	* Function helper to perform a void action.
	*
	* @param fn the action function to perform.
	*
	* @see type inferences :
	*
	* {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
	*
	* @see {@linkcode AsyncVoidAction_F}
	*/
	__voidAction = (fn$3, options) => {
		if (!options) return ({ context, pContext, ...rest }) => {
			reduceFnMap(fn$3, ...this.__eventsList)(this.__cloneStateExtended({
				context,
				pContext,
				...rest
			}));
			return fn$7({
				context,
				pContext
			});
		};
		const { catch: errorFn, then: thenFn, max } = options;
		return async ({ context, pContext, event, ...rest }) => {
			const out = fn$7({
				context,
				pContext
			});
			const state = this.__cloneStateExtended({
				context,
				pContext,
				event,
				...rest
			});
			const execute = async () => {
				await reduceFnMap(fn$3, ...this.__eventsList)(state);
				return out;
			};
			try {
				let res;
				if (max !== void 0) res = await withTimeout(execute, "voidAction", max)();
				else res = await execute();
				if (thenFn) {
					const thenRes = await thenFn({
						...rest,
						event,
						context,
						pContext
					});
					return _merge(res, thenRes);
				}
				return res;
			} catch (e) {
				return await errorFn(e)({
					context,
					pContext,
					event,
					...rest
				});
			}
		};
	};
};
var createAsyncMachine = (config) => {
	return new AsyncMachine(config);
};
/**
* A class representing a state machine.
* It provides methods to manage states, actions, guards, delays, promises, and machines.
*
* @template Pc : The private context type of the machine.
* @template : {@linkcode PrimitiveObject} [Pc] - The context type of the machine.
* @template : {@linkcode GetEventsFromConfig}<{@linkcode C}> [E] - The events map type derived from the configuration.
* @template : {@linkcode PromiseeMap} [P] - The promisees map type derived from the configuration.
* @template : {@linkcode SimpleMachineOptions2} [Mo] - The options type for the machine, which includes actions, guards, delays, promises, and machines. Defaults to {@linkcode SimpleMachineOptions2}<[{@linkcode C} , {@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} ]>.
*
* @implements {@linkcode AnyMachine}<{@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} >
*/
var SyncMachine = class SyncMachine extends CommonMachine {
	TYPE = "sync";
	/**
	* @deprecated
	* This property provides the action function for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode E}
	* @see {@linkcode PromiseeMap}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode Tc}
	*/
	get __actionFn() {
		return _unknown();
	}
	get flat() {
		return this.__flat;
	}
	/**
	* @deprecated
	*
	* This property provides the predicate function for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode AsyncPredicateS}
	* @see {@linkcode ActorsConfigMap}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode E}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __predicate() {
		return _unknown();
	}
	/**
	* @deprecated
	*
	* This property provides the delay function for this {@linkcode Machine} as a type.
	*
	* @remarks Used for typing purposes only.
	*
	* @see {@linkcode DelayFunction}
	* @see {@linkcode ActorsConfigMap}
	* @see {@linkcode PrimitiveObject}
	* @see {@linkcode E}
	* @see {@linkcode A}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	get __delay() {
		return _unknown();
	}
	/**
	* Create options for the machine.
	*
	* @param option a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	*
	* Remark: Used for typings, when you're outside the Machine class.
	*/
	createOptions = (helper) => {
		const isValue = this.__isValue;
		const isNotValue = this.__isNotValue;
		const isDefined = this.__isDefined;
		const isNotDefined = this.__isNotDefined;
		const voidAction = this.__voidAction;
		const sendTo = this.__sendTo;
		const _legacy = Object.freeze({
			actions: (0, import_clone_deep.default)(this.__elements.actions),
			guards: (0, import_clone_deep.default)(this.__elements.guards),
			delays: (0, import_clone_deep.default)(this.__elements.delays),
			actors: (0, import_clone_deep.default)(this.__elements.actors)
		});
		return helper({
			isValue,
			isNotValue,
			isDefined,
			isNotDefined,
			swap: this.swap,
			assign: (keys, fn) => {
				const keysArray = Array.isArray(keys) ? keys : [keys];
				const isArray = Array.isArray(keys);
				const _fn = reduceFnMap(fn, ...this.__eventsList);
				return (state) => {
					const result = _fn(state);
					if (!isArray) return recompose({ [keysArray[0]]: result });
					const obj = {};
					keysArray.forEach((k, idx) => {
						obj[k] = result?.[idx];
					});
					return recompose(obj);
				};
			},
			batch: (...fns) => {
				return ({ context, pContext, ...rest }) => {
					const state = this.__cloneStateExtended({
						context,
						pContext,
						...rest
					});
					let out;
					for (const fn of fns.filter((f) => !!f)) if (!out) out = fn(state);
					else {
						const _state = Object.assign(out, rest);
						out = _merge(out, fn(_state));
					}
					return out;
				};
			},
			filter: (key, fn) => {
				return ({ context, pContext }) => {
					const currentValue = getByKey.low({
						context,
						pContext
					}, key);
					const predicate = fn;
					let filteredValue;
					/* v8 ignore else -- @preserve */
					if (Array.isArray(currentValue)) filteredValue = currentValue.filter(predicate);
					else if (currentValue !== null && typeof currentValue === "object") {
						if (isMergeUndefined(currentValue)) return MERGE_UNDEFINED;
						filteredValue = Object.entries(currentValue).reduce((acc, [objKey, value]) => {
							if (predicate(value, currentValue)) acc[objKey] = value;
							else acc[objKey] = MERGE_UNDEFINED;
							return acc;
						}, {});
					}
					return recompose({ [key]: filteredValue });
				};
			},
			erase: (key) => () => recompose.low({ [key]: MERGE_UNDEFINED }),
			voidAction,
			sendTo,
			debounce: (fn$1, { id, ms = 100 }) => {
				return ({ context, pContext, ...rest }) => {
					return fn$7({
						context,
						pContext,
						scheduled: {
							data: fn$1(this.__cloneStateExtended({
								context,
								pContext,
								...rest
							})),
							ms,
							id
						}
					});
				};
			},
			resend: (resend) => {
				return ({ context, pContext }) => {
					return fn$7({
						context,
						pContext,
						resend
					});
				};
			},
			forceSend: (forceSend) => {
				return ({ context, pContext }) => {
					return fn$7({
						context,
						pContext,
						forceSend
					});
				};
			},
			pauseActivity: this.__timeAction("pauseActivity"),
			resumeActivity: this.__timeAction("resumeActivity"),
			stopActivity: this.__timeAction("stopActivity"),
			pauseTimer: this.__timeAction("pauseTimer"),
			resumeTimer: this.__timeAction("resumeTimer"),
			stopTimer: this.__timeAction("stopTimer")
		}, { _legacy });
	};
	/**
	* Provides elements of the machine.
	* @param key the key of the element to provide.
	* @param value the value of the element to provide.
	* If not provided, the current elements will be returned.
	* @returns the elements of the machine with the provided key and value.
	*
	* @see {@linkcode Elements}
	*
	* @see type inferences :
	*
	*  {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode Mo}
	*/
	addOptions = (helper) => {
		return super.addOptions(helper);
	};
	/**
	* Provides options for the machine.
	*
	* @param helper a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	* @returns a new instance of the machine with the provided options applied.
	*/
	provideOptions = (helper) => super.provideOptions(helper);
	/**
	* Renews the machine with the provided key and value.
	* @param key the key of the element to provide.
	* @param value the value of the element to provide.
	* If not provided, the current elements will be returned.
	* @returns a new instance of this {@linkcode Machine} with the provided key and value.
	*
	* @see {@linkcode Elements}
	*
	* @see type inferences :
	*
	*  {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode types} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode Mo}
	*/
	__renew = () => {
		const { config, pContext, context, guards, actions, delays, actors } = this.__elements;
		const out = new SyncMachine(config);
		out.__pContext = pContext;
		out.__context = context;
		out.addOptions(() => ({
			guards,
			actions,
			delays,
			actors
		}));
		return out;
	};
	/**
	* Function helper to send an event to a child service.
	*
	* @param _ an optional parameter of type {@linkcode AnyMachine} [{@linkcode T}] to specify the machine context. Only used for type inference.
	*
	* @see type inferences :
	*
	* {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
	*
	* @see {@linkcode reduceFnMap}
	*/
	__sendTo = () => {
		return (fn$2) => {
			const fn2 = reduceFnMap(fn$2, ...this.__eventsList);
			return ({ context, pContext, ...rest }) => {
				const state = this.__cloneStateExtended({
					context,
					pContext,
					...rest
				});
				const { event, to } = fn2(state);
				return fn$7({
					context,
					pContext,
					sentEvent: {
						to,
						event
					}
				});
			};
		};
	};
	/**
	* Function helper to perform a void action.
	*
	* @param fn the action function to perform.
	*
	* @see type inferences :
	*
	* {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
	*
	* @see {@linkcode VoidAction_F}
	*/
	__voidAction = (fn$3) => {
		return ({ context, pContext, ...rest }) => {
			reduceFnMap(fn$3, ...this.__eventsList)(this.__cloneStateExtended({
				context,
				pContext,
				...rest
			}));
			return fn$7({
				context,
				pContext
			});
		};
	};
};
var createSyncMachine = (config) => {
	return new SyncMachine(config);
};
var Config_Schema = (...paths) => {
	return pipe(strictObject({
		...CommonNodeConfigEntries(...paths),
		strict: optional(boolean()),
		__longRuns: optional(boolean()),
		states: optional(recordV(string("Keys of states must be of type \"string\""), NodeConfig_Schema(...paths)))
	}, ({ path = [] }) => {
		return `Unexpected key '${path.map(({ key }) => key).join(".")}' in node config`;
	}), checkNodeType);
};
var builder = (_config, types) => {
	const config = parse(Config_Schema(...getTargetsFromConfig(_config)), _config);
	return (types?.sync === true ? createSyncMachine : createAsyncMachine)(config);
};
var createMachine = (nameOrConfig, configOrTypes, types) => {
	if (typeof nameOrConfig === "string") return builder(configOrTypes, types);
	return builder(nameOrConfig, configOrTypes);
};
/**
* Converts a delay configuration to a function that returns the delay in milliseconds.
* If the delay is a number, it returns a function that returns that number.
* If the delay is a function, it reduces the function map with the provided events list.
*
* @param delay of type string,  The delay configuration.
* @param delays of type {@linkcode AsyncDelayMap}, the map of delays containing functions to execute.
* @param events of type {@linkcode string[]}, list of events of the machine.
* @returns a function that returns the delay in milliseconds or undefined if not found.
*
* @see {@linkcode PrimitiveObject}
* @see {@linkcode reduceFnMap}
*/
var toDelay = (delay, delays, ...events) => {
	const fn = delays?.[delay];
	if (typeof fn === "number") return () => fn;
	return fn ? reduceFnMap(fn, ...events) : void 0;
};
/**
* Subscriber class that manages the subscription state and provides methods
* to handle state changes and unsubscribe.
*
* @template : {@linkcode PrimitiveObject} [Tc] - Type of the context
* @template : [R] - Type of the return value
*
*/
var SubscriberClass = class {
	_id;
	#subscriber;
	#events;
	#state = "idle";
	/**
	* Function to compare two {@linkcode State}s for equality.
	* @param previous of type {@linkcode State} - First state to compare
	* @param next of type {@linkcode State} - Second state to compare
	*/
	#equals;
	get id() {
		return this._id;
	}
	/**
	* Creates an instance of SubscriberMapClass.
	* @param subscriber - The {@linkcode FnSubReduced} subscriber function or object.
	* @param equals - Function to compare two {@linkcode State}s for equality (optional).
	* @param _id - Unique identifier for the subscriber (optional).
	* @param events - The events list.
	*/
	constructor(subscriber, equals = import_fast_deep_equal.default, _id, events = []) {
		this._id = _id;
		this.#subscriber = subscriber;
		this.#events = events;
		this.#equals = equals;
		this.#state = "active";
	}
	/**
	* Function that returns a reduced function based on the subscriber's logic.
	* @returns A function that reduces the state based on the subscriber's logic.
	*
	* @see {@linkcode isFunction} to check if the subscriber is a function.
	* @see {@linkcode nothing} to provide a default action if no event matches.
	*/
	get #reduceFn() {
		const sub = this.#subscriber;
		if (isFunction(sub)) return fn$7(sub);
		const keys = this.#events;
		return ({ event, ...rest }) => {
			const _else = sub.else ?? nothing;
			const { type, payload } = event;
			for (const key of keys) {
				const check2 = type === key;
				const func = fn$7(sub)[key];
				if (check2 && !!func) return func({
					payload,
					...rest
				});
			}
			return fn$7(_else({
				event,
				...rest
			}));
		};
	}
	get #cannotPerform() {
		return !(this.#state === "active");
	}
	/**
	* Function to handle state changes.
	* @param previous of type {@linkcode State} - Previous state
	* @param next of type {@linkcode State} - Next state
	*
	* @remarks
	* This function checks if the subscriber can perform its action,
	* compares the previous and next states using the provided equality function,
	* and if they are not equal, it calls the subscriber with the next state.
	*/
	fn = (previous, next) => {
		if (this.#cannotPerform) return;
		if (this.#equals(previous, next)) return;
		return this.#reduceFn(next);
	};
	get state() {
		return this.#state;
	}
	close = () => {
		if (this.state !== "disposed") this.#state = "paused";
	};
	open = () => {
		if (this.state !== "disposed") this.#state = "active";
	};
	unsubscribe = () => {
		this.close();
		this.#state = "disposed";
	};
};
/**
* Creates a new instance of SubscriberMapClass.
*
* @param subscriber - The subscriber function that will be called with the {@linkcode State}.
* @param options - Optional parameters for the subscriber, including equality function and ID.
* @param events - List of events of the machine.
* @returns A new instance of {@linkcode SubscriberClass} that manages the subscription state and provides methods to handle state changes and unsubscribe.
*/
var createSubscriber = (subscriber, options, ...events) => {
	return new SubscriberClass(subscriber, options?.equals, options?.id, events);
};
var CommonInterpreter = class {
	__machine;
	get machine() {
		return this.__machine;
	}
	/**
	* The current {@linkcode WorkingStatus} status of the this {@linkcode Interpreter} service.
	*/
	#status = "idle";
	/**
	* The public accessor of initial {@linkcode WorkingStatus} status of the this {@linkcode Interpreter} service.
	*/
	get status() {
		return this.#status;
	}
	__config;
	/**
	* The public accessor of current {@linkcode NodeConfigWithInitials} config state of this {@linkcode Interpreter} service.
	*/
	get config() {
		return this.__config;
	}
	#flat;
	/**
	* The current {@linkcode StateValue}> of this {@linkcode Interpreter} service.
	*/
	__value;
	/**
	* The public accessor of current {@linkcode StateValue}> of this {@linkcode Interpreter} service.
	*/
	get value() {
		return this.__value;
	}
	/**
	* The {@linkcode Mode} of this {@linkcode Interpreter} service
	*/
	__mode;
	/**
	* The initial {@linkcode Node} of the inner {@linkcode Machine}.
	*/
	#initialNode;
	get initialNode() {
		return this.#initialNode;
	}
	/**
	* The current {@linkcode Node} of this {@linkcode Interpreter} service.
	*/
	#node;
	/**
	* The accessor of current {@linkcode Node} of this {@linkcode Interpreter} service.
	*/
	get node() {
		return this.#node;
	}
	/**
	* an iiner ietrator to count the number of operations performed by this {@linkcode Interpreter} service.
	*/
	#iterator = 0;
	/**
	* The current {@linkcode ToEvents} event of this {@linkcode Interpreter} service.
	*/
	#event = transformEventArg(INIT_EVENT);
	/**
	* The initial {@linkcode NodeConfigWithInitials} of the inner {@linkcode Machine}.
	*/
	__initialConfig;
	/**
	* The public accessor of initial {@linkcode NodeConfigWithInitials} of the inner {@linkcode Machine}.
	*/
	get initialConfig() {
		return this.__initialConfig;
	}
	/**
	* The public accessor of initial {@linkcode StateValue} of the inner {@linkcode Machine}.
	*/
	get initialValue() {
		return this.__machine.initialValue;
	}
	/**
	* The initial {@linkcode Pc} private context of this {@linkcode Interpreter} service.
	*/
	__initialPpc;
	/**
	* The initial {@linkcode Tc} context of this {@linkcode Interpreter} service.
	*/
	__initialContext;
	/**
	* The current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
	*/
	__pContext;
	/**
	* The current {@linkcode Tc} context of this {@linkcode Interpreter} service.
	*/
	__context;
	/**
	* The public accessor of current {@linkcode Tc} context of this {@linkcode Interpreter} service.
	*/
	get context() {
		return this.__context;
	}
	/**
	* The previous {@linkcode State} of this {@linkcode Interpreter} service.
	*/
	#previousState;
	/**
	* The current {@linkcode State} of this {@linkcode Interpreter} service.
	*/
	__state;
	/**
	* All {@linkcode AnyInterpreter} service subscribers of this {@linkcode Interpreter} service.
	*/
	__sent = false;
	__exact;
	/**
	* Public getter of the service subscribers of this {@linkcode Interpreter} service.
	*/
	get children() {
		return this.__collectedChildren;
	}
	/**
	* Returns a service subscriber of this {@linkcode Interpreter} service with a specific id.
	* @param id - The id of the service subscriber to get.
	* @return The service subscriber {@linkcode AnyInterpreter} of this {@linkcode Interpreter} service with the specified id, or undefined if not found.
	*
	* @see {@linkcode children} for all children.
	*/
	getChildAt = (id) => this.children.find((f) => f.id === id);
	/**
	* Allias of {@linkcode getChildAt} function.
	*/
	at = this.getChildAt;
	/**
	* Checks if the given value is inside the current state value.
	* @param value - the state value to check if it is inside the current state value.
	* @returns true if the value is inside the current state value, false otherwise.
	*/
	__isInsideValue = (value) => {
		return this.__isInsideValue2(this.__value, value);
	};
	__isInsideValue2 = (sv, value) => {
		if (value === "/") return true;
		const values = decomposeSV(sv);
		const state = replaceAll({
			entry: value.substring(1),
			match: "/",
			replacement: "."
		});
		return values.includes(state);
	};
	__schedulerValue;
	__schedulerContexts;
	__schedulerEvent;
	__schedulerStatus;
	/**
	* The id of the current {@linkcode Interpreter} service.
	* Used for child machines identification.
	*/
	id;
	from;
	/**
	* The accessor of {@linkcode Mode} of this {@linkcode Interpreter} service
	*/
	get mode() {
		return this.__mode;
	}
	/**
	* @deprecated
	* Just use for testing
	* @returns the current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
	* @remarks returns nothing in prod
	*
	* @see {@linkcode context} to get the current context.
	*/
	get _pContext() {
		/* v8 ignore start -- @preserve */
		console.error("pContext is not available in production");
		/* v8 ignore stop -- @preserve */
	}
	get isReady() {
		return this.#status !== "idle" && this.#status !== "stopped";
	}
	/**
	* Select a path from the current {@linkcode Tc} context of this {@linkcode Interpreter} service.
	*
	* @param path, the key to select from the current {@linkcode Tc} context of this {@linkcode Interpreter} service.
	*
	* @returns the value from the path from the current {@linkcode Tc} context of this {@linkcode Interpreter} service.
	*
	* @see {@linkcode getByKey} for retrieving values by key.
	*/
	get select() {
		if (isPrimitive(this.__context)) return void 0;
		const out = (path) => getByKey(this.__state.context, path);
		return out;
	}
	/**
	* @deprecated
	* Select a path from the current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
	*
	* @param path, the key to select from the current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
	*
	* @returns the value from the path from the current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
	*
	* @remarks returns nothing in prod
	*
	* @see {@linkcode getByKey} for retrieving values by key.
	*/
	get _pSelect() {
		/* v8 ignore start -- @preserve */
		console.error("pContext is not available in production");
		/* v8 ignore stop -- @preserve */
	}
	/**
	* @deprecated
	*
	* Used for typings only
	* The accessor of current {@linkcode ToEvents} of this {@linkcode Interpreter} service
	*
	* @remarks Usually for typings
	*/
	get event() {
		return this.#event;
	}
	get eventsMap() {
		return this.__machine.eventsMap;
	}
	/**
	* The accessor of the list of events from the inner {@linkcode Machine}.
	*/
	get eventsList() {
		return this.__machine.eventsList;
	}
	get tags() {
		return getTags(this.__config);
	}
	/**
	* Where everything is initialized
	* @param machine, the {@linkcode Machine} to interpret.
	* @param mode, the {@linkcode Mode} of the interpreter, default is 'strict'.
	* @param exact, whether to use exact intervals or not, default is false.
	*/
	constructor(machine, mode = "strict", exact = true) {
		this.__machine = machine.renew;
		this.__config = this.__initialConfig = this.__machine.initialConfig;
		this.#initialNode = this.#resolveNode(this.__initialConfig);
		this.__mode = mode;
		this.__exact = exact;
		this.__state = this.#previousState = {
			status: this.#status,
			context: this.__context,
			event: {
				type: INIT_EVENT,
				payload: {}
			},
			value: this.__value,
			tags: this.tags
		};
		this.#collectEmitterConfigs();
		this.#collectChildrenConfig();
		this.__throwing();
	}
	/**
	* Changes the current {@linkcode ToEvents} event of this {@linkcode Interpreter} service.
	*
	* @param event - the {@linkcode ToEventsR} event to change the current {@linkcode Interpreter} service state.
	*/
	__changeEvent = (event) => {
		const cb = () => {
			this.__performStates({ event });
			this.#event = event;
		};
		return this.__schedulerEvent.schedule(cb, this.__sent);
	};
	__performAlways = (alway) => {
		this.__changeEvent(transformEventArg(ALWAYS_EVENT));
		const always = toArray(alway);
		return this.__performTransitions(...always);
	};
	get __collectedAlways() {
		const entriesFlat = Object.entries(this.#flat);
		const entries = [];
		entriesFlat.forEach(([from, node]) => {
			const always = node.always;
			if (always) entries.push([from, always]);
		});
		return entries;
	}
	get #collectedActivities() {
		const entriesFlat = Object.entries(this.#flat);
		const entries = [];
		entriesFlat.forEach(([from, { activities }]) => {
			if (activities) entries.push([from, activities]);
		});
		return entries;
	}
	get #currentActivities() {
		const collected = this.#collectedActivities.filter(([from]) => this.__isInsideValue(from));
		if (collected.length < 1) return;
		const ids = [];
		for (const args of collected) ids.push(...this.__executeActivities(...args));
		return this.__cachedIntervals.filter(({ id }) => ids.includes(id));
	}
	#performActivities = () => {
		return this.#currentActivities?.forEach(this.#start);
	};
	/**
	* Pause the collection of all currents {@linkcode Interval2} intervals, related to current {@linkcode ActivityConfig}s of this {@linkcode Interpreter} service.
	*
	*/
	#pauseAllActivities = () => {
		this.__cachedIntervals.forEach(this.#pause);
	};
	/**
	* Used to track number of self transitions
	*/
	__selfTransitionsCounter = 0;
	__collectedPausables = [];
	#startPausables = () => {
		this.__collectedPausables.forEach(({ pausable }) => pausable.start());
	};
	#resumePausables = (filter = () => true) => {
		this.__collectedPausables.filter(filter).forEach(({ pausable }) => pausable.resume());
	};
	#stopPausables = (filter = () => true) => {
		this.__collectedPausables.filter(filter).forEach(({ pausable, id }) => {
			pausable.stop();
			this.__collectedPausables = this.__collectedPausables.filter((f) => f.id !== id);
		});
	};
	#pausePausables = (filter = () => true) => {
		this.__collectedPausables.filter(filter).forEach(({ pausable }) => pausable.pause());
	};
	__collectedEmitterConfigs = [];
	#collectEmitterConfigs = () => {
		const entriesFlat = Object.entries(this.__machine.flat);
		const entries = [];
		entriesFlat.forEach(([from, node]) => {
			const emitters = toArray(Object.entries(node.actors ?? {})).map(([id, actor]) => ({
				...actor,
				id
			})).filter((actor) => "next" in actor);
			if (node.actors) entries.push([from, ...emitters]);
		});
		this.__collectedEmitterConfigs.push(...entries);
		return entries;
	};
	__collectedChildrenConfig = [];
	#collectChildrenConfig = () => {
		const entriesFlat = Object.entries(this.__machine.flat);
		const entries = [];
		entriesFlat.forEach(([from, node]) => {
			const chidlren = toArray(Object.entries(node.actors ?? {})).map(([id, actor]) => ({
				...actor,
				id
			})).filter((actor) => "on" in actor || "contexts" in actor);
			if (node.actors) entries.push([from, ...chidlren]);
		});
		this.__collectedChildrenConfig.push(...entries);
		return entries;
	};
	__collectedChildren = [];
	__startInitialEntries = () => {
		const actions = getEntries(this.__initialConfig);
		if (actions.length < 1) return;
		return this.__performActions(...actions);
	};
	/**
	* @deprecated
	* A mapper function that returns a function to call a method on a value.
	* @param key - the key of the method to be called on the value.
	* @returns a function that calls the method on the value.
	*
	* @see {@linkcode AllowedNames} for more information about allowed names.
	* @see {@linkcode Fn} for more information about function
	*/
	#mapperFn = (key) => {
		return (value) => value[key]();
	};
	#pause = this.#mapperFn("pause");
	#open = this.#mapperFn("open");
	#start = this.#mapperFn("start");
	#close = this.#mapperFn("close");
	#resume = this.#mapperFn("resume");
	#unsubscribe = this.#mapperFn("unsubscribe");
	#stop = this.#mapperFn("stop");
	#dispose = this.#mapperFn("dispose");
	__subscribers = /* @__PURE__ */ new Set();
	#innerSubscribers = /* @__PURE__ */ new Set();
	/**
	* Flushes all subscribers and map subscribers of this {@linkcode Interpreter} service.
	*
	* @see {@linkcode SubscriberClass} for more information about subscribers.
	* @see {@linkcode SubscriberClass} for more information about map subscribers.
	*/
	__flush = () => {
		[...this.#innerSubscribers, ...this.__subscribers].forEach(({ fn }) => fn(this.#previousState, this.__state));
	};
	/**
	* All actions that are currently scheduled to be performed.
	* @returns an array of {@linkcode Timeout2} that are currently scheduled to be performed.
	*/
	__timeoutActions = [];
	#startChildren = () => {
		this.__collectedChildren.forEach(({ service }) => {
			service.start();
		});
	};
	#pauseChildren = (filter = () => true) => {
		this.__collectedChildren.filter(filter).forEach(({ service }) => service.pause());
	};
	#stopChildren = (filter = () => true) => {
		this.__collectedChildren.filter(filter).forEach(({ service, id }) => {
			service.stop();
			this.__collectedChildren.filter((f) => f.id === id).forEach(({ service }) => service.dispose());
			this.__collectedChildren = this.__collectedChildren.filter((f) => f.id !== id);
		});
	};
	#resumeChildren = (filter = () => true) => {
		this.__collectedChildren.filter(filter).forEach(({ service }) => service.resume());
	};
	/**
	* Helper to format inner errors and warnings.
	* @param messages - an iterable of messages to format.
	* @returns an array of messages joined by new line.
	*
	* @remarks Used to display console messages in a readable format.
	*/
	#displayConsole = (messages) => {
		return Array.from(messages).join("\n");
	};
	/**
	* Use to manage internal errors and warnings.
	*/
	__throwing = () => {
		if (this.__mode === "strict") {
			if (this.#warningsCollector.size > 0) {
				const warnings = this.#displayConsole(this.#warningsCollector);
				console.log(warnings);
			}
			if (this.#errorsCollector.size > 0) {
				const errors = this.#displayConsole(this.#errorsCollector);
				throw new Error(errors);
			}
		} else {
			if (this.#errorsCollector.size > 0) {
				const errors = this.#displayConsole(this.#errorsCollector);
				console.error(errors);
			}
			if (this.#warningsCollector.size > 0) {
				const warnings = this.#displayConsole(this.#warningsCollector);
				console.log(warnings);
			}
		}
	};
	start = () => {
		this.__setStatus("starting");
		this.__collectChildren();
		this.__collectPausables();
		this.__throwing();
		this.__setStatus("started");
		this.#startPausables();
		this.__flush();
		this.__startInitialEntries();
		this.#startChildren();
		this.__throwing();
		this._next();
	};
	/**
	* Assign the current {@linkcode State} and the previous {@linkcode State} of the {@linkcode Interpreter} service and flush all subscribers.
	* @param parts, Partial {@linkcode State}
	*
	* @see {@linkcode SubscriberClass}
	* @see {@linkcode SubscriberClass}
	*/
	__performStates = (parts) => {
		this.#previousState = (0, import_clone_deep.default)(this.__state);
		this.__state = {
			...this.__state,
			...parts
		};
		if (!(0, import_fast_deep_equal.default)(this.#previousState, this.__state)) this.__flush();
	};
	__setStatus = (status) => {
		const cb = () => {
			this.__performStates({ status });
			return this.#status = status;
		};
		return this.__schedulerStatus.schedule(cb, this.__sent);
	};
	get #schedulers() {
		return [
			this.__schedulerValue,
			this.__schedulerContexts,
			this.__schedulerEvent,
			this.__schedulerStatus
		];
	}
	#stopSchedulers = () => {
		this.#schedulers.forEach(this.#stop);
	};
	pause = () => {
		this.__setStatus("busy");
		this.#pauseAllActivities();
		this.#pauseChildren();
		this.#pausePausables();
		this.__timeoutActions.forEach(this.#pause);
		this.__setStatus("paused");
		this.__subscribers.forEach(this.#close);
	};
	resume = () => {
		if (this.#status === "paused") {
			this.#performActivities();
			this.__setStatus("busy");
			this.__subscribers.forEach(this.#open);
			this.__timeoutActions.forEach(this.#resume);
			this.#resumeChildren();
			this.#resumePausables();
			this.__setStatus("working");
		}
	};
	stop = () => {
		this.__setStatus("busy");
		this.#pauseAllActivities();
		this.__cachedIntervals.forEach(this.#dispose);
		this.__timeoutActions.forEach(this.#dispose);
		this.#stopPausables();
		this.#stopChildren();
		this.__setStatus("stopped");
		this.__subscribers.forEach(this.#close);
		this.__subscribers.forEach(this.#unsubscribe);
		this.#stopSchedulers();
	};
	/**
	* @deprecated
	* Used internally
	*/
	_provideContext = (context) => {
		this.__initialContext = this.__context = context;
		this.__performStates({ context });
		this.__machine.addContext(this.__initialContext);
		return this.__machine;
	};
	/**
	* Add options to the inner {@linkcode Machine} of this {@linkcode Interpreter} service.
	*/
	addOptions(helper) {
		this.__machine = this.__machine.provideOptions(helper);
		return this.__machine.options;
	}
	/**
	* Provides options for the interpreter and returns a new interpreter instance.
	*
	* @param helper a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	* @returns a new interpreter instance with the provided options applied.
	*/
	provideOptions(helper) {
		const out = this.renew;
		out.addOptions(helper);
		return out;
	}
	subscribe = (_subscriber, options) => {
		const events = this.__machine.eventsList;
		const id = options?.id;
		const find = id ? Array.from(this.__subscribers).find((f) => f.id === id) : void 0;
		if (find) return find;
		const subscriber = createSubscriber(_subscriber, options, ...events);
		this.__subscribers.add(subscriber);
		return subscriber;
	};
	__subscribe = (_subscriber, options) => {
		const events = this.__machine.eventsList;
		const subscriber = createSubscriber(_subscriber, options, ...events);
		this.#innerSubscribers.add(subscriber);
		return subscriber;
	};
	get state() {
		return Object.freeze((0, import_clone_deep.default)(this.__state));
	}
	#errorsCollector = /* @__PURE__ */ new Set();
	#warningsCollector = /* @__PURE__ */ new Set();
	/**
	* @deprecated
	* Just use for testing
	* @remarks returns nothing in prod
	*/
	get _errorsCollector() {
		/* v8 ignore start -- @preserve */
		console.error("errorsCollector is not available in production");
		/* v8 ignore stop -- @preserve */
	}
	/**
	* @deprecated
	* Just use for testing
	* @remarks returns nothing in prod
	*/
	get _warningsCollector() {
		/* v8 ignore start -- @preserve */
		console.error("warningsCollector is not available in production");
		/* v8 ignore stop -- @preserve */
	}
	_addError = (...errors) => {
		errors.forEach((error) => this.#errorsCollector.add(error));
	};
	_addWarning = (...warnings) => {
		warnings.forEach((warning) => this.#warningsCollector.add(warning));
	};
	__extractTransitions = (event) => {
		const entriesFlat = Object.entries(this.#flat);
		const flat = [];
		const flat2 = [];
		const type = event.type;
		entriesFlat.forEach(([from, node]) => {
			const trs = node.on?.[type];
			if (trs) {
				const transitions = toArray.typed(trs);
				flat.push([from, transitions]);
			}
		});
		flat.forEach(([from, transitions], _, all) => {
			if (all.every(([from2]) => !from2.startsWith(`${from}/`))) flat2.push([from, transitions]);
		});
		flat2.sort((a, b) => {
			const from1 = a[0];
			const from2 = b[0];
			const split1 = from1.split("/").filter((val) => !isStringEmpty(val)).length;
			const split2 = from2.split("/").filter((val) => !isStringEmpty(val)).length;
			if (split1 !== split2) return split2 - split1;
			return from2.localeCompare(from1);
		});
		return flat2;
	};
	get #possibleEvents() {
		return possibleEvents(this.#flat);
	}
	#cannotPerformEvents = (_event) => {
		const type = eventToType(_event);
		return !this.#possibleEvents.includes(type);
	};
	/**
	* Creates a sender function for the given event type.
	* @param type - the {@linkcode EventArgT} type of the event to send.
	* @returns a function with the payload as Parameter that sends the event with the given type and payload.
	*
	* @see {@linkcode send} for sending events directly.
	*/
	sender = (type) => {
		return (...data) => {
			const event = {
				type,
				payload: data.length === 1 ? data[0] : {}
			};
			return this.send(event);
		};
	};
	/**
	* Resolves a {@linkcode Node} from the given {@linkcode NodeConfigWithInitials} configuration.
	*
	* @param config of type {@linkcode NodeConfigWithInitials}, the configuration to resolve.
	*
	* @returns a {@linkcode Node} resolved from the configuration.
	*
	* @see {@linkcode resolveNode} for the actual resolution logic.
	* @see {@linkcode E}
	* @see {@linkcode P}
	* @see {@linkcode Pc}
	* @see {@linkcode Tc}
	*/
	#resolveNode = (config) => {
		const options = this.__machine.options;
		const events = this.__machine.eventsList;
		return resolveNode(config, options, ...events);
	};
	/**
	* Set the current {@linkcode Mode} of this {@linkcode Interpreter} service to 'strict'.
	* In this mode, all errors are thrown and warnings are logged to the console.
	*/
	makeStrict = () => this.__mode = "strict";
	/**
	* Set the current {@linkcode Mode} of this {@linkcode Interpreter} service to 'normal'.
	* In this mode, errors are logged to the console, but not thrown.
	*/
	makeNormal = () => this.__mode = "normal";
	/**
	* Performs computations, after transitioning to the next target, to update the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode CommonInterpreter} service
	*/
	_performConfig = () => {
		const value = nodeToValue(this.__config);
		const cb = () => {
			this.__value = value;
		};
		this.__schedulerValue.schedule(cb, this.__sent);
		this.#node = this.#resolveNode(this.__config);
		const configForFlat = fn$7(this.__config);
		this.#flat = flatMap.low(configForFlat, true);
	};
	/**
	* Proposes the next state value based on the current state value and the target.
	* @param target - the target state to propose the next state value.
	* @returns the next {@linkcode StateValue} based on the current state value and the target.
	*
	* @remarks
	* This method calculates the next state value based on the current state value and the target.
	* It does not change the current state value, but returns the proposed next state value.
	* It is used internally to calculate the next state value before sending an event.
	*/
	#proposedNextSV = (target) => nextSV(this.__value, target);
	/**
	* Proposes the next configuration based on the current state value and the target.
	* @param target - the target state to propose the next configuration.
	* @returns the proposed next {@linkcode NodeConfigWithInitials} based on the current state value and the target.
	*
	* @remarks
	* Only proposes next config, does not change the current config.
	*
	* //
	*
	//  * @see {@linkcode Machine.valueToConfig} for more details.
	*
	* //
	*/
	proposedNextConfig = (target) => {
		const nextValue = this.#proposedNextSV(target);
		return this.__machine.valueToConfig(nextValue);
	};
	get __currentActivities() {
		const collected = this.#collectedActivities.filter(([from]) => this.__isInsideValue(from));
		const ids = [];
		for (const args of collected) ids.push(...this.__executeActivities(...args));
		return this.__cachedIntervals.filter(({ id }) => ids.includes(id));
	}
	__performPauseActivityAction = (id) => {
		if (!id) return;
		this.__currentActivities?.filter((f) => f.id === id).forEach(this.#pause);
	};
	__performResumeActivityAction = (id) => {
		if (!id) return;
		this.__currentActivities?.filter((f) => f.id === id).forEach(this.#resume);
	};
	__performStopActivityAction = (id) => {
		if (!id) return;
		this.__currentActivities?.filter((f) => f.id === id).forEach(this.#dispose);
	};
	__performPauseTimerAction = (id) => {
		if (!id) return;
		this.__timeoutActions.filter((f) => f.id === id).forEach(this.#pause);
	};
	__performResumeTimerAction = (id) => {
		if (!id) return;
		this.__timeoutActions.filter((f) => f.id === id).forEach(this.#resume);
	};
	__performStopTimerAction = (id) => {
		if (!id) return;
		this.__timeoutActions.filter((f) => f.id === id).forEach(this.#dispose);
	};
	/**
	* Calculates the difference between the current and next configuration.
	* @param target - the target state to calculate the difference.
	* @returns an {@linkcode DiffNext} object containing the proposed next state value, entry actions, and exit actions.
	*
	* @remarks
	* This method is used to calculate the entry and exit actions when transitioning to a new state.
	* It compares the current configuration with the proposed next configuration and returns the differences.
	*/
	__diffNext = (target) => {
		if (!target) return {
			sv: this.__value,
			diffEntries: [],
			diffExits: []
		};
		const next = initialConfig(this.proposedNextConfig(target));
		const flatNext = flatMap.low(next);
		const entriesCurrent = Object.entries(this.#flat);
		const keysNext = Object.keys(flatNext);
		const keys = entriesCurrent.map(([key]) => key);
		const diffEntries = [];
		const diffExits = [];
		keysNext.forEach((key) => {
			if (!keys.includes(key)) {
				const out2 = flatNext[key];
				const _entries = getEntries(out2);
				diffEntries.push(..._entries);
			}
		});
		entriesCurrent.forEach(([key, node]) => {
			if (!keysNext.includes(key)) {
				const _exits = getExits(node);
				diffExits.push(..._exits);
			}
		});
		return {
			sv: this.#proposedNextSV(target),
			diffEntries,
			diffExits
		};
	};
	/**
	* Performs all self transitions and activities of this {@linkcode Interpreter} service.
	*/
	__preNext = () => {
		const filter = ({ from, id }, _, all) => {
			const isOutside = !this.__isInsideValue(from);
			const hasSiblingsWithSameId = all.filter((val) => val.from !== from).map(({ id }) => id).includes(id);
			if (isOutside && hasSiblingsWithSameId) return false;
			return isOutside;
		};
		this.__collectChildren();
		this.__collectPausables();
		this.__selfTransitionsCounter++;
		this.#pauseAllActivities();
		this.#performActivities();
		this.#stopPausables(filter);
		this.#pausePausables(({ from }) => this.__isInsideValue(from));
		this.#pauseChildren(({ from }) => this.__isInsideValue(from));
		this.#stopChildren(filter);
		this.#startChildren();
		this.#resumeChildren(({ from }) => !this.__isInsideValue(from));
		this.#startPausables();
		this.#resumePausables(({ from }) => this.__isInsideValue(from));
		return this.__performSelfTransitions();
	};
	__throwMaxCounter() {
		throw `Too much self transitions, exceeded 100 transitions`;
	}
	/**
	* Performs computations, to update the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode Interpreter} service
	* @param target, the target to perform the config for.
	*/
	__performConfig = (target) => {
		if (target === true) {
			this._performConfig();
			const value = this.__value;
			const tags = this.tags;
			return this.__performStates({
				value,
				tags
			});
		}
		/* v8 ignore else -- @preserve */
		if (target) {
			this.__config = initialConfig(this.proposedNextConfig(target));
			const tags = this.tags;
			this._performConfig();
			const value = this.__value;
			return this.__performStates({
				tags,
				value
			});
		}
	};
	_iterate = () => this.#iterator++;
	/**
	* Sends an event to the current {@linkcode Interpreter} service.
	*
	* @param _event - the {@linkcode EventArg} event to send.
	*
	* @remarks
	* If the event cannot be performed, it will not be sent.
	* If the event is sent, it will be processed and the state will be updated.
	*/
	send = (_event) => {
		if (this.#cannotPerformEvents(_event)) return;
		return this.__send(_event);
	};
	__performSendToAction = (sentEvent) => {
		if (!sentEvent) return;
		return this.__sendTo(sentEvent.to, sentEvent.event);
	};
	__performResendAction = (resend) => {
		if (!resend) return;
		if (this.#cannotPerformEvents(resend)) return;
		return this.send(resend);
	};
	get __cloneState() {
		return {
			pContext: (0, import_clone_deep.default)(this.__pContext),
			...structuredClone(this.__state)
		};
	}
	__mergeContexts = (result) => {
		const cb = () => {
			this.__pContext = merge(this.__pContext, fn$7(result?.pContext));
			const context = merge(this.__context, fn$7(result?.context));
			this.__context = context;
			return this.__performStates({ context });
		};
		return this.__schedulerContexts.schedule(cb, this.__sent);
	};
	__performScheduledAction = (scheduled) => {
		if (!scheduled) return;
		const { data, ms: timeout, id } = scheduled;
		const callback = () => this.__mergeContexts(data);
		this.__timeoutActions.filter((f) => f.id === id).forEach(this.#dispose);
		this.__timeoutActions = this.__timeoutActions.filter((f) => f.id !== id);
		const timer = createTimeout({
			callback,
			timeout,
			id
		});
		this.__timeoutActions.push(timer);
		timer.start();
	};
	createInterval = ({ callback, id, interval }) => {
		const exact = this.__exact;
		return createInterval({
			callback,
			id,
			interval,
			exact
		});
	};
	/**
	* Collection of all currents {@linkcode Interval2} intervals, related to current {@linkcode ActivityConfig}s of this {@linkcode Interpreter} service.
	*/
	__cachedIntervals = [];
	get #sending() {
		return this.#status === "sending";
	}
	/**
	* Checks if sent events cannot be performed.
	* @param from - the config value from which the events are sent.
	* @returns true if the events cannot be performed, false otherwise.
	*/
	__cannotPerform = (from) => {
		return this.#sending || !this.__isInsideValue(from);
	};
	/**
	* Returns the output value with a warning if it is not defined.
	* @param out of type [T], the output value to check if it is defined.
	* @param messages - the messages to add to the warnings collector if the output is not defined. it's a parram array
	*/
	#returnWithWarning = (out, ...messages) => {
		if (fn$6(out)) return out;
		this._addWarning(...messages);
	};
	/**
	* @deprecated
	* Used internally
	*/
	_providePrivateContext = (pContext) => {
		this.__initialPpc = this.__pContext = pContext;
		this.__machine.addPrivateContext(this.__initialPpc);
		return this.__machine;
	};
	/**
	* @deprecated
	* Used internally
	*
	* Alias of {@linkcode _providePrivateContext}
	*/
	_ppC = this._providePrivateContext;
	toActionFn = (action) => {
		const events = this.__machine.eventsList;
		const actions = this.__machine.actions;
		return this.#returnWithWarning(toAction(action, actions, ...events), `Action (${reduceDescriber(action)}) is not defined`);
	};
	toPredicateFn = (guard) => {
		const events = this.__machine.eventsList;
		const guards = this.__machine.guards;
		const { predicate, errors } = toPredicate(guard, guards, ...events);
		return this.#returnWithWarning(predicate, ...errors);
	};
	toDelayFn = (delay) => {
		const events = this.__machine.eventsList;
		const delays = this.__machine.delays;
		return this.#returnWithWarning(toDelay(delay, delays, ...events), `Delay (${delay}) is not defined`);
	};
	toChildFn = (machine) => {
		const events = this.__machine.eventsList;
		const machines = this.__machine.children;
		return this.#returnWithWarning(toChildSrc(machine, machines, ...events), `Machine (${reduceDescriber(machine)}) is not defined`);
	};
	toEmitterSrc = (emitter) => {
		const emitters = this.__machine.emitters;
		return this.#returnWithWarning(toEmitterSrc(emitter, emitters), `Emitter (${reduceDescriber(emitter)}) is not defined`);
	};
	dispose = () => {
		this.stop();
		this.__timeoutActions.forEach(this.#dispose);
	};
	[Symbol.dispose] = this.dispose;
	[Symbol.asyncDispose] = () => {
		return asyncfy(this[Symbol.dispose])();
	};
};
/**
* The `Interpreter` class is responsible for interpreting and managing the state of a machine.
* It provides methods to start, stop, pause, and resume the machine, as well as to send events
* and subscribe to state changes.
*
* @template : type {@linkcode AsyncConfig} [C] - The configuration type of the machine.
* @template : [Pc] - The private context type, which can be any type.
* @template : type {@linkcode types} [Tc] - The context type.
* @template : type {@linkcode EventsMap} [E] - The events map type, which maps event names to their
* @template : type {@linkcode PromiseeMap} [P] - The promisees map type, which maps promise names to their
* @template Mo : type {@linkcode SimpleMachineOptions2} - The machine options type, which includes various configurations for the machine. Default to {@linkcode SimpleMachineOptions2}.
*
* @implements : {@linkcode AnyInterpreter}
*
* @remarks
* The `Interpreter` class is a core component of the state machine implementation,
* allowing for the execution of state transitions, handling of events, and management of the machine's lifecycle.
* It supports various modes of operation, including strict and normal modes,
* and provides mechanisms for error and warning handling.
* * It also allows for the execution of actions, guards, and delays,
* * as well as the management of child interpreters and scheduled tasks.
*
* @see {@linkcode GetEventsFromConfig} for extracting events from the machine configuration.
*/
var AsyncInterpreter = class AsyncInterpreter extends CommonInterpreter {
	TYPE = "async";
	/**
	* @deprecated Use the `machine` getter instead to access the inner machine of this interpreter.
	*
	* The {@linkcode AsyncMachine} machine being interpreted.
	*/
	get machine() {
		return super.machine;
	}
	/**
	* Create a new {@linkcode AsyncInterpreter} instance with the same initial configuration as this instance.
	*/
	get renew() {
		const out = new AsyncInterpreter(this.machine, this.__mode, this.__exact);
		out._ppC(this.__initialPpc);
		out._provideContext(this.__initialContext);
		return out;
	}
	#initSchedulers = () => {
		this.__schedulerContexts = createScheduler();
		this.__schedulerValue = createScheduler();
		this.__schedulerEvent = createScheduler();
		this.__schedulerStatus = createScheduler();
	};
	/**
	* Where everything is initialized
	* @param machine, the {@linkcode AsyncMachine} to interpret.
	* @param mode, the {@linkcode Mode} of the interpreter, default is 'strict'.
	* @param exact, whether to use exact intervals or not, default is false.
	*/
	constructor(machine, mode = "strict", exact = true) {
		super(machine, mode, exact);
		this.#initSchedulers();
		this.__performConfig(true);
	}
	/**
	* Performs all self transitions and activities of this {@linkcode AsyncInterpreter} service.
	* @remarks Throw if the number of self transitions exceeds {@linkcode DEFAULT_MAX_SELF_TRANSITIONS}.
	*/
	_next = async () => {
		let check = false;
		do {
			const startTime = Date.now();
			const previousValue = this.__value;
			if (this.__selfTransitionsCounter >= 100) return this.__throwMaxCounter();
			this.__throwing();
			await this.__preNext();
			const currentValue = this.__value;
			check = !(0, import_fast_deep_equal.default)(previousValue, currentValue);
			if (check) this.__flush();
			if (Date.now() - startTime > 20) this.__selfTransitionsCounter = 0;
		} while (check);
		this.__selfTransitionsCounter = 0;
	};
	__performAction = (action) => {
		this._iterate();
		return withTimeout(async () => action(this.__cloneState), "Action timed out", ...this.longRuns ? [] : [DEFAULT_MAX_TIME_PROMISE])();
	};
	/**
	* Force transition to performs inner actions despite the current state.
	* This is useful for sending events that are not part of the current state transitions.
	* @param transitions, the transitions to perform.
	* @returns the result of the transitions.
	*
	* @see {@linkcode TransitionConfig} for more information about transitions.
	*/
	__performForceSendAction = async (from, forceSend) => {
		if (!forceSend) return;
		const values = Object.values(this.machine.flat);
		for (const { on } of values) {
			const type = eventToType(forceSend);
			const transitions = toArray.typed(on?.[type]);
			await this.__performTransitions(from, ...transitions);
		}
	};
	__performsExtendedActions = async (from, { forceSend, resend, scheduled, pauseActivity, resumeActivity, stopActivity, pauseTimer, resumeTimer, stopTimer, sentEvent }) => {
		this.__performSendToAction(sentEvent);
		this.__performScheduledAction(scheduled);
		this.__performPauseActivityAction(pauseActivity);
		this.__performResumeActivityAction(resumeActivity);
		this.__performStopActivityAction(stopActivity);
		this.__performPauseTimerAction(pauseTimer);
		this.__performResumeTimerAction(resumeTimer);
		this.__performStopTimerAction(stopTimer);
		return await this.__performForceSendAction(from, forceSend) ?? await this.__performResendAction(resend);
	};
	__executeAction = async (from, action) => {
		this.__setStatus("busy");
		const { pContext, context, ...extendeds } = await this.__performAction(action);
		if (from !== false && this.__cannotPerform(from)) return;
		this.__mergeContexts({
			pContext,
			context
		});
		await this.__performsExtendedActions(from, extendeds);
	};
	__performActions = async (from, ...actions) => {
		const fns = actions.map(this.toActionFn).filter((f) => f !== void 0);
		for (const fn of fns) {
			await this.__executeAction(from, fn);
			if (from !== false && this.__cannotPerform(from)) break;
		}
	};
	#performPredicate = (predicate) => {
		this._iterate();
		return predicate(this.__cloneState);
	};
	#executePredicate = (predicate) => {
		this.__setStatus("busy");
		const out = this.#performPredicate(predicate);
		this.__setStatus("working");
		return out;
	};
	toPredicateFn = (guard) => {
		const events = this.__machine.eventsList;
		const guards = this.__machine.guards;
		const { predicate, errors } = toPredicate.async(guard, guards, ...events);
		if (fn$6(predicate)) return predicate;
		this._addWarning(...errors);
	};
	#performPredicates = async (...guards) => {
		if (guards.length < 1) return true;
		const predicates = guards.map(this.toPredicateFn).filter(fn$6);
		for (const predicate of predicates) if (!await this.#executePredicate(predicate)) return false;
		return true;
	};
	#performDelay = (delay) => {
		this._iterate();
		return delay(this.__cloneState);
	};
	#executeDelay = (delay) => {
		this.__setStatus("busy");
		const out = this.#performDelay(delay);
		this.__setStatus("started");
		return out;
	};
	__executeActivities = (from, _activities) => {
		const entries = Object.entries(_activities);
		const outs = [];
		for (const [_delay, _activity] of entries) {
			const id = `${from}::${_delay}`;
			let index = -1;
			const _interval = this.__cachedIntervals.find((f, i) => {
				const check = f.id === id;
				if (check) index = i;
				return check;
			});
			const buildCallback = () => {
				const delayF = this.toDelayFn(_delay);
				if (!fn$6(delayF)) return;
				const interval = this.#executeDelay(delayF);
				if (interval < 10) {
					this._addWarning(`Delay (${_delay}) is too short`);
					return;
				}
				if (interval > 6e5) {
					this._addWarning(`Delay (${_delay}) is too long`);
					return;
				}
				const activities = toArray.typed(_activity);
				const callback = async () => {
					for (const activity of activities) {
						const check2 = typeof activity === "string";
						const check3 = isDescriber(activity);
						if (check2 || check3) {
							await this.__performActions(from, activity);
							continue;
						}
						if (await this.#performPredicates(...toArray.typed(activity.guards))) {
							const actions = toArray.typed(activity.actions);
							await this.__performActions(from, ...actions);
						}
					}
				};
				const promise = this.createInterval({
					callback,
					interval,
					id
				});
				this.__cachedIntervals.push(promise);
				return id;
			};
			if (_interval) {
				if (_interval.state === "idle" || _interval.state === "paused") {
					this.__cachedIntervals.splice(index, 1);
					const result = buildCallback();
					if (!result) return [];
					outs.push(result);
				} else outs.push(id);
				continue;
			}
			const result = buildCallback();
			if (!result) return [];
			outs.push(result);
		}
		return outs;
	};
	__startInitialEntries = () => {
		const actions = getEntries(this.__initialConfig);
		if (actions.length < 1) return;
		return this.__performActions(false, ...actions);
	};
	__performTransition = async (from, transition) => {
		if (typeof transition == "string") {
			const { diffEntries, diffExits } = this.__diffNext(transition);
			await this.__performActions(from, ...toArray.typed(diffExits));
			await this.__performActions(from, ...toArray.typed(diffEntries));
			return transition;
		}
		const { guards, actions, target } = transition;
		const { diffEntries, diffExits } = this.__diffNext(target);
		if (await this.#performPredicates(...toArray(guards))) {
			await this.__performActions(from, ...toArray.typed(diffExits));
			await this.__performActions(from, ...toArray.typed(actions));
			await this.__performActions(from, ...toArray.typed(diffEntries));
			return target ?? false;
		}
		return false;
	};
	__performTransitions = async (from, ...transitions) => {
		for (const _transition of transitions) {
			const transition = await this.__performTransition(from, _transition);
			if (typeof transition === "string") return transition;
		}
		return false;
	};
	__performFinally = async (from, _finally) => {
		if (_finally === void 0) return;
		const finals = toArray.typed(_finally);
		for (const final of finals) {
			const check2 = typeof final === "string";
			const check3 = isDescriber(final);
			if (check2 || check3) {
				await this.__performActions(from, final);
				continue;
			}
			/* v8 ignore else -- @preserve */
			if (await this.#performPredicates(...toArray.typed(final.guards))) return this.__performActions(from, ...toArray.typed(final.actions));
		}
	};
	get #machine() {
		return this.__machine;
	}
	get longRuns() {
		return this.#machine.longRuns;
	}
	#performAfter = (from, after) => {
		const entries = Object.entries(after);
		const promises = [];
		entries.forEach(([_delay, transition]) => {
			const delayF = this.toDelayFn(_delay);
			if (!fn$6(delayF)) return;
			const delay = this.#executeDelay(delayF);
			if (delay > 6e5) {
				this._addWarning(`Delay ${_delay} is too long`);
				return;
			}
			const transitions = toArray.typed(transition);
			const _promise = async () => {
				await sleep(delay);
				if (this.__cannotPerform(from)) return false;
				const func = () => this.__performTransitions(from, ...transitions);
				const out = await func();
				if (out === false) throw `No transitions reached from "${from}" by delay "${_delay}" !`;
				return out;
			};
			const promise = withTimeout(_promise, from, ...this.longRuns ? [] : [DEFAULT_MAX_TIME_PROMISE]);
			promises.push(promise);
		});
		if (promises.length < 1) return;
		return anyPromises(from, ...promises);
	};
	get #flat() {
		return this.machine.flat;
	}
	#performAlways = (from, alway) => {
		this.__changeEvent(transformEventArg(ALWAYS_EVENT));
		const always = toArray(alway);
		return this.__performTransitions(from, ...always);
	};
	get #collectedAfters() {
		const entriesFlat = Object.entries(this.#flat);
		const entries = [];
		entriesFlat.forEach(([from, node]) => {
			const after = node.after;
			if (after) entries.push([from, after]);
		});
		return entries;
	}
	/**
	* Get all brut self transitions of the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode AsyncInterpreter} service.
	*/
	get __collectedSelfTransitions0() {
		const entries = /* @__PURE__ */ new Map();
		this.__collectedAlways.forEach(([from, always]) => {
			entries.set(from, { always: () => this.#performAlways(from, always) });
		});
		this.#collectedAfters.forEach(([from, after]) => {
			const inner = entries.get(from);
			if (inner) inner.after = this.#performAfter(from, after);
			else entries.set(from, { after: this.#performAfter(from, after) });
		});
		return entries;
	}
	get __collectedSelfTransitions() {
		const out = Array.from(this.__collectedSelfTransitions0).filter(([from]) => this.__isInsideValue(from)).map(([from, { after, always }]) => {
			const promise = async () => {
				if (always) {
					const target = await always();
					if (target !== false) return this.__performConfig(target);
				}
				if (after) {
					const _after = async () => {
						await after().then((transition) => {
							if (transition !== false) return this.__performConfig(transition);
						}).catch(() => this._addWarning(`${from}::after - No transitions reached!`));
					};
					await _after();
				}
			};
			return withTimeout(promise, "self-transition");
		});
		if (out.length < 1) return;
		return anyPromises("self-transition", ...out);
	}
	__collectPausables = () => {
		return this.__collectedEmitterConfigs.filter(([from]) => this.__isInsideValue(from)).filter(([from]) => {
			return !this.__collectedPausables.map(({ from }) => from).includes(from);
		}).map(([from, ..._emitters]) => {
			return [from, ..._emitters.map(({ id, ...rest }) => {
				return {
					emitterFn: this.toEmitterSrc(id),
					...rest,
					id
				};
			}).filter(({ emitterFn }) => !!emitterFn)];
		}).map(([from, ...emitters]) => {
			const pausables = emitters.map(({ emitterFn, error, next, complete, id }) => {
				const pausable = emitterFn(this.__cloneState);
				pausable.subscribe({
					next: (payload) => {
						const event = {
							type: `${id}::next`,
							payload
						};
						this.__changeEvent(fn$7(event));
						const transitions = toArray(next);
						this.__performTransitions(from, ...transitions);
					},
					error: (payload) => {
						const event = {
							type: `${id}::error`,
							payload
						};
						this.__changeEvent(fn$7(event));
						const transitions = toArray(error);
						this.__performTransitions(from, ...transitions);
					},
					complete: () => this.__performFinally(from, complete)
				});
				return {
					pausable,
					id,
					from
				};
			});
			this.__collectedPausables.push(...pausables);
			return pausables;
		}).flat();
	};
	__performSelfTransitions = async () => {
		this.__setStatus("busy");
		const previousState = structuredClone(this.__state);
		await this.__collectedSelfTransitions?.();
		if (!(0, import_fast_deep_equal.default)(previousState, structuredClone(this.__state))) this.__flush();
		this.__setStatus("working");
	};
	/**
	* Add options to the inner {@linkcode AsyncMachine} of this {@linkcode AsyncInterpreter} service.
	*/
	addOptions = (helper) => {
		return super.addOptions(helper);
	};
	/**
	* Provides options for the interpreter and returns a new interpreter instance.
	*
	* @param option a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	* @returns a new interpreter instance with the provided options applied.
	*/
	provideOptions = (option) => {
		return super.provideOptions(option);
	};
	__presend = async (event) => {
		this.__sent = true;
		this.__changeEvent(event);
		this.__setStatus("sending");
		let sv = structuredClone(this.__value);
		const flat2 = this.__extractTransitions(event);
		for (const [from, transitions] of flat2) {
			const target = await this.__performTransitions(from, ...toArray.typed(transitions));
			sv = nextSV(sv, target === false ? void 0 : target);
		}
		const next = switchV({
			condition: (0, import_fast_deep_equal.default)(this.__value, sv),
			truthy: void 0,
			falsy: initialConfig(this.machine.valueToConfig(sv))
		});
		this.__sent = false;
		return next;
	};
	/**
	* Sends an event without cheching to the current {@linkcode AsyncInterpreter} service.
	*
	* @param _event - the {@linkcode EventArg} event to send.
	*
	*/
	__send = async (_event) => {
		const event = transformEventArg(_event);
		const next = await this.__presend(event);
		if (fn$6(next)) {
			this.__config = next;
			this.__performConfig(true);
			this.__setStatus("working");
			return this._next();
		} else return this.__setStatus("working");
	};
	__collectChildren = () => {
		return this.__collectedChildrenConfig.filter(([from]) => this.__isInsideValue(from)).filter(([from]) => {
			return !this.__collectedChildren.map(({ from }) => from).includes(from);
		}).map(([from, ..._children]) => {
			return [from, ..._children.map(({ id, ...rest }) => {
				return {
					childFn: this.toChildFn(id),
					...rest,
					id
				};
			}).filter(({ childFn }) => !!childFn)];
		}).map(([from, ..._children]) => {
			return [from, ..._children.map(({ childFn, ...rest }) => {
				return {
					service: this.#executeChild(childFn),
					...rest
				};
			})];
		}).map(([from, ..._services]) => {
			const services = _services.map(({ service, on, contexts, id }) => {
				const si = service;
				if (on !== void 0 && Object.keys(on).length > 0) si.__subscribe((payload) => {
					const type = eventToType(payload.event);
					const event = {
						type: `${id}::on::${type}`,
						payload
					};
					this.__changeEvent(fn$7(event));
					const transitions = toArray(on?.[type]);
					return this.__performTransitions(from, ...transitions);
				}, {
					equals: (a, b) => a.event.type === b.event.type,
					id: `${id}::on`
				});
				if (contexts !== void 0 && Object.keys(contexts).length > 0) si.__subscribe(({ context }) => {
					Object.entries(contexts).forEach(([key, path]) => {
						const pContext = key === "." ? structuredClone(context) : getByKey.low(context, key);
						if (path === ".") return this.__mergeContexts({ pContext });
						return this.__mergeContexts(recompose({ [`pContext.${path}`]: pContext }));
					});
				}, {
					equals: (a, b) => {
						const ac = a.context;
						const bc = b.context;
						if ((0, import_fast_deep_equal.default)(ac, bc)) return true;
						const keys = Object.keys(contexts);
						for (const key of keys) {
							if (key === ".") return (0, import_fast_deep_equal.default)(ac, bc);
							if (!(0, import_fast_deep_equal.default)(getByKey.low(ac, key), getByKey.low(bc, key))) return false;
						}
						return true;
					},
					id: `${id}::contexts`
				});
				return {
					service: si,
					id,
					from
				};
			});
			this.__collectedChildren.push(...services);
			return services;
		});
	};
	#executeChild = (child) => {
		return child(this.__cloneState);
	};
	/**
	* Sends an event to a specific child service by its ID.
	*
	* @param to - The ID of the child service to which the event will be sent.
	* @param : the {@linkcode EventObject} event to send to the child service.
	*
	* @see {@linkcode send} for sending events to the current service.
	*/
	__sendTo = async (to, event) => {
		const collector = this.__collectedChildren.filter(({ id }) => id === to);
		for (const { service } of collector) await service.send(event);
	};
};
/**
* Creates an {@linkcode AsyncInterpreter} service from the given {@linkcode MachineConfig} machine.
*
* @param machine - The {@linkcode MachineConfig} machine to create the interpreter from.
* @param options - The options for the interpreter, including context, private context, mode, and exact.
* @returns an {@linkcode AsyncInterpreter} service.
*
* @see {@linkcode MachineConfig}
*/
var interpretAsync = (..._args) => {
	const [machine, args] = _args;
	const { mode, exact, pContext, context } = fn$7(args ?? {});
	const out = new AsyncInterpreter(machine, mode, exact);
	out._providePrivateContext(pContext);
	out._provideContext(context);
	return out;
};
/**
* The `Interpreter` class is responsible for interpreting and managing the state of a machine.
* It provides methods to start, stop, pause, and resume the machine, as well as to send events
* and subscribe to state changes.
*
* @template : type {@linkcode Config} [C] - The configuration type of the machine.
* @template : [Pc] - The private context type, which can be any type.
* @template : type {@linkcode types} [Tc] - The context type.
* @template : type {@linkcode EventsMap} [E] - The events map type, which maps event names to their
* @template : type {@linkcode PromiseeMap} [P] - The promisees map type, which maps promise names to their
* @template Mo : type {@linkcode SimpleMachineOptions2} - The machine options type, which includes various configurations for the machine. Default to {@linkcode SimpleMachineOptions2}.
*
* @implements : {@linkcode AnySyncInterpreter}
*
* @remarks
* The `Interpreter` class is a core component of the state machine implementation,
* allowing for the execution of state transitions, handling of events, and management of the machine's lifecycle.
* It supports various modes of operation, including strict and normal modes,
* and provides mechanisms for error and warning handling.
* * It also allows for the execution of actions, guards, and delays,
* * as well as the management of child interpreters and scheduled tasks.
*
* @see {@linkcode GetEventsFromConfig} for extracting events from the machine configuration.
*/
var SyncInterpreter = class SyncInterpreter extends CommonInterpreter {
	TYPE = "sync";
	/**
	* @deprecated Use the `machine` getter instead to access the inner machine of this interpreter.
	*
	* The {@linkcode SyncMachine} machine being interpreted.
	*/
	get machine() {
		return super.machine;
	}
	/**
	* Create a new {@linkcode Interpreter} instance with the same initial configuration as this instance.
	*/
	get renew() {
		const out = new SyncInterpreter(this.machine);
		out._ppC(this.__initialPpc);
		out._provideContext(this.__initialContext);
		return out;
	}
	#initSchedulers = () => {
		this.__schedulerContexts = createScheduler$1();
		this.__schedulerValue = createScheduler$1();
		this.__schedulerEvent = createScheduler$1();
		this.__schedulerStatus = createScheduler$1();
	};
	constructor(machine, mode = "strict", exact = true) {
		super(machine, mode, exact);
		this.#initSchedulers();
		this.__performConfig(true);
	}
	/**
	* Force transition to performs inner actions despite the current state.
	* This is useful for sending events that are not part of the current state transitions.
	* @param transitions, the transitions to perform.
	* @returns the result of the transitions.
	*
	* @see {@linkcode TransitionConfig} for more information about transitions.
	*/
	__performForceSendAction = (forceSend) => {
		if (!forceSend) return;
		const values = Object.values(this.machine.flat);
		for (const { on } of values) {
			const type = eventToType(forceSend);
			const transitions = toArray.typed(on?.[type]);
			this.__performTransitions(...transitions);
		}
	};
	__performsExtendedActions = ({ forceSend, resend, scheduled, pauseActivity, resumeActivity, stopActivity, pauseTimer, resumeTimer, stopTimer, sentEvent }) => {
		this.__performSendToAction(sentEvent);
		this.__performScheduledAction(scheduled);
		this.__performPauseActivityAction(pauseActivity);
		this.__performResumeActivityAction(resumeActivity);
		this.__performStopActivityAction(stopActivity);
		this.__performPauseTimerAction(pauseTimer);
		this.__performResumeTimerAction(resumeTimer);
		this.__performStopTimerAction(stopTimer);
		return this.__performForceSendAction(forceSend) ?? this.__performResendAction(resend);
	};
	__executeAction = (action) => {
		this.__setStatus("busy");
		this._iterate();
		const { pContext, context, ...extendeds } = action(this.__cloneState);
		this.__mergeContexts({
			pContext,
			context
		});
		this.__performsExtendedActions(extendeds);
	};
	__performActions = (...actions) => {
		const fns = actions.map(this.toActionFn).filter((f) => f !== void 0);
		for (const fn of fns) this.__executeAction(fn);
	};
	#performPredicate = (predicate) => {
		this._iterate();
		return predicate(this.__cloneState);
	};
	#executePredicate = (predicate) => {
		this.__setStatus("busy");
		const out = this.#performPredicate(predicate);
		this.__setStatus("working");
		return out;
	};
	#performPredicates = (...guards) => {
		if (guards.length < 1) return true;
		return guards.map(this.toPredicateFn).filter(fn$6).map(this.#executePredicate).every((b) => b);
	};
	__performTransition = (transition) => {
		if (typeof transition == "string") {
			const { diffEntries, diffExits } = this.__diffNext(transition);
			this.__performActions(...toArray.typed(diffExits));
			this.__performActions(...toArray.typed(diffEntries));
			return transition;
		}
		const { guards, actions, target } = transition;
		const { diffEntries, diffExits } = this.__diffNext(target);
		if (this.#performPredicates(...toArray(guards))) {
			this.__performActions(...toArray.typed(diffExits));
			this.__performActions(...toArray.typed(actions));
			this.__performActions(...toArray.typed(diffEntries));
			return target ?? false;
		}
		return false;
	};
	__performTransitions = (...transitions) => {
		for (const _transition of transitions) {
			const transition = this.__performTransition(_transition);
			if (typeof transition === "string") return transition;
		}
		return false;
	};
	__performFinally = (_finally) => {
		if (_finally === void 0) return;
		const finals = toArray.typed(_finally);
		for (const final of finals) {
			const check2 = typeof final === "string";
			const check3 = isDescriber(final);
			if (check2 || check3) {
				this.__performActions(final);
				continue;
			}
			/* v8 ignore else -- @preserve */
			if (this.#performPredicates(...toArray.typed(final.guards))) this.__performActions(...toArray.typed(final.actions));
		}
	};
	get #flat() {
		return this.machine.flat;
	}
	get #collectedAlways() {
		const entriesFlat = Object.entries(this.#flat);
		const entries = [];
		entriesFlat.forEach(([from, node]) => {
			const always = node.always;
			if (always) entries.push([from, always]);
		});
		return entries;
	}
	#performAfter = (from, after) => {
		const entries = Object.entries(after);
		return () => {
			entries.forEach(([_delay, transition]) => {
				const delayF = this.toDelayFn(_delay);
				if (!fn$6(delayF)) return;
				const delay = this.#executeDelay(delayF);
				/* v8 ignore else -- @preserve */
				if (delay > 6e5) {
					this._addWarning(`Delay ${_delay} is too long`);
					return;
				}
				const transitions = toArray.typed(transition);
				betterTimeout({
					callback: () => {
						if (this.__cannotPerform(from)) return;
						const target = this.__performTransitions(...transitions);
						if (target === false) this._addWarning(`No transitions reached from "${from}" by delay "${_delay}" !`);
						else {
							this.__performConfig(target);
							this._next();
						}
					},
					onError: () => {
						this._addWarning("MAX_TIMEOUT REACHED !!");
					},
					ms: delay,
					maxTime: DEFAULT_MAX_TIME_PROMISE
				});
			});
		};
	};
	get #collectedAfters() {
		const entriesFlat = Object.entries(this.#flat);
		const entries = [];
		entriesFlat.forEach(([from, node]) => {
			const after = node.after;
			if (after) entries.push([from, after]);
		});
		return entries;
	}
	#performDelay = (delay) => {
		this._iterate();
		return delay(this.__cloneState);
	};
	#executeDelay = (delay) => {
		this.__setStatus("busy");
		const out = this.#performDelay(delay);
		this.__setStatus("started");
		return out;
	};
	createInterval = ({ callback, id, interval }) => {
		const exact = this.__exact;
		return createInterval({
			callback,
			id,
			interval,
			exact
		});
	};
	__executeActivities = (from, _activities) => {
		const entries = Object.entries(_activities);
		const outs = [];
		for (const [_delay, _activity] of entries) {
			const id = `${from}::${_delay}`;
			let index = -1;
			const _interval = this.__cachedIntervals.find((f, i) => {
				const check = f.id === id;
				if (check) index = i;
				return check;
			});
			const buildCallback = () => {
				const delayF = this.toDelayFn(_delay);
				if (!fn$6(delayF)) return;
				const interval = this.#executeDelay(delayF);
				if (interval < 10) {
					this._addWarning(`Delay (${_delay}) is too short`);
					return;
				}
				if (interval > 6e5) {
					this._addWarning(`Delay (${_delay}) is too long`);
					return;
				}
				const activities = toArray.typed(_activity);
				const callback = () => {
					for (const activity of activities) {
						const check2 = typeof activity === "string";
						const check3 = isDescriber(activity);
						if (check2 || check3) {
							this.__performActions(activity);
							continue;
						}
						if (this.#performPredicates(...toArray.typed(activity.guards))) {
							const actions = toArray.typed(activity.actions);
							this.__performActions(...actions);
						}
					}
				};
				const promise = this.createInterval({
					callback,
					interval,
					id
				});
				this.__cachedIntervals.push(promise);
				return id;
			};
			if (_interval) {
				if (_interval.state === "idle" || _interval.state === "paused") {
					this.__cachedIntervals.splice(index, 1);
					const result = buildCallback();
					if (!result) return [];
					outs.push(result);
				} else outs.push(id);
				continue;
			}
			const result = buildCallback();
			if (!result) return [];
			outs.push(result);
		}
		return outs;
	};
	get __collectedSelfTransitions0() {
		const entries = /* @__PURE__ */ new Map();
		this.#collectedAlways.forEach(([from, always]) => {
			const inner = entries.get(from);
			if (inner) inner.always = () => this.__performAlways(always);
			else entries.set(from, { always: () => this.__performAlways(always) });
		});
		this.#collectedAfters.forEach(([from, after]) => {
			const inner = entries.get(from);
			if (inner) inner.after = this.#performAfter(from, after);
			else entries.set(from, { after: this.#performAfter(from, after) });
		});
		return entries;
	}
	get __collectedSelfTransitions() {
		const out = Array.from(this.__collectedSelfTransitions0).filter(([from]) => this.__isInsideValue(from)).map(([, { always, after }]) => {
			return () => {
				/* v8 ignore else -- @preserve */
				if (always) {
					const target = always();
					/* v8 ignore else -- @preserve */
					if (target) return this.__performConfig(target);
				}
				after?.();
			};
		});
		if (out.length < 1) return;
		return () => out.forEach((f) => f());
	}
	__collectPausables = () => {
		return this.__collectedEmitterConfigs.filter(([from]) => this.__isInsideValue(from)).filter(([from]) => {
			return !this.__collectedPausables.map(({ from }) => from).includes(from);
		}).map(([from, ..._emitters]) => {
			return [from, ..._emitters.map(({ id, ...rest }) => {
				return {
					emitterFn: this.toEmitterSrc(id),
					...rest,
					id
				};
			}).filter(({ emitterFn }) => !!emitterFn)];
		}).map(([from, ...emitters]) => {
			const pausables = emitters.map(({ emitterFn, error, next, complete, id }) => {
				const pausable = emitterFn(this.__cloneState);
				pausable.subscribe({
					next: (payload) => {
						const event = {
							type: `${id}::next`,
							payload
						};
						this.__changeEvent(fn$7(event));
						const transitions = toArray(next);
						this.__performTransitions(...transitions);
					},
					error: (payload) => {
						const event = {
							type: `${id}::error`,
							payload
						};
						this.__changeEvent(fn$7(event));
						const transitions = toArray(error);
						this.__performTransitions(...transitions);
					},
					complete: () => this.__performFinally(complete)
				});
				return {
					pausable,
					id,
					from
				};
			});
			this.__collectedPausables.push(...pausables);
			return pausables;
		}).flat();
	};
	__performSelfTransitions = () => {
		this.__setStatus("busy");
		const previousState = structuredClone(this.__state);
		this.__collectedSelfTransitions?.();
		if (!(0, import_fast_deep_equal.default)(previousState, structuredClone(this.__state))) this.__flush();
		this.__setStatus("working");
	};
	/**
	* Add options to the inner {@linkcode Machine} of this {@linkcode Interpreter} service.
	*/
	addOptions = (helper) => {
		return super.addOptions(helper);
	};
	/**
	* Provides options for the interpreter and returns a new interpreter instance.
	*
	* @param option a function that provides options for the machine.
	* Options can include actions, guards, delays, promises, and child machines.
	* @returns a new interpreter instance with the provided options applied.
	*/
	provideOptions = (option) => {
		return super.provideOptions(option);
	};
	subscribe = (_subscriber, options) => {
		const events = this.machine.eventsList;
		const id = options?.id;
		const find = id ? Array.from(this.__subscribers).find((f) => f.id === id) : void 0;
		if (find) return find;
		const subscriber = createSubscriber(_subscriber, options, ...events);
		this.__subscribers.add(subscriber);
		return subscriber;
	};
	__presend = (event) => {
		this.__sent = true;
		this.__changeEvent(event);
		this.__setStatus("sending");
		let sv = this.__value;
		const flat2 = this.__extractTransitions(event);
		for (const [, transitions] of flat2) {
			const target = this.__performTransitions(...toArray.typed(transitions));
			sv = nextSV(sv, target === false ? void 0 : target);
		}
		const next = switchV({
			condition: (0, import_fast_deep_equal.default)(this.__value, sv),
			truthy: void 0,
			falsy: initialConfig(this.machine.valueToConfig(sv))
		});
		this.__sent = false;
		return next;
	};
	/**
	* Creates a sender function for the given event type.
	* @param type - the {@linkcode EventArgT} type of the event to send.
	* @returns a function with the payload as Parameter that sends the event with the given type and payload.
	*
	* @see {@linkcode send} for sending events directly.
	*/
	sender = (type) => {
		return (...data) => {
			const event = {
				type,
				payload: data.length === 1 ? data[0] : {}
			};
			return this.send(event);
		};
	};
	/**
	* Performs all self transitions and activities of this {@linkcode Interpreter} service.
	* @remarks Throw if the number of self transitions exceeds {@linkcode DEFAULT_MAX_SELF_TRANSITIONS}.
	*/
	_next = () => {
		let check = false;
		do {
			const startTime = Date.now();
			const previousValue = this.__value;
			if (this.__selfTransitionsCounter >= 100) return this.__throwMaxCounter();
			this.__throwing();
			this.__preNext();
			const currentValue = this.__value;
			check = !(0, import_fast_deep_equal.default)(previousValue, currentValue);
			if (check) this.__flush();
			if (Date.now() - startTime > 20) this.__selfTransitionsCounter = 0;
		} while (check);
		this.__selfTransitionsCounter = 0;
	};
	/**
	* Sends an event without cheching to the current {@linkcode Interpreter} service.
	*
	* @param _event - the {@linkcode EventArg} event to send.
	*
	*/
	__send = (_event) => {
		const event = transformEventArg(_event);
		const next = this.__presend(event);
		if (fn$6(next)) {
			this.__config = next;
			this.__performConfig(true);
			this.__setStatus("working");
			return this._next();
		} else return this.__setStatus("working");
	};
	__collectChildren = () => {
		return this.__collectedChildrenConfig.filter(([from]) => this.__isInsideValue(from)).filter(([from]) => {
			return !this.__collectedChildren.map(({ from }) => from).includes(from);
		}).map(([from, ..._children]) => {
			return [from, ..._children.map(({ id, ...rest }) => {
				return {
					childFn: this.toChildFn(id),
					...rest,
					id
				};
			}).filter(({ childFn }) => !!childFn)];
		}).map(([from, ..._children]) => {
			return [from, ..._children.map(({ childFn, ...rest }) => {
				return {
					service: this.#executeChild(childFn),
					...rest
				};
			})];
		}).map(([from, ..._services]) => {
			const services = _services.map(({ service, on, contexts, id }) => {
				const si = service;
				if (on !== void 0 && Object.keys(on).length > 0) si.__subscribe((payload) => {
					const type = eventToType(payload.event);
					const event = {
						type: `${id}::on::${type}`,
						payload
					};
					this.__changeEvent(fn$7(event));
					const transitions = toArray(on?.[type]);
					return this.__performTransitions(...transitions);
				}, {
					equals: (a, b) => a.event.type === b.event.type,
					id: `${id}::on`
				});
				if (contexts !== void 0 && Object.keys(contexts).length > 0) si.__subscribe(({ context }) => {
					Object.entries(contexts).forEach(([key, path]) => {
						const pContext = key === "." ? structuredClone(context) : getByKey.low(context, key);
						if (path === ".") return this.__mergeContexts({ pContext });
						return this.__mergeContexts(recompose({ [`pContext.${path}`]: pContext }));
					});
				}, {
					equals: (a, b) => {
						const ac = a.context;
						const bc = b.context;
						if ((0, import_fast_deep_equal.default)(ac, bc)) return true;
						const keys = Object.keys(contexts);
						for (const key of keys) {
							if (key === ".") return (0, import_fast_deep_equal.default)(ac, bc);
							if (!(0, import_fast_deep_equal.default)(getByKey.low(ac, key), getByKey.low(bc, key))) return false;
						}
						return true;
					},
					id: `${id}::contexts`
				});
				return {
					service: si,
					id,
					from
				};
			});
			this.__collectedChildren.push(...services);
			return services;
		});
	};
	#executeChild = (child) => {
		return child(this.__cloneState);
	};
	/**
	* Sends an event to a specific child service by its ID.
	*
	* @param to - The ID of the child service to which the event will be sent.
	* @param : the {@linkcode EventObject} event to send to the child service.
	*
	* @see {@linkcode send} for sending events to the current service.
	*/
	__sendTo = (to, event) => {
		const collector = this.__collectedChildren.filter(({ from, id }) => this.__isInsideValue(from) && id === to);
		for (const { service } of collector) service.send(event);
	};
};
/**
* Creates an {@linkcode SyncInterpreter} service from the given {@linkcode AnyMachine} machine.
*
* @param machine - The {@linkcode AnyMachine} machine to create the interpreter from.
* @param options - The options for the interpreter, including context, private context, mode, and exact.
* @returns an {@linkcode SyncInterpreter} service.
*
* @see {@linkcode SyncConfig}
*/
var interpretSync = (..._args) => {
	const [machine, args] = _args;
	const { mode, exact, pContext, context } = fn$7(args);
	const out = new SyncInterpreter(machine, mode, exact);
	out._providePrivateContext(pContext);
	out._provideContext(context);
	return out;
};
var interpret = (machine, config) => {
	const check = machine.TYPE === "sync";
	const { sync: _, ...rest } = {
		sync: void 0,
		...config
	};
	return (check ? interpretSync : interpretAsync)(machine, rest);
};
/**
* A hook that creates a SolidJS signal from a service with a subscribe function.
*
* @param service - The service containing the state and subscribe method.
* @param options - Optional configuration options for selection and equality comparison.
* @returns A SolidJS Accessor containing the selected state.
*/
function useService(service, options) {
	const { selector = (s) => s, equality = deepEqual } = options ?? {};
	const [state, setState] = createSignal(selector(service.state));
	onCleanup(service.subscribe((nextState) => {
		setState(() => selector(nextState));
	}, { equals: (first, next) => {
		const _first = selector(first);
		const _next = selector(next);
		return equality(_first, _next);
	} }).unsubscribe);
	return state;
}
//#endregion
export { useService as i, interpret as n, toArray as r, createMachine as t };
