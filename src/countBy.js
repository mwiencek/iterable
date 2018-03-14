/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const countBy = func => iterable => {
  const iterator = iterable[Symbol.iterator]();
  let cursor;
  let groups = new Map();
  while (!(cursor = iterator.next()).done) {
    const key = func(cursor.value);
    groups.set(key, (groups.get(key) || 0) + 1);
  }
  return groups;
};

export default countBy;
