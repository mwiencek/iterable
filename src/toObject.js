/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import type {IterableExt} from './types';

export default function toObject<K, T>(entries: IterableExt<[K, T]>): {[K]: T} {
  const object: {[K]: T} = {};
  for (const [key, value] of entries) {
    object[key] = value;
  }
  return object;
}
