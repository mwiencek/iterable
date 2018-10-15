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
  expect(toArray(compose(map(x => x))([5]))).toEqual([5]);

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

  // Iterator is done
  const iterator: any = (newIds: any)[Symbol.iterator]();
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

  expect((compose(map(x => x))([]): any).return()).toEqual({done: true});
});
