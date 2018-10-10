// @flow

import entries from 'object.entries';
import {
  compact,
  compose,
  foldl,
  join,
  map,
} from '../';

test('objects', () => {
  let count = 0;

  const object = {a: true, b: false, c: true};

  type K = $Keys<typeof object>;

  const truth = compose(
    foldl<K, {[K]: number}>((accum, k) => {
      accum[k] = count++;
      return accum;
    })({}),
    compact,
    map(([k, v]) => v ? k : null),
    ((entries: any): typeof Object.entries),
  );

  expect(truth(object)).toEqual({a: 0, c: 1});

  expect(
    join('')(compose(Object.keys, truth)(object).sort())
  ).toBe('ac');
});
