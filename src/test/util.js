// @flow

import {map} from '../';
import {
  DONE,
  SYMBOL_ITERATOR,
  SYMBOL_ASYNC_ITERATOR,
} from '../constants';
import type {IteratorExt, IterableExt, Terable} from '../types';

export function spyFactory<T, U>(util: (IterableExt<T>) => IterableExt<U>) {
  const spy = function (source: IterableExt<T>): IterableExt<U> {
    const iterable = util(source);
    const iterator = (iterable: any)[SYMBOL_ITERATOR];

    iterator[SYMBOL_ITERATOR] = function () {
      spy.calls++;
      return iterator.call(iterable);
    };

    return iterator;
  };
  spy.calls = 0;
  return spy;
}

export function closeable<T>(
  value: T,
  maxIterations: number = Infinity,
): IterableExt<T> & {closeCalls: number} {
  let iterations = 0;
  const iterable = {
    [SYMBOL_ITERATOR]: function () {
      return {
        [SYMBOL_ITERATOR]: function () {
          return this;
        },
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
          return {done: true};
        },
      };
    },
    closeCalls: 0,
  };
  return iterable;
};

interface TestAsyncIterator<T> extends AsyncIterator<T> {
  closeCalls: number;
  return: () => Promise<typeof DONE>;
}

export function makeAsyncIterator<T>(array: Array<T>): TestAsyncIterator<T> {
  let index = 0;
  return {
    closeCalls: 0,
    [SYMBOL_ASYNC_ITERATOR]: function () { return this },
    next: function () {
      const thisIndex = index++;
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          if (thisIndex < array.length) {
            let value = array[thisIndex];
            if (typeof value === 'function') {
              value = value();
            }
            resolve({value, done: false});
          } else {
            resolve(DONE);
          }
        }, 100);
      });
    },
    return: function () {
      this.closeCalls++;
      return Promise.resolve(DONE);
    },
  };
}

export function throws() {
  throw new Error();
}

const badProp = (x: any) => x.y.z;

const badMap = map(badProp);

export {badProp, badMap};
