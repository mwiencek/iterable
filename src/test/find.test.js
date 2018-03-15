import {
  find,
} from '../';

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
