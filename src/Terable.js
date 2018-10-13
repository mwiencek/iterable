/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {
  DONE,
  NO_VALUE,
  DROP,
  FILTER,
  MAP,
  TAKE,
  UNIQ,
  UNIQBY,
} from './constants';

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

export function Terable(action) {
  this.pipe = [action];
  this.iterator = null;
  this.done = false;
}

Terable.prototype[Symbol.iterator] = function () {
  return this;
};

Terable.prototype.pipeValue = function (value) {
  const pipe = this.pipe;
  const pipeLength = pipe.length;

  for (let step = 0; step < pipeLength; step++) {
    const action = pipe[step];
    const arg = action.arg;

    switch (action.type) {
      case MAP:
        value = arg(value);
        break;

      case FILTER:
        if (!arg(value)) {
          return NO_VALUE;
        }
        break;

      case TAKE:
        this.done = (--action.arg === 0) || this.done;
        break;

      case DROP:
        if (arg > 0) {
          action.arg--;
          return NO_VALUE;
        }
        break;

      case UNIQ:
      case UNIQBY:
        const setKey = action.type === UNIQ ? value : arg.mapper(value);
        if (arg.set.has(setKey)) {
          return NO_VALUE;
        } else {
          arg.set.add(setKey);
        }
        break;
    }
  }

  return value;
};

// Modifications to the functions `next`, `return`, or `makeTerable`
// below should also be carried over to AsyncTerable.js!

Terable.prototype.next = function () {
  if (this.done) {
    return DONE;
  }

  // Reproduce Babel's for...of semantics.
  let iteratorNormalCompletion = true;
  let iteratorError = NO_VALUE;

  try {
    if (!this.iterator) {
      const head = this.pipe[0];
      this.iterator = head.source[Symbol.iterator]();
      head.source = null;
    }

    let cursor;
    while ((iteratorNormalCompletion = true) &&
            !this.done &&
            (!(iteratorNormalCompletion = (cursor = this.iterator.next()).done))) {
      const value = this.pipeValue(cursor.value);
      if (value === NO_VALUE) {
        continue;
      }
      iteratorNormalCompletion = true;
      return {value: value, done: false};
    }
  } catch (err) {
    iteratorError = err;
  } finally {
    try {
      if (!iteratorNormalCompletion || this.done) {
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

Terable.prototype._destroy = function () {
  this.pipe = null;
  this.done = true;
  this.iterator = null;
};

Terable.prototype.return = function () {
  const iterator = this.iterator;
  this._destroy();
  if (iterator && iterator.return) {
    iterator.return();
  }
  return {};
};

export default function makeTerable(action) {
  const source = action.source;
  if (source instanceof Terable) {
    source.pipe.push(action);
    return source;
  }

  return new Terable(action);
}
