import type { Fn } from '#bemedev/globals/types';
import { defaultCheck } from '#guards';

class BetterSet<T = any> implements Iterable<T> {
  get [Symbol.iterator]() {
    return this.#items[Symbol.iterator];
  }

  #items: Set<T>;
  constructor(private equals?: (a: T, b: T) => boolean) {
    this.#items = new Set<T>();
  }

  #provideItems = (items: Set<T>) => {
    this.#items = items;
  };

  add = (item: T) => {
    const array = this.toArray;
    const equals = this.equals;
    if (!!equals && array.some(i => equals(i, item))) return;
    this.#items.add(item);
    return item;
  };

  get has() {
    return this.#items.has.bind(this.#items);
  }

  get values() {
    return this.#items.values();
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
    return this.#items.size === 0;
  }

  get delete() {
    return this.#items.delete.bind(this.#items);
  }

  get entries() {
    return this.#items.entries.bind(this.#items);
  }

  get keys() {
    return this.#items.keys.bind(this.#items);
  }

  get toString() {
    return this.#items.toString.bind(this.#items);
  }

  get toLocaleString() {
    return this.#items.toLocaleString.bind(this.#items);
  }

  get toArray() {
    return Array.from(this.#items);
  }

  // #region With others
  union = <U extends BetterSet>(
    other: U,
    equals: Fn<[U | T, U | T], boolean>,
  ) => {
    const rest = new BetterSet<U | T>(equals);
    const items = this.#items.union(other.#items);
    rest.#provideItems(items);
    return rest;
  };

  intersection = <U extends BetterSet>(
    other: U,
    equals: Fn<[U | T, U | T], boolean>,
  ) => {
    const rest = new BetterSet<U | T>(equals);
    const items = this.#items.intersection(other.#items);
    rest.#provideItems(items);
    return rest;
  };

  difference = <U extends BetterSet>(
    other: U,
    equals: Fn<[U | T, U | T], boolean>,
  ) => {
    const rest = new BetterSet<U | T>(equals);
    const items = this.#items.difference(other.#items);
    rest.#provideItems(items);
    return rest;
  };

  symmetricDifference = <U extends BetterSet>(
    other: U,
    equals: Fn<[U | T, U | T], boolean>,
  ) => {
    const rest = new BetterSet<U | T>(equals);
    const items = this.#items.symmetricDifference(other.#items);
    rest.#provideItems(items);
    return rest;
  };

  isSubsetOf = (other: BetterSet) => {
    return this.#items.isSubsetOf(other.#items);
  };

  isSupersetOf = (other: BetterSet) => {
    return this.#items.isSupersetOf(other.#items);
  };

  isDisjointFrom = (other: BetterSet) => {
    return this.#items.isDisjointFrom(other.#items);
  };

  // #endregion

  [Symbol.toStringTag] = 'BetterSet';
}

export const createBetterSet = <T = any>(
  equals: (a: T, b: T) => boolean = defaultCheck,
) => new BetterSet<T>(equals);

export const createSet = createBetterSet;

export { type BetterSet };
