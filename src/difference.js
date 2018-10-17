/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import type {IterableExt} from './types';

export default function difference<T>(sets: IterableExt<IterableExt<T>>): Set<T> {
  let result;
  for (const subset of sets) {
    if (result) {
      for (const value of subset) {
        result.delete(value);
      }
    } else {
      result = new Set(subset);
    }
  }
  return result || (new Set());
}
