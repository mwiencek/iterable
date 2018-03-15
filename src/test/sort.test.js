import {
  compose,
  map,
  sort,
  take,
  toArray,
} from '../';

test('sort', () => {
  expect(toArray(sort([9, 1, 7, 2, 0]))).toEqual([0, 1, 2, 7, 9]);

  expect(
    compose(
      toArray,
      sort,
      map(x => parseInt(x, 10)),
    )(['10', '9', '11', '8'])
  ).toEqual([8, 9, 10, 11]);
});
