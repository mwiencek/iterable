// @flow

import asyncMap from '../async/map';
import {makeAsyncIterator} from './util';

test('async', async () => {
  let counter = 3;
  let it = makeAsyncIterator([3, 2, 1]);
  // $FlowFixMe
  for await (const x of asyncMap(x => x * 2)(it)) {
    expect(x).toBe((counter--) * 2);
  }
  expect(it.closeCalls).toBe(0);

  it = makeAsyncIterator([1, 2]);
  // $FlowFixMe
  for await (const x of it) {
    break;
  }
  expect(it.closeCalls).toBe(1);
});
