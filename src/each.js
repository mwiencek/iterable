/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

type EachDef<T> = (Iterable<T>) => void;

const each = <T>(func: (T) => any): EachDef<T> =>
  (iterable: Iterable<T>): void =>
    {
      // $FlowFixMe - https://github.com/facebook/flow/issues/1163
      const iterator = iterable[Symbol.iterator]();
      let cursor;
      while (!(cursor = iterator.next()).done) {
        func(cursor.value);
      }
    };

export default each;
