/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {
  compact,
  compose,
  each,
  filter,
  filterP,
  flatMap,
  flatten,
  join,
  map,
  mapP,
  reduce,
  reject,
  rejectP,
  toArray,
  uniq,
} from '../index';

import Immutable from 'immutable';
import mediums from './mediums';

test('compose', () => {
  const newIds = compose(
    uniq,
    compact,
    map(x => x.artist.id),
    flatten,
    map(x => x.artistCredit.names),
    flatten,
    map(x => x.tracks),
  )(mediums);
  expect(toArray(newIds)).toEqual([1, 2, 3, 4, 5]);
  // Shouldn't maintain state between calls.
  expect(toArray(newIds)).toEqual([1, 2, 3, 4, 5]);
});

test('each', () => {
  let count1 = 0;
  let count2 = 0;

  let result = each(() => count1++)([0, 0, 0]);
  expect(count1).toBe(3);
  expect(result).toBe(undefined);

  count1 = 0;
  each(() => count1++)(
    filter(x => { count2++; return x > 0 })(
      uniq([-2, -2, -1, -1, 0, 0, 1, 1, 2, 2])
    )
  );
  expect(count1).toBe(2);
  expect(count2).toBe(5);
});

test('filter', () => {
  const evens = filter(x => x % 2 === 0);

  expect(toArray(evens([1, 2, 3]))).toEqual([2]);

  expect(toArray(evens(flatten([[1], [3], [7]])))).toEqual([]);
});

test('filterP', () => {
  const existingArtists = compose(
    filterP('id'),
    uniq,
    mapP('artist'),
    flatten,
    map(x => x.artistCredit.names),
    flatten,
    map(x => x.tracks),
  )(mediums);

  expect(toArray(existingArtists)).toEqual([
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
  ]);
});

test('flatMap', () => {
  const existingArtists = compose(
    uniq,
    compact,
    map(x => x.artist.id),
    flatMap(x => flatten(x.artistCredit.names)),
    flatMap(x => flatten(x.tracks)),
  )(mediums);

  expect(toArray(existingArtists)).toEqual([1, 2, 3, 4, 5]);

  expect(
    toArray(flatMap(x => [x, x])([1, 2, 3]))
  ).toEqual([1, 1, 2, 2, 3, 3]);

  expect(
    toArray(
      compose(
        filter(x => x[0] % 2 === 0),
        flatMap(x => [[x]]),
        flatMap(x => [x, x]),
        map(x => x + 1)
      )([1, 2, 3])
    )
  ).toEqual([[2], [2], [4], [4]]);

  expect(
    toArray(flatMap(x => x)([1, 2, 3]))
  ).toEqual([1, 2, 3]);

  expect(
    join('')(
      flatMap(x => String.fromCharCode(x.charCodeAt(0) + 1))('abc')
    )
  ).toEqual('bcd');

});

test('flatten', () => {
  expect(
    toArray(flatten([]))
  ).toEqual([]);

  expect(
    toArray(flatten([1]))
  ).toEqual([1]);

  expect(
    toArray(flatten([[]]))
  ).toEqual([]);

  expect(
    toArray(flatten([[[0], []], 1]))
  ).toEqual([0, 1]);

  expect(
    toArray(
      flatten(
        [0, [[[1], [[2, 3], 4], [[[5]], 6]], [[[[7], 8, 9]]]]],
      )
    )
  ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  expect(join('+')(flatten(''))).toEqual('');
  expect(join('+')(flatten('abc'))).toEqual('a+b+c');
});

test('Immutable.js', () => {
  /*
   * It probably doesn't make sense to use this library with Immutable.js,
   * since its API already provides all kinds of sequence methods. But this
   * tests that our functions work with external libraries that follow the
   * iterator protocol.
   */

  expect(join('+')(Immutable.List(['a', 'b', 'c']))).toBe('a+b+c');

  expect(
    toArray(flatten(
      Immutable.OrderedMap([['a', 1], ['b', 2]]).entries()
    ))
  ).toEqual(['a', 1, 'b', 2]);

  expect(
    join(' ')(uniq(
      Immutable.OrderedMap([
        ['a', 'is'],
        ['b', 'this'],
        ['c', 'unique'],
        ['d', 'unique'],
        ['e', 'unique'],
        ['f', 'enough?'],
      ]).values()
    ))
  ).toEqual('is this unique enough?');

  expect(toArray(
    compose(
      compact,
      Immutable.Seq,
      flatMap(x => [x, 1]),
    )([0, 0])
  )).toEqual([1, 1])
});

test('join', () => {
  expect(join(', ')(
    filter(x => x !== 'b')(['a', 'b', 'c'])
  )).toBe('a, c');

  expect(
    compose(
      join(' '),
      map(x => x === '+' ? '-' : x),
      join('+'),
      map(x => x === 'b' ? 'B' : x),
    )('abc')
  ).toBe('a - B - c');
});

test('map', () => {
  const square = map(x => x ** 2);

  expect(toArray(square([1, 2, 3]))).toEqual([1, 4, 9]);

  expect(toArray(square(flatten([[3], [2], [1]])))).toEqual([9, 4, 1]);
});

test('mapP', () => {
  const newIds = compose(
    uniq,
    compact,
    mapP('id'),
    mapP('artist'),
    flatten,
    mapP('names'),
    mapP('artistCredit'),
    flatten,
    mapP('tracks'),
  )(mediums);
  expect(toArray(newIds)).toEqual([1, 2, 3, 4, 5]);
});

test('objects', () => {
  let count = 0;

  const object = {a: true, b: false, c: true};

  const truth = compose(
    reduce((accum, k) => {
      accum[k] = count++;
      return accum;
    }, ({}: $Shape<typeof object>)),
    compact,
    map(([k, v]) => v ? k : null),
    Object.entries,
  );

  expect(truth(object)).toEqual({a: 0, c: 1});

  expect(
    join('')(compose(Object.keys, truth)(object).sort())
  ).toBe('ac');
});

test('reduce', () => {
  expect(
    reduce((accum, value) =>
      Object.assign({}, accum, {[value]: true}), {})('abc')
  ).toEqual({a: true, b: true, c: true});

  expect(
    reduce((accum, value) => value + accum, '')(['a', 'b', 'c'])
  ).toEqual('cba');
});

test('reject', () => {
  const odds = reject(x => x % 2 === 0);

  expect(toArray(odds([1, 2, 3]))).toEqual([1, 3]);

  expect(toArray(odds(flatten([[1], [3], [7]])))).toEqual([1, 3, 7]);
});

test('rejectP', () => {
  const newArtists = compose(
    rejectP('id'),
    uniq,
    mapP('artist'),
    flatten,
    map(x => x.artistCredit.names),
    flatten,
    map(x => x.tracks),
  )(mediums);

  expect(toArray(newArtists)).toEqual([{id: null}]);
});

test('uniq', () => {
  const _uniq = uniq([1, 1, 2, 3, 1]);

  expect(toArray(_uniq)).toEqual([1, 2, 3]);
  // Shouldn't maintain state between calls.
  expect(toArray(_uniq)).toEqual([1, 2, 3]);
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
