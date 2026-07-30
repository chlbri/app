import { o as recompose, t as getByKey } from "./@bemedev/decompose+[...].mjs";
//#region ../../node_modules/@bemedev/function-swap/lib/helpers.js
function buildDecomposedMap(shape, val, decomposedMap) {
	if (typeof shape === "string") decomposedMap[shape] = val;
	else for (const key of Object.keys(shape)) {
		const childShape = shape[key];
		const childVal = val?.[key];
		buildDecomposedMap(childShape, childVal, decomposedMap);
	}
}
var buildMap = (map, newArgs) => {
	const decomposedMap = {};
	map.forEach((shape, index) => {
		const val = newArgs[index];
		buildDecomposedMap(shape, val, decomposedMap);
	});
	return decomposedMap;
};
//#endregion
//#region ../../node_modules/@bemedev/function-swap/lib/swap.js
var _swap = (fn) => {
	const out = (...map) => {
		return (...newArgs) => {
			const decomposedMap = buildMap(map, newArgs);
			if (Object.keys(decomposedMap).length === 0) return fn();
			return fn(...recompose(decomposedMap));
		};
	};
	out.constraint = () => (keysMatch) => {
		return (...newArgs) => {
			if (Object.keys(keysMatch).length === 0) return fn();
			const decomposedMap = {};
			for (const [keyF, keyP] of Object.entries(keysMatch)) decomposedMap[keyF] = getByKey(newArgs, keyP);
			return fn(...recompose(decomposedMap));
		};
	};
	return out;
};
var swap = (fn) => _swap(fn);
swap.fromFunction = _swap;
swap.fromFn = _swap;
swap.fromParameters = () => () => (b) => b;
swap.fromParams = swap.fromParameters;
//#endregion
export { swap as t };
