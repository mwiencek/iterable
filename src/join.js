/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export default function join(sep: string) {
  return function (iterable: Iterable<string>) {
    let joined = '';
    for (const value of iterable) {
      if (joined) {
        joined += sep;
      }
      joined += value;
    }
    return joined;
  };
}
