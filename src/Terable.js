/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {DONE} from './constants';

export const FILTER = 2;
export const MAP = 6;
export const TAKE = 1;
export const UNIQ = 7;
export const UNIQBY = 8;

const NO_VALUE = Symbol();

const returnDone = () => DONE;

/*
 * Pipe example:
 *
 * compose(
 *   filter(x => x > 10),
 *              //   type: FILTER
 *              //    arg: x => x > 10
 *              // source: take(2)(map(x => x + 1)(take(1)(iterable)))
 *
 *   take(2),
 *              //   type: TAKE
 *              //    arg: 2
 *              // source: map(x => x + 1)(take(1)(iterable))
 *
 *   map(x => x + 1),
 *              //   type: MAP
 *              //    arg: x => x + 1
 *              // source: take(1)(iterable)
 *
 *   take(1),
 *              //   type: TAKE
 *              //    arg: 1
 *              // source: iterable
 * )(iterable);
 */

function Terable(type, arg, source) {
  this.type = type;
  this.arg = arg;
  this.source = source;
}

Terable.prototype[Symbol.iterator] = function () {
  return new Iterator(this);
};

function Iterator(iterable) {
  const pipe = [];

  while (iterable instanceof Terable) {
    const arg = iterable.arg;

    switch (iterable.type) {
      case TAKE:
        if (arg <= 0) {
          this.next = returnDone;
          return;
        }
        break;
      case UNIQ:
      case UNIQBY:
        arg.set.clear();
        break;
    }
    pipe.push(iterable);
    iterable = iterable.source;
  }

  this.source = iterable;
  this.iterator = null;
  this.pipe = pipe;
  this.step = 0;
  this.take = Infinity;
}

Iterator.prototype[Symbol.iterator] = function () {
  return this;
};

Iterator.prototype.next = function () {
  // Reproduce Babel's for...of semantics.
  let iteratorNormalCompletion = true;
  let iteratorError = NO_VALUE;
  let didTakeMax;

  try {
    const pipe = this.pipe;
    const pipeLength = pipe.length;

    let cursor;

    if (!this.iterator) {
      this.iterator = this.source[Symbol.iterator]();
      this.source = null;
    }

    nextResult:
    while ((iteratorNormalCompletion = true) &&
            !(didTakeMax = this.take === 0) &&
            (!(iteratorNormalCompletion = (cursor = this.iterator.next()).done))) {
      let value = cursor.value;

      for (let step = this.step; step < pipeLength; step++) {
        const iterable = pipe[pipeLength - step - 1];
        const arg = iterable.arg;

        let setKey = value;

        switch (iterable.type) {
          case MAP:
            value = arg(value);
            break;

          case FILTER:
            if (!arg(value)) {
              continue nextResult;
            }
            break;

          case TAKE:
            this.take = Math.min(this.take, arg);
            break;

          case UNIQBY:
            setKey = arg.mapper(value);
          case UNIQ:
            if (arg.set.has(setKey)) {
              continue nextResult;
            } else {
              arg.set.add(setKey);
            }
            break;
        }
      }

      iteratorNormalCompletion = true;
      --this.take;
      return {value: value, done: false};
    }
  } catch (err) {
    iteratorError = err;
  } finally {
    try {
      if (!iteratorNormalCompletion || didTakeMax) {
        this.return();
      }
    } finally {
      if (iteratorError !== NO_VALUE) {
        throw iteratorError;
      }
    }
  }

  return DONE;
};

Iterator.prototype.return = function () {
  const iterator = this.iterator;
  if (iterator.return) {
    iterator.return();
  }
  return {};
};

export default Terable;
