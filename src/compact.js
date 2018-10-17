/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {FILTER} from './constants';
import makeTerable from './Terable';
import type {IterableExt, Terable} from './types';

export default function compact<T>(iterable: IterableExt<T>): Terable<$NonMaybeType<T>> {
  return makeTerable({type: FILTER, arg: Boolean, source: iterable});
}
