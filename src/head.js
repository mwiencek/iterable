/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const head = <T>(iterable: Iterable<T>): T => {
  // $FlowFixMe - https://github.com/facebook/flow/issues/1163
  const cursor = (iterable[Symbol.iterator]()).next();
  if (cursor.done) {
    throw new Error('head: empty list');
  }
  return cursor.value;
};

export default head;
