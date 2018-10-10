/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

function makeFold<T, U>(func: (U, T) => U, initial: U): (Iterable<T>) => U {
  return function (iterable: Iterable<T>): U {
    let accum = initial;
    for (const value of iterable) {
      accum = func(accum, value);
    }
    return accum;
  };
}

export default function foldl<T, U>(func: (U, T) => U): (U) => (Iterable<T>) => U {
  return function (initial: U): (Iterable<T>) => U {
    return makeFold<T, U>(func, initial);
  };
}
