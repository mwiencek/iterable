// @flow

import {
  drop,
  head,
} from '../';

test('head', () => {
  const array = [1, 2, 3];

  expect(head(array)).toBe(1);

  expect(() => {
    head([]);
  }).toThrow();

  expect(head(drop(1)(array))).toBe(2);
  expect(head(drop(2)(array))).toBe(3);

  expect(() => {
    head(drop(3)(array));
  }).toThrow();
});
