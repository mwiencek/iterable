/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export type Terable<+T> = {
  @@iterator(): Terable<T>,
  next(): IteratorResult<T, void>,
  return(): {|+done: true, +value: void|},
};
