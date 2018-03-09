/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {DIFFERENCE} from './Terable';

type DifferenceDef<T> = (Iterable<T>) => Iterable<T>;

const difference = <T>(a: Iterable<T>): DifferenceDef<T> =>
  (b: Iterable<T>): Iterable<T> =>
    new Terable(DIFFERENCE, new Set(a), b);

export default difference;
