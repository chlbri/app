//#region ../../node_modules/@bemedev/better-set/lib/set.js
var BetterSet = class BetterSet {
	get [Symbol.iterator]() {
		return this.#items[Symbol.iterator].bind(this.#items);
	}
	#items;
	constructor(equals) {
		this.equals = equals;
		this.#items = /* @__PURE__ */ new Set();
	}
	__provideItems = (items) => {
		if (items instanceof BetterSet) this.#items = items.#items;
		else this.#items = items;
	};
	get replaceItems() {
		return this.__provideItems;
	}
	#add = (item) => {
		const equals = this.equals;
		for (const item2 of this.#items) {
			if (!equals) break;
			if (equals(item, item2)) return;
		}
		this.#items.add(item);
		return item;
	};
	add = (...items) => {
		items.forEach(this.#add);
	};
	get has() {
		return this.#items.has.bind(this.#items);
	}
	get values() {
		return this.#items.values.bind(this.#items)();
	}
	get size() {
		return this.#items.size;
	}
	get clear() {
		return this.#items.clear.bind(this.#items);
	}
	get forEach() {
		return this.#items.forEach.bind(this.#items);
	}
	get isEmpty() {
		return this.size === 0;
	}
	get delete() {
		return this.#items.delete.bind(this.#items);
	}
	get entries() {
		return this.#items.entries();
	}
	get keys() {
		return this.#items.keys();
	}
	get toString() {
		const lines = [`BetterSet [`];
		for (const item of this.#items) lines.push(`  ${JSON.stringify(item, null, 2)},`);
		lines.push(`]`);
		return lines.join("\n");
	}
	get toLocaleString() {
		return this.toString;
	}
	get toArray() {
		return Array.from(this.#items);
	}
	#getEquals = (other, equals) => {
		return equals ?? this.equals ?? other?.equals;
	};
	#hasItem = (items, item, equals) => {
		if (!equals) return items.has(item);
		for (const entry of items) if (equals(entry, item)) return true;
		return false;
	};
	union = (other, equals) => {
		const rest = new BetterSet(this.#getEquals(other, equals));
		rest.add(...this.#items);
		rest.add(...other.#items);
		return rest;
	};
	intersection = (other, equals) => {
		const comparator = this.#getEquals(other, equals);
		const rest = new BetterSet(comparator);
		this.#items.forEach((item) => {
			if (this.#hasItem(other.#items, item, comparator)) rest.add(item);
		});
		return rest;
	};
	difference = (other, equals) => {
		const comparator = this.#getEquals(other, equals);
		const rest = new BetterSet(comparator);
		this.#items.forEach((item) => {
			if (!this.#hasItem(other.#items, item, comparator)) rest.add(item);
		});
		return rest;
	};
	symmetricDifference = (other, equals) => {
		const comparator = this.#getEquals(other, equals);
		const rest = new BetterSet(comparator);
		this.#items.forEach((item) => {
			if (!this.#hasItem(other.#items, item, comparator)) rest.add(item);
		});
		other.#items.forEach((item) => {
			if (!this.#hasItem(this.#items, item, comparator)) rest.add(item);
		});
		return rest;
	};
	isSubsetOf = (other) => {
		const comparator = this.#getEquals(other);
		if (!comparator) return this.#items.isSubsetOf(other.#items);
		for (const item of this.#items) if (!this.#hasItem(other.#items, item, comparator)) return false;
		return true;
	};
	isSupersetOf = (other) => {
		const comparator = this.#getEquals(other);
		if (!comparator) return this.#items.isSupersetOf(other.#items);
		for (const item of other.#items) if (!this.#hasItem(this.#items, item, comparator)) return false;
		return true;
	};
	isDisjointFrom = (other) => {
		const comparator = this.#getEquals(other);
		if (!comparator) return this.#items.isDisjointFrom(other.#items);
		for (const item of this.#items) if (this.#hasItem(other.#items, item, comparator)) return false;
		return true;
	};
	[Symbol.toStringTag] = "BetterSet";
};
var createBetterSet = (equals) => {
	return new BetterSet(equals);
};
//#endregion
export { createBetterSet as t };
