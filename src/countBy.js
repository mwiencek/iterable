/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function countBy<T, K>(func: (T) => K): (Iterable<T>) => Map<K, number> {
  return function (iterable: Iterable<T>): Map<K, number> {
    let groups = new Map();
    for (const value of iterable) {
      const key = func(value);
      groups.set(key, (groups.get(key) || 0) + 1);
    }
    return groups;
  };
}
