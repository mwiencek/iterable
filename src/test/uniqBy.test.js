// @flow

import {
  uniqBy,
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

test('uniqBy', () => {
  const items = [
    {key: 'a', value: 1},
    {key: 'a', value: 2},
    {key: 'a', value: 3},
    {key: 'b', value: 4},
  ];

  const _uniqBy = uniqBy(x => x.key);
  expect(toArray(_uniqBy(items))).toEqual([
    {key: 'a', value: 1},
    {key: 'b', value: 4},
  ]);
  // Shouldn't maintain state between calls.
  expect(toArray(_uniqBy(items))).toEqual([
    {key: 'a', value: 1},
    {key: 'b', value: 4},
  ]);
  items.pop();
  items.push({key: 'c', value: 5});
  const iterable = _uniqBy(items);
  expect(toArray(iterable)).toEqual([
    {key: 'a', value: 1},
    {key: 'c', value: 5},
  ]);
  items.shift();
  items.shift();
  items.push(
    {key: 'c', value: 6},
    {key: 'd', value: 7},
  );
  // Iterator is done
  expect(iterable.next()).toEqual({done: true});
  expect(toArray(_uniqBy(items))).toEqual([
    {key: 'a', value: 3},
    {key: 'c', value: 5},
    {key: 'd', value: 7},
  ]);

  // Lazy iterator creation
  const lazySpy = spyFactory(uniqBy(badProp));
  badMap(lazySpy([{}]))[SYMBOL_ITERATOR]();
  expect(lazySpy.calls).toBe(0);
});

test('IteratorClose', () => {
  const c = closeable();
  expect(() => {
    toArray(uniqBy(throws)(c));
  }).toThrow();
  expect(c.closeCalls).toBe(1);
  for (const x of uniqBy(x => x)(c)) {
    break;
  }
  expect(c.closeCalls).toBe(2);
});

test('iterator is an iterable', () => {
  const it = uniqBy(x => x)([1, 1, 2, 2])[SYMBOL_ITERATOR]();

  expect(it[SYMBOL_ITERATOR]()).toBe(it);

  for (const x of it) {
    expect(x).toBe(1);
    break;
  }

  for (const x of it) {
    expect(x).toBe(2);
  }
});
