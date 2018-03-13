/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const toObject = entries => {
  const iterator = entries[Symbol.iterator]();
  const object = Object.create(null);
  let cursor;
  while (!(cursor = iterator.next()).done) {
    const [key, value] = cursor.value;
    object[key] = value;
  }
  return object;
};

export default toObject;
