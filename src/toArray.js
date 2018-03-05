/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const toArray = <T>(iterable: Iterable<T>): Array<T> => {
  // $FlowFixMe - https://github.com/facebook/flow/issues/1163
  const iterator = iterable[Symbol.iterator]();
  const array = [];
  let cursor;
  while (!(cursor = iterator.next()).done) {
    array.push(cursor.value);
  }
  return array;
};

export default toArray;
