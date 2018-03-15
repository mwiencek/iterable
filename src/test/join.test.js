import {
  compose,
  filter,
  join,
  map,
  take,
} from '../';

test('join', () => {
  expect(join(', ')(
    filter(x => x !== 'b')(['a', 'b', 'c'])
  )).toBe('a, c');

  expect(
    compose(
      join(' '),
      map(x => x === '+' ? '-' : x),
      join('+'),
      map(x => x === 'b' ? 'B' : x),
    )('abc')
  ).toBe('a - B - c');
});
