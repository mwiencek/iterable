/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import type {IterableExt} from './types';

export default function each<T>(func: (T) => mixed): (IterableExt<T>) => void {
  return function (iterable: IterableExt<T>) {
    for (const value of iterable) {
      func(value);
    }
  };
}
