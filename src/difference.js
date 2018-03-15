/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const difference = sets => {
  let result;
  for (const subset of sets) {
    if (!result) {
      result = new Set(subset);
    } else {
      for (const value of subset) {
        result.delete(value);
      }
    }
  }
  return result || (new Set());
};

export default difference;
