// @flow

import {map} from '../';

export function spyFactory(util: (Iterable<any>) => any) {
  const spy = function (source: Iterable<any>) {
    const iterable: any = util(source);
    const iterator: any = iterable[Symbol.iterator];

    iterator[Symbol.iterator] = function () {
      spy.calls++;
      return iterator.call(iterable);
    };

    return iterator;
  };
  spy.calls = 0;
  return spy;
}

export function closeable<T>(
  value: T | null = null,
  maxIterations: number = Infinity,
): Iterable<T> & {closeCalls: number} {
  let iterations = 0;
  const iterable = {
    [Symbol.iterator]: function () {
      return {
        next: () => {
          if (iterations >= maxIterations) {
            return {done: true};
          }
          iterations++;
          return {value: value, done: false};
        },
        return: () => {
          iterations = 0;
          iterable.closeCalls++;
          return {};
        },
      };
    },
    closeCalls: 0,
  };
  return ((iterable: any): Iterable<T> & {closeCalls: number});
};

export function throws() {
  throw new Error();
}

const badProp = (x: any) => x.y.z;

const badMap = map(badProp);

export {badProp, badMap};
