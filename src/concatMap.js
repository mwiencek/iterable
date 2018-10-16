/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {Concat} from './concat';
import type {Terable} from './types';

export default function concatMap<T, U>(func: (T) => Iterable<U>): (Iterable<T>) => Terable<U> {
  return function (iterable: Iterable<T>): Terable<U> {
    return (((new Concat<T, U>(iterable, func)): any): Terable<U>);
  }
}
