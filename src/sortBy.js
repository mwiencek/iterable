/*
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

const sortBy = func => iterable => {
  const array = Array.isArray(iterable) ? iterable : toArray(iterable);
  const size = array.length;
  const keys = new Array(size);

  for (let i = 0; i < size; i++) {
    keys[i] = [i, func(array[i])];
  }

  keys.sort(cmp);

  return map(x => array[x[0]])(keys);
};

export default sortBy;
