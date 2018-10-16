// @flow

import {
  compose,
  map,
  toArray,
  uniq,
} from '../';
import {SYMBOL_ITERATOR} from '../constants';
import {closeable, badMap, spyFactory} from './util';

test('uniq', () => {
  const source = [1, 1, 2, 3, 1];
  const _uniq = uniq(source);

  expect(toArray(_uniq)).toEqual([1, 2, 3]);
  source.push(4, 4);
  // Iterator is done
  expect(_uniq.next()).toEqual({done: true});
  expect(toArray(uniq(source))).toEqual([1, 2, 3, 4]);

  // Lazy iterator creation
  const lazySpy = spyFactory(uniq);
  badMap(lazySpy([{}]))[SYMBOL_ITERATOR]();
  expect(lazySpy.calls).toBe(0);

  // Composed
  expect(toArray(
    compose(
      uniq,
      uniq,
    )([true, true])
  )).toEqual([true]);

  expect(toArray(
    compose(
      map(x => !x),
      uniq,
      uniq,
      map(x => !x),
    )([true, true])
  )).toEqual([true]);
});

test('IteratorClose', () => {
  const c = closeable();
  for (const x of uniq(c)) {
    break;
  }
  expect(c.closeCalls).toBe(1);
});

test('iterator is an iterable', () => {
  const it = uniq([1, 1, 2, 2])[SYMBOL_ITERATOR]();

  expect(it[SYMBOL_ITERATOR]()).toBe(it);

  for (const x of it) {
    expect(x).toBe(1);
    break;
  }

  for (const x of it) {
    expect(x).toBe(2);
  }
});
