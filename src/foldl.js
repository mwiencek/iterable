/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import type {IterableExt} from './types';

function makeFold<T, U>(func: (U, T) => U, initial: U): (IterableExt<T>) => U {
  return function (iterable: IterableExt<T>): U {
    let accum = initial;
    for (const value of iterable) {
      accum = func(accum, value);
    }
    return accum;
  };
}

export default function foldl<T, U>(func: (U, T) => U): (U) => (IterableExt<T>) => U {
  return function (initial: U): (IterableExt<T>) => U {
    return makeFold<T, U>(func, initial);
  };
}
