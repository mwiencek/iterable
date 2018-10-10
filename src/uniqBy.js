/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import makeTerable, {UNIQBY} from './Terable';

export default function uniqBy<T, U>(func: (T) => U): (Iterable<T>) => Iterator<T> {
  return function (iterable: Iterable<T>): Iterator<T> {
    return makeTerable(UNIQBY, {mapper: func, set: new Set()}, iterable);
  };
}
