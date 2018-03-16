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

  const truth = compose(
    foldl((accum, k) => {
      accum[k] = count++;
      return accum;
    }, ({}: $Shape<typeof object>)),
    compact,
    map(([k, v]) => v ? k : null),
    entries,
  );

  expect(truth(object)).toEqual({a: 0, c: 1});

  expect(
    join('')(compose(Object.keys, truth)(object).sort())
  ).toBe('ac');
});
