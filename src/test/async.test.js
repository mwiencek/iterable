// @flow

function makeIterator() {
  let counter = 3;
  return {
    '@@asyncIterator': makeIterator,
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
    },
  };
}

const asyncIterable = {
  // $FlowFixMe
  [Symbol.iterator]: makeIterator,
  '@@asyncIterator': makeIterator,
  closeCalls: 0,
};

test('async', async () => {
  let counter = 3;
  for await (const x of asyncIterable) {
    expect(x).toBe(counter--);
  }
  expect(asyncIterable.closeCalls).toBe(0);
  for await (const x of asyncIterable) {
    break;
  }
  expect(asyncIterable.closeCalls).toBe(1);
});
