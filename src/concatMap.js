/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Concatable from './Concatable';
import type {IterableExt, Terable} from './types';

export default function concatMap<T, U>(func: (T) => IterableExt<U>): (IterableExt<T>) => Terable<U> {
  return function (iterable: IterableExt<T>): Terable<U> {
    return (new Concatable(iterable, func): Terable<U>);
  }
}
