/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const keyBy = func => iterable => {
  const iterator = iterable[Symbol.iterator]();
  let cursor;
  let keyed = new Map();
  while (!(cursor = iterator.next()).done) {
    const value = cursor.value;
    keyed.set(func(value), value);
  }
  return keyed;
};

export default keyBy;
