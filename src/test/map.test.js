// @flow

import {
  concat,
  map,
  toArray,
} from '../';
import {SYMBOL_ITERATOR} from '../constants';
import {
  badMap,
  badProp,
  closeable,
  spyFactory,
  throws,
} from './util';

test('map', () => {
  const square = map(x => x ** 2);

  expect(toArray(square([1, 2, 3]))).toEqual([1, 4, 9]);

  const iterable = square(concat([[3], [2], [1]]));
  expect(toArray(iterable)).toEqual([9, 4, 1]);

  // Iterator is done
  const iterator = iterable[SYMBOL_ITERATOR]();
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(map(badProp));
  badMap(lazySpy([{}]))[SYMBOL_ITERATOR]();
  expect(lazySpy.calls).toBe(0);
});

test('IteratorClose', () => {
  const c = closeable();
  expect(() => {
    for (const x of map(throws)(c)) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);
  for (const x of map(x => x)(c)) {
    break;
  }
  expect(c.closeCalls).toBe(2);

  expect(map(x => x)([]).return()).toEqual({done: true});
});

test('iterator is an iterable', () => {
  const it = map(x => x + 1)([1, 2])[SYMBOL_ITERATOR]();

  expect(it[SYMBOL_ITERATOR]()).toBe(it);

  for (const x of it) {
    expect(x).toBe(2);
    break;
  }

  for (const x of it) {
    expect(x).toBe(3);
  }
});
