/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import compose from './compose';
import filter from './filter';
import head from './head';

type FindDef<T> = (Iterable<T>) => T;

const find = <T>(func: (T) => mixed): FindDef<T> =>
  compose(head, filter(func));

export default find;
