/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {
  all,
  any,
  compact,
  compose,
  difference,
  drop,
  each,
  filter,
  find,
  concat,
  concatMap,
  groupBy,
  head,
  intersection,
  join,
  keyBy,
  map,
  reduce,
  take,
  toArray,
  toObject,
  uniq,
  uniqBy,
} from '../index';

import entries from 'object.entries';
import Immutable from 'immutable';
import mediums from './mediums';

function spyFactory(util: (Iterable<any>) => any) {
  const spy = function (source: Iterable<any>) {
    const iterable: any = util(source);
    const iterator: any = iterable[Symbol.iterator];

    iterator[Symbol.iterator] = function () {
      spy.calls++;
      return iterator.call(iterable);
    };

    return iterator;
  };
  spy.calls = 0;
  return spy;
}

const badProp = (x: any) => x.y.z;
const badMap = map(badProp);

test('all', () => {
  const array = [1, 2, 3];

  expect(all(x => x > 0)([])).toBe(true);
  expect(all(x => x > 0)(array)).toBe(true);
  expect(all(x => x > 1)(array)).toBe(false);
  expect(all(x => x > 0)(map(x => -x)(array))).toBe(false);
  expect(all(x => x > 0)(drop(1)(map(x => x - 1)(array)))).toBe(true);
});

test('any', () => {
  const array = [1, 2, 3];

  expect(any(x => x > 2)([])).toBe(false);
  expect(any(x => x > 2)(array)).toBe(true);
  expect(any(x => x < 1)(array)).toBe(false);
  expect(any(x => x > 0)(map(x => -x)(array))).toBe(false);
  expect(any(x => x === 0)(drop(1)(map(x => x - 1)(array)))).toBe(false);
  expect(any(x => x === 0)(take(1)(map(x => x - 1)(array)))).toBe(true);
});

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

  // Manual iteration
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 8, done: false});
  expect(iterator.next()).toEqual({value: 10, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(difference([{}]));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);

  const a = Symbol();
  const b = Symbol();

  // Set difference
  const setDiff = difference(new Set([a]))(new Set([a, b]));
  expect(toArray(setDiff)).toEqual([b]);
  expect(toArray(new Set(setDiff))).toEqual([b]);
});

test('drop', () => {
  const array = [1, 2, 3];

  expect(toArray(drop(0)(array))).toEqual([1, 2, 3]);
  expect(toArray(drop(1)(array))).toEqual([2, 3]);
  expect(toArray(drop(2)(array))).toEqual([3]);

  expect(toArray(drop(1)(take(2)(array)))).toEqual([2]);
  expect(toArray(take(1)(drop(2)(array)))).toEqual([3]);

  const nested = [[1, 2, 3], [4]];
  expect(toArray(concat(drop(1)(nested)))).toEqual([4]);
  expect(toArray(drop(1)(concat(nested)))).toEqual([2, 3, 4]);

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

  // Manual iteration
  // $FlowFixMe
  let iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({value: 3, done: false});
  expect(iterator.next()).toEqual({value: 7, done: false});
  expect(iterator.next()).toEqual({done: true});
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

test('concatMap', () => {
  const existingArtists = compose(
    uniq,
    compact,
    map(x => x.artist.id),
    concatMap(x => x.artistCredit.names),
    concatMap(x => x.tracks),
  )(mediums);

  expect(toArray(existingArtists)).toEqual([1, 2, 3, 4, 5]);

  expect(
    toArray(concatMap(x => [x, x])([1, 2, 3]))
  ).toEqual([1, 1, 2, 2, 3, 3]);

  expect(
    toArray(
      compose(
        filter(x => x[0] % 2 === 0),
        concatMap(x => [[x]]),
        concatMap(x => [x, x]),
        map(x => x + 1)
      )([1, 2, 3])
    )
  ).toEqual([[2], [2], [4], [4]]);

  expect(
    join('')(
      concatMap(x => {
        const code = x.charCodeAt(0);
        return [
          String.fromCharCode(code),
          String.fromCharCode(code + 1),
        ];
      })('abc')
    )
  ).toEqual('abbccd');

  // Lazy iterator creation
  const lazySpy = spyFactory(concatMap(badProp));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
});

test('concat', () => {
  expect(toArray(concat([[1], [2], [3]]))).toEqual([1, 2, 3]);

  expect(toArray(concat([[1], [[2]], [3]]))).toEqual([1, [2], 3]);

  expect(toArray(concat([]))).toEqual([]);

  expect(
    toArray(concat(['ab', 'cd']))
  ).toEqual(['a', 'b', 'c', 'd']);

  expect(
    toArray(concat([[]]))
  ).toEqual([]);

  const iterable = concat([[[0], []], [1]]);
  expect(toArray(iterable)).toEqual([[0], [], 1]);

  // Manual iteration
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: [0], done: false});
  expect(iterator.next()).toEqual({value: [], done: false});
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(concat);
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);

  expect(join('+')(concat(''))).toEqual('');
  expect(join('+')(concat('abc'))).toEqual('a+b+c');
});

