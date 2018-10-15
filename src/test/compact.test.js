// @flow

import {
  compact,
  map,
  toArray,
} from '../';

test('compact', () => {
  const a: $ReadOnlyArray<{|+x: number|} | null> = [{x: 1}, null];
  expect(toArray(map(x => x.x)(compact(a)))).toEqual([1]);
});
