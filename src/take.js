/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable from './Terable';

type TakeDef<T> = (Iterable<T>) => Iterable<T>;

function TakeIterable(count, source) {
  this.count = count;
  this.source = source;
}

TakeIterable.prototype[Symbol.iterator] = function () {
  return new TakeIterator(this);
};

function TakeIterator(parent) {
  this.parent = parent;
  this.source = null;
  this.taken = 0;
  this.done = false;
}

TakeIterator.prototype.next = function () {
  const parent = this.parent;

  if (this.done || this.taken === parent.count) {
    this.done = true;
    this.source = null;
    return {done: true};
  }

  let source = this.source;
  if (!source) {
    // $FlowFixMe - https://github.com/facebook/flow/issues/1163
    source = (this.source = parent.source[Symbol.iterator]());
  }

  let cursor;
  if (this.done = (cursor = source.next()).done) {
    source = (this.source = null);
  } else {
    this.taken++;
  }

  return cursor;
};

const take = <T>(count: number): TakeDef<T> =>
  (iterable: Iterable<T>): Iterable<T> =>
    (((new TakeIterable(count, iterable)): any): Iterable<T>);

export default take;
