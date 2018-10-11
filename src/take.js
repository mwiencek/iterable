/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {TAKE} from './constants';
import makeTerable from './Terable';

export default function take(count: number) {
  return function <T>(iterable: Iterable<T>): Iterator<T> {
    return makeTerable({type: TAKE, arg: count, source: iterable});
  };
}
