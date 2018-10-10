// @flow

import {
  compose,
  concat,
  filter,
  map,
  toArray,
  uniq,
} from '../';
import mediums from './mediums';
import {
  badMap,
  badProp,
  closeable,
  spyFactory,
  throws,
} from './util';

test('filter', () => {
  const existingArtists = compose(
    filter(x => x.id),
    uniq,
    map(x => x.artist),
    concat,
    map(x => x.artistCredit.names),
    concat,
    map(x => x.tracks),
  )(mediums);

  expect(toArray(existingArtists)).toEqual([
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
  ]);

  const evens = filter(x => x % 2 === 0);
  const odds = filter(x => x % 2 !== 0);

  let iterable = evens([1, 2, 3]);
  expect(toArray(iterable)).toEqual([2]);

  iterable = odds([1, 2, 3]);
  expect(toArray(iterable)).toEqual([1, 3]);

  iterable = filter(x => !x.prop)([{prop: 6}, {prop: NaN}]);
  expect(toArray(iterable)).toEqual([{prop: NaN}]);

  iterable = odds(concat([[1], [3], [7]]));
  expect(toArray(iterable)).toEqual([1, 3, 7]);

  // Iterator is done
  // $FlowFixMe
  let iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({done: true});

  iterable = evens(concat([[1], [3], [7]]));
  expect(toArray(iterable)).toEqual([]);

  // Manual iteration
  // $FlowFixMe
  iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(filter(badProp));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
});

test('IteratorClose', () => {
  const c = closeable();
  expect(() => {
    for (const x of filter(throws)(c)) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);

  for (const x of filter(x => true)(c)) {
    break;
  }
  expect(c.closeCalls).toBe(2);
});

test('iterator is an iterable', () => {
  const it = filter(x => true)([1, 2])[Symbol.iterator]();

  expect(it[Symbol.iterator]()).toBe(it);

  for (const x of it) {
    expect(x).toBe(1);
    break;
  }

  for (const x of it) {
    expect(x).toBe(2);
  }
});
