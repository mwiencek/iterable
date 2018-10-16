/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {DROP} from './constants';
import makeTerable from './Terable';
import type {Terable} from './types';

export default function drop(count: number) {
  return function <T>(iterable: Iterable<T>): Terable<T> {
    return makeTerable({type: DROP, arg: count, source: iterable});
  };
}
