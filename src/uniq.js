/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {UNIQ} from './constants';
import makeTerable from './Terable';
import type {Terable} from './types';

export default function uniq<T>(iterable: Iterable<T>): Terable<T> {
  return makeTerable({type: UNIQ, arg: {set: new Set()}, source: iterable});
}
