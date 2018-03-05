/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {MAPP} from './Terable';

type MapPDef<T, P> = (Iterable<T>) => Iterable<$ElementType<T, P>>;

const mapP = <T: {+[string]: mixed}, P: $Keys<T>>(prop: P): MapPDef<T, P> =>
  (iterable: Iterable<T>): Iterable<$ElementType<T, P>> =>
    new Terable(MAPP, prop, iterable);

export default mapP;
