/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function* concat<T>(iterable: Iterable<Iterable<T>>): Generator<T, void, void> {
  for (const value of iterable) {
    yield* value;
  }
}
