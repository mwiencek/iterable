/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {REJECTP} from './Terable';

type RejectPDef<T> = (Iterable<T>) => Iterable<$Subtype<T>>;

const rejectP = <T: {+[string]: mixed}>(prop: $Keys<T>): RejectPDef<T> =>
  (iterable: Iterable<T>): Iterable<$Subtype<T>> =>
    new Terable(REJECTP, prop, iterable);

export default rejectP;
