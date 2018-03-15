/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const head = iterable => {
  for (const value of iterable) {
    return value;
  }
  throw new Error('head: empty list');
};

export default head;
