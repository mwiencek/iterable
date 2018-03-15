import {
  all,
  drop,
  map,
} from '../';

test('all', () => {
  const array = [1, 2, 3];

  expect(all(x => x > 0)([])).toBe(true);
  expect(all(x => x > 0)(array)).toBe(true);
  expect(all(x => x > 1)(array)).toBe(false);
  expect(all(x => x > 0)(map(x => -x)(array))).toBe(false);
  expect(all(x => x > 0)(drop(1)(map(x => x - 1)(array)))).toBe(true);
});
