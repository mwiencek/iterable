/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import filter from './filter';
import head from './head';
import type {IterableExt} from './types';

export default function find<T>(func: (T) => mixed): (IterableExt<T>) => T {
  const filterFunc = filter<T, T>(func);
  return function (iterable: IterableExt<T>): T {
    return head(filterFunc(iterable));
  };
}
