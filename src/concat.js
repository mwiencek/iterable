/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {CONCAT} from './Terable';

const concat = <T>(iterable: Iterable<Iterable<T>>): Iterable<T> =>
  new Terable(CONCAT, null, iterable);

export default concat;
