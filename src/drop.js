/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {DONE} from './constants';
import Terable from './Terable';

type DropDef<T> = (Iterable<T>) => Iterable<T>;

function DropIterable(count, source) {
  this.count = count;
  this.source = source;
}

DropIterable.prototype[Symbol.iterator] = function () {
  return new DropIterator(this);
};

function DropIterator(parent) {
  this.parent = parent;
  this.source = null;
  this.dropped = 0;
  this.done = false;
}

DropIterator.prototype.next = function () {
  const parent = this.parent;

  if (this.done) {
    this.source = null;
    return DONE;
  }

  let source = this.source;
  if (!source) {
    // $FlowFixMe - https://github.com/facebook/flow/issues/1163
    source = (this.source = parent.source[Symbol.iterator]());
  }

  let cursor;
  while (!this.done) {
    this.done = (cursor = source.next()).done;

    if (this.dropped < parent.count) {
      this.dropped++;
    } else {
      break;
    }
  }

  return cursor;
};

const drop = <T>(count: number): DropDef<T> =>
  (iterable: Iterable<T>): Iterable<T> =>
    (((new DropIterable(count, iterable)): any): Iterable<T>);

export default drop;
