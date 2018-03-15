import {
  compose,
  concatMap,
  countBy,
  toArray,
  toObject,
} from '../';

test('countBy', () => {
  const key1 = Symbol();
  const key2 = (() => undefined);
  const key3 = null;
  const key4 = 'null';

  const items = [
    {key: key1},
    {key: key2},
    {key: key2},
    {key: key3},
    {key: key3},
    {key: key3},
    {key: key4},
    {key: key4},
    {key: key4},
    {key: key4},
  ];

  expect(toArray(countBy(x => x.key)(items).entries())).toEqual([
    [key1, 1],
    [key2, 2],
    [key3, 3],
    [key4, 4],
  ]);

  expect(
    compose(
      toObject,
      countBy(x => x),
      concatMap(x => [x - 1, x, x + 1]),
    )([0, 1, 2]),
  ).toEqual({
    '-1': 1,
    '0': 2,
    '1': 3,
    '2': 2,
    '3': 1,
  });
});
