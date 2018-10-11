/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import makeTerable, {MAP} from './Terable';

export default function map<T, U>(func: (T) => U): (Iterable<T>) => Iterator<U> {
  return function (iterable: Iterable<T>): Iterator<U> {
    return makeTerable({type: MAP, arg: func, source: iterable});
  };
}
