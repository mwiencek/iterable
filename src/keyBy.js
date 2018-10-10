/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function keyBy<T, K>(func: (T) => K) {
  return function (iterable: Iterable<T>): Map<K, T> {
    let keyed = new Map();
    for (const value of iterable) {
      keyed.set(func(value), value);
    }
    return keyed;
  };
}
