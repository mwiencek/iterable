/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import makeTerable, {UNIQ} from './Terable';

export default function uniq<T>(iterable: Iterable<T>): Iterator<T> {
  return makeTerable(UNIQ, {set: new Set()}, iterable);
}
