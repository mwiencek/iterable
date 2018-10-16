/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {DONE, NO_VALUE} from './constants';

export function Concat<T, U>(
  source: Iterable<T>,
  mapper: (T => Iterable<U>) | null,
) {
  this.source = source;
  this.mapper = mapper;
  this.sourceIterator = null;
  this.iterator = null;
  this.iteratorIsNested = false;
  this.done = false;
}

Concat.prototype[Symbol.iterator] = function () {
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
      this.sourceIterator = this.source[Symbol.iterator]();
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
          return {value: (cursor: any).value, done: false};
        }
      } else {
        let value = (cursor: any).value;
        const mapper = this.mapper;
        value = mapper ? mapper(value) : value;
        this.iterator = value[Symbol.iterator]();
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

export default function concat<T>(iterable: Iterable<Iterable<T>>): Iterable<T> {
  return (((new Concat<Iterable<T>, empty>(iterable, null)): any): Iterable<T>);
}
