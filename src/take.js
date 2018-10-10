/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import makeTerable, {TAKE} from './Terable';

export default function take<T>(count: number): (Iterable<T>) => Iterator<T> {
  return function (iterable: Iterable<T>): Iterator<T> {
    return makeTerable(TAKE, count, iterable);
  };
}
