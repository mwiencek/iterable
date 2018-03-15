import {
  any,
  drop,
  map,
  take,
} from '../';

test('any', () => {
  const array = [1, 2, 3];

  expect(any(x => x > 2)([])).toBe(false);
  expect(any(x => x > 2)(array)).toBe(true);
  expect(any(x => x < 1)(array)).toBe(false);
  expect(any(x => x > 0)(map(x => -x)(array))).toBe(false);
  expect(any(x => x === 0)(drop(1)(map(x => x - 1)(array)))).toBe(false);
  expect(any(x => x === 0)(take(1)(map(x => x - 1)(array)))).toBe(true);
});
