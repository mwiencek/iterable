/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import map from './map';
import toArray from './toArray';
import compareAscending from './util/compareAscending';

const cmp = (a, b) => {
  const result = compareAscending(a[1], b[1]);
  return result ? result : (a[0] - b[0]);
};

function doSortBy<T, K>(func: (T) => K, iterable: Iterable<T>): Iterable<T> {
  const array = Array.isArray(iterable) ? iterable : toArray(iterable);
  const size = array.length;

  type KP = [number, K];
  const keys: Array<KP> = new Array(size);

  for (let i = 0; i < size; i++) {
    keys[i] = [i, func(array[i])];
  }

  keys.sort(cmp);

  return map<KP, T>((x: KP) => array[x[0]])(keys);
}

export default function sortBy<T, K>(func: (T) => K): (Iterable<T>) => Iterable<T> {
  return function (iterable: Iterable<T>): Iterable<T> {
    return doSortBy<T, K>(func, iterable);
  };
}
