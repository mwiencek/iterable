/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const join = sep => iterable => {
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
