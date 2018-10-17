/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {
  DONE,
  NO_VALUE,
  SYMBOL_ITERATOR,
} from './constants';

export default function Concat(source, mapper) {
  this.source = source;
  this.mapper = mapper;
  this.sourceIterator = null;
  this.iterator = null;
  this.iteratorIsNested = false;
  this.done = false;
}

Concat.prototype[SYMBOL_ITERATOR] = function () {
  return this;
};

Concat.prototype.next = function () {
  if (this.done) {
    return DONE;
  }

  // Reproduce Babel's for...of semantics.
  let iteratorNormalCompletion = true;
  let iteratorError = NO_VALUE;

  try {
    if (!this.sourceIterator) {
      this.sourceIterator = this.source[SYMBOL_ITERATOR]();
      this.iterator = this.sourceIterator;
      this.source = null;
    }

    let cursor;
    while (!(iteratorNormalCompletion = (cursor = this.iterator.next()).done) || this.iteratorIsNested) {
      if (this.iteratorIsNested) {
        if (iteratorNormalCompletion) {
          this.iterator = this.sourceIterator;
          this.iteratorIsNested = false;
        } else {
          iteratorNormalCompletion = true;
          return {value: cursor.value, done: false};
        }
      } else {
        let value = cursor.value;
        const mapper = this.mapper;
        value = mapper ? mapper(value) : value;
        this.iterator = value[SYMBOL_ITERATOR]();
        this.iteratorIsNested = true;
      }
    }
  } catch (err) {
    iteratorError = err;
  } finally {
    try {
      if (!iteratorNormalCompletion) {
        this.return();
      }
    } finally {
      if (iteratorError !== NO_VALUE) {
        this._destroy();
        throw iteratorError;
      }
    }
  }

  this._destroy();
  return DONE;
};

Concat.prototype._destroy = function () {
  this.source = null;
  this.sourceIterator = null;
  this.iterator = null;
  this.done = true;
};

Concat.prototype.return = function () {
  const sourceIterator = this.sourceIterator;
  const iterator = this.iterator;

  this._destroy();

  if (sourceIterator && sourceIterator.return) {
    sourceIterator.return();
  }

  if (this.iteratorIsNested) {
    if (iterator && iterator.return) {
      iterator.return();
    }
  }

  return DONE;
};
