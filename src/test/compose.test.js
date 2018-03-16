// @flow

import {
  compact,
  compose,
  concat,
  map,
  toArray,
  uniq,
} from '../';
import mediums from './mediums';
import {closeable, throws} from './util';

test('compose', () => {
  const newIds = compose(
    uniq,
    compact,
    map(x => x.artist.id),
    concat,
    map(x => x.artistCredit.names),
    concat,
    map(x => x.tracks),
  )(mediums);
  expect(toArray(newIds)).toEqual([1, 2, 3, 4, 5]);
  // Shouldn't maintain state between calls.
  expect(toArray(newIds)).toEqual([1, 2, 3, 4, 5]);

  // Manual iteration
  const iterator: any = (newIds: any)[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({value: 2, done: false});
  expect(iterator.next()).toEqual({value: 3, done: false});
  expect(iterator.next()).toEqual({value: 4, done: false});
  expect(iterator.next()).toEqual({value: 5, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});
});

test('IteratorClose', () => {
  const c = closeable();
  expect(() => {
    for (const x of compose(map(throws), map(throws))(c)) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);
  for (const x of compose(map(x => x), map(x => x))(c)) {
    break;
  }
  expect(c.closeCalls).toBe(2);
});
