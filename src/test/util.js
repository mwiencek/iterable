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

export function closeable(value: mixed = null) {
  let iterations = 0;
  const iterable = {
    [Symbol.iterator]: function () {
      return {
        next: () => ({value: value, done: false}),
        return: () => { iterable.closeCalls++ },
      };
    },
    closeCalls: 0,
  };
  return iterable;
};

export function throws() {
  throw new Error();
}

const badProp = (x: any) => x.y.z;

const badMap = map(badProp);

export {badProp, badMap};
