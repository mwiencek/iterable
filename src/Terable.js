/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export const FILTER = 1;
export const FILTERP = 2;
export const FLATMAP = 3;
export const FLATTEN = 4;
export const MAP = 5;
export const MAPP = 6;
export const REJECT = 7;
export const REJECTP = 8;
export const UNIQ = 9;

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
    if (iterable.type === UNIQ) {
      iterable.arg.clear();
    }
    pipe.push(iterable);
    iterable = iterable.source;
  }

  this.pipe = pipe;
  this.stack = [];
  this.frame = {iterator: iterable[Symbol.iterator](), step: 0};
}

Iterator.prototype.next = function () {
  const stack = this.stack;
  const pipe = this.pipe;

  let cursor;
  let done;
  let frame = this.frame;

  nextResult:
  while (!(done = (cursor = frame.iterator.next()).done) || stack.length) {
    if (done) {
      frame = stack.pop();
      continue;
    }

    let value = cursor.value;

    for (let step = frame.step, count = pipe.length; step < count; step++) {
      const action = pipe[count - step - 1];

      switch (action.type) {
        case FILTER:
          if (!action.arg(value)) {
            continue nextResult;
          }
          break;

        case FILTERP:
          if (!value[action.arg]) {
            continue nextResult;
          }
          break;

        case FLATMAP:
          value = action.arg(value);
          step++;
          // Falls through to FLATTEN.

        case FLATTEN:
          if (value && typeof value === 'object' && value[Symbol.iterator]) {
            stack.push(frame);
            frame = {iterator: value[Symbol.iterator](), step: step};
            continue nextResult;
          }
          break;

        case MAP:
          value = action.arg(value);
          break;

        case MAPP:
          value = value[action.arg];
          break;

        case REJECT:
          if (action.arg(value)) {
            continue nextResult;
          }
          break;

        case REJECTP:
          if (value[action.arg]) {
            continue nextResult;
          }
          break;

        case UNIQ:
          const valueSet = action.arg;
          if (valueSet.has(value)) {
            continue nextResult;
          } else {
            valueSet.add(value);
          }
          break;
      }
    }

    this.frame = frame;

    return {value: value, done: false};
  }

  return {done: true};
};

export default Terable;
