/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {MAP} from '../constants';
import makeAsyncTerable from '../AsyncTerable';

export default function map<T, U>(func: (T) => U): (AsyncIterable<T>) => AsyncIterator<U> {
  return function (iterable: AsyncIterable<T>): AsyncIterator<U> {
    return makeAsyncTerable({type: MAP, arg: func, source: iterable});
  };
}
