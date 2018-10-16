// @flow

import {map} from '../';
import {DONE} from '../constants';

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

interface TestAsyncIterator<T> extends AsyncIterator<T> {
  closeCalls: number;
  return: () => Promise<typeof DONE>;
}

export function makeAsyncIterator<T>(array: Array<T>): TestAsyncIterator<T> {
  let index = 0;
  return {
    closeCalls: 0,
    '@@asyncIterator': function () { return this },
    // $FlowFixMe
    [Symbol.asyncIterator]: function () { return this },
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
