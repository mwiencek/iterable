/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {FLATMAP} from './Terable';

type Nested<T> = Iterable<Iterable<T> | T> | T;

type FlatMapDef<T, U> = (Iterable<T>) => Iterable<U>;

const flatMap = <T, U>(func: (T) => Nested<U>): FlatMapDef<T, U> =>
  (iterable: Iterable<T>): Iterable<U> =>
    new Terable(FLATMAP, func, iterable);

export default flatMap;
