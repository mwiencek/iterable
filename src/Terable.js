/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import {DONE} from './constants';

export const CONCAT = 4;
export const CONCATMAP = 3;
export const DIFFERENCE = 1;
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
      case DIFFERENCE:
        arg.set = new Set(arg.target);
        break;
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
  let done;
  let frame = this.frame;

  if (!frame.iterator) {
    frame.iterator = frame.iterable[Symbol.iterator]();
    frame.iterable = null;
  }

  nextResult:
  while (!(done = (cursor = frame.iterator.next()).done) || stack.length) {
    if (done) {
      frame = (this.frame = stack.pop());
      continue;
    }

    let value = cursor.value;

    for (let step = frame.step; step < pipeLength; step++) {
      const action = pipe[pipeLength - step - 1];
      const {type, arg} = action;

      let test = true;
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

        case DIFFERENCE:
          if (!!arg.set.has(setKey) === test) {
            continue nextResult;
          }
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

    return {value: value, done: false};
  }

  return DONE;
};

export default Terable;
