/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {EMPTY_ITERATOR, TAKE} from './constants';
import makeTerable from './Terable';
import type {Terable} from './types';

export default function take(count: number) {
  return function <T>(iterable: Iterable<T>): Terable<T> | typeof EMPTY_ITERATOR {
    if (count <= 0) {
      return EMPTY_ITERATOR;
    }
    return makeTerable({type: TAKE, arg: count, source: iterable});
  };
}
