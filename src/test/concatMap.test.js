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
import {spyFactory, badMap, badProp} from './util';

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
