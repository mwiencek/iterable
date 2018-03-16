// @flow

import Immutable from 'immutable';
import {
  compact,
  compose,
  concat,
  concatMap,
  join,
  toArray,
  toObject,
  uniq,
} from '../';

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
