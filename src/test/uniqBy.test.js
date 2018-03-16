// @flow

import {
  uniqBy,
  toArray,
} from '../';
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
  // Should be able to reuse the iterable.
  items.shift();
  items.shift();
  items.push(
    {key: 'c', value: 6},
    {key: 'd', value: 7},
  );
  expect(toArray(iterable)).toEqual([
    {key: 'a', value: 3},
    {key: 'c', value: 5},
    {key: 'd', value: 7},
  ]);

  // Manual iteration
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: {key: 'a', value: 3}, done: false});
  expect(iterator.next()).toEqual({value: {key: 'c', value: 5}, done: false});
  expect(iterator.next()).toEqual({value: {key: 'd', value: 7}, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(uniqBy(badProp));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
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
