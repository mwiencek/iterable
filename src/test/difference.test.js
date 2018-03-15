import {
  difference,
  toArray,
} from '../';

test('difference', () => {
  const setA = [0, 1, 2, 3, 4];
  const setB = [-2, 0, 2, 4, 6];

  expect(toArray(difference([setA, setB]))).toEqual([1, 3]);
  // Shouldn't maintain state between calls.
  expect(toArray(difference([setA, setB]))).toEqual([1, 3]);
  setA.push(5);
  setB.push(1);
  const iterable = difference([setA, setB]);
  expect(toArray(iterable)).toEqual([3, 5]);

  const a = Symbol();
  const b = Symbol();
  const c = Symbol();
  const d = Symbol();
  expect(toArray(difference([[a, b, c, d], [b, c], [c, d]]))).toEqual([a]);

  // Set difference
  expect(toArray(difference([
    new Set([a, b, c, d]),
    new Set([b, c]),
    new Set([c, d]),
  ]))).toEqual([a]);

  expect(toArray(difference([]))).toEqual([]);
  expect(toArray(difference([[], []]))).toEqual([]);
});
