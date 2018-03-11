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
  difference,
  each,
  filter,
  filterP,
  flatMap,
  flatten,
  groupBy,
  intersection,
  join,
  keyBy,
  map,
  mapP,
  reduce,
  reject,
  rejectP,
  take,
  toArray,
  uniq,
  uniqBy,
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

test('difference', () => {
  const source = [0, 1, 2, 3, 4];
  const target = [-2, 0, 2, 4, 6];
  const _diff = difference(source);

  expect(toArray(_diff(target))).toEqual([-2, 6]);
  // Shouldn't maintain state between calls.
  expect(toArray(_diff(target))).toEqual([-2, 6]);
  source.splice(0, 0, -2);
  target.push(8);
  const iterable = _diff(target);
  expect(toArray(iterable)).toEqual([6, 8]);
  // Should be able to reuse the iterable.
  source.push(6);
  target.push(10);
  expect(toArray(iterable)).toEqual([8, 10]);

  const a = Symbol();
  const b = Symbol();

  expect(
    toArray(difference(new Set([a]))(new Set([a, b])))
  ).toEqual([b]);
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

test('groupBy', () => {
  const key1 = {type: 'x'};
  const key2 = {type: 'y'};

  const item1 = {key: key1, value: 'a'};
  const item2 = {key: key2, value: 'b'};
  const item3 = {key: key2, value: 'c'};
  const item4 = {key: key1, value: 'd'};

  const groups = new Set([item1, item2, item3, item4]);
  const grouper = groupBy(x => x.key);
  const joinValues = compose(join(', '), map(x => x.value));

  expect(toArray(grouper(groups).entries())).toEqual([
    [key1, [item1, item4]],
    [key2, [item2, item3]],
  ]);

  expect(
    compose(
      join(' / '),
      map(([key, values]) => key.type + ': ' + joinValues(values)),
      grouper,
    )(groups)
  ).toBe('x: a, d / y: b, c');
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

test('intersection', () => {
  const source = [0, 1, 2, 3, 4];
  const target = [-2, 0, 2, 4, 6];
  const _intersect = intersection(source);

  expect(toArray(_intersect(target))).toEqual([0, 2, 4]);
  // Shouldn't maintain state between calls.
  expect(toArray(_intersect(target))).toEqual([0, 2, 4]);
  source.splice(0, 1);
  source.push(5, 6);
  const iterable = _intersect(target);
  expect(toArray(iterable)).toEqual([2, 4, 6]);
  // Should be able to reuse the iterable.
  source.push(8);
  target.push(8);
  expect(toArray(iterable)).toEqual([2, 4, 6, 8]);
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

test('keyBy', () => {
  const key1 = Symbol();
  const key2 = Symbol();

  const item1 = {key: key1, value: 'a'};
  const item2 = {key: key2, value: 'b'};
  const item3 = {key: key2, value: 'c'};

  const groups = new Set([item1, item2, item3]);

  expect(toArray(keyBy(x => x.key)(groups))).toEqual([
    [key1, item1],
    [key2, item3],
  ]);
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

  let index = 1;
  expect(
    compose(
      reduce((accum, value) => accum + (value * (index++)), 0),
      map(value => value.charCodeAt(0)),
      flatten,
      reduce((accum, value) => accum.concat([[value]]), []),
      flatten, // Should be a no-op.
      reduce((accum, value) => value + accum, ''),
    )(['a', 'b', 'c'])
  ).toBe(586);
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

test('take', () => {
  expect(toArray(take(2)([1, 2, 3]))).toEqual([1, 2]);

  expect(
    compose(
      toArray,
      take(3),
      flatten,
    )([1, [[2, 3], [4]], [5]])
  ).toEqual([1, 2, 3]);

  expect(
    compose(
      toArray,
      flatten,
      take(1),
    )([[[1, 2], [3]], [4], 5])
  ).toEqual([1, 2, 3]);

  expect(
    compose(
      toArray,
      take(4),
      flatten,
      take(1),
    )([[[1], [2], [3]], [4]])
  ).toEqual([1, 2, 3]);

  let iteratorCalls = 0;
  const flattenSpy = function (source) {
    const iterable = flatten(source);
    const iterator = iterable[Symbol.iterator];
    iterable[Symbol.iterator] = function () {
      iteratorCalls++;
      return iterator.call(iterable);
    };
    return iterable;
  };
  expect(compose(toArray, take(0), flattenSpy)([[0]])).toEqual([]);
  expect(iteratorCalls).toBe(0);

  let calls = 0;
  let plus1 = map(x => { calls++; return x + 1 });
  let take0 = take(0);
  let take1 = take(1);
  let take3 = take(3);
  let take4 = take(4);
  let array = [1, 2, 3];

  expect(compose(toArray, plus1, take0)(array)).toEqual([]);
  expect(compose(toArray, plus1, take0, take3)(array)).toEqual([]);
  expect(compose(toArray, plus1, take3, take0)(array)).toEqual([]);
  expect(compose(toArray, take0, plus1)(array)).toEqual([]);
  expect(compose(toArray, take0, plus1, take3)(array)).toEqual([]);
  expect(compose(toArray, take0, take3, plus1)(array)).toEqual([]);
  expect(compose(toArray, take3, plus1, take0)(array)).toEqual([]);
  expect(compose(toArray, take3, take0, plus1)(array)).toEqual([]);

  expect(calls).toBe(0);

  let result;
  result = compose(toArray, plus1, take1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(1);

  result = compose(toArray, plus1, take1, take3)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(2);

  result = compose(toArray, plus1, take4, take1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(3);

  result = compose(toArray, take1, plus1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(4);

  result = compose(toArray, take1, plus1, take4)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(5);

  result = compose(toArray, take1, take4, plus1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(6);

  result = compose(toArray, take4, plus1, take1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(7);

  result = compose(toArray, take4, take1, plus1)(array);
  expect(result).toEqual([2]);
  expect(calls).toBe(8);
});

test('uniq', () => {
  const source = [1, 1, 2, 3, 1];
  const _uniq = uniq(source);

  expect(toArray(_uniq)).toEqual([1, 2, 3]);
  // Shouldn't maintain state between calls.
  expect(toArray(_uniq)).toEqual([1, 2, 3]);
  source.push(4, 4);
  expect(toArray(_uniq)).toEqual([1, 2, 3, 4]);

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
});
