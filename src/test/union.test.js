import {
  toArray,
  union,
} from '../';

test('union', () => {
  const setA = [0, 2, 4, 6, 8];
  const setB = [0, 1, 3, 5, 7];

  expect(toArray(union([setA, setB]))).toEqual(
    [0, 2, 4, 6, 8, 1, 3, 5, 7]
  );
  // Shouldn't maintain state between calls.
  setA.push(10);
  setB.push(9);
  const set = union([setA, setB]);
  expect(toArray(set)).toEqual([0, 2, 4, 6, 8, 10, 1, 3, 5, 7, 9]);

  const a = Symbol();
  const b = Symbol();
  const c = Symbol();
  const d = Symbol();
  expect(toArray(union([[a], [b], [c], [d]]))).toEqual([a, b, c, d]);

  // Set union
  expect(toArray(union([
    new Set([a, a, b]),
    new Set([b, b, c]),
    new Set([c, c, d]),
  ]))).toEqual([a, b, c, d]);

  expect(toArray(union([]))).toEqual([]);
  expect(toArray(union([[], []]))).toEqual([]);
});
