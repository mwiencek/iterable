import {
  difference,
  toArray,
} from '../';
import {spyFactory, badMap} from './util';

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
