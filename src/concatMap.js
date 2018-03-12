/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {CONCATMAP} from './Terable';

type ConcatMapDef<T, U> = (Iterable<T>) => Iterable<U>;

const concatMap = <T, U>(func: (T) => Iterable<U>): ConcatMapDef<T, U> =>
  (iterable: Iterable<T>): Iterable<U> =>
    new Terable(CONCATMAP, func, iterable);

export default concatMap;
