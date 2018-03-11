/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {TAKE} from './Terable';

type TakeDef<T> = (Iterable<T>) => Iterable<T>;

const take = <T>(count: number): TakeDef<T> =>
  (iterable: Iterable<T>): Iterable<T> =>
    ({
      [Symbol.iterator]: function () {
        let iterator;
        let taken = 0;
        let done = false;
        return {
          next: function () {
            if (done || taken === count) {
              done = true;
              iterator = null;
              return {done: true};
            }
            if (!iterator) {
              // $FlowFixMe - https://github.com/facebook/flow/issues/1163
              iterator = iterable[Symbol.iterator]();
            }
            let cursor;
            if (done = (cursor = iterator.next()).done) {
              iterator = null;
            } else {
              taken++;
            }
            return cursor;
          },
        };
      },
    });

export default take;
