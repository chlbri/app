//#region ../../node_modules/@bemedev/boolean-recursive/lib/helpers.js
var returnFalse = () => false;
var asyncReturnFalse = async () => false;
//#endregion
//#region ../../node_modules/@bemedev/boolean-recursive/lib/recursive.js
function reduceGuardsAnd$1(...values) {
	const out = (...args) => {
		let iter = true;
		for (const value of values) {
			const check = _reduceGuards$1(value)(...args);
			if (!check) return check;
			iter = check;
		}
		return iter;
	};
	return out;
}
function reduceGuardsOr$1(...values) {
	return values.reduce((acc, value) => {
		const guard = _reduceGuards$1(value);
		return (...args) => acc(...args) || guard(...args);
	}, returnFalse);
}
function _reduceGuards$1(values) {
	if (typeof values === "function") return values;
	if ("and" in values) {
		const and = values.and;
		if (Array.isArray(and)) return reduceGuardsAnd$1(...and);
		return reduceGuardsAnd$1(and);
	}
	if ("or" in values) {
		const or = values.or;
		if (Array.isArray(or)) return reduceGuardsOr$1(...or);
		return reduceGuardsOr$1(or);
	}
	return reduceGuardsAnd$1(...values);
}
function recursive(...fns) {
	return _reduceGuards$1(fns);
}
//#endregion
//#region ../../node_modules/@bemedev/boolean-recursive/lib/async.js
function reduceGuardsAnd(...values) {
	const out = async (...args) => {
		let iter = true;
		for (const value of values) {
			const check = await _reduceGuards(value)(...args);
			if (!check) return check;
			iter = check;
		}
		return iter;
	};
	return out;
}
function reduceGuardsOr(...values) {
	return values.reduce((acc, value) => {
		const guard = _reduceGuards(value);
		return async (...args) => await acc(...args) || await guard(...args);
	}, asyncReturnFalse);
}
function _reduceGuards(values) {
	if (typeof values === "function") return values;
	if ("and" in values) {
		const and = values.and;
		if (Array.isArray(and)) return reduceGuardsAnd(...and);
		return reduceGuardsAnd(and);
	}
	if ("or" in values) {
		const or = values.or;
		if (Array.isArray(or)) return reduceGuardsOr(...or);
		return reduceGuardsOr(or);
	}
	return reduceGuardsAnd(...values);
}
function asyncRecursive(...fns) {
	return _reduceGuards(fns);
}
//#endregion
export { recursive as n, asyncRecursive as t };
