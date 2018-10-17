/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Concatable from './Concatable';
import type {IterableExt, Terable} from './types';

export default function concat<T>(iterable: IterableExt<IterableExt<T>>): Terable<T> {
  return (new Concatable(iterable, null): Terable<T>);
}
