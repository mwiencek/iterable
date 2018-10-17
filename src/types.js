/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

/*::
import {DONE} from './constants';
*/

/*
 * The core Iterator type is re-implemented here as the $IteratorExt
 * object type, for two reasons:
 *  - The Iterator type is an interface, and those don't support
 *    indexer properties (needed for iterator[Symbol.iterator] to type
 *    check).
 *  - The Iterator type doesn't define a return() method.
 */
export type $IteratorExt<+Yield, +Return, -Next> = {
  @@iterator(): $IteratorExt<Yield, Return, Next>; // Only for compat. with $Iterator
  next(value?: Next): IteratorResult<Yield, Return>,
  +return?: <R>(value?: R) => IteratorResult<Yield, R | Return>,
};

export type $AsyncIteratorExt<+Yield, +Return, -Next> = {
  @@asyncIterator(): $AsyncIteratorExt<Yield, Return, Next>; // Only for compat. with $AsyncIterator
  next(value?: Next): Promise<IteratorResult<Yield, Return>>,
  +return?: <R>(value?: R) => Promise<IteratorResult<Yield, R | Return>>,
};

export type IteratorExt<+Yield> = $IteratorExt<Yield, any, any>;

export type AsyncIteratorExt<+Yield> = $AsyncIteratorExt<Yield, any, any>;

/*
 * $IterableExt has to stay an interface, because an object type would
 * be incompatible with iterables like arrays and strings.
 * Unfortunately, this means iterable[Symbol.iterator] won't
 * type-check.
 */
export interface $IterableExt<+Yield, +Return, -Next> {
  @@iterator(): $IteratorExt<Yield, Return, Next>;
};

export interface $AsyncIterableExt<+Yield, +Return, -Next> {
  @@asyncIterator(): $AsyncIteratorExt<Yield, Return, Next>;
};

export type IterableExt<+Yield> = $IterableExt<Yield, any, any>;

export type AsyncIterableExt<+Yield> = $AsyncIterableExt<Yield, any, any>;

export type Terable<+T> = {
  @@iterator(): Terable<T>,
  next(): IteratorResult<T, void>,
  return(): typeof DONE,
};

export type AsyncTerable<+T> = {
  @@asyncIterator(): AsyncTerable<T>,
  next(): Promise<IteratorResult<T, void>>,
  return(): Promise<typeof DONE>,
};

/*::
// Test with Flow interfaces

const asyncIterator = {
  '@@asyncIterator': function () {
    return this;
  },
  next: function () {
    return {value: '', done: false};
  },
  return: function () {
    return DONE;
  },
};

('': IterableExt<string>);

((['']: Iterable<string>): IterableExt<string>);
((['']: IterableExt<string>): Iterable<string>);

((asyncIterator: AsyncIterable<string>): AsyncIterableExt<string>);
((asyncIterator: AsyncIterableExt<string>): AsyncIterable<string>);

((['']: Iterable<string>): $IterableExt<string, void, void>);
((['']: $IterableExt<string, void, void>): Iterable<string>);

((asyncIterator: AsyncIterable<string>): $AsyncIterableExt<string, void, void>);
((asyncIterator: $AsyncIterableExt<string, void, void>): AsyncIterable<string>);

// Test with generators

function* gen(): Generator<number, string, ?{y: number}> {
  const x = yield 1;
  if (x) {
    yield x.y;
  }
  return '';
}

(gen(): $IterableExt<number, string, ?{y: number}>);

var g2 = (gen(): $IteratorExt<number, string, ?{y: number}>);

g2.next();

const r1 = g2.next({y: 2});
if (r1.done) {
  (r1.value: string | void);
} else {
  (r1.value: number);
}

if (g2.return) {
  g2.return();
}

if (g2.return) {
  g2.return('');
}

// Test with async generators

async function* asyncGen(): AsyncGenerator<number, string, ?{y: number}> {
  const x = yield 1;
  if (x) {
    yield x.y;
  }
  return '';
}

async function testag2() {
  (asyncGen(): $AsyncIterableExt<number, string, ?{y: number}>);

  var ag2 = (asyncGen(): $AsyncIteratorExt<number, string, ?{y: number}>);

  await ag2.next();

  const ar1 = await ag2.next({y: 2});
  if (ar1.done) {
    (ar1.value: string | void);
  } else {
    (ar1.value: number);
  }

  if (ag2.return) {
    await ag2.return();
  }

  if (ag2.return) {
    await ag2.return('');
  }
}

*/
