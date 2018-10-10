/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function groupBy<T, K>(func: (T) => K): (Iterable<T>) => Map<K, Array<T>> {
  return function (iterable: Iterable<T>): Map<K, Array<T>> {
    let groups = new Map();
    for (const value of iterable) {
      const key = func(value);
      let values = groups.get(key);
      if (values) {
        values.push(value);
      } else {
        groups.set(key, [value]);
      }
    }
    return groups;
  };
}
