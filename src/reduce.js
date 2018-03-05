/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

type ReduceDef<T, U> = (Iterable<T>) => U;

const reduce = <T, U>(func: (U, T) => U, accum: U): ReduceDef<T, U> =>
  (iterable: Iterable<T>): U =>
    {
      // $FlowFixMe - https://github.com/facebook/flow/issues/1163
      const iterator = iterable[Symbol.iterator]();
      let cursor;
      while (!(cursor = iterator.next()).done) {
        accum = func(accum, cursor.value);
      }
      return accum;
    };

export default reduce;
