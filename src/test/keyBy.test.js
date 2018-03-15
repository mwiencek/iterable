import {
  keyBy,
  toArray,
} from '../';

test('keyBy', () => {
  const key1 = Symbol();
  const key2 = Symbol();

  const item1 = {key: key1, value: 'a'};
  const item2 = {key: key2, value: 'b'};
  const item3 = {key: key2, value: 'c'};

  const groups = new Set([item1, item2, item3]);

  expect(toArray(keyBy(x => x.key)(groups))).toEqual([
    [key1, item1],
    [key2, item3],
  ]);
});