test('find', () => {
  const haystack = [
    {a: 1, b: 4},
    {a: 2, b: 5},
    {a: 3, b: 6},
  ];
  expect(find(x => x.a === 1)(haystack).b).toBe(4);
  expect(find(x => x.b > 5)(haystack).a).toBe(3);
  expect(find(x => x > 'a')('abc')).toBe('b');
  expect(find(Array.isArray)(new Set([1, [2], 3]))).toEqual([2]);
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

test('head', () => {
  const array = [1, 2, 3];

  expect(head(array)).toBe(1);

  expect(() => {
    head([]);
  }).toThrow();

  expect(head(drop(1)(array))).toBe(2);
  expect(head(drop(2)(array))).toBe(3);

  expect(() => {
    head(drop(3)(array));
  }).toThrow();
});

test('Immutable.js', () => {
  /*
   * It probably doesn't make sense to use this library with Immutable.js,
   * since its API already provides all kinds of sequence methods. But this
   * tests that our functions work with external libraries that follow the
   * iterator protocol.
   */
  expect(join('+')(Immutable.List(['a', 'b', 'c']))).toBe('a+b+c');

  const immutMap = Immutable.OrderedMap([['a', 1], ['b', 2]]);
  expect(toArray(concat(immutMap.entries()))).toEqual(['a', 1, 'b', 2]);
  expect(toObject(immutMap)).toEqual({a: 1, b: 2});

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
      concatMap(x => [x, 1]),
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

  // Manual iteration
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 2, done: false});
  expect(iterator.next()).toEqual({value: 4, done: false});
  expect(iterator.next()).toEqual({value: 6, done: false});
  expect(iterator.next()).toEqual({value: 8, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(intersection([{}]));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
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

  const iterable = square(concat([[3], [2], [1]]));
  expect(toArray(iterable)).toEqual([9, 4, 1]);

  // Manual iteration
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 9, done: false});
  expect(iterator.next()).toEqual({value: 4, done: false});
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(map(badProp));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
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
    entries,
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
      concat,
      reduce((accum, value) => accum.concat([[value]]), []),
      concat, // Should be a no-op.
      reduce((accum, value) => value + accum, ''),
    )(['a', 'b', 'c'])
  ).toBe(586);

  // Lazy iterator creation
  const lazySpy = spyFactory(
    reduce((accum: any, value: any) => accum + value, '')
  );
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
});

test('take', () => {
  const iterable = take(2)([1, 2, 3]);
  expect(toArray(iterable)).toEqual([1, 2]);

  // Manual iteration
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({value: 2, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(take(1));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);

  expect(
    compose(
      toArray,
      take(3),
      concat,
    )([[1], [[2, 3], [4]], [5]])
  ).toEqual([1, [2, 3], [4]]);

  expect(
    compose(
      toArray,
      take(3),
      concat,
      take(2),
      concat,
    )([
      [[1, 2], [3]],
      [[4, 5], [6]],
    ])
  ).toEqual([1, 2, 3]);

  expect(
    compose(
      toArray,
      take(4),
      concat,
      head,
    )([[[1], [2], [3]], [[4]]])
  ).toEqual([1, 2, 3]);

  const concatSpy = spyFactory(concat);
  expect(compose(toArray, take(0), concatSpy)([[0]])).toEqual([]);
  expect(concatSpy.calls).toBe(0);

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

test('toObject', () => {
  const foo = Symbol();
  const bar = NaN;
  const baz = {};

  const source = [[foo, 'foo'], [bar, 'bar'], [baz, 'baz']];

  expect(toObject(source)).toEqual({
    // $FlowFixMe
    [foo]: 'foo',
    'NaN': 'bar',
    '[object Object]': 'baz',
  });

  expect(toObject(new Map([['a', 'b']]))).toEqual({a: 'b'});
});

test('uniq', () => {
  const source = [1, 1, 2, 3, 1];
  const _uniq = uniq(source);

  expect(toArray(_uniq)).toEqual([1, 2, 3]);
  // Shouldn't maintain state between calls.
  expect(toArray(_uniq)).toEqual([1, 2, 3]);
  source.push(4, 4);
  expect(toArray(_uniq)).toEqual([1, 2, 3, 4]);

  // Manual iteration
  // $FlowFixMe
  const iterator = _uniq[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({value: 2, done: false});
  expect(iterator.next()).toEqual({value: 3, done: false});
  expect(iterator.next()).toEqual({value: 4, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(uniq);
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
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
