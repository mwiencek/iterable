// @flow

import {
  compose,
  groupBy,
  join,
  map,
  toArray,
} from '../';
import {
  closeable,
  throws,
} from './util';

test('groupBy', () => {
  const key1 = {type: 'x'};
  const key2 = {type: 'y'};

  const item1 = {key: key1, value: 'a'};
  const item2 = {key: key2, value: 'b'};
  const item3 = {key: key2, value: 'c'};
  const item4 = {key: key1, value: 'd'};

  const groups = new Set([item1, item2, item3, item4]);
  const grouper = groupBy(x => x.key);
  const joinValues = compose(join(', '), map(x => x.value));

  expect(toArray(grouper(groups).entries())).toEqual([
    [key1, [item1, item4]],
    [key2, [item2, item3]],
  ]);

  expect(
    compose(
      join(' / '),
      map(([key, values]) => key.type + ': ' + joinValues(values)),
      grouper,
    )(groups)
  ).toBe('x: a, d / y: b, c');
});

test('IteratorClose', () => {
  const c = closeable();
  expect(() => {
    for (const x of groupBy(throws)(c)) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);
});
