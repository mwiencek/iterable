// @flow

import asyncMap from '../async/map';

function makeAsyncIterator(array) {
  let index = 0;
  return {
    closeCalls: 0,
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
            resolve({done: true});
          }
        }, 100);
      });
    },
    return: function () {
      this.closeCalls++;
      return Promise.resolve({done: true});
    },
  };
}

test('async', async () => {
  let counter = 3;
  let it = makeAsyncIterator([3, 2, 1]);
  // $FlowFixMe
  for await (const x of asyncMap(x => x * 2)(it)) {
    expect(x).toBe((counter--) * 2);
  }
  expect(it.closeCalls).toBe(0);

  it = makeAsyncIterator([1, 2]);
  // $FlowFixMe
  for await (const x of it) {
    break;
  }
  expect(it.closeCalls).toBe(1);
});
