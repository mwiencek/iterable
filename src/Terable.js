/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

export const DIFFERENCE = 1;
export const FILTER = 2;
export const FILTERP = 3;
export const FLATMAP = 4;
export const FLATTEN = 5;
export const INTERSECTION = 6;
export const MAP = 7;
export const MAPP = 8;
export const REJECT = 9;
export const REJECTP = 10;
export const TAKE = 11;
export const UNIQ = 12;
export const UNIQBY = 13;

function Terable(type, arg, source) {
  this.type = type;
  this.arg = arg;
  this.source = source;
}

Terable.prototype[Symbol.iterator] = function () {
  return new Iterator(this);
};

function Iterator(iterable) {
  this.count = 0;
  this.take = Infinity;

  const pipe = [];

  while (iterable instanceof Terable) {
    switch (iterable.type) {
      case DIFFERENCE:
      case INTERSECTION:
        iterable.valueSet = new Set(iterable.arg);
        break;
      case TAKE:
        this.take = Math.min(iterable.arg, this.take);
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
  this.frame = {iterator: iterable[Symbol.iterator](), step: 0};
}

Iterator.prototype.next = function () {
  const stack = this.stack;
  const pipe = this.pipe;

  let cursor;
  let done;
  let frame = this.frame;

  nextResult:
  while (
    this.count < this.take &&
    (!(done = (cursor = frame.iterator.next()).done) || stack.length)
  ) {
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

        case FILTERP:
          test = false;
        case REJECTP:
          if (!!value[arg] === test) {
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
            frame = {iterator: value[Symbol.iterator](), step: step};
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

        case MAPP:
          value = value[arg];
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
    this.count++;

    return {value: value, done: false};
  }

  return {done: true};
};

export default Terable;
