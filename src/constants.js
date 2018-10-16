/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export const DONE = Object.freeze({done: true, value: undefined});

export const EMPTY_ITERATOR = Object.freeze({
  [Symbol.iterator]: () => EMPTY_ITERATOR,
  next: () => DONE,
});

export const NO_VALUE = Symbol();

export const DROP = 3;
export const FILTER = 2;
export const MAP = 6;
export const TAKE = 1;
export const UNIQ = 7;
export const UNIQBY = 8;
