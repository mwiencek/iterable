import {
  compose,
  map,
  toArray,
  uniq,
} from '../';
import {spyFactory, badMap} from './util';

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
