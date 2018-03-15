import {
  compose,
  concat,
  filter,
  map,
  toArray,
  uniq,
} from '../';
import mediums from './mediums';
import {spyFactory, badMap, badProp} from './util';

test('filter', () => {
  const existingArtists = compose(
    filter(x => x.id),
    uniq,
    map(x => x.artist),
    concat,
    map(x => x.artistCredit.names),
    concat,
    map(x => x.tracks),
  )(mediums);

  expect(toArray(existingArtists)).toEqual([
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
  ]);

  const evens = filter(x => x % 2 === 0);
  const odds = filter(x => x % 2 !== 0);

  let iterable = evens([1, 2, 3]);
  expect(toArray(iterable)).toEqual([2]);

  iterable = odds([1, 2, 3]);
  expect(toArray(iterable)).toEqual([1, 3]);

  iterable = filter(x => !x.prop)([{prop: 6}, {prop: NaN}]);
  expect(toArray(iterable)).toEqual([{prop: NaN}]);

  iterable = odds(concat([[1], [3], [7]]));
  expect(toArray(iterable)).toEqual([1, 3, 7]);

  // Manual iteration
  // $FlowFixMe
  let iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({value: 1, done: false});
  expect(iterator.next()).toEqual({value: 3, done: false});
  expect(iterator.next()).toEqual({value: 7, done: false});
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  iterable = evens(concat([[1], [3], [7]]));
  expect(toArray(iterable)).toEqual([]);

  // Manual iteration
  // $FlowFixMe
  iterator = iterable[Symbol.iterator]();
  expect(iterator.next()).toEqual({done: true});
  expect(iterator.next()).toEqual({done: true});

  // Lazy iterator creation
  const lazySpy = spyFactory(filter(badProp));
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
});
