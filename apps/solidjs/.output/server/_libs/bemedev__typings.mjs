var UNION = "$$app-ts => union$$";
var STANDARD_KEY = "~standard";
var vendor = "@bemedev/typings";
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/standard.js
var _standardize = (__type) => {
	return {
		__type,
		type: __type,
		[STANDARD_KEY]: {
			version: 1,
			vendor,
			types: {
				input: __type,
				output: __type
			},
			validate: () => ({ value: __type })
		}
	};
};
var standardize = _standardize;
var standardize2 = (value) => value;
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/utils/expandFn.js
var expandFn = (main, extensions) => {
	const out = main;
	/* v8 ignore start -- @preserve */
	if (extensions) Object.assign(out, extensions);
	/* v8 ignore stop -- @preserve */
	return out;
};
var expandFn2 = (main, type, extensions) => {
	return expandFn(main, {
		...extensions,
		const: type,
		type
	});
};
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/utils/_const.js
var _const = (value) => value;
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/any.js
var any = expandFn2((value) => {
	return standardize2(value);
}, "any");
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/array.js
var array = expandFn2((value) => {
	return standardize2([value]);
}, _const());
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/custom.js
/**
*  Create a custom value that can be used in the state value or as a literal.
* @param value The value to create the custom value from.
* @returns A custom value that can be used in the state value or as a literal.
*
* @important the type parameter `T` must not inherit of type {@link ObjectT}, otherwise it will be considered as an object and do not transform it in {@link type}
*
* @example
* ```ts
* const myCustomValue = custom({ foo: 'bar' });
* // myCustomValue is of type Custom<{ foo: 'bar }>
* ```
*
* @see {@link Custom} for more information about custom values.
*/
var custom = expandFn2((value) => {
	return standardize2(value);
}, "any");
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/intersection.js
var intersection = (...values) => {
	return standardize2(values);
};
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/use.js
var use = ({ __type }) => __type;
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/union.js
var _union = (...values) => {
	return standardize2({ [UNION]: values });
};
var union = expandFn(_union, { discriminated: (_key, ...values) => _union(...values) });
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/litterals.js
var litterals = expandFn2((...values) => {
	return standardize2(values[0]);
}, _const(union("string", "number", "boolean")));
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/optional.js
var optional = (value) => {
	return standardize2(value);
};
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/partial.js
var partial = (value) => {
	return standardize2(value);
};
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/primitive.js
var primitive = expandFn2((value) => standardize2(value), _const(), {
	boolean: expandFn2((value) => {
		return standardize2(value);
	}, "boolean"),
	string: expandFn2((value) => {
		return standardize2(value);
	}, "string"),
	number: expandFn2((value) => {
		return standardize2(value);
	}, "number"),
	bigint: expandFn2((value) => {
		return standardize2(value);
	}, "bigint"),
	symbol: expandFn2((value) => {
		return standardize2(value);
	}, "symbol"),
	never: standardize2(),
	undefined: standardize2()
});
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/primitiveObject.js
var primitiveObject = expandFn2((value) => {
	return standardize2(value);
}, _const(), { map: expandFn2((value) => {
	return standardize2(value);
}, _const()) });
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/readonly.js
var readonly = (value) => value;
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/object.js
var object = expandFn2((value) => {
	return standardize2(value);
}, _const());
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/record.js
var record = expandFn2((value, ...keys) => {
	return standardize2(keys.reduce((acc, key) => {
		acc[key] = value;
		return acc;
	}, {}));
}, object.const);
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/soa.js
var soa = (value) => {
	return standardize2(value);
};
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/sora.js
var sora = (value) => {
	return standardize2(value);
};
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/sv.js
var sv = expandFn2((value) => {
	return standardize2(value);
}, _const());
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/tuple.js
var tuple = expandFn2((...values) => {
	return standardize2(values);
}, array.type);
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/helpers/omit.js
var omit = expandFn2((value, _) => {
	return standardize2(value);
}, _const(), { strict: (value, _) => {
	return standardize2(value);
} });
//#endregion
//#region ../../node_modules/@bemedev/typings/lib/type.js
var _transform = (obj) => {
	return obj;
};
var type = (option) => {
	let out;
	if (!option) out = option;
	else if (typeof option === "function") out = _transform(option({
		any,
		custom,
		intersection,
		litterals,
		optional,
		omit,
		partial,
		record,
		soa,
		sv,
		union,
		array,
		tuple,
		primitiveObject,
		primitive,
		readonly,
		object,
		sora,
		use
	}));
	else out = _transform(option);
	return standardize(out);
};
var pretype = (pretype) => expandFn(type, {
	type,
	pretype: standardize(pretype?.__type ?? "any")
});
//#endregion
export { type as n, pretype as t };
