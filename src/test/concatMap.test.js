// @flow

import {
  compact,
  compose,
  concatMap,
  filter,
  join,
  map,
  toArray,
  uniq,
} from '../';
import mediums from './mediums';
import {
  badMap,
  badProp,
  closeable,
  spyFactory,
  throws,
} from './util';

test('concatMap', () => {
  const existingArtists = compose(
    uniq,
    compact,
    map(x => x.artist.id),
    concatMap(x => x.artistCredit.names),
    concatMap(x => x.tracks),
  )(mediums);

  expect(toArray(existingArtists)).toEqual([1, 2, 3, 4, 5]);

  expect(
    toArray(concatMap(x => [x, x])([1, 2, 3]))
  ).toEqual([1, 1, 2, 2, 3, 3]);

  expect(
    toArray(
      compose(
        filter(x => x[0] % 2 === 0),
        concatMap(x => [[x]]),
        concatMap(x => [x, x]),
        map(x => x + 1)
      )([1, 2, 3])
    )
  ).toEqual([[2], [2], [4], [4]]);

  expect(
    join('')(
      concatMap(x => {
        const code = x.charCodeAt(0);
        return [
          String.fromCharCode(code),
          String.fromCharCode(code + 1),
        ];
      })('abc')
    )
  ).toEqual('abbccd');

  // Lazy iterator creation
  const lazySpy = spyFactory(concatMap(badProp));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
});

test('IteratorClose', () => {
  let c = closeable(1);
  expect(() => {
    for (const x of concatMap(throws)(c)) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);

  for (const x of concatMap(x => [x, x * 2])(c)) {
    break;
  }
  expect(c.closeCalls).toBe(2);

  for (const x of concatMap(x => compact([x, x * 2]))(c)) {
    break;
  }
  expect(c.closeCalls).toBe(3);
});
