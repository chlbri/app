export const inBounds = (data: any[], index: number) => {
  const out = data.map((_, i) => i).includes(index);

  return out;
};

export function narrowFilter<T>(data: Partial<T>): (data: T) => boolean;
export function narrowFilter<T>(
  key: keyof T,
  value: T[typeof key],
): (data: T) => boolean;

export function narrowFilter<T>(arg1: any, arg2?: unknown) {
  const out = (data: T) => {
    if (typeof arg1 === 'string') {
      const key = arg1 as keyof T;
      return data[key] === arg2;
    }

    for (const key in arg1) {
      if (Object.prototype.hasOwnProperty.call(arg1, key)) {
        const elm1 = arg1[key];
        const elm2 = (data as any)[key];
        if (elm1 !== elm2) return false;
      }
    }

    return true;
  };

  return out;
}
