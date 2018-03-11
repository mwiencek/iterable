/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export const DIFFERENCE = 1;
export const FILTER = 2;
export const FLATMAP = 3;
export const FLATTEN = 4;
export const INTERSECTION = 5;
export const MAP = 6;
export const REJECT = 7;
export const UNIQ = 8;
export const UNIQBY = 9;

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
    switch (iterable.type) {
      case DIFFERENCE:
      case INTERSECTION:
        iterable.valueSet = new Set(iterable.arg);
        break;
      case UNIQ:
        iterable.arg.clear();
        break;
      case UNIQBY:
        iterable.arg[1].clear();
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
      frame = stack.pop();
      continue;
    }

    let value = cursor.value;

    for (let step = frame.step, count = pipe.length; step < count; step++) {
      const action = pipe[count - step - 1];
      const {type, arg} = action;

      let test = true;
      let setKey = value;
      let valueSet = arg;

      switch (type) {
        case FILTER:
          test = false;
        case REJECT:
          if (!!arg(value) === test) {
            continue nextResult;
          }
          break;

        case FLATMAP:
          value = arg(value);
          step++;
          // Falls through to FLATTEN.

        case FLATTEN:
          if (value && typeof value === 'object' && value[Symbol.iterator]) {
            stack.push(frame);
            frame = {
              iterable: null,
              iterator: value[Symbol.iterator](),
              step: step,
            };
            continue nextResult;
          }
          break;

        case INTERSECTION:
          test = false;
        case DIFFERENCE:
          if (!!action.valueSet.has(setKey) === test) {
            continue nextResult;
          }
          break;

        case MAP:
          value = arg(value);
          break;

        case UNIQBY:
          setKey = arg[0](value);
          valueSet = arg[1];
        case UNIQ:
          if (valueSet.has(setKey)) {
            continue nextResult;
          } else {
            valueSet.add(setKey);
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
