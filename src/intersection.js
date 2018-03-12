/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {INTERSECTION} from './Terable';

type IntersectionDef<T> = (Iterable<T>) => Iterable<T>;

const intersection = <T>(a: Iterable<T>): IntersectionDef<T> =>
  (b: Iterable<T>): Iterable<T> =>
    new Terable(INTERSECTION, {target: a, set: null}, b);

export default intersection;
