/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {FLATTEN} from './Terable';

type DeeplyNested<T> = Iterable<DeeplyNested<T> | T>;

const flatten = <T>(iterable: DeeplyNested<T>): Iterable<T> =>
  new Terable(FLATTEN, null, iterable);

export default flatten;
