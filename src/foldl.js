/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const makeFold = (func, initial) => iterable => {
  const iterator = iterable[Symbol.iterator]();
  let cursor;
  let accum = initial;
  while (!(cursor = iterator.next()).done) {
    accum = func(accum, cursor.value);
  }
  return accum;
};

const foldl = (func, ...args) => {
  if (args.length) {
    return makeFold(func, args[0]);
  }
  return initial => makeFold(func, initial);
};

export default foldl;
