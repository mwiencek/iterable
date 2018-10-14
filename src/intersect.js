/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function intersect<T>(sets: Iterable<Iterable<T>>): Set<T> {
  let valueSets = new Map();
  let setCount = 0;
  for (const subset of sets) {
    setCount++;
    for (const value of subset) {
      let setsWithValue = valueSets.get(value);
      if (setsWithValue) {
        if (setsWithValue[setsWithValue.length - 1] !== setCount) {
          setsWithValue.push(setCount);
        }
      } else {
        valueSets.set(value, [setCount]);
      }
    }
  }
  const result = new Set();
  for (const [value, setsWithValue] of valueSets) {
    if (setsWithValue.length === setCount) {
      result.add(value);
    }
  }
  return result;
}
