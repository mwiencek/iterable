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
export const UNIQ = 7;
export const UNIQBY = 8;

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
    const {type, arg} = iterable;

    switch (type) {
      case UNIQ:
      case UNIQBY:
        arg.set.clear();
        break;
    }
    pipe.push(iterable);
    iterable = iterable.source;
  }

  this.pipe = pipe;
  this.stack = [];
  this.frame = {
    iterable: iterable,
    iterator: null,
    step: 0,
  };
}

Iterator.prototype.next = function () {
  const stack = this.stack;
  const pipe = this.pipe;
  const pipeLength = pipe.length;

  let cursor;
  let frame = this.frame;

  if (!frame.iterator) {
    frame.iterator = frame.iterable[Symbol.iterator]();
    frame.iterable = null;
  }

  // Reproduce Babel's for...of semantics.
  let _iteratorNormalCompletion = true;
  let _didIteratorError = false;
  let _iteratorError = undefined;

  try {
    nextResult:
    while ((_iteratorNormalCompletion = true) &&
            (!(_iteratorNormalCompletion = (cursor = frame.iterator.next()).done)
            || stack.length)) {
      if (_iteratorNormalCompletion) {
        frame = (this.frame = stack.pop());
        continue;
      }

      let value = cursor.value;

      for (let step = frame.step; step < pipeLength; step++) {
        const action = pipe[pipeLength - step - 1];
        const {type, arg} = action;

        let setKey = value;

        switch (type) {
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
            stack.push(frame);
            frame = (this.frame = {
              iterable: null,
              iterator: value[Symbol.iterator](),
              step: step + 1,
            });
            continue nextResult;

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

      _iteratorNormalCompletion = true;
      return {value: value, done: false};
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion) {
        this.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return DONE;
};

Iterator.prototype.return = function () {
  let iterator = this.frame.iterator;
  if (iterator.return) {
    iterator.return();
  }
  const stack = this.stack;
  for (let i = 0; i < stack.length; i++) {
    iterator = stack[i].iterator;
    if (iterator.return) {
      iterator.return();
    }
  }
  return {};
};

export default Terable;
