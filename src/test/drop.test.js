import {
  concat,
  drop,
  take,
  toArray,
} from '../';
import {
  badMap,
  closeable,
  spyFactory,
  throws,
} from './util';

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

test('IteratorClose', () => {
  expect(() => {
    for (const x of drop(1)([1, 2, 3])) {
      break;
    }
  }).not.toThrow();

  const c = closeable();
  for (const x of drop(1)(c)) {
    break;
  }
  expect(c.closeCalls).toBe(1);
});
