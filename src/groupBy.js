/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

type GroupByDef<T, K> = (Iterable<T>) => Map<K, Array<T>>;

const groupBy = <T, K>(func: (T) => K): GroupByDef<T, K> =>
  (iterable: Iterable<T>): Map<K, Array<T>> =>
    {
      // $FlowFixMe - https://github.com/facebook/flow/issues/1163
      const iterator = iterable[Symbol.iterator]();
      let cursor;
      let groups: Map<K, Array<T>> = new Map();
      while (!(cursor = iterator.next()).done) {
        const value = cursor.value;
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

export default groupBy;
