/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {REJECT} from './Terable';

type RejectDef<T> = (Iterable<T>) => Iterable<$Subtype<T>>;

const reject = <T>(test: (T) => mixed): RejectDef<T> =>
  (iterable: Iterable<T>): Iterable<$Subtype<T>> =>
    new Terable(REJECT, test, iterable);

export default reject;
