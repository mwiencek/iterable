import {
  compose,
  concat,
  foldl,
  map,
} from '../';
import {
  closeable,
  badMap,
  spyFactory,
  throws,
} from './util';

test('foldl', () => {
  expect(
    foldl((accum, value) =>
      Object.assign({}, accum, {[value]: true}), {})('abc')
  ).toEqual({a: true, b: true, c: true});

  const reverseStr = (accum, value) => value + accum;
  const abcs = ['a', 'b', 'c'];

  expect(foldl(reverseStr, '')(abcs)).toEqual('cba');
  // Curried
  const curried = foldl(reverseStr)('');
  expect(curried(abcs)).toEqual('cba');

  // Shouldn't maintain state between calls.
  expect(curried(abcs)).toEqual('cba');

  let index = 1;
  expect(
    compose(
      foldl((accum, value) => accum + (value * (index++)), 0),
      map(value => value.charCodeAt(0)),
      concat,
      foldl((accum, value) => accum.concat([[value]]), []),
      concat, // Should be a no-op.
      foldl((accum, value) => value + accum, ''),
    )(abcs)
  ).toBe(586);

  // Lazy iterator creation
  const lazySpy = spyFactory(
    foldl((accum: any, value: any) => accum + value, '')
  );
  // $FlowFixMe
  badMap(lazySpy([{}]))[Symbol.iterator]();
  expect(lazySpy.calls).toBe(0);
});

test('IteratorClose', () => {
  const c = closeable();
  expect(() => {
    for (const x of foldl(throws, null)(c)) {}
  }).toThrow();
  expect(c.closeCalls).toBe(1);
});
