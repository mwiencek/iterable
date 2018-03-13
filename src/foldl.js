/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const makeFold = (func, accum) => iterable => {
  const iterator = iterable[Symbol.iterator]();
  let cursor;
  while (!(cursor = iterator.next()).done) {
    accum = func(accum, cursor.value);
  }
  return accum;
};

const foldl = (func, ...args) => {
  if (args.length) {
    return makeFold(func, args[0]);
  }
  return accum => makeFold(func, accum);
};

export default foldl;
