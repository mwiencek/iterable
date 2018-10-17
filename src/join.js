/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import type {IterableExt} from './types';

export default function join(sep: string): (IterableExt<string>) => string {
  return function (iterable: IterableExt<string>) {
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
