/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const boolFold = truth => test => iterable => {
  const iterator = iterable[Symbol.iterator]();
  let cursor;
  while (!(cursor = iterator.next()).done) {
    if (!!test(cursor.value) === truth) {
      return truth;
    }
  }
  return !truth;
};

export default boolFold;
