/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const toArray = iterable => {
  const array = [];
  for (const value of iterable) {
    array.push(value);
  }
  return array;
};

export default toArray;
