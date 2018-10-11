// @flow

import {
  compose,
  concat,
  filter,
  head,
  map,
  take,
  toArray,
  uniq,
  uniqBy,
} from '../';
import {
  badMap,
  closeable,
  spyFactory,
  throws,
} from './util';

test('take', () => {
  const iterable = take(2)([1, 2, 3]);
  expect(toArray(iterable)).toEqual([1, 2]);

  expect(toArray(take(0)([1]))).toEqual([]);
  expect(toArray(take(-1)([1]))).toEqual([]);

  expect(
    toArray(filter(x => x % 2 === 0)(take(2)([1, 2, 3, 4])))
  ).toEqual([2]);

  expect(
    toArray(uniq(take(2)([1, 1, 2])))
  ).toEqual([1]);

  expect(
    toArray(uniqBy(x => x % 2)(take(2)([1, 1, 2])))
  ).toEqual([1]);

  // Iterator is done
  // $FlowFixMe
  const iterator = iterable[Symbol.iterator]();
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
      filter(x => x % 2 === 0),
      take(6),
    )([1, 2, 3, 4, 5, 6])
  ).toEqual([2, 4, 6]);

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

test('IteratorClose', () => {
  expect(() => {
    for (const x of take(1)([1])) {
      break;
    }
  }).not.toThrow();

  let c = closeable();
  for (const x of take(1)(c)) {
    break;
  }
  expect(c.closeCalls).toBe(1);

  c = closeable(1, 1);
  for (const x of take(1)(c)) {}
  expect(c.closeCalls).toBe(1);

  for (const x of take(2)(c)) {}
  expect(c.closeCalls).toBe(1);
});

test('iterator is an iterable', () => {
  const it = take(2)([1, 2, 3])[Symbol.iterator]();

  expect(it[Symbol.iterator]()).toBe(it);

  for (const x of it) {
    expect(x).toBe(1);
    break;
  }

  for (const x of it) {
    expect(x).toBe(2);
  }
});
