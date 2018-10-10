/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function boolFold<T>(truth: boolean): ((T) => mixed) => Iterable<T> => boolean {
  return function (test: (T) => mixed): Iterable<T> => boolean {
    return function (iterable: Iterable<T>): boolean {
      for (const value of iterable) {
        if (!!test(value) === truth) {
          return truth;
        }
      }
      return !truth;
    };
  };
};
