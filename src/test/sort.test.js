// @flow

import {
  compose,
  map,
  sort,
  take,
  toArray,
} from '../';

test('sort', () => {
  expect(toArray(sort([9, 1, 7, 2, 0]))).toEqual([0, 1, 2, 7, 9]);

  expect(
    compose(
      toArray,
      sort,
      map(x => parseInt(x, 10)),
    )(['10', '9', '11', '8'])
  ).toEqual([8, 9, 10, 11]);
});

test('iterator is an iterable', () => {
  const it = sort([2, 1])[Symbol.iterator]();

  expect(it[Symbol.iterator]()).toBe(it);

  for (const x of it) {
    expect(x).toBe(1);
    break;
  }

  for (const x of it) {
    expect(x).toBe(2);
  }
});
