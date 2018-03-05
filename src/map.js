/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {MAP} from './Terable';

type MapDef<T, U> = (Iterable<T>) => Iterable<U>;

const map = <T, U>(func: (T) => U): MapDef<T, U> =>
  (iterable: Iterable<T>): Iterable<U> =>
    new Terable(MAP, func, iterable);

export default map;
