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
import {Terable} from './Terable';

const PROMISE_DONE = Promise.resolve(DONE);

function handleNext(cursor) {
  if (cursor.done) {
    this._destroy();
    return PROMISE_DONE;
  }
  const value = this.pipeValue(cursor.value);
  if (value === NO_VALUE) {
    return getNext();
  }
  return {value: value, done: false};
}

function handleError(err) {
  const rejection = Promise.reject(err);
  const reject = () => rejection;
  try {
    return this.return().then(reject, reject);
  } catch (err2) {
    return rejection;
  }
}

export function AsyncTerable(action) {
  Terable.call(this, action);

  this._handleNext = handleNext.bind(this);
  this._handleError = handleError.bind(this);
}

AsyncTerable.prototype = Object.assign({}, Terable.prototype);

AsyncTerable.prototype[Symbol.asyncIterator] = function () {
  return this;
};

delete AsyncTerable.prototype[Symbol.iterator];

AsyncTerable.prototype.next = function ()  {
  if (this.done) {
    return PROMISE_DONE;
  }

  try {
    if (!this.iterator) {
      const head = this.pipe[0];
      this.iterator = head.source[Symbol.asyncIterator]();
      head.source = null;
    }

    return this.iterator.next().then(
      this._handleNext,
      this._handleError,
    );
  } catch (err) {
    return this._handleError(err);
  }
};

AsyncTerable.prototype.return = function () {
  const iterator = this.iterator;
  this._destroy();
  if (iterator && iterator.return) {
    return iterator.return();
  }
  return PROMISE_DONE;
};

export default function makeAsyncTerable(action) {
  const source = action.source;
  if (source instanceof AsyncTerable) {
    source.pipe.push(action);
    return source;
  }

  return new AsyncTerable(action);
}
