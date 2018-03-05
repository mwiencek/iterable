/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {FILTERP} from './Terable';

type FilterPDef<T> = (Iterable<T>) => Iterable<$Subtype<T>>;

const filterP =
  <T: {+[string]: mixed}>(prop: $Keys<T>): FilterPDef<T> =>
    (iterable: Iterable<T>): Iterable<$Subtype<T>> =>
      new Terable(FILTERP, prop, iterable);

export default filterP;
