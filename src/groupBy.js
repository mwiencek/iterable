/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const groupBy = func => iterable => {
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

export default groupBy;
