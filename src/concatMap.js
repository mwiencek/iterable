/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function concatMap<T, U>(func: (T) => Iterable<U>): (Iterable<T>) => Generator<U, void, void> {
  return function* (iterable: Iterable<T>): Generator<U, void, void> {
    for (const value of iterable) {
      yield* func(value);
    }
  }
}
