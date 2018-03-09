/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {TAKE} from './Terable';

type TakeDef<T> = (Iterable<T>) => Iterable<T>;

const take = <T>(count: number): TakeDef<T> =>
  (iterable: Iterable<T>): Iterable<T> =>
    new Terable(TAKE, count, iterable);

export default take;
