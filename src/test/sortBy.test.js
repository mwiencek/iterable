// @flow

import {
  map,
  sortBy,
  take,
  toArray,
} from '../';

const items2sort = [
  {value: 7, index: 0},
  {value: 7, index: 1},
  {value: 0, index: 2},
  {value: 5, index: 3},
  {value: 0, index: 4},
  {value: 7, index: 5},
  {value: 1, index: 6},
  {value: 7, index: 7},
  {value: 2, index: 8},
  {value: 3, index: 9},
];

test('sortBy', () => {
  expect(toArray(sortBy(x => x.value)(items2sort))).toEqual([
    {value: 0, index: 2},
    {value: 0, index: 4},
    {value: 1, index: 6},
    {value: 2, index: 8},
    {value: 3, index: 9},
    {value: 5, index: 3},
    {value: 7, index: 0},
    {value: 7, index: 1},
    {value: 7, index: 5},
    {value: 7, index: 7},
  ]);

  expect(
    toArray(
      sortBy(x => x.value)(
        map(x => ({value: -x.value, index: x.index}))(items2sort)
      )
    )
  ).toEqual([
    {value: -7, index: 0},
    {value: -7, index: 1},
    {value: -7, index: 5},
    {value: -7, index: 7},
    {value: -5, index: 3},
    {value: -3, index: 9},
    {value: -2, index: 8},
    {value: -1, index: 6},
    {value: -0, index: 2},
    {value: -0, index: 4},
  ]);
});
