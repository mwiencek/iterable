/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {MAP} from './constants';
import makeTerable from './Terable';

export default function map<T, U>(func: (T) => U): (Iterable<T>) => Iterable<U> {
  return function (iterable: Iterable<T>): Iterable<U> {
    return makeTerable({type: MAP, arg: func, source: iterable});
  };
}
