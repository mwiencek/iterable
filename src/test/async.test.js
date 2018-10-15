// @flow

import asyncMap from '../async/map';

function makeIterator() {
  let counter = 3;
  return {
    // $FlowFixMe
    [Symbol.asyncIterator]: function () { return this },
    next: function () {
      const _counter = counter;
      counter--;
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          if (_counter) {
            resolve({value: _counter, done: false});
          } else {
            resolve({done: true});
          }
        }, 100);
      });
    },
    return: function () {
      counter = 0;
      asyncIterable.closeCalls++;
      return Promise.resolve({});
    },
  };
}

const asyncIterable = {
  // $FlowFixMe
  [Symbol.asyncIterator]: makeIterator,
  closeCalls: 0,
};

test('async', async () => {
  let counter = 3;
  // $FlowFixMe
  for await (const x of asyncMap(x => x * 2)(asyncIterable)) {
    expect(x).toBe((counter--) * 2);
  }
  expect(asyncIterable.closeCalls).toBe(0);
  // $FlowFixMe
  for await (const x of asyncIterable) {
    break;
  }
  expect(asyncIterable.closeCalls).toBe(1);
});
