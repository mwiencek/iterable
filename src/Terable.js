/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {DONE} from './constants';

export const CONCAT = 4;
export const CONCATMAP = 3;
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
 *   concat,    //   type: CONCAT
 *              //    arg: null
 *              // source: take(2)(concat(take(1)(iterable)))
 *
 *   take(2),   //   type: TAKE
 *              //    arg: 2
 *              // source: concat(take(1)(iterable))
 *
 *   concat,    //   type: CONCAT
 *              //    arg: null
 *              // source: take(1)(iterable)
 *
 *   take(1),   //   type: TAKE
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

  const stack = [{
    iterator: null,
    step: 0,
    take: Infinity,
  }];

  while (iterable instanceof Terable) {
    const arg = iterable.arg;

    switch (iterable.type) {
      case CONCAT:
      case CONCATMAP:
        stack.push({
          iterator: null,
          step: 0,
          take: Infinity,
        });
        break;
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
  this.pipe = pipe;
  this.stack = stack;
  this.level = 0;
}

Iterator.prototype.next = function () {
  // Reproduce Babel's for...of semantics.
  let iteratorNormalCompletion = true;
  let iteratorError = NO_VALUE;
  let didTakeMax;

  try {
    const pipe = this.pipe;
    const stack = this.stack;
    const pipeLength = pipe.length;

    let cursor;
    let frame = stack[this.level];

    if (this.source !== null) {
      frame.iterator = this.source[Symbol.iterator]();
      this.source = null;
    }

    nextResult:
    while ((iteratorNormalCompletion = true) &&
            !(didTakeMax = frame.take === 0) &&
            (!(iteratorNormalCompletion = (cursor = frame.iterator.next()).done) || this.level)) {
      if (iteratorNormalCompletion) {
        frame = stack[--this.level];
        continue;
      }

      let value = cursor.value;

      for (let step = frame.step; step < pipeLength; step++) {
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

          case CONCATMAP:
            value = arg(value);
            // Falls through to CONCAT.
          case CONCAT:
            frame = stack[++this.level];
            frame.iterator = value[Symbol.iterator]();
            frame.step = step + 1;
            continue nextResult;

          case TAKE:
            frame.take = Math.min(frame.take, arg);
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
      --frame.take;
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
  const stack = this.stack;
  for (let i = this.level; i >= 0; i--) {
    const iterator = stack[i].iterator;
    if (iterator.return) {
      iterator.return();
    }
  }
  return {};
};

export default Terable;
