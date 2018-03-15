/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const boolFold = truth => test => iterable => {
  for (const value of iterable) {
    if (!!test(value) === truth) {
      return truth;
    }
  }
  return !truth;
};

export default boolFold;
