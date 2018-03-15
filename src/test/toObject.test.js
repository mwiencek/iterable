import {toObject} from '../';

test('toObject', () => {
  const foo = Symbol();
  const bar = NaN;
  const baz = {};

  const source = [[foo, 'foo'], [bar, 'bar'], [baz, 'baz']];

  expect(toObject(source)).toEqual({
    // $FlowFixMe
    [foo]: 'foo',
    'NaN': 'bar',
    '[object Object]': 'baz',
  });

  expect(toObject(new Map([['a', 'b']]))).toEqual({a: 'b'});
});
