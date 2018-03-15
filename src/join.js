/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const join = sep => iterable => {
  let joined = '';
  for (const value of iterable) {
    if (joined) {
      joined += sep;
    }
    joined += value;
  }
  return joined;
};

export default join;
