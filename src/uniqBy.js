/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {UNIQBY} from './Terable';

type UniqByDef<T> = (Iterable<T>) => Iterable<T>;

const uniqBy = <T, U>(func: (T) => U): UniqByDef<T> =>
  (iterable: Iterable<T>): Iterable<T> =>
    new Terable(UNIQBY, {mapper: func, set: new Set()}, iterable);

export default uniqBy;
