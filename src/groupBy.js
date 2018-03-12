/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const groupBy = func => iterable => {
  const iterator = iterable[Symbol.iterator]();
  let cursor;
  let groups = new Map();
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
