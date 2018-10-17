/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import concat from './concat';
import type {IterableExt} from './types';

export default function union<T>(sets: IterableExt<IterableExt<T>>): Set<T> {
  return new Set(concat(sets))
}
