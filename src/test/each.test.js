// @flow

import {
  each,
  filter,
  uniq,
} from '../';
import {
  closeable,
  throws,
} from './util';

test('each', () => {
  let count1 = 0;
  let count2 = 0;

  let result = each(() => count1++)([0, 0, 0]);
  expect(count1).toBe(3);
  expect(result).toBe(undefined);

  count1 = 0;
  each(() => count1++)(
    filter(x => { count2++; return x > 0 })(
      uniq([-2, -2, -1, -1, 0, 0, 1, 1, 2, 2])
    )
  );
  expect(count1).toBe(2);
  expect(count2).toBe(5);
});

test('IteratorClose', () => {
  const c = closeable();
  expect(() => {
    for (const x of each(throws)(c)) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);
});
