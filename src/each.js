/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function each<T>(func: (T) => mixed): (Iterable<T>) => void {
  return function (iterable: Iterable<T>) {
    for (const value of iterable) {
      func(value);
    }
  };
}
