/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

type KeyByDef<T, K> = (Iterable<T>) => Map<K, T>;

const keyBy = <T, K>(func: (T) => K): KeyByDef<T, K> =>
  (iterable: Iterable<T>): Map<K, T> =>
    {
      // $FlowFixMe - https://github.com/facebook/flow/issues/1163
      const iterator = iterable[Symbol.iterator]();
      let cursor;
      let keyed: Map<K, T> = new Map();
      while (!(cursor = iterator.next()).done) {
        const value = cursor.value;
        keyed.set(func(value), value);
      }
      return keyed;
    };

export default keyBy;
