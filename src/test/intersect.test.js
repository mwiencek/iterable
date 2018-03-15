import {
  intersect,
  map,
  toArray,
} from '../';

test('intersect', () => {
  const source = [0, 1, 2, 3, 4, 4];
  const target = [-2, -2, 0, 2, 4, 6];

  expect(toArray(intersect([source, target]))).toEqual([0, 2, 4]);
  // Shouldn't maintain state between calls.
  source.splice(0, 1);
  source.push(5, 6);
  const set = intersect([source, target]);
  expect(toArray(set)).toEqual([2, 4, 6]);

  const a = Symbol();
  const b = Symbol();
  const c = Symbol();
  const d = Symbol();
  expect(toArray(intersect([[a, b, c, d], [b, c], [c, d]]))).toEqual([c]);

  // Set intersection
  expect(toArray(intersect([
    new Set([a, b, c, d]),
    new Set([b, c]),
    new Set([c, d]),
  ]))).toEqual([c]);

  expect(toArray(intersect(
    map(x => [x - 1, x, x + 1])([1, 2, 3])
  ))).toEqual([2]);

  expect(toArray(intersect([]))).toEqual([]);
  expect(toArray(intersect([[], []]))).toEqual([]);
});
