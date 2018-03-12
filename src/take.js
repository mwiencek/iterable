/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {DONE} from './constants';
import Terable from './Terable';

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
    return DONE;
  }

  let source = this.source;
  if (!source) {
    source = (this.source = parent.source[Symbol.iterator]());
  }

  let cursor;
  if (this.done = (cursor = source.next()).done) {
    this.source = null;
  } else {
    this.taken++;
  }

  return cursor;
};

const take = count => iterable => new TakeIterable(count, iterable);

export default take;
