/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const toArray = iterable => {
  const iterator = iterable[Symbol.iterator]();
  const array = [];
  let cursor;
  while (!(cursor = iterator.next()).done) {
    array.push(cursor.value);
  }
  return array;
};

export default toArray;
