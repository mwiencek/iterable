/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

type JoinDef = (Iterable<string>) => string;

const join = (sep: string): JoinDef =>
  (iterable: Iterable<string>): string =>
    {
      // $FlowFixMe - https://github.com/facebook/flow/issues/1163
      const iterator = iterable[Symbol.iterator]();
      let joined = '';
      let cursor;
      while (!(cursor = iterator.next()).done) {
        if (joined) {
          joined += sep;
        }
        joined += cursor.value;
      }
      return joined;
    };

export default join;
