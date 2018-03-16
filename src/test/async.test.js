const asyncIterable = {
  [Symbol.iterator]: function () {
    let counter = 3;
    return {
      next: function () {
        const _counter = counter;
        counter--;
        if (_counter > 0) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              resolve({value: _counter, done: false});
            }, 100);
          });
        } else {
          return {done: true};
        }
      },
      return: function () {
        counter = 0;
        asyncIterable.closeCalls++;
      },
    };
  },
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
