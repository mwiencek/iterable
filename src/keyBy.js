/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import type {IterableExt} from './types';

export default function keyBy<T, K>(func: (T) => K): (IterableExt<T>) => Map<K, T> {
  return function (iterable: IterableExt<T>): Map<K, T> {
    let keyed = new Map();
    for (const value of iterable) {
      keyed.set(func(value), value);
    }
    return keyed;
  };
}
