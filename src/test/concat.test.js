import {
  concat,
  join,
  map,
  toArray,
} from '../';
import {
  badMap,
  closeable,
  spyFactory,
  throws,
} from './util';

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

test('IteratorClose', () => {
  let c = closeable(1);
  expect(() => {
    for (const x of concat([map(throws)(c)])) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);

  for (const x of concat([map(x => x)(c)])) {
    break;
  }
  expect(c.closeCalls).toBe(2);

  for (const x of concat(map(x => [x])(c))) {
    break;
  }
  expect(c.closeCalls).toBe(3);
});
