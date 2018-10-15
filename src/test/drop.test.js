// @flow

import {
  compose,
  concat,
  filter,
  drop,
  take,
  toArray,
} from '../';
import {
  badMap,
  closeable,
  spyFactory,
  throws,
} from './util';

test('drop', () => {
  const array = [1, 2, 3];

  expect(toArray(drop(-1)(array))).toEqual([1, 2, 3]);
  expect(toArray(drop(0)(array))).toEqual([1, 2, 3]);
  expect(toArray(drop(1)(array))).toEqual([2, 3]);
  expect(toArray(drop(2)(array))).toEqual([3]);

  expect(toArray(take(1)(drop(1)(array)))).toEqual([2]);
  expect(toArray(drop(1)(take(2)(array)))).toEqual([2]);
  expect(toArray(take(1)(drop(2)(array)))).toEqual([3]);

  expect(
    compose(
      toArray,
      drop(1),
      filter(x => x % 2 === 0),
      drop(2),
    )([1, 2, 3, 4, 5, 6])
  ).toEqual([6]);

  expect(
    compose(
      toArray,
      take(1),
      drop(2),
      take(4),
    )([1, 2, 3, 4, 5])
  ).toEqual([3]);

  expect(
    compose(
      toArray,
      drop(1),
      take(2),
      drop(1),
    )([1, 2, 3, 4, 5])
  ).toEqual([3]);

  const nested = [[1, 2, 3], [4]];
  expect(toArray(concat(drop(1)(nested)))).toEqual([4]);
  expect(toArray(drop(1)(concat(nested)))).toEqual([2, 3, 4]);

  expect(
    compose(
      toArray,
      drop(1),
      drop(1),
      drop(1),
    )([1, 2, 3, 4])
  ).toEqual([4]);

  // Manual iteration
  const iterable = drop(2)(array);
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 3, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(drop(2));
  // $FlowFixMe
  badMap(lazySpy(array))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
});

test('IteratorClose', () => {
  expect(() => {
    for (const x of drop(1)([1, 2, 3])) {
      break;
    }
  }).not.toThrow();

  const c = closeable();
  for (const x of drop(1)(c)) {
    break;
  }
  expect(c.closeCalls).toBe(1);

  expect((drop(1)([]): any).return()).toEqual({done: true});
});

test('iterator is an iterable', () => {
  // $FlowFixMe
  const it = drop(1)([1, 2, 3])[Symbol.iterator]();

  expect(it[Symbol.iterator]()).toBe(it);

  for (const x of it) {
    expect(x).toBe(2);
    break;
  }

  for (const x of it) {
    expect(x).toBe(3);
  }
});
