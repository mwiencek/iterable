/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {DONE} from './constants';

export const DROP = 3;
export const FILTER = 2;
export const MAP = 6;
export const TAKE = 1;
export const UNIQ = 7;
export const UNIQBY = 8;

const NO_VALUE = Symbol();

const EMPTY_ITERATOR = Object.freeze({
  [Symbol.iterator]: () => EMPTY_ITERATOR,
  next: () => DONE,
});

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

export default function makeTerable(action) {
  if (action.type === TAKE && action.arg <= 0) {
    return EMPTY_ITERATOR;
  }

  const source = action.source;
  if (source instanceof Terable) {
    source.pipe.push(action);
    return source;
  }

  return new Terable(action);
}

function Terable(action) {
  this.pipe = [action];
  this.action = action;
  this.iterator = null;
  this.step = 0;
  this.done = false;
}

Terable.prototype[Symbol.iterator] = function () {
  return this;
};

Terable.prototype.next = function () {
  if (this.done) {
    return DONE;
  }

  // Reproduce Babel's for...of semantics.
  let iteratorNormalCompletion = true;
  let iteratorError = NO_VALUE;
  let didTakeMax;

  try {
    const pipe = this.pipe;
    const pipeLength = pipe.length;

    let cursor;

    if (!this.iterator) {
      this.iterator = this.action.source[Symbol.iterator]();
      this.action.source = null;
    }

    nextResult:
    while ((iteratorNormalCompletion = true) &&
            !didTakeMax &&
            (!(iteratorNormalCompletion = (cursor = this.iterator.next()).done))) {
      let value = cursor.value;

      for (let step = this.step; step < pipeLength; step++) {
        const action = pipe[step];
        const arg = action.arg;

        switch (action.type) {
          case MAP:
            value = arg(value);
            break;

          case FILTER:
            if (!arg(value)) {
              continue nextResult;
            }
            break;

          case TAKE:
            // Note: action.arg can't be <= 0, due to the check in makeTerable.
            didTakeMax = (--action.arg === 0) || didTakeMax;
            break;

          case DROP:
            if (arg > 0) {
              action.arg--;
              continue nextResult;
            }
            break;

          case UNIQ:
          case UNIQBY:
            let setKey = action.type === UNIQ ? value : arg.mapper(value);
            if (arg.set.has(setKey)) {
              continue nextResult;
            } else {
              arg.set.add(setKey);
            }
            break;
        }
      }

      iteratorNormalCompletion = true;
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

Terable.prototype.return = function () {
  if (!this.done) {
    this.done = true;
    const iterator = this.iterator;
    if (iterator && iterator.return) {
      iterator.return();
    }
  }
  return {};
};
