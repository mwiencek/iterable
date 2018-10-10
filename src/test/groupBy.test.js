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
  type KeyT = {|+type: string|};
  type ItemT = {|+key: KeyT, +value: string|};

  const key1: KeyT = {type: 'x'};
  const key2: KeyT = {type: 'y'};

  const item1: ItemT = {key: key1, value: 'a'};
  const item2: ItemT = {key: key2, value: 'b'};
  const item3: ItemT = {key: key2, value: 'c'};
  const item4: ItemT = {key: key1, value: 'd'};

  const groups = new Set([item1, item2, item3, item4]);
  const grouper = groupBy<ItemT, KeyT>(x => x.key);
  const joinValues = compose(join(', '), map<ItemT, string>(x => x.value));

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
